---
name: alert-rules
description: Designing alert rules that fire when it matters — thresholds, burn rates, and routing — for any monitoring stack.
category: sentry
---

## Overview

Alert rules translate "something is wrong" into "the right human knows, with
enough context to act". Good alerting is a design discipline: alert on
user-impacting symptoms, route by severity and ownership, and ruthlessly
eliminate noise. This skill covers alert design patterns that work across
monitoring platforms.

## When to use

- Writing alert rules for services, error trackers, or infrastructure
- Reducing alert noise and fatigue
- Choosing between threshold alerts and burn-rate (SLO) alerts
- Setting up routing, escalation, and on-call integration
- Reviewing an existing alert set for quality

## Core concepts

**Alert on symptoms, not causes.** Users experience "checkout is failing",
not "CPU is 85%". Symptom alerts (error rate, latency, availability) fire
when users hurt; cause metrics (CPU, disk, queue depth) belong on dashboards
and as diagnostic context — or as lower-severity warnings when they predict
symptoms.

**Burn-rate alerting for SLOs.** Multi-window burn rate (fast-burn: 1h/6h
windows → page; slow-burn: 1d/3d → ticket) detects real reliability threats
with far fewer false positives than static thresholds. It's the gold standard
for request-based services; use it wherever you have SLIs.

**Severity tiers with distinct responses.** Critical/page: user impact now,
human acts immediately. Warning/ticket: degrading or at-risk, handle in
working hours. Info:FYI, dashboards only. Every alert declares its tier, and
tiers map to notification channels — never page for a warning.

**Routing by ownership.** Alerts go to the team that owns the code, via their
on-call rotation — not to a global channel everyone mutes. Maintain the
service→team→rotation mapping; misrouted alerts are effectively unmonitored.

**Every alert needs a runbook link.** The alert message should say what's
wrong, why it fired (the actual values), and link the response procedure.
An alert without a runbook is a puzzle delivered at 3am.

## Practical workflow

1. **Start from SLIs/SLOs:** define burn-rate alerts for each SLI (fast +
   slow windows); these are your primary paging alerts.
2. **Add spike/regression alerts** for error tracking (new issues,
   reappearing resolved issues, abnormal volume) routed to owning teams.
3. **Add resource-exhaustion warnings** (disk filling in < N hours, cert
   expiring, quota at 80%) as tickets — predictive, not paging, unless
   exhaustion is imminent.
4. **Write the alert message well:** what, where, current value vs
   threshold, probable impact, runbook link, and relevant dashboard link.
5. **Tune deliberately:** after any false positive or missed detection,
   adjust the rule (not just silence it) — thresholds, windows, and grouping
   are living configuration.
6. **Review quarterly:** which alerts fired, which were actionable, which
   were noise — demote or fix the noisy ones; delete alerts nobody would
   act on.

## Common pitfalls

- **Threshold on everything** — static thresholds on noisy metrics =
  pager fatigue; prefer burn rates and anomaly-aware rules.
- **No grouping/dedup** — 200 alerts for one incident; group by incident/
  service so responders see one actionable notification.
- **Alerting on causes** — CPU/disk pages while users are fine; reserve
  pages for user-impacting symptoms.
- **Stale ownership** — alerts routing to a disbanded team or an ex-
  employee's email; audit routing with org changes.
- **Silencing instead of fixing** — snoozed alerts that never get tuned;
  every silence should create a follow-up task.
- **Missing the "all clear"** — no resolve notification leaves responders
  unsure; ensure alerts resolve (and notify) when healthy.
