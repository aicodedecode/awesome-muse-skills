---
name: rollup-pro
description: Bundle libraries and apps with Rollup: plugins, tree-shaking, multi-format output, code splitting, and watch mode. Use when building distributable JS libraries.
category: development
---

# Rollup Pro

A practical guide to Rollup: the bundler of choice for JavaScript libraries — plugin pipeline, tree-shaking, multi-format output (ESM/CJS), code splitting, and configs that produce clean, minimal distributables.

## Overview

Rollup pioneered ES-module-first bundling and tree-shaking: it understands `import`/`export` statically and drops unused code aggressively. That's why most JS libraries ship Rollup-built bundles. For apps, Vite uses Rollup under the hood for production builds — so Rollup knowledge transfers directly to Vite build tuning.

Core idea: **flat, scope-hoisted bundles with dead code eliminated**, in whatever module formats your consumers need.

## When to use

- Building publishable libraries (components, utilities, SDKs).
- Multi-format output: ESM for bundlers, CJS for Node, UMD/IIFE for script tags.
- Tree-shaking-sensitive packages (every byte ships to consumers).
- Custom Vite production build tuning (Vite exposes Rollup options).

## Core concepts

- **Plugins.** `resolveId`/`load`/`transform` hooks; the standard set: `@rollup/plugin-node-resolve` (bare imports), `@rollup/plugin-commonjs` (CJS deps), `@rollup/plugin-typescript` or `rollup-plugin-esbuild`/`swc` (transpile), `@rollup/plugin-terser` (minify), `@rollup/plugin-dts` (type bundles).
- **Input/output.** One or many inputs; output per format with `format: 'es' | 'cjs' | 'umd' | 'iife'`. `preserveModules` keeps file structure (better tree-shaking for consumers).
- **External.** Dependencies consumers provide (`peerDependencies` like react): mark `external` so they're imported, not bundled. `external: [/^react/]` patterns or auto via `rollup-plugin-peer-deps-external`.
- **Tree-shaking.** Works on ESM; `sideEffects: false` in package.json lets bundlers drop unused modules confidently. Mark genuinely side-effectful files (CSS imports, polyfills) explicitly.
- **Code splitting.** Multiple inputs or dynamic imports → shared chunks. `manualChunks` for control.
- **Watch mode.** `rollup -c -w` for library development with fast rebuilds.

## Practical workflow

**1. Config for a library.**
```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';

const external = ['react', 'react-dom', /^react\//];

export default [
  {
    input: 'src/index.ts',
    external,
    output: [
      { file: 'dist/index.js', format: 'cjs', sourcemap: true },
      { file: 'dist/index.mjs', format: 'es', sourcemap: true },
    ],
    plugins: [resolve(), commonjs(), esbuild({ target: 'es2020' })],
  },
  {
    input: 'src/index.ts',
    external,
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
```

**2. package.json wiring.**
```json
{
  "main": "./dist/index.js", "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts", "sideEffects": false,
  "files": ["dist"]
}
```

**3. Verify the output.** Check: no bundled react (search dist), tree-shaking works (import one function → bundle has one function), `.d.ts` resolves, `attw --pack` (Are The Types Wrong) passes for types correctness.

**4. Dual-package care.** CJS + ESM from one source: avoid `__dirname`/`require` in ESM output; test both entry points in Node.

## Common pitfalls

- **Bundling peer deps.** Forgetting `external` for react/lodash → consumers get duplicate copies → hooks break, bundles bloat. Externalize all peerDependencies.
- **CJS interop.** `import x from 'cjs-lib'` may need `commonjs()` + named-export interop; default imports of CJS modules are a classic breakage. Test the built output, not just source.
- **`sideEffects: false` lies.** Marking false while a module does global setup (registers custom elements, patches prototypes) lets bundlers drop it. Be honest per-file: `"sideEffects": ["*.css", "./src/polyfills.js"]`.
- **Missing `.d.ts` bundling.** Shipping unbundled or broken types. Use the dts plugin and verify with `attw`.
- **UMD global name collisions.** For script-tag builds, pick a distinctive `output.name`; document it.
- **Watching node_modules.** Default watch can be slow/noisy — configure `watch.exclude`.
- **Circular imports.** Rollup warns; circular ESM often works but CJS output can break (temporal dead zone). Eliminate cycles rather than suppressing warnings.
- **Minifying libraries.** Usually don't minify library output — consumers' bundlers minify. Ship readable code + sourcemaps.
