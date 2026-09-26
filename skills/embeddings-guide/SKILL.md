---
name: embeddings-guide
description: Work with text embeddings — choosing models, pooling, similarity measures, evaluation, and multilingual considerations. Use when building semantic search, clustering, or any similarity-based feature.
category: ai-research
---

# Embeddings Guide

Embeddings turn text into vectors where similarity means relatedness. They're the foundation of 
semantic search, RAG retrieval, clustering, and recommendations. The skill is choosing the right 
model, using it correctly, and evaluating on your data.

## Overview

An embedding model maps text to a dense vector; cosine similarity (usually) measures relatedness. 
Quality varies by domain, language, and text length — a model great at English Wikipedia may fail 
on your support tickets. Key choices: the model itself, how you handle long texts (chunk + pool), 
whether to use task-specific instructions (asymmetric search: query vs. document phrasing differs), 
and how you evaluate (on your data, not the leaderboard).

## When to use

- Semantic search or RAG retrieval over your corpus.
- Clustering, deduplication, or topic discovery on text.
- Recommendation: "similar items" features.
- Anywhere you need "find text like this text."

## Core concepts

- **Model selection**: size/quality/speed trade-offs; domain fit matters more than leaderboard 
rank. Evaluate candidates on your own query-document pairs.
- **Asymmetric vs. symmetric**: search queries differ from documents (short question vs. long 
passage). Instruction-tuned models handle this with task prefixes; test whether yours needs them.
- **Pooling long texts**: embed chunks and aggregate (mean, max) or retrieve at chunk level. Don't 
truncate long documents to the model's limit and hope.
- **Similarity measures**: cosine (standard, normalize vectors), dot product (with unnormalized, 
scale-sensitive), Euclidean (less common for text). Be consistent between indexing and querying.
- **Normalization**: L2-normalize vectors so cosine = dot product; many vector DBs assume this. 
Mismatched normalization silently breaks ranking.
- **Evaluation**: build a small set of query → known-relevant documents from your corpus. Measure 
recall@k per candidate model. This beats any public benchmark for your decision.

## Practical workflow

1. Collect 30–50 representative queries with known-relevant documents from your corpus.
2. Shortlist 3–4 embedding models (varying size); embed your corpus with each.
3. Measure recall@k and MRR on your eval set; also measure embedding latency and cost.
4. Decide chunking: chunk documents first, embed chunks, retrieve chunks — tune chunk size on the 
eval set.
5. Normalize consistently; verify the similarity metric matches between index and query time.
6. Monitor: sample production queries periodically; re-evaluate when the corpus or model changes.

```text
Embedding eval template:
QUERIES:  30-50 real queries + known-relevant docs
MODELS:   3-4 candidates (note dims, latency, cost)
METRICS:  recall@5, recall@20, MRR
DECIDE:   best quality within latency/cost budget
```

## Common pitfalls

- **Leaderboard shopping**: picking the top benchmark model without testing on your data. Domain 
mismatch is common.
- **Truncating long documents**: embedding only the first 512 tokens of a 10-page doc. Chunk 
properly.
- **Ignoring the query/document asymmetry**: same embedding approach for both when the model 
expects task prefixes. Read the model's docs.
- **Normalization mismatch**: indexing normalized, querying unnormalized (or vice versa). Ranking 
breaks silently.
- **No eval set**: "embeddings feel good." Build the query-relevance set; it's a day's work that 
pays forever.
- **Embedding everything at query time**: precompute document embeddings; embed only the query 
live. Obvious but often missed under deadline.
