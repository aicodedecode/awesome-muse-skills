---
name: prisma-pro-dev
description: Prisma ORM guidance — schema design, migrations, query optimization, relations, and production operations.
category: development
---

## Overview

Prisma is a next-generation ORM for Node.js and TypeScript: you declare models in a human-readable schema file, and Prisma generates a fully typed client. The schema becomes the single source of truth for your data model, and the generated client makes invalid queries a compile error rather than a runtime surprise.

The tradeoffs are real: the schema DSL adds a layer between you and SQL, migrations need care on large tables, and the client hides query behavior you must still understand. This skill covers using Prisma well — schema design, the migration workflow, relation loading without N+1s, and production operations.

## When to use

- Starting a new TypeScript project and choosing an ORM.
- Designing a Prisma schema (models, relations, indexes).
- Running migrations safely (dev workflow, production deploys).
- Fixing slow queries or N+1 problems in Prisma code.
- Modeling complex relations (many-to-many, self-relations, polymorphic patterns).
- Configuring Prisma for serverless or edge runtimes.
- Debugging Prisma Client errors and migration drift.

## Core concepts

- **Schema as source of truth.** `schema.prisma` declares models, relations, indexes, and the datasource. The generated client mirrors it exactly — change the schema, regenerate, and TypeScript tells you what broke.
- **Migrations are versioned SQL.** `prisma migrate dev` generates SQL migrations from schema diffs; `prisma migrate deploy` applies them in production. Never edit a migration that's been applied anywhere; always add a new one.
- **`include` vs `select`.** `include` loads relations (watch for over-fetching), `select` picks scalar fields. Combine them to fetch exactly what's needed — returning whole object graphs by default is how APIs get slow.
- **N+1 still applies.** Prisma batches some relation loads, but nested `include` chains and loops over queries still produce N+1 patterns. Inspect generated SQL with logging or the Prisma Studio/query insights before assuming efficiency.
- **Relation modes and referential actions.** `onDelete: Cascade` / `SetNull` / `Restrict` encode lifecycle rules in the schema. Choose deliberately — cascading deletes are convenient until they delete the wrong thing.
- **Indexes belong in the schema.** `@@index`, `@@unique`, and `@@fulltext` map to real database indexes. Add them for every foreign key you filter/join on and every `where`/`orderBy` pattern in hot queries.
- **Transactions.** `prisma.$transaction([...])` for interactive transactions; keep them short, touch rows in consistent order to avoid deadlocks, and never put network calls inside.
- **Raw SQL escape hatch.** `queryRaw` / `executeRaw` for what the fluent API can't express (complex aggregations, CTEs, window functions). Use typed variants so results stay type-safe.
- **Connection pooling.** Prisma manages its own pool; in serverless, connections explode without an external pooler (PgBouncer) or Prisma Accelerate. Set `connection_limit` deliberately.
- **Multi-schema and multi-database.** Prisma supports multiple schemas and databases with separate clients or datasource blocks — know the setup before committing to a topology.
- **Middleware and extensions.** Client extensions (`prisma.$extends`) for soft deletes, computed fields, and query logging — cleaner than scattering logic across call sites.
- **Seeding.** `prisma/seed.ts` with idempotent seeds for dev/staging; never seed production with destructive scripts.
- **Introspection.** `prisma db pull` reverse-engineers an existing database into a schema — the pragmatic start for brownfield projects.
- **Prisma Studio.** A GUI for browsing data during development. Useful for inspection; never a substitute for proper admin tooling or migrations.

## Practical workflow

1. **Design the schema first.** Model entities and relations on paper; encode referential actions, indexes, and uniqueness in the schema from the start.
   ```prisma
   model Order {
     id        String   @id @default(cuid())
     status    OrderStatus @default(PENDING)
     total     Decimal  @db.Decimal(10, 2)
     items     OrderItem[]
     createdAt DateTime @default(now())
     @@index([status, createdAt])
   }
   ```
2. **Migrate in dev, deploy in prod.** `prisma migrate dev --name add_orders` locally; review the generated SQL; in CI/CD run `prisma migrate deploy` as a separate release step — never from the app boot path.
   - For large tables: expand-contract migrations (add nullable → backfill → add constraint) to avoid long locks.
3. **Generate and use the typed client.** One shared `PrismaClient` instance (singleton in dev to survive hot reload); import types from the generated client for DTOs.
4. **Shape every query.** Default to `select` for scalars + `include` only for needed relations; paginate with cursor-based pagination for feeds.
   ```ts
   const orders = await prisma.order.findMany({
     where: { status: "PAID" },
     select: { id: true, total: true, createdAt: true, items: { select: { sku: true, qty: true } } },
     orderBy: { createdAt: "desc" },
     take: 20,
   });
   ```
5. **Wrap multi-write operations in transactions.** Keep them short and ordered; handle serialization failures with retry at the call site.
   ```ts
   await prisma.$transaction(async (tx) => {
     const order = await tx.order.create({ data: {...} });
     await tx.inventory.updateMany({ where: {...}, data: { reserved: { increment: 1 } } });
   });
   ```
6. **Add client extensions for cross-cutting logic.** Soft-delete filters, audit fields, and query timing in one place instead of repeated inline code.
7. **Configure for your runtime.** Serverless: external pooler or Accelerate, `connection_limit=1` per instance; long-lived servers: tune pool size to workload; always set statement timeouts.
8. **Observe.** Enable query logging in dev; in production track slow queries via the database (pg_stat_statements), not the ORM — the DB sees the truth.

## Common pitfalls

- **N+1 via nested includes** — deep `include` chains generating dozens of queries; inspect SQL and restructure.
- **Editing applied migrations** — corrupts every environment's migration history; always create a new migration.
- **Running `migrate dev` in production** — it can reset the database; `deploy` is the only prod-safe command.
- **Connection exhaustion in serverless** — each instance opening its own pool; use PgBouncer or Accelerate.
- **Missing indexes on foreign keys** — Prisma doesn't add them automatically; declare `@@index` for join/filter columns.
- **Cascading deletes by default** — convenient in dev, catastrophic with real data; choose referential actions per relation.
- **Long interactive transactions** — holding locks across awaits and network calls; keep transactions short and ordered.
- **Returning full models from APIs** — leaking internal fields and over-fetching; project with `select` at the boundary.
- **Multiple PrismaClient instances** — hot-reload creating clients until the pool exhausts; singleton pattern in dev.
- **Drift between schema and database** — manual DB changes bypassing migrations; `prisma migrate diff` to detect and reconcile.
- **No statement timeouts** — one bad query holding connections; set timeouts at the database level.
- **Seeding production destructively** — seed scripts that truncate; make seeds idempotent and environment-gated.
