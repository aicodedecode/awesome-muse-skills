---
name: gitlab-ci-pro
description: GitLab CI/CD guidance — pipeline design, stages, caching, environments, review apps, and secure delivery.
category: development
---

## Overview

GitLab CI/CD is built into the platform: `.gitlab-ci.yml` defines pipelines of stages and jobs that run on shared or self-managed runners, with first-class environments, review apps, and security scanning. For teams already on GitLab, it's the path of least resistance — code, CI, and CD in one permission model.

Its power features (parent-child pipelines, dynamic child pipelines, review apps, environments with stop actions) reward deliberate design; its flexibility punishes copy-paste sprawl. This skill covers designing fast, secure GitLab pipelines.

## When to use

- Setting up CI/CD in GitLab.
- Designing pipeline stages, rules, and job dependencies.
- Speeding up pipelines (caching, DAG, parallelization).
- Using environments, review apps, and deployments.
- Securing pipelines (protected branches, masked variables, OIDC).
- Choosing GitLab runners (shared, group, project, self-managed).
- Migrating from Jenkins/GitHub Actions to GitLab CI.

## Core concepts

- **Pipelines, stages, jobs.** Stages run sequentially (`build` → `test` → `deploy`); jobs within a stage run in parallel. `needs:` creates a DAG that skips stage waits — use it to parallelize aggressively.
- **Rules.** `rules:` (modern) / `only/except` (legacy) control when jobs run — branch pipelines, MR pipelines, tag pipelines. Prefer `rules` with `$CI_PIPELINE_SOURCE` checks; avoid duplicate pipelines (push + MR both triggering).
- **Merge request pipelines.** Run CI on MRs (`rules: - if: $CI_PIPELINE_SOURCE == "merge_request_event"`) — the fast feedback loop. Don't also run branch pipelines for the same commits; pick one.
- **Caching vs artifacts.** `cache:` for dependencies between runs (best-effort, per-branch); `artifacts:` for build outputs passed between jobs (guaranteed, with expiry). Don't confuse them — caches can miss, artifacts must not.
- **Environments.** Named environments with URLs, tier, and auto-stop; `environment: { name: review/$CI_COMMIT_REF_SLUG }` for review apps; manual actions for production promotion. Deployments tracked per environment.
- **Review apps.** Dynamic environments per MR with `on_stop` cleanup — ephemeral staging that makes UI review trivial. Auto-stop them; forgotten review apps cost money.
- **Protected branches/tags and variables.** Protected variables only available on protected branches — the mechanism keeping production credentials out of fork/MR pipelines.
- **Masked and hidden variables.** Mask secrets in logs; never echo them. File-type variables for certificates and multiline secrets.
- **OIDC / ID tokens.** `id_tokens:` for federated auth to clouds (AWS/GCP/Azure/Vault) — no long-lived secrets in CI variables.
- **Parent-child and dynamic pipelines.** `trigger:` splits monolith configs into child pipelines per component; dynamic child pipelines generate config at runtime — the scaling pattern for monorepos.
- **Resource groups.** Serialize deployments across environments (`resource_group: production`) so two pipelines can't deploy simultaneously.
- **Runners.** Shared (GitLab-hosted), group/project, or self-managed with tags and autoscaling. Runner tags route jobs; protect production runners so untrusted MRs can't use them.
- **Security scanning.** Built-in SAST, dependency scanning, container scanning, secret detection — enable in the pipeline, triage findings, don't just collect them.
- **Pipeline efficiency.** `interruptible: true` cancels redundant pipelines on new pushes; `workflow:rules` prevents unwanted pipeline types entirely.

## Practical workflow

1. **Define stages and rules.** Minimal stages; MR pipelines for feedback, branch/tag pipelines for delivery; `workflow:rules` to avoid duplicate pipelines.
   ```yaml
   workflow:
     rules:
       - if: $CI_PIPELINE_SOURCE == "merge_request_event"
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   stages: [build, test, deploy]
   ```
2. **Parallelize with DAG.** `needs:` instead of stage waits where possible; `parallel:` matrix for version combos; `interruptible: true` on everything except deploys.
3. **Cache dependencies, artifact builds.** `cache:` keyed on lockfiles (per-branch with fallback); `artifacts:` with `expire_in` for images/binaries passed to deploy jobs.
   ```yaml
   build:
     stage: build
     cache:
       key: { files: [package-lock.json] }
       paths: [.npm/]
     script: [npm ci --cache .npm --prefer-offline, npm run build]
     artifacts: { paths: [dist/], expire_in: 1 hour }
   ```
4. **Set up environments.** Staging auto-deploy, production manual with `resource_group`; review apps per MR with `on_stop` cleanup.
   ```yaml
   deploy_prod:
     stage: deploy
     environment: { name: production, url: https://app.example.com }
     resource_group: production
     rules: [{ if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH, when: manual }]
   ```
5. **Protect secrets.** Protected + masked variables for prod credentials; OIDC id_tokens for cloud access; never plaintext secrets in `.gitlab-ci.yml`.
6. **Split with child pipelines.** One parent triggering per-component children in monorepos; dynamic generation for large matrices.
7. **Add security scanning.** Enable the scanning templates relevant to the stack; break the build on criticals (after tuning), track the rest.
8. **Monitor pipeline health.** Duration trends, failure rates per job, runner queue times, and minutes usage; flaky-test quarantine rather than retry-normalization.

## Common pitfalls

- **Duplicate pipelines** — push + MR pipelines both running; `workflow:rules` to pick one.
- **Unprotected production variables** — secrets available to fork MRs; protected variables + protected branches.
- **Cache vs artifact confusion** — relying on cache for build outputs; artifacts for handoff, cache for speed.
- **No `needs:` DAG** — everything waiting on stages; parallelize with dependencies.
- **Review apps never stopped** — cost and clutter; `on_stop` + auto-stop.
- **Concurrent production deploys** — two pipelines racing; `resource_group` serialization.
- **Static cloud credentials** — long-lived keys in variables; OIDC id_tokens.
- **Echoing secrets** — verbose scripts leaking masked values; audit script output.
- **Untrusted jobs on prod runners** — MR pipelines using deployment runners; tag and protect runners.
- **Retry-normalized flakes** — `retry:` hiding broken tests; quarantine flakes instead.
- **Huge monolith config** — thousand-line YAML; parent-child pipelines per component.
- **No pipeline timeouts** — hung jobs burning minutes; `timeout:` per job.
- **Scanning without triage** — findings piling up ignored; assign ownership and SLAs.
