---
name: bitbucket-pro
description: Master Bitbucket: Pipelines CI/CD, pull request workflow, branch permissions, and Jira integration. Use when building Bitbucket Pipelines or managing Bitbucket repos.
category: development
---

# Bitbucket Pro

## Overview

Bitbucket's home turf — **teams in the Atlassian ecosystem** — rewards using the integrations:
Pipelines for CI/CD, Jira issue linking (branches, commits, PRs tied to tickets automatically),
and branch permissions for governance. Professional Bitbucket usage means fast Pipelines with smart
caching, PR workflows with meaningful reviewers and checks, and the Jira integration actually wired
up instead of existing in theory.

The through-line: the Atlassian integration is the point — connect the pieces and the traceability
comes free.

## When to use

- Writing or debugging `bitbucket-pipelines.yml`.
- Setting up branch permissions, merge checks, and reviewers.
- Wiring Jira integration (smart commits, issue transitions).
- Managing Bitbucket Cloud vs Data Center differences.
- Migrating to or administering Bitbucket workspaces.

## Core concepts

- **Pipelines configuration.** `bitbucket-pipelines.yml`: pipelines per branch pattern
  (`default`, `branches: main`, `pull-requests: '**'`), steps with Docker images, caches
  (defined + referenced), artifacts between steps, and parallel steps. PR pipelines are the fast
  feedback loop; branch pipelines guard main.
- **Caches and services.** Named caches (node, pip, maven) keyed sensibly; service containers
  (postgres, redis, docker-in-docker) for integration tests. Pipelines' build minutes cost money —
  caching and parallelization directly control the bill.
- **Branch permissions.** Prevent direct pushes/deletion on main; require passing builds; require
  approvals (count + specific reviewers); require no unresolved tasks. Restrictions per branch
  pattern — governance encoded, not requested.
- **Merge checks and reviewers.** Default reviewers by path (CODEOWNERS equivalent), required
  green builds, task lists on PRs (unresolved tasks block merge when configured). PR templates
  via default descriptions.
- **Jira smart commits.** `PROJ-123 #comment Fixed the race #time 2h #resolve` in commit messages
  — links, logs time, transitions issues automatically. Branch names including the issue key
  (`feature/PROJ-123-description`) auto-link branches to issues. This traceability is free once
  the habit exists.
- **Deployments and environments.** Bitbucket's deployments dashboard tracks what's deployed where;
  deployment steps with manual triggers for prod; variables per environment (secured for secrets).
  Release visibility without a separate tool.

## Practical workflow

1. **Set up PR pipelines.** `pull-requests: '**'` pipeline: lint + unit + build in parallel
   steps, under 10 minutes. Fast feedback is adoption.
2. **Configure caches.** Dependency caches per ecosystem; Docker layer caching where valuable.
   Measure build minutes before/after — caching ROI is directly visible.
3. **Lock down branches.** Main: no direct pushes, require green build + approvals, no force-push.
   Apply to release branches too. Permissions are the team's agreement, enforced.
4. **Wire Jira.** Application links configured; smart commits habit (issue key in branch names
   and commits); PR descriptions reference issues. Traceability from ticket → branch → PR →
   deployment, automatically.
5. **Set up deployments.** Staging auto-deploy from main; production manual with approvals;
   deployment variables secured; track releases in the deployments view.
6. **Automate hygiene.** Scheduled pipelines for nightly E2E/dependency audits; PR cleanup
   (delete branches on merge); stale PR reminders. Bitbucket's API + scheduled pipelines cover
   most maintenance.

Pipeline sketch:

```yaml
image: node:20

definitions:
  caches:
    node: ~/.npm
  steps:
    - step: &lint-test
        name: Lint and unit tests
        caches: [node]
        script:
          - npm ci
          - npm run lint
          - npm run test:unit

pipelines:
  pull-requests:
    '**':
      - parallel:
          - step: *lint-test
          - step:
              name: Build
              caches: [node]
              script: [npm ci, npm run build]
              artifacts: [dist/**]
  branches:
    main:
      - step: *lint-test
      - step:
          name: Deploy to staging
          deployment: staging
          script: [./deploy.sh staging]
```

## Common pitfalls

- **No PR pipelines.** Only building main — PRs merge blind, main breaks regularly. PR pipelines
  are the whole point of CI.
- **Cache neglect.** `npm install` from scratch on every run — slow and expensive. Named caches,
  keyed right, from day one.
- **Build minutes bloat.** Sequential steps, no caching, heavy images — the bill grows silently.
  Parallelize, cache, and use slim images; monitor minutes like a budget.
- **Smart commits unused.** Teams typing issue keys manually in Jira while commits lack them.
  Branch naming convention + smart commit habit = free traceability.
- **Weak branch permissions.** Direct pushes to main "temporarily" becoming permanent. Set
  permissions on day one; they're nearly free and prevent the classic disasters.
- **Secrets in plain variables.** Deployment variables unsecured, echoed in logs. Use secured
  variables; audit what's printed.
- **Ignoring the deployments view.** Deploying via scripts nobody tracks — no one knows what's
  live where. Use deployment steps so Bitbucket tracks it.
