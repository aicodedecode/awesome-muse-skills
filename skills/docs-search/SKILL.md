---
name: docs-search
description: Search documentation effectively for agents: index docs, query precisely, and cite sources. Use when agents need accurate answers from documentation rather than guesses.
category: ai-maestro
---

# Docs Search

## Overview

Agents hallucinate when they guess; docs search grounds them in written sources. The pattern: indexed documentation, precise queries, cited answers.

Effective docs search for agents means: curated doc sets, chunked and indexed content, query expansion, and answers that cite their sources.

Goal: every factual claim traceable to a doc passage — no confident inventions.

## When to use

- Agent answering questions from documentation
- Building a knowledge base agents can query
- Reducing hallucinations in agent responses
- Onboarding agents to a codebase or product
- Keeping agent answers current with doc updates

## Core concepts

- **Curated doc sets.**
  Index the right docs: official, current, complete. Garbage in, garbage out — curation beats index size.
- **Chunking.**
  Split docs into retrievable passages (sections, not whole pages). Good chunks: self-contained, titled, with context.
- **Query expansion.**
  Expand user questions into 2-3 search phrasings, including synonyms and related terms. One phrasing misses; several hit.
- **Hybrid retrieval.**
  Keyword (BM25) + semantic (embeddings) together. Keywords catch exact terms; semantics catch paraphrases. Hybrid beats either alone.
- **Reranking.**
  Rerank top candidates with a stronger model/scorer before answering. Retrieval gets candidates; reranking picks winners.
- **Cited answers.**
  Every claim linked to its source passage. Citations let humans verify and agents stay honest.
- **Freshness.**
  Docs change; indexes must follow. Re-index on doc updates; flag answers sourced from outdated passages.
- **Fallback honesty.**
  No good source found? Say so. 'Not in the docs' beats a fabricated answer every time.

## Practical workflow

1. **Curate the corpus.**
   Select authoritative, current docs. Exclude drafts, duplicates, and deprecated versions. Document what's indexed.
2. **Chunk and index.**
   Section-level chunks with titles and metadata (source, version, date). Build keyword + semantic indexes.
3. **Expand queries.**
   For each question: 2-3 phrasings with synonyms. Search all; merge and dedupe results.
4. **Retrieve and rerank.**
   Hybrid retrieval for candidates, rerank top 20 -> top 5. Quality over quantity in the answer context.
5. **Answer with citations.**
   Compose from retrieved passages only; cite each claim to its passage. No source = no claim.
6. **Handle gaps honestly.**
   Weak or no sources: say what's missing, suggest where to look. Never fill gaps with invention.
7. **Maintain freshness.**
   Re-index on doc changes; version the index; surface source dates in answers.
8. **Evaluate regularly.**
   Test questions with known answers; measure retrieval hit rate and answer accuracy. Improve chunking/queries from failures.

## Common pitfalls

- **Uncurated indexes.**
  Indexing everything including drafts and deprecated docs. Stale/wrong sources produce confident wrong answers.
- **Whole-page chunks.**
  Retrieving 5,000-word pages as 'passages.' Chunk by section; precision matters.
- **Single-phrasing queries.**
  One literal query missing paraphrased content. Expand phrasings or miss half the corpus.
- **Citation-free answers.**
  Fluent answers with no sources. Unverifiable = untrustworthy, however fluent.
- **Fabrication on gaps.**
  No source found, answer invented anyway. The cardinal sin of docs search — always admit gaps.
- **Stale indexes.**
  Docs updated, index months old. Answers cite superseded information confidently.
- **Keyword-only or semantic-only.**
  Each misses what the other catches. Hybrid retrieval is the standard for a reason.
- **No evaluation.**
  Never testing whether retrieval actually works. A test set of known Q&A pairs keeps the system honest.
