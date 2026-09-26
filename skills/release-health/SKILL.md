---
name: release-health
description: Monitoring release health — crash-free rates, adoption, and catching bad deploys early — platform-agnostic patterns.
category: sentry
---

## Overview

Every release is a hypothesis: "this version is better than the last."
Release health monitoring tests that hypothesis with data — crash-free
rates, error deltas, performance changes, and adoption — so bad releases
get caught in minutes, not days. This skill covers the release-health
discipline for web, mobile, and backend deploys.

## When to use

- Tracking whether a new release is healthy or regressing
- Setting up crash-free session/user metrics (especially mobile)
- Comparing error and performance across versions
- Building progressive rollout / canary analysis
- Deciding when to roll back vs roll forward

## Core concepts

**Tag everything with the release.** Errors, transactions, crashes, and
business metrics all carry the version (git SHA, build number, semantic
version). Without release tagging, "did v2.4 cause this?" is unanswerable —
this is the foundation everything else builds on.

**Crash-free rate is the headline metric.** % of sessions (or users) without
a crash, per release. It's the single number that summarizes mobile release
health; for web/backend, the analogues are error-rate delta and failed-
request ratio per version. Track it per release from the first hour.

**Compare against the previous release, not absolute ideals.** A new release
with 99.2% crash-free vs 99.5% previous = investigate; vs 98.0% previous =
improvement. Deltas drive decisions; absolutes without context mislead
(a legacy-heavy user base has a different baseline than a new app).

**Progressive rollout contains blast radius.** Staged rollouts (1% → 10% →
50% → 100%), canary analysis comparing key metrics between canary and
baseline, and automatic halt/rollback on regression thresholds. The rollout
strategy is part of release health — full-speed deploys maximize the cost
of being wrong.

**Adoption curves matter.** Slow adoption of a new version extends the
window where old bugs live; stalled adoption signals update problems
(broken auto-update, users avoiding a bad release). Monitor version
distribution alongside health.

## Practical workflow

1. **Instrument releases:** CI sets the version on every build; SDKs/
   trackers receive it; verify a staging release reports correctly before
   relying on it in production.
2. **Define health gates:** crash-free/session-error thresholds per
   release (e.g. alert if crash-free drops >0.3pp vs previous, or below
   99%), plus key transaction error-rate comparisons.
3. **Roll out progressively:** staged percentages with automatic pauses on
   gate breaches; canary metrics compared against the stable baseline.
4. **Watch the first hours:** new-issue alerts scoped to the release,
   performance deltas on core transactions, and support-ticket themes —
   the first 2–4 hours catch most bad releases.
5. **Decide rollback vs forward-fix:** rollback for crashes/data corruption/
   widespread breakage (fast, safe); forward-fix for minor issues with a
   quick, low-risk patch. Decide by blast radius and fix confidence, not
   pride.
6. **Close the loop:** post-release review comparing predicted vs actual
   health; feed "what would have caught this earlier" into gates and tests.

## Common pitfalls

- **No release tagging** — errors and metrics unattributed to versions;
  diagnosis becomes guesswork.
- **100% instant rollouts** — every release is a full-blast-radius bet;
  stage them.
- **Ignoring the long tail** — release looks healthy at 50% adoption, but
  the remaining users on old versions hit a known-bad bug; track version
  distribution.
- **Rollback hesitation** — "let's just fix forward" while users crash for
  hours; pre-decide rollback criteria so the call is easy under pressure.
- **Vanity health metrics** — crash-free looks fine because crashes moved
  to unhandled-but-caught errors; watch the full error picture, not one
  number.
- **No post-release review** — the same class of bad release ships again;
  review and harden the gates each time.
