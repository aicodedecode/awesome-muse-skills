---
name: redis-pro-dev
description: Redis guidance — data structures, caching patterns, pub/sub, streams, transactions, and production operations.
category: development
---

## Overview

Redis is an in-memory data-structure server that teams use as a cache, session store, rate limiter, queue, pub/sub bus, and sometimes a primary database. Its power comes from the data structures — strings, hashes, lists, sets, sorted sets, streams — each with atomic operations that let you build correct concurrent systems without a database round trip.

The failure mode is treating Redis as magic fast storage without understanding eviction, persistence, and single-threaded command execution. This skill covers using the right structure for the job, caching patterns that stay correct, and operating Redis (persistence, clustering, memory) in production.

## When to use

- Adding caching to an application (choosing structure and pattern).
- Implementing rate limiting, leaderboards, sessions, or locks.
- Choosing between Redis pub/sub, Streams, lists, or a dedicated queue.
- Designing Redis key schemas and TTL strategies.
- Operating Redis in production (persistence, replication, Cluster, Sentinel).
- Debugging memory growth, eviction, or latency spikes.
- Deciding between Redis, Memcached, or a database for a workload.

## Core concepts

- **Data structures first.** Strings (caching, counters), hashes (objects), lists (queues), sets (uniqueness), sorted sets (leaderboards, time series), streams (event logs), HyperLogLog (cardinality), bitmaps (flags). The structure determines what's atomic and efficient.
- **Commands are atomic.** Single commands (INCR, HSET, ZADD) execute atomically — use them to avoid read-modify-write races. Multi-key atomicity needs Lua scripts or transactions.
- **Caching patterns.** Cache-aside (app manages cache, most common), read-through/write-through (cache manages), write-behind (async persistence). Cache-aside with TTL is the default; choose deliberately for consistency needs.
- **TTL everything.** Keys without TTLs accumulate forever. Set expirations on cache entries, sessions, locks, and rate-limit windows — unbounded growth is the most common Redis outage.
- **Eviction policies.** `volatile-lru` / `allkeys-lru` and friends decide what dies when memory fills. Match the policy to the workload: caches evict, persistent stores must never silently lose data.
- **Persistence options.** RDB snapshots (point-in-time, compact) and AOF logs (durable, larger). For cache-only use, persistence can be off; for anything you can't rebuild, AOF with fsync policy chosen for your durability needs.
- **Pub/sub is fire-and-forget.** Messages to zero subscribers vanish; slow subscribers get disconnected. It's for ephemeral broadcast (cache invalidation, live updates), not reliable delivery — use Streams for that.
- **Streams for reliable messaging.** Append-only logs with consumer groups, acknowledgments, and pending-message tracking — a real queue built into Redis. Prefer over list-based queues for anything needing redelivery.
- **Transactions and Lua.** `MULTI`/`EXEC` for atomic multi-command batches (no rollback on error — know this); Lua scripts for atomic read-modify-write logic server-side. Keep scripts fast — they block the event loop.
- **Distributed locks.** Redlock or single-instance `SET NX PX` with fencing tokens. Locks are hard: handle expiry, clock drift, and the fact that a lock doesn't stop a paused process from acting after its lease died.
- **Cluster and Sentinel.** Cluster shards data across nodes (hash slots) for horizontal scale; Sentinel provides HA failover for single-primary setups. Cluster clients must handle MOVED/ASK redirects.
- **Single-threaded execution.** One command at a time per instance — slow commands (KEYS, unbatched SMEMBERS on huge sets) block everyone. Use SCAN, keep values small, and avoid algorithmic complexity surprises.
- **Key design.** Namespaced, predictable keys (`shop:order:123`, `ratelimit:user:456`) with TTLs; avoid huge numbers of keys with per-key overhead unaccounted — hashes can pack many fields efficiently.
- **Pipelining.** Batch round trips with pipelines for bulk operations — an order of magnitude fewer round trips for seed/load scripts.
- **Client-side caching.** Server-assisted invalidation lets clients cache with correctness — for read-heavy workloads that outgrow server round trips.
- **Redis Stack modules.** Search, JSON, time-series, and probabilistic structures extend Redis — evaluate whether you need the module or a dedicated system.

## Practical workflow

1. **Pick the structure.** Cache → strings with TTL; session → hash/string with TTL; leaderboard → sorted set; queue → stream with consumer group; rate limit → fixed window with INCR+EXPIRE or sliding window with sorted sets.
   ```
   # fixed-window rate limit: atomic, 3 commands
   INCR ratelimit:user:456
   EXPIRE ratelimit:user:456 60
   # (check count against limit in app code or Lua)
   ```
2. **Design keys and TTLs.** Namespace every key; set a TTL at write time for anything ephemeral; document the key schema so the next engineer isn't guessing.
3. **Implement cache-aside.** Read: check cache → on miss, load from DB, populate cache with TTL. Write: update DB, invalidate (or update) cache. Invalidate deliberately — stale reads are a correctness bug.
   - For thundering-herd protection on hot keys: probabilistic early refresh or a single-flight lock around recomputation.
4. **Use Streams for work queues.** `XADD` to publish, consumer groups with `XREADGROUP`, `XACK` on success; monitor pending entries and dead-letter poison messages after N retries.
   ```
   XADD jobs:email * to=user@example.com template=welcome
   XREADGROUP GROUP workers w1 COUNT 10 BLOCK 5000 STREAMS jobs:email >
   ```
5. **Script atomic multi-key logic in Lua.** Check-and-set, token buckets, and compare-and-delete unlocks belong server-side where they're atomic.
6. **Configure persistence for the data's value.** Cache-only: RDB snapshots or nothing. Durable: AOF with `appendfsync everysec`. Test restores — an untested backup is a rumor.
7. **Set up HA.** Sentinel for automatic failover (odd number of sentinels, quorum configured) or Cluster for sharding; clients configured for the topology; test failover before you need it.
8. **Monitor the right signals.** Memory usage vs maxmemory, eviction counts, hit rate, replication lag, slowlog, and blocked clients. Alert on evictions in non-cache databases and on replication lag growth.

   ```lua
   -- token bucket rate limit: atomic check-and-consume
   local tokens = tonumber(redis.call("get", KEYS[1]) or ARGV[2])
   if tokens <= 0 then return 0 end
   redis.call("set", KEYS[1], tokens - 1, "EX", ARGV[3])
   return 1
   ```

## Common pitfalls

- **No TTLs** — keys accumulating until maxmemory, then evictions or write errors; TTL everything ephemeral.
- **`KEYS *` in production** — blocks the server; use `SCAN` with a reasonable COUNT.
- **Pub/sub for reliable delivery** — messages lost with no subscribers; use Streams for anything that must not drop.
- **Huge values** — multi-MB strings blocking the event loop on read/write; keep values small, chunk large objects.
- **No persistence for durable data** — treating Redis as a database without AOF; a restart wipes everything.
- **Wrong eviction policy** — `noeviction` on a cache (write errors) or `allkeys-lru` on a persistent store (silent data loss).
- **Slow Lua scripts** — complex scripts blocking all clients; keep them O(1)-ish and fast.
- **Locks without fencing** — expired lock + still-running holder = two actors thinking they own the resource; use fencing tokens.
- **Thundering herds** — hot key expiry stampeding the DB; single-flight recomputation or probabilistic refresh.
- **Cluster key assumptions** — multi-key operations must share a hash slot (hash tags `{user:456}`); cross-slot transactions fail.
- **Unmonitored replication lag** — reading stale data from replicas unknowingly; track lag and route critical reads to primary.
- **Storing sessions without a plan** — session keys outliving their usefulness; TTL = session lifetime, always.
