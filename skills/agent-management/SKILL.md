---
name: agent-management
description: Manage fleets of local AI agents: lifecycle, monitoring, task assignment, and resource control. Use when running multiple CLI agents via an orchestrator like AI Maestro.
category: ai-maestro
---

# Agent Management

## Overview

Running one AI agent is a conversation. Running many is operations: lifecycle (start/stop/restart), health monitoring, task assignment, and resource limits.

The AI Maestro pattern: local CLI agents run in managed sessions (e.g., tmux), supervised by an orchestrator that assigns work and watches health.

Good management means: agents are visible, tasks are tracked, failures are noticed, and resources stay bounded.

## When to use

- Running multiple AI agents simultaneously
- Agents dying silently or hanging unnoticed
- Assigning and tracking work across agents
- Long-running agent fleets needing supervision
- Setting up local agent infrastructure

## Core concepts

- **Lifecycle management.**
  Start, stop, restart, hibernate, wake. Agents are processes with states — manage them explicitly, not by hoping.
- **Session isolation.**
  Each agent in its own session (tmux/screen): independent I/O, survivable disconnects, per-agent logs. Never share a session between agents.
- **Health monitoring.**
  Heartbeat or output-activity checks: is the agent alive, working, or stuck? Stuck detection (no output for X minutes) triggers alerts or restarts.
- **Task assignment.**
  Work queue model: tasks with clear specs assigned to agents; status tracked (queued/running/done/failed). No ambiguous 'go help with stuff.'
- **Resource bounds.**
  CPU/memory limits, max concurrent agents, timeout per task. Unbounded agents consume the machine and your budget.
- **Logging per agent.**
  Separate logs per agent/session, timestamped. Debugging a fleet without per-agent logs is archaeology.
- **Naming and roles.**
  Descriptive agent names tied to roles (researcher-1, builder-docs). You manage what you can identify.
- **Graceful shutdown.**
  Stop signals that let agents finish current work and save state. Kill -9 is for emergencies, not routine stops.

## Practical workflow

1. **Define agent roles.**
   What types do you need? Researcher, builder, reviewer, monitor? One role per agent type; name accordingly.
2. **Set up sessions.**
   One managed session per agent with logging. Standardize the launch: same environment, same working directory conventions.
3. **Configure monitoring.**
   Health checks (activity/heartbeat), stuck detection thresholds, alert channel. Test alerts by simulating a stuck agent.
4. **Create the work queue.**
   Task format: goal, context, success criteria, timeout. Assignment: pull model (agents take next task) beats push for reliability.
5. **Set resource limits.**
   Max agents, per-agent timeouts, system resource caps. Document what happens at the limits.
6. **Run and observe.**
   Start small (2-3 agents), watch closely for a day. Tune timeouts, prompts, and queue discipline from real behavior.
7. **Handle failures.**
   Failed task -> logged, requeued or escalated per policy. Dead agent -> alert + restart. Document the runbooks.
8. **Review and scale.**
   Weekly: throughput, failure rate, stuck incidents. Scale agent count only when the management layer proves reliable.

## Common pitfalls

- **Fire-and-forget agents.**
  Launching agents with no monitoring. Silent death is the default outcome of unmanaged agents.
- **Shared sessions.**
  Two agents in one terminal session: interleaved I/O, unkillable individually, undebuggable. One agent, one session.
- **No task specs.**
  'Work on the docs' as a task. Vague tasks produce vague results — spec the goal, context, and done criteria.
- **Unbounded runs.**
  No timeouts: one stuck agent burns budget for 12 hours. Every task gets a timeout; every agent gets supervision.
- **No per-agent logs.**
  One shared log for five agents. When something breaks, you can't tell who did what.
- **Manual everything.**
  Starting/stopping/assigning all by hand. The orchestrator should handle lifecycle; humans handle exceptions.
- **Scaling too fast.**
  20 agents before managing 3 reliably. Management discipline first, fleet size second.
- **Ignoring costs.**
  Agents burn tokens and compute. Track spend per agent/task; set budgets and alerts.
