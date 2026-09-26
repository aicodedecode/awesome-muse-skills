---
name: less-pro
description: Write and maintain Less stylesheets: variables, mixins, guards, imports, and build integration. Use when working with Less-based projects (e.g., Ant Design theming).
category: development
---

# Less Pro

A practical guide to Less: variables, mixins (parametric + guarded), operations, namespaced imports, and build integration — primarily for maintaining Less-based codebases and theming component libraries built on Less.

## Overview

Less is a CSS preprocessor in the Sass/Stylus family, notable for its JavaScript-based implementation and its role as the styling layer of major UI libraries (notably Ant Design, which themes via Less variables). New projects rarely choose Less today, but large existing codebases run on it — this skill is about working effectively in those codebases and customizing Less-based design systems.

## When to use

- Theming Ant Design or other Less-based component libraries (`@primary-color` overrides).
- Maintaining existing Less stylesheets.
- Build integration: `less-loader`, standalone `lessc`, or in-browser `less.js` (dev only).
- Deciding whether to migrate Less → modern CSS/Sass.

## Core concepts

- **Variables.** `@primary-color: #1890ff;` — lazy-loaded (defined on last declaration wins, usable before definition). Referenced as `@var` in values and `@{var}` in selectors/URLs.
- **Mixins.** `.bordered() { border: 1px solid #ddd; }` then `.card { .bordered(); }`. Parametric: `.rounded(@radius: 4px) { border-radius: @radius; }`. Namespaced: `#bundle > .mixin()`.
- **Guards.** Conditional mixins: `.mixin(@a) when (@a > 10) { ... }` — pattern matching by arity/guards, Less's version of control flow.
- **Operations & functions.** `width: @base * 2;`, `color: lighten(@primary-color, 10%);`, `fade()`, `mix()`. Any numeric/color value can be computed.
- **Nesting & `&`.** Standard nesting; `&` for parent reference (`&:hover`, `&__element`).
- **`@import`.** `(reference)` imports without output (great for mixin libraries), `(inline)`, `(css)` passthrough. Import once semantics per file.
- **Detached rulesets.** `@rules: { color: red; }; .x { @rules(); }` — reusable declaration blocks, useful for theming APIs.

## Practical workflow

**1. Theme a Less-based library (Ant Design example).**
```js
// webpack less-loader options (or vite plugin-less)
{
  lessOptions: {
    modifyVars: {
      '@primary-color': '#7c3aed',
      '@border-radius-base': '8px',
      '@font-family': 'Inter, sans-serif',
    },
    javascriptEnabled: true,
  },
}
```
`modifyVars` overrides library defaults without forking — the sanctioned theming path.

**2. Organize.**
```
styles/
  variables.less   // your tokens (@import (reference) libraries' vars if needed)
  mixins.less      // parametric mixins, guarded variants
  base.less
  components/
```
One entry `main.less` importing the rest; `(reference)` for mixin-only imports to avoid duplicate output.

**3. Parametric + guarded mixins.**
```less
.button-variant(@bg; @color: #fff) {
  background: @bg;
  color: @color;
  &:hover when (lightness(@bg) > 50%) { background: darken(@bg, 10%); }
  &:hover when (lightness(@bg) <= 50%) { background: lighten(@bg, 10%); }
}
```

**4. Build.** `lessc src/main.less dist/main.css --source-map`; watch with `--watch` or bundler loaders. Never ship `less.js` in-browser compilation to production (slow, FOUC).

## Common pitfalls

- **Lazy variable gotcha.** Last declaration wins *everywhere*, even above it — redefining `@x` in an imported file silently changes earlier usages. Namespace your variables.
- **`javascriptEnabled` security.** Less's inline JS evaluation (`` `...` ``) is off by default for good reason — enabling it for `modifyVars` math is normal, but don't evaluate untrusted input.
- **In-browser less.js in prod.** Dev convenience only. Compile at build time; shipping the compiler + FOUC is a performance and UX bug.
- **Import duplication.** Multiple `@import "mixins.less"` without `(reference)` emits the file's output repeatedly. Mixin libraries should be `(reference)` imports or output-free.
- **Overriding library internals.** Reaching past `modifyVars` into a library's private mixins breaks on upgrade. Stay on the public theming API.
- **Math precision.** `0.1 + 0.2`-style float artifacts in computed values; round where it matters (`round()`, `ceil()`).
- **Migrating away blindly.** If the codebase themes Ant Design via Less, "rewrite in Tailwind" means reimplementing the theme layer. Cost it: often better to keep Less for the library theme and use modern CSS for app code.
- **No sourcemaps.** Debugging compiled CSS without `--source-map` is miserable. Always generate them.
