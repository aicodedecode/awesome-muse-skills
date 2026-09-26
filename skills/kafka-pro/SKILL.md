---
name: kafka-pro
description: Apache Kafka guidance — topics, partitions, consumer groups, exactly-once semantics, schema registry, and operations.
category: development
---

## Overview

Kafka is a distributed event-streaming platform: producers append immutable events to partitioned topics, consumers read them at their own pace, and the log retains history for replay. It's the backbone of event-driven architectures — but it's infrastructure with real operational weight, not a library you drop in.

Using Kafka well means thinking in events and partitions: partition keys determine ordering and parallelism, consumer groups determine scale, and retention determines what "replay" actually means. This skill covers designing topics, building correct consumers and producers, and operating Kafka without 3am pages.

## When to use

- Designing event-driven architecture (topics, events, partitioning).
- Choosing between Kafka, RabbitMQ, NATS, Pulsar, or a queue.
- Building producers (idempotency, partitioning, batching).
- Building consumers (groups, rebalancing, offset management).
- Implementing exactly-once semantics (transactions, idempotent consumers).
- Setting up Schema Registry and evolving event schemas.
- Operating Kafka (brokers, KRaft, replication, monitoring).

## Core concepts

- **Topics, partitions, offsets.** A topic is a partitioned append-only log; each partition is ordered and consumed via offsets. Partition count sets your max consumer parallelism — choose it deliberately, because increasing it later reshuffles keys.
- **Partition keys and ordering.** Events with the same key land in the same partition, preserving order per key. Key by the entity the ordering matters for (order ID, user ID) — never by timestamp or round-robin if order matters.
- **Consumer groups.** Each group gets every message once (across its members); partitions divide among members. Adding consumers only helps up to the partition count — beyond that they idle.
- **Offset management.** Committing offsets marks progress. Auto-commit is convenient and lossy; manual commit after processing gives control. The eternal tradeoff: commit before processing (risk reprocessing) vs after (risk loss on crash) — design consumers idempotent and the choice matters less.
- **Rebalancing.** When consumers join/leave, partitions reassign — during which consumption pauses. Static membership and cooperative rebalancing reduce the pain; oversized session timeouts hide dead consumers.
- **Retention.** Time/size-based log retention defines your replay window. Infinite retention turns Kafka into event sourcing storage (with cost); short retention makes it a transport. Decide per topic.
- **Producer durability.** `acks=all`, `enable.idempotence=true`, retries with backoff — the safe producer config. Batching (`linger.ms`, `batch.size`) trades latency for throughput; tune per topic.
- **Exactly-once semantics.** Idempotent producer + transactions + `read_committed` consumers give EOS within Kafka; end-to-end EOS needs idempotent downstream writes too. Most systems need effectively-once (idempotent consumers), not true EOS.
- **Schema Registry.** Avro/Protobuf/JSON Schema with compatibility rules (backward/forward/full) — schema evolution without breaking consumers. Version your events like APIs.
- **Compaction.** Log-compacted topics retain only the latest value per key — the pattern for changelog-style topics (current state per entity) and for rebuilding materialized views.
- **KRaft.** Modern Kafka runs without ZooKeeper (KRaft mode) — simpler operations, but migration and version compatibility need planning.
- **Dead-letter topics.** Poison messages that fail repeatedly go to a DLQ topic for inspection, not back into the retry loop forever.
- **Kafka Streams / ksqlDB.** Stream processing on top of the log — aggregations, joins, windowing — without a separate processing cluster for moderate workloads.
- **Replication and ISR.** `replication.factor` and `min.insync.replicas` define durability; losing ISR members risks unavailability or (if misconfigured) data loss.
- **Tiered storage.** Offload old segments to object storage — long retention windows without paying broker-disk prices.
- **REST proxy for non-JVM clients.** Exposing Kafka over HTTP for languages without good clients adds latency and ops surface; choose deliberately, not by default.

## Practical workflow

1. **Design topics and keys.** One topic per event type (or per entity changelog); key by the entity needing ordering; set partition counts for expected throughput × consumer parallelism.
   ```
   orders.events      partitions=12  key=order_id   retention=30d
   inventory.changes  partitions=6   key=sku        retention=7d (compacted)
   ```
2. **Version events with a schema registry.** Register Avro/Protobuf schemas; enforce BACKWARD compatibility in CI; never change a field's meaning — add new fields.
3. **Configure safe producers.** `acks=all`, idempotence on, retries with backoff, appropriate batching; include correlation IDs and event metadata (type, version, timestamp) in every event.
4. **Build idempotent consumers.** Design handlers so reprocessing is safe (upserts, idempotency keys); commit offsets after successful processing; handle rebalances gracefully (finish in-flight work or make it resumable).
   - Prefer manual offset commit; auto-commit only for truly loss-tolerant workloads.
5. **Handle failures explicitly.** Retry transient errors with backoff; after N failures, publish to a dead-letter topic with headers (original topic, error, attempts); alert on DLQ growth.
6. **Set retention deliberately.** Hot topics short, audit topics long; compacted topics for state; monitor disk usage per topic — retention misconfigurations fill disks.
7. **Secure the cluster.** TLS, SASL/SCRAM or mTLS auth, ACLs per principal (topics, groups, transactional IDs); no anonymous access in any shared environment.
8. **Operate.** Monitor consumer lag (the golden signal), under-replicated partitions, ISR shrinks, broker disk, and request latencies; run partition-reassignment and upgrades with rolling procedures.

   ```properties
   # safe consumer essentials
   enable.auto.commit=false
   isolation.level=read_committed
   max.poll.interval.ms=300000
   session.timeout.ms=45000
   ```

## Common pitfalls

- **Wrong partition key** — no ordering where it matters, or hot partitions from skewed keys; key by the ordering entity.
- **Auto-commit with non-idempotent consumers** — crashes cause loss or duplicates; manual commits + idempotent handlers.
- **Too few partitions** — consumer parallelism capped; size partitions for peak, since growing later reshuffles.
- **Unbounded consumer lag ignored** — lag growing silently until data is stale; alert on it as the primary health signal.
- **Poison messages looping forever** — no DLQ; one bad message blocking a partition indefinitely.
- **Schema changes breaking consumers** — incompatible evolution without registry enforcement; CI-check compatibility.
- **`acks=1` for critical data** — leader-only acknowledgment losing data on failover; `acks=all` + `min.insync.replicas=2`.
- **Rebalance storms** — short timeouts + slow processing = constant rebalancing; tune session timeouts and use cooperative protocol.
- **Retention filling disks** — topics growing unbounded; set retention per topic and monitor disk.
- **Non-idempotent producers** — retries duplicating events; enable idempotence.
- **Reading uncommitted data** — consumers seeing aborted transactions; use `isolation.level=read_committed` with transactional producers.
- **ZooKeeper-era configs on KRaft** — stale operational knowledge; verify every setting against your Kafka version.
- **One topic for everything** — unrelated events sharing partitions and retention; one topic per event type.
- **Not testing broker loss** — assuming replication works; chaos-test broker kills before production does it for you.
