---
name: multi-agent-architect
description: Design multi-agent systems — communication topologies, coordination protocols, shared state, consensus, and failure handling across agents. Use when one agent isn't enough and you need several to collaborate reliably.
category: ai-research
---

# Multi-Agent Architect

Multi-agent systems trade simplicity for capability: specialists collaborate on work no single 
agent handles well. The architecture decisions — how agents talk, who decides, what happens when 
one fails — determine whether you get a team or a traffic jam.

## Overview

Design along four dimensions. Topology: how agents connect (star, mesh, hierarchy, pipeline). 
Coordination: how work is assigned and sequenced (central planner, auctions, emergent). 
Communication: what messages agents exchange (structured task objects, not free prose). State: 
what's shared vs. private, and how consistency is maintained. Get these right and the team scales; 
get them wrong and you get deadlock, duplication, and blame diffusion.

## When to use

- Complex workflows with genuinely different subtasks needing different expertise or tools.
- Parallel work where independent agents can proceed simultaneously.
- Redundancy and cross-checking: agents verifying each other's work.
- Simulations or analyses where multiple perspectives improve the outcome.

## Core concepts

- **Topologies**: pipeline (assembly line), star (coordinator + workers), hierarchy (managers + 
specialists), mesh (peer-to-peer). Hierarchy and star are easiest to debug; mesh is most flexible 
and most chaotic.
- **Coordination protocols**: who assigns work — a central orchestrator, task auctions, or 
self-organizing claims. Explicit protocols beat "figure it out yourselves."
- **Message contracts**: structured messages with type, sender, recipient, payload schema, and 
correlation IDs. Free-prose inter-agent chat is undebuggable.
- **Shared vs. private state**: a shared blackboard for coordination facts; private working memory 
per agent. Define what goes where.
- **Consensus**: voting, judge agents, or quorum rules for decisions that need agreement. Specify 
the tie-breaker in advance.
- **Failure semantics**: what happens when an agent stalls, errors, or disagrees — timeouts, 
reassignment, escalation, graceful degradation of the team.

## Practical workflow

1. Prove a single agent can't do it: multi-agent is a cost you pay, not a feature you add. Start 
simple.
2. Choose the topology: pipeline for assembly lines, star/hierarchy for managed work, mesh only 
when peers truly need direct negotiation.
3. Define message contracts and the shared state schema before writing any agent logic.
4. Implement coordination explicitly: task queue, assignment rules, completion signals, timeouts.
5. Add observability: a unified event log of all inter-agent messages with timestamps — the 
debugger of last resort.
6. Test failure injection: kill an agent mid-task, delay messages, force disagreements. The system 
must degrade, not collapse.

```text
Design template:
TOPOLOGY:   star — coordinator + 3 specialists
MESSAGES:   {type, from, to, task_id, payload, reply_to}
SHARED:     task board {id, status, owner, result}
COORD:      coordinator assigns; workers claim; timeout 5 min
CONSENSUS:  judge agent decides ties; coordinator breaks deadlocks
FAILURE:    stalled worker → reassign; 2 failures → escalate to human
```

## Common pitfalls

- **Premature distribution**: multi-agent before single-agent works. Distribution multiplies every 
existing problem.
- **Prose protocols**: agents negotiating in free text. Use structured messages with schemas.
- **No timeouts**: waiting forever on a silent agent. Every wait has a deadline and a fallback.
- **Shared-everything state**: all agents writing to one unstructured blob. Partition state; define 
ownership.
- **Blame diffusion**: when the team fails, no one knows which agent caused it. Per-agent logs and 
clear handoffs fix this.
- **Coordination overhead ignored**: five agents spend more time coordinating than working. Measure 
useful-work ratio; simplify when it drops.
