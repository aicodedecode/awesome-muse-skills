---
name: excel-pro
description: Spreadsheet automation — reading, writing, and analyzing Excel workbooks — use for xlsx generation, parsing, and data workflows.
category: document-processing
---

## Overview

Excel workbooks are a universal data interchange format — and a frequent source
of pain. This skill covers programmatic reading and writing of `.xlsx` files,
formula handling, styling for human-readable reports, and the patterns that keep
spreadsheet pipelines reliable at scale.

## When to use

- Generating formatted reports (styled headers, number formats, charts)
- Parsing uploaded spreadsheets with validation and error reporting
- Working with formulas: reading cached values vs recalculating
- Handling large workbooks without running out of memory (streaming)
- Migrating spreadsheet logic into code (or vice versa)

## Core concepts

**Read streaming, write deliberately.** Reading: for large files use streaming/
read-only modes that yield rows without loading the whole workbook. Writing:
build the workbook in memory (fine for most reports) but stream for very large
exports. Know your library's memory profile before processing a 500k-row file.

**Formulas are stored, not computed.** `.xlsx` stores the formula string and a
cached last-calculated value. Libraries generally read the cached value — they
don't recalculate. If the file was never opened in Excel, cached values may be
stale or absent. For pipeline-critical numbers, compute in code rather than
relying on spreadsheet formulas.

**Styles are expensive.** Each unique cell style combination creates a style
record; styling every cell individually bloats files and slows libraries.
Define a small set of named styles (header, currency, date, percent) and reuse
them.

**Validate on ingest.** Uploaded spreadsheets are user input: wrong sheet
names, merged cells, extra header rows, numbers stored as text, dates as
strings. Build a validation layer that reports row-level errors in human terms
("Row 14: 'Amount' must be a number") rather than crashing.

**Dates are serial numbers.** Excel dates are floats (days since 1899/1904
epoch, depending on workbook). Libraries convert them, but epoch mismatches
(Windows vs Mac workbooks) cause off-by-4-year bugs — verify with a known date.

## Practical workflow

1. **For reports:** define the layout (title, headers, data, totals, freeze
   panes, filters, column widths, print settings) as a reusable builder —
   consistent, branded output every run.
2. **Apply number formats** (currency, dates, percentages) so values display
   correctly in Excel; set column widths from content length with a cap.
3. **For parsing:** detect the header row robustly (don't assume row 1),
   normalize column names (lowercase, strip), coerce types with clear errors,
   and collect all row errors before failing.
4. **Handle formulas** by policy: read cached values with a staleness warning,
   or recompute in code — document which you chose.
5. **Stream large files** in both directions; test with a file 10x your
   expected max to find the memory cliff early.
6. **Round-trip test:** write a workbook, read it back, and assert the data
   matches — catches type/format regressions in CI.

## Common pitfalls

- **Numbers as text** (green triangle in Excel) — comparisons and sums silently
  misbehave; coerce and validate on ingest.
- **Merged cells in data regions** — parsers see values only in the top-left
  cell; unmerge or handle explicitly.
- **Assuming the first sheet / first row** — real uploads have cover sheets and
  title rows; locate data by content, not position.
- **Writing raw floats for money** — floating-point artifacts (0.1+0.2) in
  financial reports; round explicitly and use appropriate formats.
- **No row limits on user uploads** — a "spreadsheet" can be millions of rows;
  enforce sane limits and stream.
- **Locale-dependent formats** — `1,234.56` vs `1.234,56`; parse dates and
  numbers with explicit locale handling, never ambient defaults.
