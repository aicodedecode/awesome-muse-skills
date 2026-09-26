---
name: pocketbase-realtime
description: Realtime subscriptions with PocketBase — live updates, presence patterns, and scaling — use for collaborative or live UI features.
category: pocketbase
---

## Overview

PocketBase streams record changes to subscribed clients over Server-Sent
Events: create/update/delete on a collection arrives live in the UI without
polling. Combined with API rules (which filter what each subscriber may see),
it powers collaborative features, dashboards, and notifications. This skill
covers subscription patterns and the limits to respect.

## When to use

- Building live-updating UIs (dashboards, feeds, collaboration)
- Subscribing to collection changes with filters
- Designing presence ("who's online") or activity streams
- Handling reconnection, missed events, and ordering
- Understanding realtime scaling limits on a single node

## Core concepts

**Subscribe to collections, filter client-side by rules.** Clients subscribe to
a collection (optionally a single record); PocketBase delivers events the
subscriber's API rules permit. Rules are the access control — a subscriber
only receives records their list/view rules allow. Design rules with realtime
in mind from the start.

**Events are record-level.** You get the changed record and the action
(create/update/delete), not a diff. Clients apply it to local state (upsert on
create/update, remove on delete). For deletes, the payload may be minimal —
design clients to handle tombstones gracefully.

**SSE, not websockets.** PocketBase realtime uses Server-Sent Events: simple,
HTTP-friendly, auto-reconnecting at the browser level — but one-directional
(server → client). Client-to-server messages go through the regular API.
Reconnection replays nothing by default: on reconnect, re-fetch current state
to catch missed events.

**Ordering and delivery guarantees.** Events arrive in order per connection
under normal conditions, but reconnections and concurrent writes can produce
gaps or reordering at the edges. For critical state (counters, inventories),
treat realtime as a notification to re-fetch authoritative state, not as the
state itself.

**Single-node fan-out.** Every subscriber holds a connection on the one
PocketBase process; each write fans out to all matching subscribers. This
scales to thousands of subscribers comfortably but not to hundreds of
thousands — high-churn collections with many subscribers multiply load fast.

## Practical workflow

1. **Enable realtime per collection** deliberately — not every collection
   needs it; each subscription is an open connection.
2. **Design API rules for subscribers:** verify list/view rules produce
   exactly the visibility each user should have live.
3. **Subscribe narrowly:** single-record subscriptions for detail views,
   filtered collection subscriptions for lists; unsubscribe when components
   unmount to avoid leaking connections.
4. **Handle lifecycle:** on connect, fetch initial state; on message, apply
   the event; on reconnect/error, re-fetch to heal missed events; show
   connection status in the UI for live-critical features.
5. **Load-test the fan-out:** simulate realistic subscriber counts against
   your write rate; watch connection counts, memory, and event latency on
   the server.
6. **Degrade gracefully:** if realtime disconnects, the app must still work
   via polling or manual refresh — realtime is an enhancement, not a
   dependency, for most features.

## Common pitfalls

- **Subscribing to everything** — wildcard subscriptions on high-churn
  collections flood clients and strain the server; subscribe narrowly.
- **Leaking subscriptions** — components that subscribe but never unsubscribe
  accumulate connections; tie subscription lifecycle to component lifecycle.
- **Trusting event order absolutely** — after reconnects, re-fetch; don't
  reconstruct critical state purely from an event stream.
- **API rules ignored in realtime design** — subscribers receiving records
  they shouldn't see because list rules were written for one-off queries,
  not continuous visibility.
- **No reconnection UX** — users staring at stale data with no indication
  the live connection dropped; surface connection state.
- **Using realtime for client→server messaging** — it's server→client only;
  client actions go through the API (which then triggers events for others).
