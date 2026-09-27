# Point a domain at the VPS with Cloudflare

Give the app a real domain with automatic HTTPS, DDoS protection, and a hidden
origin — the levels.io edge. Cloudflare sits in front of the box: the public hits
Cloudflare, Cloudflare talks to your VPS, and (once locked down) **only**
Cloudflare can reach the origin.

## Requirement: a domain already on Cloudflare

You need:
1. **A domain you own** (bought anywhere — Cloudflare, Namecheap, Porkbun, …).
2. **A Cloudflare account with that domain added as a zone**, with the domain's
   registrar nameservers pointed at the two Cloudflare nameservers Cloudflare
   assigns you. In the dashboard the zone must read **Active** (not "Pending
   nameserver update").

If the domain isn't on Cloudflare yet: Cloudflare Dashboard → *Add a site* → enter
the domain → pick Free plan → Cloudflare gives you two nameservers → set those at
your registrar → wait for the zone to go **Active** (minutes to a couple hours).
That nameserver step happens at the **registrar** and can't be scripted from here.

## Pick the mode (ask the user)

> **Do you want to give me a Cloudflare API token so I create the DNS record
> myself, or would you rather add the record in the dashboard while I tell you the
> exact values?**

| | **Full-auto (agent does it)** | **Manual (you click, agent verifies)** |
|---|---|---|
| Who creates the record | agent, via `scripts/setup-cloudflare-dns.sh` | you, in the dashboard |
| What the agent holds | a scoped Cloudflare API token | nothing |
| Best for | fast, you trust the agent | you'd rather not issue a token |

Either way the record is identical.

## The DNS record

One **A record**: name `@` (apex) or a subdomain (`app`), value = your VPS's
**public IPv4** (from Phase 0 / `hcloud server list`), **Proxied** (orange cloud
ON). Add a second A record for `www` if you want it. Proxied is what hides the
origin IP and gives you Cloudflare's TLS + WAF.

- **Apex** (`example.com`) → name `@`.
- **Subdomain** (`app.example.com`) → name `app`.
- Set the same name as your Caddy `DOMAIN` in `provision.sh` so the cert matches.

### SSL/TLS mode — use Full (strict)

Cloudflare → SSL/TLS → Overview → **Full (strict)**. This encrypts Cloudflare↔origin
*and* validates the origin cert. Caddy on the box gets a real Let's Encrypt cert
(HTTP-01 works because port 80 stays open pre-lockdown), so Full (strict) verifies
cleanly. **Do not** use "Flexible" — it sends plaintext to your origin and causes
redirect loops.

## Full-auto mode

1. Have the user create a scoped token themselves so it never passes through a
   tool call: Cloudflare → My Profile → API Tokens → *Create Token* → template
   **Edit zone DNS**, scoped to just this zone. Put it in a temp file:
   ```bash
   ! umask 077; cat > /tmp/cf.txt   # paste the token, then Ctrl-D
   ```
2. Edit the `CONFIG` block in `scripts/setup-cloudflare-dns.sh` (`ZONE`,
   `RECORD_NAME`, `ORIGIN_IP`) and run it. It creates/updates the proxied A record
   and sets SSL mode to Full (strict).
3. `shred -u /tmp/cf.txt`.

## Manual mode

1. Cloudflare → your zone → DNS → *Add record*: Type **A**, Name `@` (or `app`),
   IPv4 = VPS public IP, Proxy status **Proxied**, Save.
2. SSL/TLS → Overview → **Full (strict)**.
3. Agent verifies: `dig +short <domain>` returns Cloudflare IPs (104.x / 172.x —
   *not* your raw origin IP, confirming the proxy is on), and
   `curl -I https://<domain>` returns a `server: cloudflare` header once Caddy has
   a cert.

## Then: lock the origin to Cloudflare only

Once the domain resolves through Cloudflare and the app loads over HTTPS, close the
origin to everyone else. This is the second half of the levels.io lockdown and
uses the script you already have:

Set `CLOUDFLARE_ONLY_443="true"` in `scripts/lock-down-tailscale.sh` and run it on
the box. It fetches Cloudflare's published ranges (`cloudflare.com/ips-v4` +
`ips-v6`) and allows 443 **only** from them, then drops the public 443 rule. After
this, hitting your VPS IP directly on 443 fails — traffic must come through
Cloudflare. Details and the port-80 caveat are in `references/security-tailscale.md`.

**Order matters:** confirm the site loads through Cloudflare *before* restricting
443, or you'll cut off your own cert issuance / traffic. Leave port 80 open unless
you've switched Caddy to DNS-01 or TLS-ALPN issuance (see security-tailscale.md).

## Where this fits

Domain setup happens **after** the app is provisioned and serving on the box
(Phase 1) and is a prerequisite for the Stripe webhook, which needs a public
`https://<domain>/api/stripe/webhook` URL. Sequence: provision → Tailscale lockdown
→ **domain (this file)** → Cloudflare origin lockdown → Stripe (`monetize-stripe.md`).
