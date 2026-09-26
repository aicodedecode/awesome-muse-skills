---
name: pdf-to-markdown
description: Converting PDFs to clean Markdown — layout-aware extraction for docs and RAG pipelines.
category: document-processing
---

## Overview

Turning PDFs into Markdown powers documentation migration, content repurposing,
and RAG ingestion. The challenge: PDFs store positioned glyphs, not semantic
structure — headings, tables, and reading order must be reconstructed. This
skill covers the conversion pipeline from layout analysis to clean Markdown
output.

## When to use

- Migrating PDF documentation to Markdown-based docs sites
- Building RAG ingestion that needs structured Markdown from PDFs
- Converting reports, papers, or ebooks to editable Markdown
- Choosing between rule-based extractors and vision/ML converters
- Post-processing converted Markdown for quality

## Core concepts

**Layout analysis comes first.** Before any text is emitted, the converter must
determine reading order, detect headings (by font size/weight patterns), find
tables, and separate multi-column flows. Quality differences between converters
live almost entirely here — the Markdown serialization is the easy part.

**Two converter families.** Rule-based tools analyze fonts, positions, and
lines (fast, local, good for born-digital PDFs with clean structure).
Vision/ML-based converters render pages as images and understand layout
visually (better for complex layouts, scanned pages, and messy real-world
PDFs; slower and often cloud-based). Match the tool to the document class.

**Tables are the hard part.** Good converters emit Markdown or HTML tables
preserving rows/columns; poor ones emit tab-separated text soup. For critical
tables, verify cell alignment manually — merged cells and multi-line cells are
where converters fail most.

**Markdown is lossy — decide what's expendable.** Precise positioning,
complex multi-column magazine layouts, and intricate styling don't survive.
Define the target: semantic structure (headings, lists, tables, code, math)
usually matters; pixel fidelity doesn't. Documents needing fidelity should
stay PDF.

**Reading order ≠ visual order.** Two-column papers, sidebars, and floating
figures confuse naive extractors, interleaving unrelated text. Layout-aware
converters handle this; always spot-check multi-column documents.

## Practical workflow

1. **Classify the corpus:** born-digital vs scanned (scans need OCR first),
   simple vs complex layout, math-heavy (needs LaTeX math preservation),
   table density.
2. **Pick the converter class** accordingly; run a representative sample
   (10–20 diverse pages) through candidates and compare.
3. **Convert with structure preservation:** headings hierarchy, tables as
   Markdown/HTML tables, lists, code blocks, image extraction with
   references, math as LaTeX where supported.
4. **Post-process programmatically:** fix hyphenation across line breaks,
   normalize heading levels, repair table alignment, strip repeated
   headers/footers and page numbers, reassemble split paragraphs.
5. **Quality-gate the output:** automated checks (heading hierarchy validity,
   table column consistency, no empty sections where content existed) plus
   human spot-checks on the hardest pages.
6. **Preserve provenance:** keep page-number mapping and source references so
   converted content stays citable and debuggable.

## Common pitfalls

- **Running a text extractor and calling it Markdown** — raw text dumps lose
  all structure; conversion means reconstructing semantics.
- **Ignoring scanned PDFs** — image-only pages convert to empty Markdown;
  route through OCR first (see ocr-pro).
- **Tables silently mangled** — always verify table output cell-by-cell on
  samples; merged cells are the top failure mode.
- **Math as garbage** — equations need LaTeX-aware conversion; plain text
  extraction turns formulas into unreadable symbol soup.
- **Losing figures and captions** — images extracted without captions or
  ordering become meaningless; keep figure-caption association.
- **No quality gates** — converting 10,000 pages without sampling and checks
  produces 10,000 pages of unverified output; measure before scaling.
