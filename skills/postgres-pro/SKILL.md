---
name: postgres-pro
description: Deep PostgreSQL know-how — indexing, tuning, JSONB, and administration — use when working with or troubleshooting Postgres.
category: database
---

## Overview

PostgreSQL is a production workhorse: ACID-compliant, extensible, and generous with
features (JSONB, full-text search, arrays, PostGIS). This skill covers the
operational knowledge that separates a working Postgres setup from a reliable one:
choosing indexes, reading plans, tuning configuration, and safe administration.

## When to use

- Choosing between B-tree, GIN, GiST, BRIN, or hash indexes
- Investigating slow queries with `EXPLAIN (ANALYZE, BUFFERS)`
- Tuning `shared_buffers`, `work_mem`, `maintenance_work_mem`, autovacuum
- Designing schemas with JSONB, arrays, or full-text search
- Managing backups, replication, connections, and upgrades

## Core concepts

**Index types matter.** B-tree is the default and right for most lookups and range
queries. GIN powers JSONB containment (`@>`) and full-text search; GiST handles
geometric and range types; BRIN shines for very large, naturally ordered tables
(time-series). A GIN index on a JSONB column can turn a 10-second scan into a
10-millisecond lookup — but adds write overhead.

**MVCC and bloat.** Postgres never overwrites rows in place; updates create new
row versions and dead tuples are reclaimed by VACUUM. Long-running transactions
block cleanup and cause bloat. Monitor `pg_stat_user_tables` for tables where
`n_dead_tup` grows faster than autovacuum cleans.

**`EXPLAIN (ANALYZE, BUFFERS)` is ground truth.** It shows actual row counts,
timing per node, and buffer hits vs disk reads. Compare estimated vs actual rows:
a 100x misestimate usually means stale statistics (`ANALYZE`) or a bad plan forced
by them.

**Connection discipline.** Postgres uses a process per connection; thousands of
idle connections waste memory. Use a pooler (PgBouncer in transaction mode) in
front of the database and keep `max_connections` modest.

**JSONB done right.** Store flexible documents in `jsonb`, query with `->` / `->>`,
index hot paths with GIN or expression indexes. Don't use JSONB as an excuse to
skip schema design — frequently queried fields often deserve real columns.

## Practical workflow

1. **Diagnose with data:** `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)` on the slow
   query; find the node consuming most time.
2. **Check the usual suspects:** missing index (Seq Scan on a large filtered
   table), stale stats (`ANALYZE table_name`), bloat (`pgstattuple`), lock waits
   (`pg_stat_activity`).
3. **Create indexes deliberately:** one composite index on `(filtered_col,
   ordered_col)` often beats two single-column indexes; use `CONCURRENTLY` in
   production to avoid locking the table:
   ```sql
   CREATE INDEX CONCURRENTLY idx_orders_customer_date
     ON orders (customer_id, order_date DESC);
   ```
4. **Tune conservatively:** start with `shared_buffers` ≈ 25% of RAM,
   `effective_cache_size` ≈ 75% of RAM, `work_mem` small (4–64MB) — raise only
   with evidence of sorts spilling to disk (`EXPLAIN` shows "Disk:" sorts).
5. **Backups before changes:** verify `pg_dump`/`pg_basebackup` restores actually
   work — an untested backup is not a backup. Test restores on a schedule.
6. **Safe migrations:** add columns as nullable (or with defaults via metadata-only
   changes in modern versions), backfill in batches, then add `NOT NULL` with
   `VALIDATE CONSTRAINT` to avoid long locks.

## Common pitfalls

- **Killing autovacuum or disabling it** — leads to bloat, transaction-ID wraparound
  risk, and eventually downtime. Tune it, don't disable it.
- **Creating indexes without `CONCURRENTLY`** on live tables — takes an
  `ACCESS EXCLUSIVE` lock and blocks writes.
- **Wrapping indexed columns in functions** in `WHERE` (e.g.
  `WHERE lower(email) = ...`) — defeats the index unless you create an expression
  index on `lower(email)`.
- **`SELECT ... FOR UPDATE` without ordering** — invites deadlocks under
  concurrency; lock rows in a consistent order.
- **Timezone bugs:** `timestamp without time zone` silently shifts meaning.
  Prefer `timestamptz` and convert at the presentation layer.
- **Running out of connections** under load — add pooling before raising
  `max_connections`; each connection costs real memory.
