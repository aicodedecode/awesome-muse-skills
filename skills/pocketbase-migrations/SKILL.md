---
name: pocketbase-migrations
description: Schema migrations in PocketBase — generating, reviewing, and applying them safely across environments.
category: pocketbase
---

## Overview

PocketBase turns dashboard schema changes into Go/JavaScript migration files
that apply in order — the mechanism that keeps dev, staging, and production
schemas identical. This skill covers the migration workflow: generating
migrations from changes, reviewing them, handling data migrations, and
applying them safely.

## When to use

- Evolving collections (new fields, changed types, new indexes)
- Syncing schema changes across environments
- Writing data migrations (backfills, transformations)
- Reviewing auto-generated migrations before applying
- Recovering from failed or partial migrations

## Core concepts

**Migrations are the source of truth.** The dashboard is a convenient editor,
but the migration files in version control define the schema. Workflow:
change in dev dashboard → export/generate migration → commit → apply to
staging/prod via the migrate command. Dashboard edits in production without
migrations are how environments diverge.

**Auto-generated, human-reviewed.** PocketBase can diff the current schema
against the migration history and generate the migration code. Always read
generated migrations before applying — especially destructive operations
(dropped collections/fields, type changes that truncate data). The generator
is faithful; it's your job to be careful.

**Ordering and idempotency.** Migrations apply sequentially, tracked in the
`_migrations` table. Never edit an applied migration — write a new one.
Keep migrations small and focused so failures are diagnosable and recovery
is obvious.

**Data migrations need batches.** Backfilling a new field across millions of
records in one migration can lock or OOM. Write data migrations that process
in batches with progress logging, and test them against a production-sized
snapshot before running for real.

**Superuser-only operations.** Applying migrations requires superuser/admin
context — never expose migration endpoints to regular API traffic. In
production, migrations run as part of the deploy process (or a controlled
manual step), not on app boot by every instance.

## Practical workflow

1. **Make schema changes in dev** via the dashboard; generate the migration
   and inspect the code — confirm it does exactly what you intended.
2. **Commit the migration** with the code that depends on it; the PR review
   covers both schema and usage together.
3. **Test the migration** forward (and rollback if supported) against a
   staging database seeded with realistic data, including edge cases the
   change affects (nulls, type coercions, unique constraints on existing
   duplicates).
4. **For data migrations:** write batch logic, dry-run on a snapshot, then
   run against production with monitoring; keep it resumable.
5. **Apply in deploy order:** backup → apply migrations → deploy new code
   (expand-contract: migrations must be compatible with both old and new
   code during the transition).
6. **Verify post-apply:** schema matches expectations, app health checks
   pass, and the migration history table shows the new entries.

## Common pitfalls

- **Editing applied migrations** — breaks the history chain for every other
  environment; always add a new migration.
- **Destructive changes without backup** — dropping a field/collection is
  instant and irreversible; backup first, and prefer soft-deprecate
  (stop writing, then drop later) for critical data.
- **Type changes that silently coerce** — text → number on dirty data loses
  or corrupts values; clean/validate data before the type migration.
- **Migration/code ordering bugs** — deploying code that needs a column
  before the migration runs (or vice versa); sequence deploys explicitly.
- **Untested migrations on production-sized data** — works on 100 dev rows,
   times out or locks on 10M prod rows; test at scale.
- **Dashboard drift** — someone "quickly fixes" prod in the dashboard;
  institute a rule: all schema changes go through migrations, no exceptions.
