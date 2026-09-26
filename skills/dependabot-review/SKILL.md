---
name: dependabot-review
description: Review Dependabot PRs efficiently: triage, risk assessment, batching, and auto-merge policies. Use when dependency update PRs pile up or you want a sane update workflow.
category: workflow-automation
---

# Dependabot Review

## Overview

Dependabot opens PRs for dependency updates — valuable security hygiene that becomes noise without a review system.

Efficient review: triage by severity, batch low-risk updates, auto-merge with CI gates, and give security updates priority lanes.

Goal: dependencies stay current with minimal human attention, and security fixes land fast.

## When to use

- Dependabot PRs piling up unreviewed
- Setting up Dependabot for a new repo or org
- Designing auto-merge policies for dependency updates
- Balancing dependency freshness with review burden
- Security updates needing fast-track handling

## Core concepts

- **Triage by type.**
  Security updates (fast lane) > major versions (careful review) > minor/patch (batch, auto-merge with CI). Different risk, different process.
- **Dependabot config.**
  dependabot.yml: schedules, grouping, reviewers, labels, ignore rules. Grouping minor/patch updates slashes PR count dramatically.
- **Auto-merge with gates.**
  Auto-merge minor/patch when CI passes + no major version change. Human review for majors and security-sensitive deps.
- **Grouped updates.**
  Group by ecosystem or dependency type (all dev-deps, all GitHub Actions). Fewer PRs, coherent upgrades, easier rollbacks.
- **CI as the reviewer.**
  Strong CI (tests, build, lint, security scan) is what makes auto-merge safe. Weak CI + auto-merge = automated breakage.
- **Changelog scanning.**
  For majors: read the changelog/release notes for breaking changes before merging. Five minutes prevents five hours.
- **Rebase handling.**
  Stale Dependabot PRs with conflicts: rebase via comment command. Don't let them rot — stale updates compound.
- **Org-wide policy.**
  Consistent dependabot.yml templates, auto-merge rules, and review SLAs across repos. One policy, enforced everywhere.

## Practical workflow

1. **Configure dependabot.yml.**
   Schedules (weekly for most), grouping (minor+patch grouped), labels, reviewers, target branches. Start grouped — it halves the noise.
2. **Set up CI gates.**
   Ensure tests/build/security scans run on Dependabot PRs and are required. Auto-merge is only as safe as CI.
3. **Enable auto-merge for low-risk.**
   Minor/patch grouped updates: auto-merge on green CI. Document the policy so the team trusts it.
4. **Create the security fast lane.**
   Security updates: immediate notification, review within 24h, expedited merge. Separate from routine updates.
5. **Triage majors weekly.**
   One weekly session: review major-version PRs with changelogs, test locally if CI is thin, merge or schedule.
6. **Handle stale PRs.**
   Rebase or recreate aging PRs monthly. Close superseded ones. A 3-month-old update PR is technical debt.
7. **Monitor and tune.**
   Track: PR volume, merge time, breakage rate. Tune grouping and schedules from the data.
8. **Roll out org-wide.**
   Template configs, shared auto-merge policies, documented SLAs. Review the policy quarterly.

## Common pitfalls

- **Reviewing every PR by hand.**
  Treating patch updates like feature PRs. Triage by risk; automate the low-risk 80%.
- **No grouping.**
  50 individual PRs for 50 patch updates. Grouping is the single biggest noise reduction available.
- **Auto-merge without CI.**
  Auto-merging on hope. CI gates are the safety net — without them, auto-merge is automated roulette.
- **Ignoring majors forever.**
  Auto-merging patches while majors rot for a year. Majors need scheduled attention, not neglect.
- **Stale PR accumulation.**
  Conflicts piling up, updates aging out. Rebase-or-close cadence keeps the queue honest.
- **Security updates in the slow lane.**
  Critical CVE fix waiting behind routine updates. Fast lane with SLAs for security.
- **No changelog review.**
  Merging majors blind. Five minutes on release notes catches most breaking changes.
- **Inconsistent org policy.**
  Every repo inventing its own approach. Templates + shared policy = predictable everywhere.
