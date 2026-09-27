# Remote Claude Code in tmux (persistent sessions)

> This module is self-contained on purpose. It teaches one thing: **run Claude
> Code on a remote machine so it survives disconnects.** It's used by Path B of
> this skill, but it works on *any* always-on box (a VPS, a spare desktop, a Pi)
> — which is why it's also published on its own.

## The problem it solves

If you SSH into a box, start `claude`, and close your laptop, the SSH session
dies and **Claude Code dies with it** — mid-task, losing its place. tmux fixes
this: it runs your shell (and Claude) inside a session that lives on the
*server*, independent of any connection. Disconnect, and it keeps running. levels
puts it this way: with Claude in tmux on the VPS, "it just keeps going all night
while you sleep," and you can "switch to phone or any other device whenever you
want to continue."

## What is tmux (60-second version)

tmux = "terminal multiplexer." It hosts long-lived **sessions** on the machine.
You **attach** to a session to see it, **detach** to leave it running. The
process inside (Claude Code, a dev server, a build) never knows you left.

| Action | Keys / command |
|---|---|
| Detach (leave it running) | `Ctrl-b` then `d` |
| List sessions | `tmux ls` |
| Attach to a session | `tmux attach -t <name>` |
| New named session | `tmux new -s <name>` |
| Scroll back / copy mode | `Ctrl-b` then `[` (arrows/PgUp; `q` to exit) |
| Kill a session | `tmux kill-session -t <name>` |

`Ctrl-b` is the default "prefix" — you press it, release, then press the command
key. That's the only tmux muscle memory you need to start.

## The `tm` helper — one session per directory

Naming and reusing sessions by hand gets old fast, and you end up with a pile of
duplicate sessions. This is the helper levels uses (written by Claude Code): drop
it in `~/.bashrc` and `tm` creates-or-attaches a session named after the current
folder. One folder → one session, forever.

```bash
# tmux session per folder. `tm` (no args) attaches to / creates a session
# named after the current dir's basename. `tm name` overrides the name.
# Works whether already inside tmux (uses switch-client) or outside it.
tm() {
  command -v tmux >/dev/null 2>&1 || { echo "tmux not installed"; return 1; }
  local name="${1:-$(basename "$PWD")}"
  # tmux session names can't contain '.' or ':' — replace with '-'
  name="${name//./-}"
  name="${name//:/-}"
  if [ -n "$TMUX" ]; then
    tmux has-session -t "$name" 2>/dev/null || tmux new-session -d -s "$name" -c "$PWD"
    tmux switch-client -t "$name"
  else
    tmux attach -t "$name" 2>/dev/null || tmux new -s "$name" -c "$PWD"
  fi
}

# Auto-attach on interactive login: picks a session named after wherever you
# land. Plain `ssh server` lands in $HOME -> session "<user>". Use
# `ssh server -t "cd /srv/sm.levels.io && bash -l"` to land in a site folder ->
# session "sm-levels-io". Skips inside tmux and non-interactive shells so
# scp/rsync/scripted ssh keep working.
if command -v tmux >/dev/null 2>&1 && [ -z "$TMUX" ] && [[ $- == *i* ]]; then
  tm
fi
```

Why each line earns its place:

- **`tm name` override** — start a second session in the same folder when you
  want one (e.g. `tm logs` next to the default).
- **`.`/`:` → `-`** — tmux rejects those characters in session names, so a folder
  like `sm.levels.io` becomes session `sm-levels-io` instead of erroring.
- **inside-tmux branch (`$TMUX`)** — `switch-client` moves you between sessions
  without nesting tmux inside tmux (which is confusing and breaks the prefix).
- **auto-attach guard (`[[ $- == *i* ]]`)** — only fires for *interactive* logins.
  Non-interactive shells (scp, rsync, `ssh server 'somecmd'`) skip it, so file
  transfers and scripts don't get trapped in a tmux session.

`setup-dev-on-vps.sh` installs this block automatically (idempotently). To add it
by hand, paste it at the end of `~/.bashrc` and `source ~/.bashrc`.

## The everyday loop

```bash
ssh you@box                 # auto-attach drops you into your session
# ... or land directly in a project's session:
ssh you@box -t "cd /srv/myapp && bash -l"
claude                      # start Claude Code (first time: /login)
# ... work ...
# Ctrl-b d                  # detach — Claude keeps running
# close laptop, walk away, reconnect from your phone later → still there
```

## Remote-control it from the Claude app (optional)

Once Claude Code is running in a tmux session you never have to kill, you can
also drive it from the **Claude mobile/desktop app's remote session** feature
instead of a raw terminal — handy from a phone. The tmux session is what keeps
the underlying process alive between app reconnects. (Some people do the same
with the Codex CLI; tmux is agnostic about what runs inside it.)

## Gotchas

- **Started Claude *without* tmux?** Then it dies on disconnect — that's the
  whole reason for this module. Always `claude` *inside* a tmux session.
- **Don't nest tmux.** If you're already attached and run `tmux attach`, you get
  tmux-in-tmux. The `tm` helper avoids this by using `switch-client` when
  `$TMUX` is set.
- **Lost your session list?** `tmux ls` shows everything still running on the
  box. If it's empty, the server rebooted (sessions don't survive reboots —
  systemd services do; see the main skill for running the *app* under systemd).
