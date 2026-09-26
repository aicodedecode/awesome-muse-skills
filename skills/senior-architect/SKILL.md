---
name: senior-architect
description: Software architect perspective: system decomposition, integration patterns, ADRs, and long-horizon trade-offs. Use when designing systems, evaluating technical direction, or documenting architecture decisions.
category: development
---

# Senior Architect

## Overview

An architect's job is not to draw boxes — it's to make the **expensive decisions cheap to revisit**
and the **cheap decisions fast to make**. This skill captures the architect's toolkit: decomposing
systems along the right seams, choosing integration patterns deliberately, documenting decisions so
future teams understand the *why*, and keeping architecture aligned with team structure and business
risk rather than with fashion.

The through-line: architecture is risk management with diagrams.

## When to use

- Starting a new system or a major rewrite: choosing structure and boundaries.
- Evaluating build-vs-buy, framework, or platform decisions.
- Resolving conflicting technical directions between teams.
- Documenting why the system looks the way it does (ADRs, RFCs).
- Reviewing whether a design will survive 10x growth or a team doubling.

## Core concepts

- **Seams over layers.** Decompose along axes of independent change: things that change for different
  reasons, at different rates, or by different teams belong apart. "Microservices" is an org-scaling
  answer, not a code-quality answer — a modular monolith with clean seams beats premature distribution.
- **Integration patterns, chosen deliberately:**
  - Sync request/response (REST/RPC) — simple, coupled in time; fine within a trust/latency boundary.
  - Async events — decoupled in time, eventual consistency; needs idempotent consumers and schema
    discipline.
  - Shared database — fastest to start, hardest to split later; treat as tech debt with a plan.
  - Pick per boundary, not per fashion. Most systems need all three somewhere.
- **ADRs (Architecture Decision Records).** One short document per significant decision: context,
  options considered, decision, consequences. Future you — or your successor — will otherwise
  re-litigate every choice. Store them in the repo, next to the code they govern.
- **Quality attributes drive design.** Name the top 3 non-functionals (e.g., "p99 < 300ms",
  "survive AZ failure", "onboard a dev in a day") and let them arbitrate every trade-off. Vague
  "scalability" justifies anything; quantified attributes justify the right thing.
- **Conway's law is a tool.** Design team boundaries and system boundaries together — or accept that
  the org chart will design your system for you. If two teams must coordinate to ship, the seam is
  in the wrong place.
- **Evolutionary architecture.** Fitness functions (automated checks on what matters: dependency
  rules, performance budgets, security invariants) keep architecture from decaying silently.

## Practical workflow

1. **Frame the problem.** Write the one-paragraph problem statement, the top-3 quality attributes
   with numbers, and the constraints (team size, timeline, compliance, existing systems).
2. **Explore options divergently.** Sketch 2–3 candidate architectures (e.g., modular monolith vs
   services vs serverless). For each: what it optimizes, what it sacrifices, what kills it.
3. **Decide with an ADR.** Record context, options, decision, and consequences — including what
   would make you revisit it (revisit triggers are the most valuable line in an ADR).
4. **Define the seams contractually.** Module/service APIs, event schemas with versioning policy,
   data ownership (every datum has exactly one writer). Ambiguous ownership is where coupling hides.
5. **De-risk the unknowns with spikes.** Time-boxed prototypes for the riskiest 1–2 assumptions
   (throughput, a vendor's actual behavior, a tricky integration). Throw the spike away; keep the learning.
6. **Install fitness functions.** Automated guards for the invariants you care about: no circular
   module deps, API latency budgets in CI, dependency-license checks.

ADR template (keep it to one page):

```markdown
# ADR-014: Event-driven order fulfillment

## Status: Accepted (2026-09-26)
## Context
Order volume is spiking 10x during sales; fulfillment steps (payment, warehouse,
email) fail independently and shouldn't block each other.
## Decision
Publish `order.placed` events; each fulfillment step consumes independently with
idempotent handlers. Order service owns order state; steps own their own state.
## Consequences
+ Steps deploy and scale independently; partial failures don't block checkout.
- Eventual consistency: order may show "processing" briefly; consumers must be idempotent.
- Need schema registry + dead-letter queues (ops cost).
## Revisit if
Volume stays flat for 4 quarters, or exactly-once semantics become a hard requirement.
```

## Common pitfalls

- **Resume-driven architecture.** Choosing Kafka/Kubernetes/microservices because they're
  prestigious, not because the problem demands them. Complexity is a cost; spend it on the problem.
- **Big-bang rewrites.** "We'll rewrite it properly this time" fails because the old system's
  value is in its bug fixes. Strangler-fig migration — replace piece by piece behind the seam.
- **Undocumented decisions.** Six months later nobody remembers why the cache TTL is 90 seconds.
  ADRs are cheap; archaeology is expensive.
- **Designing for 100x while at 1x.** Solve today's bottleneck with room to evolve; don't build
  the 100x system before product-market fit. Premature distribution is the costliest form.
- **Ignoring the human architecture.** A design requiring five teams to coordinate weekly will
  decay into whatever five teams can ship without talking. Align seams with team ownership.
- **Analysis paralysis.** Architecture is reversible in degrees — reversible decisions should be
  made fast and revisited; only one-way doors deserve long deliberation. Most doors are two-way.
- **Diagrams without decisions.** Beautiful C4 diagrams that nobody references. The diagram is a
  communication aid; the ADR is the artifact.
