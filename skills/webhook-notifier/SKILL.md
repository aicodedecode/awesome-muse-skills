---
name: webhook-notifier
description: Build webhook-driven notifications — event-to-alert pipelines, formatting, routing, and multi-channel fan-out.
category: enterprise-communication
---

## Overview

Webhooks carry events; notifiers turn them into human-actionable alerts across Slack, email, SMS, and incident tools. This skill covers building webhook notification pipelines: receiving events, formatting messages for humans, routing by severity and team, fan-out to multiple channels, and operating the system reliably.


Webhook notifiers push real-time event alerts to external systems: order updates, build statuses, monitoring alarms, and business events delivered as HTTP callbacks.
Beyond basic POST requests, professional notifier design covers reliability, security, observability, and the developer experience that makes integrations succeed.
## When to use

- Building alert pipelines from webhooks
- Routing events to Slack/Teams/email/SMS
- Formatting machine events as human messages
- Setting up multi-channel notification fan-out
- Debugging notification delivery
- Reducing alert noise from webhooks

- Notifying partners of order or shipment events
- Pushing CI/CD build statuses to chat tools
- Alerting on monitoring thresholds
- Syncing events to data warehouses
## Core concepts

**Pipeline stages.** Receive (validate signature, parse) → enrich (add context: links, runbook, owner) → route (which team/channel by event type and severity) → format (per-channel message) → deliver (with retry) → track (delivery + acknowledgment).

**Message formatting.** Per channel: Slack (blocks, concise, with action buttons), email (more detail, threaded), SMS (critical only, under 160 chars), incident tools (structured fields). Every message: what happened, impact, severity, link to details, and the action (ack link, runbook link). Machine-readable payloads make terrible human alerts — translate.

**Routing.** Rules by: event type, severity, service/team ownership (from a service catalog), time of day (business hours vs. on-call), and escalation state. Route to the owner, not to everyone — broadcast is the enemy of action.

**Fan-out.** Critical events → multiple channels (Slack + SMS + incident tool); routine → single channel. Deduplicate across channels (same event shouldn't page twice via different paths). Coordinate with on-call schedules — alert the human who's actually on duty.

**Reliability.** At-least-once processing with idempotency (event IDs), retry with backoff for downstream failures, dead-letter queues with alerting, and end-to-end delivery tracking. A notification system that silently drops pages is worse than none.

**Noise control.** Deduplication (same alert firing repeatedly → one notification + count), grouping (related events → single thread), flapping suppression, severity-based throttling, and auto-resolve notifications (close the loop — "recovered" messages prevent confusion).


**Delivery guarantees.** At-least-once (retry until acknowledged) is the standard; exactly-once is generally unachievable over HTTP.
Design receivers for idempotency — duplicate deliveries are normal, not errors.
Document your retry policy explicitly; partners build around it.
**Payload design.** Include: event ID (unique), event type, timestamp, version, and the full resource state.
Self-contained payloads let receivers act without follow-up API calls.
Never break existing fields — additive changes only, with versioning for major revisions.
**Security.** HMAC signatures (shared secret per endpoint), timestamp validation (reject stale), TLS everywhere, and IP allowlisting options.
Provide signature verification code samples — most integration failures are signature bugs.
Rotate secrets with overlap periods; never break receivers during rotation.
**Observability.** Per-endpoint delivery dashboards: success rate, latency percentiles, retry counts, and failure reasons.
Expose delivery logs to partners — self-service debugging cuts support tickets dramatically.
Alert on endpoint health degradation before partners notice.
## Practical workflow

1. **Catalog events.** What webhooks arrive? For each: meaning, severity mapping, owning team, and required action. This catalog is the routing table's source of truth.
2. **Design routing.** Service catalog (service → team → channel → on-call), severity rules, time-based routing, and escalation paths. Document and get team sign-off.
3. **Build formatting.** Templates per channel per event type. Include: severity emoji/color coding, concise summary, key fields, deep links, and action buttons (acknowledge, runbook, dashboard).
4. **Implement the pipeline.** Webhook receiver (verify, parse, idempotency-check) → enrichment → router → formatters → delivery with retry → tracking. Log every stage.
5. **Add noise controls.** Dedup windows, grouping rules, flapping detection, throttling per severity, and auto-resolve handling. Start strict — loosen based on feedback, not the reverse.
6. **Operate.** Monitor: delivery rates, ack times, noise complaints, missed pages. Review routing monthly. Test the full path quarterly (synthetic events end-to-end).

**Alert message template:** [SEV2] [Service] Brief description → Impact: who's affected → Started: time → Dashboard: link → Runbook: link → [Acknowledge] [Silence 30m]


**Implementation checklist:** event catalog defined → payload schemas versioned → signing implemented → retry policy configured (exponential backoff: 1m, 5m, 30m, 2h, 12h) → dead-letter queue for persistent failures → partner test console → documentation with examples → monitoring dashboards.
Test with flaky receivers deliberately — reliability is proven under failure, not assumed.
**Partner onboarding:** sandbox environment → sample event generator → signature verification guide → delivery log access → support channel.
Time-to-first-successful-webhook is your onboarding metric — optimize it relentlessly.
## Common pitfalls

- **Raw payload forwarding.** Dumping JSON into Slack. Translate events into human messages.
- **Broadcast routing.** Every alert to #general. Route to owners; escalate on silence.
- **No dedup.** 200 identical alerts. Deduplicate, group, and summarize.
- **Missing auto-resolve.** Alerts fire, recover silently, nobody knows. Close the loop.
- **Untested paths.** Assuming SMS delivery works until the 3am page that never arrives. Test end-to-end quarterly.
- **No on-call integration.** Paging a channel instead of the on-duty human. Integrate with schedules.
- **Silent failures.** Notification pipeline drops events without alerting. Monitor the monitor.
- **No retry logic.** Fire-and-forget delivery loses events on the first network blip. Retries are not optional for production systems.
- **Missing idempotency guidance.** Partners double-processing events because duplicates were not documented. State the contract explicitly.
- **Silent failures.** Endpoints failing for days unnoticed. Monitor per-endpoint health and alert proactively.
- **Breaking changes.** Renaming fields without versioning. Additive-only evolution; version major changes.
