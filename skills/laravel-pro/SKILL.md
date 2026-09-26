---
name: laravel-pro
description: Laravel guidance — Eloquent ORM, routing, queues, Blade/Livewire, and deploying PHP apps well.
category: development
---

## Overview

Laravel is PHP's most complete framework: Eloquent ORM, Blade templating, queues, scheduling, broadcasting, and first-party packages (Sanctum, Horizon, Scout) cover the full lifecycle of a web app. Modern Laravel pairs a robust backend with Livewire/Inertia for interactivity without a separate SPA. This skill covers building Laravel apps idiomatically — Eloquent without N+1s, queue discipline, and production PHP configuration.

## When to use

- Building a PHP web app or API with Laravel.
- Eliminating N+1 queries or slow Eloquent code.
- Choosing between Blade, Livewire, and Inertia for the frontend.
- Setting up queues, scheduling, and Horizon for background work.
- Deploying PHP (opcache, workers, permissions) correctly.
- Building multi-tenant Laravel applications.
- Upgrading Laravel across major versions.

## Core concepts

- **Eloquent ORM.** Active-record models with expressive relationships. Eager load with `with()` to avoid N+1s; use query scopes for reusable filters; prefer `cursor()` over `get()` for large datasets to avoid loading everything into memory.
- **Routing and controllers.** Routes in `routes/web.php` / `routes/api.php`; keep controllers thin with form requests handling validation/authorization (`php artisan make:request`). Resource controllers map REST conventions automatically.
- **Migrations and seeders.** Version-controlled schema in `database/migrations`; always write the `down()` method; seed with factories for realistic dev data.
- **Queues and Horizon.** Database/Redis queue drivers; jobs should be idempotent, retryable, and small. Horizon (Redis) gives a dashboard, supervision, and metrics for queue workers — use it in production.
- **Task scheduling.** The scheduler (`app/Console/Kernel.php` or `routes/console.php`) replaces most cron entries: one system cron hits `schedule:run` every minute, Laravel handles the rest. Use `withoutOverlapping()` and `onOneServer()` for safety.
- **Frontend options.** Blade for server-rendered pages, Livewire for reactive components without leaving PHP, Inertia for Vue/React SPAs driven by Laravel controllers. Pick one per surface; mixing all three creates confusion.
- **Auth your way.** Breeze/Jetstream scaffolds, Sanctum for API tokens and SPA auth, Passport only when you need a full OAuth2 server.
- **Service container.** The IoC container resolves dependencies via type-hinting; bind interfaces to implementations in providers for testability. Constructor injection keeps classes honest about their dependencies.
- **Events and listeners.** Decoupled side effects (`OrderPlaced` → `SendConfirmation`, `UpdateInventory`); queue listeners for slow ones. Prefer explicit dispatch over model observers for business-critical flows.
- **Policies and Gates.** Authorization logic in policies (`OrderPolicy@update`), checked via `authorize()` or Blade `@can` — never inline `if ($user->id === ...)` checks scattered through controllers.
- **Octane.** Long-lived workers (FrankenPHP/RoadRunner/Swoole) for high-throughput Laravel — watch for state leaking between requests via singletons or static properties.
- **Telescope.** Local debug dashboard for queries, jobs, mail, and requests — invaluable in development; never enable it in production.

## Practical workflow

1. **Scaffold and configure.** `laravel new shop`; set `.env` per environment (never commit it); configure cache, session, and queue drivers for something real (redis/database, not `sync`/`file` in prod).
2. **Model the domain.** Migrations first, then models with relationships, casts, and scopes; factories + seeders for dev data.
   ```php
   class Order extends Model
   {
       protected $casts = ['total' => 'decimal:2', 'placed_at' => 'datetime'];
       public function scopePaid($query) { return $query->where('status', 'paid'); }
       public function items() { return $this->hasMany(OrderItem::class); }
   }
   ```
3. **Build the API/web layer.** Form requests for validation, API resources (`JsonResource`) to shape responses (never return raw models), policies for authorization.
   - Resources keep response shapes stable and documented; transform dates, hide internals, include relationships deliberately.
4. **Add background work.** Dispatch jobs for anything slow; monitor with Horizon; schedule recurring tasks in the scheduler instead of raw cron.
   ```php
   ProcessOrder::dispatch($order)->onQueue('orders');
   // scheduler:
   Schedule::command('invoices:send')->daily()->withoutOverlapping();
   ```
5. **Optimize PHP for prod.** Enable OPcache with timestamps off, run `config:cache`, `route:cache`, `view:cache` at deploy; set proper file permissions (storage/ bootstrap/cache writable by the web user).
6. **Test the layers.** Feature tests hitting HTTP endpoints, unit tests for services, factories for fixtures; test queued jobs with `Queue::fake()` and events with `Event::fake()` where appropriate.
7. **Cache strategically.** `Cache::remember()` for expensive queries, tagged caches for group invalidation, and route/model caching via the `*:cache` commands.
8. **Deploy.** Build assets, run migrations in the release step, restart queue workers (`queue:restart`) so they pick up new code, and warm caches.

   ```php
   class OrderResource extends JsonResource
   {
       public function toArray(Request $request): array
       {
           return [
               'id' => $this->id,
               'total' => $this->total,
               'status' => $this->status,
               'placed_at' => $this->placed_at->toIso8601String(),
               'items' => OrderItemResource::collection($this->whenLoaded('items')),
           ];
       }
   }
   ```

## Common pitfalls

- **N+1 queries** — `with()` eager loading on every relationship touched in loops/resources; watch with Laravel Debugbar or Telescope in dev.
- **`sync` queue driver in production** — jobs run inline, making requests slow and failures invisible; use redis/database.
- **Forgetting `queue:restart`** after deploys — long-lived workers keep running old code.
- **Uncached config/routes/views** — skipping the `*:cache` commands leaves significant performance on the table.
- **Mass-assignment without `$fillable`** — either a MassAssignmentException or, worse, an open fillable list letting users set `is_admin`.
- **Storing uploads on local disk** — use the `s3` (object storage) disk; local disks don't survive multi-server deploys.
- **Debug mode on in prod** (`APP_DEBUG=true`) — exposes stack traces, env vars, and DB credentials.
- **Business logic in observers** — hidden side effects firing on every save; prefer explicit events/jobs.
- **No rate limiting on API routes** — throttle sensitive endpoints; Laravel's throttle middleware is one line.
- **Env caching confusion** — `config:cache` bakes env values; changing `.env` after caching does nothing until re-cached.
- **Missing `APP_KEY`** — encrypted values become undecryptable; set it once per environment and never rotate it casually.
- **N+1 in Blade** — `$order->items` inside a `@foreach` is the same disease in a template; eager-load in the controller.
