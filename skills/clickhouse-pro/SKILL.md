---
name: clickhouse-pro
description: ClickHouse columnar analytics — schema design, MergeTree tuning, and fast queries — use for OLAP and high-volume event data.
category: database
---

## Overview

ClickHouse is a columnar OLAP database built for sub-second analytics over
billions of rows. Its speed comes from a storage layout (MergeTree family) and
query engine designed for scans and aggregations — which means schema and query
patterns differ sharply from row-oriented databases. This skill covers designing
for ClickHouse's strengths.

## When to use

- Designing tables (`MergeTree`, `ReplacingMergeTree`, `AggregatingMergeTree`)
- Choosing `ORDER BY` / partition keys for time-series or event data
- Writing aggregation queries (`GROUP BY`, `uniq`, `quantiles`, window functions)
- Tuning inserts (batches vs trickle), mutations, and background merges
- Operating clusters: replication, sharding, backups

## Core concepts

**ORDER BY is the primary index.** The `ORDER BY` key (sorting key) determines
data layout on disk and which queries skip granules. Put the most-filtered
columns first — typically `(tenant_id, event_time, ...)` — because ClickHouse
prunes using this key. Choose wrong and every query scans everything.

**Columnar means wide tables are cheap.** Unlike row stores, selecting 5 columns
from a 200-column table reads only those 5. Denormalize aggressively — joins
are supported but the engine rewards flat, pre-joined event tables.

**Inserts: batch, don't trickle.** Each insert creates a part; thousands of
tiny inserts create thousands of parts and merge storms. Batch to ~1k–100k rows
per insert (or use async inserts / a buffer table). Aim for parts in the
hundreds, not millions.

**Engines encode update semantics.** `ReplacingMergeTree` keeps the latest row
per key (deduplication at merge time — queries should still use `FINAL` or
`argMax` for exactness). `AggregatingMergeTree` stores partial aggregate states
for incremental rollups. `SummingMergeTree`/`CollapsingMergeTree` handle
specific accounting patterns. Pick the engine that matches how data changes.

**Approximation is a feature.** `uniq()`, `quantiles()`, and sampling (`TABLESAMPLE`,
`SAMPLE BY`) trade tiny accuracy losses for 10–100x speedups — perfect for
dashboards over billions of rows.

## Practical workflow

1. **Start from the queries:** list the filters and group-bys your dashboards
   need; these dictate the `ORDER BY` key and partitioning (usually by month on
   the timestamp).
2. **Define the table** with the right engine, `PARTITION BY toYYYYMM(ts)`,
   `ORDER BY (tenant_id, ts)`, and low-cardinality types (`LowCardinality(String)`,
   `DateTime`, appropriate integer widths) to cut storage.
3. **Load with batches:** buffer upstream, insert in chunks, monitor
   `system.parts` count per table — sustained growth signals an insert problem.
4. **Write queries that prune:** filter on the sorting key prefix, avoid
   `SELECT *`, use `PREWHERE` for highly selective filters on non-key columns,
   and prefer approximate functions for exploratory work.
5. **Handle mutations carefully:** `ALTER UPDATE/DELETE` are heavyweight
   background operations — fine occasionally, not a workload pattern. Design
   around append-mostly data.
6. **Operate:** replicate with `ReplicatedMergeTree` + ZooKeeper/ClickHouse
   Keeper, shard by a hash key for scale-out, back up with filesystem snapshots
   or `BACKUP TABLE`, and monitor merge/mutation queues.

## Common pitfalls

- **Row-by-row inserts** — the #1 ClickHouse anti-pattern; causes part
  explosion, merge backlog, and degraded queries. Batch always.
- **High-cardinality first in ORDER BY** (e.g. a UUID) — destroys compression
  and pruning; order by commonly filtered low/medium-cardinality columns first.
- **Using `FINAL` on huge tables routinely** — forces full merges at query
  time; use it sparingly or design deduplication into the pipeline.
- **Treating it like Postgres** — frequent small updates, heavy joins, and
  transactional expectations fight the architecture. ClickHouse is append-mostly
  analytics.
- **Ignoring data types:** `String` for everything wastes 5–10x storage vs
  `LowCardinality(String)` and right-sized numerics; storage is query speed in
  a columnar engine.
- **No TTL / retention policy** on ever-growing event tables — disk fills,
  merges slow, queries degrade. Set `TTL` or drop old partitions on a schedule.
