---
name: sequelize-pro
description: Sequelize ORM guidance — models, associations, migrations, transactions, and production-safe configuration.
category: development
---

## Overview

Sequelize is the battle-tested Node.js ORM with support for Postgres, MySQL, MariaDB, SQLite, and MSSQL. Its model-definition API, rich association system, and mature migration tooling (via sequelize-cli) have powered Node backends for over a decade. It's less fashionable than newer ORMs but deeply understood — and its sharp edges are well documented.

The keys to Sequelize are: define models explicitly, use `include` deliberately (it's a join — understand the SQL), migrate with the CLI, and never let `sync()` near production. This skill covers idiomatic Sequelize for apps that need to run reliably for years.

## When to use

- Maintaining or building a Node.js app on Sequelize.
- Defining models, associations, and indexes.
- Writing migrations with sequelize-cli.
- Fixing N+1 queries or slow `include` usage.
- Managing transactions correctly.
- Configuring connection pooling for production.
- Migrating from Sequelize to another ORM (or vice versa).

## Core concepts

- **Model definitions.** `sequelize.define` or `Model.init` with explicit attribute types, `allowNull`, defaults, and validations. Explicit beats inferred — declare everything the table needs.
- **Associations.** `hasMany`/`belongsTo`/`belongsToMany` declare relations and generate both the foreign keys and the `include` machinery. Define both sides; through-models for many-to-many carry their own attributes.
- **`include` is a join.** Eager loading via `include` generates JOINs (or separate queries with `separate: true`). Understand which one you're getting — the SQL shape determines performance.
- **Migrations via CLI.** `sequelize-cli` generates timestamped migration files with `up`/`down`; `db:migrate` applies them. Write `down` properly — rollbacks happen at 3am and must work.
- **Transactions.** `sequelize.transaction(async (t) => {...})` with the transaction passed to every query inside (`{ transaction: t }`). Forgetting to pass `t` is the classic Sequelize bug — the query runs outside the transaction silently.
- **CLS for implicit transactions.** `cls-hooked` namespace can propagate transactions implicitly, removing the need to pass `t` everywhere — at the cost of spooky action at a distance. Explicit passing is easier to reason about.
- **Scopes.** `defaultScope` and named scopes encapsulate common filters (e.g., excluding soft-deleted or draft records). Beware `defaultScope` hiding data in surprising contexts — prefer explicit named scopes.
- **Hooks.** `beforeCreate`/`afterUpdate` etc. for audit fields, denormalization, and side effects. Keep them light; heavy hooks create invisible coupling and slow bulk operations.
- **Paranoid (soft deletes).** `paranoid: true` adds `deletedAt` filtering to all queries — remember it affects unique constraints and counts, and use `paranoid: false` explicitly when you need the truth.
- **Connection pooling.** Configure `pool: { max, min, acquire, idle }` per environment; set `acquire` timeouts so a saturated pool fails fast instead of hanging.
- **Raw queries.** `sequelize.query` with replacements (never string interpolation) for reporting, CTEs, and anything the model API can't express cleanly.
- **Dialect options.** Each supported database has quirks (MySQL backticks, MSSQL top, Postgres returning) — Sequelize abstracts most, but test against your real dialect.
- **Migrations vs sync.** `sequelize.sync()` is for prototypes and tests; production schema changes go through migrations, always.
- **Bulk operations.** `bulkCreate`/`update`/`destroy` with `individualHooks` considerations — hooks don't run by default on bulk ops, which surprises people relying on them.

## Practical workflow

1. **Define models explicitly.** Attributes with types and constraints, associations on both sides, indexes for hot paths, `underscored: true` if your DB convention is snake_case.
   ```js
   const Order = sequelize.define("Order", {
     status: { type: DataTypes.STRING, allowNull: false, defaultValue: "pending" },
     total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
   }, { underscored: true, indexes: [{ fields: ["status", "created_at"] }] });
   Order.hasMany(OrderItem, { foreignKey: "order_id" });
   OrderItem.belongsTo(Order, { foreignKey: "order_id" });
   ```
2. **Write migrations for every schema change.** `npx sequelize-cli migration:generate --name add-orders`; implement `up` and `down`; run `db:migrate` in the deploy pipeline, not at app boot.
3. **Query with intent.** `findAll` with explicit `attributes` and `include` (with nested `attributes`); paginate with `limit`/`offset` or keyset; avoid `findAll` without limits.
   ```js
   const orders = await Order.findAll({
     attributes: ["id", "status", "total"],
     include: [{ model: OrderItem, attributes: ["sku", "qty"] }],
     where: { status: "paid" },
     order: [["created_at", "DESC"]],
     limit: 20,
   });
   ```
4. **Transact explicitly.** Pass `{ transaction: t }` to every query inside the callback; keep transactions short; retry on serialization failures.
   ```js
   await sequelize.transaction(async (t) => {
     const order = await Order.create({...}, { transaction: t });
     await Inventory.update({...}, { where: {...}, transaction: t });
   });
   ```
5. **Use scopes deliberately.** Named scopes for common filters (`Order.scope("paid")`); avoid `defaultScope` magic that hides rows.
6. **Handle raw SQL safely.** `sequelize.query("SELECT ... WHERE status = :status", { replacements: { status }, type: QueryTypes.SELECT })` — replacements, never interpolation.
7. **Configure pooling per environment.** Dev small, prod sized to workload; `acquire` timeout to fail fast; monitor pool wait times.
8. **Test with migrations.** Test databases built via `db:migrate` (not `sync`) so tests exercise the real schema path; seed with factories.

## Common pitfalls

- **Forgetting `{ transaction: t }`** — queries silently running outside the transaction; the #1 Sequelize bug.
- **`sync()` in production** — schema drift and data loss; migrations only.
- **N+1 via lazy access** — touching associations in loops; `include` them up front.
- **Unbounded `findAll`** — no limit on a growing table; always paginate.
- **`include` without attribute limits** — selecting entire joined tables; restrict `attributes` at every level.
- **Hooks not running on bulk ops** — `bulkCreate` skipping `beforeCreate`; know when hooks fire.
- **Paranoid surprises** — soft-deleted rows breaking unique constraints and counts; design for it.
- **`defaultScope` hiding data** — filters applied where you forgot; prefer explicit named scopes.
- **String-interpolated raw queries** — SQL injection; always use `replacements`.
- **Pool exhaustion** — too-small pools under load with no `acquire` timeout; size and monitor.
- **Missing `down` migrations** — rollbacks impossible at 3am; write both directions.
- **Timezone mishandling** — configure `timezone` explicitly; store UTC, convert at the edge.
