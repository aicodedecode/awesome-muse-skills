---
name: tailwind-patterns
description: Build UIs with Tailwind CSS: utility composition, component extraction, theming, dark mode, and responsive design. Use for utility-first styling in any framework.
category: web-development
---

# Tailwind Patterns

A practical guide to Tailwind CSS done professionally: composing utilities, extracting components (the right way), theming with design tokens, dark mode, responsive design, and keeping utility soup maintainable.

## Overview

Tailwind's utility classes move styling into markup, which trades CSS-file archaeology for long class strings. It works brilliantly with **component extraction**: repeated utility combos become components (React/Vue/etc.), not CSS classes. The failure mode is "utility soup" — 40-class divs repeated across files. The fix is always components, not `@apply` (which the Tailwind team itself de-emphasizes).

## When to use

- Utility-first styling in React/Vue/Svelte/HTML projects.
- Design systems built on Tailwind tokens.
- Dark mode and responsive design via variants.
- Cleaning up an inconsistent Tailwind codebase.

## Core concepts

- **Utilities.** `flex`, `px-4`, `text-sm`, `bg-zinc-900` — single-purpose classes. Learn the naming grammar (`{property}-{scale}`) and you can guess most classes.
- **Variants.** `hover:`, `focus:`, `dark:`, `sm:`/`md:`/`lg:`, `disabled:`, `group-hover:`, `data-[state=open]:` — state and context modifiers. Stackable: `dark:hover:bg-zinc-800`.
- **Theme.** `tailwind.config.js` `theme.extend`: colors, fonts, spacing, radii, shadows — your design tokens. v4 uses CSS-first `@theme`. Semantic names (`surface`, `muted`) over literal (`gray-200`).
- **Dark mode.** `dark:` variant with `class` strategy (toggle `.dark` on `<html>`) or `media` (OS preference). Class strategy + a theme store = user toggle.
- **Responsive.** Mobile-first: base classes are mobile, `md:` overrides up. Design small → large.
- **Arbitrary values.** `w-[137px]`, `grid-cols-[1fr_2fr]`, `text-[13px]` — escape hatch for one-offs. Frequent use = missing theme token.
- **Container queries.** `@container` / `@md:` variants for component-level responsiveness (better than page breakpoints for reusable components).

## Practical workflow

**1. Configure tokens once.**
```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { brand: { 50: '...', 500: '#6d28d9', 600: '...', 900: '...' } },
    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
  }},
};
```

**2. Component extraction (the pattern).**
```tsx
// NOT: repeating 15 utilities in 20 files
// YES: one Button component
function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 disabled:opacity-50';
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-500',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
```

**3. Responsive + dark.**
```html
<div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 md:p-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
```

**4. Consistency tooling.** Prettier plugin (`prettier-plugin-tailwindcss`) sorts classes deterministically — kills diff noise. Lint against raw color values drifting outside the theme.

## Common pitfalls

- **`@apply` for components.** Extract to framework components instead. `@apply` recreates the CSS-file problems Tailwind avoids and breaks with some variants.
- **Utility soup duplication.** Same 20 classes pasted in 15 files = a missing component. Extract at the third repetition.
- **Literal colors everywhere.** `bg-[#6d28d9]` scattered = theme drift. Put it in the config as `brand-600`.
- **Dark mode afterthought.** Bolting `dark:` on at the end doubles the work. Design both modes from the start; use semantic tokens.
- **Desktop-first responsive.** Writing `lg:` overrides for desktop then fighting mobile. Mobile-first: base = mobile.
- **Overriding with `!important`.** `!`-prefixed utilities signal specificity fights — usually a sign the component structure needs fixing.
- **Purge/content misconfiguration.** Dynamic class construction (`bg-${color}-500`) gets purged in production. Safelist or use full class names in a lookup map.
- **Ignoring the prettier plugin.** Unsorted classes = noisy diffs and review friction. One plugin, zero debate.
- **Huge HTML payloads.** Extremely long class strings bloat HTML; component extraction + gzip mitigates. For truly massive pages, consider whether utilities-per-element is the right call.
