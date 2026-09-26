---
name: vector-databases
description: Choose and operate vector databases — indexing algorithms, filtering, scaling, and production concerns. Use when storing and querying embeddings at scale.
category: ai-research
---

# Vector Databases

A vector database stores embeddings and finds nearest neighbors fast at scale. The decisions: which 
index algorithm, how to filter, how to scale, and how to keep results good as data grows.

## Overview

Core operation: given a query vector, return the k most similar stored vectors — approximately 
(ANN) for speed at scale. HNSW graphs dominate for the quality/speed balance; IVF partitions for 
huge datasets. On top: metadata filtering (so "similar" also means "in the right category/date"), 
hybrid search hooks, and operational concerns — indexing throughput, recall tuning, and 
multi-tenancy.

## When to use

- RAG retrieval over large document collections.
- Semantic search features in products.
- Recommendation or deduplication at scale.
- Anytime brute-force similarity search gets too slow.

## Core concepts

- **ANN indices**: HNSW (graph-based, excellent recall/latency, memory-hungry), IVF (partitioned, 
scales to billions, needs tuning), and others. HNSW is the default; IVF for the largest scales.
- **Recall vs. speed**: ANN parameters trade accuracy for speed (HNSW's ef_search, IVF's nprobe). 
Tune on your data: measure recall@k against brute force on a sample.
- **Metadata filtering**: pre-filter (filter then search — precise, can be slow), post-filter 
(search then filter — fast, may return too few), or index-aware hybrid. Your filter selectivity 
decides.
- **Namespaces/tenancy**: partition by tenant, project, or corpus — for isolation, deletion, and 
per-tenant tuning. Design tenancy before data grows.
- **Distance metrics**: cosine, dot product, Euclidean — must match how embeddings were produced. 
Set once, consistently.
- **Freshness**: upserts, deletes, and index rebuilds. Know your system's update latency and 
whether deletes are real or tombstoned.

## Practical workflow

1. Define the workload: corpus size, query rate, filter patterns, latency budget, recall target.
2. Choose the index: HNSW for most; IVF-family for 100M+ scale. Start managed unless you have ops 
capacity.
3. Set the distance metric to match your embeddings; normalize consistently.
4. Design metadata schema and tenancy up front — retrofitting partitions is painful.
5. Tune ANN parameters on your data: sweep ef_search/nprobe, plot recall vs. latency, pick the knee.
6. Load-test with production-like queries and filters; monitor recall drift as the corpus grows.

```text
Selection checklist:
[ ] Corpus size now + 12-month projection
[ ] p95 latency budget defined
[ ] Recall@k target (measured vs brute force)
[ ] Filter patterns identified (selectivity known)
[ ] Tenancy/isolation requirements set
[ ] Update/delete latency acceptable
```

## Common pitfalls

- **Untuned ANN params**: default ef_search giving 80% recall when you need 95%. Tune on your data.
- **Metric mismatch**: cosine index with dot-product-trained embeddings. Consistent end-to-end or 
broken ranking.
- **Post-filter starvation**: heavy filtering after ANN search returns fewer than k results. Use 
pre-filtering for selective filters.
- **No tenancy plan**: one flat index for all customers, then a deletion/isolation requirement 
arrives. Partition early.
- **Ignoring write path**: great search, terrible ingestion — or deletes that don't delete. Test 
the full lifecycle.
- **Recall measured once**: index quality degrades as data distribution shifts. Re-measure 
periodically.
