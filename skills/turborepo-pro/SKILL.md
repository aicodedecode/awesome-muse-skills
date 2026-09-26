---
name: turborepo-pro
description: Manage JS monorepos with Turborepo: task pipelines, caching, affected builds, and workspace conventions. Use when orchestrating builds/tests across multiple packages.
category: development
---

# Turborepo Pro

A practical guide to Turborepo: defining task pipelines across a JavaScript/TypeScript monorepo, getting remote caching right, running only affected work, and the workspace conventions that keep monorepos fast and sane.

## Overview

Turborepo orchestrates tasks (build, test, lint) across monorepo packages with two superpowers: **a task graph** (packages build in dependency order, independent tasks run in parallel) and **caching** (identical inputs → skip the work, locally or via remote cache shared across the team/CI). It's intentionally thin — it doesn't manage dependencies or publishing; it makes `package.json` scripts fast and correct.

## When to use

- Monorepos with multiple apps/packages sharing code (npm/yarn/pnpm workspaces).
- Slow CI: caching build/test outputs across runs and developers.
- Running tasks in dependency order without hand-rolled scripts.
- "Affected" workflows: only build/test what changed.

## Core concepts

- **Workspaces.** The package manager's workspace feature (`package.json` `workspaces`, or pnpm's). Turborepo reads the graph from it — one package.json per package, internal deps via `workspace:*` (pnpm) or plain versions.
- **Pipeline (`turbo.json`).** Tasks with `dependsOn` (e.g., `build` depends on `^build` = dependencies' builds first) and `inputs`/`outputs` (what invalidates the cache). Getting inputs/outputs right is 80% of Turborepo value.
- **Caching.** Content-hash of inputs; hit = skip task and replay outputs. Local cache by default; remote cache (Vercel's or self-hosted) shares across machines/CI.
- **Affected.** `--filter=[HEAD^1...HEAD]` runs tasks only for changed packages and their dependents. The backbone of fast monorepo CI.
- **Filtering.** `--filter=web...` (web + dependencies), `--filter=...ui` (ui + dependents), `--filter=!docs` (exclude). Learn the microsyntax; it's the daily driver.
- **Env vars as inputs.** Tasks reading env vars must declare them (`env: ["DATABASE_URL"]`) or the cache silently serves stale results.

## Practical workflow

**1. Structure.**
```
apps/web        # deployables
apps/api
packages/ui     # shared component library
packages/config # shared eslint/tsconfig
packages/utils  # shared logic
turbo.json
```

**2. Define the pipeline.**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "inputs": ["src/**", "package.json", "tsconfig.json"], "outputs": ["dist/**"] },
    "test":  { "dependsOn": ["^build"], "inputs": ["src/**", "tests/**"] },
    "lint":  { "inputs": ["src/**", ".eslintrc*"] },
    "dev":   { "cache": false, "persistent": true }
  }
}
```

**3. Run.**
```bash
turbo run build --filter=web...        # build web and its deps
turbo run test lint --filter=[HEAD^1]  # CI: affected tests+lint
turbo run dev --filter=web             # persistent dev tasks aren't cached
```

**4. Enable remote caching.** Link the repo (`turbo login` / `turbo link`) so CI and teammates share cache hits. Verify with `turbo run build --dry=json` that the graph looks right before relying on it.

**5. CI pattern.** Install → `turbo run build test lint --filter=[origin/main...HEAD]` → deploy affected apps. Cache hits make unchanged packages near-instant.

## Common pitfalls

- **Wrong inputs/outputs.** Missing an input (e.g., a config file) = stale cache hits serving old builds. Missing outputs = cache restores nothing and downstream tasks fail. Audit both per task.
- **Undeclared env vars.** `NEXT_PUBLIC_*` or API keys read at build time but not in `env` → cached build with the wrong values. Declare every env var each task reads.
- **Caching dev servers.** `dev` tasks must have `cache: false` + `persistent: true`, or Turbo will try to cache a never-ending process.
- **Non-deterministic builds.** Timestamps, random IDs, or absolute paths in outputs poison the cache (every run "changes" outputs). Make builds deterministic.
- **Over-filtering in CI.** Filtering too aggressively skips packages that actually changed via undeclared dependencies. Prefer explicit internal deps over implicit imports.
- **One giant package.** Turborepo can't parallelize inside a package. Split by domain so the graph has real parallelism.
- **Ignoring `--dry`.** `--dry=json` shows exactly what will run and why — use it when the pipeline behaves unexpectedly instead of guessing.
- **Cache poisoning from local.** A developer's dirty local cache uploaded to remote can poison CI. Scope remote writes to CI, or at least to clean checkouts.
