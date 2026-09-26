---
name: backup-strategy
description: Designing backup strategies for PaaS-hosted apps — what to back up, how often, and proving restores work.
category: railway
---

## Overview

On PaaS, backups span managed services (database snapshots, volume backups)
and your own responsibilities (app config, uploaded files, secrets inventory).
A backup strategy answers: what's backed up, how often, where copies live,
how long they're kept — and proves it with restore drills. This skill covers
building one that actually works.

## When to use

- Designing backups for a PaaS-hosted application
- Defining RPO (recovery point objective) and RTO (recovery time objective)
- Backing up databases, file storage, and configuration
- Testing restores (the part everyone skips)
- Documenting disaster recovery procedures

## Core concepts

**RPO/RTO drive everything.** RPO = how much data you can afford to lose
(1 hour? 24 hours?) → sets backup frequency. RTO = how fast you must be
back (minutes? hours?) → sets restore automation needs. Get these agreed
with stakeholders first; every backup decision follows from them.

**3-2-1 rule.** Three copies of important data, on two different media/
systems, one off-site (off-platform). The platform's automated snapshots
are copy one — not the whole strategy. A platform-wide incident taking your
backups with your primaries is exactly when you need them most.

**Back up the boring stuff too.** Databases get attention; forgotten items
don't: environment variables/secrets inventory (not the values in git — a
secure record of what exists), DNS configuration, TLS certs, infrastructure
definitions, uploaded files in object storage (versioning + cross-region
replication), and third-party configurations (auth providers, payment
webhooks).

**Automated, monitored, alerted.** Backups that require a human to remember
don't happen. Schedule them, alert on failure, and monitor age ("latest
successful backup older than X" is itself an alert). A backup job nobody
watches is Schrödinger's backup.

**Restore drills are the strategy.** An untested backup is a hope, not a
plan. Quarterly (at least): restore the database to a scratch instance,
verify the app boots against it, spot-check data integrity. Time the drill —
that's your real RTO, not the estimate.

## Practical workflow

1. **Set RPO/RTO** per data class (production DB, uploads, config) with
   stakeholder sign-off.
2. **Enable platform backups:** automated DB snapshots + point-in-time
   recovery within the retention window; volume snapshots for persistent
   disks; object-storage versioning and replication for files.
3. **Add the off-platform copy:** scheduled exports (logical DB dumps, file
   syncs) to separate storage with its own retention — this is your
   platform-failure insurance.
4. **Secure the backups:** encrypted at rest, access-controlled (backups
   contain everything — they're the highest-value target), and retention
   policies that also satisfy compliance (GDPR deletion vs backup
   immutability needs a documented policy).
5. **Monitor:** backup success/failure alerts, backup age alerts, storage
   growth trending.
6. **Drill and document:** quarterly restore test to scratch, timed; write
   the disaster-recovery runbook from what you actually did (not what you
   think you'd do); review after every drill.

## Common pitfalls

- **Only the platform's snapshots** — no off-platform copy; a platform-level
  incident or account issue takes backups too.
- **Never testing restores** — discovering during a real incident that the
  backup is corrupt, incomplete, or unrestorable.
- **Backing up the database but not uploads** — files in object storage
  without versioning/replication are one bad delete from gone.
- **Secrets lost with the environment** — env vars only existed in the
  platform dashboard; after an incident nobody can reconstruct them; keep
  a secure inventory.
- **Retention too short or infinite** — too short misses slow-burn data
  corruption discovered late; infinite costs a fortune and complicates
  compliance deletions. Choose deliberately.
- **RPO/RTO never agreed** — engineering backs up daily, business assumed
  hourly; align expectations before the outage, not during.
