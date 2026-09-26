---
name: esbuild-pro
description: Use esbuild for extreme-speed builds: bundling, transforming, plugins, and integration into larger pipelines. Use when build speed is the bottleneck.
category: development
---

# esbuild Pro

A practical guide to esbuild: the Go-written bundler/transformer that's 10–100x faster than JS-based tools — CLI and JS API, bundling, plugins, and how it slots into bigger pipelines (Vite dev, build scripts, CLIs).

## Overview

esbuild does one thing extraordinarily well: **transform and bundle JavaScript/TypeScript fast**, by being written in Go with parallelism from the ground up. It's intentionally narrower than webpack/Rollup (no type checking, limited HMR story, simpler plugin model). Use it where speed matters most: dev transforms, CLI bundling, build-script steps, and as the engine inside other tools.

## When to use

- Bundling CLIs, scripts, and server code where startup speed matters.
- Replacing `tsc`/`babel` in build pipelines for transpile-only steps.
- Vite dev dependency optimization (esbuild under the hood — knowing it helps debug).
- One-off bundling tasks and code transforms in scripts.
- NOT for: type checking (it strips types without checking), complex code splitting, or plugin-heavy custom pipelines.

## Core concepts

- **Transform vs build.** `esbuild.transform` converts one file (TS→JS, JSX→JS, minify); `esbuild.build` bundles a graph. Transforms don't type check — pair with `tsc --noEmit` in CI.
- **Platform & format.** `platform: 'node' | 'browser' | 'neutral'`, `format: 'esm' | 'cjs' | 'iife'`. Node platform auto-externalizes builtins; browser needs explicit handling.
- **Target.** `target: 'es2020'` / `'node18'` controls syntax downleveling. Higher target = less transform = faster + smaller.
- **Loaders.** `.ts`, `.tsx`, `.jsx`, `.json`, `.css`, `.txt`, binary (`file`/`dataurl`/`copy`) — per-extension handling, overridable.
- **Plugins.** `onResolve`/`onLoad` hooks — simpler than Rollup's model but enough for aliases, virtual modules, env injection.
- **Watch & serve.** `--watch` rebuilds; the JS API's `context()` enables watch + serve with incremental rebuilds (millisecond re-bundles).
- **Metafile.** `--metafile=meta.json` + analyzer shows what's in the bundle — essential for bloat hunting.

## Practical workflow

**1. CLI quick wins.**
```bash
esbuild src/index.ts --bundle --platform=node --format=cjs --target=node18 --outfile=dist/cli.js --minify
esbuild src/app.tsx --bundle --minify --sourcemap --target=es2020 --outfile=dist/app.js --loader:.png=file
```

**2. Build script (JS API).**
```js
// build.mjs
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  outfile: 'dist/index.js',
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  external: ['fsevents'],           // native deps stay external
  metafile: true,
});
```

**3. Dev watch.**
```js
const ctx = await esbuild.context({ /* options */ });
await ctx.watch();
```

**4. Type checking alongside.**
```bash
esbuild src/index.ts --bundle --outfile=dist/index.js & tsc --noEmit
# or in CI: run both, fail on either
```

**5. Analyze.** Generate the metafile, drop into an analyzer, and check for: duplicated deps, accidentally bundled Node builtins (browser builds), oversized chunks.

## Common pitfalls

- **Assuming type checking.** esbuild happily bundles type errors. `tsc --noEmit` in CI is mandatory, not optional.
- **Node builtins in browser bundles.** `platform: 'browser'` doesn't polyfill `fs`/`path` — imports fail at runtime. Either avoid them or shim explicitly.
- **Bundling native modules.** `fsevents`, `esbuild` itself, DB drivers with native bindings must be `external` — bundling them breaks loading.
- **`__dirname` in ESM output.** ESM has no `__dirname`; esbuild won't inject it. Use `import.meta.url`-based paths or stay CJS for Node scripts.
- **CSS limitations.** esbuild bundles CSS but doesn't do advanced processing (no autoprefixer, limited nesting). Pair with PostCSS/Lightning CSS for serious CSS pipelines.
- **Plugin ordering surprises.** Fewer hooks than Rollup — complex multi-stage transforms may not fit. Know when to graduate to Rollup.
- **Ignoring the metafile.** "Why is my CLI 40MB?" — the metafile answers in seconds. Check it when size surprises you.
- **Minify + sourcemap mismatch.** Ship sourcemaps to error tracking, not to users; verify stack traces resolve after minification.
