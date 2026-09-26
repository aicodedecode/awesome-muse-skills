---
name: vite-pro
description: Build and optimize with Vite: dev server, plugins, library mode, env handling, code splitting, and production tuning. Use when developing or deploying Vite-based apps.
category: development
---

# Vite Pro

A practical guide to Vite: the dev server, plugin system, build optimization, library mode, environment variables, and the production tuning that keeps bundles lean and builds fast.

## Overview

Vite's core insight: during development, serve ES modules natively to the browser (no bundling — instant startup, HMR per-module); for production, bundle with Rollup (or Rolldown in newer versions). Pre-bundling dependencies with esbuild removes the biggest dev bottleneck. The result is a dev loop measured in milliseconds and a production build that's a standard optimized bundle.

## When to use

- React/Vue/Svelte/vanilla SPAs and MPAs.
- Libraries (library mode with externalized deps).
- Replacing webpack/CRA-era toolchains for speed.
- SSR setups (Vite's SSR module runner) and multi-page apps.

## Core concepts

- **Dev vs build.** Dev = native ESM + HMR via the dev server; `vite build` = Rollup bundle. Code must work under both — beware dev-only behaviors.
- **Dependency pre-bundling.** `optimizeDeps` converts CJS/UMD deps to ESM once and caches. `optimizeDeps.include/exclude` fixes the occasional misbehaving dep.
- **HMR.** Hot Module Replacement via `import.meta.hot`. Framework plugins handle components; custom HMR (`hot.accept`) for vanilla modules.
- **Plugins.** The Rollup-compatible plugin API (`resolveId`, `load`, `transform`). `enforce: 'pre'`, `apply: 'serve'` control ordering/scope. The ecosystem (official framework plugins, PWA, image tools) covers most needs.
- **Env variables.** `VITE_`-prefixed vars exposed via `import.meta.env`; everything else stays server-side. `.env.[mode]` files; never put secrets in `VITE_` vars (they ship to the browser).
- **Code splitting.** `build.rollupOptions.output.manualChunks` for vendor splitting; dynamic `import()` for route-level splitting. Vite splits async chunks automatically.
- **Library mode.** `build.lib` outputs ESM/CJS/UMD with externals — for publishing reusable packages.

## Practical workflow

**1. Scaffold & configure.**
```bash
npm create vite@latest my-app -- --template react-ts
```
```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: { output: { manualChunks: { vendor: ['react', 'react-dom'] } } },
  },
  server: { proxy: { '/api': 'http://localhost:3000' } }, // dev API proxy
});
```

**2. Dev loop.** `vite` → instant start; edit → HMR preserves state. Use the `/@vite/client` overlay errors — fix the first error shown, it's usually the root cause.

**3. Env discipline.** `.env` (local), `.env.production` (build-time). Access via `import.meta.env.VITE_API_URL`. Validate required vars at startup and fail fast with a clear message.

**4. Optimize the build.**
```bash
vite build --mode production
npx vite-bundle-visualizer   # or rollup-plugin-visualizer: find the fat
```
Checklist: route-level `import()`, vendor chunk sane, images compressed + modern formats, `target` not lower than needed.

**5. Preview before shipping.** `vite preview` serves the production build locally — catches base-path, env, and chunk issues that dev hides.

**6. Deploy.** Static output in `dist/`; set `base: '/subpath/'` if not served from root; configure SPA fallback (all routes → index.html) on the host.

## Common pitfalls

- **Secrets in `VITE_` vars.** Anything `VITE_`-prefixed is embedded in client JS. Public config only; secrets stay server-side.
- **Dev/build divergence.** Aliases, globals, or CJS interop that work in dev can break in the Rollup build. Always `vite build && vite preview` before shipping.
- **Missing file extensions in imports.** ESM-strict dev requires them in some setups; be consistent.
- **Huge vendor chunk.** One `vendor.js` with everything defeats caching. Split by stability (framework vs rarely-changed libs) or just rely on async chunks.
- **Unoptimized deps.** A CJS-only dependency slowing dev to a crawl → `optimizeDeps.include`, or replace the dep.
- **`base` misconfigured.** Assets 404ing on a subpath deploy = wrong `base`. Set it to the actual served path.
- **Top-level await / workers quirks.** Fine in modern targets, but verify the production build — dev's leniency hides syntax/target issues.
- **Ignoring the visualizer.** Bundle regressions creep in via new deps. Check bundle composition on a schedule, not just when it's slow.
- **SSR pitfalls.** `ssr.noExternal` / `ssr.external` tuning for deps that assume DOM; separate client/server entry handling.
