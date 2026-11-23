---
name: cloudish
description: Deploy an app to Cloudish, an agent-first cloud that builds a Dockerfile, source folder, or existing image server-side and serves it at a public URL, with persistent volumes, encrypted secrets, and OIDC sign-in. Use when the user asks to deploy, host, or put online a website, API, bot, worker, or MCP server on Cloudish, or to get a Cloudish API key.
category: development
---

## Overview

Cloudish deploys apps as long-lived containers with a public URL. It builds
server-side from a Dockerfile or source folder (no local Docker daemon and no
local `docker build`), or runs an image you already have. Deploys can carry an
optional persistent volume. An agent mints its own API key with one
unauthenticated call — no signup and no account — and spends only prepaid
credits, which a key can never exceed.

Everything below is an HTTP call; there is nothing to install. The canonical,
always-current API reference is <https://cloudish.ai/skill.md> — read it when a
detail here is missing or a call fails.

## When to use

- The user asks to deploy, host, publish, or "put online" an app, site, API,
  bot, worker, or MCP server.
- The user names Cloudish, or asks for a Cloudish API key, URL, or deployment
  status.
- The user wants a container app with a database or uploads on a persistent
  volume, without managing a server.

## Guardrails

- **Never print, log, or commit API keys or app secrets.** Pass them through
  environment variables, and never paste a raw key into chat or source.
- **Do not read credential files.** Do not open `.env` files, `~/.ssh`,
  `~/.aws`, or similar, and do not ask the user to paste a key. Use a
  `CLOUDISH_API_KEY` already exported in the environment, or mint a new key
  (below). A minted key stays in this session's environment or the platform's
  secure credential store.
- **Upload only the build context, only for the deploy the user asked for.**
  Cloudish is the named destination. Before creating the archive, exclude
  `.env*`, `.git`, and anything secret-shaped; real credentials belong in the
  encrypted secrets endpoint, not in the context.
- **Confirm before spending.** A deploy bills prepaid credits. Do not spend
  beyond what the user asked for; if the app must stay always-on or needs a
  larger size, say what it costs first.
- **Never report success without evidence.** A deploy is successful only when
  the build reaches `succeeded` and the container logs show the app started
  and is listening. A URL you cannot open from your environment is not proof
  of failure either.

## 1. Get an API key

Creating a key needs no credential; every other call authenticates with the
key it returns, as `Authorization: Bearer $CLOUDISH_API_KEY`.

```bash
curl -X POST https://cloudish.ai/api/v1/keys \
  -H "content-type: application/json" \
  -d '{"alias": "my-app", "agent": "meta-muse", "ref": "awesome-muse-skills"}'
```

The response carries `key` (keep it: export it as `CLOUDISH_API_KEY` for the
session) and a single-use `claimUrl`. If a key for this work already exists in
the environment, reuse it instead of minting another.

`alias` names what you are deploying; the returned `apiKey.alias` becomes the
`{owner}` in project paths. New keys start with a small credit grant. Claiming
is optional and needs a human: give them the `claimUrl` (not the raw key) and
mention it expires in 30 minutes. `GET /api/v1/credits/claim` mints a fresh
one when needed.

## 2. Deploy — one call creates or updates

`POST /api/v1/projects` creates the project, or updates it on a redeploy, so
the same call can always be used unconditionally.

**From an image you already have** — registered immediately:

```bash
curl -X POST https://cloudish.ai/api/v1/projects \
  -H "Authorization: Bearer $CLOUDISH_API_KEY" \
  -H "content-type: application/json" \
  -d '{"name": "my-app", "image": "ghcr.io/acme/my-app:1.0.0", "port": 8080, "alwaysOn": true}'
# -> { "project": {"path": "..."}, "app": {"status": "registered"},
#      "subdomain": {"url": "https://<token>.cloudish.app/"} }
```

**From source** — the build context is a `tar.gz` with a `Dockerfile` at its
root. It is built on Cloudish's servers, so do not build locally first:

```bash
tar --exclude='.env*' --exclude='.git' --exclude='node_modules' \
  -czf context.tar.gz .
curl -X POST https://cloudish.ai/api/v1/projects \
  -H "Authorization: Bearer $CLOUDISH_API_KEY" \
  -F "name=my-app" -F "port=8080" -F "sleepAfterMinutes=30" \
  -F "context=@context.tar.gz"
# -> { "project": {...}, "build": {"id": 123, "status": "running"} }
```

Then poll the build:

```bash
curl https://cloudish.ai/api/v1/images/builds/123 \
  -H "Authorization: Bearer $CLOUDISH_API_KEY"
# -> { "build": {"status": "running", "logs": "..."}, "image": null }
```

Keep polling only while `status` is `"running"`; anything else is final. On
`"failed"`, show `build.error` plus the tail of `build.logs`. On `"succeeded"`,
the docker app and its subdomain are already provisioned.

Run mode on every deploy:

- `"alwaysOn": true` — runs around the clock and bills the whole time. Use for
  a site or API that must answer at once, or a bot/worker nothing sends
  requests to.
- `"sleepAfterMinutes": 30` (1–1440, default 15) — sleeps when idle and bills
  only while awake; the next request wakes it in seconds. Add
  `"wakeEveryMinutes": 60` to also wake it on a schedule.

`port` is the port the server listens on (default 8080), regardless of the
Dockerfile's `EXPOSE` — an nginx image listens on 80. Get it wrong and
requests answer `503` with "nothing accepts connections on port …".

## 3. Config, secrets, and storage

Non-secret configuration goes in `env` on the same project call:

```json
{"name": "my-app", "image": "...", "port": 8080,
 "env": {"LOG_LEVEL": "debug"},
 "volumeEnabled": true, "volumeSizeGb": 5, "volumeMountPath": "/data"}
```

Anything sensitive is set separately, encrypted at rest, and merged into the
container's environment. Never put secrets in `env` or in the build context:

```bash
curl -X PUT https://cloudish.ai/api/v1/projects/YOUR_ALIAS/my-app/secrets \
  -H "Authorization: Bearer $CLOUDISH_API_KEY" \
  -H "content-type: application/json" \
  -d '{"name": "OPENAI_API_KEY", "value": "sk-..."}'
```

`GET …/secrets` lists names only; `DELETE …/secrets/NAME` removes one. Saving
or deleting a secret restarts a running app.

Volumes persist across restarts and redeploys. `volumeSizeGb` must be 1, 5, or
20; the mount defaults to `/data`. A volume attaches to one container, so an
app with a volume cannot run replicas. Deleting the project deletes its volume
and data; a zero balance only stops the app and keeps the data.

## 4. Verify, then report

```bash
curl https://cloudish.ai/api/v1/projects/YOUR_ALIAS/my-app \
  -H "Authorization: Bearer $CLOUDISH_API_KEY"
curl https://cloudish.ai/api/v1/docker/YOUR_ALIAS/my-app/logs \
  -H "Authorization: Bearer $CLOUDISH_API_KEY"
```

The logs endpoint also returns the previous attempt's output and recent
Kubernetes events (`ImagePullBackOff`, `FailedMount`, …), which often explain a
container that never wrote a line. Common failures:

- **`503` "nothing accepts connections on port …"** — wrong `port`, or the
  server binds to `127.0.0.1` instead of `0.0.0.0`. Fix and redeploy.
- **Build dies with only "Job has reached the specified backoff limit"** —
  usually build resources, not the Dockerfile. Retry with `buildCpuCores`
  (`0.5`, `1`, `2`, `3`) and `buildMemoryGb` (`1`, `2`, `4`, `5`).
- **`402` / status `out_of_credits`** — the key is out of balance. Tell the
  user; offer a claim link so they can add credits. Do not claim success.
- **State lost on restart** — data written outside the mounted volume. Move
  it under `volumeMountPath`.

Report the live `subdomain.url`, the run mode, any volume and its mount, and
the env var names the app needs — never their values.

## 5. URLs, custom domains, and sign-in

A permanent URL is provisioned automatically once the image registers; return
`subdomain.url`. To choose a memorable subdomain (non-private projects):

```bash
curl -X PUT https://cloudish.ai/api/v1/projects/YOUR_ALIAS/my-app/subdomain \
  -H "Authorization: Bearer $CLOUDISH_API_KEY" \
  -H "content-type: application/json" -d '{"label": "anamazingapp"}'
```

Add custom domains with `POST …/domains` and the returned TXT record; point a
subdomain at cloudish.ai with a CNAME, or an apex with an A record. Each active
domain costs credits per day.

For end-user sign-in, use Cloudish's OIDC provider — Authorization Code + PKCE,
no client secret:

```
GET https://www.cloudish.ai/.well-known/openid-configuration
```

Point off-the-shelf apps at that issuer. For a custom flow, redirect to
`https://www.cloudish.ai/oauth/authorize` with a `redirect_uri` under the
project's subdomain or an active custom domain, then exchange the code at
`POST https://www.cloudish.ai/oauth/token`. Authenticating is not authorizing:
an admin panel still needs its own allowlist of `email`/`sub` claims, since any
Cloudish user can complete the flow. The platform adds no trusted headers;
verify the `id_token` in the app.

## 6. Credits

Deploy, `/api/v1/me`, and credits responses carry `runway`: `balance` and
`creditsPerHour`. A sleeping app costs nothing until it wakes. Add credits by
giving the user a fresh claim link (section 1), or transfer between keys:
`POST /api/v1/credits/transfer` with `{"to": "<alias>", "amount": 1}`,
authenticated by the parent key.

## Reference

- Full API, fields, and current pricing: <https://cloudish.ai/skill.md>
- Isolation model: <https://cloudish.ai/container.md>
- Credits and claiming: <https://cloudish.ai/credits.md>
- Instance sizes: <https://cloudish.ai/instances.md>
- Changelog: <https://cloudish.ai/changelog.md>

Adapted from Cloudish's public skill (`https://github.com/cloudishai/skills`,
MIT).
