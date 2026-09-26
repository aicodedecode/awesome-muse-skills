---
name: swc-pro
description: Use SWC for fast transpilation: config, plugins, integration with Next.js/Vite/Rollup, and migration from Babel. Use when replacing Babel or speeding up transforms.
category: development
---

# SWC Pro

A practical guide to SWC (Speedy Web Compiler): the Rust-based platform for JavaScript/TypeScript transformation — configuration, framework integrations, the plugin system, and migrating from Babel without breaking behavior.

## Overview

SWC replaces Babel's transform pipeline with a Rust implementation that's roughly 20x faster, covering parsing, transpiling (TS/JSX → JS), and minification (`swcMinify`). It's the engine behind Next.js's compiler and available as a loader/plugin for webpack, Vite, and Rollup. The mental shift from Babel: **SWC is a single fast binary with a narrower plugin story** — most Babel plugins have no direct equivalent, so migration means re-expressing config, not porting plugins one-to-one.

## When to use

- Speeding up webpack builds (`swc-loader` replacing `babel-loader`).
- Next.js projects (already the default compiler — know how to configure it).
- Vite/Rollup pipelines via `@vitejs/plugin-react-swc` / `rollup-plugin-swc`.
- Minification with `swcMinify` as a terser alternative.
- Evaluating Babel → SWC migration.

## Core concepts

- **`.swcrc`.** JSON config: `jsc.parser` (typescript/tsx, ecmascript/jsx, decorators), `jsc.target` (es2020...), `jsc.transform.react` (runtime: automatic/classic, development), `module.type` (es6/commonjs), `minify`.
- **Parser options.** `syntax: 'typescript'`, `tsx: true`, `decorators: true` (+ `decoratorsBeforeExport` for legacy decorator semantics), `dynamicImport: true`.
- **React transform.** `runtime: 'automatic'` for the new JSX transform; `development: true` adds debug info — must match between dev and build configs or behavior differs.
- **Minifier.** `minify: true` + `jsc.minify` options (compress/mangle). Faster than Terser, comparable output; test mangling on your codebase.
- **Plugins (WASM).** SWC plugins are WebAssembly modules (`@swc/plugin-styled-components`, relay, etc.) — a smaller ecosystem than Babel's; check availability before migrating a plugin-dependent setup.
- **Visitors.** For custom transforms, SWC's Rust visitor API (advanced) — most teams never need this; config + existing plugins suffice.

## Practical workflow

**1. Basic config.**
```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "jsc": {
    "parser": { "syntax": "typescript", "tsx": true, "decorators": true },
    "target": "es2020",
    "transform": { "react": { "runtime": "automatic", "development": false } }
  },
  "module": { "type": "es6" },
  "sourceMaps": true
}
```

**2. webpack integration.**
```js
// replace babel-loader
{ test: /\.[jt]sx?$/, exclude: /node_modules/, use: {
  loader: 'swc-loader',
  options: { jsc: { parser: { syntax: 'typescript', tsx: true }, target: 'es2020',
    transform: { react: { runtime: 'automatic' } } } } } }
```

**3. Next.js.** SWC is default; customize in `next.config.js` (`swcMinify`, `modularizeImports`, `transpilePackages`). styled-components support via `compiler.styledComponents: true`.

**4. Migrate from Babel.**
- Inventory `.babelrc` plugins/presets → map each to SWC config or a WASM plugin.
- Common gaps: custom Babel plugins (rewrite as SWC WASM plugin or drop), `babel-plugin-macros`, specific preset-env targeting (use `jsc.target` + browserslist via `env`).
- Diff build outputs on a sample: bundle size, runtime behavior, sourcemaps. Run the full test suite against SWC-built code.

**5. Verify.** Build → run e2e tests → compare bundle sizes → check sourcemaps resolve in error tracking.

## Common pitfalls

- **Babel plugin has no SWC equivalent.** The #1 migration blocker. Audit plugin usage first; some Babel-isms (macros, custom transforms) must be reimplemented or removed.
- **Decorator semantics.** Legacy vs 2022 decorators differ; mismatched `decorators` config silently changes behavior. Match what your framework expects (Angular vs MobX vs TypeORM differ).
- **Dev/prod transform mismatch.** `development: true` in dev but not prod (or vice versa) causes React warning/behavior differences. Keep the react transform consistent.
- **Assuming type checking.** Like esbuild, SWC strips types without checking. `tsc --noEmit` stays in CI.
- **Minify regressions.** `swcMinify` is excellent but not identical to Terser — property mangling and compress passes can break code relying on function names (e.g., some DI patterns). Test minified builds.
- **`.swcrc` discovery.** SWC reads `.swcrc` from the file's directory upward; monorepos need per-package configs or explicit `options` in loader config — implicit discovery surprises.
- **WASM plugin versioning.** SWC WASM plugins must match the SWC core version. Upgrading SWC without upgrading plugins breaks builds cryptically.
- **Source map quality.** Verify mappings in production error tracking after switching — minifier + transpiler changes can degrade them.
