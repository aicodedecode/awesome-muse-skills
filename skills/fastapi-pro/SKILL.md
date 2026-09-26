---
name: fastapi-pro
description: FastAPI guidance — typed endpoints, Pydantic validation, dependency injection, async patterns, and production deployment.
category: development
---

## Overview

FastAPI is a modern Python web framework built on Starlette and Pydantic, where type annotations double as request validation, serialization, and automatic OpenAPI documentation. Declare a Pydantic model and you get parsing, validation errors, and interactive docs for free. Its native async support makes it a strong default for I/O-bound Python APIs. This skill covers designing FastAPI services well: dependency injection, background work, database patterns, and production deployment.

## When to use

- Building a typed, documented REST API in Python.
- Designing dependency injection (DB sessions, auth, settings) the FastAPI way.
- Mixing async endpoints with sync libraries (SQLAlchemy, boto3) safely.
- Generating OpenAPI clients or serving interactive docs.
- Deploying FastAPI behind a production ASGI server.
- Adding WebSockets or SSE to a Python API.
- Structuring a large FastAPI codebase across teams.

## Core concepts

- **Types are the contract.** Annotations on path params, query params, and Pydantic request/response models produce validation and docs automatically. Use `response_model` to strip internal fields — never return ORM objects directly.
- **Dependency injection with `Depends`.** Dependencies are reusable, composable functions: `get_db()`, `get_current_user()`, settings. They can yield (setup/teardown), be cached per-request, and nested. This is the framework's extension mechanism — prefer it over globals and middleware for request-scoped needs.
- **Async done right.** `async def` endpoints run on the event loop; call async libraries with `await`. Blocking sync code (most ORMs' sync APIs, `requests`, heavy CPU work) inside `async def` endpoints stalls every request — run it in a threadpool via `anyio.to_thread` or use `def` endpoints and let FastAPI thread them.
- **Pydantic v2.** Models validate on assignment optionally, serialize fast, and support strict types, custom validators, and `computed_field`. Keep validation logic in models, not in route handlers.
- **Routers and versioning.** `APIRouter` with prefixes and tags organizes large APIs; version via URL prefix (`/v1`) from the start if the API is public.
- **BackgroundTasks vs workers.** `BackgroundTasks` run after the response is sent — fine for quick post-response work (sending an email). Anything slow, retryable, or critical belongs in a real queue (Celery, arq, Dramatiq).
- **Lifespan events.** The modern `lifespan` context manager (replacing `on_event`) handles startup/shutdown: connect pools, load models, then yield; cleanup after. One place for resource lifecycle.
- **Middleware vs dependencies.** Middleware sees every request (good for logging, CORS, request IDs); dependencies are opt-in per endpoint (good for auth, DB). Don't implement auth as middleware when only some routes need it.
- **Response classes.** `JSONResponse` default; `StreamingResponse` for large/streaming payloads; `FileResponse` for downloads — pick deliberately, and set media types explicitly.
- **OpenAPI customization.** Operation IDs, tags, and descriptions shape generated clients; callbacks and webhooks document async flows; keep the schema clean because it becomes your public contract.

## Practical workflow

1. **Scaffold the project.** Separate API, domain, and infrastructure:
   ```
   app/
     main.py        # app factory, router mounting, middleware
     api/v1/        # routers
     schemas/       # Pydantic models (request/response)
     services/      # business logic
     core/          # settings, security, dependencies
   ```
2. **Define the app factory.** Build the app in a `create_app()` function so tests can construct isolated instances; configure CORS, trusted hosts, and exception handlers there.
   ```python
   def create_app() -> FastAPI:
       app = FastAPI(title="Shop API", lifespan=lifespan)
       app.include_router(api_router, prefix="/v1")
       app.add_middleware(RequestIDMiddleware)
       return app
   ```
3. **Write typed endpoints.** Request model in, response model out, dependencies declared:
   ```python
   @router.post("/users", response_model=UserOut, status_code=201)
   def create_user(payload: UserCreate, db: Session = Depends(get_db)):
       ...
   ```
   - Keep handlers thin: validate → authorize → call service → return. No SQL in route functions.
4. **Manage DB sessions.** A `get_db` dependency that yields a session and closes it in `finally` — one session per request, committed or rolled back by the service layer, never shared across requests.
5. **Secure and observe.** JWT/OAuth2 via `fastapi.security`, rate limiting at the proxy, structured logging with request IDs, and `/health` plus `/ready` endpoints.
   - Use `HTTPBearer`/`OAuth2PasswordBearer` schemes so the OpenAPI docs show an Authorize button.
6. **Test properly.** `TestClient` (or async `httpx.AsyncClient` with ASGI transport) for endpoint tests; override dependencies (`app.dependency_overrides`) to inject test doubles for DB/auth.
7. **Handle file uploads safely.** `UploadFile` with size limits, content-type validation, and streaming to storage — never buffer multi-GB uploads in memory.
8. **Deploy.** Serve with uvicorn workers (or gunicorn + uvicorn workers) behind nginx/traefik; set worker count ≈ 2×CPU cores for sync endpoints, fewer for pure-async; configure timeouts and graceful shutdown.

## Common pitfalls

- **Blocking the event loop** — calling sync DB drivers or `time.sleep` in `async def` endpoints; profile under load to catch it.
- **Returning ORM models directly** — lazy loading triggers N+1 queries during serialization; always map to Pydantic response models.
- **Leaking DB sessions** — a `get_db` without `try/finally` close exhausts the connection pool under traffic.
- **Putting heavy work in BackgroundTasks** — they share the worker process; a slow task starves request handling. Use a queue.
- **No request size limits** — huge JSON bodies can OOM workers; set limits at the server/proxy and validate payload sizes.
- **Docs exposed in production** — `/docs` and `/openapi.json` are great in dev; restrict or disable them on public deployments if they reveal internals.
- **Mutable default arguments in dependencies** — classic Python gotcha, amplified because dependencies run per request.
- **CORS misconfiguration** — `allow_origins=["*"]` with credentials; be explicit about origins in production.
- **Ignoring `response_model_exclude_unset`** — PATCH endpoints overwriting fields with defaults; use `exclude_unset` for partial updates.
- **No timeout on outgoing calls** — `httpx` without timeouts hanging workers; set timeouts on every external call.
- **Sync `TestClient` hiding async bugs** — portal-based TestClient can mask event-loop issues; test async paths with a real ASGI transport too.
- **Over-eager `response_model` nesting** — deeply nested response models with N+1-prone computed fields; profile serialization on list endpoints.
- **Forgetting `dependencies=[...]` on routers** — auth applied per-endpoint instead of once on the router; include shared deps at `include_router` time.
