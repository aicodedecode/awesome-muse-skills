# Architecture

The whole point: **one cheap box runs everything**, with boring, well-understood
tech. You scale by buying a bigger box, not by adding distributed-systems
complexity. When (if) you outgrow one server, you'll have real revenue and real
load to justify the move.

## Diagram

```
                       ┌─────────────────────────────────────────────┐
   Internet            │                  Your VPS                    │
      │                │              (Hetzner CPX21, ~$8/mo)         │
      │                │                                              │
      ▼                │   ┌──────────┐      ┌────────────────────┐   │
 ┌──────────┐  :443    │   │  Caddy   │ :3000│  Next.js standalone │   │
 │Cloudflare│ ───────► │   │  (TLS,   ├─────►│  (systemd service,  │   │
 │ (optional│   HTTPS  │   │  reverse │      │   Restart=always)   │   │
 │  edge)   │          │   │  proxy)  │      └─────────┬──────────┘   │
 └──────────┘          │   └──────────┘                │              │
                       │                               ▼              │
                       │                     ┌────────────────────┐   │
                       │                     │  SQLite (WAL)       │   │
                       │                     │  /var/lib/<app>/    │   │
                       │                     │       data.db       │   │
                       │                     └─────────┬──────────┘   │
                       │                               │              │
                       │                     ┌─────────▼──────────┐   │
                       │                     │  Litestream        │   │
                       │                     │  (continuous repl) │   │
                       │                     └─────────┬──────────┘   │
                       └───────────────────────────────┼─────────────┘
                                                        ▼
                                            ┌────────────────────┐
                                            │  S3 / Cloudflare R2 │
                                            │  (offsite backup)   │
                                            └────────────────────┘
```

## Why each piece

### Host — Hetzner CPX21 (~$8/mo) / DigitalOcean equivalent
A flat monthly price that includes CPU, RAM, disk, and generous bandwidth. No
per-request, per-GB, or per-function-invocation surprises. A CPX21 (3 vCPU /
4 GB / 80 GB) comfortably runs a small-to-medium app plus its database.

### App — Next.js `output: "standalone"` (or any Node app)
`standalone` mode produces a self-contained `server.js` plus a trimmed
`node_modules`, so the deploy is one process you can start with `node server.js`.
No PM2 cluster, no container runtime. Any Node app works the same way; only the
build step differs.

### DB — SQLite via `better-sqlite3`
For a single-box app, SQLite is not a toy — it's the right default. The database
is one file on local disk, so reads/writes never cross a network. With WAL mode,
readers don't block the writer. `better-sqlite3` is synchronous and fast, which
suits Node's request model well here.

Configuration that matters:

```js
const db = require("better-sqlite3")(process.env.DATABASE_PATH);
db.pragma("busy_timeout = 5000"); // set BEFORE WAL — avoids build-time SQLITE_BUSY
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL"); // safe with WAL, much faster than FULL
```

The file lives at `/var/lib/<app>/data.db`, **outside** the deploy target, so
`rsync --delete` during deploys never touches it.

### Proxy / TLS — Caddy
Caddy gets and renews TLS certificates automatically (Let's Encrypt) with a
three-line config, and reverse-proxies `https://domain` → `127.0.0.1:3000`. It's
dramatically simpler than nginx + certbot for this use case.

### Process management — systemd
A plain systemd unit with `Restart=always` keeps the app running across crashes
and reboots, loads secrets via `EnvironmentFile`, and runs as a non-root user.
`journalctl -u <app>` gives you logs for free.

### Edge (optional) — Cloudflare
Put Cloudflare in front for DNS, origin-IP hiding, a WAF, basic rate limiting,
and caching of static assets. Free tier is plenty to start. Optional — Caddy
already terminates TLS, so you can ship without it.

## Scaling notes

Scale **up** before you scale **out**:

1. **Bigger box.** Resize the VPS to more vCPU/RAM. This is one click and a
   reboot, and gets you very far.
2. **Tune SQLite.** WAL + `synchronous = NORMAL`, sensible indexes, and keeping
   the working set in page cache handle a lot of traffic.
3. **Offload static/edge.** Let Cloudflare cache assets; serve user uploads from
   object storage (R2/S3) rather than the box's disk.
4. **Only then** consider read replicas (e.g. Litestream/LiteFS read-replication)
   or moving the DB to a managed Postgres. By that point you have the revenue to
   pay for it.

A single modest VPS realistically serves a large fraction of bootstrapped SaaS
workloads. Distribute when load forces you to, not preemptively.

## Backups — Litestream → S3 / R2 (recommended)

SQLite's weakness on a single box is that the data lives in one place. Fix it
with [Litestream](https://litestream.io), which **continuously streams** the
SQLite WAL to object storage. You get point-in-time recovery with seconds of
lag, and restoring is a single command onto a fresh box.

Sketch:

1. Install Litestream on the VPS (apt package or single binary).
2. Configure `/etc/litestream.yml` to replicate the DB file to an R2/S3 bucket:

   ```yaml
   dbs:
     - path: /var/lib/myapp/data.db
       replicas:
         - type: s3
           bucket: myapp-backups
           path: data.db
           endpoint: https://<accountid>.r2.cloudflarestorage.com
           # access key / secret read from env (set via systemd EnvironmentFile)
   ```

3. Run Litestream as its own systemd service (`litestream replicate`).
4. Disaster recovery: `litestream restore -o /var/lib/myapp/data.db s3://...`
   on a freshly provisioned box, then start the app.

Cloudflare R2 is a good target: S3-compatible API and no egress fees. Keep the
R2 credentials in `/etc/<app>/env` (or a Litestream-specific env file) — never
in the repo. Periodically test a restore; a backup you've never restored is a
hope, not a backup.
