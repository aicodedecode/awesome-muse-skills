---
name: clean-architecture
description: Clean/hexagonal architecture: dependency rules, ports and adapters, layering, and testable boundaries. Use when structuring applications for maintainability and testability.
category: development
---

# Clean Architecture

## Overview

Clean Architecture (and its cousin Hexagonal/Ports-and-Adapters) is **a dependency discipline**:
business logic sits at the center, depending on nothing; infrastructure (databases, frameworks, UI)
sits at the edges, depending inward through abstractions. The result: domain logic testable without
databases or frameworks, and infrastructure replaceable without touching the domain.

The through-line: the Dependency Rule — source code dependencies point inward only. Frameworks are
details.

## When to use

- Structuring a new application for long-term maintainability.
- Untangling business logic from framework/database coupling.
- Making domain logic unit-testable without infrastructure.
- Reviewing layering violations in a codebase.
- Deciding where new code belongs in a layered app.

## Core concepts

- **The Dependency Rule.** Inner layers know nothing of outer layers. Domain → (nothing).
  Application → domain. Infrastructure → application + domain (implements their interfaces).
  A use case never imports a database driver; the database adapter implements the use case's
  repository interface.
- **Layers.** Entities (domain objects + business rules) → Use Cases / Application services
  (orchestrate entities toward user goals) → Interface Adapters (controllers, presenters,
  repository implementations) → Frameworks & Drivers (DB, web framework, UI). Name them per your
  stack, but keep the direction.
- **Ports and adapters.** The application defines *ports* (interfaces: `OrderRepository`,
  `PaymentGateway`); infrastructure provides *adapters* (PostgresOrderRepository,
  StripePaymentGateway). The app never names a concrete infrastructure class — only the port.
- **Dependency inversion in practice.** High-level modules define the abstractions they need;
  low-level modules implement them. Composition root (main/startup) wires concrete adapters.
  This inverts the "natural" direction where app code calls the DB directly.
- **Screaming architecture.** The top-level structure should say what the app *does* (orders,
  billing, shipping) not what it's built with (controllers, models, utils). Package by feature/
  component first, layer within.
- **Testability as a side effect.** When the domain depends on nothing, unit tests need no mocks
  of infrastructure — pure, fast, deterministic. Adapters get thin integration tests against real
  infrastructure.

## Practical workflow

1. **Identify the core domain.** What are the business rules that must survive a framework change?
   That's the center. Everything else is a detail.
2. **Define ports from the application's needs.** What does the use case need? (`findOrderById`,
   `chargeCard`) — interfaces shaped by the caller, not by the database's convenience.
3. **Write the domain + use cases first.** Pure logic, no framework imports, tested without
   infrastructure. This is the valuable 80% — build it where it's cleanest.
4. **Add adapters at the edges.** Controllers translate HTTP → use-case calls; repositories
   translate domain ↔ persistence; gateways wrap external APIs. Adapters are thin and boring.
5. **Wire at the composition root.** `main`/startup creates concrete adapters and injects them.
   Only here does the app know it's Postgres and not SQLite.
6. **Enforce the rule.** Architecture tests (dependency checkers: no `import` from domain to
   infrastructure) in CI. The rule erodes without enforcement — one convenient shortcut at a time.

Layer sketch:

```text
src/
├── domain/            # entities, value objects, domain services, domain events
│   └── order/         #   Order, Money, OrderPlaced — zero external imports
├── application/       # use cases + ports (interfaces)
│   └── order/         #   PlaceOrderUseCase, OrderRepository (port), PaymentGateway (port)
├── adapters/          # implementations of ports + delivery mechanisms
│   ├── persistence/   #   PostgresOrderRepository implements OrderRepository
│   ├── web/           #   OrderController → PlaceOrderUseCase
│   └── payment/       #   StripePaymentGateway implements PaymentGateway
└── main.ts            # composition root: wires adapters into use cases
```

## Common pitfalls

- **Interface-per-class cargo cult.** Creating `IOrderService` for every class "for clean
  architecture." Ports exist at *architectural boundaries* (app ↔ infrastructure), not between
  every two classes.
- **Anemic use cases, fat adapters.** All logic leaking into controllers or repositories while
  "use cases" just delegate. The application layer should own orchestration and business flow.
- **Leaky abstractions.** Repository interfaces shaped like the ORM (`findBySql`, lazy-loading
  entities) — the infrastructure dictating terms. Ports are designed by the application.
- **Over-layering simple apps.** Four layers + DTOs + mappers for a CRUD admin panel. Apply the
  discipline proportionally — the Dependency Rule matters most where logic is complex and
  long-lived.
- **DTO/mapper explosion.** Six near-identical types (entity, DTO, view model, …) with manual
  mappers nobody maintains. Map at boundaries where shapes genuinely differ; don't multiply types
  ritually.
- **No enforcement.** The architecture documented in a wiki, violated in the code within a month.
  Dependency-rule tests in CI or it didn't happen.
- **Framework in the domain.** ORM decorators on entities, HTTP types in use cases — the "details"
  leaking inward. Keep the center ignorant; adapt at the edges.
