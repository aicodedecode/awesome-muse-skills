---
name: ai-safety
description: Practice AI safety across the lifecycle — risk assessment, alignment concepts, evaluation, deployment safeguards, and governance. Use when building or deploying AI systems responsibly.
category: ai-research
---

# AI Safety

AI safety is the practice of building systems that do what we intend, don't cause unintended harm, 
and remain under meaningful human control. It spans technical work (alignment, evaluation, 
robustness) and governance (policies, oversight, accountability) — this skill covers both at a 
practitioner level.

## Overview

Think in layers. Technical: train models to follow intent faithfully (alignment), test for 
dangerous capabilities and failure modes (evaluation), harden against adversaries (robustness), and 
keep humans meaningfully in control of consequential actions (oversight). Organizational: risk 
assessments before deployment, clear ownership, incident response plans, and honest communication 
about limitations. Safety isn't a feature added at the end — it's a property of how you build.

## When to use

- Planning any AI deployment: assessing risks before building.
- Designing safeguards for agents with real-world actions.
- Evaluating models for dangerous capabilities or problematic behaviors.
- Establishing team practices: review processes, incident response, accountability.

## Core concepts

- **Risk assessment**: identify hazards (what could go wrong?), assess likelihood and severity, and 
decide mitigations before deployment. Proportional to capability and autonomy — more powerful 
systems need more rigor.
- **Alignment**: the technical problem of models pursuing intended goals — instruction following, 
honesty, and not optimizing proxies in harmful ways. Practically: careful training objectives, 
evals for deceptive or sycophantic behavior, and humility about unsolved problems.
- **Capability evaluation**: testing what the system can do — including misuse-relevant 
capabilities — before deployment. Know your system's powers; don't discover them via incident.
- **Oversight and control**: humans approve consequential actions; systems are monitorable and 
interruptible; no autonomous operation beyond the assessed risk envelope.
- **Defense in depth**: no single safeguard suffices — combine training, evals, input/output 
controls, tool limitations, monitoring, and human gates.
- **Governance**: ownership of safety decisions, documented risk assessments, incident response 
plans, and channels for raising concerns. Safety needs a name attached.

## Practical workflow

1. Assess: for the planned system, list hazards, rate likelihood × severity, and identify the top 
risks.
2. Design mitigations per risk: technical (evals, guardrails, limits) and procedural (approvals, 
monitoring, rollback).
3. Evaluate before deployment: capability tests, adversarial tests, and failure-mode analysis — 
with acceptance criteria defined up front.
4. Deploy gradually: limited rollout, close monitoring, kill switches and rollback ready.
5. Monitor in production: anomaly detection, user reports, periodic re-evaluation as the system and 
environment change.
6. Learn: incident reviews feed back into assessments; update the risk picture as capabilities grow.

```text
Safety review template:
SYSTEM:    <what it does, what it can affect>
HAZARDS:   <what could go wrong — brainstormed broadly>
TOP RISKS: <likelihood × severity, top 5>
MITIGATIONS:<per risk: technical + procedural>
EVALS:     <acceptance criteria + results>
DEPLOY:    <gradual rollout plan + monitoring + kill switch>
OWNER:     <named person accountable>
```

## Common pitfalls

- **Safety as a checklist**: going through motions without engaging with actual risks. The 
assessment must be honest to be useful.
- **Capability blindness**: not knowing what your system can do until it does it publicly. Evaluate 
first.
- **No kill switch**: deployed systems without a way to stop them. Always have one, tested.
- **Autonomy creep**: gradually expanding what the system does without re-assessing. Re-assess on 
every expansion.
- **Diffused accountability**: "the team" owns safety, so nobody does. Name an owner.
- **Optimism about alignment**: assuming the model shares your goals because it usually behaves. 
Test adversarially; monitor continuously.
