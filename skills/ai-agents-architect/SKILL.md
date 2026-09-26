---
name: ai-agents-architect
description: Architect autonomous agent systems — perception/action loops, tool design, planning strategies, memory, and multi-agent orchestration patterns. Use when designing an agent from scratch or scaling a prototype to production.
category: ai-research
---

# AI Agents Architect

Agent architecture is the set of decisions that turn a capable language model into a system that 
acts reliably: how it perceives, plans, uses tools, remembers, and recovers. This skill covers 
those decisions as engineering trade-offs.

## Overview

Every agent is a loop: perceive state, reason about it, take an action, observe the result, repeat. 
Around that loop sit the supporting systems — tools with clean interfaces, a planner that 
decomposes goals, memory that persists context, and guardrails that bound behavior. The architect's 
job is to pick the right loop topology (single agent, supervisor, swarm), the right planning 
strategy (reactive vs. deliberative), and the right failure semantics for the task's risk level.

## When to use

- Designing a new agent system: choosing loop structure, tools, and memory before writing code.
- A prototype agent is unreliable: diagnosing whether the fix is prompting, tool design, planning, 
or evaluation.
- Scaling from demo to production: adding guardrails, observability, cost controls, and 
human-in-the-loop.
- Deciding between single-agent, hierarchical, and multi-agent designs for a complex workflow.

## Core concepts

- **Perception-action loop**: the core cycle — state in, reasoning, action out, observation back. 
Keep the loop observable: log every turn with its inputs and outputs.
- **Tool design**: tools are the agent's hands. Each tool needs a clear name, typed inputs/outputs, 
idempotency where possible, and informative errors. A few excellent tools beat twenty vague ones.
- **Planning strategies**: reactive (ReAct-style: think-act-observe) for exploratory tasks; 
plan-then-execute for structured workflows; hierarchical (planner + workers) when subtasks are 
parallelizable.
- **Memory**: short-term scratchpad for the current task, persistent memory for cross-session 
knowledge. Separate them; they need different retrieval and update rules.
- **Guardrails**: input validation, output filters, action allowlists, budget caps, and escalation 
paths. Guardrails are architecture, not decoration.
- **Observability**: traces, token accounting, latency breakdown, and a replayable event log. You 
cannot improve what you cannot see.

## Practical workflow

1. Define the task contract: inputs, outputs, success criteria, and what "done" means in 
machine-checkable terms.
2. Prototype the loop with 2–3 tools and a fixed eval set of 10–20 representative tasks.
3. Measure reliability before adding features: success rate, cost per task, failure modes. Fix the 
dominant failure mode first.
4. Add tools one at a time, each with standalone tests; keep the tool surface minimal.
5. Introduce guardrails early for irreversible actions: confirmation gates, dry-run modes, 
allowlists.
6. Productionize: tracing, dashboards, alerts on error rate and cost anomalies, and a human 
escalation path.

```text
Architecture checklist:
[ ] Loop topology chosen and justified
[ ] Tool contracts typed + documented + tested
[ ] Max iterations, timeouts, and budgets set
[ ] Irreversible actions gated
[ ] Full trace logged per run
[ ] Eval set with success criteria
```

## Common pitfalls

- **Tool sprawl**: adding tools for every edge case. Each tool multiplies the planning space; 
consolidate ruthlessly.
- **No eval set**: iterating on vibes. Build the eval set before the second iteration of the agent.
- **Prompt-as-architecture**: stuffing all logic into a mega-prompt instead of structuring tools, 
memory, and control flow in code.
- **Unguarded side effects**: letting the agent send, delete, or purchase without confirmation. 
Gate anything irreversible.
- **Ignoring cost**: long loops with big models get expensive fast. Budget per task and alert on 
drift.
- **Premature multi-agent**: adding agent teams before a single agent works. Multi-agent systems 
multiply coordination failure modes.
