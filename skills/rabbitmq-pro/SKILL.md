---
name: rabbitmq-pro
description: RabbitMQ guidance — exchanges, queues, routing, acknowledgments, dead-lettering, clustering, and operations.
category: development
---

## Overview

RabbitMQ is the classic AMQP message broker: producers publish to exchanges, exchanges route to queues by binding rules, and consumers process with explicit acknowledgments. Where Kafka is a replayable log, RabbitMQ is a smart router with per-message acknowledgment — ideal for task distribution, RPC patterns, and complex routing.

Its model has more moving parts (exchanges, bindings, queues, prefetch, acks, dead-lettering), and each part has failure modes. This skill covers designing RabbitMQ topologies, consuming correctly (acks, prefetch, redelivery), and operating clusters reliably.

## When to use

- Building task queues, work distribution, or RPC over messaging.
- Choosing between RabbitMQ, Kafka, NATS, SQS, or Redis Streams.
- Designing exchanges, routing keys, and queue topologies.
- Implementing reliable consumers (acks, prefetch, redelivery, DLX).
- Setting up dead-letter exchanges and retry strategies.
- Clustering RabbitMQ for high availability.
- Debugging slow consumers, growing queues, or redelivered messages.

## Core concepts

- **Exchanges, queues, bindings.** Producers publish to exchanges; exchanges route to queues via bindings. Direct (exact routing key), topic (pattern matching), fanout (broadcast), headers (attribute matching) — pick the exchange type that matches your routing need.
- **Queues hold, consumers ack.** Messages sit in queues until consumed and acknowledged. `ack` removes, `nack`/`reject` with requeue returns to the queue, without requeue routes to the dead-letter exchange. Unacked messages block queue progress — ack deliberately.
- **Prefetch (QoS).** `basic.qos(prefetch_count)` limits unacked messages per consumer — the fairness and backpressure knob. Too high: one slow consumer hoards messages; too low: throughput suffers. Tune per workload (start ~10-50 for typical tasks).
- **Durability.** Durable exchanges/queues + persistent messages survive broker restarts — but durability is opt-in at every level (exchange, queue, message). Miss one and messages vanish on restart.
- **Dead-letter exchanges (DLX).** Rejected/expired/overflowed messages route to a DLX for inspection and retry. Every production queue needs one — otherwise poison messages either loop forever or disappear silently.
- **TTL and max length.** Per-message and per-queue TTLs expire stale work; `max-length` with overflow behavior (`reject-publish`, `drop-head`) bounds queue growth. Unbounded queues are an outage waiting for a consumer slowdown.
- **Publisher confirms.** Async acknowledgment that the broker accepted a message — the producer-side reliability guarantee. Without confirms, published messages can be lost silently.
- **Consumer acknowledgment modes.** Manual ack (control, required for reliability), auto-ack (fire-and-forget, lossy). Manual ack with careful error handling is the production default.
- **Redelivery and idempotency.** Redelivered messages (the `redelivered` flag) are normal — after crashes, requeues, and timeouts. Consumers must be idempotent; count redeliveries and dead-letter after a threshold.
- **Clustering and mirrored queues.** Classic mirrored queues (being phased out) vs quorum queues (Raft-based, the modern HA choice). Quorum queues for anything needing HA; understand their throughput characteristics.
- **Shovels and federation.** Moving messages between brokers/clusters — for multi-datacenter or migration scenarios. Adds operational complexity; prefer it over stretching one cluster across regions.
- **Management UI and HTTP API.** The management plugin exposes queues, rates, and consumer counts — your primary debugging surface. Protect it (auth, network policy) — it can also purge queues.
- **Virtual hosts.** Namespaced environments (exchanges, queues, users) within one broker — isolate teams or environments without running more brokers.
- **Delayed messaging.** No native delay; use TTL + DLX dead-lettering or the delayed-message plugin — know the tradeoffs (ordering, scale).
- **Connection vs channel.** Connections are TCP (expensive); channels are multiplexed (cheap). One connection per process, channels per thread — never a connection per message.
- **Lazy queues.** Messages stored on disk from the start — for queues that may grow large, trading latency for memory safety.

## Practical workflow

1. **Design the topology.** Name exchanges, queues, routing keys, and DLX wiring before coding. Keep routing keys hierarchical (`order.created`, `order.paid`) so topic exchanges stay flexible.
   ```
   orders.exchange (topic)
     -> orders.created -> q.orders.created -> consumer: order-service
     -> orders.*       -> q.orders.audit   -> consumer: audit-service
     DLX: orders.dlx  -> q.orders.dead     -> consumer: dlq-inspector
   ```
2. **Declare everything as code.** Durable exchanges/queues, bindings, DLX arguments — declared by the app at startup (idempotent declares), versioned in git, never hand-created in the UI for production paths.
3. **Publish with confirms.** Enable publisher confirms; persist important messages; include message IDs, timestamps, and correlation IDs in headers.
4. **Consume carefully.** Manual acks, sensible prefetch, ack after successful processing, `nack(requeue=false)` to DLX on permanent failure.
   - Structure: receive → process → ack; on transient error, retry with backoff then DLX; on permanent error, DLX immediately.
5. **Make consumers idempotent.** Track processed message IDs (or design upserts); handle the `redelivered` flag by checking before reprocessing.
6. **Bound every queue.** TTLs for stale work, max-length with defined overflow, DLX on everything — queues must not grow without limit.
7. **Use quorum queues for HA.** For clustered deployments needing durability; test failover; monitor Raft quorum health.
8. **Operate.** Monitor queue depth, consumer count, unacked counts, publish/ack rates, and node resource use; alert on growing queues (consumer death) and unacked buildup (consumer stuck).

   ```python
   ch.exchange_declare("orders.exchange", exchange_type="topic", durable=True)
   ch.queue_declare("q.orders.created", durable=True,
                    arguments={"x-dead-letter-exchange": "orders.dlx"})
   ch.queue_bind("q.orders.created", "orders.exchange", routing_key="order.created")
   ```

## Common pitfalls

- **Auto-ack in production** — messages lost when consumers crash mid-processing; manual ack always for important work.
- **No dead-letter exchange** — poison messages looping or vanishing; DLX on every queue.
- **Prefetch too high** — one slow consumer starving others; tune prefetch per workload.
- **Non-durable everything** — broker restart wiping queues and messages; durable exchanges/queues + persistent messages.
- **Forgetting publisher confirms** — published-into-the-void losses; enable confirms for critical publishes.
- **Unbounded queues** — consumer slowdown → memory exhaustion; TTL + max-length + overflow policy.
- **Non-idempotent consumers** — redeliveries causing double-processing; idempotency keys or upserts.
- **Classic mirrored queues for new HA** — deprecated path; use quorum queues.
- **Management UI exposed** — unauthenticated access to purge queues; lock it down.
- **Single connection per message** — connection churn killing throughput; long-lived connections, channels per thread.
- **Ignoring the `redelivered` flag** — treating redeliveries as new work; check before reprocessing.
- **Cross-region single cluster** — latency and partition risk; use federation/shovel instead.
- **Requeueing poison messages** — `requeue=true` on permanent failures looping forever; DLX after N attempts.
- **No consumer timeout** — stuck consumers holding unacked messages; set consumer timeouts so wedged consumers get reaped.
