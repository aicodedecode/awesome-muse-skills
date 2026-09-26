---
name: chaos-engineer
description: Chaos engineering — designing safe failure-injection experiments to build resilience — use when proactively testing system robustness.
category: operations
---

## Overview

Chaos engineering is the disciplined practice of injecting failure to verify
that systems handle it — finding weaknesses in business hours instead of at
3am. Done right, it's careful science: hypothesis, blast radius control, and
abort conditions. Done wrong, it's just breaking production. This skill
covers the methodology that makes it the former.

## When to use

- Designing your first chaos experiments (kill pods, inject latency, drop traffic)
- Building a chaos program: scope, safety, and cadence
- Running game days for critical user journeys
- Validating failover, autoscaling, and degradation behavior
- Convincing stakeholders that controlled failure injection is worthwhile

## Core concepts

**Hypothesis-driven, not random.** Every experiment states a hypothesis:
"We believe killing 30% of pods in zone A keeps p99 latency under 500ms
because the HPA scales and the LB drains." You run the experiment to confirm
or refute — the learning is the point, including (especially) when the
hypothesis is wrong.

**Blast radius starts tiny.** Begin in staging, then production with minimal
scope (one pod, one AZ, 1% of traffic), expanding only as confidence grows.
Controls: target precisely, limit duration, and always have an instant abort
(a big red button, automatic halt on SLO burn).

**Steady-state first.** Define normal (the metrics that characterize health)
before injecting failure, so you can measure deviation objectively. Without
a baseline, every experiment result is an anecdote.

**The five classic failure modes to test:** process death (crash recovery),
network latency/packet loss (degraded dependencies), resource exhaustion
(CPU/memory/disk pressure), dependency failure (what if the cache/DB/3rd
party is down?), and zone/region loss (failover actually working). Most
outages are one of these wearing a costume.

**Game days for the human system.** Scheduled simulations where the team
practices response to a scenario — they test runbooks, communication, and
coordination, not just technology. The debrief often surfaces more value
than the experiment itself.

## Practical workflow

1. **Pick a critical user journey** and map its dependencies (services,
   datastores, third parties, DNS, CDN) — experiments target real paths.
2. **Write the hypothesis** with a falsifiable steady-state claim and
   success criteria tied to SLIs.
3. **Design for safety:** minimal blast radius, short duration, automatic
   abort on guardrail metrics (error budget burn, p99 latency), manual abort
   procedure, and execution during business hours with the owning team
   present and aware.
4. **Run in expanding scope:** staging → production-canary → broader
   production — only advance when the previous scope behaved as hypothesized.
5. **Debrief blamelessly:** what happened vs hypothesis, what broke
   unexpectedly, what the fix is — file action items with owners.
6. **Codify the program:** a backlog of experiments prioritized by risk,
   regular cadence (monthly game day, continuous small experiments), and
   results tracked like any engineering work.

## Common pitfalls

- **Starting in production with wide blast radius** — the fastest way to
  lose organizational trust; earn scope with small wins.
- **No abort conditions** — experiments without automatic halt on SLO burn
  turn "controlled" into "incident we caused on purpose".
- **Testing at 2am to "avoid impact"** — defeats the purpose (fewer eyes,
  slower response); run during business hours with the team ready.
- **Surprising stakeholders** — product, support, and leadership should know
  experiments are happening; surprises erode trust even when nothing breaks.
- **One-off experiments with no follow-through** — finding that failover
  takes 8 minutes is useless if nobody fixes it; the action items are the
  product.
- **Chaos as theater** — killing pods that Kubernetes replaces in seconds
  proves nothing about your actual risks; target the scary unknowns
  (region loss, dependency outage, data corruption paths).
