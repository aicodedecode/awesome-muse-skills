---
name: circleci-pro
description: CircleCI guidance — config design, orbs, caching, workflows, contexts, and pipeline optimization.
category: development
---

## Overview

CircleCI is a cloud-native CI platform: YAML configs (`.circleci/config.yml`), Docker-based executors, orbs for reusable configuration, and workflows orchestrating jobs. It's known for fast Docker-layer caching, a polished UI, and strong parallelism — a solid choice for teams wanting managed CI without GitHub lock-in.

The keys to CircleCI: lean configs via orbs and executors, aggressive caching and parallelism, and contexts for secret scoping. This skill covers designing efficient CircleCI pipelines.

## When to use

- Setting up CI/CD on CircleCI.
- Designing configs (jobs, workflows, executors, orbs).
- Speeding up builds (caching, parallelism, Docker layer caching).
- Managing secrets with contexts.
- Deploying from CircleCI (approvals, OIDC).
- Optimizing credit consumption.
- Migrating to/from CircleCI.

## Core concepts

- **Jobs and workflows.** Jobs are the unit of work (steps on an executor); workflows orchestrate jobs with dependencies (`requires`), filters (branches/tags), and approval gates.
- **Executors.** Docker (container per job, most common), machine (full VM), macOS, Windows. Docker executors are fast and isolated; machine executors for Docker-in-Docker or privileged needs.
- **Orbs.** Versioned reusable config packages (node, aws-cli, browser-tools) — the DRY mechanism. Pin orb versions; prefer official/verified orbs; write your own for org patterns.
- **Caching.** `save_cache`/`restore_cache` keyed on lockfile checksums with fallback keys; dependency caches, not build outputs (use workspaces/artifacts for those). Cache invalidation via key changes.
- **Workspaces.** `persist_to_workspace`/`attach_workspace` pass files between jobs in a workflow — the handoff mechanism (unlike caches, workspaces are guaranteed).
- **Parallelism.** `parallelism: 4` splits a job across containers with `$CIRCLE_NODE_INDEX` — combine with test splitting (`circleci tests split`) for big suites.
- **Docker layer caching (DLC).** Speeds Docker builds by caching image layers — a paid feature worth it for heavy Docker workflows; without it, multi-stage builds re-run every time.
- **Contexts.** Named secret groups with environment restrictions — the scoping mechanism for production credentials. Restrict contexts to protected branches.
- **Approval jobs.** Manual gates in workflows (`type: approval`) before production deploys — with restricted contexts for the jobs after them.
- **Filters.** Branch/tag filters per workflow job — control what builds when (e.g., deploy only on main, skip docs-only changes with path filtering via dynamic config).
- **Dynamic config.** `setup workflows` generating config at runtime — the monorepo path-filtering pattern (only build changed components).
- **OIDC.** OpenID Connect tokens for cloud auth without stored secrets — configure the trust once per context.
- **Test splitting.** `circleci tests glob` + `split --split-by=timings` distributes tests by historical duration — the way to parallelize suites efficiently.
- **Insights.** Build duration, queue times, credit consumption per workflow — the data for optimization.
- **Self-hosted runners.** For compliance, special hardware, or private networks — with the operational overhead that implies.

## Practical workflow

1. **Structure the config.** Versioned orbs, reusable executors/commands, workflows per purpose (CI vs release).
   ```yaml
   version: 2.1
   orbs: { node: circleci/node@5.1.0 }
   executors:
     node-exec: { docker: [{ image: cimg/node:22.0 }] }
   ```
2. **Cache dependencies.** Restore keyed on lockfile checksum, save on miss; fallback keys for partial hits.
   ```yaml
   steps:
     - restore_cache: { keys: [npm-v1-{{ checksum "package-lock.json" }}, npm-v1-] }
     - run: npm ci
     - save_cache: { key: npm-v1-{{ checksum "package-lock.json" }}, paths: [~/.npm] }
   ```
3. **Parallelize tests.** `parallelism` + timing-based test splitting; JUnit output for flaky-test insights.
4. **Pass artifacts via workspaces.** Build once, persist to workspace, attach in downstream jobs (test, scan, deploy) — never rebuild per job.
5. **Gate deployments.** Workflows with branch filters, approval jobs for production, restricted contexts holding prod secrets, OIDC for cloud auth.
   ```yaml
   workflows:
     build-deploy:
       jobs:
         - build
         - hold: { type: approval, requires: [build], filters: { branches: { only: main } } }
         - deploy-prod: { requires: [hold], context: prod }
   ```
6. **Use dynamic config for monorepos.** Path-filtering setup workflow generating per-component configs — only build what changed.
7. **Optimize credits.** Right-size resource classes, DLC only where it pays, cancel redundant builds, schedule-based cleanup of old workflows.
8. **Monitor with Insights.** Track duration/credit trends per workflow; set team budgets; investigate regressions by attributing to config changes.

## Common pitfalls

- **Cache instead of workspaces** — relying on best-effort cache for build handoff; workspaces for guarantees.
- **No test splitting** — parallelism without splitting = duplicated full suites; use timings-based splitting.
- **Unpinned orbs** — floating orb versions breaking configs; pin versions.
- **Contexts too broad** — prod secrets available to all branches; restrict contexts.
- **Missing approval gates** — auto-deploy to production; approval jobs for prod.
- **Static cloud keys** — long-lived credentials in contexts; OIDC instead.
- **No DLC for Docker-heavy builds** — rebuilding layers every run; enable DLC where it pays.
- **Oversized resource classes** — paying for xlarge everywhere; right-size per job.
- **Redundant builds** — every push building everything; auto-cancel + path filtering.
- **Secrets in config** — hardcoded values in YAML; contexts only.
- **Ignoring Insights** — credit burn invisible; monitor per-workflow consumption.
- **Monolith config** — one giant config.yml; orbs, commands, and dynamic config for structure.
- **No workflow timeouts** — hung jobs burning credits; set timeouts.
