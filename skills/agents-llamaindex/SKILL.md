---
name: agents-llamaindex
description: Build data-centric LLM applications with indexing and retrieval frameworks — document ingestion, indices, query engines, and RAG pipelines. Use when the core problem is getting the right data in front of the model.
category: ai-research
---

# Data-Centric LLM Applications (Indexing and Retrieval)

When the hard part is data, not dialogue, you need an indexing mindset: ingest documents from many 
sources, structure them into queryable indices, and retrieve precisely what each query needs. This 
skill covers that data layer.

## Overview

The pipeline is ingest → index → retrieve → synthesize. Ingestion handles the messy reality 
of documents: PDFs, web pages, databases, APIs, each parsed into clean text with metadata. Indexing 
organizes that text — vector indices for semantic search, keyword indices for exact match, 
structured indices for tables, summaries for long documents. Query engines combine retrieval 
strategies and synthesize answers, citing sources. Done well, the model answers from your data 
instead of its memory.

## When to use

- Question-answering over a document collection: manuals, papers, wikis, tickets.
- Building RAG where retrieval quality is the bottleneck.
- Ingesting heterogeneous sources that need parsing, cleaning, and metadata.
- Agentic workflows where the agent needs structured access to documents, not just chat.

## Core concepts

- **Document ingestion**: connectors and parsers that turn raw sources into uniform document 
objects with metadata (source, date, type). Garbage in, garbage out — invest here.
- **Node parsing**: splitting documents into chunks (nodes) with overlap, preserving metadata and 
relationships (parent/child, prev/next). Chunking strategy determines retrieval quality.
- **Index types**: vector stores for semantic similarity; keyword indices for exact terms; summary 
indices for "give me the gist"; knowledge-graph indices for entity relationships. Combine them.
- **Retrievers**: the query-time component — top-k selection, metadata filtering, reranking. This 
is where most RAG quality is won or lost.
- **Query engines**: orchestrate retrieval + synthesis — retrieve nodes, stuff or refine through 
the model, return an answer with citations.
- **Response synthesis modes**: stuff (all context at once), refine (iteratively improve), compact 
(summarize-then-answer). Choose by context size and quality needs.

## Practical workflow

1. Inventory your sources and their formats; build ingestion that preserves metadata (source, date, 
section).
2. Prototype chunking on a sample: inspect actual chunks — are tables, lists, and headings 
intact? Adjust size and overlap.
3. Build a hybrid index (vector + keyword) and test retrieval on 20 real questions before adding 
generation.
4. Add metadata filters (date ranges, document types) so queries can scope retrieval.
5. Choose a synthesis mode; require citations to source nodes in every answer.
6. Evaluate retrieval and generation separately: bad answers are usually bad retrieval in disguise.

```text
Debugging RAG quality:
1. For a failing query, inspect retrieved nodes first.
   - Wrong nodes? → fix chunking, embeddings, or filters.
   - Right nodes, wrong answer? → fix synthesis prompt or context budget.
2. Track: retrieval hit-rate @k, answer faithfulness, citation coverage.
```

## Common pitfalls

- **Skipping retrieval evaluation**: tuning generation while retrieval returns junk. Measure 
retrieval first.
- **One-size chunking**: fixed 512-token chunks for everything. Tables, code, and prose need 
different strategies.
- **Metadata neglect**: ingesting text without source/date/type. You lose filtering, freshness, and 
citation ability.
- **No citations**: answers without sources are unverifiable. Require node citations in the 
response contract.
- **Index staleness**: documents change; the index doesn't. Plan refresh and invalidation from the 
start.
- **Over-retrieval**: stuffing 50 chunks "to be safe." More context dilutes attention — retrieve 
precisely, rerank, then synthesize.
