---
name: babel-pro
description: Configure Babel: presets, plugins, env-specific builds, polyfills, and performance. Use when maintaining Babel-based toolchains or writing custom transforms.
category: development
---

# Babel Pro

A practical guide to Babel: presets and plugins, environment-specific configuration, polyfill strategy, and performance — for the many codebases where Babel is still the transform layer, and for anyone writing custom Babel plugins.

## Overview

Babel transforms JavaScript via a plugin pipeline: **parse → transform (plugins) → generate**. Presets are plugin bundles (`@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`). Babel's strength is its unmatched plugin ecosystem and precise targeting; its weakness is speed (JS-based, single-threaded per file). Modern guidance: keep Babel where its plugins earn their keep, use faster tools elsewhere.

## When to use

- Maintaining CRA-era, Jest, or custom webpack Babel pipelines.
- Custom syntax transforms (Babel plugins for codemods or DSLs).
- Precise browser targeting with `preset-env` + `core-js` polyfills.
- React Native / Metro bundler setups (Babel-based).
- Deciding what stays on Babel vs moves to SWC/esbuild.

## Core concepts

- **Config files.** `babel.config.js` (root, monorepo-wide) vs `.babelrc` (per-package, file-relative). Root config is the modern default; `.babelrc` doesn't apply to files outside its package.
- **`preset-env`.** Compiles based on `targets` (browserslist): only transforms what targets lack. `bugfixes: true` for smaller output; `shippedProposals` for stable proposals.
- **Polyfills.** `core-js` via `useBuiltIns: 'usage'` (inject per-file, needs `corejs` version set) or `'entry'` (whole bundle). `usage` + pinned core-js version = smallest correct output.
- **Plugin ordering.** Plugins run before presets; within, ordering matters (e.g., decorators before class properties). `@babel/plugin-proposal-decorators` `version: '2023-11'` vs legacy — pick deliberately.
- **`env` option.** Different config per `BABEL_ENV`/`NODE_ENV` (test vs development vs production): e.g., istanbul only in test, minification-related plugins only in production.
- **Caching.** `babel-loader` `cacheDirectory: true`; Jest caches transforms. First build is slow; warm cache should be fast — if not, investigate.
- **Writing plugins.** Visitor pattern on the AST (`path.replaceWith`, `path.remove`); `@babel/types` builders; always write tests with `@babel/core` transform snapshots.

## Practical workflow

**1. Baseline config.**
```js
// babel.config.js
module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);
  const isTest = api.env('test');
  return {
    presets: [
      ['@babel/preset-env', { targets: isTest ? { node: 'current' } : '> 0.5%, not dead', bugfixes: true,
        useBuiltIns: 'usage', corejs: { version: '3.36', proposals: false } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
    ],
  };
};
```

**2. Browserslist.** Define targets once (`.browserslistrc` or package.json) — preset-env, Autoprefixer, and eslint all read it. One source of truth.

**3. Test transform.** `npx babel src/index.ts --out-file /tmp/out.js` and inspect: are helpers duplicated per file? (`@babel/plugin-transform-runtime` dedupes helpers via `@babel/runtime` — use it for libraries.)

**4. Library authors.** Use `@babel/plugin-transform-runtime` (no global polyfill pollution) instead of `useBuiltIns: 'usage'` (which pollutes globals — fine for apps, bad for libraries).

**5. Custom plugin (when needed).**
```js
module.exports = () => ({
  visitor: {
    Identifier(path) {
      if (path.node.name === 'DEBUG' && !process.env.DEBUG) path.replaceWith(t.booleanLiteral(false));
    },
  },
});
```
Keep plugins small, pure, and tested — AST transforms are a maintenance liability.

## Common pitfalls

- **Double transpilation.** Babel + TypeScript + bundler each transforming → slow builds and subtle bugs. One TS strip (preset-typescript or tsc), one syntax transform.
- **Helper duplication.** Without transform-runtime, helpers inline per file — bloat in libraries. Apps: fine; libraries: use the runtime.
- **Wrong core-js version.** `corejs: 3` floating vs locked `3.36` — floating changes polyfill behavior between installs. Pin it.
- **Polyfilling libraries.** `useBuiltIns: 'usage'` in a published library pollutes consumers' globals. Libraries use transform-runtime; apps use usage/entry.
- **`.babelrc` vs `babel.config.js` confusion.** `.babelrc` lookup stops at package boundaries — monorepo files outside the package silently get no config. Prefer root `babel.config.js`.
- **Env-specific bugs.** `api.env('test')` branches that change semantics (not just speed) cause "tests pass, prod breaks". Keep env branches to instrumentation/caching.
- **Plugin ordering.** Decorators/class-properties/static-blocks ordering issues produce cryptic errors. Follow the documented order for proposal plugins.
- **Staying on Babel for speed-critical paths.** If Babel is the build bottleneck and no Babel-only plugin is needed, that's the signal to move that step to SWC/esbuild.
