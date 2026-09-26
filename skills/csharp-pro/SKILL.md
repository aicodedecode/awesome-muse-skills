---
name: csharp-pro
description: Idiomatic modern C#: nullable reference types, records, async/await, LINQ, and .NET project structure. Use when writing, reviewing, or structuring C# applications.
category: development
---

# C# Pro

## Overview

Modern C# (10–13) with .NET is a **high-productivity, high-performance platform**: nullable
reference types bring compile-time null safety, records simplify immutable data, async/await is
first-class, and minimal APIs plus strong tooling make everything from CLIs to cloud services
pleasant. Professional C# means enabling the safety features, modeling with the modern type
toolbox, writing async correctly, and using LINQ as a query language — not a cleverness contest.

The through-line: turn on every safety feature, model precisely, and let the runtime's maturity
do the heavy lifting.

## When to use

- Writing or reviewing C# for modern idiom (.NET 6+).
- Structuring .NET solutions (projects, layering, DI).
- Designing async code, data models, or APIs.
- Enabling nullable reference types or modernizing legacy C#.
- Setting up testing (xUnit/NUnit), analyzers, and CI.

## Core concepts

- **Nullable reference types ON.** `<Nullable>enable</Nullable>` — nullability becomes part of the
  type system (`string` vs `string?`). The migration is the value: every warning fixed is a
  potential NullReferenceException eliminated. Treat warnings as errors in CI for new code.
- **Records for immutable data.** `record` / `record struct` for DTOs, messages, value objects —
  value equality and non-destructive mutation (`with`) built in. Classes for behavior + identity,
  structs for small hot-path values.
- **Async all the way.** `async`/`await` end-to-end; never `.Result`/`.Wait()` (deadlocks under
  synchronization contexts); `ConfigureAwait(false)` in libraries; `ValueTask` for hot paths where
  the result is often already available. `IAsyncEnumerable<T>` for async streams.
- **LINQ as a query language.** Declarative transforms (`Where`/`Select`/`GroupBy`) over data —
  but materialize deliberately (`ToList()` when multiple enumeration would re-run queries or
  re-hit the DB), and watch for N+1 in EF Core (eager load with `Include`, project with `Select`).
- **Dependency injection as the composition model.** Constructor injection, explicit lifetimes
  (transient/scoped/singleton — and know why scoped services can't live in singletons), and
  `IOptions<T>` for configuration. The container is not a service locator.
- **Pattern matching + switch expressions.** Exhaustive, expression-based control flow over
  `if/else` chains. Combined with records and discriminated-union-style hierarchies, it brings
  much of the functional modeling power to C#.

## Practical workflow

1. **Scaffold the solution.** `dotnet new sln`; projects per boundary (`Api`, `Application`,
   `Domain`, `Infrastructure`); nullable + ImplicitUsings + latest LangVersion enabled;
   `.editorconfig` for style; TreatWarningsAsErrors for new projects.
2. **Model the domain.** Records for data, small focused classes for behavior, exceptions for
   exceptional cases (custom domain exceptions with context), validation at boundaries.
3. **Write async services.** Inject dependencies via constructor; `CancellationToken` parameters
   on async methods (and honor them); avoid `async void` (only event handlers).
4. **Data access with EF Core deliberately.** DbContext per unit of work (scoped), compiled or
   split queries for hot paths, migrations in source control, database constraints backing up
   application validation.
5. **Test in layers.** xUnit + FluentAssertions + NSubstitute/Moq for unit tests; WebApplicationFactory
   for API integration tests with a real test database (Testcontainers); a few end-to-end tests
   for critical journeys.
6. **Analyzers in CI.** `dotnet build -warnaserror`, Roslyn analyzers (Microsoft defaults +
   curated ruleset), and format enforcement (`dotnet format --verify-no-changes`).

Idiomatic snippets:

```csharp
// Record + pattern matching + nullable enabled
public abstract record PaymentResult;
public sealed record PaymentOk(string TransactionId) : PaymentResult;
public sealed record PaymentFailed(string Reason) : PaymentResult;

string Describe(PaymentResult r) => r switch {
    PaymentOk(var id)      => $"Paid: {id}",
    PaymentFailed(var why) => $"Failed: {why}",
    _ => throw new UnreachableException(),
};

// Async with cancellation, no .Result in sight
public async Task<Order> PlaceAsync(PlaceOrder cmd, CancellationToken ct = default) {
    await using var tx = await _db.Database.BeginTransactionAsync(ct);
    // ...
}
```

## Common pitfalls

- **Nullable disabled or warning-suppressed.** `#nullable disable` or `!` sprinkled to silence
  the compiler reintroduces the billion-dollar mistake. Fix the nullability model instead.
- **`.Result` / `.Wait()` deadlocks.** Blocking on async code, especially in ASP.NET (classic) or
  UI contexts. Async all the way down; it's viral by design.
- **Captive dependencies.** Singleton holding a scoped service (like DbContext) — works until it
  spectacularly doesn't. Respect lifetime boundaries; the container validates scopes in dev — listen.
- **LINQ multiple enumeration.** Passing `IEnumerable<T>` around and enumerating it three times,
  re-running a DB query each time. Materialize once when the source is expensive.
- **EF Core N+1 and client evaluation.** Lazy-loading loops and untranslatable LINQ silently
  dragging tables into memory. Profile queries; `Include`/projection deliberately.
- **God Startup / god Program.cs.** Hundreds of service registrations with no organization.
  Extension methods per area (`AddOrderServices()`), and keep composition readable.
- **Exceptions for control flow.** Throwing for expected outcomes (validation failures, "not found"
  in normal operation). Use result types or return values for expected cases; exceptions for the
  exceptional.
