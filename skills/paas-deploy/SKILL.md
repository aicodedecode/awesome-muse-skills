---
name: paas-deploy
description: Deploying applications on Platform-as-a-Service — build, config, and release patterns that work on any PaaS.
category: railway
---

## Overview

Platform-as-a-Service offerings (Render, Fly.io, Heroku-style platforms, and
similar) abstract away servers: you provide code, they handle building,
running, networking, and scaling. The concepts transfer across providers —
buildpacks vs Dockerfiles, config via environment, ephemeral filesystems, and
managed add-ons. This skill covers deploying well on any PaaS.

## When to use

- Deploying a web app or API to a PaaS for the first time
- Choosing between buildpacks, Nixpacks-style detectors, and Dockerfiles
- Managing environment variables, secrets, and per-environment config
- Handling deploys: zero-downtime releases, rollbacks, preview environments
- Debugging failed builds or crashed deployments on a PaaS

## Core concepts

**The platform builds from your repo.** Most PaaS providers detect your stack
(Python/Node/Go/…) and build automatically, or accept a Dockerfile for full
control. Dockerfiles are more reproducible and portable across providers;
auto-detection is faster to start. For anything beyond a prototype, prefer an
explicit Dockerfile — it documents the runtime and behaves identically
everywhere.

**Config comes from the environment.** Twelve-factor: no config in code or
the repo. Environment variables for secrets, URLs, and per-environment
settings; managed secret stores where the platform offers them. Never commit
`.env` files; document required variables in a `.env.example`.

**Filesystems are ephemeral.** Local disk doesn't persist across deploys or
restarts on most PaaS platforms. Uploads, caches, and SQLite files need
object storage or a persistent volume add-on — design for statelessness from
day one.

**Releases are atomic-ish.** Platforms typically build → health-check → swap
traffic. Understand your provider's exact semantics: does the old version
serve until the new one passes checks? How do you roll back (redeploy the
previous build vs git revert)? Know this before the incident, not during.

**Preview environments multiply value.** Per-PR ephemeral environments catch
integration bugs early. They're cheap on PaaS — use them, with seeded data
and realistic config, as part of the review workflow.

## Practical workflow

1. **Containerize explicitly:** write a multi-stage Dockerfile (small final
   image, non-root user, healthcheck), `.dockerignore` aggressively.
2. **Externalize config:** enumerate every env var in `.env.example` with
   descriptions; set them per environment in the platform dashboard/CLI;
   validate required vars at boot with a clear error.
3. **Wire health checks:** a lightweight `/health` endpoint; configure the
   platform's checks so broken deploys never receive traffic.
4. **Set up the pipeline:** main branch auto-deploys (or manual promotion),
   preview envs per PR, database migrations as a release step (expand-
   contract compatible).
5. **Add the essentials:** managed Postgres/Redis add-ons (or external),
   log drains to your aggregator, metrics/alerts, and a custom domain with
   TLS.
6. **Practice the failure paths:** trigger a failed deploy (does traffic stay
   on the old version?), roll back once deliberately, and restore the
   database from backup to a scratch environment.

## Common pitfalls

- **State on ephemeral disk** — uploads vanish on redeploy; use object
  storage or persistent volumes from the start.
- **Builds that work locally but fail on the platform** — missing system
  deps, different Node/Python versions, devDependencies needed at build
  time; pin versions and test the Docker build in CI.
- **Secrets in the repo or build logs** — leaked via committed `.env` or
  echoed in build output; use the platform's secret management.
- **No health checks** — broken code passes "deploy succeeded" and takes
  traffic; health checks are what make deploys safe.
- **Migrations run at the wrong time** — against the new code before it's
  live, or not at all; make migrations a deliberate release phase.
- **Vendor-specific assumptions baked in** — keep the Dockerfile and config
  portable so the app can move providers without a rewrite.
