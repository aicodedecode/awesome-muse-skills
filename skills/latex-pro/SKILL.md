---
name: latex-pro
description: LaTeX authoring and automation — documents, templates, and programmatic generation — use for academic papers, reports, and math-heavy docs.
category: document-processing
---

## Overview

LaTeX remains the gold standard for math-heavy documents, theses, and
publication-quality typesetting. Beyond authoring, LaTeX is automatable:
generate reports from data, manage bibliographies programmatically, and build
reproducible document pipelines. This skill covers both craft and automation.

## When to use

- Writing papers, theses, or technical reports with mathematics
- Creating reusable templates (letterheads, invoices, certificates, CVs)
- Managing bibliographies (BibTeX/BibLaTeX) at scale
- Generating LaTeX documents programmatically from data
- Debugging compilation errors and package conflicts

## Core concepts

**Structure with semantics.** `\section`, `\label`/`\ref`, `\cite`, and
environments (`theorem`, `figure`, `table`) — not manual numbering or
hardcoded "see page 12". Semantic markup is what makes cross-references,
TOCs, and bibliographies maintain themselves.

**Preamble discipline.** Load packages once, in a sensible order, with a
commented preamble or a shared `.sty` file for projects. Package conflicts
(fontenc/inputenc ordering, hyperref loaded last-ish) cause the most
mysterious errors; a curated preamble prevents them.

**BibLaTeX + Biber for bibliographies.** The modern stack handles Unicode,
complex entry types, and per-chapter bibliographies far better than legacy
BibTeX. Keep one curated `.bib` file; use a reference manager or consistent
citation keys (`author:year:keyword`).

**Compilation is a pipeline.** `pdflatex → biber → pdflatex → pdflatex` (or
`latexmk`, which automates the dance). Build with `latexmk -pdf` and let it
resolve the multi-pass requirements; in CI, pin the TeX distribution version
for reproducible builds.

**Programmatic generation.** Templates with placeholders filled from data
(CSV, JSON, databases) produce invoices, certificates, and reports with
typeset quality. Escape LaTeX special characters (`& % $ # _ { } ~ ^ \`) in
data — unescaped input is the #1 generation bug.

## Practical workflow

1. **Start from a template** (article, report, beamer, or your org's class) —
   don't build a preamble from scratch for each document.
2. **Write with labels from day one:** `\label{sec:method}` on everything
   you'll reference; `\cite{}` as you write, not at the end.
3. **Manage figures properly:** vector formats (PDF) for plots and diagrams,
   sensible DPI for raster images, `\includegraphics` with relative widths,
   captions that actually explain the figure.
4. **For math:** `amsmath` environments (`align`, `gather`), numbered only
   equations you'll reference; define macros for repeated notation
   (`\newcommand{\R}{\mathbb{R}}`).
5. **Automate builds:** `latexmk` locally, CI job for the final artifact;
   check in the `.tex`, `.bib`, and figures — never the generated PDF as
   source of truth.
6. **For generated documents:** template + data + escaping + a compile check
   in the pipeline; render a sample and visually inspect before bulk runs.

## Common pitfalls

- **Ignoring compilation warnings** — undefined references and multiply
  defined labels compound; fix them as they appear.
- **Manual bibliography formatting** — hand-typed reference lists drift and
  misformat; use BibLaTeX always.
- **Special characters in generated content** — `%` in data comments out the
  rest of the line; escape everything from untrusted data.
- **Huge monolithic .tex files** — split chapters into `\input` files; giant
  files are unmergeable and slow to navigate.
- **Package soup** — loading dozens of packages "just in case" invites
  conflicts; load what you use, in documented order.
- **Committing build artifacts** (`.aux`, `.log`, `.pdf`) — `.gitignore` them;
  only sources and the build recipe belong in version control.
