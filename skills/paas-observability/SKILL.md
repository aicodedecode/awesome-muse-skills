---
name: paas-observability
description: Observability on PaaS platforms — logs, metrics, traces, and alerts without managing the plumbing — vendor-neutral patterns.
category: railway
---

## Overview

PaaS platforms give you built-in logs and basic metrics, but production
observability needs more: structured logging, custom metrics, distributed
traces, and alerts that fire before users notice. This skill covers building
a complete observability setup on managed platforms using portable,
provider-agnostic practices.

## When to use

- Setting up logging, metrics, and tracing for a PaaS-deployed app
- Choosing what to log (and what not to) in production
- Creating dashboards and alerts for the four golden signals
- Adding distributed tracing across services
- Draining platform telemetry to external observability tools

## Core concepts

**Logs: structured, sampled, drained.** Emit JSON logs with request IDs,
severity, and key fields — plain text doesn't query. Platform log retention
is short; drain to a log aggregator for search and retention. Log the
request lifecycle (start/finish with latency and status), errors with stack
traces and context, and business events — not every debug line at info level
in production.

**Metrics: the four golden signals.** Latency (p50/p99), traffic (requests/
sec), errors (rate), saturation (CPU/memory/queue depth/connections) — per
service. Add business metrics (signups, orders, conversion) alongside. Use
the platform's built-in metrics where good enough; add a metrics library +
managed Prometheus-style backend when you outgrow them.

**Traces connect the dots.** When a request crosses services (API → worker →
DB → third party), distributed tracing (OpenTelemetry) shows the full path
and where time went. Instrument once with OTel SDKs and export to any
backend — the instrumentation is portable even if the backend changes.

**Alerts on symptoms that matter.** Alert on user-facing signals (error
budget burn, p99 latency, error rate) with runbook links, not on raw
infrastructure noise. Every alert needs an owner, a severity, and a response
procedure — otherwise it's just pager spam (see alert-rules).

**Cardinality is the cost driver.** High-cardinality labels (user IDs, full
URLs, request IDs as metric tags) explode metric storage costs and break
backends. Keep metric labels to bounded sets (route templates, status codes,
regions); put high-cardinality data in logs/traces.

## Practical workflow

1. **Instrument the app:** structured JSON logging with correlation IDs,
   OTel tracing SDK, and key custom metrics — in code, portable across
   platforms.
2. **Drain platform telemetry:** connect log drains and metric integrations
   to your observability backend on day one, not during the first incident.
3. **Build the essential dashboards:** golden signals per service, business
   KPIs, dependency health (DB, cache, third parties), and deploy markers
   so regressions correlate with releases.
4. **Define alerts:** burn-rate / error-rate / latency alerts with runbooks,
   routed to the right channel (page vs ticket); review alert noise monthly.
5. **Add synthetic checks:** uptime probes and key-transaction synthetics
   from outside the platform — they catch what internal metrics miss
   (DNS, TLS expiry, CDN issues).
6. **Practice using it:** during game days and incidents, note every
   "I wish I could see X" — that's your observability backlog.

## Common pitfalls

- **Unstructured logs** — `console.log("here")` at scale is unsearchable;
  structure from the start.
- **Relying on platform log retention** — 7 days of logs vanishes exactly
  when you need last month's; drain early.
- **Metric cardinality explosion** — user IDs as tags; costs spike and
  queries die. Bounded labels only.
- **Dashboards nobody looks at** — 40 panels of vanity metrics; curate the
  few that drive decisions and keep them accurate.
- **Alerts without runbooks** — paging someone with no documented response
  just adds stress; link every alert to its procedure.
- **Tracing sampled at 100% in production** — overhead and cost; use
  head-based sampling with tail-based capture for errors.
