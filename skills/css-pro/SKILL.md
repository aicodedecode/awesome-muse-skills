---
name: css-pro
description: Professional CSS: cascade mastery, modern layout, custom properties, and maintainable architecture. Use when writing, reviewing, or debugging CSS.
category: development
---

# CSS Pro

## Overview

Modern CSS — **cascade layers, container queries, `:has()`, subgrid, custom properties, and
logical properties** — has retired most of the hacks and half the frameworks. Professional CSS
means understanding the cascade instead of fighting it with specificity wars, choosing layout tools
deliberately (grid vs flex vs flow), architecting with layers and tokens, and writing CSS that
survives the next developer.

The through-line: the cascade is a feature — architect for it, don't carpet-bomb it with `!important`.

## When to use

- Writing or reviewing CSS for idiom and maintainability.
- Debugging specificity, layout, or cascade issues.
- Architecting stylesheets (layers, tokens, naming).
- Choosing layout approaches (Grid, Flexbox, multicol).
- Building responsive, accessible, themeable interfaces.

## Core concepts

- **The cascade, controlled.** Specificity (inline > ID > class > element), source order, and now
  **cascade layers** (`@layer base, components, utilities`) — layers let you declare precedence
  explicitly instead of winning specificity arms races. Put resets in low layers, utilities high.
- **Custom properties as the design API.** `--color-primary`, `--space-4`, `--radius-lg` —
  theming (dark mode = redefining tokens), runtime changes via JS, and scoped overrides. Properties
  inherit and cascade; use that instead of preprocessor variables for anything dynamic.
- **Layout: the right tool.** Grid for two-dimensional layout (page structure, cards, dashboards);
  Flexbox for one-dimensional distribution (nav bars, button rows, centering); normal flow for
  documents. `subgrid` for aligning nested grids; container queries (`@container`) for components
  that respond to their *container*, not the viewport.
- **Modern selectors.** `:has()` (parent-aware styling), `:is()`/`:where()` (`:where()` has zero
  specificity — perfect for resets), logical properties (`margin-inline-start` for RTL correctness),
  `clamp()`/`min()`/`max()` for fluid type and spacing without breakpoints.
- **Architecture that scales.** Layers + a naming convention (BEM-ish or utility-hybrid) + tokens;
  colocate component styles or centralize deliberately — but one system per codebase. CSS Modules
  or scoped styles for component isolation where the stack supports it.
- **Accessibility is styling too.** `prefers-reduced-motion` (disable non-essential animation),
  `prefers-color-scheme`, focus-visible styles (never remove outlines without replacing them),
  sufficient contrast as a token-level concern, not a per-component hope.

## Practical workflow

1. **Set up the foundation.** Reset (modern: `*, *::before, *::after { box-sizing: border-box;
   margin: 0 }` + sensible defaults), `@layer` order declared, tokens defined on `:root`.
2. **Define tokens first.** Colors (semantic: `--surface`, `--text`, `--accent`), spacing scale,
   type scale, radii, shadows, motion durations. Components consume tokens, never raw values.
3. **Write layout top-down.** Page grid → section layout → component internals. Choose grid/flex
   per axis deliberately; verify at 320px and 200% zoom, not just your monitor.
4. **Style states accessibly.** `:hover`, `:focus-visible`, `:disabled`, `[aria-*]` — every
   interactive element has visible focus and disabled states; motion respects reduced-motion.
5. **Debug systematically.** DevTools: which rule won and why (the cascade panel shows it);
   reduce to a minimal case; check inheritance vs specificity vs layer order before adding weight.
6. **Review CSS for:** specificity creep, raw values instead of tokens, magic numbers, `!important`
   (each needs justification), untested responsive behavior, and missing reduced-motion handling.

Modern CSS sketch:

```css
@layer reset, tokens, base, components, utilities;

@layer tokens {
  :root {
    --color-surface: #ffffff;
    --color-text: #1a1a1a;
    --space-4: 1rem;
    --radius-lg: 0.75rem;
  }
  @media (prefers-color-scheme: dark) {
    :root { --color-surface: #161616; --color-text: #f0f0f0; }
  }
}

@layer components {
  .card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    /* container-aware: adapts to its wrapper, not the viewport */
    container-type: inline-size;
  }
  @container (min-width: 40rem) {
    .card { display: grid; grid-template-columns: 1fr 2fr; }
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

## Common pitfalls

- **Specificity wars.** `#app .container div.item span` to override a library — then the library
  updates and everything breaks. Layers, `:where()`, and lower-specificity source order instead.
- **`!important` as a habit.** Occasionally justified (utility overrides, reduced-motion reset);
  systemically it's a sign the layering/architecture failed.
- **Pixel-perfect at one viewport.** Fixed widths and magic breakpoints that shatter on real
  devices. Fluid type/spacing (`clamp()`), container queries, and testing at extremes.
- **Removing focus outlines.** `outline: none` without a replacement — keyboard users are now
  lost. `:focus-visible` with a strong, on-brand indicator.
- **Animating layout properties.** `width`/`top`/`margin` animations jank (layout thrash).
  Animate `transform` and `opacity` (compositor-friendly); use the Web Animations API or CSS
  transitions deliberately.
- **Global namespace collisions.** Generic class names (`.title`, `.container`) colliding across
  features. Scoping (modules, layers, naming convention) per the project's system.
- **Ignoring logical properties.** `margin-left` in an RTL language breaks layout. Use
  `margin-inline-start`/`padding-block` for direction-aware styling from the start.
