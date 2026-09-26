---
name: seo-site-auditor
description: Audit websites for SEO: crawling, technical checks, metadata, Core Web Vitals, structured data, and prioritized fixes. Use when diagnosing search visibility problems.
category: web-development
---

# SEO Site Auditor

A systematic approach to technical SEO audits: crawling a site, checking indexability, metadata, structured data, performance, and content signals — then prioritizing fixes by impact and effort.

## Overview

SEO audits fail when they're 200-line checklists with no priorities. This skill is a **triage method**: crawl → identify what's blocking indexing/ranking → verify the high-impact basics (titles, canonicals, sitemaps, speed, structured data) → prioritize by (traffic at stake × effort). Most sites' SEO problems are a handful of fixable technical issues, not mysterious algorithm behavior.

## When to use

- Traffic drops or pages not appearing in search.
- Pre-launch SEO review of a new site or migration.
- Periodic technical health checks.
- Evaluating an agency/freelancer SEO proposal (know what good looks like).

## Core concepts

- **Crawlability.** Can bots fetch and render pages? Check robots.txt, meta robots, HTTP status codes, redirect chains, and JS-rendering (view-source vs rendered DOM for key content).
- **Indexability.** `noindex` tags, canonical tags (self-referencing where appropriate), sitemap.xml accuracy, Search Console coverage report.
- **Metadata.** Unique `<title>` (50–60 chars, keyword-front-loaded naturally), meta descriptions (compelling, ~150 chars — they don't rank you but earn clicks), one H1 per page, logical heading hierarchy.
- **Structured data.** JSON-LD schema.org (Article, Product, FAQ, BreadcrumbList, Organization) — validates in Rich Results Test; enables rich snippets.
- **Core Web Vitals.** LCP < 2.5s, INP < 200ms, CLS < 0.1 — measured via PageSpeed Insights / CrUX (field data beats lab data).
- **Content signals.** Thin/duplicate content, keyword cannibalization (multiple pages targeting the same query), internal linking depth (important pages ≤ 3 clicks from home).
- **Migration risks.** URL changes without 301s, lost metadata, staging `noindex` leaking to production.

## Practical workflow

**1. Crawl.**
```bash
# CLI crawl for status codes, titles, canonicals, noindex
npx broken-link-checker https://example.com --ordered
# or: screaming-frog-style desktop crawler for full audits
curl -sI https://example.com/robots.txt
curl -s https://example.com/sitemap.xml | head -50
```
Check: 200s where expected, no redirect chains (>2 hops), noindex only where intended, canonicals absolute and self-consistent.

**2. Indexation check.** Search Console: coverage errors, "discovered not indexed" (crawl budget/content quality signal), sitemap submission status. `site:example.com` for a rough indexed-page count.

**3. Page-level audit (top 20 pages).**
- Title unique and descriptive? Meta description present and click-worthy?
- H1 present, single, matching intent? Headings hierarchical?
- Canonical correct? Open Graph/Twitter cards render (test with validators)?
- JSON-LD valid? (Rich Results Test)
- Images: descriptive alt, compressed, modern formats, width/height set (CLS)?

**4. Performance.** PageSpeed Insights per template (not just homepage): LCP element identified, INP interactions, CLS sources. Fix images/fonts/JS bloat first — they're usually the cause.

**5. Content.** Identify: thin pages (< few hundred useful words), duplicates/near-duplicates, cannibalization (Search Console: two pages ranking for the same query — consolidate).

**6. Prioritize.** Score each finding: impact (traffic at stake) × effort (dev hours). Fix order: blocking (noindex leaks, 5xx) → high-impact quick wins (titles, canonicals) → structural (internal linking, speed) → content (consolidation, new content).

## Common pitfalls

- **`noindex` on production.** Staging configs leaking to prod — the single most expensive one-line SEO bug. Check after every deploy.
- **JS-rendered critical content.** If the title, headings, or body text only exist after JS runs, crawlers may miss or delay them. SSR critical content.
- **Canonical chaos.** Canonicals pointing to wrong URLs, chains, or http/https mismatches. Every indexable page: self-referencing absolute canonical.
- **Sitemap fiction.** Sitemaps listing 404s, noindexed pages, or missing new content. Regenerate automatically; keep under 50k URLs per file.
- **Title/description duplication.** Same title on 500 product pages = missed clicks. Templates with unique variables (product name, category).
- **Chasing scores over users.** Perfect Lighthouse 100 with thin content ranks worse than useful content at 85. Technical SEO is table stakes; content wins.
- **Ignoring Search Console.** The only source of truth for how Google sees your site. Check coverage, enhancements, and manual actions regularly.
- **Migration without redirects.** Relaunching with new URLs and no 301 map = traffic cliff. Map every old URL → new (or closest equivalent) before launch.
- **Keyword stuffing.** 2010 called. Write for the query's intent; use the keyword naturally in title/H1/early body.
