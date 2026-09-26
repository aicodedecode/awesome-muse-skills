---
name: elasticsearch-pro
description: Elasticsearch search and analytics — mappings, queries, and cluster health — use when building search or log analytics.
category: database
---

## Overview

Elasticsearch is a distributed search and analytics engine built on Lucene. Good
results come from three things: mappings designed before indexing, queries that
use the right clause for the job, and a cluster sized for the workload. This
skill covers all three plus operational hygiene.

## When to use

- Designing index mappings and analyzers for full-text search
- Writing `bool`, `match`, `term`, aggregation, and nested queries
- Debugging relevance ("why doesn't this document match?")
- Sizing shards, managing index lifecycle (ILM), and handling cluster health
- Ingesting logs/metrics and building Kibana-style dashboards

## Core concepts

**Mappings decide everything.** `text` fields are analyzed (tokenized, lowercased,
stemmed) for full-text search; `keyword` fields are exact-match for filtering,
sorting, and aggregations. Multi-fields (`"fields": {"keyword": {...}}`) give you
both. Dynamic mapping guesses types — often wrong (a date-like string becomes
`text`) — so define explicit mappings for production indices.

**Analyzers shape relevance.** The standard analyzer lowercases and tokenizes;
language analyzers stem ("running" → "run"). Custom analyzers (edge n-grams for
autocomplete, keyword + lowercase for exact-ish match) solve specific UX needs.
Use the `_analyze` API to see exactly how text is tokenized before debugging
relevance.

**Query DSL: filter vs must.** `filter` clauses are cached and don't affect
scoring — use them for yes/no constraints (status, tenant, date range). `must` /
`should` affect scoring for relevance-ranked parts. Mixing them correctly is the
difference between fast faceted search and slow scoring over everything.

**Shards are the scaling unit — and the overhead unit.** Too few shards limits
throughput; too many (hundreds of tiny shards) wastes heap and slows the
cluster. Aim for shards in the tens of GB, use ILM rollover to keep them sized
right, and avoid the default "one shard per tiny index" sprawl.

**Aggregations are analytics.** `terms`, `date_histogram`, `range`, and nested
aggs power faceted navigation and dashboards. They're computed across shards and
merged — `terms` on high-cardinality fields is approximate by design
(`shard_size` tunes accuracy).

## Practical workflow

1. **Define the search UX first:** what fields are searched, filtered, sorted,
   faceted? This drives the mapping (text vs keyword, which analyzers).
2. **Create the index with explicit mappings and settings** (shards, replicas,
   refresh interval); use index templates/aliases so mappings evolve without
   downtime (reindex into a new index, flip the alias).
3. **Test relevance deliberately:** build a small judgment set of queries →
   expected top results; iterate analyzers and boosts (`^2`) against it.
4. **Write queries filter-first:** `bool` with `filter` for constraints, `must`
   only for scored text; add `track_total_hits` consciously for deep pagination
   (or use `search_after` instead of large `from`).
5. **Manage lifecycle:** ILM policies (hot → warm → cold → delete) or
   data streams for time-series; monitor shard counts, heap usage, and GC.
6. **Operate:** keep replicas ≥ 1 in production, snapshot to durable storage on
   a schedule, watch cluster health (green/yellow/red) and unassigned shards.

## Common pitfalls

- **Relying on dynamic mapping in production** — one bad document sets the field
  type forever (until reindex). Explicit mappings or strict dynamic templates.
- **Scoring everything:** putting filters in `must` instead of `filter` —
  slower and noisier relevance. Filters don't score; use them.
- **Deep pagination with `from: 100000`** — each shard sorts and discards;
  use `search_after` with a tiebreaker sort for infinite scroll.
- **Oversharding:** thousands of 50MB shards crush the master and heap. Fewer,
  bigger shards; ILM rollover by size.
- **`refresh_interval` left at 1s for bulk loads** — heavy indexing with
  near-real-time refresh is slow; raise the interval (or -1) during bulk loads,
  restore after.
- **No snapshots** — a red cluster without snapshots is data loss waiting to
  happen. Snapshot early, snapshot often, test restores.
