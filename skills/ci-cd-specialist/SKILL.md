---
name: ci-cd-specialist
description: Design and operate CI/CD pipelines: fast feedback, deployment strategies, environments, and pipeline reliability. Use when building, fixing, or scaling build and deploy pipelines.
category: development
---

# CI/CD Specialist

## Overview

CI/CD is **the team's heartbeat**: how fast can a good change reach users, and how safely? A great
pipeline gives feedback in minutes, deploys with confidence, and rolls back in seconds. This skill
covers designing pipelines for speed and safety — fast PR feedback, hermetic builds, progressive
delivery, environment strategy, and treating the pipeline itself as production code.

The through-line: every commit to main is releasable; every release is routine, boring, and reversible.

## When to use

- Designing or rebuilding CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins, etc.).
- Slow or flaky pipelines killing developer velocity.
- Choosing deployment strategies (rolling, blue/green, canary).
- Setting up environments, preview deploys, or release automation.
- Debugging pipeline failures or unreliable deploys.

## Core concepts

- **Fast feedback loops.** PR pipeline: lint + unit + fast integration in minutes (<10 min target).
  Slower suites (E2E, load) run async or on main. Developers optimize for the feedback they get —
  slow pipelines teach developers to batch huge PRs and skip waiting.
- **Hermetic, reproducible builds.** Pinned dependencies (lockfiles), pinned base images (digests,
  not tags), and builds that don't depend on ambient machine state. "Works on CI" must mean the
  same thing every time.
- **Build once, promote everywhere.** One immutable artifact (container image, bundle) built once,
  promoted through environments via config — never rebuilt per environment. Rebuilding means
  testing something different from what ships.
- **Deployment strategies.** Rolling (gradual, simple), blue/green (instant switch, easy rollback,
  double capacity), canary (traffic % to new version with automated analysis — safest for risky
  changes). Feature flags decouple *deploy* from *release*: ship dark, enable gradually, kill
  instantly.
- **Environments with purpose.** Local → PR preview (ephemeral, per-PR) → staging (prod-like,
  for integration) → production. Each environment answers a question; environments that nobody
  trusts get skipped, so keep staging honest (prod-like data shape, same artifact).
- **Pipeline as code, tested.** Pipeline definitions in version control, reviewed like code;
  pipeline changes validated (dry-run/lint); pipeline failures alert like production incidents —
  a broken pipeline blocks *everyone*.

## Practical workflow

1. **Map the ideal flow.** Commit → fast checks (lint, unit, build) → artifact → preview env →
   integration/E2E → staging → progressive prod deploy → verify → done. Then implement stage by stage.
2. **Optimize the PR pipeline first.** It's the highest-traffic path: parallelize jobs, cache
   aggressively (deps, build outputs — with correct keys), split by affected (monorepo) or by
   speed tier. Target: green in under 10 minutes.
3. **Build the artifact pipeline.** Hermetic build → tag immutably (git SHA) → push to registry →
   sign/provenance (SLSA-minded) → promote the *same* artifact through environments.
4. **Implement progressive delivery.** Feature flags for risky features; canary or rolling deploys
   with automated health checks (error rate, latency vs baseline) and automatic rollback on
   regression. Manual "watch the dashboards for an hour" doesn't scale.
5. **Add preview environments.** Ephemeral per-PR deploys (with seeded data) — designers and PMs
   review the real thing; E2E can target them. Tear down automatically on merge/close.
6. **Harden and observe.** Pipeline SLIs (success rate, duration p95), alerts on pipeline failure,
   runbooks for common failures, and regular pipeline retrospectives — the pipeline is a product
   with users (your developers).

Pipeline stage sketch:

```yaml
# PR pipeline — fast feedback
pr:
  - lint & format check        # 1 min
  - unit tests (parallel)      # 3 min
  - build artifact             # 2 min
  - deploy preview env         # 3 min
  - smoke tests on preview     # 2 min
# Main pipeline — full verification + delivery
main:
  - all of PR pipeline
  - integration & E2E suite    # 10-15 min, parallel shards
  - security scans (SAST/deps) # parallel
  - promote artifact → staging # automated
  - E2E on staging
  - progressive prod deploy    # canary 5% → 50% → 100%, auto-rollback
```

## Common pitfalls

- **Slow PR pipelines.** 45-minute PR checks → developers context-switch, batch bigger PRs, and
  merge without waiting. Speed is the pipeline's most important feature.
- **Flaky pipeline steps.** Intermittent failures teach "just rerun" — then real failures get
  rerun away too. Quarantine and fix flakes; pipeline reliability is production reliability.
- **Snowflake environments.** Staging that differs from prod (data, config, scale) — "passed
  staging" means nothing. Prod-like or don't bother.
- **Rebuilding per environment.** Different binaries in staging vs prod — you're testing one
  thing and shipping another. Build once, promote.
- **Big-bang deploys.** Friday-afternoon full releases with no rollback plan. Progressive
  delivery + flags make deploys boring — boring is the goal.
- **Secrets in pipeline logs.** Echoing env vars, printing configs — pipeline logs are widely
  readable. Mask secrets; audit what's printed.
- **No rollback story.** "We'll roll forward" during an outage. Automated rollback on health-check
  failure beats heroics; test the rollback path, not just the deploy path.
