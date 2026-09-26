---
name: nodejs-pro
description: Production-grade Node.js guidance — event loop, modules, tooling, debugging, and deployment best practices.
category: development
---

## Overview

Node.js is a server-side JavaScript runtime built on the V8 engine. Its non-blocking, single-threaded event loop makes it strong for I/O-heavy workloads — APIs, proxies, realtime services, and CLIs. This skill covers how to write, debug, and ship Node.js applications that behave well under load, with attention to the sharp edges (module systems, versioning, native addons, memory) that cause real production incidents.

## When to use

- Building an API, backend service, CLI, or realtime app on Node.js.
- Debugging event-loop lag, memory leaks, or unexplained latency.
- Choosing between ESM and CommonJS, npm/pnpm/yarn, or version managers.
- Preparing a Node service for production (logging, signals, health checks).
- Migrating an older Node codebase or upgrading major versions.
- Diagnosing high memory usage or garbage-collection pauses in a running service.
- Deciding how to scale a Node service (clustering, workers, or horizontal replicas).

## Core concepts

- **Event loop, not threads.** JavaScript runs on one thread; async I/O is handled off-thread by libuv. Never block the loop with synchronous CPU work — offload to worker threads, child processes, or a queue. A blocked loop = rising latency for every request.
- **Module systems.** ESM (`import`/`export`) is the modern standard; CommonJS (`require`) is legacy but still widespread. A package can't cleanly mix both. Set `"type": "module"` in package.json for ESM-first projects, and check dependencies' formats before upgrading.
- **LTS and version management.** Node releases twice a year; only even-numbered lines become LTS. Pin your runtime with a version manager (nvm, fnm, or volta) plus an `.nvmrc` / `volta` block in package.json. Never run production on an odd-numbered or EOL release.
- **Streams and backpressure.** Streams (`fs.createReadStream`, HTTP bodies) move large data without buffering it all in memory. Respect backpressure — if a writable's `write()` returns false, pause until `drain`. Ignoring it is the classic way to OOM a service.
- **Worker threads vs child processes.** Worker threads share memory and suit CPU-bound JS work (crypto, parsing, image transforms). Child processes suit isolated or non-JS work. For most cases, prefer a job queue (BullMQ, SQS) over in-process scaling.
- **Error surfaces.** Unhandled promise rejections and uncaught exceptions crash modern Node by default — which is correct behavior. Log, alert, and let the process manager restart. Swallowing them guarantees corrupted state.
- **Native addons and N-API.** Compiled addons tie you to an ABI; prefer pure-JS or prebuilt binaries. When rebuilding is needed, know your build tools (node-gyp, prebuildify) and test on the exact target image.
- **The `diagnostics_channel` and AsyncLocalStorage.** `async_hooks`-based context propagation lets you carry request IDs through async boundaries without passing them manually — the foundation of correlated logging and tracing.
- **Cluster module.** One process per CPU core behind a shared port, with the OS or Node distributing connections. Useful for single-machine scaling, but a container orchestrator running one process per container is usually simpler and more robust.
- **Memory model.** V8 heap (JS objects) vs external memory (Buffers, native). `--max-old-space-size` caps the heap; large Buffers live outside it. Monitor both — a leak in either kills the process.

## Practical workflow

1. **Set up the runtime.** Install an LTS version via a manager:
   ```bash
   fnm install --lts && fnm use lts-latest   # or: nvm install --lts
   node --version && npm --version
   echo "lts/*" > .nvmrc
   ```
2. **Scaffold with sane defaults.** Use ESM (`"type": "module"`), strict linting, and a lockfile committed to git:
   ```bash
   npm init -y && npm pkg set type=module
   npm install -D eslint prettier
   ```
   - Choose one package manager per repo (npm, pnpm, or yarn) and enforce it — mixed lockfiles cause phantom dependency bugs.
   - Enable `engines` in package.json so installs fail fast on the wrong Node version.
3. **Structure the app.** Keep a single entry point (`src/index.js`), separate route handlers from business logic, centralize configuration via validated environment variables, and keep one shared logger (pino or similar) used everywhere.
   - Validate env at startup and crash with a clear message on missing/invalid values — don't discover it on the first request.
4. **Handle shutdown.** Listen for `SIGTERM`/`SIGINT`, stop accepting connections, drain in-flight requests, then exit:
   ```js
   process.on("SIGTERM", async () => {
     server.close();
     await db.disconnect();
     process.exit(0);
   });
   ```
   - Give the orchestrator a matching `terminationGracePeriodSeconds` so it doesn't SIGKILL mid-drain.
5. **Debug performance.** Profile before guessing: `node --inspect` for DevTools, `--cpu-prof` for flame graphs, `--heap-prof` for memory. Watch `process.memoryUsage()` and event-loop delay (`perf_hooks.monitorEventLoopDelay`) as production health signals.
   - Take heap snapshots before and after load to distinguish leaks from normal growth.
6. **Load-test realistically.** Use autocannon/k6 against staging with production-like payloads; watch event-loop lag and GC pauses under sustained load, not just throughput.
7. **Harden the process.** Global handlers that log and exit:
   ```js
   process.on("unhandledRejection", (err) => { logger.fatal({ err }, "unhandled rejection"); process.exit(1); });
   process.on("uncaughtException", (err) => { logger.fatal({ err }, "uncaught exception"); process.exit(1); });
   ```
8. **Ship it.** Run with a process manager or container orchestrator that restarts on crash, set memory limits (`--max-old-space-size`), expose a `/health` endpoint, and never log secrets.
   - Ship with `--enable-source-maps` if you transpile, so production stack traces are readable.

## Common pitfalls

- **Blocking the event loop** with `JSON.parse` of huge payloads, regex on untrusted input, or sync crypto — measure first, offload to workers.
- **Unhandled promise rejections** silently killing workers in older versions or crashing without useful context — add a global handler that logs with stack + request id.
- **Mixed ESM/CJS** causing `ERR_REQUIRE_ESM` or dual-package hazards — audit with `node --check` and lock the dependency tree.
- **Forgetting to pin versions** — `"^x.y"` ranges plus a missing lockfile = non-reproducible builds and surprise breakages.
- **Logging without correlation IDs** — in async code, attach a request id (AsyncLocalStorage) or traces are unusable.
- **Leaking timers/listeners** — intervals and event subscriptions that are never cleared grow memory until the process dies.
- **Running dev-only flags in prod** (`--inspect`, watch mode) or shipping `node_modules` with devDependencies bloating images.
- **No graceful shutdown** — deploys SIGKILL in-flight requests; handle SIGTERM and drain.
- **Trusting `NODE_ENV` to be set** — default it explicitly in your entry point; libraries change behavior based on it.
- **Ignoring DNS caching behavior** — Node's default DNS lookup can surprise under load balancers; understand `verbatim`/`dns.setDefaultResultOrder` for your topology.
