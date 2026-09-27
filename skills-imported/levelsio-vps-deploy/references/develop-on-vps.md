# Path B — Develop ON the VPS (the levels.io way)

This is how levels.io actually works, and what makes his setup different from
"deploy to a server." He doesn't develop locally and ship. **He develops *on* the
box**, with Claude Code, and the edits are basically already live:

> "I've been coding almost solely on my VPS with Claude Code for almost a year
> now. You can switch to phone or any other device whenever you want to continue.
> It just keeps going all night while you sleep. It just live-edits my production
> server" — deploys reduced to roughly 3 seconds.

Path A treats the VPS as a host you push to. **Path B treats the VPS as your
development machine that also happens to serve the app.** One box, one place the
code lives, edited in place from your laptop or your phone.

## When to choose Path B vs Path A

- **Path B (this doc):** solo dev / indie / vibe-coder, want the cheapest always-on
  dev+host setup, want Claude Code working while you're away, want to code from
  your phone. The levels way.
- **Path A (`../SKILL.md` deploy flow):** you want a real boundary between dev and
  prod, work on a team, are in a regulated environment, or want preview/staging.
  Develop wherever, deploy to the box for cheap hosting.

You can also do **both**: develop on the VPS for speed, but keep a separate
staging box and run `deploy.sh` to it before promoting. levels notes that solo
this is fine, but "staging servers would be preferable in team or regulated
environments."

## The pieces

| Piece | Role |
|---|---|
| **Tailscale** | private network: your laptop + phone + VPS, nobody else. SSH only over this. See `security-tailscale.md`. |
| **Termius** | the SSH client you use on laptop *and* iPhone, one profile per site, auto-reconnecting. (Any SSH client works; levels uses Termius. Termux on Android is an alternative.) |
| **tmux** | keeps Claude Code + your shell alive on the box across disconnects. See `remote-claude-code-tmux.md`. |
| **Claude Code** | runs on the box; edits the code that's actually serving. |
| **Caddy + systemd + SQLite** | same hosting foundation as Path A (`architecture.md`). |
| **Cloudflare** | in front of 443. |

## One-time setup

Assuming `provision.sh` has run and the box is on your tailnet
(`security-tailscale.md`):

1. On the box, install the dev tooling:
   ```bash
   bash scripts/setup-dev-on-vps.sh     # tmux + Claude Code + tm() helper
   ```
2. Put your code where it runs. levels keeps each site in its own folder, e.g.
   `/srv/http/<site>.com` (this skill's Path A uses `/srv/<app>`). Clone your
   repo into that folder as the deploy user:
   ```bash
   su - deploy
   git clone <your-repo> /srv/myapp     # or develop directly in /srv/myapp
   ```
3. Log Claude Code in (see next section).

## Logging Claude Code in on a remote box

There's no browser on the server, so use one of these from inside a tmux session
(`cd /srv/myapp && tm`, then `claude`, then `/login`):

- **Browser-link flow (recommended, no key to manage):** Claude Code prints a URL
  and a code. Open the URL on *any* device — your laptop or your phone — log in to
  your Claude account, and **paste the code back** into the terminal. This is the
  flow to use from Termius on a phone: tap the link, approve, copy the code, paste
  it into the session.
- **API key:** paste an Anthropic API key when prompted (or set
  `ANTHROPIC_API_KEY` in the environment). Simpler to script, but it's a
  long-lived secret on the box — store it like any other secret (not in the repo).

Either way you only do this once per box; the login persists.

## Connecting from Termius (laptop AND phone)

Create **one Termius host per site** so you drop straight into the right tmux
session. This is the trick that makes switching devices seamless — levels has a
profile per site, each auto-reconnecting.

- **Host / address:** the box's tailnet IP (`tailscale ip -4`, a `100.x.y.z`).
  Using the tailnet address is what lets the phone connect from anywhere.
- **User:** your deploy user.
- **SSH key:** each device needs a key the box trusts. Your laptop's key was added
  at provisioning. For a *new* device (e.g. your phone), generate a key in Termius
  (Keychain → New Key), copy its **public** key, and append it to the box —
  `echo "ssh-ed25519 AAAA...phone..." >> ~/.ssh/authorized_keys` (run it from a
  device that already gets in, or via the provider's web console). No need to copy
  private keys between devices.
- **Startup snippet / "run command on connect":**
  ```bash
  cd /srv/myapp && tm
  ```
  `tm` attaches to (or creates) the session named after the folder, so reconnecting
  from any device lands you exactly where you left off, Claude Code still running.

Enable Termius's keep-alive / auto-reconnect so flaky phone connections silently
re-establish. On Android, **Termux + Tailscale + OpenSSH** is the common
equivalent.

## The everyday workflow

```
1. Open Termius (laptop or phone) → tap the site → you're in its tmux session.
2. Claude Code is already running (it never stopped). Tell it what to build/fix.
3. It edits the files in /srv/myapp — the same files that serve the site.
4. See the change live:
     - dev server (fast iteration):  run `npm run dev` in a second pane and hit
       the dev port over the tailnet, OR
     - production restart (~3s):      rebuild if needed and
       `sudo systemctl restart myapp`  (the Path A app service).
5. Ctrl-b d to detach. Claude keeps working. Walk away.
6. Reconnect later from any device — pick up exactly where it was.
```

For a Next.js production app the "live edit" is: edit → (build if needed) →
`systemctl restart`. For simpler apps (static files, or a watch/restart dev
loop) edits are effectively instant — which is where levels' "3 seconds" comes
from.

## Remote control from the Claude app

Because Claude Code lives in a tmux session that never dies, you can also drive it
from the **Claude app's remote session** feature rather than a terminal — useful
on a phone. The tmux session is what keeps the process alive between reconnects.
See `remote-claude-code-tmux.md`.

## Keep your safety net

Developing on production means you're editing the live thing. levels' guardrail is
backups: "3-2-1 backups, multiple on-site and off-site." Keep
**Litestream → R2** running (see `architecture.md`) and use git in each site
folder so any bad edit is one `git restore` away. A live-edit workflow without
backups + version control is a gun pointed at your own foot.
