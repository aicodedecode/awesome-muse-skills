---
name: rag-engineer
description: Engineer retrieval-augmented generation systems — chunking, embeddings, hybrid retrieval, reranking, and grounded generation with citations. Use when building or fixing RAG pipelines.
category: ai-research
---

# RAG Engineer

Retrieval-augmented generation grounds model answers in your data: retrieve relevant passages, then 
generate an answer from them. Simple in concept, devilish in the details — most RAG failures are 
retrieval failures wearing a generation costume.

## Overview

The pipeline: ingest documents, chunk them, embed chunks, store in an index, retrieve top 
candidates per query, optionally rerank, then generate with the passages as context and citations. 
Each stage has its own failure modes and metrics. The engineer's discipline is measuring each stage 
independently — retrieval hit-rate before answer quality — and iterating on the bottleneck.

## When to use

- Q&A over proprietary documents: docs, wikis, tickets, contracts, papers.
- Reducing hallucinations by grounding answers in retrieved sources.
- Debugging an existing RAG system that's returning wrong or vague answers.
- Choosing chunking, embedding, and retrieval strategies for a new corpus.

## Core concepts

- **Chunking**: splitting documents into retrievable units. Size, overlap, and boundary-awareness 
(don't split tables mid-row). The highest-leverage decision in the pipeline.
- **Embeddings**: dense vector representations for semantic similarity. Match the embedding model 
to your domain and language; test a few on your data.
- **Hybrid retrieval**: dense (semantic) + sparse (keyword/BM25) combined. Dense finds paraphrases; 
sparse finds exact terms, codes, and names. Together they beat either alone.
- **Reranking**: a second, more expensive model re-scores top candidates for precision. Retrieve 
broadly (top-50), rerank to top-5, generate from those.
- **Query transformation**: rewriting or expanding the user query — hypothetical answers, 
multi-query, step-back questions — to improve retrieval recall.
- **Grounded generation**: the answer cites its sources, says "I don't know" when retrieval finds 
nothing, and doesn't invent beyond the passages.

## Practical workflow

1. Build the eval set first: 30–50 real questions with known-good answers and source passages.
2. Ingest and chunk a sample; eyeball the chunks — broken tables and split sentences are visible 
immediately.
3. Measure retrieval alone: hit-rate@k for the gold passages. Tune chunking and hybrid weights 
until retrieval is solid.
4. Add reranking; measure the precision gain vs. latency cost.
5. Wire generation with a strict grounding prompt: cite sources, abstain when evidence is missing.
6. Evaluate end-to-end: faithfulness (is every claim supported?), citation coverage, and abstention 
behavior on unanswerable questions.

```text
RAG metrics per stage:
RETRIEVAL:   hit-rate@5, hit-rate@20, MRR on gold passages
RERANK:      precision@5 lift, added latency
GENERATION:  faithfulness (% claims supported), citation coverage,
             correct abstention rate on unanswerables
```

## Common pitfalls

- **Tuning generation first**: rewriting the synthesis prompt while retrieval returns junk. Fix 
retrieval; it's usually the bottleneck.
- **Fixed chunking for everything**: one chunk size for prose, tables, and code. Adapt to content 
structure.
- **Dense-only retrieval**: missing exact matches on names, IDs, and codes. Add sparse retrieval.
- **No abstention**: the system answers confidently from irrelevant passages. Teach it to say "not 
in the documents."
- **Stale index**: documents updated, index not. Plan refresh, versioning, and deletion from day 
one.
- **Eval-free iteration**: "it feels better now." The eval set is the only honest judge — build 
it before tuning.
