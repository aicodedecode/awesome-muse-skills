---
name: puppeteer-pro
description: Browser automation with Puppeteer — Chrome DevTools Protocol control, scraping, and PDF generation — use for scripted Chrome workflows.
category: web-data
---

## Overview

Puppeteer drives Chrome/Chromium via the DevTools Protocol with fine-grained
control: network interception, performance tracing, PDF generation, and
precise page lifecycle management. It's the veteran of Node.js browser
automation — ideal for scraping JS-heavy sites, generating PDFs, and
scripted workflows where Chrome-specific behavior is what you want.

## When to use

- Scraping JavaScript-rendered websites at scale
- Generating PDFs or screenshots from HTML programmatically
- Automating Chrome-specific workflows (extensions, DevTools features)
- Intercepting and modifying network traffic in automation
- Measuring page performance (tracing, coverage, metrics)

## Core concepts

**The DevTools Protocol is the superpower.** Puppeteer exposes CDP directly:
intercept requests, emulate devices/network conditions, capture performance
traces, and control targets at a low level. When the high-level API isn't
enough, CDP sessions (`page.createCDPSession()`) unlock the rest.

**Wait for conditions, not time.** `waitForSelector`, `waitForNetworkIdle`,
`waitForFunction` (custom page predicates) — the same discipline as any
browser automation: fixed sleeps are flaky and slow. For SPAs, waiting on a
specific element or a JS condition beats network-idle heuristics.

**Request interception for speed and control.** Block resource types you
don't need (images, fonts, media) to make scraping 3–5x faster; mock or
rewrite API responses; capture the underlying XHRs directly (often cleaner
than scraping DOM — the page's own API returns structured JSON).

**Headless modes matter.** New headless mode behaves like headed Chrome
(fewer detection differences); old headless is lighter but more
distinguishable. Choose per use case, and for anti-bot-sensitive targets
consider headed/`headless: 'shell'` trade-offs plus realistic fingerprints
— while respecting the target site's terms (see web-scraper).

**Resource hygiene at scale.** Each page/tab costs memory; reuse browser
instances across pages, close pages aggressively, and restart browsers
periodically in long scrapes (memory leaks accumulate). Concurrency via
multiple pages per browser, bounded by available RAM.

## Practical workflow

1. **Launch deliberately:** headless mode choice, args for containers
   (`--no-sandbox` where appropriate — understand the security trade-off),
   viewport/user-agent, and request-interception rules (block heavy assets).
2. **Navigate and wait:** `goto` with `waitUntil` matched to the page type,
   then wait for the specific content you need (selector or JS predicate).
3. **Extract efficiently:** prefer `page.evaluate` reading structured data
   (or intercepting the page's API calls) over DOM scraping where possible;
   validate extracted fields per page.
4. **Handle the hostile web:** retries with backoff, per-page timeouts,
   detection of blocks/captchas (back off and alert — don't try to defeat
   them), and rotating through polite request rates.
5. **Generate artifacts:** `page.pdf()` with print CSS control
   (see html-to-pdf), screenshots (full-page or clipped) for verification
   and visual regression.
6. **Profile when slow:** CDP tracing and coverage to find what's actually
   expensive — often it's waiting on third-party resources you can block.

## Common pitfalls

- **Leaking pages/browsers** — long-running scrapers OOM from unclosed
  pages; use try/finally discipline and periodic browser restarts.
- **Detection arms race** — investing in stealth to defeat anti-bot systems
  instead of respecting the site's wishes; if they don't want automation,
  don't automate (see web-scraper ethics).
- **Screenshots of loading states** — capturing before content renders;
  wait for the content condition first.
- **evaluate() serialization limits** — only serializable values cross the
  boundary; DOM nodes don't; extract plain data inside evaluate.
- **No timeouts** — a hung page hangs the whole job; set navigation and
  protocol timeouts everywhere.
- **Running as root with --no-sandbox blindly** — understand it's a real
  security reduction; prefer proper sandboxing or user namespaces where
  possible.
