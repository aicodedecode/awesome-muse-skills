---
name: autonomous-agents
description: Build agents that work toward goals with minimal supervision — goal decomposition, self-correction loops, safe autonomy levels, and long-horizon task management. Use when an agent must run for hours or complete open-ended tasks.
category: ai-research
---

# Autonomous Agents

An autonomous agent takes a goal and works toward it with minimal check-ins: decomposing the goal, 
executing steps, verifying progress, and correcting course. The art is in choosing the right 
autonomy level for the risk.

## Overview

Autonomy is a spectrum, not a switch. Level 1: the agent suggests, the human approves each step. 
Level 2: the agent acts within a bounded plan the human approved. Level 3: the agent works toward a 
goal with periodic checkpoints. Level 4: fully independent operation within hard guardrails. Most 
valuable work happens at levels 2–3: the agent does the labor, the human keeps the judgment. 
Moving up the spectrum requires proportionally stronger verification, not just stronger models.

## When to use

- Long-running tasks: research projects, codebase migrations, data pipelines that take hours.
- Open-ended goals: "investigate X and report back" rather than "run this command."
- Batch work where per-item human approval would be the bottleneck.
- Overnight or background processing with a report delivered at the end.

## Core concepts

- **Goal decomposition**: breaking a goal into verifiable subgoals, each with its own 
done-condition. Plans are hypotheses; done-conditions are how you test them.
- **Self-correction loops**: after each action, compare the observation against expectation; on 
mismatch, replan rather than plow ahead. This is what separates autonomy from a script.
- **Checkpoints**: scheduled pauses where the agent summarizes progress and asks for direction. The 
human override point — never remove it for high-stakes work.
- **Verification**: independent checks on the agent's own work — run the tests, re-query the 
source, cross-check numbers. Autonomous agents must distrust themselves.
- **Bounded authority**: the agent's action space is explicitly limited — which tools, which 
data, which side effects. Autonomy inside a fence.
- **Graceful degradation**: when stuck, the agent should narrow scope, ask for help, or deliver 
partial results — never fabricate completion.

## Practical workflow

1. Define the goal as verifiable outcomes, not activities ("produce a report covering X, Y, Z with 
sources" not "research the topic").
2. Set the autonomy level explicitly: what the agent may do alone, what needs approval, what is 
forbidden.
3. Require a plan with checkpoints before execution begins; approve the plan, then let it run.
4. Instrument everything: action log, token spend, elapsed time, checkpoint summaries.
5. On each checkpoint, review: progress vs. plan, surprises found, revised plan. Adjust the 
autonomy level based on observed reliability.
6. End with a verification pass: re-run key checks, confirm claims against sources, deliver a 
complete report of what was done.

```text
Autonomy brief:
GOAL:        <verifiable outcome>
LEVEL:       <2 or 3 — what needs approval>
CHECKPOINTS: <every N minutes or M steps>
ALLOW:       <tools and data in scope>
FORBID:      <side effects never allowed>
STUCK RULE:  <narrow scope → ask → partial delivery>
```

## Common pitfalls

- **Autonomy without verification**: the longer an agent runs unsupervised, the more its errors 
compound. Verification must scale with runtime.
- **Vague goals**: "look into the market" produces uncheckable work. Define done in concrete terms.
- **No stuck policy**: agents that loop, wander, or silently stall. Define what "stuck" looks like 
and what happens next.
- **Authority creep**: starting with read-only and drifting into writes. Keep the fence fixed; 
expanding it is a deliberate decision.
- **Fabricated completion**: agents report success when blocked. Require evidence — artifacts, 
logs, test output — not claims.
- **Skipping checkpoints**: "it was going fine." Checkpoints are cheapest when nothing is wrong; 
they're insurance, not overhead.
