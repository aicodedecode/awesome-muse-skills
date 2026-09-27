# Collections, access, hooks, and barrels

Upstream Payload templates often use **flat** files (`collections/Posts.ts`). Prefer **folder-per-collection** with thin barrels so access and hooks stay next to the collection they govern.

## Folder-per-collection

```text
src/collections/
├── index.ts                 # Registers collections + named exports
├── fields/                  # Shared field factories (cross-collection)
├── Users/
│   ├── index.ts             # Thin CollectionConfig (default export only)
│   ├── access/
│   │   └── index.ts         # export const access
│   ├── hooks/
│   │   ├── index.ts         # hooks, fieldHooks barrels
│   │   ├── collection/      # CollectionConfig['hooks'] when non-trivial
│   │   └── fields/          # Field['hooks'] when non-trivial
│   └── fields/              # Collection-local field groups when large
└── Posts/
    ├── index.ts
    ├── access/index.ts
    └── hooks/index.ts       # May export {} until hooks exist
```

**Rules:**

- **`collections/<Name>/index.ts`** — single `CollectionConfig`, default export; compose `access`, `hooks`, and fields via relative imports. Keep it thin.
- **`access/index.ts`** — co-located access map (`export const access`). Shared primitives live under `src/access/` (helpers, roles). Do not inline large access logic in the collection barrel.
- **`hooks/index.ts`** — co-located hooks. Split `hooks/collection/` and `hooks/fields/` when non-trivial. Empty `{}` is fine; keep the folder for a uniform shape.
- **`fields/`** — collection-local when large; shared factories in `collections/fields/`.
- **Register** host collections in `collections/index.ts`. Plugin-injected collections are not listed there.

```ts
// collections/Users/index.ts
import type { CollectionConfig } from 'payload'
import { access } from './access'
import { hooks } from './hooks'

const Users: CollectionConfig = {
  slug: 'users',
  access,
  hooks,
  fields: [/* … */],
}
export default Users
```

## Shared access module

Keep reusable access helpers in `src/access/` with clear barrels. Live collection configs wire **`./access`** (keep maps colocated with the collections that use them).

## Barrel exports

Use `index.ts` at a folder’s **public boundary** when multiple modules are imported from outside.

| Prefer | Avoid |
|--------|--------|
| `@/collections`, `@/access/roles` | Deep imports into private files from other features |
| Relative imports inside the same feature | Importing a parent barrel from inside that feature (cycles) |
| Direct `@/types` for generated types | Re-exporting generated types from a barrel |

Skip barrels for generated output, one-off private files, and graphs that would cycle.

## Plugins

OSS Payload plugins should mirror the same collection folder shape **inside the plugin package**. Hosts own migrations and product seed; plugins may export seed helpers the host calls. Keep plugins **product-agnostic**.
