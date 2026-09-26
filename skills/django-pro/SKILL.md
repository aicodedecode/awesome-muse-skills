---
name: django-pro
description: Django guidance — project structure, ORM mastery, admin, auth, async views, and production deployment.
category: development
---

## Overview

Django is Python's batteries-included web framework: ORM, admin, auth, migrations, and templating ship together with a strong opinion about project layout. That completeness is its superpower — teams move fast without assembling a stack — and its trap, when projects fight the framework instead of using it. This skill covers the Django way done well: fat models, thin views, the ORM's query behavior, and what to configure before going live.

## When to use

- Building a full-stack Python web app or admin-backed API.
- Taming N+1 queries, slow ORM queries, or migration pain.
- Structuring a growing Django project (apps, settings, services).
- Hardening Django for production (security settings, static files, DB).
- Deciding between Django, DRF, FastAPI, or Rails-style frameworks.
- Customizing the Django admin for internal tooling.
- Adding caching or async views to an existing Django app.

## Core concepts

- **MTV and the request path.** URLconf → view → template/response. Keep views thin: parse input, call domain logic, return a response. Business rules belong in models, managers, or service modules — not in views.
- **The ORM is a query builder.** QuerySets are lazy; nothing hits the DB until evaluated. Learn `select_related` (FK joins) and `prefetch_related` (M2M/reverse FK) — they eliminate the N+1 queries that sink Django apps. Use `.only()`/`.defer()` and `.values()` to slim wide tables.
- **Migrations are code.** Never edit a migration that's been applied anywhere shared; write new ones. Use `sqlmigrate` to inspect generated SQL, keep migrations small and reversible, and run them with zero-downtime patterns (add nullable column → backfill → add constraint).
- **Apps are boundaries.** Split by domain (`billing`, `users`, `orders`), not by technical layer. Each app owns its models, views, and templates. Cross-app imports signal a missing shared app or a boundary violation.
- **Settings per environment.** One `settings.py` with environment overrides beats copy-pasted files. Validate required env vars at startup (`django-environ` or similar); fail fast on missing secrets.
- **Auth and admin.** Django's auth (users, groups, permissions, sessions) plus the auto-generated admin cover most back-office needs. Customize the admin per model (list_display, list_filter, search_fields) — an unconfigured admin is both slow and dangerous.
- **Async support is partial.** Async views and ORM methods exist, but much of Django (middleware, ORM internals) still runs sync. Use async for I/O-bound views with async-compatible libraries; don't expect Node-style throughput from a sync stack.
- **Managers and QuerySets.** Custom managers (`objects = OrderManager()`) encapsulate query logic so views stay dumb; chainable QuerySet methods compose. Put "how we query X" in exactly one place.
- **Signals.** `post_save`/`m2m_changed` decouple side effects — and create invisible coupling when overused. Prefer explicit service calls; reserve signals for cross-app concerns (audit logs, cache invalidation).
- **Caching framework.** Per-view, template-fragment, and low-level caching with Redis/Memcached backends. Cache the expensive, invalidate deliberately — stale caches are a correctness bug, not a performance feature.
- **Testing tools.** Django's `TestCase` wraps each test in a transaction with fast rollback; use `SimpleTestCase` for non-DB tests. Prefer factories (factory_boy) over brittle JSON fixtures for test data.
- **Don't reimplement contrib.** Sessions, flash messages, pagination, sitemaps, humanize — check `django.contrib` before adding a dependency; it's maintained and already installed.

## Practical workflow

1. **Scaffold cleanly.** `django-admin startproject config .` (project package named `config`, not the app name), then one app per domain. Split settings: `settings/base.py`, `settings/prod.py`.
2. **Model the domain.** Write models with managers/querysets encapsulating query logic; add indexes for every filtered/ordered field (`db_index`, `Meta.indexes`); prefer `DecimalField` for money, `DateTimeField` with timezone support on.
   ```python
   class Order(models.Model):
       customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="orders")
       status = models.CharField(max_length=20, choices=Status.choices, db_index=True)
       total = models.DecimalField(max_digits=10, decimal_places=2)
       created_at = models.DateTimeField(auto_now_add=True, db_index=True)
       class Meta:
           indexes = [models.Index(fields=["customer", "-created_at"])]
   ```
3. **Build views + serializers.** For APIs use DRF or Ninja; validate input with serializers, paginate every list endpoint, and throttle public ones.
   - Use `ModelViewSet` judiciously — explicit `APIView`s are clearer for non-CRUD behavior.
4. **Audit queries.** Install django-debug-toolbar in dev; in CI, assert query counts on hot endpoints (`assertNumQueries`). Fix N+1s with `select_related`/`prefetch_related` before they ship.
5. **Harden settings for prod.** `DEBUG=False`, `ALLOWED_HOSTS` set, `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_HSTS_SECONDS`; static files via WhiteNoise or a CDN; media on object storage, never local disk.
   - Run `python manage.py check --deploy` — Django's own production checklist catches the common misses.
6. **Configure the admin.** `list_display`, `list_filter`, `search_fields`, `readonly_fields` for audit columns; override `get_queryset` with `select_related` for list pages; restrict sensitive models with custom permissions.
7. **Add caching where it pays.** Cache expensive querysets and rendered fragments; version cache keys on deploy; monitor hit rates — an unused cache is just complexity.
8. **Deploy.** Gunicorn/uvicorn workers behind a reverse proxy; run migrations as a separate deploy step (not in the web process); collect static at build time; back up the DB before migrating.

   ```python
   # settings/prod.py essentials
   DEBUG = False
   ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
   SECURE_HSTS_SECONDS = 31_536_000
   SECURE_SSL_REDIRECT = True
   SESSION_COOKIE_SECURE = CSRF_COOKIE_SECURE = True
   ```

## Common pitfalls

- **N+1 queries** from template loops and serializer nesting — the #1 Django performance bug; profile query counts, not just wall time.
- **Fat views, anemic models** — logic scattered across views becomes untestable; push it into models/managers/services.
- **Editing applied migrations** — corrupts every environment's migration state; always add a new migration.
- **`DEBUG=True` in production** — leaks tracebacks, env details, and enables the debug toolbar attack surface.
- **Naive datetimes** — set `USE_TZ=True` and store UTC; convert at the presentation edge only.
- **Unbounded querysets in admin/list views** — paginate everything; a missing paginator on a million-row table is an outage.
- **Running migrations inside web dynos** — concurrent migrates race; run once per deploy from a dedicated step.
- **Signal spaghetti** — side effects hidden in signals firing in surprising order; prefer explicit calls.
- **Unindexed foreign keys on large tables** — joins and cascading checks slow to a crawl; index FKs and filtered columns.
- **Storing uploads on local disk** — doesn't survive multi-server deploys; use object storage via django-storages.
- **Evaluating querysets repeatedly** — re-evaluating the same queryset in a loop instead of caching it in a variable; evaluate once, reuse the list.
- **Ignoring `CONN_MAX_AGE`** — opening a new DB connection per request adds latency; use persistent connections plus a pooler (PgBouncer) in production.
- **Fixture-based tests rotting** — giant JSON fixtures that break on every model change; factories express intent and survive refactors.
