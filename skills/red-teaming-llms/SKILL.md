---
name: red-teaming-llms
description: Red-team LLM systems methodically — scoping, adversarial test design, vulnerability classification, and remediation tracking. Use when you need to find weaknesses before attackers do. Defensive security practice only.
category: ai-research
---

# Red-Teaming LLMs

Red-teaming is structured adversarial testing: deliberately trying to make the system fail — 
produce harmful outputs, leak data, bypass controls, get hijacked — so you can fix it before 
deployment. It's a security discipline, not mischief: scoped, documented, and aimed at remediation.

## Overview

A red-team engagement: define scope (what system, what threat model, what's off-limits), design 
adversarial tests across vulnerability classes, execute methodically while documenting everything, 
classify findings by severity, and track remediation to closure. The output isn't a list of 
"gotchas" — it's a risk assessment with prioritized fixes and re-test results.

## When to use

- Before launching any user-facing LLM feature: the pre-deployment security review.
- After significant changes: new tools, new data sources, model updates.
- Periodic assessment of production systems: threats evolve.
- Building an internal AI security practice: establishing the methodology.

## Core concepts

- **Scoping**: the system under test, threat model (who attacks, with what access), and rules of 
engagement. Unauthorized testing is not red-teaming — get explicit permission.
- **Vulnerability classes**: harmful content generation, prompt injection (direct/indirect), data 
exfiltration (training data, system prompts, user data), tool abuse (injection + actions), access 
control bypass, denial of service (resource exhaustion). Cover each systematically.
- **Test design**: adversarial cases per class — from known techniques to creative variants. Keep 
tests private; they're dual-use.
- **Severity rating**: impact × exploitability. A data leak via trivial prompt injection outranks 
an exotic multi-turn bypass with no impact.
- **Documentation**: every test — input, output, classification, severity — recorded. Findings 
without evidence don't get fixed.
- **Remediation loop**: findings → fixes → re-test → closure. A red-team report that nobody 
acts on is theater.

## Practical workflow

1. Get authorization: written scope, threat model, rules of engagement, and handling rules for 
findings.
2. Map the attack surface: inputs, tools, data flows, trust boundaries, deployment context.
3. Design tests per vulnerability class; execute methodically; document every attempt and result.
4. Classify findings by severity with evidence; write the report for the people who'll fix things 
— concrete, prioritized.
5. Track remediation: each finding gets an owner, a fix, and a re-test. Nothing closes without 
verification.
6. Archive tests privately; share defensive learnings (patterns, mitigations) — never attack 
specifics — with the broader team.

```text
Engagement template:
SCOPE:     <system, version, threat model>
RULES:     <authorized by, off-limits, data handling>
SURFACE:   <inputs, tools, data flows mapped>
TESTS:     <per class: cases designed/executed>
FINDINGS:  <severity, evidence, affected component>
REMEDIATE: <owner, fix, re-test result per finding>
STATUS:    <open / remediated / accepted-risk>
```

## Common pitfalls

- **No authorization**: testing systems you weren't asked to test. Get it in writing first — 
always.
- **Gotcha hunting**: collecting clever bypasses without severity assessment or remediation. 
Findings must drive fixes.
- **Publishing attacks**: sharing working exploits publicly. Report to owners; publish defenses and 
patterns only.
- **One-and-done**: a single engagement before launch, never repeated. Threats evolve; so must 
testing.
- **Scope creep**: testing beyond authorization. Stay in scope; expand it formally if needed.
- **No re-test**: fixes assumed to work. Every remediation gets verified with the original test 
plus variants.
