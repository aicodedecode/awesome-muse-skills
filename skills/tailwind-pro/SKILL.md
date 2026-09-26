---
name: tailwind-pro
description: Professional Tailwind CSS: utility-first workflow, design tokens, component extraction, and maintainable styling. Use when writing, reviewing, or structuring Tailwind-based UIs.
category: development
---

# Tailwind Pro

## Overview

Tailwind's utility-first approach — **styling in the markup with constrained, design-token values** —
trades CSS-file archaeology for class-list readability. Professional Tailwind means embracing the
constraint system (spacing scale, color palette as tokens), extracting components (not CSS classes)
for repetition, configuring the theme as the design system, and keeping class lists scannable.

The through-line: utilities for styling, components for repetition, theme config for the design system.

## When to use

- Writing or reviewing Tailwind CSS (v3/v4) markup.
- Setting up Tailwind config/theme as a design system.
- Deciding when to extract components vs repeat utilities.
- Debugging specificity, ordering, or build issues.
- Migrating or standardizing Tailwind usage in a codebase.

## Core concepts

- **Constraints are the feature.** The spacing scale, type scale, and color palette force visual
  consistency — `p-4` everywhere beats `padding: 13px` somewhere. Customize the *theme* (fonts,
  colors, spacing) rather than escaping to arbitrary values for every one-off.
- **Utilities in markup, components in code.** Repeated utility patterns → extract a component
  (React/Vue/Svelte), not a CSS class. `@apply` is for tiny, truly-stable patterns — overuse
  recreates the CSS abstraction problems Tailwind was escaping.
- **Theme as design system.** `tailwind.config` (v3) or `@theme` (v4): brand colors, font stacks,
  spacing, breakpoints, shadows — named semantically (`primary`, `surface`, `muted`). Design
  changes then happen in one place.
- **Responsive and state variants.** `md:`, `lg:`, `hover:`, `focus-visible:`, `dark:`, `disabled:`,
  `aria-*` and `data-*` variants — states expressed inline where the element lives, not in distant
  stylesheets. Mobile-first ordering (`base → sm → md → lg`) keeps intent clear.
- **Arbitrary values sparingly.** `w-[37px]`, `bg-[#bada55]` — escape hatches for genuine one-offs.
  If an arbitrary value appears twice, it belongs in the theme.
- **v4 notes.** CSS-first config (`@theme` in CSS), automatic content detection, and the new
  engine — know your version's config story; v4 simplifies but changes where customization lives.

## Practical workflow

1. **Configure the theme first.** Brand tokens (colors, fonts, radii, shadows) as semantic names;
   content paths covering all templates; dark mode strategy (`class` vs `media`) decided up front.
2. **Establish class-list conventions.** Order: layout → spacing → typography → color → state
   variants (use the Prettier plugin for automatic sorting); keep lists readable — if a list needs
   scrolling, the component needs splitting or extraction.
3. **Build with utilities; extract on the third use.** Button styles repeated three times →
   `<Button>` component. Never a `.btn` CSS class with `@apply` for something with variants —
   component props (`variant`, `size`) beat class concatenation.
4. **Handle states inline.** `disabled:opacity-50 disabled:cursor-not-allowed`,
   `focus-visible:ring-2`, `aria-expanded:` — co-located with the element, visible in review.
5. **Dark mode and responsiveness deliberately.** `dark:` variants on themed tokens (not raw colors);
   responsive variants mobile-first; test at real breakpoints, not just devtools dragging.
6. **Audit regularly.** Find arbitrary values that became patterns (promote to theme), dead
   utilities (the build purges automatically — but the markup still rots), and inconsistent
   spacing/color usage the scale was supposed to prevent.

Component extraction pattern:

```tsx
// Utilities composed once, reused as a component — not a CSS class
function Button({ variant = "primary", size = "md", className = "", ...props }) {
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500",
    secondary: "bg-surface text-ink border border-line hover:bg-surface-hover",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-base" };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
```

## Common pitfalls

- **Arbitrary-value sprawl.** `w-[13px]`, `text-[11.5px]`, `bg-[#f4f4f5]` everywhere — you've
  rebuilt inline styles with extra steps. Promote patterns to the theme.
- **Premature `@apply`.** Extracting `.card` / `.btn` classes for everything recreates BEM with
  extra indirection and kills Tailwind's dead-code elimination benefits. Components, not classes.
- **Unreadable class soup.** 40-class lists with no ordering — reviewers can't tell what matters.
  Sort (Prettier plugin), split components, and put layout-affecting classes first by convention.
- **Magic responsive breakpoints.** `md:` used to mean "tablet" in one place and "desktop" in
  another. Define what each breakpoint *means* for your design and use consistently.
- **Dark mode as afterthought.** Bolting `dark:` variants onto raw colors late. Theme tokens +
  `dark:` from the start; test both modes in CI screenshots.
- **Fighting the cascade with `!important`.** `!`-prefixed utilities to override third-party CSS
  instead of fixing specificity properly. Occasional use is fine; systemic use signals a layering problem.
- **Ignoring the build.** Not configuring content paths (huge CSS in v3) or misunderstanding v4's
  automatic detection — know how your version decides what to include, and verify output size.
