---
name: crewai-deep-dive
description: Design role-based agent teams with CrewAI — agents, tasks, crews, and collaboration patterns for complex workflows.
category: ai-research
---

## Overview

CrewAI is a framework for building teams of AI agents that collaborate like a
human crew: each agent has a role, a goal, a backstory, and a toolkit, and each
task has a description, an expected output, and an assigned agent. Agents work
through tasks sequentially or hierarchically, sharing context through the crew's
memory. The role-based framing isn't just flavor — giving an agent a specific
professional identity ("senior data analyst") with a narrow goal produces more
focused, higher-quality behavior than a generic "helpful assistant" with the same
tools.

Two collaboration modes matter: sequential processes (tasks run in order, each
agent building on prior outputs) and hierarchical processes (a manager agent
decomposes work and delegates to worker agents). CrewAI handles the plumbing —
prompt construction from roles, tool wiring, inter-task context passing, and
optional human-in-the-loop checkpoints — so you focus on the org design: which
roles, which tasks, in what order.

Think of it as organizational design for agents: the framework is the HR system,
but you still have to design the org chart. Most CrewAI failures are org-design
failures, not framework failures.

## When to use

- Multi-step knowledge work that maps naturally to professional roles: research →
  analysis → writing → review.
- Content production pipelines (reports, articles, marketing copy) with distinct
  drafting and editing stages.
- When you want non-developers to configure agent behavior — roles and tasks are
  approachable abstractions.
- Prototyping multi-agent collaboration before committing to custom orchestration.
- Workflows needing human approval between stages (the framework supports async
  human input per task).
- Teams that think in roles and handoffs — the mental model matches how they
  already organize work.

## Core concepts

- **Agent definition**: role (job title), goal (one-line objective), backstory
  (experience and perspective — this shapes tone and priorities more than you'd
  expect), tools, and constraints (verbose, max iterations, allow delegation).
  Write backstories that encode the standards you want ("you never ship analysis
  without checking the data source").
- **Task definition**: description (what to do), expected_output (exact format —
  this is the contract between agents), agent assignment, and context (which prior
  tasks' outputs feed in). Vague expected outputs are the #1 source of crew
  failures.
- **Sequential process**: tasks execute in order; each task receives prior tasks'
  outputs as context. Simple, predictable, debuggable. The default choice.
- **Hierarchical process**: a manager agent plans and delegates dynamically. More
  flexible for tasks where the steps aren't known upfront; harder to debug and
  more expensive.
- **Crew memory**: short-term (recent interactions), long-term (persistent
  learnings), and entity memory. Useful for long crews where early context would
  otherwise be lost — but adds complexity; enable deliberately.
- **Human-in-the-loop**: per-task human feedback hooks. Use at high-stakes
  handoffs (approving research before the writing stage begins) rather than
  everywhere.
- **Delegation**: agents can delegate subtasks to each other (when allowed).
  Powerful but blurs accountability — enable selectively and watch for delegation
  chains that wander.
- **Expected output as contract**: the downstream agent's input is the upstream
  agent's expected_output. Write it like an API contract: fields, format, length,
  examples.

## Practical workflow

1. **Decompose the workflow into roles.** Ask: "what team of 2–5 specialists
   would a human manager assemble for this?" Each role becomes an agent. Fewer,
   sharper roles beat many fuzzy ones.
2. **Write role cards carefully.** Role, goal, backstory with encoded standards,
   and explicit non-goals ("you do not write the final copy; you produce the
   outline"). Non-goals prevent role bleed.
3. **Define tasks as contracts.** For each task: description, expected_output with
   format specifics (headings, length, schema), assigned agent, and which prior
   outputs it needs as context.
4. **Choose the process.** Sequential for known pipelines; hierarchical when the
   steps depend on findings. Start sequential — you can graduate to hierarchical
   once the roles are proven.
5. **Wire tools minimally per agent.** The researcher gets search; the writer gets
   no tools (or a docs tool). Tool-per-role discipline prevents agents wandering
   into each other's territory.
6. **Run, read outputs, tighten contracts.** Crews fail at handoffs: the
   researcher's output doesn't match what the writer expected. Fix by making
   expected_output more specific, not by adding more agents.
7. **Add human checkpoints at stakes.** Identify the one or two handoffs where a
   wrong turn is expensive; put human review there. Everywhere else, let the crew
   run.

Checklist for a production crew:
- Every task has a specific expected_output format.
- Roles have non-goals, not just goals.
- Tool assignments are minimal per role.
- Human checkpoint at the highest-stakes handoff.
- Max iterations and timeouts set per agent.
- Delegation settings deliberate (not default-on everywhere).

## Common pitfalls

- **Role bleed.** Agents drift into each other's jobs ("as the researcher, I'll
  also draft the conclusion"). Non-goals in the backstory and tight task contracts
  fix this.
- **Vague expected outputs.** "A summary" means different things to each agent.
  Specify length, structure, and format — the downstream agent depends on it.
- **Too many agents.** Each added agent multiplies handoff failure surface. Start
  with 2–3; add roles only when a distinct capability or perspective is missing.
- **Hierarchical by default.** The manager mode is tempting but produces
  unpredictable, expensive runs. Earn it: prove the workflow sequentially first.
- **Memory without need.** Enabling all memory types for a short crew adds noise
  and cost. Match memory to crew length and statefulness.
- **No output validation.** Agents produce plausible-but-wrong intermediate outputs
  that poison downstream tasks. Validate key handoffs (schema checks, spot
  review) before they propagate.
- **Delegation sprawl.** Agents delegating to each other in long chains, each
  adding noise. Constrain delegation depth and watch the traces.
- **Backstory as decoration.** Writing colorful backstories that don't encode
  standards. Every backstory sentence should shape a decision the agent will face.
