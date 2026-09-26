---
name: document-translator
description: Translating documents while preserving layout, tables, and formatting — use for multilingual document workflows.
category: document-processing
---

## Overview

Document translation isn't just translating text — it's translating text while
keeping the document intact: layout, tables, images, headers, footers, and
formatting. This skill covers the pipeline from structured extraction through
translation to faithful reconstruction, plus quality assurance.

## When to use

- Translating Office documents, PDFs, or HTML while preserving formatting
- Building multilingual documentation pipelines
- Handling right-to-left (RTL) languages and locale-specific formatting
- Managing translation memory and glossaries for consistency
- QA'ing translated documents (layout breakage, untranslated strings)

## Core concepts

**Translate structure, not strings.** Extract translatable segments with their
structural context (heading, table cell, list item, caption) — context
disambiguates meaning ("lead" the metal vs "lead" the team). Rebuild the
document from the translated segments rather than find-replacing in the raw
file, which corrupts formatting.

**Segmentation matters.** Sentence-level segmentation is the translation
industry standard (enables translation memory reuse). Preserve inline
formatting markers within segments so bold/links survive translation.

**Glossaries enforce consistency.** Product names, technical terms, and brand
voice need locked translations. Maintain a termbase (source term → approved
target term per language) and enforce it — inconsistent terminology is the
fastest way to look unprofessional in a second language.

**Text expansion breaks layouts.** German runs ~30% longer than English;
Chinese contracts. Fixed-size text boxes, buttons, table columns, and slide
layouts overflow. Design source documents with expansion room, and QA target
layouts visually — automated checks catch overflow only if you measure
rendered text.

**Locale isn't just language.** Dates, numbers, currencies, units, and
reading direction (RTL for Arabic/Hebrew) need localization. A translated
document with US date formats and LTR layout for Arabic is half-finished.

## Practical workflow

1. **Prepare the source:** clean up the document (consistent styles, no manual
   formatting hacks), extract translatable content with structure intact.
2. **Set up language assets:** translation memory from prior work, glossary/
   termbase for key terms, style guide notes per language.
3. **Translate with context:** provide translators (human or machine + human
   review) with segment context, screenshots for UI-adjacent content, and
   character limits where layout constrains.
4. **Reconstruct the document** in the original format, applying target-locale
   typography (fonts supporting the script, RTL layout mirroring, locale
   number/date formats).
5. **QA systematically:** spell/grammar check in target language, glossary
   compliance scan, untranslated-segment detection, layout review (overflow,
   broken tables, orphaned punctuation), and functional check of links/TOC.
6. **Version and maintain:** source changes require re-translation of changed
   segments only (translation memory diffing); keep source and translations
   versioned together.

## Common pitfalls

- **Machine-translating without human review** for customer-facing or legal
  content — MT quality varies wildly by language pair and domain; post-editing
  is part of the workflow, not optional.
- **Translating the raw file with find-replace** — destroys formatting,
  duplicates, and embedded objects; use structured extraction.
- **Ignoring text expansion** — translated UI/docs overflow fixed layouts;
  budget space and verify visually.
- **Inconsistent terminology** across documents — build and enforce the
  glossary from document one.
- **Forgetting RTL** — Arabic/Hebrew need mirrored layouts, RTL text flow,
  and appropriate fonts; LTR assumptions break everything.
- **Translating content that shouldn't be translated** — code samples, URLs,
  brand names, and placeholders (`{{name}}`) must be protected from
  translation; use do-not-translate rules.
