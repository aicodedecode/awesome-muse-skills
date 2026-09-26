---
name: astro-pro
description: Idiomatic Astro: islands architecture, content collections, SSR/SSG choices, and performance-first builds. Use when writing, reviewing, or structuring Astro sites.
category: development
---

# Astro Pro

## Overview

Astro's bet — **zero JavaScript by default, interactivity as opt-in "islands"** — makes it the
right tool for content-heavy sites that must be fast. Professional Astro means designing around
islands deliberately (what actually needs JS?), using content collections for type-safe content,
choosing rendering modes per route, and treating performance budgets as architecture.

The through-line: ship HTML, hydrate surgically, and let the build do the work.

## When to use

- Building or reviewing Astro sites (marketing, docs, blogs, content platforms).
- Choosing islands vs frameworks, or SSR vs SSG per route.
- Structuring content (collections, MDX, i18n).
- Integrating React/Vue/Svelte components as islands.
- Optimizing Astro build output and runtime performance.

## Core concepts

- **Islands architecture.** Static HTML everywhere; interactive components become islands with
  `client:load` / `client:visible` / `client:idle` / `client:media` directives. The directive
  choice *is* the performance design: `client:visible` for below-fold widgets, `client:idle` for
  non-critical, `client:load` only for above-fold interactive essentials.
- **Zero JS by default.** If a component doesn't need interactivity, it ships as pure HTML/CSS.
  Audit regularly: every island is a JavaScript cost — justify each one.
- **Content collections.** Typed, validated content (`src/content/blog/*.md` + Zod schemas) —
  the CMS-without-a-CMS. Schema validation at build time catches malformed content before deploy.
  `getCollection` with filtering/sorting replaces ad-hoc file reading.
- **Rendering modes per route.** SSG (default, prerendered) for content; SSR (`output: 'server'`,
  per-route `prerender` exports) for personalized/dynamic; hybrid for the common mix. Choose per
  route based on data freshness needs, not globally.
- **Framework components as islands.** React/Vue/Svelte/Preact components drop in via integrations
  — but each framework adds its runtime to the island's cost. Prefer Astro components for static
  parts; reserve framework islands for genuinely interactive widgets.
- **View transitions.** Native-feeling page transitions with minimal code (`<ViewTransitions />`)
  — but test with islands: persistent islands (`transition:persist`) keep state across navigations.

## Practical workflow

1. **Scaffold:** `npm create astro@latest` with TypeScript (strict), the framework integration(s)
   you actually need, and Tailwind/CSS approach decided up front.
2. **Design the island map.** For each page, list interactive elements and assign directives.
   Default: no directive (static). Document why each island exists.
3. **Model content.** Content collections with Zod schemas for every content type; relationships
   via references; draft handling via schema fields, not folder hacks.
4. **Choose rendering per route.** Prerender content pages; SSR for authenticated/personalized;
   set `prerender` exports explicitly so the choice is visible in code.
5. **Build the data layer.** `Astro.glob`/collections at build time for static; server endpoints
   (`src/pages/api/`) or server islands for dynamic bits; cache aggressively at the edge/CDN.
6. **Enforce performance.** Lighthouse CI on PRs (performance budget: e.g., < 200KB JS total,
   LCP < 2.5s); audit islands quarterly — static-ify what stopped needing interactivity.

Island decision guide:

```text
Above-fold interactive (cart button, search)  → client:load
Below-fold widget (comments, reviews)          → client:visible
Non-critical enhancement (tooltips, animations)→ client:idle
Viewport-conditional (mobile menu)             → client:media="(max-width: 720px)"
Static content, tabs via <details>, etc.      → no directive (pure HTML/CSS)
```

## Common pitfalls

- **`client:load` everywhere.** Hydrating the whole page defeats Astro's purpose — you've built
  a slower SPA. Default to static; justify each island and its directive.
- **Framework islands for static content.** A React component rendering static marketing copy
  ships React for no reason. Astro components render to pure HTML — use them.
- **Fetching in islands what the page could provide.** Client-side fetching for data available
  at build/request time — worse performance and loading states. Pass data via props from Astro
  frontmatter.
- **Ignoring the build-time data story.** `getCollection` at build time is fast and type-safe;
  runtime CMS fetches in SSG pages that never change waste the static advantage — or worse,
  doing it client-side per visitor.
- **View-transition state bugs.** Islands re-mounting on navigation losing state unexpectedly.
  Understand `transition:persist` and test navigations, not just initial loads.
- **No content schema.** Markdown files with inconsistent frontmatter breaking builds or
  rendering. Zod schemas on collections catch this at build time — use them from day one.
- **Treating Astro like Next.js.** Reaching for SSR-everything and client-heavy patterns.
  Astro's strengths are static-first and islands — design with them, not against them.
