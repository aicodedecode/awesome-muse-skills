---
name: penetration-tester
description: Run authorized penetration tests with a defined scope and rules of engagement, and convert findings into prioritized, remediable reports.
category: security
---

## Overview

A penetration test is a **simulated, authorized attack** against an in-scope system to find weaknesses before real attackers do. Its value is not in "breaking in" but in producing an evidence-backed report that a defender can act on: what was found, how it was demonstrated, what it risks, and exactly how to fix it.

This skill covers the standard methodology (PTES/OSSTMM-style: recon → scanning → exploitation-within-bounds → reporting) with the emphasis defenders need: scoping, authorization, safe testing, and remediation guidance. It contains no exploit code or payloads.

Clients buy pentests for decisions: can we launch, will we pass the audit, where should the next security dollar go. Keep that decision in sight from scoping to reporting — a technically brilliant test that does not answer the client's question is a failed engagement, however many shells were popped.

## When to use

- Before a major launch or compliance audit, as an independent validation of controls.
- After significant architecture changes (new auth system, cloud migration, API redesign).
- To validate that a bug-bounty or vulnerability-management finding is actually remediated.
- When a customer or regulator requires evidence of periodic testing (SOC 2, PCI DSS, ISO 27001).
- Never on systems you do not own or lack written authorization to test — that is not pentesting, it is unauthorized access.

## Core concepts

- **Authorization first:** a signed statement of work / rules of engagement naming targets, time windows, allowed techniques, and contacts. Testing cloud assets? Also follow the provider's pentest policy (most major providers allow testing your own assets without prior notice now, but check).
- **Scope is a contract:** IP ranges, domains, apps, and what is *out* of scope (production data exfiltration, DoS, social engineering) must be explicit. Out-of-scope discoveries get reported, not exploited.
- **Standard phases:** intelligence gathering → threat modeling → vulnerability analysis → exploitation → post-exploitation (limited) → reporting.
- **Evidence discipline:** screenshots, request/response pairs, timestamps. A finding without reproduction steps is an opinion.
- **Risk rating:** use CVSS as a starting point, then adjust for the *business context* — a stored XSS in an internal admin tool and one on a public checkout are not the same risk.
- **Retesting:** the test is incomplete until fixes are verified. Budget a retest window.

- **Assume-breach variants.** For mature clients, start testers with a low-privilege foothold to evaluate lateral movement and detection — it tests the controls that matter after initial access.
- **Time-box rabbit holes.** Agree in advance how long to pursue a promising-but-unproven vector before moving on; depth matters, but so does coverage.
- **Chain findings.** A low-severity info disclosure plus a medium misconfiguration often equals a high-severity compromise path. Report the chain, not just the links.

## Practical workflow

1. **Scoping call:** define objectives (what decision does this test inform?), assets, exclusions, windows, and the escalation contact. Put it in writing.
2. **Recon (passive first):** DNS, certificate transparency, WHOIS, public repos — build the asset picture without touching the target. Then active enumeration within scope: ports, services, app mapping.
3. **Vulnerability analysis:** correlate findings with known issues, misconfigurations, and logic flaws. Prioritize by likely impact on the stated objectives.
4. **Controlled exploitation:** demonstrate impact to prove the finding, staying inside the agreed bounds. Stop rules: if you hit customer data, production instability, or the edge of scope — stop, document, escalate.
5. **Write the report:** executive summary (business risk, no jargon), per-finding detail (severity, CVSS, affected asset, reproduction steps, evidence), and remediation guidance with effort estimates.
6. **Debrief and retest:** walk the defenders through findings, agree on fix timelines by severity, then verify fixes in a retest — including regression checks that the fix did not break functionality.

### Report template essentials

- **Finding ID / Title / Severity / CVSS vector**
- **Description:** what is wrong and why it matters
- **Affected assets:** exact hosts, URLs, parameters
- **Reproduction:** numbered steps a defender can follow
- **Evidence:** redacted screenshots/logs (no customer PII)
- **Business impact:** what an attacker could achieve in *this* environment
- **Remediation:** specific fix, plus the systemic fix (pattern, control, test to add)
- **References:** CWE, OWASP, vendor guidance

### Sustaining the practice

- Maintain a findings knowledge base so repeat tests check prior issues first
- Track remediation guidance quality via retest pass rates per finding class
- Brief the SOC on test windows and TTPs afterward to convert the test into detections
- Re-scope annually as the asset inventory and threat model evolve

### Metrics that prove it works

- % of findings remediated and passing retest, by severity
- Time from report delivery to fix, by severity band
- Repeat-finding rate across consecutive tests (should trend down)
- Retest pass rate on first retest attempt

## Common pitfalls

- **Testing without written authorization.** Verbal "go ahead" is not enough. No signed scope, no test.
- **Scope creep mid-test.** Interesting out-of-scope host? Note it, tell the client, get written approval before touching it.
- **DoS by accident.** Aggressive scanning/fuzzing can take down fragile services. Throttle, schedule off-hours, and keep a kill-switch contact.
- **Touching real data.** If exploitation surfaces real user data, stop, redact, and report — never exfiltrate or retain it.
- **Findings without fixes.** "The app is vulnerable to XSS" helps nobody. Include the exact sink, the context, and the encoding fix.
- **No retest.** Unverified fixes are assumptions. Close the loop or the report's value decays to zero.
- **Jargon-heavy executive summaries.** The CISO and the board fund remediation; write the summary so they can.
- **Vague scope producing shallow tests.** "Test our app" without depth, credentials, or objectives yields a scanner-grade report at pentest prices. Define depth explicitly.
- **Skipping the debrief.** The walkthrough transfers nuance no report captures — which findings chain together, what scared the tester. Never waive it.
- **Testing the staging environment and reporting on production.** Staging configs differ; findings may not transfer. Test what you report on, and label the environment clearly.
- **Delivering the report and disappearing.** Offer the remediation Q&A session proactively — it dramatically improves fix quality and speed.
