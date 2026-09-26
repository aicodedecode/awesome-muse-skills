---
name: dbt-fusion-engine
description: Analytics engineering with dbt — models, tests, and modular SQL pipelines — use when building or maintaining dbt projects.
category: database
---

## Overview

dbt (data build tool) brings software-engineering discipline to SQL-based data
pipelines: versioned models, automated tests, documentation, and modular
transformations inside the warehouse. This skill covers project structure, model
layering, testing strategy, and the operational habits of a healthy dbt project.

## When to use

- Structuring a new dbt project (staging, intermediate, marts layers)
- Writing models with refs, sources, seeds, and snapshots
- Adding data tests (unique, not_null, relationships, custom singular tests)
- Debugging slow runs, model failures, or test failures in CI
- Setting up dbt docs, exposures, and deployment (dbt Cloud / self-hosted runs)

## Core concepts

**Layer your models.** Staging (`stg_`): thin, one-per-source, renames and type
casts only. Intermediate (`int_`): joins and business logic building blocks.
Marts: wide, denormalized tables shaped for consumers (one per business domain
or dashboard). Layers keep changes local — a source schema change touches
staging, not every downstream model.

**`ref()` and `source()` are the dependency graph.** Always reference other
models with `{{ ref('model_name') }}` and raw tables with `{{ source(...) }}` —
never hardcode schema names. This builds the DAG, enables `dbt run -s
model+` selection, and keeps environments (dev/prod schemas) working.

**Tests are contracts.** Schema tests (`unique`, `not_null`, `accepted_values`,
`relationships`) on every mart primary key and FK are the minimum. Custom
singular tests encode business rules ("no order ships before it's paid").
Treat a failing test like a failing unit test: block the deploy.

**Materializations are a cost/latency trade-off.** Views (fresh, slow queries),
tables (fast queries, full rebuild cost), incremental (append/merge new rows —
essential for large event tables), ephemeral (CTEs for reuse without objects).
Choose per model; revisit as data grows.

**Snapshots for slowly changing dimensions.** `dbt snapshot` implements
type-2 SCD (valid_from/valid_to history) for dimensions like customer status —
use it instead of hand-rolled history logic.

## Practical workflow

1. **Scaffold with conventions:** `models/staging/<source>/`, `models/marts/<domain>/`,
   consistent prefixes, one `.yml` per directory documenting models and columns.
2. **Write the model SQL** using `ref`/`source`; keep each model doing one job;
   push filters early and avoid `SELECT *` from sources.
3. **Add tests in the same PR** as the model — primary keys get `unique` +
   `not_null`; FKs get `relationships`; business rules get singular tests.
4. **Run narrowly, then broadly:** `dbt run -s my_model+` (model and children),
   `dbt test -s my_model+`, then full `dbt build` before merging.
5. **Generate and review docs** (`dbt docs generate && dbt docs serve`) — column
   descriptions are how the next person trusts your mart.
6. **Deploy with CI:** run `dbt build` on pull requests against a staging schema
   (Slim CI / state comparison with `--select state:modified+`); schedule
   production runs with alerting on failure.

**Macro hygiene:** put repeated logic in macros with clear names and docstrings;
avoid Jinja cleverness that the next maintainer can't read — SQL first, Jinja
second.

## Common pitfalls

- **Business logic in staging models** — staging should be a 1:1 mirror of the
  source; logic belongs in intermediate/marts where it's discoverable.
- **Untested incremental models** — a bad incremental predicate silently drops
  rows forever. Test with `unique` on the key and reconcile row counts against
  a full refresh periodically.
- **`ref()` cycles or `source()` pointing at another model** — breaks the DAG
  and environment isolation; sources are raw inputs only.
- **Hardcoded database/schema names** in SQL — breaks multi-environment runs;
  always go through `ref`, `source`, and `target`.
- **Ignoring test failures in CI** ("we'll fix the data later") — trains the
  team to ignore tests; either fix the data or fix the test, immediately.
- **One giant mart model** doing everything — slow, untestable, and terrifying
  to change. Split into staged, named steps following the layering convention.
