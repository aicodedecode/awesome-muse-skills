---
name: planning-with-files
description: Plan complex work with files: write plans as documents before executing, for agents and humans. Use when coordinating multi-step work that needs review, handoff, or persistence.
category: workflow-automation
---

# Planning with Files

## Overview

Writing the plan as a file before acting turns vague intentions into reviewable, shareable, resumable work.

For AI agents: a plan file is the contract — the human reviews it, the agent executes it, both can resume from it.

For humans: plan files beat plans in heads or chat scrollback. They're versionable, linkable, and check-off-able.

Core practice: PLAN.md (or similar) with goal, steps, status, and decisions — updated as work progresses.

## When to use

- Directing an AI agent through multi-step work
- Complex projects needing a reviewable plan before execution
- Work that spans sessions and needs resumability
- Handoffs between people or between human and agent
- Keeping long-running work on track and visible

## Core concepts

- **Plan as contract.**
  The file states: goal, non-goals, steps, success criteria. Reviewed before execution starts. Changes go through the file.
- **Status tracking.**
  Steps marked todo/doing/done. Anyone (human or agent) can see exactly where things stand, even mid-work.
- **Decision log.**
  Key choices recorded with reasoning and date. Prevents re-litigating decisions and explains the 'why' later.
- **Checkpoints.**
  Explicit review points: 'pause for approval before step 5.' Plans with checkpoints catch drift early.
- **Resumability.**
  A good plan file lets work resume after interruption — new session, new agent, next day — without re-derivation.
- **Separation of plan and execution.**
  Planning mode (think, write, review) vs. execution mode (do, update status). Mixing them causes thrash.
- **Living document.**
  The plan updates as reality intrudes: completed steps checked, blocked steps noted, new steps added. Stale plans mislead.
- **Right size.**
  Enough detail to execute without guessing; not so much that planning replaces doing. One page for small tasks, more for projects.

## Practical workflow

1. **Write the goal first.**
   One paragraph: what success looks like, what's out of scope. Vague goals produce vague plans.
2. **Break into steps.**
   Concrete, ordered, checkable steps. Each step: action, expected outcome, how to verify. Dependencies explicit.
3. **Mark checkpoints.**
   Where must a human review before proceeding? Mark them. Irreversible or expensive steps always get checkpoints.
4. **Review the plan.**
   Human (or lead agent) reviews before execution. Fix the plan now — it's 10x cheaper than fixing execution later.
5. **Execute with updates.**
   Work the steps; update statuses in the file as you go. The file is the source of truth, not memory.
6. **Log decisions.**
   Choices made mid-execution go in the decision log with reasoning. Future readers (including you) need the why.
7. **Handle blocks explicitly.**
   Blocked step: note what's blocking, who's needed, workaround options. Don't silently stall.
8. **Close out.**
   All steps done: verify success criteria, summarize outcomes, archive or link the plan. Done means verified, not just finished.

## Common pitfalls

- **Planning in chat scrollback.**
  Plans buried in conversation can't be reviewed, resumed, or handed off. Files persist; chat evaporates.
- **No success criteria.**
  Plans without verifiable outcomes can't be completed — only abandoned. Define 'done' upfront.
- **Skipping review.**
  Executing an unreviewed plan at full speed. The review is the cheapest quality control available.
- **Stale plan files.**
  Plan written, reality diverged, file never updated. A stale plan is worse than none — it misleads with authority.
- **Over-planning.**
  20-page plans for 2-hour tasks. Match plan weight to task weight; planning should accelerate, not replace, doing.
- **No checkpoints.**
  Long autonomous runs with no review points. Drift compounds; checkpoints catch it early.
- **Mixing plan and execution.**
  Rewriting the plan mid-step instead of finishing the step. Plan mode and execution mode are different mindsets.
- **Unrecorded decisions.**
  Choices made and forgotten, re-debated later. The decision log is the plan file's memory.
