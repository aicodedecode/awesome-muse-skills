---
name: traefik-pro
description: Traefik guidance — dynamic routing, providers, middleware chains, Let's Encrypt, and production edge config.
category: development
---

## Overview

Traefik is the cloud-native edge router: it discovers services automatically from providers (Docker, Kubernetes, Consul) and configures routing dynamically — no config reloads when containers come and go. Labels on containers become routers, services, and middleware. For Docker and Kubernetes environments, it's the lowest-friction way to get routing, TLS, and middleware.

Traefik's model (entrypoints → routers → middleware → services) is elegant once internalized, and its dashboard makes the dynamic config visible. This skill covers the core model, provider configuration, middleware chains, automatic TLS, and production hardening.

## When to use

- Routing to Docker containers or Kubernetes services dynamically.
- Getting automatic HTTPS with Let's Encrypt.
- Adding middleware (auth, rate limiting, headers, redirects).
- Choosing between Traefik, nginx, Caddy, or HAProxy.
- Debugging routing (dashboard, logs, whoami).
- Running Traefik in production (HA, dashboard security, observability).
- Migrating from static nginx configs to dynamic routing.

## Core concepts

- **The routing chain.** Entrypoints (ports) → Routers (match rules: Host, PathPrefix) → Middleware (transform/filter) → Services (load-balance to backends). Every request flows through this chain; debug by walking it.
- **Providers.** Docker (labels), Kubernetes Ingress/CRD, Consul, file, and more — Traefik watches providers and rebuilds routing dynamically. The provider is where services are discovered; labels/annotations are where routing is declared.
- **Docker labels.** Routing declared on containers: `traefik.http.routers.api.rule=Host("api.example.com")`, service ports, middleware attachments. Labels are the config — keep them organized and versioned in Compose files.
- **Kubernetes providers.** Ingress (standard, limited) vs IngressRoute CRDs (full Traefik features: middleware, TCP, TLS options). CRDs unlock the real power; Ingress is the portable subset.
- **Middleware.** Reusable request processors: stripPrefix, basicAuth/forwardAuth, rateLimit, headers (security headers), redirect, compress, circuitBreaker, retry. Chain them on routers; define once, attach many times.
- **TLS.** Automatic Let's Encrypt via ACME (HTTP-01 or DNS-01 challenge); `tls.certresolver` on routers; wildcard certs need DNS-01. Store certs in `acme.json` (persist it!) — losing it means reissuing under rate limits.
- **ACME challenges.** HTTP-01 (simple, needs port 80 reachable); DNS-01 (wildcard-capable, needs DNS provider credentials); TLS-ALPN-01 (port 443). Choose per environment; staging CA for testing to avoid rate limits.
- **Dashboard and API.** The dashboard shows live routers/services/middleware — the primary debugging tool. Secure it (auth middleware, internal-only) — it exposes your routing topology.
- **Observability.** Access logs (structured JSON), metrics (Prometheus), tracing (OpenTelemetry). Enable from the start; debugging routing without logs is guesswork.
- **High availability.** Multiple Traefik replicas behind a load balancer; shared ACME storage for Let's Encrypt (KV store or shared file); sticky sessions only when the app requires them.
- **TCP and UDP.** Beyond HTTP: TCP routers (databases, custom protocols) with SNI routing, UDP for DNS-like traffic. TLS passthrough for end-to-end encryption.
- **Plugins.** Community middleware plugins (crowdsec, custom auth) via the plugin catalog — vet them like any dependency.
- **Pilot (deprecated awareness).** Traefik Pilot/Hup was discontinued — don't build on it; use native metrics/logs and your own observability.
- **Configuration split.** Static config (entrypoints, providers, ACME — startup only) vs dynamic config (routers, services, middleware — hot-reloaded). Knowing which is which explains "why didn't my change apply."

## Practical workflow

1. **Define static config.** Entrypoints (web:80, websecure:443), providers (docker/kubernetes), ACME resolver, logging/metrics. This changes rarely — get it right once.
   ```yaml
   # traefik.yml (static)
   entryPoints: { web: { address: ":80" }, websecure: { address: ":443" } }
   providers: { docker: { exposedByDefault: false } }
   certificatesResolvers:
     le: { acme: { email: ops@example.com, storage: /acme.json,
                   httpChallenge: { entryPoint: web } } }
   ```
2. **Label services.** Routers with Host rules, TLS resolver, middleware chains — declared on the container/service:
   ```yaml
   labels:
     - "traefik.enable=true"
     - "traefik.http.routers.api.rule=Host(`api.example.com`)"
     - "traefik.http.routers.api.entrypoints=websecure"
     - "traefik.http.routers.api.tls.certresolver=le"
     - "traefik.http.routers.api.middlewares=sec-headers,api-ratelimit"
   ```
3. **Build middleware chains.** Security headers, rate limits, auth, compression as named middleware; attach per router. Test each middleware in isolation before chaining.
   ```yaml
   # dynamic file provider: middlewares.yml
   http:
     middlewares:
       sec-headers:
         headers:
           stsSeconds: 31536000
           contentTypeNosniff: true
           frameDeny: true
       api-ratelimit:
         rateLimit: { average: 100, burst: 50 }
   ```
4. **Set up ACME carefully.** `acme.json` persisted (chmod 600, backed up); staging CA first; DNS-01 for wildcards; monitor certificate expiry even with automation.
5. **Secure the dashboard.** Basic auth or forwardAuth + IP allowlist; never expose it publicly unauthenticated.
6. **Enable observability.** JSON access logs, Prometheus metrics, tracing; dashboards for router error rates and TLS cert expiry.
7. **Test routing.** The `whoami` container for verifying rules; dashboard to confirm router/service wiring; `curl -H "Host: ..."` for Host-rule testing.
8. **Run HA.** Multiple replicas, shared acme.json storage, health checks; rolling updates without dropping the edge.

## Common pitfalls

- **`exposedByDefault` left true** — every container getting a route; set false and enable explicitly.
- **Lost `acme.json`** — reissuing under Let's Encrypt rate limits; persist and back it up (chmod 600).
- **Testing ACME against production** — rate-limit lockout; use the staging CA first.
- **Static vs dynamic confusion** — changing entrypoints expecting hot-reload; static config needs restarts.
- **Dashboard exposed** — unauthenticated topology disclosure; auth + internal-only.
- **Missing middleware order awareness** — chain order matters (auth before rate limit, etc.); think through the sequence.
- **No health checks on services** — traffic to dead backends; configure service health checks.
- **HTTP-01 behind another proxy** — challenge unreachable; use DNS-01 or ensure port 80 routes correctly.
- **Wildcard without DNS-01** — HTTP-01 can't issue wildcards; DNS challenge required.
- **Ignoring access logs** — debugging routing blind; structured logs from day one.
- **Sticky sessions by default** — unnecessary statefulness; only when the app truly needs it.
- **Plugin sprawl** — unvetted community plugins; treat as dependencies with risk.
- **Single replica as SPOF** — edge downtime on updates; run HA with shared cert storage.
