---
name: local-scrape
description: Extract clean article text from web pages for free with Trafilatura — no API credits, no browser needed. Use this skill whenever the user wants page content and the page is static (articles, docs, blogs, news). Always try this BEFORE Firecrawl: it is the default scraping path on the user's limited free tier. Also use when the user says "scrape", "extract article text", or needs bulk text extraction for research or RAG.
---

# Local Scrape (free, zero-credit)

Trafilatura-based article extraction running locally in `~/workspace/.venvs/scrape`. Fetches with urllib (proxy-aware on this VM) and strips boilerplate — nav, footers, ads, cookie banners — leaving clean article text. Verified 2026-09-30: 7,415 clean chars from a JS-free news article.

## The scraping decision tree (credit-saving order)

1. **Static page → this skill** (free). Articles, docs, blogs, most news.
1b. **Fetch blocked or page needs light JS → Jina Reader** (free, no key, no install): `curl -sL "https://r.jina.ai/<url>"` returns clean Markdown with title + published time. Verified working from this VM 2026-09-30. Try this before the browser tools for single pages — it's one HTTP call. (Idea salvaged from evaluating Panniantong/agent-reach, which was declined: its other backends duplicate working capabilities or need desktop login-state absent here.)
2. **JavaScript-heavy or interactive → browser tools** (`browser.open`, `browser.spawn_task`). Still free. Do NOT script Playwright/Chromium from exec — the runtime routes browser work through the browser tools.
3. **Anti-bot blocked, or bulk structured extraction where 1+2 fail → Firecrawl** (costs credits, last resort — see the `firecrawl` skill). The user is on a limited free tier.

## Usage

```bash
# Single page -> JSON on stdout
~/workspace/.venvs/scrape/bin/python ~/workspace/skills/local-scrape/scripts/scrape.py https://example.com/article

# Many pages in parallel -> file
~/workspace/.venvs/scrape/bin/python ~/workspace/skills/local-scrape/scripts/scrape.py \
  $(cat urls.txt) --out /tmp/pages.json --workers 8
```

Output per URL: `{url, title, text, char_count, ok}`. `ok: false` with an `error` string when the fetch fails or the page needs JavaScript.

## Notes

- Trafilatura returns plain text (not markdown). Tables are preserved via `include_tables`.
- If `ok` is false for a page that visibly has content, the page likely needs JavaScript — escalate to the browser tools, not Firecrawl, first.
- `crawl4ai` is also installed in the venv, but driving a browser from exec is restricted in this environment — treat it as unavailable and use the browser tools for rendered pages.
- Keep the venv at `~/workspace/.venvs/scrape`; system pip is blocked (PEP 668), never `pip install` outside a venv.
