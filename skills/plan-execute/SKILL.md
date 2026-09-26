---
name: plan-execute
description: Split agents into a planner that strategizes and an executor that acts — with replanning when reality diverges.
category: ai-research
---

## Overview

Plan-and-execute separates the agent into two roles: a planner that decomposes the
task into a step-by-step plan, and an executor that carries out each step (often a
ReAct-style loop). After each step, a replanner compares what actually happened
against the plan and revises the remaining steps. The separation exists because
planning and acting demand different cognitive modes — the planner thinks in
dependencies and strategy without tool-call tunnel vision, while the executor
focuses on the concrete mechanics of each step.

This architecture shines on multi-step tasks where the plan is non-obvious but the
steps are individually straightforward: research reports, data pipelines,
multi-stage analysis. The replanning step is what makes it robust — a pure
plan-then-execute pipeline shatters on the first surprise, while
plan-execute-replan adapts.

The plan is also a human interface: it's the artifact a person reviews, edits, and
approves. That makes plan-execute the right pattern whenever a human needs to stay
in the loop on strategy while the agent handles tactics.

## When to use

- Multi-step tasks (5+ steps) with dependencies between steps.
- Tasks where a wrong early step wastes a lot of work — planning first avoids
  thrash.
- When you want a human-readable plan for approval before execution begins.
- Workflows mixing very different step types (research, then code, then write-up)
  where one executor prompt can't cover everything well.
- Long-running tasks where you want checkpointing: the plan is the natural resume
  point.
- Regulated or high-stakes workflows where the plan serves as the audit record of
  intended actions.

## Core concepts

- **The plan as data structure**: an ordered list of steps, each with a
  description, expected output, and dependencies. Keep steps coarse (5–10 for a
  typical task) — too fine and the planner micromanages; too coarse and the
  executor is lost.
- **Planner prompt**: given the task and any constraints, output the step list.
  Few-shot with example plans for your domain. The planner should also state
  assumptions and what would invalidate the plan.
- **Executor**: takes one step plus accumulated context, executes it (tool calls as
  needed), returns a result summary. The executor doesn't see the whole plan —
  just its step and prior results — which keeps it focused.
- **Replanner**: after each step, given the original plan, completed results, and
  the latest outcome, outputs the revised remaining plan: unchanged, reordered, or
  rewritten. This is the feedback loop that handles reality.
- **Plan approval gate**: optional human review of the plan before execution. Cheap
  insurance for expensive or irreversible workflows.
- **Step results as context**: each step's summarized output feeds the next steps
  and the replanner. Summarize aggressively — full tool dumps from step 2 will
  drown step 8.
- **Plan invalidation criteria**: the planner states what would break the plan
  ("if the API has no export endpoint, replan around manual download"). This gives
  the replanner something to check against.
- **Checkpointing**: the plan plus completed step results is a complete resume
  state. Persist it — long tasks get interrupted.

## Practical workflow

1. **Define the step granularity for your domain.** Write 2–3 example plans by
   hand. If a human expert would naturally break the task this way, the
   granularity is right.
2. **Build the planner.** Prompt with the task, constraints, available
   tools/capabilities, and example plans. Output: numbered steps with expected
   outputs. Validate plans on sample tasks before wiring execution.
3. **Build the executor.** A focused agent (ReAct loop works well) that receives
   one step + prior summaries and returns a structured result: what was done, key
   outputs, issues encountered.
4. **Build the replanner.** Trigger after each step (or only when a step reports
   issues, to save cost). Input: original task, remaining plan, step results so
   far. Output: revised plan or "proceed."
5. **Add the approval gate (optional).** Show the plan to a human for high-stakes
   tasks. Allow editing the plan, not just approve/reject — edited plans teach you
   what the planner gets wrong.
6. **Persist state.** Save plan + step results after each step. Long-running tasks
   need resume; debugging needs history.
7. **Instrument the loop.** Log plans, per-step results, and replans. The
   interesting debugging question is always "why did the replan change step 4?" —
   you need the history to answer it.

Checklist for a plan-execute system:
- Planner validated on sample tasks before execution wired up.
- Replanner triggers defined (every step vs. on-issue-only).
- Step results summarized before passing forward.
- Human approval gate for expensive/irreversible runs.
- State persisted for resume; full plan history logged.

## Common pitfalls

- **Plans too detailed.** A 30-step plan for a 20-minute task means the planner is
  doing the executor's job badly. Steps should be subgoals, not keystrokes.
- **Replanning every step unconditionally.** Full replans after uneventful steps
  waste tokens and can destabilize a good plan. Replan on signal (errors,
  surprises), confirm otherwise.
- **Executor without step context.** Giving the executor the whole plan diffuses
  focus; giving it nothing leaves it lost. One step + prior summaries is the sweet
  spot.
- **No plan invalidation criteria.** Without explicit "this would break the plan"
  conditions, the replanner can't distinguish drift from disaster.
- **Treating the plan as a contract.** Plans are hypotheses. If the executor
  treats a stale plan as mandatory, you get the worst of both worlds — rigidity
  plus overhead. The replanner must have real authority to change course.
- **Skipping the planner for simple tasks.** Plan-execute has overhead (3+ model
  calls before anything happens). For 1–3 step tasks, plain ReAct is faster and
  just as good. Route by complexity.
- **No persistence.** A long task that can't resume after interruption. The plan
  is a natural checkpoint — use it.
- **Approval gate theater.** A human "approving" plans they don't read. Make the
  gate meaningful: show diffs on replan, highlight risky steps, allow edits.
