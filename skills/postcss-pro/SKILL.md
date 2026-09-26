---
name: postcss-pro
description: Build CSS pipelines with PostCSS: autoprefixer, nesting, custom plugins, and integration with bundlers. Use when processing CSS in modern build setups.
category: development
---

# PostCSS Pro

A practical guide to PostCSS: the CSS transformation pipeline — autoprefixer, nesting, custom media, import handling, writing your own plugins, and wiring it into Vite/webpack/standalone builds.

## Overview

PostCSS parses CSS into an AST and runs **plugins** that transform it. It's not a preprocessor with its own syntax — it's a pipeline: you compose exactly the transforms you need (vendor prefixes, future CSS, minification, linting). Most projects meet PostCSS through Tailwind (which is a PostCSS plugin) or autoprefixer, but the standalone pipeline is worth understanding.

## When to use

- Autoprefixing and future-CSS features without a full preprocessor.
- Custom CSS transforms (design-token injection, RTL flipping, px→rem).
- CSS minification and optimization in the build.
- Understanding the pipeline under Tailwind or cssnano.

## Core concepts

- **Plugin pipeline.** `postcss([pluginA, pluginB])` — order matters: imports first, then transforms (nesting, custom properties), then autoprefixer, then minify last.
- **Autoprefixer.** Adds vendor prefixes from browserslist data. The reason to keep browserslist current — stale data = unnecessary prefixes or missing ones.
- **`postcss-nesting` / `postcss-nested`.** CSS nesting (now native in browsers — prefer native nesting and let autoprefixer handle the rest, or keep the plugin for older targets).
- **`postcss-import`.** Inline `@import` at build time (must run first). `postcss-url` rebases/embeds asset URLs.
- **`postcss-preset-env`.** "Babel for CSS": future syntax → compatible output, staged by CSS spec maturity. Configure `stage` deliberately.
- **cssnano.** Minification: dedupe, merge rules, shorten values. Run last; `preset: 'default'` is safe, advanced presets can reorder dangerously.
- **Writing plugins.** `(root) => root.walkDecls('color', ...)` — the API is small and pleasant; plugins are just functions over the AST.

## Practical workflow

**1. Config.**
```js
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nesting'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [require('cssnano')({ preset: 'default' })] : []),
  ],
};
```

**2. Wire into the bundler.** Vite: automatic via `postcss.config.js`. webpack: `postcss-loader` after `css-loader`. Standalone: `postcss src/*.css -d dist/ --watch`.

**3. Custom plugin example (design tokens).**
```js
// plugins/px-to-rem.js
module.exports = () => ({
  postcssPlugin: 'px-to-rem',
  Declaration(decl) {
    if (decl.value.includes('px')) {
      decl.value = decl.value.replace(/(\d+)px/g, (_, n) => `${n / 16}rem`);
    }
  },
});
module.exports.postcss = true;
```
Keep custom plugins pure and well-tested — they run on every build.

**4. Verify output.** Build and inspect: prefixes present for your targets? imports inlined? minified in prod only? Check sourcemaps map back correctly.

## Common pitfalls

- **Plugin order.** autoprefixer before nesting = prefixes on un-nested selectors, then nesting breaks them. Order: import → nesting/transforms → autoprefixer → minify.
- **Stale browserslist.** Prefixes for dead browsers bloat CSS; missing prefixes break old targets. Update `browserslist` DB regularly (`npx update-browserslist-db@latest`).
- **Minifying in dev.** cssnano in development slows rebuilds and obscures debugging. Production-only.
- **Double processing.** Both Vite and a manual PostCSS run transforming the same files → duplicated prefixes, broken sourcemaps. One pipeline owns CSS.
- **Native nesting vs plugin.** Modern browsers support nesting natively; the plugin is only needed for older targets — don't pay the transform cost needlessly.
- **`postcss-import` path issues.** Bare imports and aliased paths need `resolve` config; cryptic "failed to find" errors usually mean resolution, not syntax.
- **Forgetting `postcss: true`.** Custom plugins need the flag (or the object form) or PostCSS ignores them silently.
- **Over-transforming.** Each plugin is build time + output risk. If native CSS covers it (nesting, custom properties, `color-mix`), drop the plugin.
