---
name: pnpm-pro
description: Master pnpm: workspaces, content-addressable store, strict node_modules, catalogs, and monorepo workflows. Use when managing JS dependencies with pnpm.
category: development
---

# pnpm Pro

A practical guide to pnpm: the content-addressable store, strict `node_modules` layout, workspaces, catalogs, and the commands and config that make pnpm fast and correct in single repos and monorepos.

## Overview

pnpm's headline features are speed and disk efficiency (one global content-addressable store, hard links into projects), but its most important property is **strictness**: packages can only access their declared dependencies — no phantom dependencies from hoisting. Code that works under npm/yarn's flat `node_modules` often breaks under pnpm, and that's pnpm telling you about a real bug in your dependency declarations.

## When to use

- Any JS/TS project where install speed and disk usage matter.
- Monorepos (pnpm workspaces are the best-in-class workspace implementation).
- Eliminating phantom dependencies and enforcing correct dependency declarations.
- CI optimization via store caching.

## Core concepts

- **Content-addressable store.** One copy of each package version on disk (`~/.pnpm-store`), hard-linked into projects. Installs are fast; disk usage stays flat across projects.
- **Strict node_modules.** `node_modules/.pnpm` holds isolated package dirs; your project's `node_modules` contains only direct dependencies (symlinked). `require('undeclared-dep')` fails — by design.
- **Workspaces.** `pnpm-workspace.yaml` defines packages; `workspace:*` protocol links internal deps. `pnpm -r` / `--filter` run across packages.
- **Catalogs.** `pnpm-workspace.yaml` `catalogs:` pin shared versions (e.g., all packages use `typescript@catalog:`) — one place to bump React/TypeScript across the monorepo.
- **`pnpm-lock.yaml`.** Single lockfile at the workspace root. Commit it; CI uses `pnpm install --frozen-lockfile`.
- **`package-manager` field.** `"packageManager": "pnpm@9.x"` in root package.json + corepack pins the version for everyone.
- **Side-effects cache.** pnpm tracks packages with install scripts; configurable allowlists keep installs reproducible.

## Practical workflow

**1. Setup.**
```bash
corepack enable && corepack prepare pnpm@latest --activate
pnpm init
# package.json: "packageManager": "pnpm@9.12.0"
```

**2. Daily commands.**
```bash
pnpm add react                 # dependency
pnpm add -D typescript         # devDependency
pnpm add -w lodash             # workspace root
pnpm --filter web add ../ui    # internal dep via workspace:*
pnpm -r run build               # recursive
pnpm --filter "...[main]" test # changed since main (with git)
pnpm dedupe                    # minimize duplicate versions
pnpm why react                 # who depends on react
pnpm store prune               # clean unused store entries
```

**3. Workspaces.**
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
catalog:
  react: ^18.3.1
  typescript: ^5.5.0
```
```json
// packages/ui/package.json
{ "dependencies": { "react": "catalog:" } }
```

**4. CI.**
```yaml
- uses: pnpm/action-setup@v4
- uses: actions/cache@v4
  with: { path: ~/.pnpm-store, key: pnpm-store-${{ hashFiles('pnpm-lock.yaml') }} }
- run: pnpm install --frozen-lockfile
```

**5. Fixing strictness errors.** `Cannot find module 'x'` under pnpm usually means: add `x` to that package's dependencies (it was a phantom dep before). Use `pnpm add x` in the right package — don't fight the strictness.

## Common pitfalls

- **Phantom dependencies.** Code importing undeclared packages worked under npm/yarn, breaks under pnpm. Fix by declaring, not by `shamefully-hoist`.
- **`shamefully-hoist=true` as a crutch.** It reintroduces the flat layout and its bugs. Use `public-hoist-pattern` surgically for the rare tool that needs it (or fix the tool's packaging).
- **Lockfile drift.** Editing package.json by hand without running `pnpm install` leaves the lockfile stale; CI `--frozen-lockfile` then fails. Always install after edits.
- **Forgetting `--frozen-lockfile` in CI.** Without it, CI can silently resolve different versions than local. Always frozen in CI.
- **Peer dependency surprises.** pnpm is strict about peers; auto-install-peers defaults help, but conflicting peer ranges need explicit overrides (`pnpm.overrides`).
- **Scripts needing hoisted bins.** Tools expecting their binaries hoisted: pnpm links `.bin` for direct deps only. Declare the tool as a dependency where it's used.
- **Store bloat.** The global store grows forever; `pnpm store prune` periodically, especially on CI runners with persistent disks.
- **Node version mismatch.** pnpm doesn't manage Node. Pair with `.nvmrc`/volta or a container so everyone (and CI) runs the same Node.
