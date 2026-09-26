---
name: sass-pro
description: Write maintainable Sass/SCSS: modules (@use), mixins, functions, architecture (7-1), and build integration. Use when styling with Sass in any project.
category: development
---

# Sass Pro

A practical guide to modern Sass (SCSS syntax): the module system (`@use`/`@forward`), mixins vs functions vs extends, the 7-1 architecture, and Dart Sass build integration.

## Overview

Modern Sass = **Dart Sass** + the **module system**. The old `@import` is deprecated: `@use` loads a module once with a namespace, `@forward` re-exports. This killed the biggest Sass footguns (global namespace collisions, duplicate output, spooky import order). If your codebase still uses `@import`, migration is the highest-value Sass work you can do.

## When to use

- Large stylesheets needing variables, mixins, and organization.
- Design-system token layers (colors, spacing, typography) shared across projects.
- Projects where CSS custom properties alone aren't enough (loops, color math at build time).
- Migrating legacy `@import` Sass to the module system.

## Core concepts

- **`@use`.** `@use 'tokens/colors' as c;` → `c.$brand-500`. Namespaced, loaded once, private members (`$-private` / `$_private`) stay hidden.
- **`@forward`.** Barrel files: `@forward 'buttons'; @forward 'cards';` re-exports a whole directory as one module (`@use 'components'`).
- **`@mixin` vs `@function` vs `%placeholder`.** Mixins emit declarations (accept content blocks); functions return values (color math, calculations); placeholders (`%btn`) with `@extend` share selectors — use sparingly (extend has surprising selector-bloat behavior).
- **Built-in modules.** `sass:color` (`color.adjust`, `color.scale`, `color.mix`), `sass:math` (`math.div` — `/` for division is deprecated), `sass:map`, `sass:list`, `sass:string`, `sass:meta`.
- **7-1 architecture.** `abstracts/` (variables, mixins, functions — no output), `base/` (reset, typography), `components/`, `layout/`, `pages/`, `themes/`, `vendors/` + `main.scss` forwarding. Scale the structure to the project; don't cargo-cult all seven for a small site.
- **Custom properties vs Sass variables.** Sass `$vars` are build-time (can't change at runtime, work in media queries logic); CSS `--vars` are runtime (themeable, JS-readable). Use both: Sass for build logic, custom props for theming.

## Practical workflow

**1. Token layer.**
```scss
// abstracts/_tokens.scss
$brand-500: #2563eb;
$space-4: 1rem;
$radius-lg: 0.75rem;

// abstracts/_index.scss
@forward 'tokens';
@forward 'mixins';
```

**2. Mixins for repeated patterns.**
```scss
// abstracts/_mixins.scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == md { @media (min-width: 768px) { @content; } }
  @if $breakpoint == lg { @media (min-width: 1024px) { @content; } }
}

@mixin truncate($lines: 1) {
  overflow: hidden;
  @if $lines == 1 { text-overflow: ellipsis; white-space: nowrap; }
  @else { display: -webkit-box; -webkit-line-clamp: $lines; -webkit-box-orient: vertical; }
}
```

**3. Component usage.**
```scss
@use '../abstracts' as a;

.card {
  padding: a.$space-4;
  border-radius: a.$radius-lg;
  @include a.respond-to(md) { padding: a.$space-4 * 2; }
  &__title { @include a.truncate(2); }
}
```

**4. Build.** Dart Sass: `sass src/main.scss dist/main.css --style=compressed`; watch mode for dev; integrate via `sass-loader` (webpack) or Vite's built-in `css.preprocessorOptions`.

**5. Migrate `@import` → `@use`.** `sass-migrator module --migrate-deps src/**/*.scss` automates most of it; then fix namespace collisions manually and delete the migrator's `as *` where it hid conflicts.

## Common pitfalls

- **Still using `@import`.** Deprecated, slower, global namespace. Migrate — the migrator tool does the heavy lifting.
- **`/` for division.** Deprecated in favor of `math.div()`. `100% / 3` still works in some contexts but warns; be explicit.
- **`@extend` across media queries.** Illegal and confusing; extend only within the same context, or better, use mixins.
- **Deep nesting.** More than 3 levels = specificity wars and unreadable selectors. Lint with a max-nesting rule.
- **Gigantic single files.** If `main.scss` is 3000 lines, the architecture failed. Split by component; forward through barrels.
- **Sass variables for theming.** `$brand` can't change at runtime — dark mode needs CSS custom properties. Don't build runtime theming on build-time variables.
- **Color functions on custom props.** `darken(var(--brand), 10%)` doesn't work — Sass can't compute on runtime values. Precompute variants or use `color-mix()` in native CSS.
- **Unused mixins/functions.** Dead Sass still costs compile time and confusion. Delete aggressively; the module system makes dead code visible.
