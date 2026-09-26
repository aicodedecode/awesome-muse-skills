---
name: drizzle-pro
description: Drizzle ORM guidance — schema-as-code, relational queries, migrations, and SQL-first TypeScript data access.
category: development
---

## Overview

Drizzle is a TypeScript ORM that stays close to SQL: you define tables as code, write queries with a relational query builder that mirrors SQL structure, and get full type safety without a schema DSL or heavy runtime. If Prisma feels like a layer above SQL, Drizzle feels like SQL with types.

That closeness is the point — and the responsibility. Drizzle won't hide query behavior from you, which means you need to understand joins, indexes, and transactions yourself. This skill covers Drizzle's schema-as-code model, its relational query API, migration workflow, and the SQL-first patterns that make it shine.

## When to use

- Choosing a lightweight, SQL-first TypeScript ORM.
- Defining Drizzle schemas (tables, relations, indexes).
- Writing relational queries without N+1 problems.
- Running Drizzle migrations (drizzle-kit workflow).
- Using Drizzle with serverless/edge databases (Neon, PlanetScale, Turso, D1).
- Dropping to raw SQL for complex queries.
- Migrating from Prisma/TypeORM to Drizzle.

## Core concepts

- **Schema as TypeScript.** Tables are defined with `pgTable`/`mysqlTable`/`sqliteTable` — plain code, versioned in git, refactorable with your IDE. No DSL to learn, no codegen step for the schema itself.
- **Two query APIs.** The relational query builder (`db.query.users.findMany({ with: { posts: true } })`) for nested relational reads, and the SQL-like core API (`db.select().from(users).where(...)`) for everything else. Learn both; use each where it fits.
- **Relations are explicit.** `defineRelations` (or the `relations` helper) declares how tables join; the relational API uses them to build joins for you. Explicit relations mean no magic — and no surprise queries.
- **Migrations via drizzle-kit.** `drizzle-kit generate` diffs schema code into SQL migrations; `drizzle-kit migrate` applies them. Review generated SQL like any other migration; snapshot-based diffing can surprise on renames.
- **SQL-first, always.** Every Drizzle query maps predictably to SQL. When the builder can't express something, `sql` template literals drop you to raw SQL with parameterization built in — no string concatenation.
- **Dialect differences matter.** Postgres, MySQL, and SQLite have different types, index kinds, and capabilities. Drizzle exposes them honestly; write dialect-aware schema code and test against the real database.
- **Transactions.** `db.transaction(async (tx) => {...})` — same rules as everywhere: short, ordered row access, no network calls inside.
- **Prepared statements.** Drizzle supports prepared queries for hot paths; use them for repeated queries where parse overhead matters.
- **Indexes and constraints in code.** `index()`, `uniqueIndex()`, foreign keys with `onDelete` actions — declared alongside the table, migrated with everything else.
- **Edge/serverless friendly.** Zero-dependency, tiny bundle, HTTP-based drivers for Neon/PlanetScale/Turso — Drizzle was built for the serverless world where Prisma's engine is heavy.
- **No magic N+1 hiding.** The relational API generates joins (not per-row queries) for `with` clauses — understand which API you're using and what SQL it emits.
- **Zod integration.** `drizzle-zod` generates Zod schemas from table definitions — one source of truth for DB schema and API validation.
- **Seeding.** Plain scripts using the same client; idempotent seeds, environment-gated.
- **Introspection.** `drizzle-kit pull` reverse-engineers existing databases for brownfield adoption.

## Practical workflow

1. **Define tables as code.** One module per domain; declare columns, indexes, and relations together.
   ```ts
   export const orders = pgTable("orders", {
     id: uuid("id").primaryKey().defaultRandom(),
     status: text("status").notNull().default("pending"),
     total: numeric("total", { precision: 10, scale: 2 }).notNull(),
     createdAt: timestamp("created_at").defaultNow().notNull(),
   }, (t) => [index("orders_status_created_idx").on(t.status, t.createdAt)]);
   ```
2. **Declare relations.** Map the joins once so the relational API can use them everywhere.
   ```ts
   export const ordersRelations = defineRelations(orders, (r) => ({
     items: r.many.orderItems,
     customer: r.one.customers, { from: r.customerId, to: r.customers.id },
   }));
   ```
3. **Generate and review migrations.** `drizzle-kit generate` then read the SQL — especially renames, which the differ may express as drop/add. Fix destructive diffs before applying.
4. **Query relationally for reads.** `db.query.orders.findMany({ with: { items: true }, where, orderBy, limit })` — nested reads as joins, typed end to end.
   - For complex reporting, switch to the core API or `sql` — don't fight the relational API into shapes it wasn't built for.
5. **Use the core API for writes and complex filters.** `db.insert/update/delete` with `where` clauses; `onConflictDoUpdate` for upserts; returning clauses to get rows back.
   ```ts
   const [order] = await db.insert(orders)
     .values({ status: "paid", total: "99.99" })
     .returning({ id: orders.id });
   ```
6. **Wrap multi-step writes in transactions.** Short, ordered, no I/O inside — the universal rules apply.
7. **Validate at the boundary.** `drizzle-zod` schemas for API input; the DB schema and the API schema stay in sync by construction.
8. **Test against the real dialect.** SQLite in tests while Postgres runs in prod hides real behavior; use containers (or a cheap hosted branch) for integration tests.

## Common pitfalls

- **Rename expressed as drop/add** — the differ can't always tell; review generated SQL and hand-write renames with `sql` when needed.
- **Using the wrong query API** — forcing reporting queries through the relational API; switch to core/`sql` for aggregations and complex joins.
- **Missing indexes** — declaring tables without indexes for hot filter/join columns; add them in the table definition.
- **N+1 in application code** — looping queries instead of one relational fetch; fetch nested data in a single query.
- **SQLite/Postgres drift** — testing on one dialect, deploying another; type and behavior differences will bite.
- **Long transactions** — same universal rule: short, ordered, no network calls inside.
- **Unparameterized `sql`** — interpolating values into `sql` fragments instead of using its parameter binding; that's SQL injection.
- **No migration review** — auto-applying generated migrations; always read the SQL, especially on existing tables.
- **Ignoring connection limits** — serverless HTTP drivers vs pooled TCP drivers; pick the driver for your runtime and set limits.
- **Schema code sprawl** — one giant schema file; split by domain like any other code.
- **Forgetting `onDelete` actions** — default restrict behavior surprising deletes; declare referential actions explicitly.
- **Returning full rows from APIs** — select only needed columns; the builder makes projection easy, so use it.
