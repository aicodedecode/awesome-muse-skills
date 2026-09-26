---
name: password-auditor
description: Audit password hygiene and authentication controls — policy design, credential exposure checks, and migration to modern auth.
category: security
---

## Overview

Passwords remain the most attacked credential type, and password audits remain one of the highest-value defensive assessments: weak, reused, default, and breached passwords are still behind a large share of intrusions. A password audit checks policy, storage, and real-world exposure — then drives the organization toward fewer, stronger secrets and ultimately toward passwordless.

This skill covers defensive auditing only: policy review, configuration checks, and breach-exposure screening of your *own* organization's credentials with proper authorization. It does not cover cracking or bypassing anyone's passwords.

A password audit is a snapshot of a moving target — its real value is the trajectory it reveals. Are breached passwords being eliminated, is MFA coverage climbing, are legacy hashes disappearing? Report the trend lines alongside the findings, and frame every password recommendation as a step toward fewer passwords, not stronger ones.

## When to use

- Reviewing authentication posture as part of a security assessment or audit.
- After a breach or credential-leak incident involving your users.
- Designing password policy aligned with current NIST SP 800-63B guidance.
- Planning migration to MFA-everywhere and passwordless (passkeys/FIDO2).
- Checking for default credentials on infrastructure (with authorization, in scope).

## Core concepts

- **NIST 800-63B modern guidance:** no periodic forced rotation (it drives weaker passwords); check new passwords against known-breached lists; require length (min 8, encourage passphrases); allow all printable characters; no composition rules or hints.
- **Storage:** passwords must be hashed with memory-hard functions (Argon2id preferred; bcrypt/scrypt acceptable) with unique salts — never plaintext, never reversible encryption, never weak/fast hashes.
- **Breach-exposure screening:** compare your credential set against breach corpora *using k-anonymity-style APIs or local hash-prefix checks* so you never transmit full credentials to a third party.
- **Default credentials:** the fastest audit win — scan in-scope infrastructure for vendor defaults and hardcoded creds (with written authorization).
- **MFA as the real control:** password audits buy time; phishing-resistant MFA and passwordless are the destination. Audit progress toward that, not just password strength.
- **Authorization boundary:** auditing credentials means handling the crown jewels. Scope, approvals, and handling rules in writing before you start; results go to named owners only.

- **Passphrase encouragement.** Length beats complexity: guidance should promote multi-word passphrases and password managers, not character-soup rules users cannot remember.
- **Privileged credential focus.** Audit admin, service, and shared credentials first — their compromise has the highest blast radius and they are the most likely to be static.
- **Manager and vault rollout.** The audit should measure password-manager adoption, because unmanaged passwords end up reused, written down, or emailed.

## Practical workflow

1. **Authorize and scope:** written approval naming the systems, the credential stores in scope, who may see results, and secure handling/destruction rules for any extracts.
2. **Review policy and configuration:** password policy vs NIST 800-63B; lockout/throttling; session handling; storage mechanism (hash algorithm, salt, iteration/work factors) — config review first, it is non-invasive.
3. **Check for defaults and hardcoding:** authorized scan of in-scope infrastructure for default credentials; repo/config scan for hardcoded secrets (rotate anything found, then remove).
4. **Breach-exposure screening:** check whether in-scope accounts appear in breach data using privacy-preserving methods; force resets (with MFA enrollment) for exposed accounts.
5. **Assess the trajectory:** MFA coverage %, phishing-resistant MFA %, passwordless adoption, privileged-account controls. The audit should show movement toward the destination.
6. **Report and remediate:** findings to named owners via secure channel; remediation = resets, policy updates, storage upgrades, MFA rollout milestones. Securely destroy working extracts per the handling plan.

### Audit checklist

- [ ] Policy matches NIST 800-63B (length-based, breach-check on set, no forced rotation)
- [ ] Storage uses Argon2id/bcrypt/scrypt with unique salts; no plaintext/legacy hashes
- [ ] No default credentials on in-scope infrastructure
- [ ] No hardcoded secrets in repos/configs (with rotation for any found)
- [ ] Breach-exposure screening done privacy-preservingly; exposed accounts reset
- [ ] MFA coverage measured; phishing-resistant MFA rollout planned
- [ ] Results handled per written plan; extracts destroyed

### Sustaining the practice

- Re-screen for breach exposure continuously, not just at audit time
- Track MFA and passwordless adoption as the headline metrics
- Re-audit storage mechanisms after every auth-system change
- Fold password findings into the vulnerability-management SLA process

### Metrics that prove it works

- MFA enrollment % and phishing-resistant MFA % across the estate
- Breach-exposed accounts identified and reset (count + time to reset)
- Default-credential findings closed within SLA
- Password-storage upgrade progress (legacy hashes eliminated)

## Common pitfalls

- **Auditing without authorization.** Handling credential material without written scope and approvals is itself a security incident.
- **Transmitting credentials to third parties.** Never upload password lists to external checkers. Use k-anonymity APIs or local comparisons.
- **Forcing rotation on a schedule.** It is counterproductive per NIST; it trains users to pick weaker, predictable passwords.
- **Composition-rule theater.** "Must contain !$#" adds frustration, not entropy. Length is what matters.
- **Stopping at passwords.** An audit that does not push MFA and passwordless is rearranging deck chairs.
- **Leaving extracts around.** Working copies of credential data must be encrypted, access-logged, and destroyed on schedule.
- **Treating it as a one-time audit.** Credential hygiene decays continuously. Build breach-exposure screening and default-cred checks into recurring operations.
- **Ignoring shared and service accounts.** The audit that covers only human users misses the static passwords with the widest access. Include non-human credentials.
- **Treating the audit as a compliance checkbox.** A clean audit with no MFA progress is motion without movement. Tie findings to the passwordless roadmap.
- **Forgetting about password reset flows.** Weak reset mechanisms (guessable security questions, emailed reset links without expiry) bypass strong passwords entirely. Audit them too.
