# Troubleshooting

Common failures during provisioning and deploy, with the fix.

## `SQLITE_BUSY` during build or migration

**Symptom:** `npm run build` or `drizzle-kit migrate` fails with
`SqliteError: database is locked` / `SQLITE_BUSY`.

**Cause:** WAL mode was enabled before a `busy_timeout` was set, so a concurrent
writer (e.g. Next.js prerendering pages that hit the DB while a migration runs)
immediately errors instead of waiting.

**Fix:** Set `busy_timeout` **before** switching to WAL, every time you open the
database:

```js
const db = require("better-sqlite3")(process.env.DATABASE_PATH);
db.pragma("busy_timeout = 5000"); // FIRST — wait up to 5s for the lock
db.pragma("journal_mode = WAL");  // THEN
```

If it still locks during build, your build is doing DB writes it shouldn't —
move migrations to a dedicated deploy step (see `deploy.sh` step 3) rather than
running them as a side effect of the build.

## `better-sqlite3` native binding missing in standalone

**Symptom:** App boots then crashes with
`Could not locate the bindings file` / `Error: Cannot find module '.../better_sqlite3.node'`,
or `invalid ELF header` / `wrong ABI version`.

**Causes & fixes:**

1. **Built on your laptop, shipped to the server.** The compiled `.node` is for
   your machine's OS/CPU/Node ABI, not the server's. **Always build on the box**
   (this is what `deploy.sh` does). Never `rsync` your local `node_modules`.

2. **Next.js standalone tracing dropped the binding.** Standalone output uses
   file tracing and can miss the `.node` file. `deploy.sh` step 4 explicitly
   copies the binding into `.next/standalone/...`. If you customized the deploy,
   ensure that copy still happens. You can also pin it via
   `experimental.outputFileTracingIncludes` in `next.config.js`:

   ```js
   module.exports = {
     output: "standalone",
     experimental: {
       outputFileTracingIncludes: {
         "/**": ["./node_modules/better-sqlite3/build/Release/*.node"],
       },
     },
   };
   ```

3. **Node version mismatch.** The Node that built the binding differs from the
   Node systemd runs. Keep them identical (the same `node` on the box does both).

## Caddy can't get a TLS certificate

**Symptom:** `https://domain` shows a cert error;
`journalctl -u caddy` shows ACME challenge failures.

**Checklist:**

- **DNS** A record for the domain points at the server's public IP, and has
  propagated (`dig +short yourdomain`).
- **Ports 80 and 443 open** in `ufw` (`sudo ufw status`) and at the cloud
  provider's firewall. Caddy needs port 80 for the HTTP-01 challenge.
- **Cloudflare proxy.** If the orange cloud is on, Cloudflare may already be
  terminating TLS. Either set Cloudflare SSL mode to **Full (strict)** so it
  talks HTTPS to your origin, or turn the proxy off until Caddy has issued the
  cert, then re-enable.
- **Rate limits.** Repeated failures can hit Let's Encrypt rate limits. Use
  Caddy's staging CA while debugging, then switch back.
- Reload after editing: `sudo systemctl reload caddy` (or `caddy validate
  --config /etc/caddy/Caddyfile` first).

## systemd not picking up env / secrets

**Symptom:** App starts but acts as if env vars are empty (e.g. `DATABASE_PATH`
undefined, auth secret missing).

**Checklist:**

- The unit has `EnvironmentFile=/etc/<app>/env` and that path exists.
- The deploy user can read it: `/etc/<app>/env` is mode `0640`, owner
  `root:<deploy_user>`, and the service `User=` is that deploy user.
- **`EnvironmentFile` is not a shell.** No `export`, no quoting, no `$VAR`
  expansion, no command substitution — just `KEY=value` lines. If you wrote
  `export FOO=bar`, the variable becomes literally `export FOO`.
- After editing the unit: `sudo systemctl daemon-reload && sudo systemctl
  restart <app>`. Editing the env file alone needs only a `restart`.
- Inspect what the service actually sees: `sudo systemctl show <app> -p Environment`.

## Permission denied on `/srv`

**Symptom:** `rsync`/`deploy.sh` fails with `Permission denied` writing to
`/srv/<app>` or `/srv/<app>-build`; or the app can't write the DB.

**Checklist:**

- The app/build dirs are owned by the deploy user:
  `sudo chown -R <deploy_user>:<deploy_user> /srv/<app> /srv/<app>-build`.
- You're connecting as the **deploy user**, not root, and the SSH key matches.
- The DB dir is writable by the service: `/var/lib/<app>` owned by the deploy
  user. The systemd unit's `ReadWritePaths=/var/lib/<app>` must include it (with
  `ProtectSystem=full`, everything else is read-only).
- `sudo` deploy steps (the `systemctl restart`) require the deploy user to have
  sudo. `provision.sh` grants passwordless sudo via
  `/etc/sudoers.d/90-<deploy_user>`.

## App restarts in a loop

**Symptom:** `systemctl is-active` flaps; `journalctl -u <app>` shows repeated
starts.

**Debug:**

```bash
journalctl -u <app> -n 100 --no-pager
```

Common causes: a missing secret (see env section), the DB binding issue above,
port 3000 already in use, or a crash on boot. With `Restart=always` systemd will
keep retrying, so the logs are your source of truth.

## Locked out after Tailscale lockdown

**Symptom:** after `lock-down-tailscale.sh`, you can no longer SSH in — the
connection times out.

**Cause:** SSH is now restricted to the `tailscale0` interface, but your client
isn't reaching the box over the tailnet (Tailscale down on your side, you're
using the public IP instead of the `100.x.y.z` address, or the box dropped off
the tailnet).

**Fix:**

- First, just connect over the tailnet: `tailscale status` on your laptop, then
  `ssh deploy@<100.x.y.z>` (the box's `tailscale ip -4`), not the public IP.
- If the box itself fell off the tailnet, use your provider's **web console /
  VNC** (Hetzner Cloud Console, DigitalOcean Droplet Console) to get a shell, then
  re-open SSH and fix Tailscale:
  ```bash
  sudo ufw allow 22/tcp && sudo ufw reload
  sudo tailscale up
  ```
- Keep that out-of-band console login handy *before* you lock down — it's your
  only way back in if the tailnet is unreachable.

## Claude Code won't log in on the box (Path B)

**Symptom:** `claude` / `/login` on the server can't open a browser, or the login
never completes.

**Cause:** the box is headless — there's no browser for the OAuth redirect.

**Fix:** use the **browser-link flow**, not a local browser. Claude Code prints a
URL and a code; open the URL on *any* device (laptop or phone), authenticate,
then **paste the code back** into the terminal. Alternatively set an API key
(`ANTHROPIC_API_KEY`, or paste when prompted). Do this *inside* a tmux session so
the login persists with the session. If you're on a phone via Termius: long-press
to copy the URL, open it in your browser, approve, copy the code, paste it back.

## Claude Code (or a long task) dies when I disconnect (Path B)

**Symptom:** you close your laptop / lose signal and Claude Code stops mid-task;
reconnecting shows it gone.

**Cause:** you started `claude` in a plain SSH shell, not inside tmux. When the
SSH connection drops, the shell and everything in it are killed.

**Fix:** always run Claude **inside a tmux session**. With the `tm` helper
installed (`setup-dev-on-vps.sh`), `cd /srv/<app> && tm` first, *then* `claude`.
Detach with `Ctrl-b d` instead of closing the connection cold. Reattach later
with `tm` (or it auto-attaches on login). See
`remote-claude-code-tmux.md`.

## tmux session piling up / wrong session on connect (Path B)

**Symptom:** `tmux ls` shows many near-duplicate sessions, or connecting drops
you into the wrong one.

**Cause:** sessions created ad-hoc with `tmux new` instead of the folder-named
`tm` helper, or the Termius startup snippet doesn't `cd` into the site folder
first.

**Fix:** rely on `tm` (one session per folder) and set each Termius host's
startup command to `cd /srv/<app> && tm`. Kill strays with
`tmux kill-session -t <name>`. Note: tmux sessions do **not** survive a reboot —
the *app* survives because it runs under systemd; your dev session you just
recreate with `tm`.
