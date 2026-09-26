---
name: github-actions-pro
description: GitHub Actions guidance — workflow design, caching, matrices, OIDC, reusable workflows, and secure CI/CD.
category: development
---

## Overview

GitHub Actions turns repositories into CI/CD platforms: YAML workflows triggered by git events run jobs on hosted or self-hosted runners, with a marketplace of reusable actions. It's the default CI for open source and a strong choice for private repos — especially where code, issues, and delivery already live on GitHub.

The failure modes are well known: slow workflows from missing caches, insecure patterns (unpinned actions, overly broad tokens, script injection), and YAML sprawl across dozens of repos. This skill covers designing fast, secure, maintainable Actions workflows.

## When to use

- Setting up CI/CD for a GitHub repository.
- Speeding up slow workflows (caching, matrices, parallelism).
- Securing workflows (permissions, OIDC, secret handling, script injection).
- Creating reusable workflows and composite actions.
- Deploying from Actions (environments, approvals, OIDC to clouds).
- Choosing hosted vs self-hosted runners.
- Migrating from Jenkins/CircleCI/Travis to Actions.

## Core concepts

- **Events trigger workflows.** `push`, `pull_request`, `workflow_dispatch`, `schedule`, `release` — design triggers deliberately. `pull_request` from forks runs in a restricted context; `pull_request_target` is powerful and dangerous (it checks out attacker-controlled code with base-repo permissions — understand it before using).
- **Jobs, steps, runners.** Jobs run in parallel on runners (unless `needs` chains them); steps run sequentially within a job. `runs-on` selects the runner; matrices multiply jobs across versions/platforms.
- **Least-privilege tokens.** `GITHUB_TOKEN` gets only the permissions the workflow needs — set `permissions:` explicitly at workflow or job level. The default broad token is a supply-chain risk.
- **Pin actions.** Reference third-party actions by full commit SHA, not mutable tags — tags can be moved or compromised. Use Dependabot/Renovate to keep SHAs updated.
- **Script injection.** Never interpolate untrusted input (`github.event.pull_request.title`, issue bodies) into `run:` scripts — it's code execution. Use environment variables (which aren't evaluated) instead of inline `${{ }}` in scripts.
- **Caching.** `actions/cache` (or built-in caches in setup actions) for dependencies and build outputs; key caches on lockfiles with restore-keys for partial hits. Cache poisoning from PRs: don't let untrusted PRs write to caches that privileged workflows read.
- **Artifacts.** `upload-artifact`/`download-artifact` pass build outputs between jobs; retention limits control storage costs. Artifacts are for CI handoff, not long-term storage.
- **Environments.** Named environments (staging, production) with protection rules: required reviewers, wait timers, branch restrictions. Deployments get tracked with URLs and history.
- **Reusable workflows.** `workflow_call` extracts common CI (lint/test/build) into one repo called by many — the DRY mechanism for org-wide pipelines. Inputs/secrets typed explicitly.
- **Composite actions.** Bundle steps (not jobs) into reusable units for repeated step sequences within workflows.
- **OIDC to clouds.** Federated credentials let Actions assume AWS/GCP/Azure roles without stored secrets — configure the trust policy once, no long-lived keys ever.
- **Concurrency.** `concurrency` groups cancel superseded runs (PR pushes) — stops wasting minutes on obsolete commits. Essential for busy repos.
- **Self-hosted runners.** For special hardware, private networks, or cost at scale — but they're persistent machines running untrusted code; isolate, ephemeral-ize, and never share with privileged workflows carelessly.
- **Secrets management.** Org/repo/environment secret scopes; environment secrets for production credentials; audit secret access. Prefer OIDC over secrets wherever the cloud supports it.
- **Dependabot for actions.** Keep pinned SHAs and action versions updated automatically — stale actions accumulate vulnerabilities.

## Practical workflow

1. **Start with triggers and permissions.** `on: pull_request` + `push` to main; top-level `permissions: contents: read`; elevate per job only where needed.
   ```yaml
   on:
     pull_request:
     push: { branches: [main] }
   permissions: { contents: read }
   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
     cancel-in-progress: true
   ```
2. **Build the CI pipeline.** Jobs: lint → test (matrix across versions) → build. Cache dependencies keyed on lockfiles; fail fast on lint before burning test minutes.
   ```yaml
   jobs:
     test:
       runs-on: ubuntu-latest
       strategy: { matrix: { node: [20, 22] }, fail-fast: false }
       steps:
         - uses: actions/checkout@<sha>
         - uses: actions/setup-node@<sha>
           with: { node-version: "${{ matrix.node }}", cache: npm }
         - run: npm ci && npm test
   ```
3. **Pin everything.** Third-party actions by SHA; update via Dependabot. Your own reusable workflows by ref.
4. **Separate build from deploy.** CI builds and publishes immutable artifacts/images; CD workflows (triggered on release or main) deploy them through environment gates.
5. **Gate production.** Environments with required reviewers and branch policies; deployments recorded with URLs; manual approval for production, automated for staging.
6. **Use OIDC for cloud access.** Configure the cloud trust policy for the repo/environment; `aws-actions/configure-aws-credentials` (or GCP/Azure equivalents) with `role-to-assume` — no stored keys.
   ```yaml
   permissions: { id-token: write, contents: read }
   steps:
     - uses: aws-actions/configure-aws-credentials@<sha>
       with: { role-to-assume: arn:aws:iam::123:role/deployer, aws-region: us-east-1 }
   ```
7. **Extract reusable workflows.** Org-wide CI patterns in a `.github` repo or platform repo; `workflow_call` with typed inputs; version by tag/SHA.
8. **Monitor and optimize.** Workflow run times, queue times, cache hit rates, and minutes spend; self-hosted runner health if applicable; failed-run notifications routed to the owning team.

## Common pitfalls

- **Broad default permissions** — `GITHUB_TOKEN` with write access everywhere; set explicit minimal permissions.
- **Unpinned actions** — `@v4` tags that can move; pin SHAs, update with Dependabot.
- **Script injection** — `${{ github.event.* }}` interpolated into `run:` scripts; use env vars.
- **`pull_request_target` misuse** — checking out PR code with privileged tokens; understand the trust boundary.
- **No concurrency cancel** — every push running full CI; cancel superseded runs.
- **Cache poisoning** — PRs writing caches consumed by privileged runs; scope caches per trust level.
- **Long-lived cloud secrets** — static keys in repo secrets; OIDC federation instead.
- **Secrets in logs** — echoing secrets or verbose output leaking them; mask and minimize.
- **Self-hosted runners for public repos** — persistent machines executing fork PR code; use ephemeral, isolated runners.
- **No environment protection** — production deploys without approvals; environments with reviewers.
- **Minutes sprawl** — unoptimized matrices and missing caches; measure and trim.
- **Artifacts as storage** — relying on artifact retention for releases; publish to a registry instead.
- **Monolithic workflow files** — thousand-line YAML; split into reusable workflows and composite actions.
