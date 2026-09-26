---
name: agents-autogpt
description: Run goal-driven autonomous agent loops — decomposing objectives, executing tool chains, self-critiquing, and iterating until done. Use when exploring what fully autonomous task execution looks like and its limits.
category: ai-research
---

# Goal-Driven Autonomous Loops

The autonomous-loop pattern: give an agent a goal, and let it plan, act, observe, and replan in a 
loop until the goal is met or it gives up. It's the purest form of "agent" — and the best teacher 
of why autonomy needs guardrails.

## Overview

The loop has four phases: plan (decompose the goal into steps), act (execute tools), observe (read 
results), and critique (evaluate progress and adjust). Memory holds the plan and findings across 
iterations. The loop terminates on goal completion, a step budget, or a give-up condition. This 
pattern shines for open-ended research and exploration — and fails instructively at long-horizon 
reliability, which is exactly what studying it teaches.

## When to use

- Open-ended research tasks: "investigate X and summarize findings."
- Exploring the capabilities and failure modes of autonomous agents.
- Prototyping automation for tasks too ill-defined for a fixed pipeline.
- Learning exercises in agent design — the loop makes every design decision visible.

## Core concepts

- **Goal representation**: the objective stated as checkable outcomes. Vague goals produce 
wandering loops; concrete goals produce convergent ones.
- **Plan-act-observe-critique**: the core cycle. The critique step — "did that work? what did I 
learn?" — is what separates this from blind execution.
- **Working memory**: the evolving plan, collected findings, and action history. Without it, the 
agent repeats itself.
- **Termination conditions**: success criteria, step/time budgets, and stall detection. A loop 
without termination is a liability.
- **Tool repertoire**: the actions available — web, code execution, file ops. The loop is only as 
capable as its tools.
- **Self-critique**: the agent evaluates its own progress honestly. This is the weakest link — 
models are optimistic about their own work — so add external checks.

## Practical workflow

1. Write the goal as verifiable outcomes with a clear done-condition.
2. Seed the loop with a bounded tool set and a step budget (e.g., 25 steps).
3. Run the loop; watch the critique step — it's where you learn whether the agent tracks reality.
4. Add stall detection: if three consecutive steps produce no new information, force a replan or 
stop.
5. Require evidence for completion claims: artifacts, quotes, data — not assertions.
6. Review the full trace afterward; classify where time went and which failure modes appeared.

```text
Loop pseudocode:
plan = decompose(goal)
while not done(plan) and steps < BUDGET:
    action = next_step(plan, memory)
    result = execute(action)
    memory.update(result)
    critique = evaluate(progress vs goal)
    if stalled(critique): replan or stop
    plan = revise(plan, critique)
report(memory, evidence)
```

## Common pitfalls

- **No step budget**: the loop runs until the credit card complains. Always cap steps, time, and 
cost.
- **Trusting self-critique**: the agent declares victory prematurely. Verify completion with 
independent checks.
- **Goal drift**: vague goals let the loop wander into interesting-but-irrelevant territory. 
Restate the goal in the critique prompt.
- **Tool failures unhandled**: one broken tool poisons the whole loop. Wrap tools with retries and 
fallbacks.
- **Memory bloat**: the action history grows until the context chokes. Summarize periodically; keep 
the plan separate from the log.
- **No human checkpoint**: fully autonomous loops on consequential tasks. Add approval gates for 
irreversible actions, always.
