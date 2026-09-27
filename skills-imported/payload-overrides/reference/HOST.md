# Host-owned migrations, seed, and plugins

## Host owns schema lifecycle

- Migrations live in the **host** app (e.g. `src/database/migrations/`), configured on the DB adapter (`migrationDir` / `prodMigrations`).
- Seed entrypoints are host-owned (`onInit` → host `seed/`). Plugins may export **seed helpers**; the host registers and runs them.
- Do not assume upstream monorepo or template migrate paths.

## Plugins vs host

| Concern | Owner |
|---------|--------|
| Collection schema from a plugin | Plugin package |
| DB migrations applying that schema | Host |
| Product/catalog seed data | Host (optionally calling plugin helpers) |
| Admin import map after plugin UI | Host (`payload generate:importmap`) |

## Adapter policy

This overrides skill is **database-agnostic**. Do not ban Mongo or require Postgres here. Product hosts may document a stricter adapter policy in their own skill.
