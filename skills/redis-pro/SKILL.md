---
name: redis-pro
description: Redis data structures, caching strategies, and production operations — use when adding caching, queues, or rate limiting with Redis.
category: database
---

## Overview

Redis is an in-memory data structure server: strings, hashes, lists, sets, sorted
sets, streams, and more — each with atomic operations that make it far more than
"a cache". This skill covers choosing the right structure, cache patterns,
persistence trade-offs, and running Redis reliably.

## When to use

- Designing a cache layer (cache-aside, write-through, TTLs)
- Building rate limiters, leaderboards, queues, or pub/sub with Redis
- Choosing persistence (RDB snapshots vs AOF) and eviction policies
- Debugging memory growth, latency spikes, or key-space problems
- Using Redis Streams, probabilistic structures (HyperLogLog, Bloom), or Lua scripts

## Core concepts

**Pick the structure for the operation.** Counters → `INCR` on strings. Objects
with field access → hashes (`HGET`/`HSET`) to avoid serializing whole blobs.
Leaderboards → sorted sets (`ZADD`/`ZRANGE` with scores). Queues → lists
(`LPUSH`/`BRPOP`) or Streams for durable consumer groups. Time-series-ish
expiring data → keys with TTL. The wrong structure turns O(1) ops into O(N).

**Cache invalidation is the hard part.** Cache-aside (read-through on miss, write
around or through on update) is the default. Set explicit TTLs even when you
invalidate on write — TTLs are your safety net against stale data when
invalidation fails. For thundering-herd protection on hot keys, use request
coalescing or short stale-while-revalidate windows.

**Single-threaded means slow commands hurt everyone.** `KEYS *`, `SMEMBERS` on
huge sets, and `SORT` without `STORE` block the event loop. Use `SCAN` with
`COUNT` for iteration, and keep Lua scripts short — they execute atomically and
block everything while running.

**Persistence is a spectrum.** RDB snapshots are compact and fast to restore but
lose recent writes on crash. AOF logs every write (durable, larger, slower
rewrites). Many cache-only deployments disable persistence entirely and treat
Redis as ephemeral — a valid choice if the source of truth is elsewhere.

**Eviction policies.** `noeviction` (error on full — for non-cache uses),
`allkeys-lru` / `volatile-lru` (classic cache behavior), `allkeys-lfu`. Match the
policy to the workload; the wrong one evicts hot keys or errors under load.

## Practical workflow

1. **Define the access pattern** (read/write ratio, key lifetime, consistency
   needs) before choosing structures or TTLs.
2. **Namespace keys** (`service:entity:id`) and keep values small — huge values
   waste memory and network; consider hashes or splitting.
3. **Set TTLs everywhere** for cache data; monitor `expired_keys` and
   `evicted_keys` in `INFO stats` to confirm expiry behaves as expected.
4. **Load-test the slow path:** benchmark `SCAN` iterations, Lua scripts, and
   large `ZRANGE` calls under realistic data sizes.
5. **Monitor memory:** `INFO memory` (used vs peak, fragmentation ratio),
   `MEMORY USAGE <key>` for suspicious keys, and `--bigkeys` sampling to find
   offenders.
6. **Plan failover:** Redis Sentinel or Cluster for HA; test failover before you
   need it; decide whether clients tolerate brief write loss during failover.

## Common pitfalls

- **No TTL on cache keys** — memory grows forever until eviction or OOM; always
  bound key lifetime.
- **Storing sessions or critical data in Redis with no persistence and no
  fallback** — a restart wipes everything; know what "ephemeral" costs you.
- **Hot keys on Cluster** — one extremely hot key lands on one shard; mitigate
  with local client-side caching or key sharding (`key:{shard}:...`).
- **Blocking commands in request paths** (`BLPOP` with long timeouts,
  `SUBSCRIBE` in a web worker) — tie up connections; use dedicated connections
  for blocking/pub-sub use.
- **Lua scripts that loop over unbounded data** — atomicity means the whole
  server waits; bound the work or move it client-side.
- **Assuming `DEL`/`EXPIRE` are instant on huge values** — in older versions
  deleting multi-MB values blocks; use `UNLINK` (non-blocking delete) for large
  keys.
