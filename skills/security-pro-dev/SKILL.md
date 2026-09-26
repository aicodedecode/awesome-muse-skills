---
name: security-pro-dev
description: Secure development lifecycle: threat modeling, secure coding, dependency management, and security testing for builders. Use when designing, coding, or shipping software securely.
category: development
---

# Security Pro (Dev)

## Overview

Secure development isn't a phase — it's **how you build**: threat-model the design, write code
that defaults to safe, manage dependencies like the attack surface they are, and test for security
continuously. This skill is the builder's security playbook, distinct from the security-review
perspective: it's about baking security into everyday development rather than auditing it afterward.

The through-line: the cheapest vulnerability is the one never written — design and defaults do more
than scanners.

## When to use

- Designing a feature with security implications (auth, payments, PII, file handling).
- Writing code that handles untrusted input, secrets, or sensitive data.
- Setting up dependency scanning and update practices.
- Adding security testing to CI (SAST, DAST, secret scanning).
- Reviewing your own code for security before it ships.

## Core concepts

- **Threat model the feature (lightweight).** Before coding: what are we protecting, from whom,
  and where does untrusted data cross trust boundaries? 15 minutes with these questions prevents
  architectural security flaws no scanner will catch.
- **Secure defaults in code.** Parameterized queries (never string-built SQL), contextual output
  encoding (never raw interpolation into HTML/JS), allowlist validation (not blocklist), deny-by-
  default authorization, and cryptographically secure randomness (`crypto.randomBytes`, not
  `Math.random`) for tokens. The safe path must be the *easy* path in your codebase.
- **Input handling discipline.** Validate at the boundary (type, range, format, size limits);
  encode at the sink (context-aware: HTML, JS, URL, SQL all differ); never trust client-side
  validation alone. Every external input — HTTP, files, webhooks, messages — is untrusted until
  validated.
- **Secrets management.** Secrets in a vault/secret manager, injected at runtime; never in code,
  logs, error messages, or client bundles. Rotate on exposure; scope tokens minimally; separate
  secrets per environment. Committed secrets are compromised secrets — rotate immediately.
- **Dependency hygiene.** Lockfiles committed; automated vulnerability scanning (Dependabot/
  Renovate + advisories); update cadence (don't let deps rot for two years); minimal dependency
  footprint (every dep is trusted code you didn't write); verify signatures/provenance for
  critical packages.
- **Auth done right.** Passwords: argon2/bcrypt/scrypt (never MD5/SHA-1, never homegrown);
  sessions: secure, HttpOnly, SameSite cookies with rotation; MFA where it matters; OAuth via
  maintained libraries (never hand-rolled); authorization checks server-side on *every* endpoint
  (not just hidden UI).

## Practical workflow

1. **Model threats for the feature.** Assets, attackers, trust boundaries, top abuse cases. Write
   the one-paragraph version; revisit when the design changes.
2. **Choose safe primitives.** Framework-provided auth, ORM parameterized queries, template
   auto-escaping, vetted crypto libraries. Never roll your own crypto, session management, or
  password hashing — the standard libraries exist because the failure modes are subtle.
3. **Code with the checklist:**
   - All queries parameterized; all output contextually encoded.
   - Authz enforced server-side per endpoint; deny by default.
   - Secrets via manager; nothing sensitive in logs/responses.
   - File uploads: type validated (magic bytes, not extension), size-limited, stored outside
     webroot, served with safe content types.
   - Rate limits on auth, password reset, and expensive endpoints.
4. **Scan in CI.** SAST (Semgrep/CodeQL) on every PR, dependency scanning on every build, secret
   scanning on every push, container/image scanning if you ship images. Triage by reachability,
   not raw severity.
5. **Test security explicitly.** Authz tests (user A can't access user B's data — test the
   *negative*), input fuzzing on parsers, and abuse-case tests from your threat model ("attacker
   replays this webhook," "attacker enumerates IDs").
6. **Prepare for the bad day.** Logging that supports incident response (who did what, when —
   without logging secrets), an incident runbook, and dependency update paths that don't require
   heroics.

Secure coding checklist (per PR):

```text
[ ] Untrusted input validated at boundary; encoded at sink
[ ] DB queries parameterized; no string-built SQL/shell/OS commands
[ ] Authz checked server-side; no client-only access control
[ ] Secrets from manager; none in code, logs, or responses
[ ] Errors generic to clients; details logged server-side only
[ ] Dependencies scanned; no known-critical vulns on reachable paths
[ ] Rate limiting on abuse-prone endpoints (auth, reset, webhooks)
```

## Common pitfalls

- **Client-side security.** Validation or access control only in the frontend — the attacker *is*
  the client. Every check that matters runs server-side.
- **String-built queries/commands.** SQL, shell, or LDAP built by concatenation — injection by
  construction. Parameterize everything, always.
- **Homegrown crypto/auth.** "Our own token scheme," XOR "encryption," custom password hashing.
  The failure modes are invisible until catastrophic — use vetted primitives.
- **Verbose errors.** Stack traces and SQL errors to clients — free reconnaissance. Generic
  messages out, detailed logs in.
- **Dependency neglect.** Two-year-old lodash with known CVEs because "it works." Automated
  updates + scanning; treat dependency maintenance as security work.
- **Secrets in logs.** Tokens and PII in application logs turn a log leak into a breach. Redact
  at the logging layer; review what's logged.
- **Security as a final gate.** Bolting on a pentest two days before launch. Threat-model early,
  scan continuously — late findings are expensive findings.
