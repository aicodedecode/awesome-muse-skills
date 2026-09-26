---
name: performance-pro
description: Systematic performance engineering: measure, profile, optimize hotspots, and set budgets. Use when diagnosing slowness or making systems faster.
category: development
---

# Performance Pro

## Overview

Performance work is **measurement-driven**: profile first, optimize the hotspot, verify the gain —
never optimize from intuition. Most "slow code" is actually slow *architecture* (N+1 queries,
chatty APIs, missing indexes, serial execution of parallelizable work), and most micro-optimizations
are noise. This skill covers the systematic approach: defining targets, finding real bottlenecks,
fixing them at the right level, and preventing regression.

The through-line: measure → find the bottleneck → fix at the highest-leverage level → lock it in.

## When to use

- Diagnosing slow endpoints, pages, or batch jobs.
- Setting performance targets and budgets.
- Reviewing code for performance risks.
- Capacity planning or cost optimization.
- Preventing performance regressions in CI.

## Core concepts

- **Define the target first.** "Fast" is not a requirement — "p99 < 300ms at 1000 rps" is. Get
  the SLO/SLA in numbers before touching code; otherwise you can't know when you're done (or if
  the work was worth it).
- **Profile, don't guess.** CPU profilers (flame graphs), memory profilers, query analyzers
  (EXPLAIN), network waterfalls — the bottleneck is *never* where intuition says. Rule of thumb:
  the top frame of the flame graph is where the time goes; everything else is commentary.
- **Levels of optimization (highest leverage first).**
  1. *Algorithmic* — O(n²) → O(n log n); the 100x wins live here.
  2. *Architectural* — kill N+1s, batch APIs, add caching, parallelize independent work.
  3. *Data access* — indexes, query shapes, denormalization for read hotspots.
  4. *Resource* — connection pools, memory allocation, payload sizes.
  5. *Micro* — loop tweaks, branch prediction — only with profiler evidence, last.
- **Latency vs throughput.** Different goals, different fixes. Latency: reduce work per request,
  parallelize, cache. Throughput: batching, connection reuse, async pipelines, horizontal scale.
  Know which you're optimizing — they often trade off.
- **Caching as architecture.** What to cache (expensive, slowly-changing, frequently-read),
  where (CDN, app, DB query cache), invalidation strategy (TTL, event-driven, versioned keys),
  and the thundering-herd plan (stale-while-revalidate, request coalescing). Cache invalidation
  remains one of the two hard problems — design it, don't improvise it.
- **Budgets prevent regression.** Performance budgets (bundle size, p99 latency, query count per
  request) enforced in CI. Without budgets, every feature ships a little slower and nobody notices
  until users do.

## Practical workflow

1. **Quantify.** Reproduce the slowness with a benchmark; record baseline numbers (p50/p99, not
   averages — averages hide tails). Define the target.
2. **Profile the real workload.** Production-like data volume and concurrency — toy benchmarks
   lie. Flame graphs for CPU, EXPLAIN ANALYZE for queries, waterfall for frontend.
3. **Find the bottleneck.** The single biggest time consumer. Fix *it*, not the five small things
   around it. Amdahl's law: optimizing 5% of runtime 10x gains 4.5% — find the 80%.
4. **Fix at the highest level.** Algorithmic/architectural first: can this be O(n)? batched?
   cached? parallel? Only then descend to micro-optimization.
5. **Verify with numbers.** Same benchmark, before/after, statistical significance (run multiple
   times — noise is real). Document the gain in the commit.
6. **Lock it in.** Add the benchmark to CI with a budget; alert on regression. Performance without
   a ratchet decays.

Common fixes by symptom:

```text
Slow endpoint, DB-heavy flame graph → EXPLAIN the queries; N+1? missing index?
  → eager load / add index / denormalize read model
High tail latency (p99 >> p50)      → GC pauses? retry storms? downstream timeouts?
  → tune GC, add timeouts, cache the slow dependency
Slow page load                      → waterfall: what blocks first paint?
  → defer non-critical JS, preload critical assets, SSR the shell
Batch job too slow                  → profile: usually I/O-bound or single-threaded
  → parallelize chunks, batch DB writes, stream instead of load-all
Memory climbing                     → heap profile: what's retained?
  → fix caches without bounds/TTL, close resources, stream large payloads
```

## Common pitfalls

- **Optimizing without profiling.** "This loop looks slow" — meanwhile 95% of time is a missing
  DB index. Intuition about bottlenecks is reliably wrong; the profiler is reliably right.
- **Averages hiding tails.** "Average 100ms" with p99 at 5s — users feel the tail. Always look
  at percentiles.
- **Premature optimization.** Caching, pooling, and sharding before there's a measured problem —
  complexity without benefit. Make it work, make it right, *then* make it fast (with data).
- **Micro-optimizing the 5%.** Shaving cycles off a function that's 2% of runtime while ignoring
  the N+1 query that's 70%. Amdahl's law is undefeated.
- **Caching without invalidation design.** "Just cache it" → stale data bugs, thundering herds
  on expiry, unbounded memory. Cache deliberately or don't cache.
- **Benchmarking toys.** Optimizing against 10 rows when production has 10 million — different
  algorithms win at different scales. Benchmark at production shape.
- **No regression guard.** The optimization lands, then six months of features erode it. Budgets
  in CI or the win was temporary.
