---
name: web-performance
description: Make websites fast: Core Web Vitals, loading optimization, rendering performance, and measurement workflows. Use when pages are slow or targets must be met.
category: web-development
---

# Web Performance

A practical guide to web performance: Core Web Vitals, the loading pipeline (and what blocks it), rendering performance, image/font/JS optimization, and a measurement workflow that finds real bottlenecks instead of chasing scores.

## Overview

Performance = **how fast the page becomes usable**, measured by Core Web Vitals: **LCP** (largest contentful paint — main content visible, <2.5s), **INP** (interaction to next paint — responsiveness, <200ms), **CLS** (cumulative layout shift — visual stability, <0.1). Optimize in that priority order for most sites. Measure field data (CrUX/real users) over lab scores — lab lies about networks and devices.

## When to use

- Slow pages: diagnosing LCP/INP/CLS failures.
- Performance budgets for new projects.
- Image, font, and JavaScript optimization.
- Setting up real-user monitoring (RUM).

## Core concepts

- **Critical rendering path.** HTML → CSSOM → render tree → layout → paint. Anything blocking (render-blocking CSS/JS, slow server) delays everything. Inline critical CSS, defer the rest.
- **LCP.** Usually a hero image or headline. Fix: preload the LCP image (`fetchpriority="high"`), compress + modern format, responsive sizes, fast server (TTFB), no lazy-loading the LCP element.
- **INP.** Long tasks blocking the main thread (>50ms). Fix: code-split, defer non-critical JS, break up long tasks (`setTimeout`/scheduler yielding), move work off-thread (Web Workers).
- **CLS.** Layout shifts from late-loading images/ads/fonts. Fix: explicit width/height (or aspect-ratio) on media, reserve space for dynamic content, `font-display: swap` with fallback metrics.
- **Resource hints.** `preconnect` (origins), `preload` (critical resources), `prefetch` (next navigation), `dns-prefetch`. Powerful, easy to overuse — hint only what you're sure about.
- **Caching.** Long-lived hashed assets (`immutable`), short HTML. CDN for static. Service worker for repeat visits.
- **RUM vs lab.** Lab (Lighthouse) for iteration; field (CrUX, web-vitals library) for truth. Optimize what real users experience on real devices/networks.

## Practical workflow

**1. Measure first.**
```bash
npx lighthouse https://example.com --view
# Plus: PageSpeed Insights (field data), web-vitals JS library in production
```
Identify the failing metric and its dominant contributor (Lighthouse points at it: "LCP element", "longest tasks", "shift sources").

**2. Fix LCP.**
- Preload hero image; `fetchpriority="high"`; never `loading="lazy"` on it.
- Serve AVIF/WebP at right sizes (`srcset`); compress aggressively.
- Reduce TTFB: CDN, edge rendering, faster backend for the HTML.

**3. Fix INP.**
- Find long tasks (DevTools Performance → long task markers); split or defer.
- `import()` route-level code splitting; third-party scripts async/defer or partytown/worker.
- Debounce expensive handlers; avoid forced synchronous layouts in scroll/resize.

**4. Fix CLS.**
- `width`/`height` or `aspect-ratio` on all images/embeds.
- Reserve space for ads/dynamic inserts; skeleton loaders matching final layout.
- Web fonts: `font-display: swap` + `size-adjust` fallback to minimize swap shift.

**5. Budgets.** Set and enforce: e.g., JS < 200KB gzipped per route, images < 1MB total, Lighthouse performance ≥ 90. CI check via Lighthouse CI.

**6. Monitor.** web-vitals library → analytics; alert on regressions per deploy. Performance is a feature with a maintenance cost — monitor or it rots.

## Common pitfalls

- **Optimizing without measuring.** Guessing at bottlenecks. Profile first; the slow thing is rarely what you assume.
- **Lab-score tunnel vision.** Lighthouse 100 on desktop ≠ fast for users on 4G Moto G. Weight field data.
- **Unoptimized images.** The #1 web performance bug, perennially. Modern formats, responsive sizes, compression, lazy-load below fold.
- **JS bloat.** Shipping megabytes of JS for kilobytes of interactivity. Audit with bundle analyzer; question every dependency.
- **Render-blocking everything.** Synchronous scripts and un-inlined CSS in `<head>`. Defer/async scripts; inline critical CSS.
- **Third-party sprawl.** Each tag manager/widget/chat adds requests + main-thread cost. Audit quarterly; lazy-load or remove.
- **Font FOIT/FOUT pain.** Blocking text on web fonts (FOIT) or jarring swaps. `font-display: swap` + preloaded key fonts + metric-matched fallbacks.
- **No performance budget.** Without a budget, every sprint adds weight. Budgets in CI make performance a constraint, not a wish.
- **CLS from cookie banners/ads.** Late-injected UI shifting content. Reserve space or overlay without reflowing content.
