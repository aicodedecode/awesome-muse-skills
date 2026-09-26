---
name: nx-pro
description: Run JS monorepos with Nx: task graph, computation caching, affected commands, generators, and module boundaries. Use when managing large monorepos with enforced architecture.
category: development
---

# Nx Pro

A practical guide to Nx: the task graph, computation caching, affected analysis, code generators, and module-boundary enforcement for large JavaScript/TypeScript monorepos.

## Overview

Nx is a monorepo toolkit with opinions: it computes a **project graph** from your workspace, runs tasks in the right order with **computation caching**, figures out what's **affected** by a change, generates code with **generators**, and enforces architecture with **module boundaries and tags**. Where Turborepo is a thin task runner, Nx is a fuller platform — more power, more concepts to learn.

## When to use

- Large monorepos (dozens of apps/libs) needing enforced architecture.
- Teams wanting code generation (scaffold libs, components consistently).
- CI that must run only affected builds/tests/lints.
- Migrating a messy monorepo toward clear module boundaries.
- Choosing between Nx and lighter runners (Nx pays off at scale; overhead for tiny repos).

## Core concepts

- **Project graph.** Nx infers dependencies between projects from imports (TS path mappings, package.json deps). `nx graph` visualizes it — your first debugging tool.
- **Targets.** Named tasks per project (`build`, `test`, `lint`) configured in `project.json` or `package.json`. Target defaults in `nx.json` apply workspace-wide.
- **Computation caching.** Hash of inputs (files, env, args) → cached outputs, local + remote (Nx Cloud or self-hosted). Like Turborepo, inputs must be complete.
- **Affected.** `nx affected -t build` runs targets only for projects affected by the change vs a base (`main`). The standard CI primitive.
- **Generators.** `nx g @nx/react:lib my-lib` scaffolds projects with correct config, tags, and wiring. Write workspace generators for your org's patterns (new service, new UI package).
- **Tags & module boundaries.** Tag projects (`scope:shared`, `type:ui`) and enforce rules (`@nx/enforce-module-boundaries`): e.g., apps can't import from other apps, `scope:orders` can't import `scope:billing`.
- **Executors.** The actual implementations behind targets (webpack, vite, jest, tsc...). Swappable per project.

## Practical workflow

**1. Inspect the graph first.**
```bash
nx graph              # visualize projects + dependencies
nx show projects      # list
nx show project web --json  # targets for one project
```
If the graph is wrong (missing edges), affected analysis is wrong — fix imports/path mappings.

**2. Run with affected.**
```bash
nx affected -t lint test build --base=origin/main
nx run-many -t build --projects=web,api      # explicit set
nx run web:serve                              # single target
```

**3. Configure target defaults (nx.json).**
```json
{
  "targetDefaults": {
    "build": { "dependsOn": ["^build"], "inputs": ["production", "^production"], "outputs": ["{projectRoot}/dist"] },
    "test": { "inputs": ["default", "^production"] }
  },
  "namedInputs": { "production": ["default", "!{projectRoot}/**/*.spec.ts"] }
}
```

**4. Enforce boundaries.** Tag projects in `project.json`, add the eslint boundary rule, and let CI reject cross-boundary imports. Start permissive, tighten as the architecture settles.

**5. Generate, don't copy-paste.** `nx g` for new libs/components; encode org conventions (test setup, lint config, tags) in a workspace generator so every new project starts correct.

**6. CI.** `nx affected` with remote cache + distributed task execution for large repos. Set `NX_BASE`/`NX_HEAD` (or use the `nrwl/nx-set-shas` action) so affected comparison is right.

## Common pitfalls

- **Stale project graph.** New path mappings or package deps not reflected → wrong affected sets. `nx reset` clears the daemon cache when the graph looks wrong.
- **Implicit deps undeclared.** Cross-project imports that bypass the graph (dynamic requires, unmapped paths) break affected analysis. Make all deps explicit.
- **Cache misses from sloppy inputs.** Same discipline as any cacher: declare files + env; keep builds deterministic.
- **Boundary rules too strict too early.** Enforcing a perfect architecture on day one creates friction and workarounds. Enforce the 2–3 boundaries that matter most first.
- **Generator sprawl.** Dozens of bespoke generators nobody maintains. Keep a few high-value ones; delete the rest.
- **Running everything in CI.** Defeats the purpose — if CI runs all targets always, you have a slow monolith with extra steps. Affected + cache is the whole point.
- **Daemon weirdness.** The Nx daemon speeds things up but can serve stale state after big refactors. `nx reset` is the universal first troubleshooting step.
- **Over-centralization.** Forcing every team onto identical executors/versions creates upgrade gridlock. Allow version ranges where the cost of uniformity exceeds the benefit.
