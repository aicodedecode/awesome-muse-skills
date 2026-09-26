---
name: npm-pro
description: Master npm: workspaces, lockfiles, scripts, publishing, provenance, and security hygiene. Use when managing JS dependencies with npm.
category: development
---

# npm Pro

A practical guide to npm done well: workspaces, lockfile discipline, script conventions, safe publishing (provenance, 2FA, access tokens), and security hygiene — squeezing reliability out of the default package manager.

## Overview

npm ships with Node and remains the baseline every other manager is compared against. Its weaknesses are well-known (slower installs, flat `node_modules` allowing phantom deps), but with discipline — lockfiles committed, `ci` in pipelines, workspaces for monorepos, provenance for publishing — it's a perfectly solid choice, and its registry compatibility is universal.

## When to use

- Default choice for libraries (max compatibility with consumers' tooling).
- Small-to-medium projects where install speed isn't the bottleneck.
- Publishing packages to the npm registry.
- Teams that prefer zero extra tooling beyond Node.

## Core concepts

- **`package-lock.json`.** Commit it (apps *and* libraries — libraries benefit too for reproducible dev/CI). `npm ci` installs exactly from the lockfile; `npm install` may update it.
- **Workspaces.** `workspaces: ["apps/*", "packages/*"]` in root package.json; `npm run build -w web` / `--workspace`; `npm run test --workspaces` for all.
- **Scripts.** `pre`/`post` hooks, `npx` for one-off binaries. Keep scripts composable (`build` calls `build:types`, `build:js`).
- **Provenance.** `--provenance` on publish attests the package was built in CI from a specific commit — verifiable supply-chain metadata. Enable it.
- **Access control.** Scoped packages default to restricted; `--access public` for open-source. 2FA required for publishing on accounts (use it; automation via granular tokens).
- **`overrides`.** Force dependency versions (CVE fixes, dedupe). Powerful, temporary by intent — revisit regularly.
- **`npm audit` / `npm audit fix`.** Vulnerability scanning; `fix` bumps within semver ranges. For major bumps, do it deliberately.

## Practical workflow

**1. Setup.**
```bash
npm init -y
# package.json: "packageManager": "npm@10.x" (corepack pin)
npm install --save-exact   # or configure save-exact=true to avoid ^ drift
```

**2. Daily commands.**
```bash
npm ci                       # CI / clean installs (fast, deterministic)
npm install lodash           # add (updates lockfile)
npm uninstall lodash
npm update                   # bump within semver ranges
npm dedupe                   # flatten duplicates
npm ls react                 # inspect why a version is present
npm explain lodash           # dependency chain detail
npm outdated                 # what can be bumped
npx tsc --noEmit             # run a binary without installing
```

**3. Workspaces.**
```bash
npm run build --workspace=packages/ui
npm run test --workspaces --if-present
npm exec --workspace=apps/web -- eslint src
```

**4. Publishing a library.**
```bash
npm version patch            # bump + tag
npm publish --provenance --access public
```
Pre-publish checklist: `files` field set (don't ship tests/config), `.npmignore`/`.gitignore` sane, `npm pack --dry-run` to inspect the tarball, README documents install + usage.

**5. CI.**
```yaml
- run: npm ci
- run: npm run lint && npm run test --workspaces --if-present
- run: npm publish --provenance   # on release tags only
```

## Common pitfalls

- **`npm install` in CI.** Slow and non-deterministic vs the lockfile. `npm ci` always in CI.
- **Uncommitted lockfile.** "Works on my machine" across the team. Commit `package-lock.json`, always.
- **Phantom dependencies.** Flat `node_modules` lets you import undeclared packages — works locally, breaks for consumers or under stricter managers. Declare everything you import.
- **Publishing too much.** Shipping `src`, tests, and configs bloats installs. Use `files: ["dist"]` and verify with `npm pack --dry-run`.
- **No 2FA / long-lived tokens in CI.** Use granular access tokens with publish-only scope, stored as CI secrets; enable 2FA on the account.
- **`latest` dist-tag accidents.** Publishing a beta as `latest` upgrades everyone unintentionally. Use `--tag beta` for prereleases.
- **Ignoring `npm audit`.** Run it in CI; triage highs/criticals. `audit fix` first, manual bumps for the rest.
- **Postinstall scripts from deps.** A supply-chain risk vector. Review new dependencies' install scripts; consider `--ignore-scripts` with explicit allowlists for trusted packages.
- **Version drift via `^`.** `^1.2.3` floats within majors — fine for apps with lockfiles, surprising for libraries' consumers. `save-exact` for apps; thoughtful ranges for libraries.
