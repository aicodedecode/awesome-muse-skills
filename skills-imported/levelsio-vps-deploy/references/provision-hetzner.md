# Creating the server (Hetzner Cloud)

The rest of this skill assumes you have a fresh Ubuntu box with root SSH access.
This doc gets you that box — and Claude (with this skill) can do most of it for
you with the `hcloud` CLI, so you never have to learn the Hetzner console.

> Prefer DigitalOcean? The same flow works with `doctl` — see the end.

## What you'll end up with

A bare Ubuntu 24.04 server with your SSH key installed as root, at a known IP,
ready for `provision.sh`. `scripts/create-hetzner-server.sh` does the actual
creation.

## One-time setup

### 1. Make a Hetzner account + project

Sign up at <https://console.hetzner.cloud>, then create a **Project** (a
container for your servers — e.g. "personal-apps").

### 2. Create an API token

In the Cloud Console: **your project → Security → API Tokens → Generate API
token**. Give it **Read & Write** permission. Copy the token now — Hetzner shows
it only once.

> The token is a **secret** (it can create and delete servers and run up a bill).
> Treat it like a password: scope it to one project, never commit it, never paste
> it into a script or chat, and revoke it from the same page if it ever leaks.

### 3. Install the hcloud CLI

```bash
brew install hcloud           # macOS / Linuxbrew
# or: see https://github.com/hetznercloud/cli/releases for a binary
```

### 4. Authenticate (token stays out of the agent)

Run this **yourself** so the token is typed at a hidden prompt and never passes
through Claude's tool calls or your shell history. In Claude Code you can run it
in-session with the `!` prefix:

```bash
! hcloud context create personal-apps
```

Paste the token at the prompt. `hcloud` stores it in `~/.config/hcloud/cli.toml`
for future commands. (Alternatively `export HCLOUD_TOKEN=...` in your shell, but
the context method keeps it out of your environment and logs.)

Verify it works:

```bash
hcloud server list      # should succeed (empty list is fine)
```

After this, Claude can run `hcloud` commands on your behalf — it uses the stored
credential and never needs to see the token itself.

## Create the server

1. Make sure you have an SSH key (the skill's agent can generate one — see the
   "SSH keys" section in `../SKILL.md`). The public key path goes in the script's
   `SSH_KEY_PUB`.
2. Edit the `CONFIG` block in `scripts/create-hetzner-server.sh`:
   - `SERVER_NAME` — a label (e.g. your app name).
   - `SERVER_TYPE` — `cpx21` (3 vCPU / 4 GB, ~€8/mo) is the skill's default.
     `hcloud server-type list` shows all options and prices.
   - `LOCATION` — `nbg1`/`fsn1`/`hel1` (EU), `ash`/`hil` (US).
     `hcloud location list`.
   - `IMAGE` — `ubuntu-24.04`. `hcloud image list --type system`.
3. Run it:
   ```bash
   bash scripts/create-hetzner-server.sh
   ```
   It uploads your key, creates the server, and prints the IP plus the exact
   `provision.sh` command to run next.

## Provisioning a second (or third…) server

Each server is independent — one box per app is fine. To add another:

1. In `create-hetzner-server.sh`, change `SERVER_NAME` (and pick a `LOCATION`/
   `SERVER_TYPE` if different). Run it again — the script refuses to clobber an
   existing server of the same name, so you can't overwrite the first.
2. In `provision.sh`, change `APP_NAME` and `DOMAIN` for the new app, then
   provision the new box.
3. Repeat the Tailscale lockdown and your chosen path. The new box joins the same
   tailnet, so it shows up alongside the others in `tailscale status`.

If you just want to ask Claude: **"provision a second server for `<app>` at
`<domain>`"** — with this skill loaded it knows to create the box
(`create-hetzner-server.sh`), provision it, lock it to the tailnet, and set up
your path.

## Managing servers

```bash
hcloud server list                         # all your servers + IPs + status
hcloud server ip <name>                     # just the IP
hcloud server reboot <name>                 # reboot
hcloud server change-type <name> cpx31      # vertical scale (resize) — the levels way
hcloud server delete <name>                 # destroy it (careful — irreversible)
```

`change-type` is how you "scale up before you scale out": bump to a bigger box
when one fills up, instead of adding distributed-systems complexity.

## DigitalOcean alternative

The same idea with `doctl`:

```bash
brew install doctl
doctl auth init                                   # paste your DO API token (hidden)
doctl compute ssh-key import <name> --public-key-file ~/.ssh/id_ed25519.pub
doctl compute droplet create <name> \
  --image ubuntu-24-04-x64 --size s-2vcpu-4gb --region nyc1 \
  --ssh-keys <fingerprint>
doctl compute droplet list                        # get the IP
```

Then hand the IP to `provision.sh` exactly as with Hetzner.
