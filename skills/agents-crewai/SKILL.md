---
name: agents-crewai
description: Coordinate teams of role-based agents — role definitions, task delegation, sequential and hierarchical workflows, and shared memory. Use when a job naturally splits into specialist roles collaborating.
category: ai-research
---

# Role-Based Multi-Agent Teams

Some work is naturally done by a team: a researcher gathers facts, an analyst crunches them, a 
writer drafts the report. Role-based agent frameworks let you define specialists, assign them 
tasks, and orchestrate how they collaborate.

## Overview

The pattern assigns each agent a role (with goals and backstory that shape its behavior), equips it 
with tools, and gives it tasks. Orchestration comes in flavors: sequential (A's output feeds B), 
hierarchical (a manager agent decomposes and delegates), or parallel (specialists work 
independently, then synthesize). Shared memory lets agents build on each other's work. The 
framework handles the plumbing; your job is role design, task decomposition, and quality gates.

## When to use

- Complex deliverables needing distinct expertise: research + analysis + writing, or plan + code + 
review.
- Workflows with natural handoffs where each stage benefits from a focused specialist.
- Parallel investigation: multiple angles explored simultaneously, then synthesized.
- When a single agent's context gets overloaded by juggling too many roles.

## Core concepts

- **Role definition**: each agent gets a role, goal, and constraints. Sharp roles ("you verify 
claims against sources; you never write prose") produce sharper output than generalists.
- **Task decomposition**: the overall job broken into tasks with descriptions, expected outputs, 
and dependencies. Tasks are the unit of delegation.
- **Orchestration patterns**: sequential pipelines for assembly lines; hierarchical for a manager 
coordinating specialists; parallel for independent investigation with a synthesis step.
- **Shared memory**: a common store where agents publish findings for others to consume. Prevents 
duplicated work and lost context at handoffs.
- **Quality gates**: review steps between stages — a critic agent or a deterministic check before 
the next stage consumes the output.
- **Delegation rules**: who can assign work to whom. Unconstrained delegation leads to agent 
thrash; keep the org chart explicit.

## Practical workflow

1. Map the workflow to roles: what expertise does each stage need? Define 2–4 roles, each with a 
crisp goal.
2. Write tasks with explicit expected outputs (format, length, required sections) so handoffs are 
mechanical.
3. Choose the orchestration pattern: sequential for pipelines, hierarchical for complex delegation, 
parallel + synthesis for research.
4. Pilot with a small run: watch the handoffs — most failures happen at role boundaries, not 
inside roles.
5. Add a review gate before final output: a critic role or a human check on the assembled 
deliverable.
6. Log inter-agent messages; when quality drops, the transcript shows which handoff broke.

```text
Team design template:
ROLES:  [researcher: finds facts + sources] [analyst: checks + structures]
        [writer: drafts] [critic: verifies claims]
FLOW:   researcher → analyst → writer → critic → writer (revise)
GATES:  analyst rejects unsourced claims; critic checks final draft
SHARED: findings board — every fact with source URL
```

## Common pitfalls

- **Too many agents**: each agent adds coordination overhead and failure modes. Start with the 
minimum viable team.
- **Vague roles**: "helpful assistant" roles produce generic output. Give each role a sharp, narrow 
identity.
- **Handoff gaps**: output of one stage doesn't match the next stage's input expectations. Specify 
the contract at every boundary.
- **No critic**: teams without a verification role accumulate errors through the pipeline. Always 
include review.
- **Delegation loops**: agents assigning work back and forth. Constrain who can delegate to whom; 
cap delegation depth.
- **Shared memory bloat**: everything published, nothing curated. Keep the shared store structured 
and pruned.
