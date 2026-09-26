---
name: vector-db-pro
description: Vector database guidance — embeddings, indexing (HNSW/IVF), hybrid search, metadata filtering, and production ops.
category: development
---

## Overview

Vector databases store embeddings and answer "what's most similar?" at scale — the retrieval backbone of RAG, semantic search, and recommendation. The core is approximate nearest neighbor (ANN) search: trading a little recall for orders-of-magnitude speed over brute force.

This skill covers choosing and operating vector stores: embedding strategy, index types (HNSW, IVF), hybrid search, metadata filtering, and the production concerns (updates, scaling, evaluation) that matter beyond the demo.

## When to use

- Choosing a vector database (Pinecone, Qdrant, Weaviate, pgvector, Milvus).
- Tuning ANN indexes (recall vs latency vs memory).
- Adding hybrid search (dense + keyword).
- Filtering by metadata alongside similarity.
- Operating vector DBs in production (updates, scaling, backups).
- Deciding pgvector vs a dedicated vector DB.

## Core concepts

- **Embeddings.** Dense vectors capturing semantic meaning; the embedding model defines the space — retrieval quality starts here. Match model to domain (general vs code vs multilingual); keep the embedding model fixed for an index (changing it requires reindexing everything).
- **Similarity metrics.** Cosine (normalized, angle-based — the default), dot product (magnitude-aware), Euclidean/L2 (distance). Normalize vectors for cosine; the metric must match what the embedding model was trained with.
- **ANN vs exact.** Exact search is O(n) — fine to ~100K vectors; ANN indexes (HNSW, IVF) give ~10-100x speedups at 95-99% recall. The recall/latency/memory triangle is the central tuning tradeoff.
- **HNSW.** Hierarchical Navigable Small World — graph-based, excellent recall/latency, higher memory. Parameters: `M` (connections), `ef_construction` (build quality), `ef_search` (query-time recall knob). The default choice for most workloads.
- **IVF.** Inverted file index — clusters vectors, searches nearest clusters; `nlist` (clusters), `nprobe` (clusters searched). Lower memory than HNSW, needs training on representative data; good for very large datasets.
- **Hybrid search.** Dense vectors (semantic) + BM25/keyword (exact terms) fused via RRF (reciprocal rank fusion) or weighted scores — each covers the other's blind spots (semantic misses exact product codes; keyword misses paraphrases). Usually beats pure dense.
- **Metadata filtering.** Pre-filter (filter then search — precise, can be slow on selective filters) vs post-filter (search then filter — fast, may return too few). Payload indexes on filtered fields; design filters into the schema from the start.
- **Chunking interplay.** The vector DB stores what you chunk — embedding quality is bounded by chunk quality. Store chunk text + metadata + source references; the DB is only as good as its inputs.
- **Updates and deletes.** Upserts by ID for changed documents; tombstones/lazy deletion in some engines; versioning strategy for re-embedded content. Stale vectors are a correctness issue — plan the update path.
- **Scaling.** Single-node (pgvector, embedded Qdrant — fine to millions), distributed (sharding, replication for 100M+). Most projects never outgrow single-node; don't pay distributed complexity early.
- **pgvector vs dedicated.** pgvector (Postgres extension) — zero new infra, transactions, joins with relational data; dedicated (Qdrant/Weaviate/Milvus/Pinecone) — better ANN tuning, filtering, scale. pgvector wins until ~few million vectors or advanced filtering needs.
- **Multitenancy.** Namespaces/collections per tenant — data isolation for SaaS; metadata tenant filters as the lighter alternative (with careful filter enforcement).
- **Evaluation.** Recall@k on labeled queries (does ANN find what exact search finds?), end-to-end RAG metrics — index tuning without measurement is superstition.
- **Backup and DR.** Snapshot the vectors AND the source documents + embedding model version — restoring vectors without knowing how they were made is useless.
- **Quantization.** Scalar/binary quantization in the index — 4-32x memory reduction with small recall cost; enables bigger datasets on fixed hardware.
- **Sparse vectors.** Learned sparse (SPLADE) or native sparse indexes — exact-term matching inside the vector DB; the alternative to separate keyword infrastructure.
- **Disk-based indexes.** DiskANN-style SSD indexes for billion-scale without full RAM residency — very large corpora on modest hardware.

## Practical workflow

1. **Choose the embedding model.** Domain-appropriate, fixed for the index lifetime; record model + version with the index metadata.
2. **Pick the store.** pgvector if you're on Postgres and under a few million vectors; dedicated when you need advanced ANN tuning, heavy filtering, or scale.
3. **Design the schema.** Text + metadata (source, date, tenant, access level) + IDs linking to source docs; payload indexes on filtered fields:
   ```python
   # Qdrant-style: payload indexes for the fields you filter on
   client.create_payload_index(collection, "tenant_id",
                               field_type="keyword")
   client.create_payload_index(collection, "doc_date",
                               field_type="datetime")
   ```
4. **Tune the ANN index.** Start with defaults; measure recall@k vs latency; adjust `ef_search` (HNSW) or `nprobe` (IVF) — the query-time knobs. Document the chosen tradeoff.
   ```python
   # recall@k: what fraction of exact-search neighbors does ANN find?
   exact = brute_force_search(query_vec, k=10)
   approx = index.search(query_vec, k=10, params={"ef": 64})
   recall = len(set(exact) & set(approx)) / 10
   ```

5. **Add hybrid search.** BM25 alongside dense with RRF fusion; A/B against pure dense on your queries — hybrid usually wins, verify on your data.
6. **Implement updates.** Upsert-by-ID pipelines tied to document changes; re-embed on model changes (full reindex); monitor for stale/missing vectors.
7. **Secure tenancy.** Namespace-per-tenant or enforced metadata filters; test filter bypass attempts — cross-tenant leakage is the catastrophic failure.
8. **Operate.** Backups (vectors + sources + model version), recall monitoring, capacity planning (quantization before sharding), runbooks for reindexing.

## Common pitfalls

- **Embedding model churn** — changing models without reindexing; mixed spaces silently degrade retrieval.
- **Wrong similarity metric** — unnormalized vectors with cosine; match metric to training.
- **ANN untuned** — default `ef_search` with poor recall; measure recall@k, tune query knobs.
- **No hybrid search** — pure dense missing exact terms (SKUs, names); RRF fusion.
- **Post-filter starvation** — selective filters returning too few results; pre-filter or overfetch.
- **Missing payload indexes** — filtering scanning everything; index filtered fields.
- **Stale vectors** — documents updated, embeddings not; upsert pipelines.
- **pgvector at 100M scale** — wrong tool past its sweet spot; dedicated DBs for large scale.
- **Distributed too early** — sharding complexity for 500K vectors; single-node first.
- **Cross-tenant leakage** — filter bugs exposing data; test isolation explicitly.
- **Backing up vectors only** — unrestorable without sources + model version; back up the recipe.
- **Chunking ignored** — blaming the DB for chunk-quality problems; fix ingestion first.
- **No recall evaluation** — tuning blind; labeled query sets for recall@k.
- **ef_search left at default** — poor recall unnoticed; tune the query-time knob and measure.
- **No quantization plan** — RAM exhaustion at scale; scalar/binary quantization before sharding.
