---
name: r-pro
description: Professional R: tidyverse workflows, vectorization, packaging, R Markdown reporting, and Shiny apps. Use when writing, reviewing, or structuring R code for analysis or production.
category: development
---

# R Pro

## Overview

R's strength — **expressive data analysis with a massive statistical ecosystem** — turns into a
liability when scripts grow into unmaintainable notebooks. Professional R means writing *programs*,
not just scripts: vectorized operations, functions over copy-paste, packages over loose files,
reproducible environments (renv), and reports that regenerate from raw data with one command.

The through-line: reproducible, vectorized, and packaged — analysis you can rerun and trust.

## When to use

- Writing or reviewing R code for analysis, modeling, or reporting.
- Structuring R projects (packages, targets pipelines, renv).
- Choosing between base R and tidyverse idioms.
- Building Shiny apps or R Markdown/Quarto reports.
- Debugging performance or reproducibility issues.

## Core concepts

- **Vectorization is the language.** Operations apply to whole vectors — `x * 2`, `ifelse`,
  `dplyr::mutate` — loops over rows are almost always wrong (slow and unidiomatic). Think in
  columns and transformations, not iterations.
- **Tidyverse as a dialect.** `dplyr` (manipulation), `tidyr` (reshaping), `ggplot2` (visualization),
  `purrr` (functional iteration), `readr`/`tibble` (I/O). The pipe (`|>`) chains verbs readably.
  Pick tidyverse *or* base/data.table per project and stay consistent — mixing dialects confuses.
- **Tidy data.** Each variable a column, each observation a row, each value a cell. Half of "R is
  hard" is fighting untidy data — `pivot_longer`/`pivot_wider` first, analysis second.
- **Functions and packages.** Repeated analysis → functions; shared functions → a package
  (`usethis::create_package`) with documentation (roxygen2) and tests (testthat). Scripts are for
  exploration; packages are for reuse.
- **Reproducibility.** `renv` locks package versions; Quarto/R Markdown weaves code + narrative so
  reports regenerate; `targets` builds dependency-aware pipelines (changed upstream → rebuild only
  downstream). "It worked on my laptop" is not reproducibility.
- **Factors and types deliberately.** Strings vs factors (know when each bites — modeling vs
  display), dates as dates (`lubridate`), missing values (`NA`) handled explicitly, not ignored.

## Practical workflow

1. **Scaffold the project.** RStudio project or plain dir + `renv::init()`; `data/` (raw, read-only),
   `R/` (functions), `reports/` (Quarto docs), `tests/` (testthat). Never modify raw data in place.
2. **Explore interactively, then codify.** Notebook exploration is fine — but promote repeated
   logic into functions in `R/` as soon as it's used twice.
3. **Write vectorized pipelines.** `read → clean (tidyr) → transform (dplyr) → model → visualize
   (ggplot2)`, each step a pipe chain or function. Avoid row loops; use `purrr::map` family for
   iteration that must happen.
4. **Build the pipeline with `targets`.** Declare dependencies between steps; `tar_make()` rebuilds
   only what's stale. Your analysis becomes a build system, not a prayer.
5. **Report with Quarto.** Narrative + code + figures in one document; parameterized reports for
   repeated variants (per-region, per-month). The report *is* the analysis artifact.
6. **Test and review.** testthat for package functions (edge cases: empty data, all-NA columns,
   unexpected types); code review for analysis code catches methodology bugs tests can't.

Idiomatic snippets:

```r
library(dplyr)

orders |>
  filter(!is.na(total), status != "cancelled") |>
  mutate(month = lubridate::floor_date(created_at, "month")) |>
  group_by(month, region) |>
  summarise(
    revenue = sum(total),
    n_orders = n(),
    .groups = "drop"
  ) |>
  arrange(month)

# purrr instead of loops for model-per-group
models <- orders |>
  split(.$region) |>
  purrr::map(~ lm(total ~ discount, data = .x))
```

## Common pitfalls

- **Row-wise loops.** `for (i in 1:nrow(df))` — slow and unidiomatic. Vectorize, or use
  `purrr`/`dplyr` verbs. (data.table is the legitimate fast alternative for huge data.)
- **Copy-paste analysis.** The same 40 lines with different filters, diverging silently. Extract
  functions; parameterize reports.
- **No environment lock.** "Install latest tidyverse" in a README is not reproducibility.
  `renv::snapshot()` and commit the lockfile.
- **Modifying raw data.** Overwriting `data/raw.csv` with cleaned data destroys provenance. Raw
  is immutable; cleaning is code.
- **Factors biting.** Unexpected level ordering in plots/models, or `read.csv` coercing strings.
  Be deliberate: set levels explicitly, use `stringsAsFactors` intentionally.
- **Growing vectors in loops.** `x <- c(x, new)` reallocates every iteration — quadratic. Preallocate
  or collect in a list and combine once.
- **Shiny reactivity spaghetti.** Observers triggering observers, no modularization. Shiny modules
  for reusable components; keep server logic in functions testable outside Shiny.
