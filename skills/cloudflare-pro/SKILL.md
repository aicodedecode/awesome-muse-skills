---
name: cloudflare-pro
description: Cloudflare guidance — DNS, CDN caching, WAF, Workers, Pages, Zero Trust, and edge performance tuning.
category: development
---

## Overview

Cloudflare is the connectivity cloud in front of your infrastructure: DNS, CDN, WAF, DDoS protection, and an edge compute platform (Workers, Pages, R2, D1) that runs code in 300+ cities. For many teams it's the first thing a request touches — which makes its configuration (caching, security, DNS) disproportionately impactful.

The skill is knowing what Cloudflare should do (absorb attacks, cache static, terminate TLS, run edge logic) versus what your origin must do (business logic, authoritative state). This skill covers DNS and CDN configuration, the security posture, Workers/Pages architecture, and Zero Trust access.

## When to use

- Putting Cloudflare in front of a site or API (DNS, proxy, TLS).
- Tuning CDN caching (rules, tiers, purge strategy).
- Configuring the WAF and bot management.
- Building on Workers (edge compute) or Pages (static hosting).
- Choosing R2/D1/KV for edge storage.
- Replacing VPNs with Cloudflare Zero Trust (Access, Tunnel).
- Debugging caching issues or false-positive WAF blocks.

## Core concepts

- **Orange cloud (proxied) vs grey cloud (DNS only).** Proxied records get CDN, WAF, and DDoS protection; DNS-only records expose your origin IP directly. Proxy everything public; keep origins' IPs out of DNS history and certificates.
- **DNS.** Fast, anycast DNS with flat CNAME support at the apex, load balancing with health checks, and DNSSEC. TTLs low during migrations, higher once stable.
- **Caching.** Cache rules (replacing page rules) control what's cached and for how long; tiered caching reduces origin hits; cache keys can include headers/cookies for personalized content. Static: aggressive. HTML: careful. API: usually bypass.
- **Purge strategy.** Purge by URL/tag/hostname deliberately; frequent full purges signal a caching design problem. Use cache tags for surgical invalidation.
- **TLS.** Full (strict) mode — Cloudflare to origin over valid TLS. Anything less (flexible/off) leaves origin traffic unencrypted or vulnerable. Automate origin certs; enable HSTS once stable.
- **WAF.** Managed rulesets (OWASP), custom rules, and rate limiting. Start in log/simulate mode, tune false positives, then enforce. Every rule needs an owner and a review cadence.
- **Bot management.** Distinguish good bots (search crawlers, monitoring) from bad; challenge pages and managed challenges for suspicious traffic. Don't break your own uptime monitors.
- **DDoS.** Unmetered mitigation at L3/L4/L7 is the headline feature — but verify your origin can't be hit directly (firewall origin to Cloudflare IPs only).
- **Workers.** V8 isolates at the edge: sub-millisecond cold starts, tiny per-request cost, bindings to KV/R2/D1/Queues. For request transformation, A/B tests, auth at edge, and lightweight APIs. Not for long-running compute (CPU time limits) or heavy Node APIs (though Node compat is growing).
- **Pages.** Static hosting with git integration, preview deployments, and Functions (Workers) for dynamic routes. The straightforward path for JAMstack sites.
- **R2 / D1 / KV.** R2: S3-compatible object storage with zero egress fees (the cost story); D1: SQLite at the edge (read-heavy, small data); KV: eventually-consistent key-value (config, flags). Match the storage to the consistency need.
- **Queues.** Workers Queues for background processing at the edge — producer/consumer with retries and dead-lettering.
- **Zero Trust.** Access (identity-aware app gating, VPN replacement), Tunnel (outbound-only origin connectivity — no open inbound ports), WARP (device client), Gateway (DNS filtering). The modern remote-access stack.
- **Transform rules.** Rewrite URLs, modify headers, redirect at the edge — edge logic that used to live in origin code or nginx configs.
- **Observability.** Analytics per product, Logpush to your SIEM/storage, Workers trace events. Edge issues need edge telemetry — origin logs won't show blocked requests.
- **Snippets.** Lightweight edge code for common tasks (header rewrites, simple redirects) — less power than Workers, less overhead to manage.
- **Waiting Room.** A virtual queue for traffic spikes (ticket sales, launches) — protects origins during surges instead of letting them fall over.

## Practical workflow

1. **Onboard DNS correctly.** Import the zone, set proxied (orange) records for public hostnames, keep origin IPs out of DNS-only records that leak them; enable DNSSEC.
2. **Lock down TLS.** Full (strict) mode, valid origin certificates (Cloudflare origin CA or public), TLS 1.2+ minimum, HSTS after verifying no mixed-content issues.
   - Origin firewall: allow only Cloudflare IP ranges inbound — otherwise attackers bypass every protection by hitting the origin directly.
3. **Configure caching deliberately.** Cache rules: static assets (long TTL, ignore query strings selectively), HTML (short or bypass), APIs (bypass or keyed). Tiered cache on; cache tags for invalidation.
4. **Deploy the WAF in stages.** Managed rulesets on simulate → review events → tune (skip rules with false positives, add custom rules for app-specific abuse) → enforce. Rate-limit login and expensive endpoints.
5. **Build edge logic in Workers.** Auth checks, redirects, A/B tests, header manipulation at the edge; bind KV/R2/D1 as needed; keep CPU time within limits and code small.
   ```js
   export default {
     async fetch(req, env) {
       const url = new URL(req.url);
       if (url.pathname.startsWith("/old/"))
         return Response.redirect(url.toString().replace("/old/", "/new/"), 301);
       return fetch(req); // pass through to origin
     },
   };
   ```
6. **Host statics on Pages/R2.** Pages for sites with git previews; R2 for assets with zero egress fees; Workers in front for custom logic.
7. **Replace VPN with Zero Trust.** Tunnel for origin connectivity (no inbound firewall rules), Access policies per app (identity provider + device posture), Gateway for DNS-layer filtering.
8. **Monitor and tune.** Cache hit ratio (target high for static), WAF event review cadence, Workers CPU/Errors analytics, Logpush for SIEM integration; alert on origin-error spikes and WAF block anomalies.

## Common pitfalls

- **Flexible TLS** — unencrypted origin traffic; Full (strict) always.
- **Origin IP exposed** — grey-cloud records or history leaking the IP; attackers bypass Cloudflare entirely.
- **Origin firewall open** — not restricting inbound to Cloudflare IPs; WAF/DDoS protection rendered moot.
- **Caching APIs by default** — stale or personalized data served to the wrong users; bypass or key carefully.
- **Full purges constantly** — cache design problem; use tags and rules instead.
- **WAF straight to enforce** — false positives blocking real users; simulate → tune → enforce.
- **Breaking good bots** — aggressive bot rules blocking search crawlers and monitors; allowlist known-good.
- **Workers for long compute** — CPU time limits kill heavy workloads; Workers are for fast edge logic.
- **KV for strongly-consistent data** — eventual consistency surprises; D1 or origin DB for authoritative state.
- **No HSTS or broken HSTS** — either missing the header or enabling it with mixed content breaking the site.
- **Ignoring Logpush** — debugging edge blocks without edge logs; stream logs to your analytics.
- **Tunnel without Access** — exposing internal apps via tunnel hostnames with no identity check; always pair with Access policies.
- **Page rules sprawl** — legacy overlapping rules; migrate to the ruleset engine with clear precedence.
- **No origin monitoring** — Cloudflare healthy while the origin is down; monitor origin health independently.
- **Rocket Loader breaking JS** — automatic optimization breaking scripts; test with it on, disable per path when needed.
