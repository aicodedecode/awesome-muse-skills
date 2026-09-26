---
name: planning
description: Plan multi-step AI agent work: decompose goals, sequence agents, define handoffs, and handle failure. Use when orchestrating agents through complex tasks that need structure before execution.
category: ai-maestro
---

# Planning

## Overview

Agents execute well but plan poorly without structure. Planning is the discipline of decomposing a goal into sequenced, assignable steps before any agent acts.

In the AI Maestro model, planning produces an explicit plan: goal, steps, agent assignments, dependencies, checkpoints, and success criteria.

Good plans make multi-agent work reliable: each agent knows its task, its inputs, its outputs, and when to hand off.

Plan once, execute many: the plan is reviewable, resumable, and reusable.

## When to use

- Complex tasks needing multiple agents or steps
- Agent work that keeps drifting or duplicating effort
- Coordinating handoffs between specialized agents
- Long-running work that must survive interruptions
- Reviewing agent strategy before burning execution budget

## Core concepts

- **Decomposition.**
  Break the goal into steps small enough for one agent to complete confidently. Each step: clear input, clear output, verifiable done-ness.
- **Sequencing and dependencies.**
  Order steps by dependency: what must finish before what can start? Parallelize independent steps; sequence the dependent ones.
- **Agent assignment.**
  Match steps to agent capabilities: researcher for gathering, coder for building, reviewer for checking. Right agent, right step.
- **Handoff contracts.**
  Define exactly what passes between steps: file paths, data formats, key facts. Vague handoffs are where multi-agent work dies.
- **Checkpoints.**
  Human (or supervisor) review points before irreversible or expensive steps. Plans without checkpoints drift.
- **Success criteria.**
  Verifiable conditions for 'done' per step and overall. Without them, agents optimize for activity, not outcomes.
- **Failure branches.**
  For each risky step: what if it fails? Retry, fallback step, or escalate? Plans that assume success break on contact with reality.
- **Plan as artifact.**
  The plan lives in a file: readable, reviewable, resumable. Execution updates it; it never lives only in chat.

## Practical workflow

1. **State the goal.**
   One paragraph: outcome, constraints, non-goals. The plan serves the goal — get it crisp first.
2. **Decompose into steps.**
   Break down until each step is agent-sized: clear inputs, outputs, and done criteria. Number them; note dependencies.
3. **Assign agents.**
   Match each step to the best-suited agent type. Note required context each agent needs at handoff.
4. **Define handoffs.**
   For each boundary: what artifact passes, in what format, where. Write the contracts explicitly.
5. **Add checkpoints and criteria.**
   Review points before big steps; success criteria per step and overall. Make 'done' verifiable.
6. **Review the plan.**
   Human reviews before execution: are steps right-sized? Dependencies correct? Risks covered? Fix now, cheaply.
7. **Execute with tracking.**
   Run steps in order; update plan status as you go. Blocked steps get noted with cause, not silently skipped.
8. **Close out and learn.**
   Verify success criteria; record what the plan got right/wrong. Feed lessons into the next plan.

## Common pitfalls

- **Skipping planning.**
  Throwing agents at a complex goal with no decomposition. Activity without architecture wastes budget and time.
- **Oversized steps.**
  'Research the market' as one step. Steps must be completable in one focused agent run with verifiable output.
- **Vague handoffs.**
  'Pass the results to the next agent.' What results, in what format, where? Handoff vagueness compounds across steps.
- **No checkpoints.**
  Long agent runs with no review. Drift compounds silently; checkpoints catch it while it's cheap.
- **Planning forever.**
  Analysis paralysis: planning the plan. Timebox planning; a good-enough plan executed beats a perfect plan drafted.
- **Ignoring dependencies.**
  Parallelizing steps that actually depend on each other. Dependency errors surface as rework — map them upfront.
- **No failure branches.**
  Assuming every step succeeds. One failed step with no fallback stalls the whole plan.
- **Plan in chat only.**
  Plans in scrollback can't be tracked, resumed, or reviewed. The plan is a file, always.
