---
name: webpack-pro
description: Configure webpack for complex builds: loaders, plugins, code splitting, caching, Module Federation, and build performance. Use when maintaining or optimizing webpack setups.
category: development
---

# Webpack Pro

A practical guide to webpack for the teams that still run it (which is many): loaders and plugins, code splitting, long-term caching, Module Federation, and build-performance tuning — plus knowing when to migrate away.

## Overview

webpack bundles everything through a graph of **loaders** (transform files: TS→JS, SCSS→CSS, images→URLs) and **plugins** (bundle-level work: HTML generation, env injection, minification). Its power is configurability; its cost is complexity and build speed. Modern practice: keep configs minimal, lean on defaults, and only reach for webpack-specific features (Module Federation, deep customization) when they earn their keep.

## When to use

- Maintaining existing webpack builds (Create React App ejections, legacy apps).
- Module Federation for micro-frontends.
- Highly custom build pipelines (custom loaders/plugins).
- Build performance triage on slow webpack setups.
- Deciding webpack vs Vite/esbuild for a new project (usually: choose the simpler tool unless you need webpack-only features).

## Core concepts

- **Entry/output.** Entry points seed the module graph; output controls filenames, paths, and chunk naming. `[contenthash]` in filenames = long-term caching.
- **Loaders.** `module.rules`: `test` (file pattern) → `use` (loader chain, applied right-to-left). `babel-loader`, `ts-loader`/`swc-loader`, `css-loader`+`style-loader`/`MiniCssExtractPlugin`, `asset modules` for files.
- **Plugins.** `HtmlWebpackPlugin` (generate HTML), `DefinePlugin` (compile-time constants — mind string quoting), `MiniCssExtractPlugin` (CSS files in prod), `CopyPlugin` (static assets).
- **Code splitting.** `optimization.splitChunks` (vendor/common chunks), dynamic `import()` (async chunks), `runtimeChunk: 'single'` (stable runtime for caching).
- **Caching.** `[contenthash]`, `cache: { type: 'filesystem' }` (persistent build cache — the single biggest build-speed win), deterministic module/chunk IDs.
- **Module Federation.** `ModuleFederationPlugin`: remotes expose modules, hosts consume them at runtime — micro-frontends with shared dependencies. Version alignment of shared deps (`react`, singleton) is the make-or-break detail.
- **Dev server.** `webpack-dev-server` with HMR; `proxy` for API backends.

## Practical workflow

**1. Baseline config.**
```js
// webpack.config.js
module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    entry: './src/index.ts',
    output: { path: path.resolve(__dirname, 'dist'), filename: isProd ? '[name].[contenthash].js' : '[name].js', clean: true },
    cache: { type: 'filesystem' },
    module: { rules: [
      { test: /\.tsx?$/, use: 'swc-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'] },
      { test: /\.(png|svg)$/, type: 'asset', parser: { dataUrlCondition: { maxSize: 8 * 1024 } } },
    ]},
    plugins: [ new HtmlWebpackPlugin({ template: './public/index.html' }), ...(isProd ? [new MiniCssExtractPlugin()] : []) ],
    optimization: { splitChunks: { chunks: 'all' }, runtimeChunk: 'single' },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    devServer: { hot: true, historyApiFallback: true, proxy: { '/api': 'http://localhost:3000' } },
  };
};
```

**2. Speed triage.** Enable filesystem cache → replace `ts-loader`/`babel-loader` with `swc-loader` → narrow `test`/`include` so loaders skip `node_modules` → `webpack-bundle-analyzer` for bundle, `--progress` + `speed-measure-webpack-plugin` for build profile.

**3. Federation (when needed).**
```js
new ModuleFederationPlugin({
  name: 'host', remotes: { shop: 'shop@https://shop.cdn/remoteEntry.js' },
  shared: { react: { singleton: true, requiredVersion: '^18.0.0' } },
});
```
Singleton + version alignment for shared libs; handle remote load failure with error boundaries/fallbacks.

**4. Long-term caching check.** Build twice with a one-line change: only the changed chunk's hash should change. If vendor rehashes, something non-deterministic (or misordered modules) broke it.

## Common pitfalls

- **No persistent cache.** Rebuilding from scratch every time is the #1 avoidable slowness. `cache: { type: 'filesystem' }` first, questions later.
- **babel-loader on everything.** Transpiling `node_modules` or using babel where swc suffices doubles build time. Scope loaders tightly.
- **`DefinePlugin` quoting.** `new DefinePlugin({ API_URL: '"https://x"' })` — values are code fragments; forget the inner quotes and you inject a bare identifier.
- **Contenthash instability.** Plugins injecting timestamps/randomness rehash everything. Audit with double builds.
- **Federation version skew.** Host on React 18, remote on React 17, non-singleton shared → two Reacts → hooks break mysteriously. Align and enforce singletons.
- **Huge bundles unexamined.** No analyzer in the workflow = silent bloat. Run the analyzer on a schedule.
- **Dev/prod config drift.** Two configs diverging until prod-only bugs appear. One config function with `isProd` branches beats two files.
- **Source maps in prod.** `eval-*` devtool in production leaks source or breaks; use `source-map` (uploaded to error tracking, not served) or `hidden-source-map`.
- **Staying on webpack out of inertia.** If the only reason is history and builds are painful, a Vite migration is often a few days' work — cost it honestly.
