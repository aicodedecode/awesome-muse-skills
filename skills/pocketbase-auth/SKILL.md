---
name: pocketbase-auth
description: Authentication with PocketBase — email/password, OAuth2, and token management — use when implementing login and user sessions.
category: pocketbase
---

## Overview

PocketBase's auth collections provide complete user management: email/password
with verification, OAuth2 providers, password resets, and token-based sessions
— all without a separate auth service. This skill covers implementing auth
flows correctly, managing tokens, and securing user data.

## When to use

- Setting up email/password auth with verification and password reset
- Adding OAuth2 providers (Google, GitHub, Apple, etc.)
- Managing auth tokens, refresh, and session persistence in clients
- Protecting user data with auth-aware API rules
- Handling multi-tenant or role-based access patterns

## Core concepts

**Auth collections are special.** They add `email`, `password`, `verified`,
and `tokenKey` fields plus auth endpoints (`auth-with-password`,
`auth-refresh`, `request-verification`, `request-password-reset`) to a base
collection. One project can have multiple auth collections (users, admins are
separate by default) — use this deliberately, not accidentally.

**Tokens, not sessions.** The SDK stores an auth token client-side and sends
it per request; `@request.auth.id` in API rules identifies the caller. Tokens
expire — the SDK's `authRefresh` keeps sessions alive. Treat tokens like
credentials: HTTPS only, secure storage on clients, never in URLs or logs.

**OAuth2 flow is handled for you.** Configure provider credentials in the
dashboard, redirect users to the provider, and PocketBase creates/links the
auth record on callback. Map provider profile data to collection fields on
first login; decide your account-linking policy (by email match? explicit
link only?) up front — it's a security decision.

**Verification and reset are email flows.** PocketBase sends the emails via
configured SMTP; customize templates, set token lifetimes sensibly, and make
sure the frontend handles the deep links. Unverified users can be restricted
via API rules (`@request.auth.verified = true`) for sensitive operations.

**API rules close the loop.** Auth without rules is decoration: every
user-data collection needs rules referencing `@request.auth.id`
(`owner = @request.auth.id` patterns). Test as anonymous, as user A, and as
user B — B must never see A's records.

## Practical workflow

1. **Configure the auth collection:** required fields, password requirements,
   unique email enforcement, and whether self-registration is allowed (disable
   it for invite-only products).
2. **Set up email:** SMTP settings, verify/reset templates with your branding,
   and test the full flow end-to-end (signup → email → verify → login).
3. **Add OAuth2 providers** needed; configure redirect URLs for each
   environment; implement the callback handling in your client per SDK docs.
4. **Write auth-aware API rules** for every collection holding user data;
   verify with three identities (anonymous, owner, non-owner).
5. **Implement the client:** login/logout UI, token persistence via the SDK's
   auth store, refresh handling, and route guards based on auth state.
6. **Harden:** rate-limit auth endpoints (reverse proxy / WAF), monitor for
   credential-stuffing patterns, enforce HTTPS, and define a session/token
   lifetime policy.

## Common pitfalls

- **Leaving self-registration open** unintentionally — anyone creates accounts;
  decide explicitly.
- **API rules that check authentication but not ownership** — logged-in user
  A reading user B's records; always scope to `@request.auth.id`.
- **Tokens in localStorage without considering XSS** — any XSS becomes
  account takeover; weigh storage options and invest in XSS prevention.
- **Untested email flows** — verification/reset emails broken in production
  (bad SMTP, wrong links) lock users out; test in a staging environment.
- **OAuth account-linking confusion** — auto-linking by email lets an attacker
  with a matching email hijack accounts; prefer explicit linking or verified-
  email matching with care.
- **No lockout or throttling on password auth** — brute-forceable login
  endpoints; add rate limiting at the proxy layer.
