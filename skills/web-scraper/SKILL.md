---
name: web-scraper
description: Ethical web scraping — selectors, pagination, robots.txt, and rate limits — use when extracting data from websites responsibly.
category: web-data
---

## Overview

Web scraping extracts data from websites programmatically — for research,
monitoring, aggregation, or migration. Done responsibly, it's a legitimate
technique; done carelessly, it's a Terms-of-Service violation or a denial-
of-service attack. This skill covers the technical craft and the ethical/
legal boundaries together.

## When to use

- Extracting structured data from websites (prices, listings, articles)
- Choosing between HTTP scraping and headless browsers
- Handling pagination, infinite scroll, and JavaScript-rendered content
- Respecting robots.txt, rate limits, and terms of service
- Building maintainable scrapers that survive site changes

## Core concepts

**Check permission first.** Read `robots.txt` and the site's Terms of
Service before scraping. Prefer official APIs when they exist — they're
faster, stabler, and explicitly permitted. Some sites prohibit scraping
entirely; "it's technically possible" is not permission. When in doubt,
ask the site owner.

**Be a polite guest.** Rate-limit requests (1–2/sec is a common courtesy
baseline, slower for small sites), identify yourself with a real User-Agent
including contact info, scrape during off-peak hours for heavy jobs, and
cache aggressively to avoid re-fetching. Your scraper should be
indistinguishable from light human traffic.

**HTTP first, browser when needed.** Static/server-rendered pages: plain
HTTP requests + HTML parsing (fast, cheap, polite). JavaScript-rendered
content: headless browser (Playwright/Puppeteer — see those skills), which
is 10–100x heavier — use only when necessary, and prefer waiting for
specific elements over arbitrary sleeps.

**Selectors: resilient over clever.** Prefer semantic anchors (data
attributes, ARIA roles, stable class names) over brittle positional XPaths
(`div[3]/span[2]` breaks on the next redesign). Build a validation layer
that fails loudly when expected elements vanish — silent schema drift is
how scrapers produce garbage for weeks.

**Pagination and state.** Handle numbered pages, "load more" buttons, and
infinite scroll (scroll → wait → extract → repeat until no new content).
Track progress (persist visited URLs/page cursors) so interrupted runs
resume instead of restarting — re-scraping from zero hammers the site.

## Practical workflow

1. **Assess:** API available? robots.txt allows? ToS permits? If any answer
   is no, stop or get permission — document the decision.
2. **Prototype the extraction** on a few pages: fetch, parse, map fields;
   verify against the rendered page (what you see is what you should get).
3. **Build resilient selectors** anchored on stable attributes; add
   assertions per field (present? right type? sane range?) that fail the
   run loudly on site changes.
4. **Implement politeness:** rate limiting with jitter, retries with
   exponential backoff on 429/5xx (and back off harder when asked),
   request caching, and off-peak scheduling for large crawls.
5. **Handle sessions properly:** respect login requirements (use your own
   credentials, never circumvent access controls), rotate nothing
   deceptive, and never scrape personal data beyond what's clearly public
   and permitted.
6. **Monitor and maintain:** alert on extraction failures and schema
   changes; version your parsers; keep a changelog of site-structure
   adaptations.

## Common pitfalls

- **Ignoring robots.txt/ToS** — the fastest path to IP bans, legal letters,
  and being blocked by the entire industry's abuse systems.
- **Hammering the site** — concurrent requests at full speed is a DoS;
  rate-limit always, back off on 429s.
- **Brittle selectors** — positional XPaths that break weekly; anchor on
  semantics and validate output.
- **Scraping personal data** — names, emails, photos of private individuals
  carry privacy obligations (GDPR and similar); minimize collection and
  have a lawful basis.
- **Circumventing access controls** — bypassing logins, paywalls, or
  anti-bot measures crosses from scraping into unauthorized access; don't.
- **No change detection** — the site redesigns, your scraper silently
  extracts wrong data for a month; validate every run.
