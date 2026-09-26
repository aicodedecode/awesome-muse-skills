---
name: yarn-pro
description: Use Yarn effectively: Berry vs Classic, Plug'n'Play, workspaces, constraints, and release workflows. Use when managing JS dependencies with Yarn.
category: development
---

# Yarn Pro

A practical guide to Yarn — primarily modern Yarn Berry (v2+): Plug'n'Play, workspaces, constraints, and the release workflow, plus notes for teams still on Yarn Classic (v1).

## Overview

Yarn Berry rethought package management: **Plug'n'Play (PnP)** eliminates `node_modules` entirely (packages load from zip archives via a loader), **constraints** enforce workspace consistency with Prolog-like rules, and **releases** are checked into the repo (`yarn set version`) so everyone runs the identical Yarn. It's powerful but opinionated — editor SDKs and some tools need explicit setup for PnP.

Know which Yarn you have: `yarn --version` — v1.x is Classic (node_modules, still common), v2+ is Berry.

## When to use

- Monorepos wanting strong consistency guarantees (constraints) and fast installs.
- Zero-install workflows (check in `.yarn/cache` for instant CI).
- Teams hitting phantom-dependency or version-drift issues.
- Migrating from Classic to Berry, or maintaining a Classic repo.

## Core concepts

- **Plug'n'Play.** No `node_modules`; `.pnp.cjs` maps packages to zip locations. Strict: undeclared deps fail at runtime. Editor support via `yarn dlx @yarnpkg/sdks`.
- **Zero-installs.** Commit `.yarn/cache` (zips) → `yarn install` becomes nearly instant, CI needs no network. Costs repo size; worth it for many teams.
- **Workspaces.** Like other managers, plus `yarn workspaces foreach` for running commands across packages with topological ordering.
- **Constraints (`constraints.pro`).** Declarative rules: "all workspaces must use the same version of react", "no workspace may depend on X". `yarn constraints` checks; `yarn constraints --fix` repairs.
- **`packageExtensions`.** Fix packages with missing peer deps declaratively in `.yarnrc.yml` instead of forking — but prefer upstream fixes long-term.
- **Release workflow.** `yarn version check` / `yarn version apply` manage deferred version bumps across workspaces; pairs with release plugins.
- **Classic (v1).** `node_modules` + `yarn.lock`; workspaces exist but are thinner. Still fine; just lacks Berry's strictness tooling.

## Practical workflow

**1. Setup (Berry).**
```bash
yarn init -2                    # or: yarn set version stable in existing repo
echo 'nodeLinker: pnp' >> .yarnrc.yml   # or node-modules if PnP fights your tools
yarn install
```

**2. Daily commands.**
```bash
yarn add react                  # add dep
yarn add -D typescript          # devDep
yarn up react                   # upgrade across workspaces
yarn dedupe                     # reduce duplicates
yarn why react                  # explain a dependency
yarn workspaces foreach -R --topological-dev run build
yarn constraints --fix          # enforce consistency rules
```

**3. `.yarnrc.yml` essentials.**
```yaml
nodeLinker: pnp
packageExtensions:
  "some-lib@*":
    peerDependencies: { "react": "*" }
```

**4. Editor SDKs (PnP).**
```bash
yarn dlx @yarnpkg/sdks vscode vim  # generates editor SDKs so TS/eslint resolve PnP
```
Without this, TypeScript and ESLint can't find packages under PnP.

**5. CI.**
```bash
yarn install --immutable   # fail if lockfile would change
```

## Common pitfalls

- **PnP vs tooling.** Some tools assume `node_modules` exists. Options: `nodeLinker: node-modules` (pragmatic), or `packageExtensions` + SDKs. Don't suffer silently — pick the linker that fits your toolchain.
- **Skipping editor SDKs.** Red squiggles everywhere under PnP = missing SDKs, not broken code. Run the SDK generator.
- **Undeclared deps.** Same strictness lesson as pnpm: `Cannot find module` → declare the dependency properly.
- **Zero-install repo bloat.** `.yarn/cache` can grow large; use `yarn cache clean --all` equivalents judiciously and consider `enableGlobalCache` for huge monorepos.
- **Constraints ignored.** Writing `constraints.pro` but never running `yarn constraints` in CI = documentation, not enforcement. Gate CI on it.
- **Classic/Berry confusion.** Docs and Stack Overflow answers differ wildly by version. Always check which major version an answer targets.
- **Forgetting `--immutable` in CI.** Without it, CI may update the lockfile instead of failing on drift — the opposite of what you want.
- **Overriding with resolutions carelessly.** `resolutions` force versions globally — powerful for fixing CVEs fast, dangerous as a permanent crutch. Prefer upstream fixes.
