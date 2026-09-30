#!/usr/bin/env python3
"""Thin CLI over the Firecrawl v2 API via the Secure Vault connector.

Auth goes through the authd surrogate exchange: this script fetches a
short-lived *surrogate* token (never the real API key) via
`authdc cred surrogate custom.firecrawl` and sends it as a Bearer header;
authd swaps it for the real credential at egress.

Never print or log the surrogate token.

Usage:
  firecrawl.py scrape URL [--formats markdown,links] [--main-content] [--out FILE]
  firecrawl.py search QUERY [--limit 5] [--out FILE]
  firecrawl.py map URL [--limit 50] [--out FILE]
  firecrawl.py crawl URL [--limit 25] [--poll] [--out FILE]
  firecrawl.py extract URLS... --prompt "..." [--schema FILE] [--out FILE]

Output is JSON on stdout (or written to --out).
"""
import argparse
import json
import subprocess
import sys
import time
import urllib.request

API = "https://api.firecrawl.dev"


def get_surrogate_token():
    out = subprocess.run(
        ["authdc", "cred", "surrogate", "custom.firecrawl"],
        capture_output=True, text=True, check=True,
    ).stdout
    creds = json.loads(out)["credentials"]
    if not creds:
        sys.exit("No custom.firecrawl credential found. Connect it via the Secure Vault first.")
    return creds[0]["surrogate"]


def api_post(path, payload, timeout=120):
    token = get_surrogate_token()
    body = json.dumps(payload).encode()
    req = urllib.request.Request(API + path, data=body, method="POST")
    req.add_header("Authorization", "Bearer " + token)
    req.add_header("Content-Type", "application/json")
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return json.load(resp)
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:500]
        if e.code in (401, 403):
            sys.exit(f"Firecrawl API {e.code}: credential missing, expired, or invalid. {detail}")
        if e.code == 402:
            sys.exit(f"Firecrawl API 402: out of credits. {detail}")
        sys.exit(f"Firecrawl API {e.code}: {detail}")


def emit(data, out):
    text = json.dumps(data, indent=2, ensure_ascii=False)
    if out:
        with open(out, "w") as f:
            f.write(text)
        print(f"Wrote {out} ({len(text)} chars)")
    else:
        print(text)


def cmd_scrape(args):
    payload = {
        "url": args.url,
        "formats": args.formats.split(","),
        "onlyMainContent": args.main_content,
    }
    emit(api_post("/v2/scrape", payload), args.out)


def cmd_search(args):
    payload = {"query": args.query, "limit": args.limit}
    emit(api_post("/v2/search", payload), args.out)


def cmd_map(args):
    payload = {"url": args.url, "limit": args.limit}
    emit(api_post("/v2/map", payload), args.out)


def cmd_crawl(args):
    payload = {"url": args.url, "limit": args.limit}
    data = api_post("/v2/crawl", payload)
    job_id = (data.get("data") or {}).get("id") or data.get("id")
    if not args.poll or not job_id:
        emit(data, args.out)
        return
    # Poll until the crawl completes (v2: GET /v2/crawl/<id>)
    token = get_surrogate_token()
    for _ in range(60):
        time.sleep(10)
        req = urllib.request.Request(f"{API}/v2/crawl/{job_id}", method="GET")
        req.add_header("Authorization", "Bearer " + token)
        try:
            status = json.load(urllib.request.urlopen(req, timeout=60))
        except Exception as e:
            print(f"poll error: {e}", file=sys.stderr)
            continue
        state = (status.get("data") or {}).get("status") or status.get("status")
        print(f"crawl {job_id}: {state}", file=sys.stderr)
        if state in ("completed", "failed", "cancelled"):
            emit(status, args.out)
            return
    sys.exit(f"Crawl {job_id} still running after 10 minutes; re-run with --poll later.")


def cmd_extract(args):
    payload = {"urls": args.urls, "prompt": args.prompt}
    if args.schema:
        with open(args.schema) as f:
            payload["schema"] = json.load(f)
    emit(api_post("/v2/extract", payload, timeout=300), args.out)


def main():
    p = argparse.ArgumentParser(description="Firecrawl v2 API via Secure Vault")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("scrape", help="Scrape one page to markdown/HTML/etc.")
    s.add_argument("url")
    s.add_argument("--formats", default="markdown", help="comma-separated: markdown,html,links,screenshot")
    s.add_argument("--main-content", action="store_true", help="strip nav/footer/ads")
    s.add_argument("--out")

    s = sub.add_parser("search", help="Web search with content extraction")
    s.add_argument("query")
    s.add_argument("--limit", type=int, default=5)
    s.add_argument("--out")

    s = sub.add_parser("map", help="Discover URLs on a site")
    s.add_argument("url")
    s.add_argument("--limit", type=int, default=50)
    s.add_argument("--out")

    s = sub.add_parser("crawl", help="Crawl a site (async job)")
    s.add_argument("url")
    s.add_argument("--limit", type=int, default=25)
    s.add_argument("--poll", action="store_true", help="wait for completion")
    s.add_argument("--out")

    s = sub.add_parser("extract", help="LLM structured extraction from URLs")
    s.add_argument("urls", nargs="+")
    s.add_argument("--prompt", required=True)
    s.add_argument("--schema", help="JSON schema file for structured output")
    s.add_argument("--out")

    args = p.parse_args()
    {"scrape": cmd_scrape, "search": cmd_search, "map": cmd_map,
     "crawl": cmd_crawl, "extract": cmd_extract}[args.cmd](args)


if __name__ == "__main__":
    main()
