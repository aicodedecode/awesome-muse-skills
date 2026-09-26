---
name: owasp-security
description: Apply OWASP frameworks (Top 10, ASVS, SAMM, MASVS, Cheat Sheets) to design, test, and harden web and mobile applications.
category: security
---

## Overview

OWASP (Open Worldwide Application Security Project) publishes community standards that are the common language of application security. The **OWASP Top 10** catalogs the most critical web-app risks; **ASVS** (Application Security Verification Standard) gives testable requirements at three assurance levels; **SAMM** (Software Assurance Maturity Model) guides program maturity; **MASVS** covers mobile; and the **Cheat Sheet Series** gives concise defensive implementation guidance.

This skill is how you turn those documents into practice: threat-driven secure design, checklist-based code review, and measurable verification. Everything here is defensive — the goal is building software that withstands attacks, not producing attacks.

Start with the project's risk profile, not the document set: a public-facing payment API needs ASVS Level 2 verified end to end, while an internal dashboard may live at Level 1 with selected Level 2 controls. The documents are a menu driven by risk, and the cheat sheets are the recipes your developers will actually open during implementation.

## When to use

- Starting a new web/API/mobile project and you need the baseline security requirements.
- Reviewing code or architecture for injection, auth, crypto, and misconfiguration issues.
- Defining security acceptance criteria for a release ("ASVS Level 2 verified").
- Responding to a pentest or bug-bounty report and mapping findings to remediations.
- Running developer security training anchored in a shared vocabulary.

## Core concepts

- **Top 10 risk categories (2021, with 2025 refresh direction):** broken access control, cryptographic failures, injection, insecure design, security misconfiguration, vulnerable/outdated components, identification & authentication failures, software/data integrity failures, logging & monitoring failures, SSRF.
- **ASVS levels:** L1 (opportunistic attackers — every app), L2 (most apps handling sensitive data — default target), L3 (high-value targets). Pick a level per app and verify against it.
- **Insecure design vs insecure implementation:** the former is a missing threat model (e.g., no rate limiting on a password reset), the latter is a coding bug. Fix design issues in requirements, not just code.
- **Defense in depth:** no single control is enough. Validate input AND parameterize queries AND encode output AND set least-privilege DB accounts.
- **Positive/allowlist validation** beats denylist validation. Canonicalize, then validate against a strict allowlist.
- **Cheat sheets as building blocks:** authentication, session management, XSS prevention, SQL injection prevention, secrets management, error handling — each maps to concrete code patterns.

- **Security requirements are functional requirements.** 'Reset tokens expire in 15 minutes' belongs in the same backlog, with the same acceptance criteria, as any feature — otherwise it gets cut under schedule pressure.
- **Map every control to a verification method.** For each ASVS requirement, decide how you will prove it: code review, SAST rule, DAST check, or manual test. Unverifiable requirements are wishes.
- **Version-pin your baseline.** OWASP guidance evolves; record which Top 10/ASVS version you verified against so future assessments compare apples to apples.

## Practical workflow

1. **Classify the app:** data sensitivity, exposure (internal vs internet), compliance needs. Use this to pick an ASVS level (L1/L2/L3).
2. **Threat-model the data flows:** draw trust boundaries, list entry points, enumerate Top 10 risks per flow. Capture as abuse cases alongside user stories.
3. **Bake requirements in:** turn cheat-sheet guidance into backlog items — e.g., "All DB queries parameterized (ASVS 5.3.1)", "Session tokens rotate on privilege change (ASVS 3.2.4)".
4. **Review against the list:** during code review, run the Top 10 as a mental checklist on every diff touching auth, input handling, crypto, or config.
5. **Verify with testing:** map SAST/DAST findings and manual tests to ASVS requirements; track pass/fail per requirement, not just raw finding counts.
6. **Harden defaults:** disable debug, remove default creds, set security headers (CSP, HSTS, X-Content-Type-Options), lock down error messages.
7. **Log and monitor:** ensure authentication failures, access-control failures, and input-validation failures produce alerts (Top 10 A09 — logging & monitoring failures).

### Quick checklists

**Injection:** parameterize all queries; use ORM safely (no raw string concatenation); validate and encode all output contexts (HTML, JS, URL, SQL, shell).
**Broken access control:** deny by default; enforce checks server-side on every request; protect against IDOR by verifying ownership; test with a low-privilege account.
**Crypto failures:** TLS 1.2+ everywhere; no custom crypto; passwords hashed with Argon2id/bcrypt/scrypt; secrets in a vault, never in code.
**Auth failures:** MFA for privileged accounts; lockout + rate limiting; secure session lifecycle (HttpOnly, Secure, SameSite; rotation on privilege change).

### Sustaining the practice

- Re-run the ASVS verification on every major release, not just the first one
- Keep cheat-sheet links inside your secure-coding guide where developers already look
- Review the Top 10 delta on each new release and brief engineering on what changed
- Track requirement pass-rate trends per application in the security dashboard

### Metrics that prove it works

- ASVS requirement pass rate at the target level, per application
- % of new features with a threat model before build
- Mean time to remediate Top-10-class findings, by severity
- % of releases passing the secure-code review checklist

## Common pitfalls

- **Treating the Top 10 as a complete checklist.** It is a risk awareness list, not an exhaustive standard. Pair it with ASVS for verification.
- **Fixing findings without fixing the class.** One XSS fixed while the templating pattern stays vulnerable means ten more next sprint. Fix the pattern, add the rule to review checklists.
- **Scanning without triage.** DAST/SAST output mapped to "fix everything" burns out teams. Prioritize by exploitability × data exposure, track by ASVS requirement.
- **Security headers as decoration.** CSP only works if you remove `unsafe-inline`; HSTS needs includeSubDomains and preload discipline.
- **Ignoring logging.** An app with no audit trail of auth failures fails ASVS and blinds incident response. Logging is a security control, not a nice-to-have.
- **One-time assessments.** Security posture decays as code changes. Re-verify ASVS level on major releases; keep cheat sheets linked from your secure-coding guide.
- **Treating the Top 10 as a priority order.** The list is not ranked for your app — rank by your data flows and exposure, not the list order.
- **Letting the ASVS target drift.** Pick a level per app, document it, and re-verify on major releases — otherwise verification quietly decays to L1.
- **Developer guidance that lives in a PDF nobody opens.** Put the cheat-sheet content into code-review checklists, linters, and PR templates — where the work happens.
- **Verifying once at launch.** Dependencies, frameworks, and attack techniques move on. Re-verification cadence is part of the control, not optional.
