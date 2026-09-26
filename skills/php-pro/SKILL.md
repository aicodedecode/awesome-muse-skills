---
name: php-pro
description: Idiomatic modern PHP: Composer autoloading, strict types, OOP/domain modeling, Laravel/Symfony patterns, and testing. Use when writing, reviewing, or structuring PHP applications.
category: development
---

# PHP Pro

## Overview

Modern PHP (8.x) is a capable, typed language: **strict types, enums, readonly properties,
fibers, and attributes** plus a mature ecosystem (Composer, PHPUnit/Pest, Laravel, Symfony).
Professional PHP means using the type system seriously, following PSR standards, structuring apps
with clear domain boundaries, and treating PHP like the real engineering platform it is — not a
templating language that escaped.

The through-line: strict types in, Composer-managed deps, framework conventions respected, tests
around the domain.

## When to use

- Starting or structuring a PHP application (Composer, autoloading, framework choice).
- Writing or reviewing PHP for modern idiom and type safety.
- Designing domain models, APIs, or queue/job systems in PHP.
- Setting up testing (PHPUnit/Pest), static analysis (PHPStan/Psalm), and CI.
- Debugging Composer, autoloading, or performance issues.

## Core concepts

- **`declare(strict_types=1);` everywhere.** Without it, PHP silently coerces types and your type
  hints are suggestions. With it, they're contracts. Put the declaration in every file; enforce via
  a linter rule or code review.
- **Composer as the foundation.** PSR-4 autoloading (`src/` → namespace), locked dependencies
  (`composer.lock` committed), scripts for common tasks. Never `require` files manually in app code;
  never commit `vendor/`.
- **Modern type system.** Union types, enums (backed enums for DB/API values), readonly properties,
  constructor promotion, and match expressions. Model domain states as enums, not string constants
  scattered through the codebase.
- **Framework conventions.** Laravel: Eloquent models thin, logic in actions/services, form
  requests for validation, policies for authorization, queues for slow work. Symfony: services +
  DI, Messenger for async, validators as constraints. Fight the framework and you'll lose — learn
  its idioms.
- **Static analysis in CI.** PHPStan (level 6+; push toward 9) or Psalm catches the bugs PHP's
  runtime won't until production. Treat baseline-then-ratchet as the migration path for legacy code.
- **Testing pyramid.** Pest or PHPUnit: fast unit tests for domain logic, feature tests hitting
  HTTP endpoints with a test database (transactions rolled back per test), and a handful of
  browser tests only for critical journeys.

## Practical workflow

1. **Scaffold:** `composer init` with PSR-4 autoload, `declare(strict_types=1)` in the template,
   PHP 8.2+, PHPStan + PHP-CS-Fixer (PSR-12) from day one.
2. **Structure by domain.** `src/Order/`, `src/Payment/` — each with its models, services, and
   exceptions. Keep framework glue (controllers, commands) thin; domain logic framework-free and
   unit-testable.
3. **Type everything public.** Return types on all methods, typed properties, enums for fixed sets.
   Validate at the boundary (form requests / DTOs), trust types inside.
4. **Push slow work to queues.** Emails, webhooks, image processing, report generation — anything
   the user doesn't need synchronously goes to a queue worker with retries and dead-letter handling.
5. **Test the domain first.** Unit-test services and value objects; feature-test endpoints;
   use factories (not hand-built fixtures) for test data; refresh the test DB per test.
6. **Harden for production.** OPcache enabled with validation timestamps off in prod, realpath
   cache tuned, error reporting to a tracker (never displayed), secrets via environment, and
   `composer install --no-dev --optimize-autoloader` on deploy.

Idiomatic snippets:

```php
<?php declare(strict_types=1);

enum OrderStatus: string {
    case Pending = 'pending';
    case Paid = 'paid';
    case Shipped = 'shipped';
    case Cancelled = 'cancelled';

    public function isFinal(): bool {
        return $this === self::Shipped || $this === self::Cancelled;
    }
}

final class PlaceOrder {
    public function __construct(
        private OrderRepository $orders,
        private PaymentGateway $payments,
    ) {}

    public function handle(PlaceOrderCommand $cmd): Order {
        // domain logic here, framework-free and unit-testable
    }
}
```

## Common pitfalls

- **No strict types.** The single most impactful line in PHP. Without it, `"1abc"` becomes `1`
  silently and type hints lie.
- **Fat controllers / fat models.** Controllers doing business logic, or Eloquent models with 50
  methods and query scopes doing domain work. Extract services/actions; keep models about persistence.
- **N+1 queries.** Looping relations in Blade/API resources without eager loading. Watch query
  counts in dev (debugbar/telescope); eager-load deliberately.
- **Superglobals and globals.** `$_POST`, `$_SESSION` accessed deep in business logic — untestable
  and framework-coupled. Inject request/session abstractions.
- **No static analysis.** "It runs" is not "it's correct." PHPStan level 0 default misses most of
  the value — ratchet the level up and keep it green in CI.
- **Composer in production with dev deps.** Shipping dev tools to prod, or running
  `composer update` on the server (non-reproducible). Install from lock file, `--no-dev`, in the
  build step.
- **Error suppression and silent failures.** `@` operator and empty catch blocks hide the bugs
  you'll spend Friday night finding. Log with context; fail loudly in dev.
