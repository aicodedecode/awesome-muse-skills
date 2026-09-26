---
name: elasticsearch-pro-dev
description: Elasticsearch guidance — index design, mappings, query DSL, aggregations, cluster operations, and performance tuning.
category: development
---

## Overview

Elasticsearch is a distributed search and analytics engine: JSON documents indexed into shards, queried with a rich DSL, aggregated at speed. It powers full-text search, log analytics, and metrics — workloads where relational databases struggle. It's also a distributed system with real operational demands and a query language that rewards precision.

The two disciplines are index design (mappings, analyzers, sharding) and query design (relevance, filters, aggregations). Get the mapping wrong and you're reindexing; get the cluster wrong and you're firefighting. This skill covers both, plus production operations.

## When to use

- Adding full-text search to an application.
- Designing indexes, mappings, and analyzers.
- Writing relevance-tuned queries and aggregations.
- Choosing between Elasticsearch, OpenSearch, Postgres FTS, or Algolia/Typesense.
- Operating clusters (sharding, replicas, upgrades, snapshots).
- Debugging slow queries, shard problems, or mapping explosions.
- Building log/metrics analytics on the Elastic stack.

## Core concepts

- **Indexes, shards, replicas.** An index splits into primary shards (parallelism unit) distributed across nodes; replicas copy shards for HA and read scale. Shard count is set at creation — oversharding wastes resources, undersharding caps throughput. Size shards ~10-50GB.
- **Mappings.** Field types (text vs keyword vs numeric vs date) determine what's searchable and how. `text` for full-text search (analyzed), `keyword` for sorting/aggregations/exact match. Multi-fields (`text` + `keyword` sub-field) give both.
- **Dynamic mapping dangers.** Auto-detected mappings guess types — sometimes wrong (dates as text, numbers as strings). A new field per document (mapping explosion) can destabilize the cluster. Prefer explicit mappings with `dynamic: strict` or `runtime` for unknowns.
- **Analyzers.** Character filters → tokenizer → token filters turn text into searchable tokens. Language analyzers (stemming, stop words) dramatically affect relevance; custom analyzers for special content (part numbers, code).
- **Query DSL: queries vs filters.** `must`/`should` affect relevance scoring; `filter` clauses are yes/no (cacheable, faster). Structure searches as: filters for constraints, queries for relevance-ranked text.
- **Relevance tuning.** `bool` combinations, `multi_match` types (best_fields, most_fields, cross_fields), boosting, function_score for business rules (recency, popularity). Tune with real queries and judgments, not guesses.
- **Aggregations.** Bucket (terms, date_histogram, ranges) and metric (avg, percentiles, cardinality) aggs for analytics. They're powerful and expensive — scope them with filters, limit bucket counts, and watch memory.
- **Pagination.** `from`/`size` for shallow pages; `search_after` (with a tiebreaker sort) for deep pagination; Scroll API for bulk export. Deep `from` is expensive — it re-executes across shards.
- **Index lifecycle (ILM).** Hot → warm → cold → delete policies automate rollover, shrink, and deletion — essential for time-series data (logs, metrics). Rollover by size/age, not by calendar alone.
- **Reindexing.** Mappings can't change in place (mostly) — reindex into a new index, then alias-swap. Aliases decouple index names from the physical index; always point reads at aliases.
- **Snapshots.** S3/GCS repository snapshots for backup and recovery — the only supported backup. Test restores; snapshot before upgrades.
- **Cluster health.** Green/yellow/red refer to shard allocation, not performance. Yellow (missing replicas) is degraded; red (missing primaries) is data-loss territory. Monitor pending tasks and relocation storms too.
- **Circuit breakers and memory.** Fielddata and large aggregations can OOM nodes; circuit breakers protect the cluster but trip on legitimate heavy queries — size heaps (≤50% RAM, ≤~30GB) and keep aggregations bounded.
- **Security.** TLS, authentication, role-based index privileges, API keys per application. Never expose Elasticsearch directly to the internet — it's a ransomware magnet.

## Practical workflow

1. **Design the mapping first.** Explicit types per field; `text` + `keyword` multi-fields where both search and sort/agg are needed; `dynamic: strict` to catch surprises.
   ```json
   { "mappings": { "dynamic": "strict",
     "properties": {
       "title": { "type": "text", "fields": { "keyword": { "type": "keyword" } } },
       "status": { "type": "keyword" },
       "price": { "type": "scaled_float", "scaling_factor": 100 },
       "created_at": { "type": "date" }
     } } }
   ```
2. **Choose analyzers deliberately.** Default is fine for English prose; language analyzers per language field; custom analyzers for SKUs/codes (keyword tokenizer + lowercase).
3. **Index through aliases.** Write to `products-write`, read from `products-read`; reindex-and-swap for mapping changes with zero downtime.
4. **Structure queries: filters + relevance.** Filters for constraints (status, category, price range), `multi_match` for the text, boosts for business priority.
   ```json
   { "query": { "bool": {
     "must": { "multi_match": { "query": "wireless headphones", "fields": ["title^3", "description"] } },
     "filter": [ { "term": { "status": "active" } }, { "range": { "price": { "lte": 200 } } } ]
   } } }
   ```
5. **Paginate with `search_after`.** Sort by `_score` + `_id` tiebreaker (or timestamp + id); pass the last hit's sort values. Reserve `from/size` for shallow admin pages.
6. **Aggregate carefully.** Filter before aggregating; cap `terms` size; use `composite` aggs for paginating through buckets; watch the fielddata circuit breaker.
7. **Manage lifecycle with ILM.** Rollover hot indices by size/age; move to warm (fewer replicas, force-merge), then delete. Automate from day one for time-series data.
8. **Operate.** Snapshot to object storage on a schedule; monitor shard balance, JVM heap, GC, indexing rate, and query latency; upgrade rolling with compatibility checks.

   ```json
   PUT _index_template/logs-template
   { "index_patterns": ["logs-*"],
     "template": { "settings": { "number_of_shards": 3 },
       "mappings": { "dynamic": "strict", "properties": {
         "@timestamp": { "type": "date" }, "level": { "type": "keyword" } } } } }
   ```

## Common pitfalls

- **Dynamic mapping explosions** — a field per document variant destabilizing the cluster; explicit mappings with strict dynamic.
- **Wrong field types** — `text` where `keyword` was needed for sorting/aggs (or vice versa); multi-fields from the start.
- **Deep `from/size` pagination** — expensive shard fan-out; use `search_after`.
- **Unbounded aggregations** — millions of buckets OOMing nodes; filter first, cap sizes, use composite.
- **Oversharding** — hundreds of tiny shards wasting heap and slowing everything; aim for 10-50GB per shard.
- **Changing mappings in place** — impossible for most changes; reindex + alias swap is the path.
- **No snapshots** — no supported backup; snapshot on a schedule and test restores.
- **Exposed to the internet** — unauthenticated clusters get ransomed; TLS + auth + network policy.
- **Ignoring ILM** — time-series indices growing forever; automate rollover and deletion.
- **Relevance guessed, not measured** — boosting without judgment lists; test with real queries.
- **Heap misconfiguration** — over 50% RAM or over ~30GB causing GC pain; follow the sizing rules.
- **Yellow cluster ignored** — missing replicas treated as fine until a node dies; yellow is degraded, fix it.
