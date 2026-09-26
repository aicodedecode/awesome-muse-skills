---
name: zero-trust-architect
description: Design zero-trust architecture — identity-centric access, micro-segmentation, continuous verification, and phased migration.
category: security
---

## Overview

Zero trust is a strategy, not a product: **never trust, always verify**. Every access decision — user, device, workload — is authenticated, authorized, and encrypted based on identity and context, regardless of network location. It replaces the castle-and-moat model where "inside the network" meant trusted.

This skill covers the architecture: the pillars (identity, devices, networks, applications, data), policy design, and the phased migration path from legacy perimeter thinking. No vendor pitches — principles and practice.

Zero trust is a strategy for an uncomfortable truth: the network perimeter is gone, and 'inside' no longer means safe. The architecture replaces implicit trust with explicit, continuously evaluated decisions — which is powerful but operationally demanding. Organizations that succeed treat it as a multi-year program with visible milestones, not a product deployment with a go-live date.

## When to use

- Reducing blast radius so one compromised credential does not mean network-wide access.
- Securing hybrid work: users and apps everywhere, no meaningful perimeter.
- Planning phased migration away from VPN-centric remote access.
- Meeting regulatory or customer expectations for modern access architecture.

## Core concepts

- **The core tenets (NIST SP 800-207):** all data sources and services are resources; all communication is secured; access is granted per-session; policy is dynamic (identity + device posture + behavior); the enterprise monitors integrity and security posture of all assets.
- **Identity as the perimeter:** strong identity (phishing-resistant MFA), device posture, and risk signals drive each access decision — not source IP.
- **Least privilege per request:** access is granted to specific resources for the session, continuously re-evaluated — not broad network segments for 8 hours.
- **Micro-segmentation:** workloads isolated so lateral movement requires explicit authorization at each hop; assume breach between every segment.
- **Policy engine + policy enforcement:** a central policy decision point evaluates trust signals; enforcement points (proxies, agents, gateways) carry it out. Design these before buying anything.
- **It is a journey:** nobody "buys zero trust." Maturity progresses pillar by pillar; the roadmap matters more than the starting point.

- **Continuous diagnostics and mitigation (CDM).** Posture signals (patch level, EDR health, encryption status) must flow into access decisions in near real time — stale signals mean stale trust.
- **Data-centric controls.** Classification, labeling, and DLP follow the data beyond any perimeter; zero trust without data governance protects the pipes but not the water.
- **Legacy integration patterns.** Mainframes, OT, and ancient apps will not do OIDC — plan compensating controls (gateways, jump hosts with session recording) rather than permanent exemptions.

## Practical workflow

1. **Define protect surfaces:** inventory crown jewels — the data, apps, and services that matter most. Zero trust starts by protecting what matters, not by boiling the ocean.
2. **Map transaction flows:** for each protect surface, document who/what accesses it, from where, on which devices, and what the current implicit trust assumptions are.
3. **Architect the pillars:** identity (phishing-resistant MFA, lifecycle), devices (posture/compliance checks), network (micro-segmentation, encrypted transport), applications (per-app access control), data (classification, DLP).
4. **Build policy:** write access policies as code where possible — who (verified identity + group), what (specific resource), under which conditions (device compliant, risk low, business hours for sensitive). Start in monitor/audit mode.
5. **Migrate in phases:** pilot on one protect surface (e.g., contractor access to one app via ZTNA); measure UX and security outcomes; expand surface by surface. Keep legacy paths only with explicit risk acceptance and sunset dates.
6. **Monitor and adapt:** continuous diagnostics — policy decisions logged, anomalies investigated, posture signals fed back into risk scoring. Zero trust without monitoring is just complicated trust.

### Phase plan template

- **Phase 0:** inventory protect surfaces, map flows, baseline identity/device posture
- **Phase 1:** identity hardening (phishing-resistant MFA, lifecycle) + pilot ZTNA on one surface
- **Phase 2:** micro-segmentation around crown jewels; per-app policies in enforce mode
- **Phase 3:** expand surfaces; retire legacy VPN paths; continuous verification everywhere
- **Ongoing:** policy-as-code reviews, posture-signal tuning, maturity reassessment

### Sustaining the practice

- Reassess maturity annually against a model (e.g., CISA ZTMM) and publish the delta
- Review policy-as-code changes with the same rigor as application code
- Measure user friction continuously — degraded UX drives shadow IT
- Sunset legacy access paths on committed dates, not 'when convenient'

### Metrics that prove it works

- Protect-surface coverage % under zero-trust policy
- % of access flows via ZTNA/identity-aware paths vs legacy network paths
- Policy-decision audit completeness (can you reconstruct who accessed what?)
- Phishing-resistant authentication % across the estate

## Common pitfalls

- **Buying "zero trust in a box."** It is an architecture of identity, segmentation, and policy — no single product delivers it.
- **Ignoring identity fundamentals.** Zero trust on top of weak passwords and no MFA is theater. Identity hygiene is phase one.
- **Big-bang migration.** Ripping out network access wholesale breaks the business. Phase by protect surface.
- **Forgetting devices and data.** Identity-only zero trust misses compromised endpoints and unclassified data. All pillars matter.
- **Policies nobody can understand.** Over-complex policy-as-code becomes unmaintainable. Keep policies readable, reviewed, and tested.
- **No UX measurement.** If the new model makes work painful, users route around it (shadow IT). Measure and optimize the experience, not just the security.
- **Zero-trust slideware.** Architecture diagrams without defined protect surfaces and mapped transaction flows are marketing. Start with the crown jewels inventory.
- **Forgetting non-human identities.** Service accounts and workloads need the same verify-every-request treatment, or they become the bypass.
- **Declaring victory after SSO + MFA.** Identity hardening is phase one of five pillars, not the destination. Devices, networks, apps, and data need equal attention.
- **Policy exceptions without owners.** Every legacy bypass needs a named owner, compensating controls, and a sunset date — or it becomes the permanent architecture.
