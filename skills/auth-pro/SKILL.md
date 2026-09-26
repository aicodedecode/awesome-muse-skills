---
name: auth-pro
description: Implement web authentication: sessions, OAuth/OIDC, MFA, passwordless, and session security. Use when adding login and access control to apps.
category: web-development
---

# Auth Pro

A practical guide to web authentication done safely: session management, OAuth 2.0/OIDC social login, MFA, passwordless (passkeys/magic links), and the session-security details that prevent account takeovers.

## Overview

Authentication answers "who are you?"; authorization answers "what can you do?" — don't conflate them. The modern default: **delegate to proven providers/libraries** (auth services or maintained libraries) rather than hand-rolling crypto, token logic, or password storage. Custom auth code is where breaches are born.

## When to use

- Adding login/signup to any web app.
- Social login (Google, GitHub, Apple) via OAuth/OIDC.
- MFA, passkeys, magic links.
- Session management and "remember me".
- Reviewing auth implementations for vulnerabilities.

## Core concepts

- **Sessions vs tokens.** Server sessions (session ID in httpOnly cookie, state on server — revocable, simple) vs JWTs (stateless, carry claims — harder to revoke). Default to server sessions for web apps; JWTs for APIs/mobile where statelessness matters, with short expiry + refresh rotation.
- **Cookies done right.** `HttpOnly`, `Secure`, `SameSite=Lax` (or Strict), `__Host-` prefix. Session cookie never accessible to JS.
- **OAuth 2.0 / OIDC.** Authorization code flow + PKCE for SPAs/mobile; `state` + `nonce` to prevent CSRF/replay; validate ID tokens (issuer, audience, expiry, signature). Never use the implicit flow.
- **Passwords.** Argon2id/bcrypt/scrypt with proper work factors; never MD5/SHA-256 alone. Enforce breach-list checking (haveibeenpwned API) over arbitrary complexity rules; allow password managers (long inputs, paste allowed).
- **MFA.** TOTP (authenticator apps) baseline; WebAuthn/passkeys strongest (phishing-resistant). Offer MFA, require it for sensitive actions/roles.
- **Passkeys.** WebAuthn platform authenticators — phishing-resistant, no passwords to phish. Implement as primary or alternative login.
- **Magic links.** Email-based login: single-use, short-expiry tokens; rate-limit sending; tokens hashed in DB like passwords.
- **Refresh rotation.** Refresh tokens rotate on each use; reuse detected = theft → revoke the family. Absolute lifetime cap.

## Practical workflow

**1. Choose the approach.** Managed auth provider (fastest, most secure default) vs maintained library (Auth.js, etc.) vs hand-rolled (only with security review — usually the wrong choice).

**2. Session setup (server sessions).**
```
Login: verify credentials → create session (random 256-bit ID) → Set-Cookie(__Host-session=..., HttpOnly, Secure, SameSite=Lax, Path=/)
Request: look up session → load user + expiry → sliding or absolute expiry
Logout: delete session server-side + clear cookie
```

**3. OAuth login.**
```
→ redirect to provider with code_challenge (PKCE), state
← callback with code + state → verify state → exchange code for tokens (server-side) → validate ID token → find-or-create user → create session
```
Link OAuth identities to existing accounts carefully (verified email matching, with confirmation for mismatches).

**4. Protect routes.** Middleware: require valid session; check authorization (roles/permissions) per resource — authentication ≠ authorization.

**5. Sensitive actions.** Step-up auth (re-prompt password/WebAuthn) for: password change, email change, payouts, API key creation.

## Common pitfalls

- **Hand-rolled crypto/password storage.** The cardinal sin. Use Argon2id via a maintained library; never invent session token schemes.
- **Tokens in localStorage.** XSS steals them. httpOnly cookies for sessions; if you must use JWTs in SPAs, short-lived + refresh in httpOnly cookie.
- **Missing PKCE/state.** OAuth without PKCE (public clients) or state (CSRF) is exploitable. Both, always.
- **No rate limiting.** Login, signup, magic-link, and reset endpoints need rate limits + account lockout/backoff — otherwise credential stuffing walks in.
- **User enumeration.** "Email not found" vs "wrong password" distinctions leak accounts. Generic messages; constant-time-ish responses.
- **Unrevocable sessions.** No session list, no "log out everywhere", password change not invalidating sessions. Users need control; breaches need containment.
- **Password reset flaws.** Predictable/long-lived tokens, tokens in logs, no expiry, not invalidating old sessions after reset. Single-use, 15–60 min expiry, hashed storage.
- **OAuth account takeover.** Auto-linking by unverified email lets attackers claim accounts. Link only on verified emails; confirm mismatches.
- **MFA bypass paths.** MFA on login but recovery flows skipping it. Every path to the account needs equivalent protection.
- **Logging sensitive data.** Passwords, tokens, magic links in logs. Redact; hash tokens before storing.
