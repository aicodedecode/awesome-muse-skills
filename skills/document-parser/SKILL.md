---
name: document-parser
description: Building robust document ingestion — chunking, metadata, and multi-format pipelines for search and RAG.
category: document-processing
---

## Overview

Modern applications ingest documents for search, retrieval-augmented generation
(RAG), and analytics. A document parser pipeline turns heterogeneous files
(PDF, DOCX, HTML, spreadsheets, images) into clean, chunked, metadata-rich
units ready for indexing. This skill covers the architecture and the details
that determine retrieval quality.

## When to use

- Building RAG ingestion over PDFs, Office docs, and web pages
- Designing chunking strategies (size, overlap, semantic boundaries)
- Extracting metadata (titles, dates, authors, page numbers, source URLs)
- Handling tables, figures, and scanned content in parsing
- Evaluating and improving retrieval quality end-to-end

## Core concepts

**Parse → clean → chunk → enrich.** The pipeline stages: extract raw text with
structure (headings, tables, lists); clean (fix hyphenation, normalize
whitespace, drop boilerplate like repeated headers/footers); chunk into
retrieval units; enrich each chunk with metadata (source, section, page,
date). Skipping cleaning poisons everything downstream.

**Chunking strategy drives retrieval quality.** Fixed-size chunks with overlap
are the baseline (e.g. ~500 tokens, 10–20% overlap). Better: respect document
structure — chunk by section, keep tables intact, never split a table across
chunks. A chunk should be self-contained enough to make sense out of context,
which is why prepending section headings to each chunk helps enormously.

**Metadata is a retrieval multiplier.** Filters on metadata (date ranges,
document type, source) often beat pure semantic search for precision. Capture
rich metadata at ingest: title, section path, page numbers, author, date,
URL, document version. Store it alongside embeddings, not just in them.

**Tables need special handling.** Serialize tables as Markdown or HTML within
the chunk, keep them whole, and consider generating a textual summary of key
figures ("Q3 revenue was $4.2M, up 12%") as an additional chunk — dense numeric
tables embed poorly on their own.

**Format routing.** Detect file type and route to the right extractor
(native PDF text vs OCR for scans, structure-aware DOCX parsing, readability
extraction for HTML). One generic path for all formats produces mediocre
results for every format.

## Practical workflow

1. **Inventory your corpus:** formats, sizes, languages, scan-vs-native ratio,
   update frequency — the pipeline design follows from this.
2. **Build per-format extractors** with structure preservation (headings,
   tables, lists); add OCR routing for image-only PDFs.
3. **Implement cleaning:** de-hyphenate, normalize whitespace/unicode, strip
   running headers/footers and page numbers, detect and drop boilerplate.
4. **Chunk by structure** with fallback to sized chunks; prepend breadcrumb
   context (document title › section) to each chunk; keep tables atomic.
5. **Attach metadata** at ingest and expose it as filters in retrieval;
   version chunks so re-ingestion is idempotent (hash content, upsert by ID).
6. **Evaluate retrieval, not just parsing:** build a question set with known
   answers, measure hit rate / recall@k, and iterate on chunking and metadata —
   parser quality is proven by retrieval quality.

## Common pitfalls

- **Chunking by fixed size across table boundaries** — half a table in each of
  two chunks retrieves as nonsense; keep structural units atomic.
- **No dedup / idempotent re-ingestion** — re-running the pipeline duplicates
  chunks and corrupts results; content-hash IDs solve this.
- **Dropping page numbers and section context** — users can't verify answers
  without citations; metadata is a feature, not overhead.
- **Indexing boilerplate** (headers, footers, legal disclaimers on every page)
  — pollutes retrieval with repeated near-identical chunks; strip it.
- **One chunk size for all content** — dense technical prose and sparse slides
  need different strategies; tune per document type.
- **Evaluating the embedder while the parser is broken** — if chunks are dirty,
  no embedding model saves you; fix the pipeline bottom-up.
