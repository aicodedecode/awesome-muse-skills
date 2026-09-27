---
name: levelsio-vps-deploy
description: >-
  Set up a web app on a single cheap, hardened VPS the "levels.io" way — one
  Hetzner/DigitalOcean box running Next.js (or any Node app) on SQLite + Caddy
  (auto-HTTPS) + systemd, secured with Tailscale, put behind a Cloudflare domain,
  and set up to charge money with Stripe. The whole "idea → app that makes money
  on a cheap VPS" path. Offers TWO workflows the user picks between — Path A,
  develop on your own computer and deploy to the VPS for cheap hosting; Path B
  (the full levels.io way), develop ON the VPS itself with Claude Code running in
  tmux, connecting via Termius from laptop or phone over Tailscale, with edits
  going live in seconds. The domain (Cloudflare) and payments (Stripe) steps each
  offer full-auto (the agent creates everything with your API keys) or manual (you
  click the dashboard, the agent verifies) modes. Use when the user wants cheap
  single-server hosting, asks to provision a Hetzner/DigitalOcean VPS, wants to
  deploy a Next.js/Node app WITHOUT Vercel/Supabase/Kubernetes, wants to develop
  on a server / code from their phone / run Claude Code persistently on a VPS,
  wants to put a domain on their app / point Cloudflare DNS at a VPS / hide the
  origin behind Cloudflare, wants to charge users / add Stripe subscriptions / set
  up a paywall / take payments / "make money", mentions the "levels.io method" /
  "one big server" / "boring tech" / tmux / Tailscale / Termius, or asks how to
  self-host a small app for a flat ~$8/mo.
---

# levelsio-vps-deploy

Run a web app on **one cheap, hardened VPS** — the levels.io way. No Kubernetes,
no microservices, no managed PaaS. One box, boring tech, vertical scaling, ship
fast.

The full arc is **idea → app that makes money on a cheap VPS**: provision + secure
the box, deploy the app, put a **domain** on it (Cloudflare), and **charge money**
(Stripe). The last two steps each let the user choose *full-auto* (hand the agent
an API key, it creates everything) or *manual* (they click the dashboard, the
agent verifies each step read-only). If they already have a domain and an
activated Stripe account, going from a running app to taking payments is minutes.

## First: pick the workflow (ask the user)

There are **two ways** to use this skill. Before doing anything, ask the user
which they want — they are different setups:

> **Do you want to just deploy to the VPS (you develop on your own computer, the
> VPS only hosts), or do you want to develop AND host on the VPS itself the way
> levels.io does?**

| | **Path A — host only** | **Path B — develop on the VPS (the levels way)** |
|---|---|---|
| Where you code | your own laptop | **on the VPS**, via Claude Code in tmux |
| How code reaches prod | `rsync` + build-on-box (`deploy.sh`) | edited in place — already live (~3s restart) |
| Connect from | — | Termius (laptop **and** phone) over Tailscale |
| Good for | teams, staging boundary, regulated | solo / indie, cheapest always-on dev+host, code from anywhere |
| Read | this file's Phase 1 + 2 | `references/develop-on-vps.md` |

Both share the same hardened foundation below. They are **not** mutually
exclusive — a solo dev can do Path B and still `deploy.sh` to a separate staging
box. When unsure, Path B is "the full levels.io experience"; Path A is "the VPS is
just my cheap host."

## The stack (defaults — swap only with reason)

| Layer | Choice | Why |
|---|---|---|
| Host | Hetzner CPX21 (~$8/mo) or DigitalOcean equivalent, Ubuntu 24.04 LTS | flat price, plenty for a small/medium app |
| Network/SSH | **Tailscale** — SSH locked to the tailnet | SSH invisible on the public internet; lets you connect from anywhere incl. phone |
| App | Next.js App Router, `output: "standalone"` (or any Node app) | single self-contained process |
| DB | SQLite via `better-sqlite3`, WAL mode + `busy_timeout` | one file, no DB server, fast |
| Proxy / TLS | Caddy, reverse-proxy to `127.0.0.1:3000` | automatic HTTPS, 3-line config |
| Process mgmt | systemd unit, `Restart=always` | survives crashes and reboots |
| Dev (Path B) | Claude Code + tmux, Termius client | persistent on-box development from any device |
| Edge (optional) | Cloudflare in front | DNS, origin hiding, WAF, caching |
| Payments (optional) | Stripe subscriptions, webhook → SQLite entitlement | charge money; one account per product |
| Backups | Litestream → S3/R2 | continuous offsite SQLite replication |

Vertically scale the box (more RAM/CPU) long before you reach for distribution.

## How the pieces fit

```
        Tailscale (private)                    Internet
   you ── laptop / phone ──┐               (Cloudflare) ↓ :443
                           ▼                            ▼
                    ┌──────────────────────────────────────────┐
                    │  VPS  │ SSH:22 tailnet-only │ Caddy :443  │
                    │       │ Claude Code in tmux │   ↓ :3000   │
                    │       │ (Path B dev)        │ Next.js     │
                    │                               (systemd)    │
                    │                                  ↓          │
                    │                            SQLite (WAL) ──► Litestream → R2
                    └──────────────────────────────────────────┘
```

Read `references/architecture.md` for the hosting diagram + rationale,
`references/security-tailscale.md` for the network lockdown, and
`references/develop-on-vps.md` for the on-VPS development workflow.

## Shared foundation — Provision + secure (BOTH paths)

### Phase 0 — Create the VPS (optional; agent can do this)

If the user doesn't already have a server, create one for them rather than making
them click around a cloud console. `scripts/create-hetzner-server.sh` uses the
`hcloud` CLI to spin up a fresh Ubuntu box with the user's SSH key installed as
root — ready for Phase 1. Full walkthrough: `references/provision-hetzner.md`.

Steps for the agent:

1. Make sure the user has an SSH key (see "SSH keys" below — generate one if not).
2. Check `hcloud` is installed and authenticated: `hcloud server list`. If not,
   guide the user to create a Hetzner API token (Cloud Console → Security → API
   Tokens, **Read & Write**) and authenticate **themselves** so the token never
   passes through your tool calls — tell them to run, in-session,
   `! hcloud context create <name>` and paste the token at the hidden prompt. The
   token is a secret (it can create/delete servers); never put it in a script,
   config, or command line.
3. Edit the `CONFIG` block in `scripts/create-hetzner-server.sh` (`SERVER_NAME`,
   `SERVER_TYPE` default `cpx21`, `LOCATION`, `IMAGE`, `SSH_KEY_PUB`) and run it.
   It prints the new server's IP and the exact Phase 1 command.
4. **Second/Nth server:** change `SERVER_NAME` (and `DOMAIN`/`APP_NAME` in
   `provision.sh`) and run again. The script refuses to clobber an existing name.
   Each box is independent and joins the same tailnet. If the user says
   "provision another server for `<app>` at `<domain>`", run this whole chain
   (create → provision → Tailscale lockdown → their path) for the new box.

If the user already has a box (any provider) with root SSH, skip to Phase 1.

### Phase 1 — Provision (one time)

`scripts/provision.sh` is a **template**: review it, edit the `CONFIG` block, run
it as root on a fresh VPS. It will:

1. Create a non-root `deploy` user with sudo + your SSH key.
2. Lock down SSH: disable password auth and root login.
3. Firewall with `ufw`: allow 22, 80, 443 (22 is locked to the tailnet *later* —
   see below — so you don't get locked out mid-provision).
4. Enable `unattended-upgrades` and `fail2ban`.
5. Install **Tailscale** (daemon only; you run `tailscale up` after).
6. Install Node LTS and Caddy.
7. Create app dirs (`/srv/<app>`, `/srv/<app>-build`, `/var/lib/<app>`) owned by
   `deploy`, and the secrets file `/etc/<app>/env` (mode `0640`, `root:deploy`).
8. Write a `Caddyfile` (`DOMAIN` → `reverse_proxy 127.0.0.1:3000`) and a systemd
   unit for the app.

Steps for the agent:

1. Ask for `APP_NAME`, `DOMAIN`, `DEPLOY_USER` (default `deploy`), and the VPS IP /
   root access.
2. **Set up the SSH key for the user** (do this yourself — see "SSH keys" below —
   don't make them figure it out). The deploy user must trust a key before SSH is
   locked down.
3. Edit the `CONFIG` block at the top of `scripts/provision.sh` (paste the public
   key from step 2 into `DEPLOY_SSH_PUBKEY`).
4. Have the user copy it to the box and run as root:
   `scp scripts/provision.sh root@SERVER:/tmp/ && ssh root@SERVER 'bash /tmp/provision.sh'`.
5. Generate app secrets **server-side** (`openssl rand -base64 32`) into
   `/etc/<app>/env`. Transfer third-party creds out-of-band (see Secrets).

### SSH keys — generate locally + install on the box (agent-driven)

Do this for the user. A public key is **not** a secret, so it's safe to read,
paste into configs, and `echo` onto the box. (A *private* key never leaves the
machine it was generated on.)

**First device (the user's computer, where you're running):**

1. Check for an existing key:
   ```bash
   ls ~/.ssh/id_ed25519.pub 2>/dev/null && cat ~/.ssh/id_ed25519.pub
   ```
2. If there's none, generate one (no passphrase keeps phone/Termius login simple;
   offer a passphrase + ssh-agent if the user wants more security):
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C "<DEPLOY_USER>@<APP_NAME>"
   ```
3. Read the public key (`cat ~/.ssh/id_ed25519.pub`) and paste it into
   `DEPLOY_SSH_PUBKEY` in `provision.sh`. For Path A, point `SSH_KEY` in
   `deploy.sh` at the matching private key (`~/.ssh/id_ed25519`).

**Adding another device later (e.g. the user's phone):** you can't run commands on
their phone, so the phone generates its *own* key in Termius (Keychain → New Key →
Generate). Have the user paste that device's **public** key to you, then install
it on the box yourself:

```bash
ssh <DEPLOY_USER>@<HOST> 'umask 077; echo "ssh-ed25519 AAAA...phone..." >> ~/.ssh/authorized_keys'
```

`<HOST>` is the tailnet IP once Tailscale is up, otherwise the public IP. No
private key is ever copied between devices.

### Phase 1b — Tailscale lockdown (recommended, both paths)

This is what levels does on every new box: SSH only over the tailnet. **Order
matters or you lock yourself out** — full detail in
`references/security-tailscale.md`:

1. On the box: `sudo tailscale up` (follow the auth link), then `tailscale ip -4`.
2. Install Tailscale on your laptop/phone, same account.
3. **Confirm** `ssh deploy@100.x.y.z` works over the tailnet (new terminal, keep
   the old session open as a fallback).
4. Only then: `bash scripts/lock-down-tailscale.sh` on the box — restricts SSH 22
   to the tailnet (and optionally 443 to Cloudflare IPs).

## Path A — Deploy from your computer (host only)

`scripts/deploy.sh` is a **template** run from your dev machine. The key trick:
**build on the box** so native modules (`better-sqlite3`) compile for the server.
It rsyncs your tree → `/srv/<app>-build`, runs `npm ci && npm run build` on the
box, assembles the standalone output (copying `.next/static`, `public`, and the
`better-sqlite3` `.node` binding), swaps it into `/srv/<app>`, restarts the
service, and health-checks the domain.

Steps for the agent:

1. Confirm the app's `next.config.*` sets `output: "standalone"`.
2. Edit the `CONFIG` block in `scripts/deploy.sh` (`SSH_HOST`, `SSH_KEY`,
   `APP_NAME`). If SSH is locked to the tailnet, `SSH_HOST` uses the tailnet IP.
3. Run it. On failure, consult `references/troubleshooting.md`.

## Path B — Develop ON the VPS (the levels.io way)

The full levels workflow: code lives on the box, Claude Code runs in tmux, you
connect from laptop or phone via Termius over Tailscale, and edits are basically
already live. **Read `references/develop-on-vps.md` for the end-to-end walkthrough.**

Setup, after Phase 1 + Tailscale:

1. On the box: `bash scripts/setup-dev-on-vps.sh` — installs tmux + Claude Code
   and adds the `tm` "one tmux session per folder" helper to `~/.bashrc`.
2. Put the code where it serves (clone the repo into `/srv/<app>` or a per-site
   folder like levels' `/srv/http/<site>.com`).
3. Log Claude Code in on the headless box: `claude` → `/login` → use the
   browser-link flow (open the link on any device, paste the code back) or an API
   key. See `references/develop-on-vps.md`.
4. Add a Termius host per site with startup snippet `cd /srv/<app> && tm`, on both
   laptop and phone, pointed at the tailnet IP.
5. Develop. Detach with `Ctrl-b d` — Claude keeps running; reattach from any
   device. The tmux mechanics are in `references/remote-claude-code-tmux.md`
   (also publishable on its own).

## Phase 3 — Put a domain on it (Cloudflare)

Once the app serves on the box, give it a real domain with auto-HTTPS, DDoS
protection, and a hidden origin. **Requirement:** a domain you own that's already
an **Active zone** in a Cloudflare account (nameservers pointed at Cloudflare —
that registrar step can't be scripted). Then it's one **proxied A record** →
your VPS IP, plus **SSL mode Full (strict)**.

Ask the user which mode they want:

- **Full-auto** — they give the agent a scoped Cloudflare API token; the agent runs
  `scripts/setup-cloudflare-dns.sh` to create the record and set SSL mode.
- **Manual** — they add the A record in the dashboard; the agent verifies with
  `dig`/`curl` that traffic resolves through Cloudflare.

Then lock the origin to Cloudflare only (set `CLOUDFLARE_ONLY_443="true"` in
`scripts/lock-down-tailscale.sh` and run it — *after* confirming the site loads
through Cloudflare). Full walkthrough: `references/domain-cloudflare.md`. A public
domain is a prerequisite for the Stripe webhook in Phase 4.

## Phase 4 — Charge money (Stripe)

Turn the app into one that takes payments: a product with monthly + annual prices,
a webhook that writes subscription state into SQLite, and an entitlement gate that
unlocks paid features only while paid-through. **Requirement:** an **activated**
Stripe account (can accept live charges); an unactivated account can still build
and test everything in **test mode**.

Ask the user which mode they want:

- **Full-auto** — they hand the agent a full-access live secret key (`sk_live_…`,
  read from a `0600` file); the agent runs `scripts/setup-stripe.sh` to create the
  product, both prices, and the webhook in one shot.
- **Manual** — they click through the Stripe dashboard; the agent verifies each
  price/webhook read-only (what most people did before automating).

Two gotchas the reference covers: **grandfather existing users in the same
migration that ships the paywall** (or you lock everyone out), and **give each
product its own Stripe account** under one Organization (not Connect) so the
customer never sees the parent company at checkout. Always run a **test-mode smoke**
(buy with `4242…`, confirm unlock, cancel, confirm lock) before real money, then a
one-time **live smoke + refund**. Full walkthrough: `references/monetize-stripe.md`.

## Secrets — non-negotiable rules

- Secrets live **only** in `/etc/<app>/env` on the server (mode `0640`,
  owner `root:deploy`). **Never** in the repo, the DB, or logs.
- Generate strong secrets **server-side**: `openssl rand -base64 32`.
- The deploy script / systemd unit `source`s / loads `/etc/<app>/env` — it never
  bakes secrets into the build or prints them.
- Transfer third-party credentials **out-of-band**: `scp` a temp file, extract
  into `/etc/<app>/env`, then `shred -u` the temp file. **Never** `echo` a
  credential on the command line (it lands in shell history and logs).
- An Anthropic API key used for Path B Claude Code login is a secret too — prefer
  the browser-link login, or keep the key out of the repo.

## SQLite gotcha (read before first build)

Set `busy_timeout` **before** switching the database to WAL mode, or the first
write during build/migration can fail with `SQLITE_BUSY`:

```js
const db = require("better-sqlite3")(process.env.DATABASE_PATH);
db.pragma("busy_timeout = 5000"); // FIRST
db.pragma("journal_mode = WAL");  // THEN
```

The DB file lives outside the deploy target (e.g. `/var/lib/<app>/data.db`) so
`rsync --delete` never wipes it.

## References

- `references/provision-hetzner.md` — create the server itself with `hcloud`
  (API token, first + Nth server), plus a DigitalOcean (`doctl`) alternative.
- `references/architecture.md` — hosting diagram, per-layer rationale, scaling,
  backups (Litestream → R2).
- `references/security-tailscale.md` — Tailscale lockdown, lockout-safe ordering,
  recovery.
- `references/develop-on-vps.md` — Path B end to end: Termius, Claude Code login,
  the live-edit workflow, phone development.
- `references/remote-claude-code-tmux.md` — the tmux/persistent-Claude-Code
  module (self-contained; also published standalone).
- `references/domain-cloudflare.md` — Phase 3: put a domain on Cloudflare, proxied
  A record → VPS, Full (strict) SSL, origin lockdown. Full-auto or manual.
- `references/monetize-stripe.md` — Phase 4: Stripe subscriptions end to end —
  product/prices/webhook, entitlement gate, grandfathering, account-per-product,
  test + live smoke. Full-auto or manual.
- `references/troubleshooting.md` — `SQLITE_BUSY`, native bindings, Caddy certs,
  systemd env, `/srv` perms, plus Claude-login / tmux / Tailscale-lockout fixes.

## Scripts

- `scripts/create-hetzner-server.sh` — create the VPS itself via `hcloud` (Phase 0).
- `scripts/provision.sh` — one-time server lockdown + install, incl. Tailscale.
- `scripts/lock-down-tailscale.sh` — restrict SSH to the tailnet (+ optional
  Cloudflare-only 443). Run after Tailscale is confirmed working.
- `scripts/setup-dev-on-vps.sh` — Path B: install Claude Code + tmux + `tm` helper.
- `scripts/deploy.sh` — Path A: repeatable build-on-box deploy.
- `scripts/setup-cloudflare-dns.sh` — Phase 3 full-auto: create the proxied A
  record + set SSL mode via the Cloudflare API.
- `scripts/setup-stripe.sh` — Phase 4 full-auto: create the product, monthly +
  annual prices, and the webhook endpoint via a live secret key.

All use `set -euo pipefail`, are commented, and have a clearly marked `CONFIG`
block at the top. Review and edit before running.
