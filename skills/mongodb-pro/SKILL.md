---
name: mongodb-pro
description: MongoDB modeling, aggregation pipelines, and operations — use when designing schemas or tuning Mongo queries.
category: database
---

## Overview

MongoDB trades rigid schemas for flexible documents, which makes modeling choices
— embed vs reference — the central skill. This skill covers schema design,
aggregation pipelines, indexing, and the operational basics (replica sets,
transactions, backups).

## When to use

- Deciding whether to embed documents or reference across collections
- Writing aggregation pipelines (`$match`, `$group`, `$lookup`, `$unwind`)
- Creating compound, text, geospatial, or TTL indexes
- Debugging slow queries with `explain("executionStats")`
- Setting up replica sets, transactions, or change streams

## Core concepts

**Model for your queries, not your entities.** Embed data that is read together
and rarely changes independently (order → line items). Reference data that is
shared, large, or updated independently (order → customer). The 16MB document
limit and unbounded array growth are the guardrails — an ever-growing embedded
array is a schema smell.

**Aggregation pipelines are programs.** Stages execute in order; put `$match`
and `$project` early to shrink the working set before expensive stages like
`$group` or `$lookup`. `allowDiskUse` saves memory-heavy pipelines from failing,
at a speed cost.

**Indexes follow the ESR rule.** For a query with Equality, Sort, and Range
predicates, order compound index fields as Equality → Sort → Range. Prefix
compression and index intersection exist, but a purpose-built compound index
almost always wins.

**Replica sets are mandatory in spirit.** Even a single-node "replica set" is
required for transactions and change streams. Design for primary/secondary
topology: writes go to the primary; tune read preference (`secondaryPreferred`
for analytics) consciously, knowing secondaries can lag.

**Transactions exist — use sparingly.** Multi-document ACID transactions are
available but slower than single-document atomicity, which covers most embedded
designs. If you need transactions everywhere, your schema may be too normalized
for a document database.

## Practical workflow

1. **List your top 10 queries first**, with frequency and latency needs — the
   schema follows from these, not from the ER diagram.
2. **Prototype the pipeline in stages:** run each stage in `mongosh` or Compass
   and inspect intermediate output; check `.explain("executionStats")` for
   `COLLSCAN` (bad) vs `IXSCAN` (good).
3. **Index deliberately:** create compound indexes matching your hottest queries;
   use partial indexes (`partialFilterExpression`) for sparse patterns and TTL
   indexes for expiring data (sessions, logs).
4. **Guard writes:** use schema validation (`$jsonSchema`) to enforce the fields
   your code depends on, while leaving the rest flexible.
5. **Monitor:** `db.serverStatus()`, slow query logs, and Atlas-style metrics —
   watch for growing lock contention, page faults, and replication lag.
6. **Back up with mongodump or snapshots** on a schedule, and practice restores;
   for replica sets, back up from a secondary to avoid primary load.

## Common pitfalls

- **Unbounded arrays** (e.g. appending every event to a user document forever) —
  documents bloat, updates rewrite megabytes, and the 16MB cap eventually bites.
  Cap arrays (`$slice`) or move to a separate collection.
- **`$lookup` as a crutch for joins everywhere** — occasional lookups are fine;
  constant cross-collection joins suggest the data should be embedded or the
  workload belongs in a relational database.
- **No indexes on sort fields** — sorting 1M documents in memory fails or crawls;
  the sort field belongs in the compound index (ESR rule).
- **Treating `_id` as a string** when it's an ObjectId — type mismatches silently
  return zero results. Query with the correct type.
- **Write concern / read concern left at defaults** in systems that need
  durability guarantees — understand `w: "majority"` before promising "saved".
- **Storing large binaries in documents** — use GridFS or object storage with a
  reference; documents are for data, not file blobs.
