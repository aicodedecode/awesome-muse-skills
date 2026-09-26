---
name: html-to-pdf
description: Converting HTML/CSS to PDF — print stylesheets, pagination, and renderer choice — use when generating PDFs from web content.
category: document-processing
---

## Overview

HTML-to-PDF is the fastest path to good-looking generated documents: design in
HTML/CSS (skills your team already has), render to PDF. The craft lies in print
CSS, pagination control, and choosing the right renderer. This skill covers the
full pipeline from markup to print-ready PDF.

## When to use

- Generating invoices, reports, or statements from web templates
- Choosing a renderer (headless Chromium, WeasyPrint, wkhtmltopdf-class tools)
- Controlling pagination, headers/footers, and page sizes with CSS
- Handling charts, images, and fonts in PDF output
- Building high-volume PDF generation services

## Core concepts

**The renderer defines your CSS universe.** Headless Chromium supports modern
CSS (flexbox, grid, custom properties) — if it renders in Chrome, it prints.
WeasyPrint supports print CSS beautifully with a smaller CSS subset (no flexbox
historically — check current support). Legacy WebKit-based tools lag on modern
CSS. Match the renderer to your design's CSS needs.

**Print CSS is a separate stylesheet.** `@page` rules set size and margins;
`@media print` overrides screen styles; `page-break-inside: avoid` keeps blocks
together; `thead { display: table-header-group }` repeats table headers across
pages. Design for pages, not viewports — fixed pixel widths break across page
sizes.

**Headers and footers need a strategy.** Options: CSS running elements
(`position: running(header)`), renderer-native header/footer templates
(separate HTML with page-number variables), or post-processing overlay. Pick
one per project and keep it consistent — mixing approaches causes duplication
and drift.

**Assets must be self-contained.** Inline critical CSS, embed or absolute-URL
images and fonts; relative paths break when the renderer runs in a different
working directory or container. Base64-embedding small assets eliminates an
entire class of "missing image" bugs.

**Fonts: embed, subset, test.** Declare `@font-face` with local files, ensure
the renderer can access them, and test non-Latin scripts explicitly. Chromium
headless needs fontconfig-visible fonts in containers — install them in the
image.

## Practical workflow

1. **Build the HTML template** with real sample data first, iterating in the
   browser's print preview — fastest feedback loop.
2. **Write print CSS:** `@page` size/margins, break controls
   (`break-inside: avoid` on cards/rows, `break-before` on major sections),
   repeating table headers, and hiding interactive elements.
3. **Choose the renderer** by CSS needs and volume: Chromium for fidelity and
   modern CSS; lighter engines for simple documents at high volume.
4. **Handle dynamic content:** charts rendered to SVG/canvas (ensure they
   finish drawing before print — wait for fonts and async rendering),
   page-number variables (`counter(page)` / `counter(pages)`), and TOCs.
5. **Test the edges:** one-page doc, 100-page doc, tables spanning pages,
   very long words/URLs (add `overflow-wrap: break-word`), empty states.
6. **For volume:** run renderers in a pooled service (browser instances are
   expensive to spawn per request), set timeouts, and monitor memory —
   Chromium per-document processes leak if not managed.

## Common pitfalls

- **Designing for screen, printing as afterthought** — layouts that look great
  at 1440px break into pages badly; design print-first for PDF outputs.
- **Content cut between pages** — tables split mid-row, headings orphaned at
  page bottom; use break-inside/break-before deliberately.
- **Missing fonts in containers** — works locally, tofu boxes in production;
  install fonts in the image and verify with a non-Latin sample.
- **Relative asset paths** — images and CSS 404 in the renderer; use absolute
  paths or embed.
- **JavaScript-dependent content** not waiting for render — charts blank
  because PDF was captured before async drawing finished; wait explicitly.
- **No timeout or resource limits** — a pathological document (infinite table,
  huge image) hangs the renderer; bound time and memory per job.
