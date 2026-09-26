---
name: ddd-architecture
description: Domain-Driven Design: bounded contexts, ubiquitous language, aggregates, and tactical patterns. Use when modeling complex domains or structuring domain logic.
category: development
---

# DDD Architecture

## Overview

Domain-Driven Design is **modeling software around the business domain** — building a shared
language with domain experts and letting that language shape the code. It's two things: strategic
design (bounded contexts, context mapping — where the big seams go) and tactical patterns
(aggregates, entities, value objects — how the model is built). DDD pays off in complex domains;
it's overhead in simple CRUD.

The through-line: the code should speak the business's language, and the boundaries should match
the business's reality.

## When to use

- Modeling a complex, nuanced business domain (not simple CRUD).
- Untangling a big ball of mud into bounded contexts.
- Designing aggregates, domain events, and invariants.
- Aligning software boundaries with organizational/team reality.
- Reviewing domain models for anemic or leaked abstractions.

## Core concepts

- **Ubiquitous language.** One shared, precise language used by developers *and* domain experts —
  in code, docs, and conversation. "Order," "shipment," "fulfillment" mean exactly one thing each.
  When the business uses two words, the code has two concepts; when language is sloppy, the model
  will be too.
- **Bounded contexts.** Explicit boundaries within which a model is consistent. The same word can
  mean different things in different contexts (a "product" in catalog vs in shipping) — that's
  fine *across* contexts, as long as each context is internally coherent and the translation
  between them is explicit.
- **Context mapping.** How contexts relate: shared kernel, customer/supplier, conformist,
  anti-corruption layer (ACL), separate ways. The ACL is the workhorse — a translation layer
  protecting your model from an external system's concepts leaking in.
- **Aggregates.** Consistency boundaries: a cluster of entities/value objects with one root;
  all changes go through the root; invariants hold *within* the aggregate. Keep aggregates small
  — large aggregates cause contention and complexity. One aggregate per transaction is the rule
  of thumb.
- **Entities vs value objects.** Entities have identity and lifecycle (`Order` #12345); value
  objects are defined by their attributes and immutable (`Money(100, USD)`, `Address`). Most
  domain concepts are values — reach for entities only when identity genuinely matters.
- **Domain events.** Things that happened (`OrderPlaced`, `PaymentFailed`) — the language of
  integration between aggregates and contexts. Events enable loose coupling and are the natural
  fit for eventual consistency across boundaries.

## Practical workflow

1. **Learn the domain.** Event storming with domain experts: what happens, what triggers it, what
   data's involved. Capture the language they actually use — that's your ubiquitous language seed.
2. **Find the contexts.** Look for linguistic seams (same word, different meaning), different rates
   of change, and team boundaries. Draw the context map with relationships labeled.
3. **Model one context at a time.** Inside a context: identify aggregates (consistency boundaries),
   their roots, entities vs value objects, and the invariants each aggregate protects.
4. **Protect the boundaries.** Repositories per aggregate root; ACLs at external integrations;
   domain events for cross-aggregate communication. Application services orchestrate; domain
   objects decide.
5. **Keep the domain pure.** Domain layer has no infrastructure dependencies (no ORM annotations
   in entities if you can avoid it, no HTTP clients). Infrastructure adapts to the domain, not
   vice versa.
6. **Evolve with the language.** When experts change terminology, rename the code. Language drift
   between business and code is model rot — treat renames as first-class work.

Tactical sketch:

```text
Bounded context: Ordering
  Aggregate: Order (root)
    - Entities: OrderLine (identity within order)
    - Value objects: Money, Address, OrderId
    - Invariants: total == sum(lines); can't add lines after payment
    - Domain events: OrderPlaced, OrderCancelled
  Repository: OrderRepository (per aggregate root only)
  ACL: PaymentGatewayAdapter translates gateway concepts → domain events
```

## Common pitfalls

- **DDD for CRUD.** Applying aggregates, contexts, and event storming to a simple admin panel.
  DDD's cost is justified by domain complexity — use the patterns proportionally.
- **Anemic domain models.** "Entities" that are data bags with all logic in services. The domain
  logic should live *in* the domain objects — that's the point.
- **Giant aggregates.** An `Order` aggregate containing customer, products, and shipment history
  — contention, huge transactions, and confused invariants. Small aggregates, referenced by ID.
- **Leaky contexts.** One context's concepts (or worse, its database tables) used directly by
  another. Explicit translation at boundaries — ACLs, not shared tables.
- **Ubiquitous language as documentation.** Writing a glossary nobody uses in code. The language
  lives in class/method names — if the code says `OrderManagerUtil`, the language failed.
- **Event obsession.** Publishing domain events for everything, creating distributed-monolith
  coupling through event choreography. Events for meaningful business occurrences, not every
  state change.
- **Analysis paralysis.** Modeling the perfect domain for months before shipping. Model the core
  subdomain deeply; be pragmatic elsewhere (generic subdomains can be simple CRUD).
