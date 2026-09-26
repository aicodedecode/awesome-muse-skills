---
name: paas-networking
description: Networking on PaaS platforms — private networks, custom domains, TLS, and egress — vendor-neutral patterns.
category: railway
---

## Overview

PaaS networking spans two worlds: private service-to-service traffic inside
the platform, and public traffic from the internet to your app. Getting it
right means private backends, correct TLS, sane DNS, and understanding egress
costs and limits. This skill covers the networking model common to modern
platforms.

## When to use

- Wiring services together over private networking (app → DB → cache)
- Setting up custom domains with TLS certificates
- Debugging connectivity (DNS, TLS errors, timeouts between services)
- Understanding egress pricing and data-transfer limits
- Restricting access (IP allowlists, private-only services)

## Core concepts

**Private networking is the default for backends.** Databases, caches, and
internal APIs should communicate over the platform's private network —
lower latency, no internet exposure, often free/cheaper than public egress.
Use internal hostnames/connection strings; never route backend traffic over
the public internet when a private path exists.

**Public surface should be minimal.** Only the services users directly reach
(web frontends, public APIs) get public endpoints. Everything else stays
private. Each public endpoint is attack surface and (often) metered egress —
audit which services are publicly reachable regularly.

**TLS everywhere, terminated sensibly.** Platforms typically provision and
renew certificates automatically for custom domains — use it. Between proxy
and app, TLS may terminate at the edge (fine inside the private network);
for regulated workloads, enable end-to-end encryption explicitly. Know where
your TLS terminates.

**DNS done right.** Point domains via the provider's recommended records
(usually CNAME/ALIAS to their endpoint, not A records to IPs that change).
Set TTLs low during migrations, verify with `dig`, and remember DNS
propagation is the reason deploys "don't work" for exactly one stakeholder.

**Egress costs are the hidden bill.** Ingress is usually free; egress (data
leaving the platform/region) is metered and surprisingly expensive at scale.
Big downloads, video, and cross-region chatter belong on a CDN or object
storage with bandwidth-friendly pricing — not served from app instances.

## Practical workflow

1. **Map the traffic:** draw which services talk to which, over private vs
   public paths; make every backend-to-backend path private.
2. **Configure domains:** add custom domains per provider docs, verify DNS
   (CNAME/ALIAS), confirm automatic TLS issuance and renewal.
3. **Lock down:** remove public endpoints from internal services, add IP
   allowlists where supported (databases, admin panels), and enable any
   platform firewall/WAF features for public services.
4. **Test connectivity deliberately:** from a running service, resolve and
   reach each dependency's private address; check TLS cert validity and
   expiry monitoring.
5. **Monitor and budget egress:** track data transfer per service/region,
   set billing alerts, and move heavy static content to a CDN early.
6. **Document the network map** — hostnames, which are private/public, TLS
   termination points — so the next person doesn't rediscover it during an
   incident.

## Common pitfalls

- **Database exposed publicly** "temporarily" — it never gets unexposed;
  private networking from the start, IP-allowlisted admin access only.
- **Hardcoded IPs** instead of platform hostnames — IPs change on redeploy;
  always use provided DNS names.
- **Mixed-content / TLS termination confusion** — app generates http:// URLs
  behind an https:// edge; honor `X-Forwarded-Proto` in URL generation.
- **Egress bill shock** — serving large files or cross-region replication
  from app instances; CDN and regional placement fix most of it.
- **DNS TTL set to 86400 during a migration** — changes take a day to
  propagate; lower TTLs well before planned moves.
- **Assuming private = authenticated** — private networks reduce exposure
  but aren't authorization; services should still authenticate to each
  other (tokens, mTLS) for defense in depth.
