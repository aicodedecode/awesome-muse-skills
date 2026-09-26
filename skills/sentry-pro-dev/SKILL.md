---
name: sentry-pro-dev
description: Sentry guidance — error tracking setup, release health, performance monitoring, alert rules, and quota management.
category: development
---

## Overview

Sentry is the error-tracking standard: SDKs capture exceptions with stack traces, breadcrumbs, and context; issues group similar errors; release health tracks crash-free rates; and performance monitoring adds transaction profiling. When something breaks in production, Sentry is usually where the investigation starts.

The difference between Sentry as a firehose and Sentry as a tool is configuration: sampling, grouping, alert rules, and ownership. This skill covers SDK setup, making issues actionable, release health, performance monitoring, and keeping the quota (and noise) under control.

## When to use

- Setting up Sentry in any application (SDK config, environments, releases).
- Reducing noise (sampling, filtering, grouping).
- Writing alert rules that page the right people.
- Using release health and crash-free rates.
- Adding performance monitoring (transactions, profiling).
- Managing Sentry quotas and costs.
- Integrating Sentry with the deploy pipeline.

## Core concepts

- **Issues, not events.** Sentry groups similar events into issues by fingerprinting (stack trace primarily). Good grouping means one issue per bug; bad grouping means either a thousand issues or one mega-issue hiding distinct bugs.
- **SDK configuration.** `Sentry.init` with DSN, environment, release, sample rates. Initialize early (before other imports where possible); the SDK must be set up before errors can be captured.
- **Releases.** Tie errors to releases (commit SHA via CI integration) — "is this new in the latest deploy?" becomes answerable, and regressions get flagged automatically. Release health tracks crash-free sessions/users per release.
- **Environments.** Separate production/staging/development — issues filtered by environment; alert rules scoped to production. Dev noise must not page anyone.
- **Breadcrumbs.** Automatic (navigation, console, HTTP) + manual breadcrumbs reconstruct the user's path to the error. Add domain breadcrumbs (cart actions, form steps) for business-context debugging.
- **Context and tags.** Tags (indexed, searchable: user tier, feature flag) vs context (rich, unindexed: request body shapes). Tag what you filter and alert on; context for the rest.
- **Fingerprinting.** Custom `fingerprint` rules when default grouping fails — group by error type + location, split by distinct causes. Review grouping periodically; SDK upgrades can change it.
- **Sampling.** `tracesSampleRate` for performance, error sampling for high-volume noise — but sample deliberately: dropping the one error that matters is worse than quota overage. Dynamic sampling by release/environment.
- **Alert rules.** Issue alerts (new issue, regression, spike) routed to owners; metric alerts (crash-free rate drops). Route by team ownership (codeowners integration); every alert needs an action.
- **Ownership.** Codeowners or explicit ownership rules assign issues to teams — unowned issues rot. Triage cadence (daily/weekly) keeps the backlog honest.
- **Performance monitoring.** Transaction sampling, spans for DB/HTTP/queue operations, profiling for hot code paths. Performance issues (N+1 queries, slow endpoints) surface alongside errors.
- **Session replay.** Video-like reproductions of user sessions leading to errors — powerful for frontend debugging; privacy review required (masking sensitive inputs).
- **Quota management.** Events, transactions, replays, and attachments each consume quota. Spikes (deploy gone wrong, bot traffic) can exhaust quotas — rate limits, filtering, and spike protection exist for this.
- **Inbound filters.** Filter out known noise (browser extensions, health checks, crawler errors) before they consume quota or attention.
- **Integrations.** GitHub/GitLab (suspect commits, issue linking), Slack/PagerDuty (alerts), Jira/Linear (issue sync). The workflow glue that makes issues actionable.
- **Cron monitoring.** Check-ins for scheduled jobs — missed or failed crons create issues automatically; silent job failures become visible.
- **User feedback.** Widget/API for users to report issues with context attached — qualitative signal alongside automatic capture.

## Practical workflow

1. **Initialize the SDK properly.** Early init, environment + release set, sample rates configured, PII scrubbing (`beforeSend` / `sendDefaultPii: false`).
   ```js
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     release: process.env.GIT_SHA,
     tracesSampleRate: 0.1,
     beforeSend(event) { scrubPII(event); return event; },
   });
   ```
2. **Wire releases to CI.** Set release = commit SHA in the build; upload sourcemaps (private, with proper auth tokens scoped minimally); mark deploys so regressions auto-flag.
3. **Add domain context.** Tags for tenant tier, feature flags, route; breadcrumbs for business actions; user identification (ID only, no PII by default).
4. **Tune grouping.** Review issue grouping after rollout; custom fingerprint rules for mis-grouped errors; merge/split deliberately.
5. **Write alert rules.** New-issue and regression alerts to owning teams; crash-free-rate drops paging; spike protection for deploy mishaps. Route via ownership, not a single channel.
   - Alert fatigue kills error tracking — alert on new/regressed/spiking, not on every occurrence.
6. **Set up performance monitoring.** Sampled transactions with meaningful names (route templates, not URLs); alert on p95 regressions for critical endpoints; profiling for backend hot paths.
7. **Manage quotas.** Per-project rate limits, inbound filters for noise, spike protection on; monitor quota consumption vs plan; transactions sampled by value (critical paths higher).
8. **Run triage.** Regular issue review: assign owners, resolve what's fixed (with the fix linked), archive what's noise (with a filter so it stays archived). The issue backlog is a product-quality dashboard.

## Common pitfalls

- **No release tracking** — errors unattributable to deploys; set release = SHA in CI.
- **Dev noise paging** — alerts firing on staging/dev; scope alerts to production.
- **Default grouping unchecked** — mega-issues or issue spam; review and tune fingerprinting.
- **Sourcemaps missing** — minified stack traces, useless issues; upload in CI with scoped tokens.
- **PII in events** — user data captured by default in some SDKs; scrub with `beforeSend`, review data.
- **100% trace sampling** — quota exhaustion; sample by value and environment.
- **Alert on every occurrence** — notification firehose; alert on new/regression/spike.
- **Unowned issues** — nobody triages; ownership rules + cadence.
- **No inbound filters** — browser-extension and crawler noise consuming quota; filter known noise.
- **Replay without privacy review** — sensitive inputs recorded; masking configured first.
- **Ignoring performance** — only errors tracked; transactions reveal the slow-burn problems.
- **Quota surprises** — no monitoring of consumption; alerts on quota usage, spike protection on.
- **Resolving without fixing** — issues resolved to clear the queue; link fixes, verify in the next release.
- **Ignoring cron monitoring** — scheduled jobs failing silently; add check-ins for every critical cron.
- **No spike protection** — a bad deploy exhausting quota in minutes; enable spike protection and per-project rate limits.
