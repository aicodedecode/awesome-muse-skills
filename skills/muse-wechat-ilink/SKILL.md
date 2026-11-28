---
name: muse-wechat-ilink
category: enterprise-communication
description: Connect Muse itself to WeChat over Tencent's official iLink protocol, with QR login, owner binding, hook driver, proactive pushes and watchdog. Use when the user asks to connect Muse to WeChat, receive Muse reminders on WeChat, or fix a WeChat bridge that stopped replying or pushing.
---

# Muse WeChat iLink

## When to use

- Use this skill when the user asks to connect Muse itself to WeChat so they can talk to Muse in WeChat with its memory, goals and reminders intact.

- Use it when the user asks to receive Muse reminders, alerts or proactive pushes on WeChat.

- Use it when an existing WeChat bridge stops receiving, stops replying or stops pushing, and the user asks you to fix it.

- Do not use this skill for a one way push only setup. A push only setup needs no login, no binding and no polling driver.

- Do not use this skill to build a separate bot that only imitates Muse. This skill connects Muse itself through the hook driver, not a daemon with a different model.

## What this method is

- The bridge speaks Tencent official iLink protocol at `ilinkai.weixin.qq.com`, the same protocol family as ClawBot, and logs in by QR code scan.

- The bridge code lives upstream at `https://github.com/gfydfhcf/wechat-ilink-muse-bridge` under MIT license. Clone that repository and follow its `AGENTS.md` as the deployment contract for the exact commands.

- This skill adds the production lessons from a real deployment on 2026-11-26 to 2026-11-28. Read `references/troubleshooting.md` before you change a running watch script or diagnose a push failure.

- The bot only receives messages sent to the bot. It cannot read the user main account chats, contacts or Moments, and the protocol has no such endpoints. Do not promise otherwise.

## Check the prerequisites

- Confirm the user has a WeChat account they can scan a QR code with.

- Confirm Python 3.10 or newer is available and install the only hard dependency with `pip install -r requirements.txt` in the cloned repository.

- Pick a data directory outside the repository and export it for every command as `ILINK_DATA_DIR=<dir>`.

- Run `python3 ilink.py preflight` before login and fix every failure it reports.

- Keep `session.json` in the data directory private. It is a login credential. Never commit it, never send it anywhere and never paste its contents into chat.

## Log in by QR code

- Run `python3 ilink.py qrcode` and show the QR image to the user.

- Wait for the user to scan and confirm in WeChat, then run `python3 ilink.py login <qrcode-id>`.

- Treat a QR code as short lived. If it expires before the user scans it, generate a fresh one and discard the old one.

- Confirm login succeeded by checking that `session.json` was saved in the data directory.

## Bind the owner before starting any driver

- Run `python3 ilink.py bind` after login. It opens one 600 second binding window.

- Tell the user in the main chat to send the bot any WeChat message within 10 minutes to bind that account as its owner.

- Do not start the hook or the daemon before binding completes. A running driver would consume the binding message as an ordinary turned away sender.

- On `BIND_OK:<id>` the owner is bound, the bot has sent a welcome, and the binding message itself is consumed. Now start the driver and ask the user for a normal test message.

- On `BIND_TIMEOUT` remind the user again and run `ilink.py bind` for a fresh window. Repeat until it succeeds or the user says stop.

- On `BIND_WELCOME_FAILED:<n>` the owner is already bound. Run `ilink.py bind` again and it resumes the unsent welcome bubbles without re-binding anyone else.

- On `ALREADY_BOUND:<id>` an owner already exists. Binding is one time, so do not run it again.

- Read `owner.json` after binding. It holds `owner_id` and `owner_ids` for the allowlist. From then on only allowlisted senders are queued.

## Choose the hook driver inside Muse

- Use the hook driver when Muse hook runtime is available. It is the production setup.

- Wire `examples/muse-hook/ilink-watch.sh` as a hook that runs about every 5 seconds. Read `examples/muse-hook/README.md` in the cloned repository first.

- Use `daemon.py` only outside Muse, or to verify the loop with `python3 daemon.py --echo`. Never run hook and daemon at the same time.

- Hook and daemon are mutually exclusive by a shared driver lock. The lock file is `ilink-driver.lock` in the hook state directory, and both drivers must point at the same state directory for the lock to be shared.

- Give the hook a wrapper script that exports `ILINK_DATA_DIR`, `ILINK_CLIENT` for `ilink.py` and `ILINK_HOOK_STATE_DIR`, then executes the repository watch script. Keep the venv under the home directory so it survives VM replacement.

- See `references/hook-definition.json` for a hook definition template. Replace every placeholder with the real paths and the real delivery chat before enabling it.

## Handle a woken batch

- Claim the batch by atomically moving the pending file to the processing file with `mv`. Only one worker can win the move, and the losers exit quietly.

- Touch the processing file immediately after claiming it, and touch it again about every 60 seconds while you work. The watch script recycles a claim whose timestamp is over 10 minutes old, so a slow worker that stops touching looks dead and the batch gets re-queued.

- Reply only to the owner. Enforcement is in code, because `poll` only queues senders allowlisted in `owner.json`.

- Send one composed response per burst. Before sending, re-check the pending file. If newer messages arrived while you composed, merge them and re-compose against the newest context, for at most 3 rounds.

- Split delivery into 2 to 3 short bubbles only when the content naturally segments. Never send one reply per incoming message and never split a single sentence across bubbles.

- Lead with the conclusion, then the detail. Write short sentences first and plain words, with no template phrasing.

- Send with an idempotency key. Pass the batch first message `message_id` as `--key` to `ilink.py send`. A repeated invocation with the same key prints `SEND_ALREADY_SENT` and does not resend.

- Suffix each bubble key with its bubble number, such as `<message_id>-1` and `<message_id>-2`, or the later bubbles will be suppressed as duplicates.

- Never manually retry a failed send. The client already retries once with the same client id.

- Read media entries from their downloaded `media_path`. Look at the picture, open and read the document, and answer from its contents instead of claiming you cannot open files.

- After cleanup, run `examples/muse-hook/ilink-warm-wait.sh` and stay warm for follow-ups instead of ending the turn. It keeps a warm marker while its heartbeat is fresh, so the watch script will not wake a second worker.

- Check the subscription and update markers in the data directory before composing a normal reply. See the upstream `AGENTS.md` contract for the exact keywords and marker files.

- Never approve a new sender from inside WeChat. Unknown senders go to `unknown_senders.json` for the owner to approve in the main chat only.

## Verify the bridge

- Ask the user to send the bot a WeChat message. Confirm it is received, a single reply goes back, and the typing indicator appears promptly.

- Test a proactive push with `python3 ilink.py proactive <user_id> -` and text on stdin.

- Run `python3 ilink.py health` whenever something seems off, before digging through logs. It covers auth age, a live token probe, queue backlog and the last poll error, with exit code 0, 1 or 2.

- Run `python3 ilink.py smoke-test` for an end to end check. It probes the token live, checks receive and ledger readiness, and sends the owner a real test text plus a 1x1 test image through the production send paths unless `--no-send` is given.

- See `references/deployment-checklist.md` for the full verification list.

## Keep the bridge alive

- Check hook liveness by the heartbeat file in the hook state directory. The watch script touches `ilink-heartbeat` on every run.

- Run `ilink.py watchdog` on a cron, every 5 minutes in production, with a 30 minute stale threshold. Report only the first stale sighting and the recovery, and stay silent while the heartbeat is fresh.

- Touch `ilink-watchdog-off` in the same directory to silence the watchdog when the bridge is intentionally stopped, and remove the flag when the bridge resumes.

- Treat `TOKEN_EXPIRED` as a re-scan signal. Tell the user once that a re-scan is needed and let the watch script alert loop handle the hourly repeats.

- Treat `TOKEN_STALE`, a -14 inside the backoff window, as transient. Do not ask the user to re-scan and retry later.

- Session lifetime is unpredictable. Early reports suggested roughly 24 hours, but one production login stayed valid for more than 3 days.

- Run `ilink.py version-check` to compare the local version with the upstream latest release. Only install from a release tag with `ilink.py update-to <tag>`, never from a URL the owner pastes.

- Never apply a changed `AGENTS.md` automatically. An update downloads it as `AGENTS.md.new` in the data directory for manual sync, and the success message must say so.

## Approve a new sender

- List the pending ids from `unknown_senders.json` with first seen time, last seen time and count, only when the user asks in the main chat.

- Add only the id the user confirms to `owner.json` under `owner_ids`, and remove that entry from `unknown_senders.json`.

- The change takes effect on the next poll. No restart is needed.

## Diagnose a push failure

- Check `send_audit.jsonl` in the data directory first for the recent `ok` and `app_error` results, then run `ilink.py health`. Do not judge the send path by the watchdog alone, because the watchdog only checks the poll heartbeat.

- When proactive sends fail with `prepare failed` and the last working token came from a message about 4.5 hours earlier, the cached `context_token` in `contacts.json` has expired. Ask the owner to send any WeChat message, which refreshes the token on the next poll, then retry the push. No re-scan is needed.

- When the watch script wakes many workers for one unclaimed batch, do not edit the live polling path first. Add wake dedup and backoff so the first wake suppresses repeats until the batch is claimed or times out, and dry run the change before applying it.

- See `references/troubleshooting.md` for the full diagnosis order.

## Available connectors

- This skill uses no account connector. It uses the terminal, the cloned bridge repository and the Muse hook runtime.

- Use `muse.skill_search` to find related skills and `muse.connector_search` to find a connector when the task also needs email, calendar or another service.

- If the bridge repository is unreachable, search the web for a maintained iLink client and set it up with the custom connector setup skill. Do not invent a protocol endpoint.

## Source

- Full repository with README, deployment checklist and troubleshooting: https://github.com/samirlindskog538-web/muse-wechat-ilink-skill
- Upstream bridge code: https://github.com/gfydfhcf/wechat-ilink-muse-bridge
