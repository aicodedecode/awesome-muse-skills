---
name: ssh-expert
description: SSH mastery — key management, config patterns, multiplexing, tunneling, jump hosts, and hardening.
category: development
---

## Overview

SSH is the secure remote-access protocol everything runs through: shell access, file transfer, tunnels, git, port forwarding, and jump hosts. Most people use 5% of it — typing full hostnames, re-entering passwords, and forwarding agents insecurely. Mastery means a config file that makes `ssh prod` do the right thing: right key, right user, right jump host, multiplexed connection.

This skill covers key management, `~/.ssh/config` patterns, connection multiplexing, tunneling, jump hosts, and server hardening — the SSH knowledge that makes remote work frictionless and secure.

## When to use

- Setting up SSH keys and config for hosts.
- Accessing hosts behind bastions/jump hosts.
- Creating tunnels (local/remote/dynamic port forwarding).
- Debugging SSH connection issues (verbose mode, key problems).
- Hardening SSH servers.
- Speeding up repeated SSH/SCP/rsync with multiplexing.
- Replacing insecure agent forwarding.

## Core concepts

- **Keys.** Ed25519 (`ssh-keygen -t ed25519`) for new keys; RSA-4096 where legacy requires it. One key per client device (not per server — servers get your public key). Passphrases on keys + `ssh-agent` — encrypted at rest, convenient in use.
- **ssh-agent.** Holds decrypted keys in memory; `ssh-add` loads them. Use the OS keychain integration (macOS Keychain, Windows OpenSSH agent, Linux keyring) so passphrases unlock once per login.
- **`~/.ssh/config`.** The productivity core: Host aliases with HostName, User, Port, IdentityFile, and ProxyJump. `ssh prod-db` instead of `ssh -i key.pem ubuntu@10.0.4.23 -p 2222`. Version it (minus secrets) in dotfiles.
- **Jump hosts (ProxyJump).** `ProxyJump bastion` — SSH through a bastion transparently; `-J` flag for ad-hoc. Bastions are the controlled entry point to private networks; ProxyJump replaces manual two-hop SSH.
- **Multiplexing.** `ControlMaster auto`, `ControlPath`, `ControlPersist` — one TCP connection reused for subsequent sessions. Second `ssh`/`scp`/`rsync` connects instantly. Dramatic speedup for scripts making many connections.
- **Port forwarding.** `-L` local (expose remote service locally: `-L 5432:db:5432`), `-R` remote (expose local service remotely — for webhooks behind NAT), `-D` dynamic (SOCKS proxy for the browser). `-N` for forward-only sessions; `-f` backgrounds.
- **Tunnels as tools.** Local-forward to reach private databases/UIs securely; dynamic forward as a poor-man's VPN for browsing through a trusted network. Always prefer forwarding over exposing services.
- **SCP/SFTP/rsync.** `scp` for simple copies, `sftp` for interactive, `rsync -e ssh` for efficient syncs (delta transfer, resume). All respect `~/.ssh/config` — aliases work everywhere.
- **Host key verification.** `known_hosts` + `StrictHostKeyChecking` — the MITM protection. Changed host keys mean something changed (rebuild? attack?) — investigate, don't blindly accept. `ssh-keygen -R host` removes stale entries.
- **Certificates (advanced).** SSH certificates (not just keys) — a CA signs short-lived user/host certs, eliminating `authorized_keys` management at scale. The right answer past ~dozens of hosts.
- **Server hardening.** `PasswordAuthentication no`, `PermitRootLogin no` (or `prohibit-password`), key-only auth, non-standard port as obscurity (not security), fail2ban, `AllowUsers`/`AllowGroups` allowlists, `MaxAuthTries`, protocol 2 only.
- **Agent forwarding danger.** `-A` exposes your agent socket to the remote host — a compromised server can use your keys. Prefer ProxyJump (keys never leave your machine). If you must forward, confirm each use (`AddKeysToAgent confirm`).
- **Debugging.** `ssh -v` (up to `-vvv`) shows the handshake: which keys offered, why auth failed, where it hangs. 90% of SSH debugging is reading verbose output.
- **Keepalives.** `ServerAliveInterval 60` + `ServerAliveCountMax` — stop NAT/firewalls killing idle sessions. `ClientAliveInterval` server-side for the same.

## Practical workflow

1. **Generate per-device keys.** Ed25519, passphrase-protected, added to agent:
   ```bash
   ssh-keygen -t ed25519 -C "laptop-2026" -f ~/.ssh/id_ed25519
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519  # macOS; OS equivalent elsewhere
   ```
2. **Write the config.** Aliases, jump hosts, multiplexing — the file that makes SSH pleasant:
   ```ssh
   Host bastion
     HostName bastion.example.com
     User ops
     IdentityFile ~/.ssh/id_ed25519

   Host prod-*
     User ubuntu
     ProxyJump bastion
     IdentityFile ~/.ssh/id_ed25519
     ControlMaster auto
     ControlPath ~/.ssh/cm-%r@%h:%p
     ControlPersist 10m
     ServerAliveInterval 60
   ```
3. **Use ProxyJump, not forwarding.** `ssh -J bastion db.internal` ad-hoc; `ProxyJump` in config permanently. Keys stay local.
4. **Forward ports deliberately.** Database GUI over a private network:
   ```bash
   ssh -N -L 5432:db.internal:5432 prod-bastion   # psql -h localhost now reaches it
   ssh -N -D 1080 prod-bastion                     # SOCKS proxy for the browser
   ```
5. **Debug with verbosity.** `ssh -vvv host` — read the auth section: keys offered, accepted, or why not. Common: wrong IdentityFile, permissions on `~/.ssh` (700) / keys (600), server refusing (check `auth.log`).
6. **Harden servers.** Key-only, no root login, allowlisted users, fail2ban — in `/etc/ssh/sshd_config`, tested with a second session open before restarting sshd (never lock yourself out).
7. **Sync files efficiently.** `rsync -avz -e ssh project/ prod-app:/srv/app/` — delta transfers beat `scp -r` for repeated deploys.
8. **Scale with certificates.** Past dozens of hosts, SSH CAs beat `authorized_keys` distribution — short-lived certs, no key sprawl, instant revocation.

## Common pitfalls

- **Passwords instead of keys** — brute-forceable and annoying; keys + agent everywhere.
- **Agent forwarding (`-A`) habitually** — key-socket exposure on every hop; ProxyJump instead.
- **No `~/.ssh/config`** — typing full commands every time; aliases + defaults.
- **Wrong permissions** — `~/.ssh` 700, private keys 600, `~/.ssh/config` 600; SSH refuses otherwise (by design).
- **One key everywhere** — key sprawl and unclear revocation; per-device keys, per-purpose where sensitive.
- **Blindly accepting changed host keys** — MITM or rebuild; investigate before `ssh-keygen -R`.
- **No multiplexing** — slow repeated connections in scripts; ControlMaster/ControlPersist.
- **Idle disconnects** — NAT timeouts killing sessions; ServerAliveInterval.
- **Locking yourself out** — restarting sshd with bad config and no fallback; keep a session open while testing.
- **Root login allowed** — the most attacked account; `PermitRootLogin no`.
- **`-R` forwarding without GatewayPorts awareness** — accidentally exposing local services; understand bind addresses.
- **Passphraseless keys on servers** — convenient for automation but a stolen file is full access; restrict commands (`command="..."` in authorized_keys) or use certificates.
- **Ignoring `-v` output** — guessing at auth failures; verbose mode tells you exactly what happened.
