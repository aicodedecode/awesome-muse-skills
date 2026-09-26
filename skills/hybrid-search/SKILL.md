---
name: hybrid-search
description: Combine dense and sparse retrieval — BM25 + vectors, fusion algorithms, weighting, and tuning. Use when neither keyword nor semantic search alone is good enough.
category: ai-research
---

# Hybrid Search

Dense (semantic) retrieval finds paraphrases but misses exact terms; sparse (keyword/BM25) finds 
exact terms but misses meaning. Hybrid search runs both and fuses the results — consistently 
beating either alone on real-world corpora.

## Overview

The pipeline: query goes to both a vector index (dense) and a keyword index (BM25), each returns 
ranked candidates, a fusion algorithm merges them into one ranking, and optionally a reranker 
refines the top. The tuning: how to normalize scores across systems, the fusion method, and the 
dense/sparse weight. Corpora with names, codes, IDs, and jargon benefit most — which is nearly 
every real corpus.

## When to use

- RAG or search over corpora with exact terms that matter: product codes, names, error messages, 
legal citations.
- Queries mixing natural language with specific keywords.
- Improving retrieval when dense-only misses obvious exact matches.
- Multilingual or domain-jargon corpora where embeddings underperform on terminology.

## Core concepts

- **Dense retrieval**: embedding similarity — great for "meaning like this," weak on rare exact 
terms and out-of-vocabulary items.
- **Sparse retrieval (BM25)**: term-frequency scoring with saturation and length normalization — 
great for exact matches, blind to paraphrase. Still undefeated for keyword-heavy queries.
- **Fusion**: Reciprocal Rank Fusion (RRF — simple, robust, no score normalization needed), 
weighted score combination (needs normalization), or interleaving. RRF is the default for good 
reasons.
- **Weighting**: the dense/sparse balance. Tune on your eval set — keyword-heavy corpora lean 
sparse; conceptual corpora lean dense.
- **Score normalization**: dense and sparse scores live on different scales. Normalize (min-max, 
z-score) before weighted fusion, or use rank-based RRF to sidestep it.
- **Query analysis**: route or weight by query type — a query with a quoted error code wants 
sparse; a conceptual question wants dense. Even simple heuristics help.

## Practical workflow

1. Build the eval set: queries with known-relevant docs, including keyword-heavy and conceptual 
queries separately.
2. Baseline dense-only and sparse-only; confirm each wins on its natural query type.
3. Implement RRF fusion first — it's robust and parameter-light. Measure the lift.
4. Tune weights with normalized score fusion if RRF leaves gains on the table; validate the weights 
don't overfit.
5. Add query-type heuristics if the eval shows clear regimes (e.g., boost sparse when the query 
contains codes/IDs).
6. Re-tune when the corpus changes significantly — the optimal balance shifts with content.

```text
Hybrid pipeline:
query → [dense retriever → ranked D] + [BM25 → ranked S]
      → RRF(D, S) → merged ranking
      → (optional) rerank top-N → final top-k
Tune: fusion method, weights, per-query-type adjustments
```

## Common pitfalls

- **Dense-only by default**: missing exact matches on IDs, names, and codes that BM25 would nail. 
Always test the hybrid.
- **Unnormalized score fusion**: adding raw cosine scores to raw BM25 scores — meaningless 
arithmetic. Normalize or use RRF.
- **One weight for all queries**: a single dense/sparse ratio when query types clearly differ. 
Analyze by query type.
- **No per-type eval**: reporting average lift while one query type regresses. Break down metrics 
by query category.
- **Skipping the sparse baseline**: assuming dense is strictly better. On many real corpora BM25 
alone is embarrassingly strong.
- **Fusion without reranking**: merged candidates are good; a reranker on the top-N is usually 
better still. Budget for it.
