---
name: haystack-agents
description: Build retrieval-grounded agents with Haystack — pipelines, components, and agent patterns for search-heavy workflows.
category: ai-research
---

## Overview

Haystack is a Python framework for building LLM applications around search and
retrieval, with agents as a natural extension: its pipeline model (directed graphs
of components) hosts retrievers, readers, generators, and tools, and its agent
implementations loop over tool-calling to solve tasks. If your agent's job is
"find information and synthesize it" — research assistants, support bots over
documentation, RAG with actions — Haystack gives you production-grade retrieval
components plus the agent loop in one framework.

The distinctive value is the retrieval depth: document stores, sparse+dense
hybrid retrieval, rerankers, and evaluation harnesses are first-class, not
afterthoughts. The agent patterns build on this — a ReAct-style agent whose tools
include serious search infrastructure, with tracing and pipeline visualization
for debugging.

Choose Haystack when retrieval quality is the product, not a checkbox. The
framework's center of gravity is search; the agents are searchers that learned to
act.

## When to use

- Agents whose core loop is retrieve → reason → retrieve → answer (research,
  support, analysis over corpora).
- RAG applications graduating to agentic behavior (the agent decides what to
  retrieve next).
- When retrieval quality is the bottleneck — Haystack's retriever/reranker
  ecosystem is the main reason to choose it.
- Prototyping search pipelines quickly with swappable components (swap BM25 for
  dense retrieval without rewriting).
- Teams wanting pipeline visualization and component-level evaluation out of the
  box.
- Multilingual or domain-specific search where retriever choice matters.

## Core concepts

- **Pipelines**: directed graphs of components with typed inputs/outputs. The
  pipeline is the application — design it on paper first, then wire components.
  Haystack validates connections at build time.
- **Components**: modular units (retrievers, generators, routers, converters).
  Each does one thing; the catalog is large — prefer battle-tested components over
  custom ones.
- **Document stores**: where indexed documents live (in-memory for prototyping,
  OpenSearch/Elasticsearch/pgvector for production). Indexing is a pipeline too —
  chunking and embedding choices made here bound retrieval quality forever.
- **Agent tools in Haystack**: tools wrap pipelines or components (a "search_docs"
  tool wraps a retrieval pipeline). The agent reasons over tool results like any
  ReAct loop; the tools happen to be excellent at search.
- **Chat generators**: the LLM components driving agents. Configure system
  prompts, tools, and streaming here. The agent loop lives or dies on the
  generator's tool-calling reliability.
- **Evaluation**: Haystack ships eval components and harnesses for RAG
  (faithfulness, relevance). Use them — retrieval agents fail silently when
  retrieval degrades, and evals are the smoke alarm.
- **Hybrid retrieval**: combining sparse (BM25) and dense (embeddings) retrieval
  with fusion. Usually beats either alone — tune the blend on your corpus.
- **Rerankers**: cross-encoder reranking over retrieved candidates. The standard
  second stage; measure its contribution and keep it if it earns its latency.

## Practical workflow

1. **Build the retrieval pipeline first.** Index your corpus, wire retriever
   (+reranker), test retrieval quality on sample queries before any agent exists.
   If retrieval is bad, the agent will be bad — no prompting fixes it.
2. **Measure retrieval.** Use a small labeled set (query → relevant docs). Track
   recall@k and reranker precision. Tune chunking, embeddings, and hybrid weights
   here.
3. **Tune chunking deliberately.** Chunk size, overlap, and boundaries (semantic
   vs. fixed) — evaluate against your labeled set. This is the highest-leverage
   indexing decision.
4. **Wrap retrieval as agent tools.** Expose focused tools: `search_docs(query)`,
   maybe `get_doc_detail(id)`. Keep tool outputs concise — full document dumps
   flood the agent's context.
5. **Configure the agent loop.** System prompt with the task framing, tool
   descriptions, max iterations, and a termination condition. Start with the
   simplest agent that uses your tools.
6. **Add evals for the full loop.** Beyond retrieval metrics: answer faithfulness
   (claims supported by retrieved docs?), task success rate, and tool-use
   efficiency (how many retrievals per answer).
7. **Harden for production.** Cache frequent queries, set timeouts on retrieval,
   bound tool output sizes, and log every retrieval the agent performs for audit.

Checklist for a Haystack agent:
- Retrieval quality measured on a labeled set before agent wiring.
- Chunking tuned against the eval set.
- Reranker in place if corpus is large or queries are hard.
- Tool outputs truncated/summarized for the agent's context.
- Faithfulness evals running on agent answers.
- Retrieval calls logged for debugging and audit.

## Common pitfalls

- **Agent before retrieval.** Bolting an agent onto untested retrieval produces
  fluent answers grounded in irrelevant documents. Retrieval quality first,
  always.
- **Dumping documents into context.** Returning 10 full documents per tool call
  drowns the agent. Retrieve-then-rerank-then-summarize; pass the agent focused
  evidence.
- **No reranker.** Dense retrieval alone misses on hard queries; a cross-encoder
  reranker on the top-k is the cheapest big win in retrieval pipelines.
- **Chunking as an afterthought.** Bad chunking (splitting mid-idea, chunks too
  small/large) caps everything downstream. Tune chunk size and overlap against
  your eval set.
- **Evaluating only end-to-end.** When the agent gives a bad answer, you need to
  know: was retrieval wrong, or reasoning wrong? Component-level evals separate
  the two.
- **Stale indexes.** The agent confidently answers from last quarter's documents.
  Build index freshness into operations — version indexes and monitor corpus
  drift.
- **Hybrid retrieval untuned.** Running BM25+dense with default fusion weights.
  The blend is corpus-specific — tune it.
- **Tool output bloat.** Letting tool schemas return everything "just in case."
  Every extra kilobyte per call multiplies across the agent's iterations.
