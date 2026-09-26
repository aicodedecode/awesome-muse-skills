---
name: express-pro
description: Express.js API guidance — routing, middleware architecture, error handling, security hardening, and production setup.
category: development
---

## Overview

Express is the minimal, unopinionated web framework for Node.js — routing plus middleware, and deliberately little else. Its power is the middleware pipeline: every request flows through a composable chain you fully control. The flip side is that Express makes no decisions for you — validation, auth, structure, and security are all yours. This skill covers building Express services that stay maintainable and safe, from middleware design to production hardening.

## When to use

- Building a REST API, webhook receiver, or lightweight service on Node.
- Structuring middleware (auth, logging, validation, error handling) correctly.
- Hardening an existing Express app (headers, rate limiting, input validation).
- Debugging middleware ordering bugs or "headers already sent" errors.
- Choosing between Express and heavier frameworks (NestJS, Fastify, Hono).
- Adding SSE or streaming responses to a Node service.
- Migrating an Express 4 app to Express 5.

## Core concepts

- **Middleware pipeline.** Requests pass through functions in registration order: `app.use(fn)`. Each middleware can end the response or call `next()`. Order is everything — auth before routes, body parsing before validation, error handler last.
- **Error middleware signature.** Only four-argument middleware `(err, req, res, next)` catches errors. Async route errors must be forwarded — wrap handlers or use a helper, otherwise rejections escape Express entirely.
- **Routers for modularity.** `express.Router()` groups routes by domain (`/users`, `/orders`). Mount them on the app; keep route files thin and push logic into services.
- **No built-in validation.** Express never validates input. Pair it with a schema library (zod, joi, ajv) at the boundary of every route — validate params, query, and body before touching business logic.
- **Template for errors.** Centralize error handling: one error middleware that logs, maps known error types to status codes, and returns a consistent JSON shape. Never leak stack traces to clients.
- **Security is opt-in.** Helmet sets sane headers; rate limiting (`express-rate-limit`) protects login/webhook endpoints; `cors` needs explicit origin configuration. Express ships none of this by default.
- **Request lifecycle control.** `res.locals` passes data down the middleware chain (authenticated user, tenant); prefer it over mutating `req` with ad-hoc properties.
- **`next('route')` and `next('router')`.** Skip remaining handlers in the current route or router — useful for conditional middleware chains, but easy to misuse; prefer explicit branching.
- **Express 5 changes.** Async errors are caught automatically, stricter path matching, and removed deprecated APIs. When migrating, test route matching carefully — some patterns behave differently.
- **Streaming responses.** `res.write()` + `res.end()` for SSE and chunked responses; remember to handle client disconnects (`req.on('close')`) so you don't keep generating for nobody.

## Practical workflow

1. **Scaffold the app.** Separate concerns from day one:
   ```
   src/
     app.js        # middleware wiring, mounts routers
     routes/       # thin route definitions
     services/     # business logic
     middleware/   # auth, validation, errors
     index.js      # listen() only
   ```
2. **Wire middleware in order.** Logging → security headers → CORS → body parsing → auth → routers → 404 → error handler:
   ```js
   app.use(helmet());
   app.use(express.json({ limit: "100kb" }));
   app.use("/api", routes);
   app.use((req, res) => res.status(404).json({ error: "not_found" }));
   app.use(errorHandler); // (err, req, res, next) — must be last
   ```
   - Keep `index.js` (listen) separate from `app.js` (the configured app) so tests can import the app without binding a port.
3. **Validate at the boundary.** Write a validation middleware factory that takes a schema and rejects bad input with 400 before the handler runs.
   ```js
   const validate = (schema) => (req, res, next) => {
     const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
     if (!result.success) return res.status(400).json({ error: "invalid_input", details: result.error.flatten() });
     req.validated = result.data;
     next();
   };
   ```
4. **Handle async errors.** Use an `asyncHandler` wrapper so thrown errors reach your error middleware:
   ```js
   const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
   ```
   - On Express 5 this is built in, but the wrapper is harmless and keeps code portable.
5. **Harden for production.** Trust proxy behind a load balancer (`app.set("trust proxy", 1)`), set body limits, add rate limits on sensitive routes, disable `x-powered-by` (helmet does this), and enforce timeouts.
   - Set `server.keepAliveTimeout` and `server.headersTimeout` appropriately when behind a load balancer to avoid idle-connection drops.
6. **Add request IDs.** Generate or propagate a correlation ID in early middleware and include it in every log line — without it, debugging concurrent requests is guesswork.
7. **Test the layers.** Supertest for route-level tests against the app object; unit-test services and validation schemas in isolation; test the error middleware with forced failures.
8. **Observe.** Add request logging with correlation IDs, expose `/health`, and track 5xx rate and p95 latency as your primary health metrics.

## Common pitfalls

- **Error handler not last, or with the wrong arity** — a three-argument function never catches errors; requests hang or crash.
- **Unhandled async rejections** in route handlers — Express 4 doesn't catch them; wrap every async handler.
- **Middleware order bugs** — auth after routes, or body parser after the route that needs `req.body`.
- **No input validation** — trusting `req.body` shape is the fastest path to injection bugs and 500s.
- **`trust proxy` misconfigured** — wrong and `req.ip` is the load balancer's; rate limiting and audit logs become useless.
- **Sync errors in middleware** thrown after `res.send()` — "headers already sent" crashes; guard or return after sending.
- **Growing a monolith in route files** — business logic in routes is untestable; extract services early.
- **CORS wide open** — `cors()` with no origin config on an API with credentials; lock origins explicitly.
- **No timeouts** — hung upstream calls holding connections forever; set server and route-level timeouts.
- **Logging bodies indiscriminately** — request logs capturing passwords or PII; scrub sensitive fields before logging.
