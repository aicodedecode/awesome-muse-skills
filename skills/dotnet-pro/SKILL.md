---
name: dotnet-pro
description: .NET guidance — ASP.NET Core APIs, Entity Framework Core, DI, configuration, testing, and container deployment.
category: development
---

## Overview

.NET (formerly .NET Core) is Microsoft's cross-platform runtime for C#, F#, and VB.NET, and ASP.NET Core is its high-performance web framework. The modern stack is opinionated in the right places: built-in dependency injection, strongly-typed configuration, Entity Framework Core for data access, and first-class container support. This skill covers building .NET services idiomatically — minimal APIs vs controllers, EF Core without N+1s, and production configuration.

## When to use

- Building an API or backend service in C# on .NET 8/9+.
- Choosing between minimal APIs and controller-based ASP.NET Core.
- Taming EF Core query behavior (N+1, tracking, migrations).
- Structuring DI, configuration, and logging the .NET way.
- Containerizing and deploying .NET services.
- Adding background processing (hosted services, Hangfire, Quartz).
- Migrating .NET Framework apps to modern .NET.

## Core concepts

- **Minimal APIs vs controllers.** Minimal APIs (`app.MapGet(...)`) suit small services and microservices with less ceremony; controllers suit large APIs needing filters, versioning, and conventions. Both run on the same pipeline — pick per service size, not per trend.
- **Built-in DI container.** Services registered as Singleton/Scoped/Transient in `Program.cs`. Rules that matter: never inject a scoped service into a singleton (use `IServiceScopeFactory`), prefer constructor injection, and keep registration near composition root.
- **Configuration stack.** `appsettings.json` → `appsettings.{Environment}.json` → environment variables → secret stores. Bind to strongly-typed options classes with validation (`ValidateDataAnnotations`); secrets never live in json files committed to git.
- **EF Core.** Code-first with migrations (`dotnet ef migrations add`). Query pitfalls mirror every ORM: N+1 via lazy loading (use `.Include()` / projections with `.Select()`), change tracking overhead on read-only queries (use `.AsNoTracking()`), and client-side evaluation surprises.
- **Middleware pipeline.** `app.Use...` ordering matters: exception handling → HSTS/HTTPS → static files → routing → auth → endpoints. Write custom middleware for cross-cutting concerns (correlation IDs, request logging).
- **Logging and observability.** `ILogger<T>` with structured templates (`LogInformation("Order {OrderId} created", id)`); OpenTelemetry packages for traces/metrics; health checks via `AddHealthChecks()` wired to your orchestrator.
- **Hosted services.** `IHostedService`/`BackgroundService` for background work inside the API process (queue consumers, schedulers); for heavy or critical workloads, prefer a separate worker process or external queue.
- **Options validation.** `ValidateDataAnnotations()` + `ValidateOnStart()` fail fast on bad config at startup — much better than a null-reference at 3am.
- **Native AOT.** Compile to a single native binary with fast startup and small footprint — excellent for containers and serverless, with trimmability constraints (reflection-heavy code needs annotations).
- **Problem details.** `Results.Problem()` / `ProblemDetails` for RFC-compliant error responses; consistent shape across the API via a global exception handler.
- **Source generators.** Compile-time code generation (JSON serialization, logging, regex) with zero runtime reflection cost — prefer them over reflection in hot paths.
- **Channels.** `System.Threading.Channels` for in-process producer/consumer pipelines — the right primitive for background work without standing up external queue infrastructure.

## Practical workflow

1. **Scaffold.** `dotnet new webapi -n Shop` (or `web` for minimal API); target the latest LTS; keep the SDK version pinned with `global.json`.
2. **Structure.** Controllers/endpoints thin → application services (business logic) → repositories or direct DbContext → DTOs/records at the boundary; entities never serialized directly.
   ```csharp
   app.MapPost("/orders", async (CreateOrderRequest req, IOrderService svc) => {
       var order = await svc.PlaceOrderAsync(req);
       return Results.Created($"/orders/{order.Id}", order);
   });
   ```
3. **Configure.** Options pattern for settings; `appsettings.Production.json` for non-secret overrides; secrets via environment or Azure Key Vault / similar; validate required settings at startup so misconfiguration fails fast.
4. **Data access.** EF Core migrations in source control; `.AsNoTracking()` for reads; project to DTOs with `.Select()` instead of returning entities; index FK and filtered columns; use explicit transactions for multi-write operations.
   ```csharp
   await using var tx = await db.Database.BeginTransactionAsync();
   // ... writes via db ...
   await tx.CommitAsync();
   ```
5. **Harden the API.** Authentication (JWT bearer / OIDC), authorization policies (not just `[Authorize]` — check resource ownership), rate limiting middleware, input validation (FluentValidation or data annotations), and problem-details error responses.
6. **Test.** xUnit + WebApplicationFactory for integration tests against the real pipeline; unit-test services with mocked dependencies; Testcontainers for database-backed tests.
7. **Add background work.** `BackgroundService` for in-process workers; separate worker project for anything critical; ensure graceful shutdown via the host's lifetime events.
8. **Ship.** Multi-stage Dockerfile with the SDK image for build and the ASP.NET runtime image for run; `DOTNET_ENVIRONMENT=Production`; health check endpoints; readiness/liveness probes pointing at them.

   ```csharp
   builder.Services.AddOptions<ShopSettings>()
       .BindConfiguration("Shop")
       .ValidateDataAnnotations()
       .ValidateOnStart();

   builder.Services.AddHealthChecks()
       .AddNpgSql(builder.Configuration.GetConnectionString("Default"));
   ```

## Common pitfalls

- **Captive dependencies** — scoped `DbContext` injected into a singleton service; it silently shares one context across requests until it breaks.
- **N+1 in EF Core** — lazy-loaded navigations during serialization; `.Include()` or project with `.Select()`.
- **Tracking on read-heavy endpoints** — change tracking on thousands of entities wastes memory and CPU; `.AsNoTracking()` by default for reads.
- **Synchronous blocking on async** (`.Result` / `.Wait()`) — deadlocks under load; async all the way.
- **Secrets in appsettings.json** committed to git — use user-secrets locally and a vault in real environments.
- **No migration strategy** — `EnsureCreated()` in production instead of migrations; schema drifts and data loss follow.
- **Ignoring GC/container memory** — set `DOTNET_GCHeapHardLimitPercent` or container-aware defaults so the runtime respects cgroup limits.
- **Returning entities from endpoints** — lazy loading during serialization, circular references; project to DTOs.
- **Missing `ValidateOnStart`** — bad config discovered at first request instead of at boot; validate eagerly.
- **No request timeouts** — `HttpClient` without timeouts hanging threads; configure `HttpClientFactory` with Polly policies.
- **Not using `IHttpClientFactory`** — `new HttpClient()` per request causes socket exhaustion; register typed or named clients once.
- **Ignoring `CancellationToken`** — endpoints that can't be cancelled hold threads after clients disconnect; thread the token through to async calls.
- **Overusing `dynamic`** — kills compile-time safety and JIT performance; use records and DTOs instead.
