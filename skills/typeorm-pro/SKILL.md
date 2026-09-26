---
name: typeorm-pro
description: TypeORM guidance — decorators, repositories, migrations, query builder, and avoiding its classic pitfalls.
category: development
---

## Overview

TypeORM is the long-standing TypeScript ORM in the ActiveRecord/DataMapper tradition: decorators declare entities, repositories and the query builder execute queries, and it supports nearly every database. Its flexibility is its risk — the same task can be done five ways, and several of them are slow or unsafe.

TypeORM rewards explicitness: repositories over magic, the query builder over clever decorators, migrations over `synchronize`. This skill covers the safe subset of TypeORM — entity design, repository patterns, migration discipline — and the classic pitfalls (N+1, `synchronize: true`, lazy relations) that have ended careers.

## When to use

- Working in an existing TypeORM codebase (very common in NestJS apps).
- Designing entities, relations, and indexes.
- Choosing between repository API, query builder, and raw SQL.
- Writing and running migrations safely.
- Fixing N+1 queries or slow TypeORM code.
- Deciding whether to adopt, keep, or migrate away from TypeORM.
- Configuring TypeORM for production (pooling, logging, replication).

## Core concepts

- **DataMapper vs ActiveRecord.** TypeORM supports both; prefer DataMapper (entities as plain classes + repositories) — ActiveRecord's static methods couple your domain to the ORM and complicate testing.
- **Entities are the schema.** Decorators (`@Entity`, `@Column`, `@ManyToOne`) declare tables. Keep entities focused on persistence; don't hang business logic on them.
- **Repositories.** `repository.find`, `save`, `create` — the standard data-access surface. Encapsulate query logic in custom repositories or service functions, not scattered `find` calls with inline options.
- **Query builder for real queries.** `createQueryBuilder` gives explicit joins, selects, and filters — the tool for anything beyond trivial CRUD. It maps closely to SQL, which makes performance reasoning possible.
- **Relations and loading strategies.** `eager: true` loads relations automatically (dangerous — it loads everywhere), lazy relations use promises (convenient, N+1-prone), explicit `relations: [...]` or query-builder joins are the controlled choice.
- **Migrations.** Generate from entity diffs (`migration:generate`), review the SQL, run with `migration:run`. This is the only safe production path — `synchronize: true` is a development convenience that can drop data.
- **Transactions.** `dataSource.transaction(async (manager) => {...})` — use the transactional entity manager for everything inside; the classic bug is mixing the outer repository with the inner transaction.
- **Indexes and constraints.** `@Index` on filter/join columns, `@Unique` for uniqueness — declare them on the entity so generated migrations include them.
- **Subscribers and listeners.** `@AfterInsert`/`@BeforeUpdate` hooks for audit fields and denormalization; keep them side-effect-light — heavy logic in subscribers is invisible coupling.
- **Connection pooling.** TypeORM delegates to the underlying driver pool; size it for your workload and set timeouts. One `DataSource` per process, initialized once.
- **Soft deletes.** `@DeleteDateColumn` + `softRemove` — remember that queries exclude soft-deleted rows by default, which surprises reporting and unique constraints.
- **Caching.** Optional query-result caching (Redis) for expensive reads — explicit, keyed, and invalidated deliberately.
- **Multiple connections.** Named connections for read replicas or multiple databases; be explicit about which connection each repository uses.
- **Logging.** Enable query logging in development; log slow queries in production. You can't fix queries you can't see.

## Practical workflow

1. **Model entities deliberately.** Decorators for columns, relations with explicit `onDelete`, indexes for hot paths; no `eager: true` by default.
   ```ts
   @Entity()
   export class Order {
     @PrimaryGeneratedColumn("uuid") id: string;
     @Column({ default: "pending" }) status: string;
     @Column("decimal", { precision: 10, scale: 2 }) total: string;
     @OneToMany(() => OrderItem, (i) => i.order) items: OrderItem[];
     @CreateDateColumn() createdAt: Date;
   }
   ```
2. **Generate and review migrations.** `typeorm migration:generate -d ormconfig -n AddOrders`; read every line of SQL; never hand-edit an applied migration.
3. **Use repositories for CRUD, query builder for queries.** Simple `find`/`save` for single-entity work; `createQueryBuilder` with explicit joins the moment relations or performance matter.
   ```ts
   const orders = await orderRepo.createQueryBuilder("o")
     .leftJoinAndSelect("o.items", "items")
     .where("o.status = :status", { status: "paid" })
     .orderBy("o.createdAt", "DESC")
     .take(20)
     .getMany();
   ```
4. **Load relations explicitly.** Pass `relations` or join in the query builder; never rely on lazy promises in hot paths or serialization.
5. **Transact correctly.** Use the transactional manager for all operations inside `dataSource.transaction`; keep transactions short and ordered.
   ```ts
   await dataSource.transaction(async (m) => {
     const order = await m.save(Order, {...});
     await m.update(Inventory, {...}, { reserved: () => "reserved + 1" });
   });
   ```
6. **Configure for production.** `synchronize: false`, `migrationsRun` via your deploy step (not app boot), pool sizing, slow-query logging, and statement timeouts.
7. **Add indexes for query patterns.** Every filtered/joined/ordered column on hot paths gets an `@Index`; verify with `EXPLAIN` on real data volumes.
8. **Test data access.** Integration tests against a real database (containers); unit tests with mocked repositories for service logic — never mock the query builder's internals.

## Common pitfalls

- **`synchronize: true` in production** — schema auto-sync that can drop columns and data; migrations only.
- **N+1 via lazy relations** — `await order.items` in a loop; join explicitly in one query.
- **`eager: true` everywhere** — every query dragging the whole object graph; load relations explicitly per query.
- **Mixing managers in transactions** — using the global repository inside `dataSource.transaction`; use the transactional manager.
- **Unreviewed generated migrations** — `migration:generate` producing drops on renames; read the SQL.
- **No indexes on foreign keys** — joins and filters slow on real data; declare `@Index` deliberately.
- **Business logic in subscribers** — invisible side effects on every save; keep subscribers trivial.
- **Soft-delete surprises** — unique constraints conflicting with soft-deleted rows; use partial unique indexes.
- **Returning entities from APIs** — lazy relations triggering queries during serialization; map to DTOs.
- **Connection per request** — initializing `DataSource` repeatedly; one instance per process.
- **Ignoring query logs** — performance problems invisible until production; log and review slow queries early.
- **Deeply nested `save` cascades** — `cascade: true` persisting unexpected graphs; save explicitly.
