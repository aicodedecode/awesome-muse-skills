---
name: babyagi-pattern
description: Build autonomous task-driven agents with the BabyAGI loop — task creation, prioritization, and execution from a single objective.
category: ai-research
---

## Overview

BabyAGI is the archetypal autonomous agent loop: given a single objective, the
agent maintains a task list, and three sub-agents cycle through it — a
task-creation agent that breaks the objective (and completed results) into new
tasks, a prioritization agent that orders the list, and an execution agent that
works the top task. Completed results feed back into task creation, so the agent
recursively decomposes and pursues the objective without further human input. It
was one of the first widely-shared demos of "give an AI a goal and let it run."

As an architecture it's more inspirational than optimal — the fixed three-role
loop is rigid, and unconstrained task creation drifts. But the pattern's core
ideas (a persistent task list as the agent's agenda, recursive decomposition,
results feeding back into planning) recur in every serious autonomous agent built
since. Study it to understand the design space; build on it with guardrails.

BabyAGI is best understood as a teaching skeleton: implement it to learn where
autonomous loops break, then replace the breaking parts with your own control
flow.

## When to use

- Open-ended objectives where the steps can't be enumerated up front ("research
  the competitive landscape for X").
- Learning agent architecture: it's the simplest complete autonomous loop to
  implement and instrument.
- As a starting skeleton to evolve — replace the fixed roles with your own control
  flow once you see where it breaks.
- Tasks benefiting from persistent, inspectable agendas — the task list is a
  readable record of what the agent decided to do.
- Low-stakes exploration where drift is acceptable and interesting.
- Demonstrations of autonomous behavior where the journey matters as much as the
  destination.

## Core concepts

- **The task list**: the agent's agenda — an ordered list of natural-language
  tasks. It's both the plan and the state. Persist it; it's your window into the
  agent's intentions and your checkpoint for resuming.
- **Task creation agent**: given the objective, the last result, and the current
  list, proposes new tasks. Prompt it to be concrete ("find pricing for competitor
  X") not vague ("research competitors"). Cap new tasks per cycle to bound list
  growth.
- **Prioritization agent**: reorders the list given the objective and recent
  results. This is where strategic sense lives or dies — a bad prioritizer chases
  shiny subtasks while the critical path starves.
- **Execution agent**: works the top task with tools, returns a result summary.
  Typically a ReAct loop. Its output quality bounds everything downstream — garbage
  results spawn garbage follow-up tasks.
- **The objective**: the single natural-language goal anchoring everything. Every
  role's prompt includes it verbatim. Vague objectives ("improve our product")
  produce wandering agents; specific ones ("list the top 5 competitors' pricing
  tiers with sources") produce focused ones.
- **Result feedback**: completed task results go to task creation, closing the
  loop. This is what makes it autonomous rather than a static plan — but also what
  lets errors compound, since bad results beget bad tasks.
- **Completion detection**: an explicit check each cycle — "is the objective
  complete?" Without it, the loop doesn't know when to stop.
- **Human steerability**: the task list is editable mid-run. A human who can
  reorder, add, or delete tasks turns an autonomous loop into a supervised one
  when needed.

## Practical workflow

1. **Write a specific objective.** One sentence, verifiable completion criteria.
   "Research X and produce a comparison table with sources" beats "learn about X."
2. **Implement the three roles.** Each is a prompted LLM call: creation (objective
   + last result + task list → new tasks), prioritization (objective + list →
   ordered list), execution (task + tools → result).
3. **Add the guardrails first.** Max iterations, max tasks created per cycle, a
   denylist of actions, human approval for irreversible steps. An unconstrained
   loop is a liability, not a feature.
4. **Seed the task list.** Start with 2–4 sensible first tasks rather than an
   empty list — it orients the agent and avoids a cold-start wander.
5. **Add completion detection.** Each cycle, ask whether the objective's criteria
   are met. Define "done" in the objective so this check is answerable.
6. **Run with observability.** Log every task created, prioritized, executed, and
   its result. Watch for the characteristic failure modes: task-list bloat,
   priority thrash (reordering without progress), and execution loops on impossible
   tasks.
7. **Evolve past the template.** Once running, you'll find which role is the
   bottleneck — usually prioritization or execution quality. Replace or augment
   that role (better prompts, different models, human-in-the-loop) rather than
   tuning all three equally.

Checklist for running a BabyAGI-style loop:
- Objective specific with verifiable completion.
- Iteration and task-creation caps set.
- Irreversible actions require approval.
- Completion detection implemented.
- Full task-list history logged.
- A human can inspect and edit the task list mid-run.

## Common pitfalls

- **Objective drift.** Without grounding, task creation wanders — each generation
  of tasks is a little further from the original goal. Re-anchor: every creation
  prompt restates the objective and asks "does this task serve it directly?"
- **Task-list bloat.** Uncapped creation produces hundreds of trivial tasks. Cap
  new tasks per cycle and merge duplicates.
- **Priority thrash.** The prioritizer reorders constantly without executing, or
  buries the critical path. Consider executing top-k before reprioritizing, or
  pinning priority for N cycles.
- **No completion detection.** The loop doesn't know when it's done. Define done
  in the objective and add an explicit "is the objective complete?" check each
  cycle.
- **Error compounding.** A bad execution result spawns follow-up tasks based on
  false premises. Have the creation agent sanity-check results ("is this result
  plausible?") before spawning children.
- **Running it on the wrong tasks.** BabyAGI-style autonomy suits open-ended
  research, not precise workflows. For deterministic multi-step work, plan-execute
  with a fixed plan is more reliable and cheaper.
- **Guardrails as afterthought.** Bolting on iteration caps after the loop has
  already misbehaved in testing. Design the cage before releasing the animal.
- **Treating the template as final.** Running stock BabyAGI in production instead
  of evolving it. The pattern is a starting point — the production system should
  look quite different.
