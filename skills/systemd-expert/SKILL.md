---
name: systemd-expert
description: systemd guidance — unit files, timers, journald, service hardening, targets, and troubleshooting.
category: development
---

## Overview

systemd is the init system on virtually all modern Linux distributions: it starts services, manages timers (cron's successor), collects logs (journald), handles sockets, mounts, and targets (runlevels). Love it or not, fluency with units, `systemctl`, and `journalctl` is mandatory Linux administration.

This skill covers writing correct unit files, replacing cron with timers, journald log management, service sandboxing/hardening, and the troubleshooting workflow for "why won't this service start."

## When to use

- Writing a systemd service unit for an application.
- Replacing cron jobs with timers.
- Debugging failed services.
- Hardening services (sandboxing, capabilities, resource limits).
- Managing logs with journald.
- Understanding targets, dependencies, and boot ordering.

## Core concepts

- **Units.** The universal object: `.service`, `.timer`, `.socket`, `.mount`, `.target`, `.path`. Declarative INI-style files in `/etc/systemd/system/` (admin) vs `/lib/systemd/system/` (packages — don't edit, override with drop-ins).
- **Service types.** `simple` (default, foreground process), `exec` (like simple, stricter), `forking` (traditional daemons — avoid for new services), `oneshot` (run-to-completion, for timers/setup), `notify` (sd_notify readiness). Pick `simple` unless you have a reason.
- **Dependencies.** `Wants=`/`Requires=` (ordering + activation), `After=`/`Before=` (ordering only), `PartOf=`/`BindsTo=` (lifecycle). `After=network-online.target` for services needing real network — `network.target` alone isn't enough.
- **Restart policies.** `Restart=on-failure` (or `always`), `RestartSec=` backoff — services should self-heal from crashes. `StartLimitIntervalSec`/`StartLimitBurst` prevent restart loops from hammering the system.
- **Timers.** `.timer` + `.service` pairs replacing cron: `OnCalendar=` schedules (cron-like but more expressive), `OnBootSec=`/`OnUnitActiveSec=` intervals, `Persistent=true` (catch up missed runs), `AccuracySec=` (allow batching). Timers get logging, dependencies, and failure alerting that cron lacks.
- **journald.** Centralized logging: `journalctl -u service`, `-f` follow, `--since`/`--until`, `-p err` priority filter, `-o json` for pipelines. Persistent storage (`Storage=persistent`), rate limits (`RateLimitIntervalSec`), and size caps (`SystemMaxUse`) prevent disk-fill.
- **Drop-in overrides.** `/etc/systemd/system/foo.service.d/override.conf` — modify packaged units without editing them (survives package updates). `systemctl edit foo` creates these safely.
- **Targets.** `multi-user.target`, `graphical.target` — synchronization points replacing runlevels. `WantedBy=multi-user.target` in `[Install]` = "start at boot."
- **Sockets.** `.socket` units for socket activation — services start on first connection, idle services consume nothing. Elegant for infrequently-used services.
- **Sandboxing/hardening.** `ProtectSystem=strict`, `ProtectHome=true`, `PrivateTmp=true`, `NoNewPrivileges=true`, `CapabilityBoundingSet=`, `SystemCallFilter=` — run services with the least privilege the app tolerates. `systemd-analyze security` scores your unit.
- **Resource control.** `MemoryMax=`, `CPUQuota=`, `TasksMax=` — cgroup limits preventing one service from starving the host. The mechanism behind container resource limits.
- **Environment.** `Environment=`/`EnvironmentFile=` for config; never bake secrets into unit files world-readable — use `LoadCredential=` for secret injection (credentials exposed as files, not env).
- **User services.** `systemctl --user` — per-user services without root (great for dev tools, agents). Lingering (`loginctl enable-linger`) keeps them running after logout.
- **`systemd-analyze`.** `blame` (slow boot), `critical-chain` (what's blocking), `security` (hardening score), `verify` (unit syntax). The diagnostic toolkit.

## Practical workflow

1. **Write the unit.** Foreground process, explicit user, restart policy, sandboxing:
   ```ini
   [Unit]
   Description=Shop API
   After=network-online.target
   Wants=network-online.target

   [Service]
   Type=simple
   User=shop
   WorkingDirectory=/srv/shop
   ExecStart=/srv/shop/bin/api --config /etc/shop/api.toml
   Restart=on-failure
   RestartSec=5
   MemoryMax=1G
   ProtectSystem=strict
   PrivateTmp=true
   NoNewPrivileges=true

   [Install]
   WantedBy=multi-user.target
   ```
2. **Validate and enable.** `systemd-analyze verify`, `daemon-reload`, `enable --now`, then check status:
   ```bash
   systemd-analyze verify /etc/systemd/system/shop-api.service
   systemctl daemon-reload
   systemctl enable --now shop-api
   systemctl status shop-api
   ```
3. **Replace cron with timers.** Pair `.timer` (schedule) with `.service` (work); `Persistent=true` for catch-up:
   ```ini
   # backup.timer
   [Unit]
   Description=Daily backup
   [Timer]
   OnCalendar=daily
   Persistent=true
   [Install]
   WantedBy=timers.target
   ```
4. **Read logs properly.** `journalctl -u shop-api -f`, `--since "1 hour ago"`, `-p err`, `-o json-pretty` for structured apps. Correlate with request IDs your app logs.
5. **Harden iteratively.** Start with `ProtectSystem`/`PrivateTmp`/`NoNewPrivileges`; run `systemd-analyze security shop-api`; tighten until the app breaks, then back off one step. Document why each relaxation exists.
6. **Debug failures systematically.** `systemctl status` (exit code, last logs) → `journalctl -u` (full logs) → `systemd-analyze verify` (syntax) → check `ExecStart` paths/permissions → run the command manually as the service user.
7. **Manage resources.** Set `MemoryMax`/`CPUQuota` per service; watch `systemd-cgtop` for actual usage; OOM kills show in the journal.
8. **Handle secrets.** `LoadCredential=db-password:/etc/shop/creds/db` exposes secrets as files under `$CREDENTIALS_DIRECTORY` — not in env, not in unit files, not in process listings.

## Common pitfalls

- **Forgetting `daemon-reload`** — edited unit ignored; reload after every change.
- **`Type=forking` for new services** — PID tracking pain; `simple` with foreground processes.
- **Wrong `After=` without `Wants=`** — ordering without activation; pair them for network-online.
- **No restart policy** — crashed services staying down; `Restart=on-failure` by default.
- **Editing packaged units directly** — overwritten on update; use drop-in overrides.
- **Cron for critical jobs** — no logging/dependencies; timers instead.
- **Unbounded journald** — disk filled by logs; set `SystemMaxUse`/`MaxRetentionSec`.
- **Running as root unnecessarily** — full compromise on exploit; `User=` + sandboxing.
- **Secrets in unit files** — world-readable credentials; `LoadCredential=`.
- **Restart loops** — crash-looping without limits; `StartLimitBurst` + alerting on repeated failures.
- **`network.target` assumed sufficient** — services starting before network is up; use `network-online.target`.
- **Ignoring `systemd-analyze security`** — free hardening audit; run it on every custom unit.
- **Environment differences** — service works manually but not under systemd (different env/PATH/user); replicate the unit's context when debugging.
