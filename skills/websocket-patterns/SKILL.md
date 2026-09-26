---
name: websocket-patterns
description: WebSocket patterns for web apps: robust clients, reconnection, resync, multiplexing, and scaling realtime features. Use when adding live features to web frontends.
category: web-development
---

# WebSocket Patterns

A frontend-focused companion to WebSocket fundamentals: the client-side patterns for reliable realtime web features — connection management, reconnection with resync, multiplexing topics, and scaling considerations from the web app's perspective.

## Overview

From the web app's side, WebSockets are deceptively simple (`new WebSocket(url)`) and deceptively fragile (networks drop, servers restart, messages get missed). This skill covers the **client patterns** that make realtime features feel solid: a robust socket wrapper, reconnection with backoff and resync, topic multiplexing over one connection, and graceful degradation — plus what to ask of the backend.

## When to use

- Adding live updates, chat, notifications, or presence to a web app.
- Building a reusable realtime client layer.
- Debugging missed messages after reconnects.
- Deciding message protocol and topic structure with the backend team.

## Core concepts

- **One connection, many topics.** Multiplex: a single socket carrying subscriptions (`{ type: 'subscribe', topic: 'orders:123' }`) rather than a socket per feature. Fewer handshakes, simpler lifecycle, one reconnect path.
- **Message envelope.** `{ type, topic?, id, payload, ts }` — types route to handlers, ids enable dedup/acks, timestamps help ordering and debugging.
- **Reconnection with backoff + jitter.** Exponential backoff (1s → 2s → 4s..., capped ~30s) with random jitter prevents thundering herds after server restarts.
- **Resync cursors.** Track the last-seen message id per topic; on reconnect, send cursors and let the server replay what was missed — or trigger a full refresh of affected UI state.
- **Connection state machine.** `connecting → open → (reconnecting) → open → closed`. Expose state to the UI (live indicator, "reconnecting…" banner, queued-action counts).
- **Heartbeat.** Application-level ping every ~25s (in addition to protocol ping/pong) to detect half-open connections through proxies.
- **Graceful degradation.** If the socket can't connect after N tries: fall back to polling or show stale data with a clear "offline" state — never a silently dead UI.

## Practical workflow

**1. Build the client wrapper.**
```ts
type Handler = (msg: Envelope) => void;

class RealtimeClient {
  private ws?: WebSocket;
  private retry = 0;
  private subs = new Map<string, Handler[]>();
  private cursors = new Map<string, string>();
  state: 'connecting' | 'open' | 'reconnecting' | 'closed' = 'connecting';

  constructor(private url: string) { this.connect(); }

  connect() {
    this.state = this.retry ? 'reconnecting' : 'connecting';
    const ws = new WebSocket(this.url);
    ws.onopen = () => {
      this.retry = 0; this.state = 'open';
      // re-auth + resubscribe with cursors
      ws.send(JSON.stringify({ type: 'hello', subs: [...this.subs.keys()],
        cursors: Object.fromEntries(this.cursors) }));
      this.heartbeat();
    };
    ws.onmessage = (e) => this.route(JSON.parse(e.data));
    ws.onclose = () => this.reconnect();
    this.ws = ws;
  }

  private reconnect() {
    this.state = 'reconnecting';
    const delay = Math.min(1000 * 2 ** this.retry++, 30000) * (0.5 + Math.random());
    setTimeout(() => this.connect(), delay);
  }

  subscribe(topic: string, fn: Handler) {
    const list = this.subs.get(topic) ?? [];
    list.push(fn); this.subs.set(topic, list);
    this.send({ type: 'subscribe', topic });
    return () => this.unsubscribe(topic, fn);
  }
  // route(): dispatch by topic, update cursors, dedupe by id
}
```

**2. Wire into the app.** Provide via context/hook (`useSubscription('orders:123', handler)`); components subscribe declaratively and clean up on unmount.

**3. Show connection state.** A subtle status indicator (live / reconnecting / offline); disable or queue mutating actions while offline ("will send when reconnected").

**4. Coordinate with the backend.** Agree on: envelope format, `hello` resync semantics, heartbeat interval, auth (cookie session or first-message token — not long-lived tokens in the URL), per-topic authorization.

**5. Test the failure modes.** Kill the server mid-session; throttle to offline in DevTools; sleep/wake the laptop. Verify: reconnects, resubscribes, resyncs, no duplicates rendered, UI state honest throughout.

## Common pitfalls

- **Naked `new WebSocket`.** No reconnection, no resync, no state — the #1 realtime bug. Always wrap.
- **Fixed retry delay.** 10k clients retrying every 5s after a deploy = self-inflicted DDoS. Backoff + jitter.
- **No resync.** Reconnected clients silently miss messages. Cursors + replay, or explicit refresh.
- **Duplicate rendering.** Replayed messages rendered twice. Dedupe by message id client-side.
- **Socket per component.** N components × N sockets = N handshakes, N reconnect paths. One multiplexed connection.
- **Leaking subscriptions.** Components unmounting without unsubscribing = handlers firing on dead components. Return cleanup functions; enforce in review.
- **State lies.** UI showing "live" while the socket has been dead for minutes. Drive indicators from the real connection state machine.
- **Auth token in URL.** `wss://...?token=secret` leaks into logs/proxies. Cookie sessions or post-connect auth frames.
- **No offline queue.** User actions during disconnect vanish. Queue mutations locally, flush on reconnect, show pending state.
- **Ignoring the fallback.** Some networks block websockets entirely. Have a polling/SSE fallback path for critical features, or at minimum a clear degraded state.
