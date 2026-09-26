---
name: datadog-pro
description: Datadog guidance — APM, logs, metrics, monitors, SLOs, dashboards, and cost control on the Datadog platform.
category: development
---

## Overview

Datadog is the all-in-one observability platform: infrastructure monitoring, APM tracing, log management, RUM, synthetics, and security — unified by tagging. Its strength is correlation with minimal setup: install the agent, get metrics/traces/logs linked automatically. Its weakness is the bill, which scales with hosts, ingested logs, and custom metrics.

Using Datadog well means: tag everything consistently, be deliberate about what's ingested (logs and custom metrics are the cost drivers), and build monitors/SLOs on symptoms. This skill covers the platform's core, cost control, and operational patterns.

## When to use

- Setting up Datadog (agents, integrations, APM).
- Designing tagging strategy and dashboards.
- Writing monitors (thresholds, anomaly, composite).
- Defining SLOs and error budgets.
- Controlling Datadog costs (logs, custom metrics, retention).
- Correlating traces, logs, and metrics in investigations.
- Choosing between Datadog and Prometheus/Grafana/ELK.

## Core concepts

- **Unified tagging.** Tags (`env:prod`, `service:api`, `version:abc`) unify metrics, traces, and logs. A consistent tagging scheme is the highest-leverage Datadog decision — inconsistent tags make correlation impossible.
- **The Agent.** Host/container agent collecting metrics, traces (APM), and logs. DaemonSet in Kubernetes; trace client libraries in apps. One agent version policy — keep them updated.
- **APM.** Distributed tracing with automatic instrumentation for common frameworks; custom spans for business operations. Trace search and analytics on span tags; link traces to logs via trace IDs.
- **Log management.** Ingest, parse (pipelines/grok), index selectively. Ingestion is the cost driver — index what you search, archive the rest to object storage (rehydration when needed).
- **Custom metrics.** The other cost driver — billed per unique metric+tag combination per month. Cardinality discipline (same rule as Prometheus) plus metrics-without-limits (distributions) where appropriate.
- **Monitors.** Threshold, anomaly, forecast, and composite monitors; multi-alert vs simple-alert (per-group or aggregate). Alert on symptoms; include runbook links and tags for routing.
- **SLOs and error budgets.** Time-slice or monitor-based SLOs with error-budget alerts — the framework for "how reliable are we" that both engineering and product understand.
- **Dashboards and notebooks.** Timeboards (shared, versioned-ish) vs screenboards; notebooks for investigations and postmortems. Template variables for reuse; keep golden dashboards curated.
- **Synthetics.** API tests and browser tests from global locations — proactive monitoring of user journeys, not just backend health. Test the checkout flow, not just `/health`.
- **RUM.** Real-user monitoring for frontend performance and errors — Web Vitals, session replay. Privacy implications need review (masking, consent).
- **Watchdog.** ML-driven anomaly detection surfacing issues without predefined monitors — triage its findings, don't auto-page on them initially.
- **Service catalog and Scorecards.** Service ownership, docs, and health scorecards — the organizational layer that keeps observability maintained as teams grow.
- **Sensitive data.** Log scrubbing (obfuscation rules) for PII/secrets — configure before sensitive data flows, not after an incident.
- **Cost controls.** Usage attribution by team (tags!), log exclusion filters, metrics cardinality management, retention settings, and regular bill reviews with owners per cost center.
- **Incident management.** Declared incidents with timelines, responders, and retrospectives — the coordination layer that turns alerts into resolved outages.
- **Cloud cost management.** Cost attribution alongside observability — the same tags showing spend per service, so cost and performance live in one view.

## Practical workflow

1. **Define the tagging scheme.** `env`, `service`, `version`, `team` on everything — agent config, APM, logs. Enforce via admission checks or CI; audit tag coverage.
2. **Deploy agents consistently.** DaemonSet with log collection in K8s; APM enabled; dogstatsd for custom app metrics; keep agent versions current.
3. **Control ingestion.** Log pipelines parsing only needed fields; exclusion filters dropping debug/health-check noise before indexing; archive everything to storage; custom-metrics cardinality review.
   - Rule of thumb: if nobody searches it, don't index it — archive and rehydrate on demand.
4. **Build golden dashboards.** Per service: RED metrics, saturation, dependencies, deploy markers (via events API from CI). Template variables for env/service.
5. **Write monitors on symptoms.** Error-rate, latency, and saturation monitors with multi-alert grouping; anomaly detection for seasonal patterns; composite monitors for "really broken" paging.
   ```json
   { "name": "[prod] High error rate — shop-api",
     "type": "query alert",
     "query": "avg(last_5m):sum:trace.http.request.errors{env:prod,service:shop-api}.as_rate() / sum:trace.http.request.hits{env:prod,service:shop-api}.as_rate() > 0.05",
     "message": "@pagerduty Runbook: https://wiki.example.com/runbooks/high-error-rate" }
   ```
6. **Define SLOs.** A few meaningful SLOs per critical service (availability, latency); error-budget burn alerts; review in planning — budgets guide prioritization.
7. **Add synthetics for user journeys.** API and browser tests for critical flows from relevant locations; alert on failure with the same severity as backend pages.
8. **Attribute and control cost.** Usage dashboards by team/service; monthly reviews; log rehydration instead of permanent indexing for cold data; right-size retention.

   # exclusion filter: drop health-check noise before indexing
   # Query:  status:ok service:api @http.url:/health
   # Action: exclude from index (still archived to object storage)

## Common pitfalls

- **Inconsistent tagging** — correlation impossible; define and enforce the scheme early.
- **Indexing everything** — log bills exploding; exclusion filters + archive + rehydrate.
- **Custom metric cardinality** — per-user/per-request tags; the bill scales with unique combinations.
- **Monitors on causes** — paging for CPU; alert on user-facing symptoms.
- **Monitors without runbooks** — pages with no guidance; link runbooks.
- **Simple-alert when multi-alert needed** — one alert for 50 hosts; group appropriately.
- **No SLOs** — reliability debates without data; define a few meaningful SLOs.
- **Watchdog auto-paging** — ML findings paging before trust is built; triage first.
- **PII in logs** — sensitive data ingested unscrubbed; obfuscation rules from day one.
- **Stale monitors** — alerts for decommissioned services; audit monitors with service lifecycle.
- **RUM without privacy review** — session replay capturing sensitive input; masking and consent.
- **No cost attribution** — one bill, no owners; tag-based usage dashboards per team.
- **Synthetics only on `/health`** — green while checkout is broken; test real user journeys.
- **No exclusion filters** — debug and health-check logs indexed at full price; filter noise before indexing.
- **Tag sprawl** — hundreds of low-value tags multiplying custom-metric costs; audit tag cardinality regularly.
