---
name: prisma-pro
description: Prisma ORM mastery — schema design, migrations, and query optimization — use when building with Prisma.
category: database
---

## Overview

Prisma is a type-safe ORM for Node.js/TypeScript (with growing language support)
covering schema definition, migrations, and a fluent query client. Its strength
is end-to-end type safety from database to application code. This skill covers
schema modeling, migration workflows, and getting performant queries out of the
client.

## When to use

- Designing `schema.prisma` models, relations, and enums
- Running migrations (`migrate dev`, `migrate deploy`, baselining)
- Writing efficient Prisma Client queries (select/include, pagination)
- Debugging N+1 queries, slow queries, or migration drift
- Using Prisma in serverless/edge runtimes (Accelerate, driver adapters)

## Core concepts

**The schema is the contract.** Models, fields, relations, and attributes in
`schema.prisma` generate both migrations and the type-safe client. Keep it as
the single source of truth — don't hand-edit the database and hope the schema
catches up.

**Relations are explicit.** One-to-many, many-to-many (implicit or explicit join
model — explicit when the join needs attributes), and one-to-one each have
relation syntax with `fields`/`references`. Understand relation load strategies:
`include` (joins / batched queries) vs `select` (field whitelisting). Default to
`select` with only needed fields — over-fetching is the quiet performance killer.

**Migrations are versioned SQL.** `prisma migrate dev` generates SQL from schema
diffs; review the generated SQL before applying, especially for destructive
changes (dropped columns, type changes). `migrate deploy` applies pending
migrations in production — never `migrate dev` against prod. Baseline existing
databases with `--baseline` instead of faking history.

**N+1 is still possible.** Loops calling `findUnique` per item generate N+1
queries — batch with `findMany({ where: { id: { in: ids } } })` or use nested
`include`. Enable query logging in development to see the actual SQL.

**Connection management matters.** Prisma opens a connection pool per client
instance; in serverless, create one shared client (global singleton pattern)
and consider a pooler (PgBouncer) or Prisma's Accelerate/driver adapters to
avoid connection exhaustion.

## Practical workflow

1. **Model deliberately:** map entities to models, choose relation shapes,
   add `@@index` for FK/query patterns, `@@unique` for natural keys, and
   database-level defaults (`@default(now())`, `@db` type mappings).
2. **Migrate in dev:** `prisma migrate dev --name descriptive_name`; read the
   generated SQL; test the migration against realistic data (especially
   backfills and non-null additions).
3. **Query with intent:** `select` minimal fields, paginate with cursor-based
   (`cursor` + `take`, ordered by unique key) rather than `skip` for large
   datasets, and batch with `$transaction` for atomic multi-writes.
4. **Inspect generated SQL** (`log: ['query']` in dev or the `query` event) when
   performance matters; add missing indexes at the schema level.
5. **Seed reproducibly** (`prisma/seed.ts`) so every environment starts from
   known data; keep seeds idempotent.
6. **Deploy:** run `prisma migrate deploy` in the release step (before the new
   code serves traffic), keep migrations expand-contract compatible, and have
   a rollback plan (forward migration, not `migrate resolve` hacks).

## Common pitfalls

- **`include` without `select` on huge relations** — fetches entire related
  tables; always narrow with `select` or paginate relations.
- **Drift between schema and database** (manual DB edits) — `prisma migrate
  diff` / `db pull` to detect; resolve by aligning schema → migration → DB.
- **Editing a migration file after it's applied** — history must be immutable;
  write a new migration instead.
- **Offset pagination (`skip`/`take`) on large tables** — same cost as SQL
  `OFFSET`; use cursor pagination for feeds and infinite scroll.
- **One PrismaClient per request** in serverless — exhausts connections;
  singleton pattern + external pooler.
- **Cascading deletes by accident** (`onDelete: Cascade` on the wrong side) —
  deleting one row wipes related data; choose `Restrict`/`SetNull` deliberately
  and document the choice.
