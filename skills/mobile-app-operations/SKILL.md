---
name: mobile-app-operations
description: Operate mobile apps — release management, crash monitoring, phased rollouts, push coordination, and app store ops.
category: curviate
---

## Overview

Operating a mobile app means managing releases across fragmented devices, monitoring crashes and performance, coordinating pushes, and handling app store processes. This skill covers mobile operations: release trains, rollout strategies, monitoring, feature flags, and the store submission discipline that prevents rejections. Platform-neutral (iOS/Android).


Mobile app operations covers the full lifecycle of running apps in production: release management, crash monitoring, performance tracking, staged rollouts, and user feedback loops.
With app store review gates and fragmented devices, mobile ops demands more discipline than web — you cannot just redeploy in seconds.
## When to use

- Setting up mobile release processes
- Planning phased rollouts
- Monitoring crashes and performance
- Managing app store submissions
- Coordinating feature flags on mobile
- Reducing release-related incidents

- Setting up mobile CI/CD pipelines
- Managing staged rollouts and feature flags
- Diagnosing crashes and performance issues
- Coordinating iOS and Android releases
## Core concepts

**Release trains.** Regular cadence (weekly/biweekly) beats sporadic big-bangs: predictable, smaller changes, faster feedback. Cutoff dates, stabilization periods, and clear go/no-go criteria. Trains keep shipping even when individual features slip.

**Phased rollouts.** Staged deployment: 1% → 5% → 25% → 50% → 100%, with health gates (crash rate, key metrics) at each stage. Halt and roll back on regression — staged rollouts only work if someone watches the gates. Both major stores support this natively.

**Crash and performance monitoring.** Crash-free rate (target 99.5%+), ANR/app-hang rates, startup time, memory/battery impact, and network performance. Segment by OS version, device, and app version — aggregates hide device-specific disasters.

**Feature flags.** Decouple deploy from release: ship code dark, enable via flags. Kill switches for risky features, gradual rollouts, A/B testing, and platform-specific targeting. Flags need lifecycle management — stale flags become tech debt.

**App store operations.** Submission checklists (metadata, screenshots, privacy labels, review notes), review guidelines compliance (common rejection reasons: crashes, broken links, misleading metadata, privacy issues), expedited review for critical fixes, and release timing (avoid Friday submissions — weekend rejections strand you).

**Push coordination.** Release-tied pushes (update prompts for critical versions), phased push campaigns aligned with rollout stages, and deep links that handle version differences (old app versions receiving new deep links).


**Release trains.** Fixed cadence (weekly/biweekly) with cutoff dates: features merge by cutoff or wait for the next train.
Trains prevent release chaos — everyone knows when the next ship leaves.
Hotfix lanes exist for critical issues; everything else rides the train.
**Staged rollouts.** 1% → 5% → 20% → 50% → 100%, with crash-rate and key-metric gates at each stage.
Halt criteria defined in advance (crash rate > X, conversion drop > Y).
Staged rollouts catch issues affecting 1% before they affect 100% — the cheapest insurance in mobile.
**Crash monitoring.** Crash-free rate (target 99.5%+), symbolicated stack traces, breadcrumb trails, and release-over-release comparisons.
Triage: new crashes in latest release first, then top-volume, then long-tail.
Every crash gets a severity; P0 crashes trigger hotfix trains.
**Performance budgets.** App size (< 150MB ideally), cold start (< 2s), API response handling, battery impact, and memory footprint.
Set budgets in CI — builds exceeding budgets fail automatically.
Performance regressions compound silently; budgets make them visible.
## Practical workflow

1. **Establish the train.** Cadence, cutoff, stabilization window, release captain rotation, and go/no-go criteria. Document the process; automate what you can (builds, notes, submissions).
2. **Instrument.** Crash reporting, performance monitoring, analytics per version, and rollout dashboards. You can't gate rollouts without data.
3. **Use feature flags.** Flag new features by default, define rollout plans (percentage stages), set kill-switch procedures, and schedule flag cleanup (remove within 2 releases).
4. **Execute releases.** Build → internal testing (dogfood) → beta (TestFlight/Play testing tracks) → phased production rollout with health gates → full release. Monitor at each stage.
5. **Manage stores.** Submission checklists, metadata prepared in advance, review-guideline compliance checks, and coordinated release timing across iOS/Android.
6. **Review.** Post-release: crash rates, key metrics, user feedback, store ratings. Retro on incidents; feed learnings into checklists.

**Go/no-go checklist:** crash-free rate on beta → key metrics stable → critical bugs zero → store metadata ready → support briefed → rollback plan defined → monitoring dashboards watched.


**Release checklist:** feature flags configured → staged rollout plan → crash monitoring alerts set → release notes written → app store assets updated → support briefed on changes → rollback plan ready → post-release monitoring scheduled (first 24h critical).
**Beta programs:** TestFlight / Play Console internal → closed beta (1,000–5,000 users) → open beta → production.
Recruit beta users who match your segments; generic beta testers find generic bugs.
Incentivize feedback — beta silence wastes the program.
**App store optimization ops:** keyword monitoring, screenshot A/B testing, ratings prompt timing (after positive moments), review response SLAs, and competitor release tracking.
Treat the store listing as a living asset, not a one-time setup.
## Common pitfalls

- **Big-bang releases.** Infrequent massive updates. Small, frequent releases are safer and faster.
- **Skipping phased rollout.** 100% on day one. Phased rollouts catch issues before they hit everyone.
- **Unwatched gates.** Phased rollout with nobody monitoring. Assign a watcher; define halt criteria.
- **Flag sprawl.** Hundreds of stale flags. Lifecycle management: remove flags after full rollout.
- **Friday releases.** Shipping before weekends/holidays. Time releases for when the team can respond.
- **Store rejection surprises.** Submitting without guideline checks. Pre-submission compliance review.
- **Ignoring old versions.** Breaking APIs for users on old app versions. Version support policy + graceful degradation.
- **Skipping staged rollouts.** Shipping to 100% immediately. One bad release without staging can tank ratings for months — ratings recover slowly.
- **Ignoring Android fragmentation.** Testing on flagships only. Your crash reports will be dominated by low-end devices you never tested — maintain a device lab or cloud testing.
- **Feature flags without cleanup.** Hundreds of stale flags accumulating. Flag hygiene: every flag has an owner and an expiry; audit quarterly.
- **Slow hotfix process.** Critical crashes waiting for the next train. Define hotfix criteria and keep the lane genuinely fast (< 24h).
