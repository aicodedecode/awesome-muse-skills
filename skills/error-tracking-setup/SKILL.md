---
name: error-tracking-setup
description: Setting up application error tracking — SDK integration, grouping, and context — works with any error-monitoring platform.
category: sentry
---

## Overview

Error tracking turns "users are seeing something broken" into actionable
reports: what failed, where, how often, and for whom. The setup is similar
across platforms (Sentry, Rollbar, Bugsnag, and similar): install an SDK,
capture unhandled errors with context, and configure grouping and alerts.
This skill covers doing it well, vendor-neutrally.

## When to use

- Adding error tracking to a new application (frontend, backend, mobile)
- Deciding what context to attach to error reports (user, release, breadcrumbs)
- Taming noisy error groups and alert fatigue
- Handling source maps for minified JavaScript
- Setting up error tracking across environments (dev/staging/prod)

## Core concepts

**Capture unhandled errors automatically, handled ones deliberately.** SDKs
hook uncaught exceptions and unhandled rejections out of the box. For caught
errors that still matter (failed payments, degraded fallbacks), capture
explicitly with severity levels — but don't log-and-capture everything;
noise drowns signal.

**Context is what makes errors actionable.** Attach: release/version
(which deploy introduced it?), environment, user/request identifiers (not
PII-heavy — IDs, not names), and breadcrumbs (the last N actions before the
crash: navigation, API calls, clicks). An error with "user X, release 1.2.3,
after 3 failed API retries" is debuggable; a bare stack trace often isn't.

**Grouping determines your workload.** Platforms group identical errors by
stack trace fingerprint. Bad grouping (one group per URL parameter) floods
you; over-grouping hides distinct bugs. Tune grouping rules: strip volatile
values (IDs, timestamps) from fingerprints, split genuinely different
failures.

**Source maps for frontend.** Minified production JS produces useless stack
traces without source maps. Upload them at build time (CI step), keep them
out of public bundles (upload privately, don't serve `.map` files), and
verify with a test error that traces resolve to real code.

**Sampling and quotas.** High-traffic apps can't send every error; sample
intelligently (100% of new/critical, sampled repeats) and set per-issue rate
limits. Monitor ingestion volume — error-tracking bills scale with events,
and a logging loop can bankrupt the quota overnight.

## Practical workflow

1. **Install the SDK** per platform docs for each runtime (browser, Node,
   Python, mobile); initialize early in the boot sequence with DSN/key,
   environment, and release set from CI.
2. **Configure context:** user identification (stable ID), release tracking
   (git SHA per deploy), breadcrumbs (navigation, HTTP, console — automatic
   in most SDKs), and custom tags for segmentation (tenant, plan, region).
3. **Set up source maps** (frontend) or debug symbols (native) in the build
   pipeline; verify symbolication with a deliberate test error in staging.
4. **Tune ingestion:** environment filtering (don't send dev noise to prod
   projects), `beforeSend` hooks to scrub PII and drop known noise
   (browser-extension errors, bot traffic), and rate limits per issue.
5. **Wire alerts:** new-issue alerts to the owning team, regression alerts
   (resolved issue reappears), and spike alerts — routed by team ownership,
   not to one global channel.
6. **Establish the triage habit:** daily/weekly review of new issues (see
   issue-triage); unresolved error debt compounds exactly like tech debt.

## Common pitfalls

- **No release tracking** — can't tell which deploy introduced the error;
  always set the release at build time.
- **PII in error payloads** — passwords, tokens, full request bodies in
  reports; scrub in `beforeSend` and audit what gets sent.
- **Alerting on every error** — pages for one-off blips; alert on new
  issues, regressions, and spikes, not raw counts.
- **Ignoring frontend errors** — backend-only tracking misses the errors
  users actually see; instrument the client too.
- **Source maps missing or stale** — minified traces nobody can read;
  automate upload in CI and verify.
- **Letting the backlog rot** — 500 open issues nobody triages; the tool
  becomes write-only. Triage regularly or stop paying for it.
