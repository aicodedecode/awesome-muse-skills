---
name: oauth-oidc-pro
description: Implement OAuth 2.0 and OpenID Connect securely — flow selection, token hardening, and common vulnerability defenses.
category: security
---

## Overview

OAuth 2.0 (delegated authorization) and OpenID Connect (identity layer on top) underpin modern SSO, API authorization, and "login with" flows. They are also among the most misimplemented protocols in production: the spec's flexibility means small mistakes — a missing state parameter, a confused redirect URI — become account takeovers.

This skill is the defensive implementation guide: choosing the right flow, hardening tokens and endpoints, and defending against the classic OAuth vulnerability classes. No attack tooling — just how to build it so attacks fail.

OAuth and OIDC are delegation protocols operating in hostile territory — every redirect, token, and browser interaction is attacker-visible. Secure implementation is therefore about distrusting the channel: validate everything, keep secrets server-side, assume tokens leak, and design so that a leaked token buys the attacker as little as possible for as short as possible.

## When to use

- Adding "login with" / SSO to an application.
- Building or reviewing an authorization server or API authorization layer.
- Integrating third-party OAuth providers securely.
- Remediating OAuth findings from pentests or audits.

## Core concepts

- **OAuth ≠ authentication:** OAuth authorizes *access to resources*; OpenID Connect adds the ID token for *authentication*. Using plain OAuth for login invites confusion attacks — use OIDC.
- **Flow selection:** Authorization Code + PKCE is the modern default for all clients (including SPAs and mobile — the old Implicit flow is deprecated). Client Credentials for service-to-service. Device flow for input-constrained devices.
- **PKCE always:** Proof Key for Code Exchange prevents authorization-code interception. Required for public clients, recommended for all.
- **Tokens:** short-lived access tokens, sender-constrained where possible (DPoP/mTLS); refresh tokens rotated and bound; ID tokens validated strictly (issuer, audience, expiry, signature, nonce).
- **Redirect URI discipline:** exact-match allowlist, pre-registered, no wildcards, no open-redirector-adjacent patterns. Most OAuth account-takeovers start here.
- **Consent hygiene:** minimal scopes by default; clear consent screens; users can review and revoke grants.

- **Sender-constrained tokens.** DPoP or mTLS-bound access tokens mean a stolen token is useless without the private key — the strongest mitigation for token theft.
- **Pushed authorization requests (PAR).** Moves authorization parameters off the front channel, shrinking the attack surface for request tampering and Mix-Up style confusion.
- **FAPI profiles for high security.** For financial or healthcare-grade deployments, the FAPI security profile codifies the hardened subset — use it rather than inventing your own.

## Practical workflow

1. **Choose the flow:** Authorization Code + PKCE for user-facing apps; Client Credentials for services; never Implicit or Resource-Owner-Password-Credentials in new designs.
2. **Harden the client:** pre-register exact redirect URIs; generate cryptographically random `state` and `nonce` per request and validate them; use PKCE (`S256`).
3. **Harden the server:** validate redirect URIs by exact match; short authorization-code lifetime, single use; authenticate confidential clients properly; rate-limit token endpoints.
4. **Harden tokens:** short access-token lifetimes; rotate refresh tokens (detect reuse as compromise signal); validate ID tokens fully on every use; scope tokens minimally.
5. **Review the classic vulnerability classes:** open redirect via redirect_uri, CSRF via missing state, code interception without PKCE, token leakage via referrer/logs, scope escalation, confused-deputy across providers.
6. **Operate:** log auth events (with token hashes, never token values); monitor for anomalous grant patterns; provide users a grant-revocation page; rotate client secrets with zero-downtime procedures.

### OAuth security checklist

- [ ] Authorization Code + PKCE; Implicit flow disabled
- [ ] Exact-match redirect URI allowlist; no wildcards
- [ ] Random `state` + `nonce`, validated per request
- [ ] Short-lived codes (single use); short-lived access tokens
- [ ] Refresh token rotation with reuse detection
- [ ] Full ID-token validation (iss, aud, exp, signature, nonce)
- [ ] Minimal scopes; user-facing grant review/revoke
- [ ] Token endpoint rate-limited; clients authenticated

### Sustaining the practice

- Audit registered clients and redirect URIs quarterly — stale clients are attack surface
- Monitor token endpoint abuse patterns (enumeration, stuffing) continuously
- Review granted scopes per application annually against actual need
- Track client library versions; upgrade past known-vulnerable releases promptly

### Metrics that prove it works

- % of clients using Authorization Code + PKCE (target: 100% of new)
- Token lifetime compliance across clients
- Grant review/revocation page usage (users actually managing grants)
- Anomalous grant-pattern alerts investigated

## Common pitfalls

- **Using OAuth as authentication without OIDC.** The classic confusion — always layer OIDC's ID token for login.
- **Wildcard or loose redirect URIs.** `*.example.com` or path-traversal-tolerant matching enables token theft. Exact match only.
- **Skipping `state`.** Without it, login CSRF lets attackers bind victims to attacker accounts.
- **Long-lived tokens in browsers.** Hours-long access tokens in localStorage maximize theft impact. Short lifetimes + rotation.
- **Logging tokens.** Never log token values; log hashes or key IDs for debugging.
- **Scope creep.** Requesting `read write admin` "for later" violates least privilege and alarms users. Minimal scopes, incremental consent.
- **Trusting provider SDK defaults blindly.** SDKs optimize for easy integration, not your threat model. Verify redirect handling, state, and token storage in every integration.
- **Client secrets in mobile apps.** Anything shipped to a device is public. Mobile clients are public clients — use PKCE, never embedded secrets.
- **Accepting tokens without audience checks.** Resource servers must verify the audience claim — otherwise tokens minted for one API work on another.
- **Rolling your own provider.** Building an authorization server from scratch is a career-defining risk. Use certified, maintained implementations.
