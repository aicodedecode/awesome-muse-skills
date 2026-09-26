---
name: senior-security
description: Security engineering perspective: threat modeling, secure design review, vulnerability triage, and defense in depth. Use when assessing risks, reviewing for vulnerabilities, or responding to security findings.
category: development
---

# Senior Security Engineer

## Overview

A senior security engineer thinks like an attacker and builds like a defender: **threat-model first,
then layer defenses so no single failure is catastrophic**. This skill captures that mindset —
how to model threats proportionate to the actual risk, review designs and code for the
vulnerabilities that matter, triage findings by exploitability rather than scanner severity, and
respond to incidents without panic.

The through-line: perfect security doesn't exist; the job is making attacks expensive and failures
contained.

## When to use

- Threat-modeling a new feature or system before building.
- Reviewing code or architecture for security issues.
- Triaging vulnerability reports, scanner output, or bug-bounty submissions.
- Designing auth, session handling, or data-protection mechanisms.
- Responding to a suspected breach or security incident.

## Core concepts

- **Threat modeling (lightweight).** For each feature ask four questions: What are we protecting?
  Who wants it and what can they do? Where are the trust boundaries (where does untrusted input
  cross into trusted processing)? What breaks if each component is compromised? A 30-minute
  whiteboard version beats a 30-page document nobody reads.
- **Trust boundaries.** Every place data crosses from untrusted to trusted — HTTP input, file
  uploads, third-party webhooks, deserialized blobs — is where validation, auth, and encoding must
  happen. Draw these boundaries explicitly; vulnerabilities cluster at them.
- **Defense in depth.** No single control is reliable: validate input *and* parameterize queries
  *and* apply least-privilege DB roles *and* encode output. Layers overlap so one mistake isn't
  a breach.
- **The big four (web).** Most real breaches come from: broken access control (missing or
  client-side-only authorization), injection (SQL, command, XSS via unescaped output), broken
  authentication/session management, and sensitive data exposure (over-logging, verbose errors,
  unencrypted storage). Master these before worrying about exotic attacks.
- **Severity = exploitability × impact.** A "critical" scanner finding on an unreachable internal
  endpoint matters less than a "medium" IDOR on user data. Triage by: can an attacker reach it?
  What do they gain? How hard is exploitation really?
- **Secure defaults.** The safe path must be the easy path: frameworks' built-in escaping, ORMs'
  parameterized queries, deny-by-default authorization. If developers must remember to be secure,
  they won't be — make insecurity require effort.

## Practical workflow

1. **Model the threat (30 min).** Assets, actors, trust boundaries, top 3 attack scenarios. Write
   it down — one page.
2. **Review the design against the model.** For each trust boundary: is input validated? Is authz
   enforced server-side? Are failures closed (deny by default) rather than open?
3. **Review code at the sinks.** Trace untrusted input to where it's used: queries (parameterized?),
   shell/system calls (avoided or strictly allow-listed?), HTML output (contextually escaped?),
   deserialization (of trusted data only?), file paths (no traversal?).
4. **Check the boring stuff.** Secrets in code/logs, verbose errors to clients, missing rate
   limits on auth endpoints, CORS `*` with credentials, dependencies with known CVEs on reachable paths.
5. **Triage findings.** Reproduce or reason about exploitability; rank by reachable impact; fix
   the remotely-exploitable data-access issues before the theoretical crypto weaknesses.
6. **Verify the fix.** Re-test the exploit path, add a regression test that fails without the fix,
   and check for the same pattern elsewhere in the codebase (vulnerabilities travel in packs).

Triage scorecard:

```text
Finding: reflected input rendered unescaped in admin panel
[ ] Reachable by attacker?      Yes — any authenticated user can submit the field
[ ] Auth required?              Yes, but low-privilege accounts exist (self-signup)
[ ] Impact if exploited?        Session hijack of admin → full compromise
[ ] Exploit difficulty?         Low — no special conditions
→ Verdict: fix this sprint; also audit all other admin-panel render paths.
```

## Common pitfalls

- **Scanner-driven security.** Treating scanner output as the security program. Scanners find known
  patterns; they miss broken access control and business-logic flaws — where the real breaches are.
- **Client-side authorization.** Hiding buttons instead of enforcing permissions server-side. The
  client is attacker-controlled; every authz check that matters runs on the server.
- **Blocklisting input.** Trying to filter "bad" characters instead of allow-listing "good" ones and
  using safe APIs (parameterized queries, contextual encoding). Blocklists always miss something.
- **Security by obscurity.** "Nobody knows this endpoint exists" is not access control. Assume
  attackers enumerate everything.
- **Over-focusing on exotic attacks** while missing missing-authz on the new admin API. Boring
  vulnerabilities cause exciting incidents.
- **Logging secrets.** API keys, tokens, and PII in logs turn a log leak into a credential leak.
  Redact at the logging layer, not by developer discipline.
- **Incident panic.** Shutting everything down before preserving evidence, or silently patching
  without understanding scope. Have a runbook: contain, preserve logs, assess scope, then eradicate.
