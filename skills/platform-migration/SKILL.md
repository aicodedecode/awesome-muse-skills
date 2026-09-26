---
name: platform-migration
description: Migrating applications between platforms — planning, data movement, and cutover — vendor-neutral methodology.
category: railway
---

## Overview

Moving an app between platforms (PaaS to PaaS, PaaS to cloud, cloud to PaaS)
is a high-stakes project: data must move intact, downtime must be minimal,
and rollback must be possible. This skill covers the migration methodology —
inventory, strangling, dual-running, and cutover — that works regardless of
source and destination.

## When to use

- Planning a move between hosting platforms or cloud providers
- Estimating migration effort and risk
- Moving databases with minimal downtime
- Cutting over DNS and traffic safely
- Validating a migration (data integrity, performance parity)

## Core concepts

**Inventory everything first.** Services, databases, caches, cron jobs,
queues, file storage, secrets, DNS records, TLS certs, third-party
integrations with IP allowlists, background workers, and webhooks pointing
at old URLs. Migrations fail on the forgotten piece, not the planned ones —
the webhook URL and the cron job are what bite.

**Keep the app portable.** The migration is dramatically easier if the app
already follows twelve-factor principles (env-based config, stateless,
Dockerized). If it doesn't, do that refactor first as its own project —
don't combine "make portable" with "move platforms" in one big bang.

**Database migration is the critical path.** Strategy depends on size and
downtime tolerance: dump/restore for small DBs with maintenance windows;
replication-based (primary on old, replica on new, then promote) for large
DBs needing near-zero downtime. Always: test restores, verify row counts
and checksums, and rehearse the cutover sequence.

**Dual-run before cutover.** Run the new stack alongside the old with real
traffic mirrored or a percentage split (dark launch). Compare responses,
errors, and latency. Dual-running de-risks cutover more than any amount of
staging testing — production traffic is the only true test.

**Cutover is a checklist, not an improvisation.** Ordered steps: freeze
deploys, final data sync, switch DNS/traffic (low TTLs set days ahead),
verify health on new platform, monitor old platform for stragglers, keep
rollback ready (old stack warm, DNS revert plan) for a defined window.

## Practical workflow

1. **Inventory and map:** every component, its config, data, and
   dependencies; produce the target architecture on the new platform.
2. **De-risk the app:** containerize, externalize config, remove
   platform-specific dependencies — verify it runs locally in Docker.
3. **Migrate non-critical pieces first:** staging environments, internal
   tools, then stateless services — build muscle memory before the database.
4. **Move data:** choose dump/restore vs replication by size/downtime needs;
   rehearse on a copy; validate integrity (counts, checksums, spot queries).
5. **Dual-run with production traffic:** mirror or split traffic, compare
   behavior, fix discrepancies — don't cut over with known diffs.
6. **Cut over:** low TTLs in advance → deploy freeze → final sync → traffic
   switch → verify (synthetics, error rates, business metrics) → keep old
   stack warm through the rollback window → decommission.

## Common pitfalls

- **The forgotten integration** — webhooks, IP-allowlisted third parties,
  scheduled jobs, and email DNS records (SPF/DKIM) pointing at the old
  platform; inventory ruthlessly.
- **DNS TTL left at 24h** — cutover takes a day to propagate; lower TTLs
  48h+ before the switch.
- **No rollback plan** — "we'll figure it out" during a failed cutover;
  define rollback triggers and keep the old stack runnable.
- **Data divergence during dual-run** — writes going to both systems
  diverge; decide the single writer during transition (usually old system
  until cutover, then hard switch).
- **Performance parity assumed** — new platform has different CPU/network/
  disk characteristics; load-test before cutover, not after.
- **Declaring victory at DNS switch** — monitor for days: straggler traffic,
  missed cron runs, queue backlogs, and cost anomalies on the new platform.
