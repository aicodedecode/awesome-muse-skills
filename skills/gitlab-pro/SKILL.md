---
name: gitlab-pro
description: Master GitLab: CI/CD pipelines, merge request flow, Auto DevOps, and instance administration. Use when building GitLab pipelines or managing GitLab projects.
category: development
---

# GitLab Pro

## Overview

GitLab's strength — **the entire DevOps lifecycle in one platform** (repo, CI, registry,
security scanning, deploy) — rewards teams that use it as an integrated system rather than
"GitHub with different YAML." Professional GitLab usage means expressive `.gitlab-ci.yml`
pipelines (stages, rules, environments), merge request flow with approvals, and leveraging the
built-in security and review apps instead of bolting on third parties.

The through-line: one platform, one pipeline definition, everything integrated — use the whole thing.

## When to use

- Writing or debugging `.gitlab-ci.yml` pipelines.
- Setting up merge request approvals, review apps, and environments.
- Using GitLab's security scanning (SAST, dependency, container).
- Managing GitLab runners (shared, group, specific).
- Administering GitLab projects/groups or migrating to GitLab.

## Core concepts

- **Pipeline as a DAG.** Stages order jobs; `needs:` creates directed-acyclic dependencies for
  parallelism beyond stages; `rules:` (not `only/except`) controls when jobs run with precise
  conditions (`if: $CI_PIPELINE_SOURCE == "merge_request_event"`, path changes). Design the DAG
  deliberately — flat pipelines waste the parallelism.
- **Merge request pipelines.** Pipelines that run *for the MR* (`rules: - if: $CI_PIPELINE_SOURCE
  == 'merge_request_event'`) — the fast feedback loop. Detached MR pipelines keep main's history
  clean while giving full CI on the change.
- **Environments and review apps.** `environment:` definitions with URLs; review apps spin up
  per-MR (dynamic environments, auto-stopped on close); protected environments for prod with
  manual approvals. Every MR reviewable as a running app.
- **Caching and artifacts.** `cache:` for dependencies across pipelines (keyed on lockfiles);
  `artifacts:` to pass build outputs between jobs (with expiry); `dependencies:`/`needs:artifacts`
  to control what's fetched. Wrong cache keys = stale builds; no artifacts = rebuilding everything.
- **Built-in security scanning.** SAST, dependency scanning, container scanning, secret detection —
  enabled via templates, reported in the MR as vulnerabilities with severity. Part of the pipeline,
  not a separate tool.
- **Runners.** Shared (GitLab-hosted), group/project-specific; tags route jobs to the right
  runners; autoscaling for bursty loads. Runner choice affects speed, cost, and security (isolate
  untrusted builds).

## Practical workflow

1. **Design the pipeline.** Stages: validate (lint/unit) → build → test (integration/E2E) →
   security scan → deploy staging → deploy prod (manual/protected). MR pipelines run the fast
   subset; main runs everything.
2. **Write rules-first YAML.** `rules:` for job conditions; `workflow:rules` to avoid duplicate
   pipelines (branch + MR pipelines double-running is the classic waste); `!reference` tags and
   `extends:` to DRY shared config; includes for shared templates.
3. **Set up environments.** Staging auto-deploys from main; production manual + protected;
   review apps per MR with auto-cleanup. Environment URLs linked in the MR.
4. **Enable scanning.** SAST + dependency + secret detection templates included; triage findings
   in the MR security widget; block on criticals via approval rules.
5. **Configure approvals.** CODEOWNERS + approval rules (e.g., security team for auth changes,
   required approvals count); block MRs on unresolved threads and failing pipelines.
6. **Operate runners.** Right-size (concurrent job capacity), tag appropriately, monitor queue
   times (slow runners = slow feedback), and isolate privileged jobs from untrusted MR builds.

Pipeline sketch:

```yaml
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

stages: [validate, build, test, security, deploy]

lint:
  stage: validate
  script: [npm run lint]
  rules: [{ if: $CI_PIPELINE_SOURCE == "merge_request_event" }]

build:
  stage: build
  script: [npm run build]
  artifacts: { paths: [dist/], expire_in: 1 hour }

review_app:
  stage: deploy
  script: [deploy --env review-$CI_MERGE_REQUEST_IID]
  environment: { name: review/$CI_MERGE_REQUEST_IID, url: https://$CI_MERGE_REQUEST_IID.review.example.com, on_stop: stop_review }
  rules: [{ if: $CI_PIPELINE_SOURCE == "merge_request_event" }]
```

## Common pitfalls

- **Double pipelines.** Branch pipelines *and* MR pipelines running the same jobs — doubled cost
  and confusion. `workflow:rules` to run one or the other.
- **`only/except` legacy.** Still works but less expressive than `rules:`; mixing both causes
  surprising behavior. Standardize on `rules:`.
- **Cache misconfiguration.** Unkeyed or wrongly-keyed caches → stale dependencies, phantom
  passes. Key on lockfiles; verify with cache-busting when suspicious.
- **Artifacts without expiry.** Build outputs accumulating forever, eating storage. `expire_in`
  on everything; only releases keep artifacts long-term.
- **Unprotected production.** Auto-deploy to prod on main push with no approvals or gates.
  Protected environments + manual actions for prod; progressive rollout where possible.
- **Runner bottlenecks.** All jobs on two shared runners while developers wait. Monitor queue
  depth; scale runners with demand; tag heavy jobs to beefy runners.
- **Ignoring the security widget.** Scanners enabled but findings never triaged — the pipeline
  reports vulnerabilities into the void. Approval rules on criticals; triage cadence for the rest.
