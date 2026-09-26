---
name: markdown-pro
description: Markdown authoring and processing — flavors, linting, conversion, and docs pipelines — use when writing or transforming Markdown.
category: document-processing
---

## Overview

Markdown is the default writing format for docs, READMEs, and increasingly for
LLM-facing content. But "Markdown" is a family of flavors (CommonMark, GFM,
MDX), and real pipelines need linting, link checking, and conversion. This skill
covers writing portable Markdown and building reliable Markdown toolchains.

## When to use

- Writing documentation, READMEs, or knowledge-base content
- Choosing between CommonMark, GitHub Flavored Markdown, and MDX
- Linting Markdown and enforcing style in CI
- Converting Markdown to/from HTML, PDF, DOCX, or other formats
- Building docs sites or processing Markdown programmatically (AST)

## Core concepts

**Write to the common subset.** Tables, task lists, footnotes, and admonitions
are extensions, not core Markdown. If your content must render on GitHub, a docs
site, and an LLM context window, stick to headings, lists, code fences, links,
images, emphasis, and blockquotes — the portable core.

**Flavors matter at the edges.** GFM adds tables, strikethrough, task lists, and
autolinked URLs. MDX adds JSX components (powerful, but locks you into a
JS toolchain). Know which flavor your renderer supports before using extension
syntax — a `:::note` admonition renders as literal text on GitHub.

**AST-based processing beats regex.** For programmatic transforms (rewriting
links, extracting headings, injecting TOCs), parse to an abstract syntax tree
and manipulate that. Regex over Markdown breaks on nested constructs, code
fences containing Markdown-like text, and reference-style links.

**Frontmatter is metadata.** YAML frontmatter (`---` block) carries title,
date, tags, and layout hints. Validate it with a schema — untyped frontmatter
drifts (dates as strings vs dates, tags as string vs list) and breaks builds.

**Line length and formatting.** Enforce a formatter (consistent list markers,
fenced code languages, trailing newline) so diffs stay clean and CI can check
style mechanically.

## Practical workflow

1. **Pick the flavor** for the target renderer(s); document the choice so
   contributors don't use unsupported syntax.
2. **Structure with headings:** one `#` title, hierarchical `##`/`###`, no
   skipped levels — this drives TOCs, anchors, and screen-reader navigation.
3. **Lint in CI:** a Markdown linter with a checked-in config catches
   inconsistent style, missing code-fence languages, and broken relative links.
4. **Check links:** run a link checker on internal and external links; external
   links rot — prefer permalinks and archive critical references.
5. **Convert via a real engine** (Pandoc-style) for Markdown → PDF/DOCX/HTML,
   with a checked-in template/CSS so output is styled consistently.
6. **For programmatic pipelines:** parse → AST → transform → serialize; keep
   the pipeline's Markdown subset documented and tested with fixture files.

## Common pitfalls

- **Flavor-specific syntax in "portable" docs** — admonitions, math, and
  directives silently render as garbage outside their home renderer.
- **Huge single files** — split long docs into chapters with an index page;
  giant files are unsearchable and murder diffs.
- **Images without alt text or with absolute local paths** — breaks
  accessibility and portability; use relative paths and meaningful alt text.
- **Linking to headings that get renamed** — anchor links rot when headings
  change; some pipelines validate them, most don't.
- **Tabs vs spaces in nested lists** — inconsistent indentation renders
  differently across renderers; let the formatter own it.
- **Putting generated content in hand-edited files** — generated TOCs, changelogs,
  and API tables belong in build steps, not in files humans edit.
