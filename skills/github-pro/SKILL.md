---
name: github-pro
description: Master GitHub: Actions workflows, PR automation, branch protection, Codespaces, and API/CLI usage. Use when building GitHub workflows or managing GitHub repos.
category: development
---

# GitHub Pro

## Overview

GitHub is **where code meets collaboration**: Actions for CI/CD, PRs for review flow, and a rich
API/CLI for automation. Professional GitHub usage means fast, reliable Actions workflows, PR
processes that unblock (templates, automation, protection rules), and using `gh` CLI + API to
automate the toil instead of clicking through it.

The through-line: automate the mechanical parts of collaboration so humans spend their time on
judgment.

## When to use

- Writing or debugging GitHub Actions workflows.
- Setting up branch protection, required checks, and merge policies.
- Automating PR workflows (templates, labels, auto-merge, bots).
- Using `gh` CLI or the GitHub API for scripting.
- Managing releases, packages, or project boards on GitHub.

## Core concepts

- **Actions as pipelines.** Workflows (YAML in `.github/workflows/`) with jobs, steps, and a
  marketplace of actions. Design for speed (parallel jobs, caching with correct keys) and
  reliability (pinned action versions via SHA, not floating tags — supply-chain safety).
- **Event-driven automation.** `pull_request`, `push`, `release`, `schedule`, `workflow_dispatch`
  triggers; path filters to skip irrelevant runs; concurrency groups to cancel stale runs
  (no point testing superseded commits).
- **Branch protection as policy.** Require PR reviews, require status checks green, require linear
  history or squash, dismiss stale approvals, restrict who can push to main. Protection rules are
  team agreements encoded — set them deliberately.
- **PR automation.** Templates (description checklists), auto-labeling, CODEOWNERS for review
  routing, auto-merge for passing dependabot/security PRs, and bots for the mechanical (size
  labels, stale checks). Every manual triage step is automation waiting to happen.
- **`gh` CLI for everything.** `gh pr create/checkout/merge`, `gh issue`, `gh run watch`,
  `gh release create`, `gh api` for the rest. Scriptable, composable — the CLI turns GitHub
  into a command-line tool instead of a website.
- **Security posture.** Dependabot (updates + alerts), secret scanning + push protection,
  code scanning (CodeQL), private vulnerability reporting, and minimal token permissions
  (`permissions:` blocks per job — least privilege, always).

## Practical workflow

1. **Set up the PR pipeline.** Fast checks first (lint, unit), then build, then slower suites;
   required checks marked in branch protection; concurrency cancels superseded runs.
2. **Write workflows like code.** Reusable workflows/composite actions for shared steps; matrix
   builds for versions/platforms; environments with protection rules + secrets for deploys;
   `workflow_dispatch` inputs for manual runs.
3. **Pin and cache.** Actions pinned to SHAs; dependency caches keyed on lockfiles; Docker layer
   caching. Fast *and* reproducible.
4. **Automate the PR lifecycle.** Templates, CODEOWNERS, label automation, auto-merge for
   green+approved, and release-drafter/changesets for notes. Humans review; robots triage.
5. **Protect branches.** Require reviews + green checks on main; no direct pushes; signed commits
   if your threat model warrants; required conversation resolution before merge.
6. **Script with gh.** Bulk operations, issue/PR hygiene, release automation — `gh api` covers
   anything the CLI doesn't. Cron-scheduled workflows for periodic maintenance.

Workflow hygiene checklist:

```text
[ ] Actions pinned to SHAs (not @v4 floating tags)
[ ] permissions: minimal per job (contents: read default)
[ ] Concurrency groups cancel superseded runs
[ ] Caches keyed on lockfiles; validated periodically
[ ] Secrets via environments/secrets, never echoed in logs
[ ] Required checks + reviews enforced via branch protection
[ ] Scheduled runs for nightly E2E / dependency audits
```

## Common pitfalls

- **Floating action versions.** `@v4` today, compromised-or-breaking `@v4` tomorrow. Pin SHAs;
  use Dependabot to propose updates as reviewable PRs.
- **Overly-broad tokens.** Default `GITHUB_TOKEN` with write-everywhere permissions. Scope per
  job with `permissions:` — least privilege isn't paranoia, it's hygiene.
- **Slow PR feedback.** 40-minute workflows with no parallelism or caching. Developers route
  around slow CI (bigger PRs, skipped waits) — speed is adoption.
- **Secrets in logs.** `echo $SECRET` in a debug step, or secrets in action inputs that log.
  Mask, audit, and use environments for prod secrets.
- **No branch protection.** Direct pushes to main "because we're small" — until the Friday
  incident. Protection is cheap; unprotected main is expensive.
- **Workflow sprawl.** 30 workflows with copy-pasted steps, drifting apart. Reusable workflows
  and composite actions — DRY applies to YAML too.
- **Ignoring Dependabot.** 200 open update PRs nobody looks at. Auto-merge green patch/minor
  updates; review majors on a cadence. Dependency hygiene is security hygiene.
