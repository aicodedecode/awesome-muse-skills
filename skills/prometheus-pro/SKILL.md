---
name: prometheus-pro
description: Prometheus guidance — metrics design, PromQL, alerting rules, exporters, recording rules, and operations.
category: development
---

## Overview

Prometheus is the standard open-source metrics system: it scrapes HTTP endpoints for time-series metrics, stores them efficiently, queries with PromQL, and alerts via Alertmanager. The pull model, dimensional labels, and powerful query language make it the backbone of Kubernetes observability and much more.

Using Prometheus well is about metric design (what to instrument, how to label), PromQL fluency, and alerting discipline (alert on symptoms, not causes). This skill covers instrumentation patterns, PromQL, recording/alerting rules, and operating Prometheus reliably.

## When to use

- Instrumenting applications (choosing metrics and labels).
- Writing PromQL queries and dashboards.
- Designing alerting rules (what to alert on, thresholds).
- Setting up exporters (node, blackbox, custom).
- Configuring recording rules for expensive queries.
- Operating Prometheus (retention, HA, federation, remote storage).
- Choosing between Prometheus, Datadog, and cloud metrics.

## Core concepts

- **Pull model.** Prometheus scrapes `/metrics` endpoints on an interval — targets can die without affecting the server, and there's no agent to deploy per app. Pushgateway exists for batch jobs; it's the exception, not the pattern.
- **Metric types.** Counter (monotonically increasing — requests, errors), Gauge (current value — connections, queue depth), Histogram (distributions — latencies, with buckets), Summary (client-computed quantiles — avoid, use histograms). Choosing the wrong type makes queries misleading.
- **Labels are dimensions.** `http_requests_total{method="GET", status="500"}` — labels slice metrics. Keep cardinality bounded: labels with unbounded values (user IDs, request IDs) explode storage and crash servers.
- **Naming conventions.** `<namespace>_<subsystem>_<unit>_{total,seconds,bytes}` — `http_request_duration_seconds`. Consistent names make PromQL discoverable; document your conventions.
- **RED and USE.** RED (Rate, Errors, Duration) for services; USE (Utilization, Saturation, Errors) for resources. These mnemonics structure both instrumentation and dashboards — cover them before exotic metrics.
- **PromQL essentials.** `rate()` for counters (always over a range, never `irate` for alerting), `histogram_quantile()` for latency percentiles, `avg_over_time`/`max_over_time` for gauges, label matching and aggregation (`sum by (service)`).
- **Recording rules.** Precompute expensive queries (`job:http_request_duration:p99`) on an interval — dashboards and alerts query the recording, not the raw data. Essential at scale.
- **Alerting rules.** Alert on symptoms (error rate, latency, saturation) with `for:` durations to avoid flapping. Every alert needs a runbook link, a severity, and an owner — alerts without runbooks are just noise.
- **Alertmanager.** Deduplication, grouping, silencing, and routing (PagerDuty/Opsgenie/Slack). Group related alerts; route by severity and team; inhibit cascading alerts (don't page for every pod when the node is down).
- **Exporters.** node_exporter (host metrics), blackbox_exporter (probing), kube-state-metrics (K8s objects), plus client libraries for app metrics. Instrument apps directly rather than parsing logs for metrics.
- **Service discovery.** Kubernetes, Consul, EC2, DNS-based discovery — targets come from the environment, not static configs. Relabeling shapes discovered targets into useful label sets.
- **Retention and storage.** Local TSDB with retention by time/size; 15 days default is often too short — size for your investigation needs. Remote write (Thanos, Cortex/Mimir, VictoriaMetrics) for long-term storage and HA.
- **HA.** Paired Prometheus servers (each scraping everything) + remote write, or Thanos/Cortex for global query. Single Prometheus is a single point of failure for alerting — plan accordingly.
- **Cardinality.** The #1 operational risk: unbounded label values → memory explosion → OOM. Monitor `prometheus_tsdb_head_series`, set label limits, and review new metrics' cardinality before deploying.
- **Exemplars.** Link metrics to traces (trace IDs on histograms) — connecting the RED metrics to the slow traces in one click.

## Practical workflow

1. **Instrument RED metrics.** Every service exposes request rate, error rate, and duration histogram with bounded labels (route templates, not raw paths).
   ```python
   REQUESTS = Counter("http_requests_total", "Requests", ["method", "route", "status"])
   LATENCY = Histogram("http_request_duration_seconds", "Latency", ["method", "route"])
   ```
2. **Deploy exporters.** node_exporter on hosts, kube-state-metrics in clusters, blackbox for external probing; app metrics via client libraries on `/metrics`.
3. **Write recording rules.** Precompute SLIs and expensive aggregations; name them clearly (`job:metric:aggregation`).
   ```yaml
   groups:
   - name: slis
     interval: 1m
     rules:
     - record: job:http_requests:error_ratio
       expr: sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))
             / sum by (job) (rate(http_requests_total[5m]))
   ```
4. **Alert on symptoms.** Error-ratio, p99 latency, saturation alerts with `for:` and runbook annotations; severity tiers (page vs ticket).
   ```yaml
   - alert: HighErrorRate
     expr: job:http_requests:error_ratio > 0.05
     for: 5m
     labels: { severity: page }
     annotations: { runbook: https://wiki.example.com/runbooks/high-error-rate }
   ```
5. **Configure Alertmanager.** Grouping by alertname/cluster, routing by severity/team, inhibition for cascades, silences for maintenance — not for ignoring problems.
6. **Build dashboards from SLIs.** RED per service, USE per resource, recording-rule-backed panels; dashboards answer "is it broken and where" in under a minute.
7. **Manage cardinality.** Review label sets on new metrics; drop high-cardinality labels at scrape time via relabeling; alert on head-series growth.
8. **Plan retention and HA.** Size retention for investigation needs; remote-write to long-term storage; paired servers or Thanos for alerting HA.

## Common pitfalls

- **Unbounded label cardinality** — user IDs or request IDs as labels; OOM. Bound every label's value set.
- **Alerting on causes** — paging for CPU spikes instead of user-facing symptoms; alert on SLIs.
- **No `for:` duration** — flapping alerts on transient blips; require sustained breach.
- **Alerts without runbooks** — 3am pages with no guidance; every alert links a runbook.
- **`irate` in alerts** — spiky and misleading; `rate` over sensible windows.
- **Raw paths as labels** — `/users/123` exploding cardinality; use route templates.
- **Summary instead of histogram** — client-side quantiles can't aggregate; histograms with `histogram_quantile`.
- **Single Prometheus for alerting** — SPOF for pages; HA pair or remote-write + redundant alerting.
- **No recording rules at scale** — dashboards running expensive queries on every load; precompute.
- **Pushgateway as default** — for batch jobs only; services get scraped.
- **Ignoring silences hygiene** — permanent silences hiding real problems; expire and review them.
- **Retention too short** — 15 days when investigations need months; size deliberately with remote storage.
- **Scraping everything at 15s** — unnecessary load; tune intervals per target importance.
