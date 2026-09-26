---
name: managed-postgres
description: Using managed Postgres on PaaS platforms — provisioning, connecting, backups, and limits — vendor-neutral patterns.
category: railway
---

## Overview

Every major PaaS offers managed Postgres: a database without the ops burden of
running it yourself. The trade-off is a set of platform-specific constraints
(connection limits, no superuser, backup semantics) that shape how you build.
This skill covers using managed Postgres well regardless of provider.

## When to use

- Provisioning a Postgres database on a PaaS
- Connecting apps securely (connection strings, pooling, TLS)
- Understanding backup, point-in-time recovery, and fork/clone features
- Working within managed limits (connections, extensions, superuser)
- Migrating data in or out of a managed instance

## Core concepts

**Connection strings are injected.** Platforms typically provide a
`DATABASE_URL` env var. Use it directly; never hardcode credentials. Note
whether it points at a pooler or the primary — pooled URLs (transaction mode)
behave differently from direct ones (prepared statements may break in
transaction-pooling mode).

**Pooling is usually mandatory.** Managed instances cap connections (often
tens, not hundreds). Every app instance × pool size must fit under the cap.
Use a pooler (the platform's built-in one, or PgBouncer) and keep per-
instance pools small (e.g. 5–20). Serverless workloads need pooling even more
— or a proxy that handles connection spikes.

**Backups: know the RPO/RTO.** Managed Postgres typically offers automated
daily backups plus point-in-time recovery (WAL-based) within a retention
window. Verify: backup frequency, retention period, how to restore (new
instance? in-place?), and how long a restore takes at your data size. Test a
restore — "we have backups" is unproven until restored.

**No superuser, limited extensions.** You won't get `SUPERUSER`; some
extensions requiring it are unavailable. Check the provider's extension
allowlist early if you need PostGIS, pg_cron, pgvector, or similar —
extension availability varies and can block a design.

**Forks and branching.** Many platforms offer instant forks/clones (copy-on-
write) of the database — perfect for preview environments, safe migration
testing, and analytics sandboxes. Use them instead of dumping/restoring for
ephemeral copies.

## Practical workflow

1. **Provision with intent:** choose the plan tier by working-set size
   (RAM ≈ hot data), storage headroom, and HA needs (standby replicas on
   higher tiers).
2. **Connect correctly:** use the provided URL, enable TLS, route through
   the pooler for app traffic and direct for migrations/admin.
3. **Set pool sizes deliberately:** (instances × pool size) + headroom <
   max connections; monitor `pg_stat_activity` counts in production.
4. **Verify extensions** you need are available before committing to the
   platform for the project.
5. **Establish the backup story:** confirm automated backups + PITR window,
   document the restore procedure, and perform a trial restore to a scratch
   instance.
6. **Plan data movement:** for imports, use the platform's recommended path
   (direct `pg_dump`/`pg_restore` over a private network or allowed IPs);
   for exports/migration away, ensure you can get a full logical dump —
   avoid lock-in by verifying exit paths up front.

## Common pitfalls

- **Connection exhaustion** — app pools sized for self-hosted Postgres blow
  past managed limits; do the arithmetic and monitor.
- **Prepared statements vs transaction pooling** — ORMs using prepared
  statements break on transaction-mode poolers; use session mode or disable
  prepared statements as appropriate.
- **Assuming backups exist** — some tiers/steps require enabling backups
  explicitly; verify, don't assume.
- **Extension surprise** — discovering mid-project that pg_cron or a
  specific extension isn't available; check the allowlist on day one.
- **Noisy-neighbor performance variance** — lower tiers share resources;
  if p99 latency matters, understand what tier gives you dedicated resources.
- **Lock-in by accident** — proprietary backup formats or no export path;
  confirm you can always `pg_dump` your data out.
