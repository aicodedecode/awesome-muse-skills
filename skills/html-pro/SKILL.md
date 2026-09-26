---
name: html-pro
description: Professional HTML: semantic markup, accessibility, forms, SEO fundamentals, and document structure. Use when writing or reviewing HTML.
category: development
---

# HTML Pro

## Overview

HTML is **the most important layer of the web** — and the most undervalued. Semantic, accessible
markup works everywhere: screen readers, search engines, reader modes, no-JS baselines, and future
maintainers. Professional HTML means choosing elements for *meaning* (not default styling), building
forms the platform way, structuring documents for assistive tech, and treating accessibility as
correctness.

The through-line: use the platform — the browser already knows how to do most of what you're
rebuilding in JavaScript.

## When to use

- Writing or reviewing HTML markup.
- Building forms (validation, accessibility, submission).
- Structuring documents for SEO and screen readers.
- Auditing accessibility of existing markup.
- Choosing semantic elements for UI patterns.

## Core concepts

- **Semantics over styling.** `<button>` not `<div onclick>`, `<nav>`/`<main>`/`<article>`/
  `<section>` with headings for document structure, `<ul>` for lists of things, `<table>` for
  tabular data (with `<th scope>`). Semantics drive screen readers, SEO, and reader modes —
  styling is CSS's job.
- **Headings as the document outline.** One `<h1>` per page (the page's topic), then `<h2>`/`<h3>`
  in order — never skipping levels for styling. Screen reader users navigate by headings; a broken
  outline is a broken map.
- **Forms, the platform way.** `<label>` for every input (explicit `for`/`id`), native input types
  (`email`, `tel`, `date`, `number`) for free mobile keyboards and validation, `required`/`pattern`/
  `minlength` for native validation, `<fieldset>`/`<legend>` for groups, and real submit buttons.
  Native validation + `novalidate`-free progressive enhancement beats most custom form libraries.
- **Images and media.** `alt` text that's functional (describe the *purpose*, empty `alt=""` for
  decorative), `width`/`height` to prevent layout shift, `loading="lazy"` below the fold,
  `srcset`/`sizes` for responsive images, `<figure>`/`<figcaption>` for captioned media.
- **Document head hygiene.** `<html lang>`, descriptive `<title>` (unique per page), meta
  description, viewport, Open Graph/Twitter cards, canonical URLs, and structured data (JSON-LD)
  where it earns rich results. The head is your SEO and sharing contract.
- **Progressive enhancement baseline.** Core content and actions work as plain HTML (links navigate,
  forms submit); JavaScript enhances. If the app is blank without JS, the HTML layer failed.

## Practical workflow

1. **Outline first.** Draft the heading structure and landmarks before styling — if the outline
   makes sense read aloud, the semantics are right.
2. **Build forms natively.** Labels, types, native validation, fieldsets; test keyboard-only
   completion; verify error messages are announced (`aria-describedby`, native validation bubbles).
3. **Make it navigable.** Skip links (`<a href="#main">`), landmarks (`header`/`nav`/`main`/
   `footer`), focus order matching visual order, visible focus indicators.
4. **Media responsibly.** Alt text reviewed (not "image123.jpg"), dimensions set, lazy loading
   below fold, captions/transcripts for audio/video.
5. **Head per page.** Unique titles/descriptions, OG cards validated (use the platform debuggers),
   canonical set, JSON-LD for articles/products/events where relevant.
6. **Audit.** Automated (axe/Lighthouse) for the mechanical issues; manual keyboard walkthrough
   and a screen reader pass (NVDA/VoiceOver) for the real experience. Automated tools catch ~30%
   of a11y issues — the rest is manual.

Semantic skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Checkout — Acme Store</title>
  <meta name="description" content="Complete your Acme Store purchase securely.">
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header>…<nav aria-label="Primary">…</nav></header>
  <main id="main">
    <h1>Checkout</h1>
    <form action="/orders" method="post">
      <fieldset>
        <legend>Shipping address</legend>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required autocomplete="email">
        …
      </fieldset>
      <button type="submit">Place order</button>
    </form>
  </main>
  <footer>…</footer>
</body>
</html>
```

## Common pitfalls

- **Div soup.** `<div class="button">`, `<div class="h1">` — no semantics, no keyboard support,
  no screen reader meaning. Use the element that *means* it.
- **Skipped heading levels.** `<h1>` then `<h4>` for "styling" — CSS sizes headings, levels
  structure. Screen readers expose the breakage.
- **Placeholder as label.** Placeholders vanish on input, aren't reliably announced, and fail
  contrast. Real `<label>`s, always; placeholders as *hints* only.
- **Missing or garbage alt text.** `alt="image"` or missing alts on informative images; or the
  opposite — verbose alt on decorative images (use `alt=""`).
- **Inaccessible custom widgets.** Custom dropdowns/modals/tabs without keyboard support, focus
  management, and ARIA roles. Either use native elements or implement the full ARIA pattern —
  half-ARIA is worse than none.
- **No-JS blank page.** SPAs rendering nothing without JavaScript — no content for crawlers,
  readers, or degraded networks. SSR or static baseline for content.
- **Title/description neglect.** "Home" as every page's title, missing meta descriptions —
  the cheapest SEO and usability wins, skipped.
