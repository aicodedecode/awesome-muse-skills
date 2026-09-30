#!/usr/bin/env python3
"""Fetch static pages and extract clean article text with Trafilatura.

Free, local, zero-credit alternative to Firecrawl for pages that don't
need JavaScript rendering. Fetches with urllib (proxy-aware on this VM)
and strips boilerplate (nav, footer, ads) via Trafilatura.

Usage:
  scrape.py URL [URL ...] [--out FILE] [--meta]

Output: JSON list of {url, title, text, char_count} on stdout or --out.
Exit non-zero if ALL urls fail.
"""
import argparse
import json
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

import trafilatura

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")


def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=timeout).read().decode("utf-8", "replace")


def scrape_one(url):
    try:
        html = fetch(url)
        text = trafilatura.extract(html, include_comments=False, include_tables=True) or ""
        title = ""
        try:
            from trafilatura.metadata import extract_metadata
            meta = extract_metadata(html)
            title = (meta.title or "") if meta else ""
        except Exception:
            pass
        return {"url": url, "title": title, "text": text,
                "char_count": len(text), "ok": bool(text)}
    except Exception as e:
        return {"url": url, "ok": False, "error": f"{type(e).__name__}: {e}"}


def main():
    p = argparse.ArgumentParser(description="Free local page-text extraction")
    p.add_argument("urls", nargs="+")
    p.add_argument("--out", help="write JSON here instead of stdout")
    p.add_argument("--workers", type=int, default=8)
    args = p.parse_args()

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        results = list(ex.map(scrape_one, args.urls))

    payload = json.dumps(results, indent=2, ensure_ascii=False)
    if args.out:
        with open(args.out, "w") as f:
            f.write(payload)
        ok = sum(1 for r in results if r["ok"])
        print(f"Wrote {args.out}: {ok}/{len(results)} pages extracted")
    else:
        print(payload)
    sys.exit(0 if any(r["ok"] for r in results) else 1)


if __name__ == "__main__":
    main()
