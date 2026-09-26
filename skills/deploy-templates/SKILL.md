---
name: deploy-templates
description: Reusable deployment templates — one-click deploys, blueprints, and environment-as-code — vendor-neutral patterns.
category: railway
---

## Overview

Deploy templates (one-click deploy buttons, blueprints, compose-style specs)
let anyone spin up a full stack — app + database + cache + config — from a
declarative definition. They're how open-source projects offer "deploy your
own instance" and how teams standardize environments. This skill covers
authoring templates that actually work for strangers.

## When to use

- Publishing a "Deploy" button for an open-source project
- Standardizing dev/staging/prod environments as code
- Defining multi-service stacks (app, DB, cache, worker) declaratively
- Templating config with per-deployment variables and secrets
- Reviewing or debugging a template that fails for new users

## Core concepts

**Declare the whole system.** A good template specifies every service, its
image/build, environment variables (with defaults and descriptions),
volumes, health checks, and inter-service references (the app's
`DATABASE_URL` wired to the database service's output). If the user must
manually connect pieces afterward, the template is incomplete.

**Variables with sane defaults.** Expose what varies per deployment (domains,
admin credentials, feature flags) as template variables with descriptions
and safe defaults. Generate secrets (passwords, keys) automatically rather
than asking users to invent them — and mark which values must be kept safe.

**Idempotent and repeatable.** Deploying the template twice should produce
two working stacks, not a broken second attempt. Avoid hardcoded names that
collide; avoid setup steps that fail if re-run (migrations, seed scripts
must be idempotent).

**Pin versions.** Template referencing `latest` images or unpinned
dependencies rots — what worked in January breaks in June. Pin image tags,
and test the template on a schedule (monthly) to catch upstream breakage.

**Document the post-deploy.** Templates end at "running"; users still need:
first-login steps, where data lives, how to update, how to back up, and
expected costs. A template without this doc orphans its users.

## Practical workflow

1. **Get it running manually first** — deploy the stack by hand once;
   capture every step, variable, and connection. The template encodes this.
2. **Write the template spec:** services, builds, env vars (defaults +
   descriptions), volumes, health checks, and service references using the
   platform's templating syntax.
3. **Parameterize secrets:** auto-generate where possible; never ship
   default credentials that are publicly known.
4. **Test as a stranger:** deploy from the template in a fresh account with
   no prior context; fix every manual step you find yourself doing.
5. **Add the docs:** README section with the deploy button, post-deploy
   checklist, update procedure, backup guidance, and cost estimate.
6. **Maintain:** scheduled re-tests, version bumps with changelog notes, and
   a feedback channel for deploy failures.

## Common pitfalls

- **Untested templates** — authored once, never deployed fresh; rots within
  months as images and APIs change.
- **Hardcoded values** that only work for the author (personal domains,
  region-specific resources, assumed account IDs).
- **Missing inter-service wiring** — app deployed but `DATABASE_URL` empty;
  references must resolve automatically.
- **Default credentials** shipped in the template (`admin/admin`) — an
  invitation to compromise; generate per-deployment.
- **No update path** — users deploy v1 and can never safely get to v2;
  document upgrades, including data migrations.
- **Cost surprises** — template spins up $$$/month of resources without
  warning; state expected costs prominently.
