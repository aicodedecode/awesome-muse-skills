---
name: reranking
description: Rerank retrieval candidates with cross-encoder models — two-stage pipelines, model selection, latency trade-offs, and evaluation. Use when first-stage retrieval is broad but imprecise.
category: ai-research
---

# Reranking

First-stage retrieval is built for speed over a huge corpus; it's approximate by design. Reranking 
applies a slower, more precise model to the top candidates — a cross-encoder that reads the query 
and document together — and reorders them. It's the highest-ROI step in most retrieval pipelines.

## Overview

The two-stage pattern: retrieve broadly (top 50–200 from bi-encoder/hybrid search), then rerank 
to the top 5–10 with a cross-encoder. Cross-encoders score query-document pairs jointly — far 
more accurate than separate embeddings, far too slow for the full corpus. The trade is latency for 
precision; the art is sizing the candidate set and choosing the reranker for your quality/latency 
budget.

## When to use

- RAG pipelines where generation quality is limited by retrieval precision.
- Search where the top-3 results matter disproportionately.
- After hybrid retrieval: reranking the fused candidates.
- Anytime "the right doc is in the top 50 but not the top 5."

## Core concepts

- **Cross-encoders**: models that encode query+document jointly, outputting a relevance score. More 
accurate than bi-encoders because they see the interaction; slower because nothing is precomputed.
- **Two-stage design**: stage 1 optimizes recall (get the right docs into the candidate set); stage 
2 optimizes precision (order them correctly). Measure each stage separately.
- **Candidate set sizing**: more candidates → better recall ceiling, higher latency. Typically 
50–200; tune on your eval set's recall@N vs. latency curve.
- **Model selection**: reranker size/quality trade-offs; domain fit matters. Smaller rerankers 
often capture most of the gain at a fraction of the latency.
- **LLM rerankers**: prompting a language model to rank or score candidates — highest quality, 
highest cost/latency. Reserve for the final top-N or high-value queries.
- **Distillation option**: distilling a cross-encoder's rankings into a faster model when latency 
is critical.

## Practical workflow

1. Confirm the bottleneck: check that relevant docs appear in the top 50–200 but not the top 5. 
If they're absent entirely, fix stage 1 first.
2. Build the eval set: queries with graded relevance (not just binary) for the candidate pool.
3. Baseline the reranker candidates on nDCG@k and MRR; measure added latency per query.
4. Tune candidate set size: the smallest N that preserves recall of relevant docs.
5. Deploy with fallback: if the reranker fails or times out, serve stage-1 ranking — degraded, 
not broken.
6. Monitor: track rerank lift in production via sampled human judgments; re-tune as the corpus 
shifts.

```text
Two-stage metrics:
STAGE 1: recall@100 — are relevant docs in the candidate set?
STAGE 2: nDCG@5, MRR — are they ranked at the top?
SYSTEM:  end-to-end latency p95, rerank lift over stage-1 alone
```

## Common pitfalls

- **Reranking a broken stage 1**: the reranker can't find docs that were never retrieved. Fix 
recall first.
- **Oversized candidate sets**: reranking 1000 candidates for marginal recall gains at huge latency 
cost. Tune the size.
- **No latency budget**: a beautiful reranker that blows the p95. Measure end-to-end, not just 
quality.
- **Binary relevance evals**: graded relevance (highly relevant vs. somewhat) measures ranking 
quality far better.
- **No fallback**: reranker outage taking down search. Degrade to stage-1 gracefully.
- **Set and forget**: corpus drift erodes both stages. Re-evaluate the pipeline periodically.
