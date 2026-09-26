---
name: graphql-pro
description: GraphQL API guidance — schema design, resolvers, DataLoader, pagination, auth, and production operations.
category: development
---

## Overview

GraphQL is a query language and runtime for APIs: clients ask for exactly the fields they need, and a strongly-typed schema describes everything available. That flexibility shifts complexity to the server — resolvers, batching, query cost, and depth control become your problems. This skill covers designing GraphQL APIs that stay fast and maintainable: schema-first thinking, the DataLoader pattern, and the operational guardrails production requires.

## When to use

- Designing a new GraphQL schema (types, queries, mutations).
- Fixing N+1 resolver problems or slow GraphQL endpoints.
- Choosing between GraphQL, REST, and tRPC for an API.
- Adding auth, pagination, and error handling to a GraphQL API.
- Operating GraphQL in production (query cost, depth limits, caching).
- Migrating a REST API to GraphQL incrementally.
- Generating typed clients from a schema.

## Core concepts

- **Schema-first design.** The schema is the contract: design types, queries, and mutations around client use cases, not database tables. A good schema reads like the domain; a 1:1 table mirror is a design smell.
- **Resolvers are the execution layer.** Each field resolves independently — which is why naive resolvers produce N+1 database queries. Keep resolvers thin; push data-fetching into a service/data layer.
- **DataLoader batching.** The essential GraphQL pattern: batch per-request loads by key so 100 `author` fields become one `WHERE id IN (...)` query. Nearly every production GraphQL server needs it; without it, nested queries collapse.
- **Connections pagination.** Relay-style cursor connections (`edges`, `pageInfo`, cursors) for stable pagination over changing datasets. Offset pagination breaks when rows shift; cursors don't.
- **Mutations model actions.** One mutation per business action with explicit input types and payload types (return the changed object plus errors). Mutations should be idempotent where possible and validate input before touching the DB.
- **Errors, typed.** GraphQL distinguishes request errors from field errors. Use typed error payloads (e.g., `errors: [UserError!]!` with codes) for expected failures like validation; reserve top-level errors for exceptional cases.
- **Query cost and depth limits.** Clients can craft arbitrarily expensive queries. Enforce max depth, max complexity/cost analysis, and persisted queries or an allowlist for public APIs.
- **Introspection and tooling.** Introspection powers GraphiQL/Apollo Studio and codegen. Disable or restrict it in production for public APIs; keep it for internal ones.
- **Subscriptions.** Real-time via websockets for event streams. They're the hardest part to scale (connection state, fan-out) — prefer them only where polling/SSE genuinely can't work.
- **Federation vs monolith.** A single gateway composing subgraphs (Apollo Federation) suits large orgs with team boundaries; everyone else should start with one schema and split only when team friction demands it.
- **Codegen for clients.** Generate typed hooks/clients from the schema (GraphQL Code Generator, Relay compiler) — the schema becomes end-to-end type safety, and breaking changes surface at build time.
- **Persisted queries.** Clients send a hash instead of full query text; the server allowlists known operations — kills query-abuse attacks and shrinks mobile payloads.
- **Schema registry.** Track schema versions and field usage (Apollo Studio, Hive) so deprecation decisions rest on real usage data, not guesses.

## Practical workflow

1. **Design the schema around use cases.** Sketch the queries clients actually need; name types for the domain; version by evolving (deprecate with `@deprecated`) rather than versioning the whole API.
   ```graphql
   type Query {
     order(id: ID!): Order
     orders(first: Int, after: String, filter: OrderFilter): OrderConnection!
   }
   type Mutation {
     placeOrder(input: PlaceOrderInput!): PlaceOrderPayload!
   }
   ```
2. **Implement resolvers thinly.** Resolvers call services; services hit the DB. Never put SQL/ORM calls directly in resolver functions in a real codebase.
3. **Add DataLoader from day one.** Per-request loaders for every entity fetched by key; this is not an optimization, it's correctness for nested queries.
   ```js
   // per-request loader: 100 author fields -> 1 query
   const authorLoader = new DataLoader(async (ids) => {
     const authors = await db.author.findMany({ where: { id: { in: ids } } });
     return ids.map((id) => authors.find((a) => a.id === id) ?? null);
   });
   ```
4. **Paginate with cursors.** Implement the connection spec on every list that can grow; document ordering guarantees (cursors must encode a stable sort).
5. **Shape errors.** Return typed user errors in payloads; map unexpected exceptions to generic messages with logged correlation IDs — never leak internals.
6. **Lock down the endpoint.** Max query depth (e.g., 10-15), complexity scoring, persisted queries for mobile/public clients, rate limiting by authenticated principal, and introspection off for public schemas.
   ```js
   // query complexity: assign costs, reject over budget
   const complexityRule = createComplexityRule({
     maximumComplexity: 1000,
     estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
     onCost: (cost) => logger.debug({ cost }, "query complexity"),
   });
   ```
7. **Generate clients.** Wire codegen into CI so frontend types always match the schema; treat schema changes as breaking-change reviews.
8. **Observe.** Log operation names (require them from clients), track resolver-level timings and error rates, and alert on complexity-limit rejections spiking (abuse signal).

## Common pitfalls

- **N+1 resolvers** — the classic GraphQL failure; DataLoader per entity, verified with query logging.
- **No depth/complexity limits** — a single nested query can DoS the database; set limits before exposing publicly.
- **1:1 schema-to-table mapping** — leaks DB structure and makes evolution painful; design for clients.
- **Offset pagination on live data** — duplicates/skips as rows change; use cursor connections.
- **Returning raw DB errors** — leaking schema details and SQL; map to typed errors with codes.
- **Introspection left on publicly** — hands attackers your full API map; disable for public endpoints.
- **Subscriptions for everything realtime** — operational complexity (sticky connections, fan-out) that SSE or polling would have avoided.
- **Breaking schema changes silently** — removing fields without deprecation breaks generated clients; use `@deprecated` and track field usage.
- **Anonymous operations in production** — without operation names you can't attribute cost or debug; require them.
- **Over-fetching in resolvers** — selecting entire rows when the query asked for two fields; project selections down to the data layer where it matters.
- **Field-level auth forgotten** — object-level checks passing while sensitive fields stay unguarded; authorize per field where visibility varies by viewer.
- **Caching POST-only** — GraphQL over POST defeating HTTP caches; use persisted queries with GET or a cache-aware gateway for cacheable operations.
