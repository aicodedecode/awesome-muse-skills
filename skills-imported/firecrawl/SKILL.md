---
name: firecrawl
description: Scrape any web page to clean markdown, search the web with content extraction, map a site's URLs, crawl whole sites, and pull structured data from pages with an LLM. Use this skill whenever the user wants content from a website that plain fetch can't handle — JavaScript-heavy pages, anti-bot protected sites, bulk page extraction, site crawls, or turning pages into LLM-ready markdown. Also use when the user says "firecrawl", "scrape this site", "crawl", or needs web content for research, RAG, monitoring, or competitive analysis.
---

# Firecrawl

Firecrawl (firecrawl.dev) turns websites into LLM-ready markdown or structured data. It handles JavaScript rendering, anti-bot protection, proxy rotation, and site-wide crawling — the cases where a plain HTTP fetch returns junk or gets blocked.

## Auth

Goes through the Secure Vault `custom.firecrawl` connector via the authd surrogate exchange. `scripts/firecrawl.py` fetches a short-lived surrogate (`authdc cred surrogate custom.firecrawl`) and sends it as a Bearer header; authd swaps it for the real API key at egress. The real key is never exposed. **Never print or log the surrogate token.**

Requires the `custom.firecrawl` connector credential and the `authdc` CLI on PATH. If the API returns 401/403, the credential is missing, expired, or invalid — ask the user to reconnect via the Secure Vault card rather than retrying blindly. A 402 means the Firecrawl account is out of credits.

## CLI usage

```bash
# One page -> markdown (main content only, no nav/footer/ads)
python3 ~/workspace/skills/firecrawl/scripts/firecrawl.py scrape https://example.com/article --main-content --out /tmp/page.json

# More formats: markdown, html, links, screenshot (comma-separated)
python3 ~/workspace/skills/firecrawl/scripts/firecrawl.py scrape https://example.com --formats markdown,links

# Web search with full content extraction
python3 ~/workspace/skills/firecrawl/scripts/firecrawl.py search "Muse AI connectors launch" --limit 5 --out /tmp/search.json

# Discover all URLs on a site
python3 ~/workspace/skills/firecrawl/scripts/firecrawl.py map https://docs.example.com --limit 50 --out /tmp/urls.json

# Crawl a site (async job); --poll waits for completion
python3 ~/workspace/skills/firecrawl/scripts/firecrawl.py crawl https://example.com/blog --limit 25 --poll --out /tmp/crawl.json

# LLM structured extraction across pages, with optional JSON schema
python3 ~/workspace/skills/firecrawl/scripts/firecrawl.py extract https://example.com/pricing https://competitor.com/pricing \
  --prompt "Extract plan names, monthly prices, and feature lists" --out /tmp/prices.json
```

Output is JSON. For `scrape`, the markdown lives at `data.markdown`; metadata (title, description, OG tags, status) at `data.metadata`; discovered links at `data.links`.

## Cost notes

- The user is on Firecrawl's LIMITED FREE TIER — use it only when genuinely required, never as the default.
- Default to free methods first: plain `browser.open`/curl for static pages, the browser "Show transcript" panel flow for YouTube transcripts.
- Reach for Firecrawl only when those fail: JavaScript-heavy pages, anti-bot protected sites, bulk page extraction, site crawls, or LLM-structured extraction across many pages.
- Scrape/map: ~1 credit per page. Search: ~2 credits per 10 results. Extract/crawl: billed per page processed.
- Request only the formats you need — extra formats slow the call.
- `onlyMainContent` (`--main-content`) gives cleaner LLM input for articles and docs.
- For large crawls, keep `--limit` tight and spot-check with `scrape` first.

## When NOT to use

- The page is static and public — plain `browser.open` or curl is faster and free.
- YouTube transcripts — use the browser "Show transcript" panel flow (yt-dlp is bot-blocked from this VM).
- Anything requiring the user's logged-in session — Firecrawl scrapes as its own browser, not as the user.
