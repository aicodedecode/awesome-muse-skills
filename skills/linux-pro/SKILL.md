---
name: linux-pro
description: Linux systems guidance — filesystem, permissions, processes, networking, logs, and production server administration.
category: development
---

## Overview

Linux is the substrate everything runs on: containers, VMs, CI runners, and most servers. Fluency with the filesystem, permissions, processes, networking, and logs is what separates engineers who guess from engineers who diagnose. You don't need to be a sysadmin — you need the working knowledge that makes every other skill more effective.

This skill covers the Linux fundamentals that come up constantly: navigating and managing systems, understanding permissions, controlling processes, debugging networking, reading logs, and the production practices (users, SSH, updates, backups) that keep servers healthy.

## When to use

- Diagnosing server issues (disk full, OOM, high load, network).
- Managing files, permissions, and ownership.
- Controlling processes and services.
- Debugging networking (DNS, ports, firewalls, routing).
- Reading and managing logs (journald, logrotate).
- Setting up a production Linux server (users, SSH, updates).
- Writing scripts that interact with the system.

## Core concepts

- **Filesystem hierarchy.** `/etc` (config), `/var/log` (logs), `/var/lib` (state), `/opt` and `/usr/local` (add-on software), `/tmp` (ephemeral), `/proc` and `/sys` (kernel interfaces). Know where things live and `/proc` becomes a diagnostic goldmine.
- **Permissions.** `rwx` for user/group/other, octal notation (755, 644, 600), ownership (`chown`), and special bits (setuid, setgid, sticky). Principle: least privilege — 777 is never the answer; find the right user/group instead.
- **Users and sudo.** Service accounts per application, humans in `sudo` with logged commands, no shared root passwords, SSH keys only. `sudo` config via `/etc/sudoers.d/` snippets, never editing the main file blindly.
- **Processes.** Everything is a process: `ps`, `top`/`htop`, signals (`TERM` vs `KILL` — always TERM first, KILL only when necessary), nice levels, and cgroups (what containers use for limits). Zombie processes indicate a parent not reaping children.
- **systemd.** The init system: units (services, timers, sockets), `systemctl` for control, `journalctl` for logs, timers replacing cron for most scheduled tasks. Write proper unit files with restart policies and sandboxing options.
- **Package management.** apt/dnf/pacman — keep systems updated (unattended-upgrades for security patches), pin versions where stability matters, and know what's installed (`dpkg -l`, `rpm -qa`).
- **Networking.** Interfaces (`ip addr`), routing (`ip route`), DNS (`/etc/resolv.conf`, `systemd-resolved`), sockets (`ss -tlnp` — what's listening, on what, owned by whom), firewalls (nftables/ufw/firewalld). Diagnose layer by layer: link → IP → route → DNS → port → firewall → app.
- **Disk.** `df` (filesystem usage), `du` (directory usage), inodes (`df -i` — "disk full" with free space means inode exhaustion), mounts (`/etc/fstab`), LVM for flexible volumes. Full disks cause bizarre failures — monitor them.
- **Memory.** `free`, `/proc/meminfo`, OOM killer (check `dmesg` for kills), swap (emergency headroom, not a strategy). Containers' memory limits trigger OOM kills that look like app crashes.
- **Logs.** journald (`journalctl -u service -f`, `--since`), `/var/log` files, logrotate preventing disk-fill. Structured logging from apps makes `journalctl` queries powerful; correlate with request IDs.
- **SSH.** Key-based auth only, `sshd_config` hardened (no root login, no password auth), `~/.ssh/authorized_keys` managed, jump hosts/bastions for private networks, agent forwarding avoided (use ProxyJump instead).
- **Time.** NTP/chrony keeping clocks in sync — clock skew breaks TLS, Kerberos, and distributed systems. Verify with `timedatectl`.
- **Cron vs systemd timers.** Timers give you logging, dependencies, and failure handling that cron lacks; use timers for anything important, cron for trivial personal tasks.
- **Backups.** `rsync`/`restic`/`borg` for files, database-native dumps for DBs, tested restores. Automate, monitor, and periodically verify — untested backups are rumors.
- **Security basics.** Minimal installed packages, automatic security updates, fail2ban or equivalent for SSH, no unnecessary listening services (`ss -tlnp` audit), file integrity awareness.

## Practical workflow

1. **Diagnose systematically.** Load (`uptime`, `htop`), disk (`df -h`, `df -i`), memory (`free -h`, `dmesg | grep -i oom`), network (`ss`, `ping`, `curl -v`), logs (`journalctl`). Work from symptoms to layer, not guesses.
   ```bash
   # the 60-second triage
   uptime; df -h; df -i; free -h
   ss -tlnp | head -20
   journalctl -p err --since "15 min ago" | tail -20
   ```
2. **Manage permissions correctly.** Least-privilege ownership; groups for shared access; `find` for permission audits:
   ```bash
   chown -R app:app /srv/app
   chmod 750 /srv/app
   find /srv/app -type f -perm /o+w  # world-writable files: investigate
   ```
3. **Control services with systemd.** Write unit files with `Restart=on-failure`, sandboxing (`ProtectSystem`, `PrivateTmp`), resource limits; timers for scheduled work.
   ```ini
   [Unit]
   Description=Shop API
   After=network.target
   [Service]
   User=app
   ExecStart=/opt/shop/api
   Restart=on-failure
   ProtectSystem=strict
   [Install]
   WantedBy=multi-user.target
   ```
4. **Harden SSH.** Key-only auth, no root login, non-standard port optional (obscurity, not security), fail2ban, ProxyJump instead of agent forwarding.
5. **Debug networking layer by layer.** `ip addr` → `ip route` → `getent hosts`/`dig` → `ss -tlnp` → firewall rules → `curl -v`. Each layer has its own tools; skipping layers wastes hours.
6. **Manage logs.** journald with persistent storage and rate limits; logrotate for file logs; ship to central logging; alert on error patterns, not just disk space.
7. **Keep systems updated.** Automatic security updates; planned maintenance windows for major upgrades; know what's installed and why.
8. **Back up and verify.** Automated backups with monitoring; periodic restore tests; document the recovery procedure — the runbook written during calm saves the outage.

## Common pitfalls

- **`chmod 777`** — never the fix; find the right user/group and permission.
- **KILL as first resort** — data corruption and unclean shutdown; TERM first, wait, then KILL.
- **Ignoring inodes** — "disk full" with free space; `df -i` reveals inode exhaustion (millions of small files).
- **Full disks from logs** — no logrotate/journald limits; monitor disk and bound log growth.
- **Password SSH auth** — brute-force target; keys only, fail2ban as backup.
- **Running everything as root** — compromise blast radius; service users per app.
- **No NTP** — clock skew breaking TLS and auth; chrony everywhere.
- **Cron for critical tasks** — no logging or failure handling; systemd timers instead.
- **Untested backups** — discovered broken during an outage; verify restores regularly.
- **Firewall misconfigurations** — locking yourself out remotely; test rules with a safety revert (e.g., `at` job restoring access).
- **OOM kills misdiagnosed** — app "crashing" that's actually memory limits; check `dmesg`.
- **Stale packages** — unpatched CVEs; automatic security updates at minimum.
- **Deleting open files** — `rm` on a file a process holds doesn't free space; truncate or restart the holder.
