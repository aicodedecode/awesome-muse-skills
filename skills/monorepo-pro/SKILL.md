---
name: monorepo-pro
description: Run effective monorepos: workspace layout, task orchestration, versioning, CI scaling, and code sharing. Use when setting up or managing monorepos.
category: development
---

# Monorepo Pro

## Overview

A monorepo — **many projects in one repository** — buys atomic cross-project changes, unified
tooling, and easy code sharing, at the price of build/CI complexity at scale. Professional monorepo
management means structuring workspaces clearly, orchestrating tasks with dependency awareness,
scaling CI with affected-only builds, and versioning deliberately.

The through-line: one repo should make cross-cutting changes *easier* — if it makes everything
slower, the tooling (not the idea) is wrong.

## When to use

- Setting up a new monorepo (Turborepo, Nx, Bazel, pnpm/npm workspaces).
- Scaling CI as a monorepo grows (affected builds, remote caching).
- Deciding versioning strategy (fixed vs independent).
- Structuring shared libraries vs applications.
- Debugging slow builds or tangled cross-package dependencies.

## Core concepts

- **Workspace layout.** `apps/` (deployables) + `packages/` (shared libraries: ui, config, utils)
  is the standard shape. Clear naming (`@acme/ui`), explicit `package.json` dependencies between
  workspace packages — no reaching across via relative imports.
- **Task orchestration.** Build/test/lint as a dependency graph: `turbo run build` or `nx run-many`
  topologically orders packages and parallelizes. Task inputs/outputs declared for correct caching —
  wrong cache keys are the monorepo's silent correctness killer.
- **Affected-only CI.** On a PR touching `packages/ui`, rebuild/test only dependents of `ui` (+ the
  package itself). `nx affected` / `turbo --filter=...[HEAD^]` — without this, CI time grows with
  repo size instead of change size.
- **Remote caching.** Share build artifacts across machines/CI runs — the difference between
  "monorepo CI takes 40 minutes" and "4 minutes." Worth setting up early; it's the highest-ROI
  monorepo investment.
- **Versioning strategy.** Fixed/lockstep (all packages version together — simple, good for tightly
  coupled apps) vs independent (each package versions separately — needed for published libraries).
  Changesets (`changeset` workflow) make versioning + changelogs reviewable per PR.
- **Boundaries as code.** No circular dependencies between packages (enforce with lint rules like
  `import/no-cycle` or Nx's module boundaries); public APIs per package via explicit exports
  (`package.json` exports map); internal packages marked `private`.

## Practical workflow

1. **Choose the orchestrator for your scale.** npm/pnpm workspaces + Turborepo for most teams;
   Nx for richer generators and affected-graph needs; Bazel only at true massive scale (its
   complexity is a full-time job).
2. **Lay out the repo.** `apps/*`, `packages/*`, shared configs (`tsconfig.base.json`, eslint
   presets, prettier) as packages consumed by all. One lockfile at root; one package manager.
3. **Declare task pipelines.** `build` depends on `^build` (dependencies first); `test`/`lint`
   parallel; dev tasks persistent (not cached). Get the DAG right before optimizing.
4. **Set up CI affected-first.** PR pipeline: compute affected projects → run their build/test/lint;
   main pipeline: full verification + publish. Remote cache wired for both.
5. **Manage changes with changesets.** Each PR that changes a published package includes a
   changeset (patch/minor/major + description); release PRs generated automatically with changelogs.
6. **Guard the boundaries.** Lint rules forbidding: circular deps, deep imports into package
   internals (`@acme/ui/src/button` — only public exports), apps importing from other apps.

Repo sketch:

```text
acme/
├── apps/
│   ├── web/          # Next.js marketing site
│   └── dashboard/    # Next.js app
├── packages/
│   ├── ui/           # @acme/ui — shared components
│   ├── config/       # @acme/config — eslint/tsconfig presets
│   ├── utils/        # @acme/utils — shared logic
│   └── db/           # @acme/db — prisma client + migrations
├── package.json      # workspaces: ["apps/*", "packages/*"]
├── turbo.json        # pipeline: build ^build, test, lint, dev (persistent)
└── .changeset/       # versioning workflow
```

## Common pitfalls

- **No affected detection.** Running the entire repo's tests on every PR — CI grows linearly with
  repo size until developers stop waiting for it (then stop trusting it).
- **Cache poisoning.** Wrong task inputs (missing env vars, undeclared file deps) → stale cache
  hits → "works in CI, broken in prod." Declare inputs completely; when in doubt, verify with
  `--force` periodically.
- **Circular dependencies.** Package A imports B imports A — works until the build graph can't
  order it. Lint-ban cycles; extract shared bits to package C.
- **Versioning chaos.** Publishing packages with manual version bumps and forgotten changelogs.
  Changesets make it mechanical and reviewable.
- **Apps importing app code.** `apps/web` importing from `apps/dashboard/src` — extract to
  `packages/`. Apps are deployables; sharing goes through packages.
- **One giant shared package.** `@acme/common` with 500 unrelated utilities — becomes a change
  magnet that invalidates every cache. Split by cohesion (ui, utils, config are separate for a reason).
- **Tooling monoculture forced.** Requiring every app to use identical frameworks "because
  monorepo." The repo is shared; the stacks can differ where justified — the orchestrator handles it.
