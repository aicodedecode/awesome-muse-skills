---
name: app-performance-monitoring
description: Application performance monitoring — transactions, profiling, and finding slow code — works with any APM platform.
category: sentry
---

## Overview

APM answers "why is this slow?" with data: which transactions are slow,
which spans dominate, which database queries drag, and how performance
trends across releases. This skill covers instrumenting applications for
performance visibility and using that data to find and fix real bottlenecks —
independent of any specific APM vendor.

## When to use

- Finding why an endpoint or page load is slow
- Setting up transaction tracing and span instrumentation
- Identifying N+1 queries, slow serialization, or chatty service calls
- Tracking performance across releases (did v2.1 get slower?)
- Deciding what to instrument with custom spans vs automatic

## Core concepts

**Transactions and spans.** A transaction = one unit of work (an HTTP
request, a background job, a page load). Spans = its decomposed steps
(DB query, cache call, external API, template render). Automatic
instrumentation covers frameworks and drivers; custom spans mark your
business logic ("compute recommendations"). The trace waterfall shows
exactly where time goes — optimize the longest bars first.

**Measure percentiles, not averages.** Averages hide the pain: p50 tells
you the typical experience, p95/p99 the bad one users actually complain
about. Track latency as a distribution; alert on p99, optimize the spans
that dominate p99 traces.

**Apdex / satisfaction framing.** Translate latency into user experience:
what fraction of requests are "satisfying" (< T), "tolerable", "frustrating"?
It focuses optimization on what users feel and gives non-engineers an
intuitive number.

**Sampling strategy.** Tracing every request at high traffic is expensive
(overhead + ingest cost). Sample: 100% of errors and slow outliers,
a percentage of normal traffic (enough for representative p99s), and
dynamic sampling that keeps interesting traces. Head-based sampling is
simple; tail-based keeps the important ones — know which you have.

**Correlate with releases.** Every deploy should mark the timeline; a p99
jump starting exactly at release X is a diagnosis, not a mystery. Tag
transactions with release version and compare distributions across
releases, not just point values.

## Practical workflow

1. **Instrument:** install the APM SDK/tracer, enable auto-instrumentation
   for your framework/DB/cache/HTTP clients, and add custom spans around
   key business operations.
2. **Establish baselines:** per-endpoint p50/p95/p99, throughput, and error
   rate over a representative week — you can't detect regressions without
   "normal".
3. **Find the bottleneck:** sort transactions by total time impact
   (latency × volume — a slightly slow hot endpoint beats a very slow rare
   one), open representative slow traces, and read the waterfall.
4. **Fix the usual suspects:** N+1 queries (batch/eager-load), missing
   indexes, over-fetching (select only needed fields), synchronous calls
   that could parallelize, uncached repeated computation, slow
   serialization of huge payloads.
5. **Verify with data:** compare p99 before/after the fix on comparable
   traffic; watch for regressions in the release comparison view.
6. **Guard with alerts/SLOs:** latency SLOs per critical endpoint with
   burn-rate alerting; performance budgets in CI for key pages/endpoints
   to catch regressions before deploy.

## Common pitfalls

- **Optimizing the average** — p50 looks fine while p99 users suffer;
  always work from the tail.
- **No custom spans** — auto-instrumentation shows "DB: 800ms" but not
  which business operation caused 40 queries; span your domain logic.
- **Tracing 100% of traffic** — overhead and cost explode; sample
  deliberately.
- **One slow trace = the truth** — outliers mislead; aggregate across
  many traces before concluding.
- **Ignoring the frontend** — backend p99 is great but users wait on
  4MB of JavaScript; measure real user experience (RUM) alongside.
- **Performance work without baselines** — "we made it faster" with no
  before/after numbers; measure first, then optimize, then verify.
