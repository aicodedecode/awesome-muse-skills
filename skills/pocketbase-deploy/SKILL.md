---
name: pocketbase-deploy
description: Deploying PocketBase to production — hosting, TLS, backups, and updates — use when shipping a PocketBase app.
category: pocketbase
---

## Overview

PocketBase's single-binary design makes deployment unusually simple — but
production still demands TLS, persistent storage, backups, monitoring, and a
sane update process. This skill covers the complete path from local dev to a
reliable production deployment on any VPS or container platform.

## When to use

- Choosing where to host PocketBase (VPS, container, PaaS)
- Setting up TLS, reverse proxying, and domain configuration
- Configuring persistent storage and automated backups
- Planning zero-downtime-ish updates and rollbacks
- Monitoring health, logs, and resource usage

## Core concepts

**One binary + one data directory.** Deployment is: copy the binary, ensure
the data directory persists across restarts (mounted volume, not container
ephemeral storage), and run it (systemd, Docker, or process manager). The
data directory contains the SQLite database, uploads, and backups — treat it
as the precious state; everything else is replaceable.

**Reverse proxy in front.** Put nginx/Caddy/Traefik (or your platform's
ingress) in front for TLS termination, HTTP/2, rate limiting, and static
caching. PocketBase serves HTTP itself; the proxy handles the internet-facing
concerns. Caddy's automatic HTTPS is the lowest-friction option for simple
setups.

**Backups are the data directory, done safely.** Options: PocketBase's
built-in backup (zips data dir via admin API — schedule it), filesystem
snapshots (if your host supports them), or SQLite-safe copies (WAL-aware).
Keep off-site copies with retention (daily × 7, weekly × 4, monthly × 6 is a
sane start) and — critically — test restores.

**Updates are binary swaps.** Download the new version, stop the old binary,
swap, start. Migrations run via the migrate command as part of the process.
Because it's a single process, "zero-downtime" means: brief restart window
(seconds), ideally behind the proxy with a maintenance-tolerant client retry.
For most PocketBase workloads this is fine; plan accordingly if it isn't.

**SQLite on network storage is a trap.** SQLite needs real filesystem
semantics (locking) — NFS and some network volumes corrupt or crawl. Use
local SSD volumes; replicate backups off-site rather than running the live
DB on network storage.

## Practical workflow

1. **Provision:** a modest VPS (PocketBase is light; 1–2 vCPU / 2–4GB RAM
   covers a lot) with a persistent volume for the data directory.
2. **Run it supervised:** systemd unit or Docker Compose with restart policy,
   resource limits, and logs shipped to your log aggregator.
3. **Proxy + TLS:** reverse proxy with automatic HTTPS, rate limits on auth
   endpoints, and security headers; point your domain at it.
4. **Backups:** schedule built-in or snapshot backups, copy off-site,
   set retention, and do a trial restore to a scratch instance — quarterly
   at minimum.
5. **Observe:** health endpoint checks, disk usage alerts (uploads grow!),
   log monitoring for errors, and basic metrics (CPU/memory/connections).
6. **Update runbook:** staging first → backup prod → swap binary → run
   migrations → smoke-test auth, critical reads/writes, and realtime →
   rollback plan (previous binary + backup) ready before you start.

## Common pitfalls

- **Ephemeral container storage** — data directory inside the container
  without a volume: one redeploy wipes everything. Mount a volume, always.
- **No backups or untested backups** — the classic; schedule, off-site,
  retention, and restore drills.
- **SQLite on NFS/EFS-style storage** — locking semantics break; use local
  disks for the live database.
- **Exposing the admin dashboard publicly without hardening** — restrict
  `/_/` by IP/VPN if possible, use strong admin credentials + 2FA where
  available, and monitor admin logins.
- **Skipping staging for updates** — minor versions can change behavior;
  the 10 minutes to test in staging saves the 2am rollback.
- **Disk full from uploads/backups** — monitor disk usage with alerts;
   uploads and local backup zips grow unboundedly without retention.
