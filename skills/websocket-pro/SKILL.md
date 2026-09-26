---
name: websocket-pro
description: WebSocket guidance — connection lifecycle, scaling with pub/sub, auth, heartbeats, and fallbacks.
category: development
---

## Overview

WebSockets give you full-duplex, low-latency messaging over a single long-lived connection — the foundation of chat, live dashboards, collaborative editing, and realtime games. The protocol is simple; operating it is not: connection state, horizontal scaling, reconnection, and backpressure are where projects fail. This skill covers building realtime features on WebSockets that survive production, including when to choose SSE or polling instead.

## When to use

- Adding realtime features (chat, notifications, live updates, collaboration).
- Scaling WebSocket servers horizontally.
- Designing reconnection and message-delivery semantics.
- Choosing between WebSockets, SSE, long-polling, and WebRTC data channels.
- Authenticating and authorizing persistent connections.
- Debugging dropped connections, memory leaks, and thundering herds.

## Core concepts

- **The lifecycle.** HTTP upgrade handshake → open connection → message frames → close frame. Handle all of it: handshake validation, orderly close codes, and cleanup on abnormal disconnect — leaked connection state is the #1 production bug.
- **Stateful servers don't scale naively.** A connection lives on one server instance. To broadcast across instances you need a pub/sub backplane (Redis, NATS, Kafka): publish events centrally, each server forwards to its local connections.
- **Sticky sessions are a crutch.** Some setups pin connections to instances; it complicates deploys and failover. Prefer a stateless design: connection → server is arbitrary, routing via the pub/sub layer, session state in shared storage.
- **Heartbeats.** NATs and proxies silently kill idle connections. Ping/pong (or application-level heartbeats) every ~25-30s, with server-side timeouts that reap dead connections — otherwise you accumulate ghosts.
- **Reconnection strategy.** Clients must reconnect with exponential backoff + jitter, resume from the last received message ID/cursor, and handle missed messages via a catch-up fetch. Design the protocol for resume from the start.
- **Delivery semantics.** At-most-once is the default; at-least-once needs message IDs + dedup; exactly-once is a lie over networks — design idempotent handlers instead.
- **Backpressure.** Slow consumers must not OOM the server: bounded per-connection queues, dropping or sampling policies for high-frequency streams (ticker data), and disconnecting pathological clients.
- **Auth at handshake.** Authenticate during the HTTP upgrade (headers/cookies/tokens in query as fallback) — there's no per-message auth later unless you build it. Re-validate on a schedule for long-lived connections (token expiry).
- **Message protocol.** Define a small envelope: `{ type, id, payload }` with versioned message types. JSON for simplicity, binary (MessagePack/protobuf) when throughput demands it. Document every message type like an API.
- **SSE as an alternative.** Server-Sent Events give server→client streaming over plain HTTP with automatic reconnection and no special proxy config. If you don't need client→server messages on the same channel, SSE is simpler and more robust.
- **Horizontal deploy strategy.** Drain connections on shutdown (send close, wait, then terminate); rolling deploys must not drop all clients at once — clients reconnect with jitter to avoid thundering herds.
- **Connection draining.** On shutdown: stop accepting new connections, send close frames to existing ones, wait out the grace period, then exit — clients land on healthy instances.
- **Fan-out patterns.** Broadcast (all), multicast (channel subscribers), unicast (single user) — design channel naming (`user:{id}`, `room:{id}`) up front; ad-hoc routing becomes unmaintainable.
- **Message ordering.** Within one connection order is guaranteed; across reconnects or backplane hops it isn't — include sequence numbers/cursors wherever order matters.

## Practical workflow

1. **Define the protocol.** Message envelope, message types with versions, auth handshake, heartbeat interval, close codes, and resume semantics — write it down before coding.
   ```json
   { "type": "subscribe", "id": "c1", "payload": { "channel": "orders:123" } }
   { "type": "event", "id": "s9", "payload": { "channel": "orders:123", "data": {}, "cursor": "42" } }
   ```
2. **Implement the server.** One well-tested connection handler: upgrade validation → auth → register in connection map → message loop → cleanup on close. Use a mature library, not raw socket code.
3. **Add the backplane.** Redis pub/sub (or NATS/Kafka) fan-out: each instance subscribes to channels and pushes to its local connections. Keep the mapping of connection→subscriptions in memory, channel membership in shared state.
4. **Build the client.** Reconnect with backoff + jitter, resume with last cursor, dedupe by message ID, and surface connection state in the UI (reconnecting banners beat silent staleness).
   ```js
   // resilient client: backoff + resume from cursor
   let cursor = loadCursor(), delay = 1000;
   function connect() {
     const ws = new WebSocket(url + "?cursor=" + cursor);
     ws.onmessage = (e) => {
       const msg = JSON.parse(e.data);
       if (seen(msg.id)) return;            // dedupe replays
       handle(msg); cursor = msg.cursor; saveCursor(cursor);
       delay = 1000;                        // reset backoff on success
     };
     ws.onclose = () => {
       setTimeout(connect, delay + Math.random() * delay);
       delay = Math.min(delay * 2, 30000);  // exponential backoff, capped
     };
   }
   ```
5. **Handle scale.** Load-test connection counts per instance (memory per connection is the binding constraint — measure it); autoscale on connections, not just CPU; set per-IP and per-user connection limits.
6. **Secure it.** `wss://` only, origin validation on upgrade, auth at handshake with periodic revalidation, per-channel authorization checks on subscribe, and rate limits on message ingress.
7. **Observe.** Metrics: active connections, messages in/out rate, heartbeat timeouts, reconnect rate, backplane lag. Alert on connection churn spikes (deploy gone wrong or client bug).
8. **Deploy safely.** Graceful drain on shutdown, rolling restarts with jittered client reconnect, and protocol versioning so old clients degrade gracefully.

## Common pitfalls

- **No heartbeat** — ghost connections accumulating until the server OOMs; ping/pong with aggressive reaping.
- **Broadcasting without a backplane** — works on one instance, silently drops messages at two; add pub/sub before scaling.
- **Thundering-herd reconnects** — every client reconnecting instantly after a deploy; backoff + jitter is mandatory.
- **Unbounded per-connection queues** — one slow client consuming all memory; bound queues and drop/disconnect policies.
- **Auth once, never again** — tokens expiring on week-long connections; revalidate periodically.
- **No resume semantics** — clients missing messages during blips; cursors + catch-up fetch from the start.
- **Using WebSockets where SSE suffices** — server→client-only needs don't require full-duplex complexity.
- **Leaking connections on abnormal close** — missing cleanup on error paths; audit every exit from the message loop.
- **No per-client rate limiting** — a buggy client flooding the server; throttle ingress per connection.
- **Sticky sessions forever** — deploy and failover pain; design stateless with a backplane instead.
- **Trusting client-sent channel names** — subscribing to arbitrary channels; validate subscriptions against a per-user allowlist.
- **No message size limits** — one client sending gigabytes in a frame; cap frame and message sizes.
- **Forgetting proxy timeouts** — load balancers with 60s idle timeouts killing connections; keep heartbeats below the lowest proxy timeout.
- **Broadcasting secrets** — pushing sensitive data to channels without per-subscriber authorization checks.
