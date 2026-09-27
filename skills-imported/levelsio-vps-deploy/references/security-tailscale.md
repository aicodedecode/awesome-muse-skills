# Security: Tailscale lockdown

This is the default security posture for **both** paths in this skill, and it's
exactly what levels.io does on a new box:

> "When I set up a new Hetzner VPS, first thing I do is install Tailscale, and
> once I'm in via Tailscale, lock down the firewall to only accept web traffic on
> HTTPS 443 for Cloudflare IPs and SSH 22 for the Tailscale IP. That way nobody
> can get in."

## Why Tailscale

Tailscale builds a private, encrypted network (a "tailnet") between *just your
devices and your servers* — your laptop, your phone, your VPS. Nobody else can
see or reach the box over it. Once SSH is restricted to the tailnet:

- Port 22 is **invisible** on the public internet — no brute-force noise, no
  fail2ban whack-a-mole, no exposed SSH at all.
- You still reach the box from anywhere (laptop, phone via Termius) because those
  devices are on the same tailnet.
- It's the prerequisite for the phone workflow in Path B: your iPhone joins the
  tailnet, so Termius can SSH to the box's `100.x.y.z` address from anywhere.

Combined with Cloudflare in front of port 443, the only thing the public
internet can touch is HTTPS, and even that only via Cloudflare.

## The lockout-safe ordering (do NOT skip)

You are provisioning over the box's **public IP**. If you close port 22 before
Tailscale works, you lock yourself out. So the order is always:

1. **Provision** (`provision.sh`) — installs Tailscale, leaves 22 open for now.
2. **Join the tailnet**, on the box:
   ```bash
   sudo tailscale up        # opens an auth link — log in to your Tailscale account
   tailscale ip -4          # note the 100.x.y.z address
   ```
   Install Tailscale on your laptop/phone too and log into the same account, so
   they share the tailnet.
3. **Confirm tailnet SSH works** from your laptop — in a *new* terminal, leaving
   your current public-IP session open as a fallback:
   ```bash
   ssh deploy@100.x.y.z
   ```
4. **Only then lock down** (`lock-down-tailscale.sh`, on the box) — it restricts
   22 to the `tailscale0` interface and removes the public allow rule.

Never run step 4 until step 3 succeeds.

## What `lock-down-tailscale.sh` changes

```
before:  22  open to the world      (key-only SSH + fail2ban)
         80  open to the world      (Caddy ACME + redirect)
         443 open to the world

after:   22  allowed ONLY on tailscale0       <- you, over the tailnet
         80  open (ACME) — or closed if CLOSE_PORT_80=true
         443 open — or ONLY Cloudflare IPs if CLOUDFLARE_ONLY_443=true
```

The script makes you confirm you're connected over the tailnet before it removes
the public SSH rule.

### Optional: restrict 443 to Cloudflare

Set `CLOUDFLARE_ONLY_443="true"` in the script to fetch Cloudflare's published
ranges (`cloudflare.com/ips-v4` + `ips-v6`) and allow 443 only from them. Do this
only when Cloudflare's proxy (orange cloud) is actually in front of the domain —
otherwise you block all real traffic. Cloudflare rotates ranges occasionally;
re-run the script to refresh.

**Cert caveat:** if you also close port 80 (`CLOSE_PORT_80=true`), Caddy can no
longer use the HTTP-01 ACME challenge. Either leave 80 open, or switch Caddy to
DNS-01 (Cloudflare DNS plugin) or TLS-ALPN issuance. Easiest path: leave 80 open.

## Recovering from a lockout

If you locked SSH to the tailnet and then lost tailnet access (account issue,
Tailscale down, wrong interface name), you are not stuck — you just can't use
SSH. Use your provider's **web console / VNC / "rescue" terminal** (Hetzner
Cloud Console, DigitalOcean Droplet Console) to log in and re-open SSH:

```bash
sudo ufw allow 22/tcp
sudo ufw reload
```

Then fix Tailscale and re-run the lockdown. This is why every cloud provider's
out-of-band console matters — keep that login handy.
