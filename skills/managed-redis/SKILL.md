---
name: managed-redis
description: Using managed Redis on PaaS platforms — caching, eviction, persistence, and sizing — vendor-neutral patterns.
category: railway
---

## Overview

Managed Redis on a PaaS gives you an in-memory data store without operating
it: the platform handles patching, failover, and backups. Your job shifts to
using it correctly — data structures, TTLs, eviction, and sizing — within the
provider's constraints (memory caps, persistence options, connection limits).
This skill covers the patterns.

## When to use

- Adding a cache, session store, queue, or rate limiter backed by managed Redis
- Choosing eviction policies and TTL strategies
- Sizing a Redis instance (memory, connections, throughput)
- Understanding persistence and backup behavior on managed Redis
- Debugging memory growth or eviction storms

## Core concepts

**Redis is memory-first; size for the working set.** Provision memory for
your hot data plus overhead (Redis internals, replication buffers, fork
for persistence). Monitor `used_memory` vs `maxmemory` — hitting the cap
triggers eviction (or errors with `noeviction`). Size with 30–50% headroom.

**Eviction policy = data contract.** `allkeys-lru`/`volatile-lru` for caches
(evict least-recently-used), `noeviction` for queues/sessions where losing
data is unacceptable (writes then error instead — monitor for it). Set the
policy deliberately per use case; the default may not match yours.

**TTL everything cache-like.** Keys without TTLs grow until eviction or OOM.
Set expirations even when you also invalidate on write — TTLs are the safety
net for missed invalidations. Monitor `expired_keys` vs `evicted_keys` to
see whether expiry or memory pressure dominates.

**Persistence on managed Redis varies.** Some providers snapshot (RDB)
periodically, some offer AOF, some are memory-only with optional backups.
Know your provider's durability story: what survives a restart, a failover,
a region issue — and whether "cache" data is allowed to vanish (design for
it if so).

**Connections and commands.** Managed instances limit connections and may
restrict dangerous commands (`FLUSHALL`, `KEYS`, `CONFIG`, Lua scripting
limits). Use `SCAN` not `KEYS`, keep Lua scripts short, and pool client
connections.

## Practical workflow

1. **Define the use case** (cache / sessions / queue / leaderboard /
   rate-limit) — it determines structures, TTLs, eviction, and durability
   needs.
2. **Namespace keys** (`app:entity:id`) and keep values small; prefer hashes
   over serialized blobs for field-level access.
3. **Set TTLs and eviction policy** per the use case; verify with
   `INFO stats` that expiry behaves as expected under load.
4. **Size and monitor:** memory usage trending, hit rate
   (`keyspace_hits`/`keyspace_misses`), evictions, and slow-log entries —
   alert on memory > 80% and sustained evictions.
5. **Plan for loss:** ensure the app cold-starts correctly with an empty
   cache (thundering-herd protection on hot keys), and sessions have a
   re-login path if the store is ephemeral.
6. **Secure it:** private networking (never public internet), strong auth
   token, TLS where offered; rotate credentials via the platform's rotation
   flow.

## Common pitfalls

- **No TTLs** — memory grows until eviction storms or OOM; bound every
  cache key's lifetime.
- **Using Redis as the system of record** on a memory-only plan — a restart
  wipes it; know your durability guarantees.
- **Hot keys** — one key absorbing most traffic bottlenecks a single
  thread; shard hot keys or add client-side caching.
- **Big values** (multi-MB blobs) — waste memory and block on transfer;
  chunk large objects or use object storage with Redis as an index.
- **`KEYS *` in production** — blocks the server; always `SCAN`.
- **Ignoring hit rate** — a cache with 20% hit rate is decoration; measure
  and tune TTLs, key design, and invalidation until it earns its keep.
