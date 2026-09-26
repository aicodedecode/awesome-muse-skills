---
name: devsecops-pro
description: Embed security into DevOps — pipeline security gates, guardrails, and culture that ships fast and safe.
category: security
---

## Overview

DevSecOps makes security part of how software is built and shipped, not a gate at the end: automated checks in the pipeline, secure defaults in platforms, and developers empowered with fast feedback. The goal is not "more security process" but security at the speed of delivery — where the secure path is the easy path.

This skill covers the practice: pipeline security architecture, choosing the right checks at the right stages, platform guardrails, and the cultural work that makes it stick.

Measure developer friction as carefully as security findings: a pipeline that adds 40 minutes and cryptic failures will be routed around. The best DevSecOps programs obsess over signal quality and speed — fast, accurate, actionable feedback that developers trust.

## When to use

- Designing secure CI/CD pipelines from scratch or maturing existing ones.
- Selecting and tuning SAST/SCA/secrets/DAST/IaC checks per pipeline stage.
- Building platform guardrails (golden paths, policy as code).
- Reducing security review bottlenecks without reducing assurance.
- Measuring DevSecOps maturity and developer experience.

## Core concepts

- **Shift left with guardrails.** Catch issues early (pre-commit, PR) where fixes are cheap — but keep early checks fast and high-signal, or developers disable them.
- **Pipeline stage mapping.** Pre-commit: secrets, lint; PR: SAST, SCA, IaC scan; build: image scan, signing; deploy: admission policy, DAST; runtime: monitoring. Right check, right stage.
- **Policy as code.** Admission and deployment policies versioned, tested, and enforced automatically — security requirements expressed as executable rules, not wiki pages.
- **Golden paths.** Paved-road pipelines and templates with security built in (scanning, signing, hardened bases) — teams get secure defaults by choosing the standard path.
- **Secrets in CI/CD.** Pipeline secrets vaulted with short-lived, scoped credentials (OIDC federation to cloud, not static tokens); masked in logs; rotated automatically.
- **Pipeline as attack surface.** CI/CD systems run with broad credentials and execute untrusted code — harden runners (ephemeral, isolated), protect pipeline definitions (CODEOWNERS, required reviews), and audit pipeline permissions.
- **Risk-based gating.** Block the pipeline only on high-confidence, high-severity findings; warn-and-track the rest. Every false-positive block teaches developers to bypass the gate.
- **Security champions.** Embedded developers with extra training and a direct line to security — they scale the security team and translate both directions.

- **Pipeline artifact attestation.** Attest what each pipeline stage did (tests run, scans passed, approvals given) so deployments are verifiable, not just trusted.
- **Dependency firewalling.** Proxy package registries and block known-malicious packages at install time — the pipeline pulling compromised packages is a supply-chain incident.

## Practical workflow

1. **Map the pipeline:** inventory every stage, runner, secret, and third-party action/integration. You cannot secure what you have not mapped — and pipelines accumulate cruft fast.
2. **Establish the golden path:** a standard pipeline template with scanning, signing, and policy checks built in. New services start here by default.
3. **Tune checks per stage:** enable fast high-signal checks at PR time; deeper scans at build; runtime verification post-deploy. Measure and optimize check duration relentlessly.
4. **Harden the platform:** ephemeral isolated runners, OIDC-based cloud auth, pipeline-definition change control, least-privilege pipeline identities, and audit logging of all pipeline activity.
5. **Build the feedback loop:** findings routed to developers with context and fix guidance (not raw scanner dumps); SLA by severity; security office hours, not just tickets.
6. **Measure both sides:** security metrics (findings per release, MTTR, gate-block rate) and developer metrics (pipeline duration, false-positive block rate, satisfaction). Optimize the pair.

### Quick wins

- Replace static cloud credentials in CI with OIDC federation this quarter
- Pin all third-party pipeline actions to SHAs and review their permissions
- Measure security-check duration per pipeline; optimize the slowest

### Sustaining the practice

- Review gate-block accuracy monthly; tune rules with high false-positive blocks
- Audit pipeline permissions and third-party actions quarterly
- Refresh golden-path templates as stacks and threats evolve
- Run the security-champions program with real investment (time, training, recognition)

### Metrics that prove it works

- Security findings per release trending down; MTTR by severity
- Pipeline duration impact of security checks (target: minimal)
- False-positive block rate (target: near zero — blocks must be trustworthy)
- % of services on the golden-path pipeline

## Common pitfalls

- **Security as a tollbooth.** Slow, noisy gates get bypassed with executive air cover. Speed and signal quality are security requirements.
- **Untrusted pipeline code.** Third-party actions and plugins with broad permissions are supply-chain risk. Pin versions, review permissions, prefer first-party.
- **Static pipeline credentials.** Long-lived cloud keys in CI variables leak constantly. OIDC federation eliminates the secret entirely.
- **Blocking on low-confidence findings.** Every false block erodes trust in all blocks. Gate only on what you would defend in an argument with the team.
- **No pipeline audit trail.** When a bad deploy happens, you need to know what ran, with whose credentials, from which commit. Log it all.
- **Shadow pipelines.** Teams running their own CI outside the standard platform bypass every control. Discover and migrate, with empathy for why they left.
- **Security team as gatekeepers, not enablers.** The cultural failure mode: developers see security as the team that says no. Champions and office hours fix this.
- **Measuring scans instead of outcomes.** "We run 5 scanners" is input. Findings fixed before production and incidents prevented are output.
- **Pipeline admin sprawl.** Everyone with repo admin can modify pipeline definitions. Restrict pipeline-change permissions like production access.
- **Security checks only on main.** Scanning only the default branch misses PR-time prevention. Shift the fast checks left to every pull request.
