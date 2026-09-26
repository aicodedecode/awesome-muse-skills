---
name: github-workflow-automation
description: Automate GitHub with Actions and the native API: CI/CD, issue/PR automation, and repository management. Use when streamlining GitHub-centered development workflows.
category: workflow-automation
---

# GitHub Workflow Automation

## Overview

GitHub is automation-friendly by design: Actions for CI/CD and event-driven flows, a rich REST + GraphQL API, and webhooks for everything.

Common automations: CI pipelines, PR labeling/review assignment, issue triage, stale management, release drafting, repo provisioning.

This skill uses GitHub's native capabilities — Actions and the API — with no third-party middleware required.

## When to use

- Setting up CI/CD with GitHub Actions
- Automating PR review assignment, labeling, and checks
- Issue triage, stale handling, and project board automation
- Repository provisioning and settings management
- Release automation (changelogs, drafts, publishing)

## Core concepts

- **Actions fundamentals.**
  Workflows trigger on events (push, PR, schedule, manual). Jobs run steps on runners. Marketplace actions accelerate; pin versions for stability.
- **Event-driven design.**
  Trigger precisely: pull_request types (opened, labeled, ready_for_review), issues, releases, schedules. Narrow triggers save minutes and noise.
- **API automation.**
  REST for most tasks, GraphQL for complex queries. Official CLIs (gh) and Actions (github-script) cover scripting without new dependencies.
- **Permissions scoping.**
  GITHUB_TOKEN with least-privilege permissions per workflow. Fine-grained PATs for cross-repo needs. Never broad tokens in workflows.
- **Reusable workflows.**
  Shared CI/CD logic as reusable workflows or composite actions. DRY across repos; update once, benefit everywhere.
- **Environments and secrets.**
  Environments for deploy gates (approvals, protection rules); secrets per environment. No secrets in logs — mask them.
- **Caching and artifacts.**
  Cache dependencies, upload build artifacts, pass data between jobs. Minutes and reliability compound across every run.
- **Branch protection.**
  Required checks, reviews, and status checks as policy. Automation enforces; protection prevents bypass.

## Practical workflow

1. **Map the workflow.**
   What events, what actions, what outcomes? Sketch: on PR -> label, assign reviewers, run checks, comment preview link.
2. **Start with CI.**
   Build/test/lint workflow on PRs. Fast, cached, required as branch protection. The foundation everything else builds on.
3. **Add PR automation.**
   Auto-label by files changed, assign reviewers (round-robin or CODEOWNERS), welcome first-time contributors.
4. **Automate issue triage.**
   Label by template fields, assign to projects, stale-bot for inactivity (with care — see pitfalls).
5. **Build release automation.**
   Draft releases from merged PRs, generate changelogs, attach artifacts, publish on tag.
6. **Harden security.**
   Least-privilege tokens, pinned action versions, secret scanning, Dependabot for actions themselves.
7. **Create reusable pieces.**
   Extract repeated logic to reusable workflows/composite actions in a central repo.
8. **Document and monitor.**
   README per automation: what, why, owner. Monitor Actions usage/minutes; alert on repeated failures.

## Common pitfalls

- **Overly broad triggers.**
  Workflows on every push to every branch burning minutes. Narrow triggers to what actually needs running.
- **Unpinned actions.**
  Floating `@main` on third-party actions = supply-chain roulette. Pin to SHAs for security-critical workflows.
- **Excessive permissions.**
  Default write-all tokens. Scope per workflow; a compromised workflow shouldn't own the repo.
- **Stale-bot cruelty.**
  Auto-closing issues with no human touch alienates contributors. Stale as triage aid, not executioner.
- **Secrets in logs.**
  Echoing secrets in debug output. Mask values; audit logs for leaks periodically.
- **Flaky required checks.**
  Required checks that fail randomly train developers to distrust CI. Fix flakes before enforcing.
- **Minutes blindness.**
  Private-repo minutes and large runners cost real money. Monitor usage; optimize slow/duplicate jobs.
- **No CODEOWNERS.**
  Review assignment by guesswork. CODEOWNERS gives automation (and humans) the routing table.
