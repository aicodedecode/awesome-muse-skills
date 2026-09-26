---
name: github-actions-templates
description: Use production-ready GitHub Actions templates: CI, releases, deployments, and scheduled jobs. Use when setting up Actions quickly without reinventing pipeline patterns.
category: workflow-automation
---

# GitHub Actions Templates

## Overview

Most GitHub Actions workflows are variations on a few proven patterns: CI (build/test/lint), release (tag -> publish), deploy (environments + approvals), scheduled (cron jobs).

Templates encode the hard-won details: caching, concurrency, permissions scoping, artifact handling, failure notifications.

This skill provides the patterns and the adaptation checklist — copy the shape, adjust the specifics.

## When to use

- Setting up CI for a new repository
- Standardizing Actions across many repos
- Release and deployment pipelines on GitHub
- Scheduled maintenance jobs (dependency updates, reports)
- Reviewing or auditing existing workflow files

## Core concepts

- **CI template shape.**
  Triggers: PR + push to main. Jobs: lint, test (matrix across versions), build. Concurrency: cancel in-progress on new push. Permissions: least privilege.
- **Caching pattern.**
  Cache dependencies by lockfile hash. Restore keys for partial hits. Cache saves minutes per run — the highest-ROI optimization.
- **Matrix builds.**
  Test across OS/version matrix with fail-fast false for full signal. Keep matrix tight — each cell costs minutes.
- **Release template shape.**
  Trigger: version tag. Jobs: build artifacts, generate changelog, create GitHub Release, publish (npm/PyPI/docker). Manual approval for prod publishes.
- **Deploy template shape.**
  Environments (staging/prod) with protection rules and required reviewers. Secrets per environment. Deployment status reported back.
- **Scheduled template shape.**
  Cron trigger, concurrency guard (no overlapping runs), failure notifications. For reports, cleanups, syncs.
- **Reusable workflows.**
  Common jobs (setup, lint, test) as reusable workflows in a central repo. Called via workflow_call. Update once, propagate everywhere.
- **Composite actions.**
  Repeated step sequences as composite actions. Smaller than reusable workflows; ideal for setup-like steps.

## Practical workflow

1. **Pick the template.**
   CI, release, deploy, or scheduled — start from the closest pattern, not a blank file.
2. **Adapt triggers.**
   Narrow to needed events/branches/paths. Path filters prevent irrelevant runs (docs-only changes shouldn't run full CI).
3. **Scope permissions.**
   Set least-privilege at workflow and job level. Contents: read default; add only what's needed.
4. **Add caching.**
   Dependency cache keyed on lockfile. Verify cache hits in logs — misconfigured caching silently does nothing.
5. **Pin action versions.**
   Third-party actions pinned to SHAs (or at least major versions). Supply-chain safety from day one.
6. **Set concurrency.**
   Cancel-in-progress for PR builds; no-overlap guards for deploys and scheduled jobs.
7. **Wire notifications.**
   Failure alerts to the team channel. Silent failures in CI are how broken mains happen.
8. **Extract reusables.**
   After the third copy-paste across repos: reusable workflow or composite action in a shared repo.

## Common pitfalls

- **Copy-paste without understanding.**
  Templates adapted blindly keep wrong assumptions (paths, secrets, triggers). Read every line you adopt.
- **Unpinned actions.**
  Floating versions = supply-chain risk + surprise breakage. Pin everything third-party.
- **Overbroad permissions.**
  Write-all defaults. A compromised workflow with broad tokens is a repo takeover.
- **No concurrency control.**
  Ten PR pushes = ten full CI runs queued. Cancel-in-progress for PRs; it's free.
- **Cache misconfiguration.**
  Cache keys that never hit (wasted upload time) or hit wrongly (stale deps). Verify hits in logs.
- **Slow feedback loops.**
  30-minute CI on every PR. Parallelize jobs, cache aggressively, split slow suites. Speed is a feature.
- **Secrets sprawl.**
  Same secret copy-pasted across 20 repos. Environment/organization secrets with least privilege.
- **No failure visibility.**
  Red builds nobody notices. Notifications + branch protection on required checks = accountability.
