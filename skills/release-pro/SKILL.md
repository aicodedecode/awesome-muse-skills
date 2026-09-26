---
name: release-pro
description: Run reliable releases: versioning, branching, checklists, staged rollouts, and rollback plans. Use when cutting releases or designing a release process.
category: development
---

# Release Pro

## Overview

Releases are **where engineering meets users** — and where undisciplined process becomes outages,
confused users, and Friday-night heroics. Professional releasing means making it routine: clear
versioning, a repeatable checklist, staged rollouts that catch problems early, and rollback plans
that actually work. The goal is releases so boring nobody talks about them.

The through-line: small, frequent, reversible releases — routine beats heroic, every time.

## When to use

- Cutting a release (libraries, apps, services).
- Designing a release process for a team.
- Choosing branching and versioning strategies.
- Planning rollouts, feature flags, and rollbacks.
- Debugging a release process that's painful or scary.

## Core concepts

- **Release early, release often.** Small releases are easier to test, easier to debug, and easier
  to roll back. The risk isn't in releasing — it's in *big* releases. Train the muscle with frequency.
- **Versioning that communicates.** Semantic versioning for libraries/APIs (the contract);
  date-based or build numbers where semver's promises don't apply (deployed services, apps).
  Pre-release tags (`-rc.1`, `-beta`) for soaking risky changes.
- **Branching strategy, minimal.** Trunk-based (short-lived branches, feature flags) for most
  teams — simple, continuous. GitFlow-style release branches only when you must support multiple
  versions in the wild. Match the strategy to actual needs, not ceremony.
- **The release checklist.** Same steps every time, written down, executed in order: version bump,
  changelog, tests green on the release artifact, migrations verified, flags configured, monitors
  watched, comms sent. Checklists beat memory — especially under pressure.
- **Staged rollouts.** Canary (1% → 10% → 50% → 100%) with automated health gates; or
  ring-based (internal → beta users → everyone). Catch the 1%-only bug with 1% of users, not 100%.
- **Rollback as a first-class plan.** Every release knows how to go back: previous artifact ready,
  migrations backward-compatible (expand-contract), flags to kill. "We'll roll forward" is not a
  plan — it's optimism scheduled during an outage.

## Practical workflow

1. **Prepare.** Freeze scope; cut the release branch (if using); bump version; curate the
   changelog; verify the *release artifact* passes the full suite (not just main's last green).
2. **Pre-release checks.**
   ```text
   [ ] Version bumped per semver; changelog curated with breaking changes prominent
   [ ] Full test suite green on the exact release artifact
   [ ] Migrations tested: fresh install AND upgrade from previous version
   [ ] Feature flags configured for the target environments
   [ ] Rollback plan written: previous artifact, migration reversal, flag kills
   [ ] Monitoring dashboards + alerts reviewed for the changed areas
   [ ] Comms drafted: what users need to know (especially breaking changes)
   ```
3. **Roll out in stages.** Internal/dogfood → canary with automated health gates (error rate,
   latency vs baseline — halt on regression) → progressive widening → full. Each stage has
   explicit promotion criteria.
4. **Watch like a hawk.** First hour: error rates, latency percentiles, business metrics
   (conversion, signups), and support channels. Define "normal" beforehand so abnormal is obvious.
5. **Verify and communicate.** Confirm the release is healthy at full rollout; publish release
   notes; notify stakeholders. A release isn't done when it's deployed — it's done when it's
   verified and communicated.
6. **Retrospect.** What went well? What was scary? Tighten the checklist. Every release should
   make the next one smoother — that's the compounding value of the process.

Rollback decision guide:

```text
Canary health gate breached (errors/latency vs baseline) → auto-halt, investigate
User-visible breakage at any stage                        → rollback first, debug second
Data corruption risk                                      → halt rollout, assess before any move
Minor bug, no user impact                                 → roll forward with a fix (decide explicitly)
```

## Common pitfalls

- **Big-bang releases.** Six weeks of changes in one release — untestable as a unit, undebuggable
  when broken, unrollable without losing everything. Small and frequent wins.
- **Releasing from a dirty state.** "Main was green last Tuesday" — release the exact artifact
  you tested, built from a known commit, with the full suite green on *it*.
- **No rollback plan.** Discovering mid-outage that the migration isn't reversible and the old
  artifact was deleted. Rollback planned and *tested* before the release, not during the incident.
- **Flag day migrations.** Irreversible schema changes deployed with the code that needs them.
  Expand-contract: additive change → deploy → migrate → remove old — each step independently safe.
- **Skipping staging/prod-like verification.** "It worked locally" — the release artifact in a
  prod-like environment is the last cheap place to catch packaging, config, and migration bugs.
- **Silent releases.** Shipping breaking changes without comms, or any release without notes.
  Users plan around your releases — tell them what's happening.
- **Friday releases (without the maturity).** The rule isn't about Fridays — it's about whether
  your process is safe enough that the day doesn't matter. Until rollouts are automated and
  rollbacks are trivial, respect the calendar.
