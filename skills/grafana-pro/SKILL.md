---
name: grafana-pro
description: Grafana guidance — dashboard design, variables, alerting, data source provisioning, and Loki/Tempo integration.
category: development
---

## Overview

Grafana is the visualization layer for observability: dashboards over Prometheus, Loki, Tempo, Elasticsearch, CloudWatch, and dozens more data sources, plus alerting and (with Loki/Tempo) log and trace exploration. It's the pane of glass teams actually look at — which makes dashboard design a high-leverage skill.

Good Grafana practice is about curation: a few excellent dashboards beat fifty mediocre ones. This skill covers dashboard design principles, templating with variables, provisioning as code, alerting, and the logs/traces correlation story.

## When to use

- Designing dashboards (layout, panels, queries).
- Templating dashboards with variables for reuse.
- Setting up Grafana alerting (vs Prometheus Alertmanager).
- Provisioning data sources and dashboards as code.
- Correlating metrics, logs (Loki), and traces (Tempo).
- Organizing Grafana for multiple teams (folders, RBAC, orgs).
- Optimizing slow dashboards.

## Core concepts

- **Dashboards answer questions.** Each dashboard should answer one question ("is the checkout flow healthy?") in under a minute. Start with RED/USE rows, then drill-down details. A dashboard nobody can read in a crisis is decoration.
- **Golden signals first.** Latency, traffic, errors, saturation on every service dashboard — the same layout everywhere builds muscle memory for incidents.
- **Variables.** Template variables (datasource, service, environment, time ranges) make one dashboard serve many services. Chained variables (region → cluster → pod) keep selectors manageable. Always include an `All` option where it makes sense.
- **Panel types.** Time series (trends), stat/gauge (current values), tables (rankings), heatmaps (distributions), logs panels. Match the visualization to the question — a heatmap for latency distributions beats a p99 line for spotting multimodality.
- **Repeat panels/rows.** `repeat` by variable clones panels per service/instance — one definition, N views. Powerful; keep the variable cardinality sane.
- **Annotations.** Deploy markers and incident annotations overlaid on graphs — correlating "what changed" with "what broke" visually. Automate deploy annotations from CI.
- **Alerting.** Grafana alerting (unified alerting) evaluates queries and notifies via contact points; vs Prometheus Alertmanager — use one primary alerting path per signal to avoid duplicate/conflicting alerts. Every alert needs a runbook link.
- **Provisioning as code.** Data sources, dashboards, and alert rules in YAML/JSON versioned in git — Grafana instances become reproducible. Hand-built dashboards in the UI are snowflakes; export and commit them.
- **Loki.** Log aggregation with the same label model as Prometheus — `{app="api"} |= "error"` queries, cheap to run, correlated with metrics via labels. Not a full-text search engine; for that, keep Elasticsearch.
- **Tempo.** Distributed tracing backend (OTLP-compatible) — trace IDs linking metrics exemplars → traces → logs. The correlation story: alert fires on a metric, exemplar jumps to the trace, logs explain it.
- **Correlations.** Data source correlations and derived fields turn IDs into links (trace ID → Tempo, log link → Loki). Wire these once and investigations get dramatically faster.
- **Folders, RBAC, orgs.** Organize by team; viewer/editor/admin roles; teams mapped from SSO. Dashboard sprawl needs ownership — every folder has an owner.
- **Performance.** Slow dashboards usually mean expensive queries (fix with recording rules), too many panels, or huge time ranges. Set default time ranges sensibly; use $__interval correctly.
- **Playlists and reporting.** Rotating displays for NOC walls; scheduled reports for stakeholders who won't open Grafana.
- **Versioning.** Dashboard JSON in git with CI validation; treat dashboard changes like code changes for critical views.
- **Library panels.** Shared panel definitions reused across dashboards — change once, update everywhere; the DRY mechanism for golden dashboards.
- **Public dashboards.** Shareable read-only links for external stakeholders — review data-source security implications before enabling.

## Practical workflow

1. **Provision as code.** Data sources YAML, dashboards JSON from git; Grafana starts complete, not empty. No hand-built production dashboards.
   ```yaml
   apiVersion: 1
   datasources:
     - name: Prometheus
       type: prometheus
       url: http://prometheus:9090
       isDefault: true
   ```
2. **Design the golden dashboard.** Per service: RED rows (rate, errors, duration with heatmap), saturation (CPU/memory/queue), dependencies, deploy annotations. Same layout for every service.
3. **Template with variables.** Datasource, environment, service variables; chained where needed; `All` options; repeat panels for multi-instance views.
4. **Wire correlations.** Exemplars from Prometheus → Tempo; derived fields from logs → traces; dashboard links between service views. The investigation path should be clicks, not copy-paste.
5. **Add Loki for logs.** Label-consistent log queries beside metrics; log volume alerts for error spikes; keep high-cardinality out of labels (same rule as Prometheus).
6. **Set up alerting deliberately.** One alerting path per signal (Grafana or Alertmanager, not both conflicting); contact points per team; runbook links; alert state history reviewed for flapping.
7. **Curate ruthlessly.** Dashboards have owners; unused dashboards get archived; incident reviews ask "which dashboard answered this?" and fix the ones that didn't.
8. **Optimize.** Recording rules for heavy queries, sane default time ranges, panel count discipline; monitor Grafana's own query performance.

   ```yaml
   apiVersion: 1
   groups:
     - orgId: 1
       name: api-health
       interval: 1m
       rules:
         - uid: high-error-rate
           title: High error rate
           condition: C
           data: [] # query + expression definitions omitted for brevity
           annotations: { runbook: https://wiki.example.com/runbooks }
   ```

## Common pitfalls

- **Dashboard sprawl** — 200 dashboards, none trusted; curate to a golden set with owners.
- **No variables** — copy-pasted dashboards per service; template once.
- **Slow queries in panels** — dashboards timing out; recording rules and sane ranges.
- **Hand-built prod dashboards** — UI snowflakes; provision as code from git.
- **Alerting in two systems** — Grafana + Alertmanager firing duplicates; one path per signal.
- **Alerts without runbooks** — pages with no guidance; link runbooks on every alert.
- **Missing correlations** — metrics, logs, traces unlinked; wire exemplars and derived fields.
- **High-cardinality Loki labels** — same explosion as Prometheus; keep labels bounded.
- **No deploy annotations** — "what changed?" unanswerable from graphs; automate annotations from CI.
- **Wrong panel types** — p99 lines hiding multimodal latency; heatmaps for distributions.
- **Overly broad time ranges** — default 30d views timing out; sensible defaults per dashboard.
- **No RBAC** — everyone admin; teams with appropriate roles via SSO.
- **Ignoring alert flapping** — noisy alerts training teams to ignore pages; tune thresholds and `for` durations.
