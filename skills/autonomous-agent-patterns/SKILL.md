---
name: autonomous-agent-patterns
description: A pattern catalog for autonomous agents — ReAct, plan-and-execute, reflection, multi-agent debate, toolformer-style tool use, and when each fits. Use when choosing the control pattern for an agent task.
category: ai-research
---

# Autonomous Agent Patterns

Behind every agent is a control pattern: the loop structure that turns model outputs into actions. 
This is a catalog of the proven patterns, what each is good at, and how to choose.

## Overview

Patterns differ along three axes: who plans (the model on the fly vs. a pre-made plan), how actions 
are chosen (reasoning traces, structured calls, votes), and how errors are handled (retry, reflect, 
escalate). No pattern dominates; the right one depends on task structure, reversibility of actions, 
and cost budget. Learn the catalog, then match the pattern to the problem.

## When to use

- Choosing the control loop for a new agent instead of defaulting to the first tutorial you saw.
- Diagnosing why an agent fails: often the pattern doesn't fit the task.
- Combining patterns: reflection on top of ReAct, planning before a tool loop.

## Core concepts

- **ReAct (reason + act)**: interleave thought, action, observation. Best for exploratory tasks 
where the next step depends on what you find. Simple, flexible, can wander.
- **Plan-and-execute**: make a full plan up front, then execute steps, replanning on failure. Best 
for structured, decomposable tasks. Brittle if the world surprises you mid-plan.
- **Reflection / self-critique**: after acting, the agent critiques its own output and revises. 
Improves quality on writing, coding, and analysis. Costs extra model calls; gains compound on hard 
tasks.
- **Toolformer-style tool use**: the model learns when external tools beat internal knowledge — 
calculator for arithmetic, search for fresh facts. The pattern behind all modern tool-calling.
- **Multi-agent debate**: several agents propose and critique solutions; a judge picks. Improves 
robustness on judgment-heavy tasks at high cost.
- **Hierarchical**: a planner decomposes, workers execute, the planner integrates. Scales to 
complex projects; coordination overhead is the tax.
- **Program-aided**: the agent writes and runs code instead of reasoning in prose. Best for 
anything with exact computation — math, data analysis, simulations.

## Practical workflow

1. Classify the task: exploratory vs. structured, reversible vs. irreversible actions, single-shot 
vs. long-horizon.
2. Pick the simplest fitting pattern: ReAct for exploration, plan-and-execute for structured work, 
program-aided for computation.
3. Add reflection only where quality matters enough to pay for the extra calls.
4. Set the pattern's parameters: max steps, replan triggers, debate rounds, worker count.
5. Evaluate the pattern against one alternative on your task set — patterns are hypotheses until 
measured.
6. Combine deliberately: e.g., plan-and-execute with ReAct workers, reflection before final output.

```text
Pattern picker:
Exploratory, unknown steps      → ReAct
Known structure, clear steps    → Plan-and-execute
Quality-critical output         → + Reflection pass
Exact computation needed        → Program-aided (write+run code)
Judgment-heavy, high stakes     → Multi-agent debate + judge
Large decomposable project      → Hierarchical planner + workers
```

## Common pitfalls

- **One pattern for everything**: ReAct for a task that needs a plan, or planning for pure 
exploration. Match the pattern to the task.
- **Reflection without a critic**: the agent praising its own work. Reflection needs a genuine 
critique prompt or a separate critic.
- **Debate theater**: multiple agents agreeing with each other. Force dissent: assign 
devil's-advocate roles explicitly.
- **Ignoring cost**: debate and hierarchy multiply model calls. Budget per task and check the 
quality-per-dollar.
- **No fallback**: when the pattern fails (plan invalid, debate deadlocked), there must be a 
defined fallback — escalate, simplify, or stop.
- **Pattern purism**: refusing to combine. Real systems are hybrids; the catalog is ingredients, 
not religions.
