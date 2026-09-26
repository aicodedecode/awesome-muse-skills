---
name: chunking-strategies
description: Split documents for retrieval effectively — fixed, semantic, structural, and hierarchical chunking with overlap tuning. Use when RAG retrieval quality depends on how documents are divided.
category: ai-research
---

# Chunking Strategies

Chunking decides what the retriever can find: too large and the signal drowns; too small and 
context is lost; split in the wrong place and meaning breaks. It's the highest-leverage decision in 
most RAG pipelines — and the most under-tuned.

## Overview

Strategies range from naive (fixed token windows) to structure-aware (split on headings, 
paragraphs, tables) to semantic (split where meaning shifts) to hierarchical (small chunks with 
parent context). Overlap preserves boundary context. The right choice depends on content type — 
prose, tables, code, and transcripts chunk differently — and must be validated by inspecting 
actual chunks and measuring retrieval, not by theory.

## When to use

- Building or debugging any RAG pipeline.
- Retrieval returns "almost right" passages or fragments cut mid-thought.
- Mixed corpora: docs with tables, code blocks, headings, lists.
- Tuning retrieval quality when embeddings and ranking are already reasonable.

## Core concepts

- **Fixed-size chunking**: N tokens with M overlap — simple, predictable, content-blind. The 
baseline everything else must beat.
- **Structural chunking**: split on document structure — headings, sections, paragraphs, table 
boundaries. Preserves the author's organization; the best default for structured docs.
- **Semantic chunking**: split where embedding similarity between adjacent sentences drops — 
boundaries at meaning shifts. Better for unstructured prose; costs embedding calls.
- **Hierarchical chunking**: small retrievable chunks linked to parent sections — retrieve 
precise, generate with context. Best of both worlds at higher complexity.
- **Overlap**: shared tokens between adjacent chunks so boundary content isn't orphaned. Typically 
10–20%; more for dense technical text.
- **Metadata per chunk**: source, section heading, page, position — preserved through chunking 
for filtering, citations, and parent lookup.

## Practical workflow

1. Inspect your documents: structure, tables, code, average section length. Let the content suggest 
the strategy.
2. Start with structural chunking (sections/paragraphs) + modest overlap as the baseline.
3. Eyeball 30+ actual chunks: are tables intact? sentences complete? headings attached? Fix what's 
visibly broken.
4. Measure retrieval hit-rate on your eval set per strategy; try 2–3 strategies, not ten.
5. Tune size and overlap around the winner — smaller for precise QA, larger for synthesis tasks.
6. Consider hierarchical (child chunks + parent context) if small chunks retrieve well but answers 
lack context.

```text
Chunk inspection checklist (do this manually!):
[ ] No chunk starts/ends mid-sentence (except long lists)
[ ] Tables and code blocks intact within one chunk
[ ] Each chunk carries its section heading (metadata or prepended)
[ ] Chunk is self-contained enough to judge relevance alone
[ ] Overlap preserves boundary sentences
```

## Common pitfalls

- **Theory-driven chunking**: picking a strategy from a blog post without inspecting your chunks. 
Look at them.
- **Tables split across chunks**: the most common silent killer. Detect tables/lists and keep them 
whole.
- **No heading context**: a chunk saying "it increased 40%" with no idea what "it" is. Prepend 
section paths.
- **One size for all content**: 512 tokens for prose, tables, and code alike. Adapt to content type.
- **Zero overlap**: boundary sentences orphaned. Some overlap is nearly always worth it.
- **Tuning embeddings before chunking**: swapping embedding models while chunks are broken. Fix 
chunking first — it's usually the bottleneck.
