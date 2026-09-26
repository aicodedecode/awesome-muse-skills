---
name: monorepo-deploy
description: Deploying services from a monorepo to PaaS — selective builds, shared code, and per-service pipelines.
category: railway
---

## Overview

Monorepos keep related services in one repository — shared types, atomic
cross-service changes, one PR for the whole feature. But PaaS platforms
deploy from repos, and naively that means rebuilding everything on every
commit. This skill covers deploying monorepo services independently:
selective builds, shared packages, and per-service pipelines.

## When to use

- Structuring a monorepo (apps + shared packages) for PaaS deployment
- Setting up per-service build triggers (only build what changed)
- Sharing code between services without publishing packages
- Managing per-service env config within one repo
- Debugging "deploy picked up the wrong code" issues

## Core concepts

**One repo, many deployables.** Each service (app) is an independent
deployable with its own build config, env vars, and release cadence — the
monorepo is an organizational choice, not a deployment unit. The platform
sees N services that happen to share a repo.

**Selective builds via path filters.** CI and platform build triggers
should watch paths: changes under `apps/api/**` rebuild only the API.
Without path filtering, every commit rebuilds and redeploys everything —
slow, noisy, and risky. Most platforms and CI systems support path-based
triggers; configure them per service.

**Shared code without publishing.** Internal packages (`packages/ui`,
`packages/config`, `packages/db`) imported via workspace links (npm/yarn/
pnpm workspaces, Go modules replace, etc.). The build must resolve
workspaces — Docker builds need the workspace context (build from repo
root, copy what's needed), not just the app directory.

**Atomic cross-service changes.** The monorepo superpower: change the API
and its consumer in one PR. But independent deploys mean version skew is
real — keep APIs backward compatible across deploys (expand-contract),
because service A may deploy before service B.

**Per-service config.** Env vars, secrets, and domains differ per service
even in one repo. Keep a config manifest per app (`apps/api/.env.example`,
deploy configs) — shared defaults where sensible, explicit overrides where
not.

## Practical workflow

1. **Lay out the repo:** `apps/<service>/` for deployables,
   `packages/<shared>/` for shared code, one lockfile at root, workspace
   configuration linking them.
2. **Configure builds per service:** build command, root directory, and
   Dockerfile path per app; Docker builds run from repo root with
   service-specific Dockerfiles to access shared packages.
3. **Set path-filtered triggers:** each service rebuilds only when its app
   dir or its shared-package dependencies change (dependency-aware filters
   or a small script mapping package → dependent apps).
4. **Wire per-service config:** env vars and secrets per service in the
   platform; validate required vars at each service's boot.
5. **Sequence cross-service changes:** backward-compatible API changes
   first, deploy provider, then deploy consumers — or feature-flag the
   seam.
6. **Monitor per service:** separate logs, metrics, alerts, and deploy
   history — a monorepo doesn't mean mono-observability.

## Common pitfalls

- **Rebuilding everything on every commit** — no path filters; slow
  pipelines and unrelated deploys erode trust in the process.
- **Docker context too narrow** — building from `apps/api/` can't see
  `packages/shared`; build from root or vendor shared code into the image
  explicitly.
- **Breaking cross-service contracts** — deploying a breaking API change
  while consumers still expect the old shape; expand-contract discipline.
- **Shared package changes with blast radius** — a "small" change to
  `packages/auth` redeploys five services; treat shared packages with
  library-level care (versioning, changelogs, tests).
- **Secret sprawl** — copying the same secrets into N service configs by
  hand; use shared/secret references where the platform supports them.
- **Monorepo as an excuse for coupling** — services importing each other's
  internals via relative paths; enforce package boundaries (lint rules,
  clear public APIs per package).
