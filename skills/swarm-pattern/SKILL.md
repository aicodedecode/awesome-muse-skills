---
name: swarm-pattern
description: Orchestrate lightweight multi-agent workflows where agents hand off to each other with routines and context variables.
category: ai-research
---

## Overview

The swarm pattern structures multi-agent work as handoffs between small,
single-purpose agents. Each agent has a name, instructions, a narrow toolset, and
the ability to transfer control to another agent — returning which agent should
act next, optionally with updated context variables. There's no central
orchestrator reasoning over everything; the workflow emerges from the handoff
graph. A triage agent routes to a specialist, the specialist does its job and
hands back or onward.

The power is in the constraints: agents are routines, not general intelligences.
Each does one thing with the minimal tools it needs, which makes behavior
predictable, debuggable, and cheap. The pattern fits workflows that are naturally
staged — intake → specialist → review — better than it fits open-ended
collaboration, where richer orchestration earns its complexity.

Swarm is the multi-agent pattern for people who've been burned by multi-agent
complexity: it trades emergent cleverness for legibility. You can always draw the
handoff graph on a whiteboard and explain exactly what will happen.

## When to use

- Customer-support style routing: triage the request, hand to the right
  specialist, escalate as needed.
- Staged pipelines where each stage needs different tools and instructions
  (research → draft → review).
- When you want agent behavior auditable as "who did what" — handoffs create a
  clean trace.
- Workflows where a single agent's prompt would become an unmanageable grab-bag
  of roles and tools.
- Lightweight orchestration without a heavy framework — the pattern is
  implementable in ~100 lines.
- Teams that need non-engineers to understand and modify the workflow — the graph
  is the documentation.

## Core concepts

- **Agents as routines**: each agent = instructions + functions + allowed
  handoffs. Keep instructions short and role-specific. An agent that does one
  thing well beats a generalist that does five things confusingly.
- **Handoffs**: an agent returns control to another agent (or itself for another
  step). Implement as a function the agent can call, e.g.,
  `transfer_to_refund_agent()`. The handoff graph is your workflow diagram — draw
  it before coding it.
- **Context variables**: a shared dict passed through the handoff chain (customer
  id, collected info, decisions so far). Agents read and update it. This is how
  state survives across agents without dumping full histories everywhere.
- **No central brain**: unlike planner-executor or supervisor patterns, no agent
  sees the whole workflow. Each agent only knows its job and its handoff options.
  Simplicity is the feature — but it means no one is optimizing globally.
- **Triage/entry agent**: the front door. Its whole job is classification and
  routing. Invest in its accuracy — every misroute costs a full specialist cycle.
- **Termination**: define which agents can end the conversation and what "done"
  looks like. Handoff loops (A→B→A→B) are the characteristic failure; detect
  repeated handoff cycles and break them.
- **Handoff conditions**: each handoff should have a trigger condition, not just
  an option. "Hand to billing when the issue involves charges" beats "you may hand
  to billing."
- **Conversation scoping**: decide what history each agent sees. Full history is
  simplest; scoped history (relevant context variables + recent turns) is cheaper
  and keeps specialists focused.

## Practical workflow

1. **Map the workflow as a handoff graph.** Nodes = agents, edges = handoffs. If
   the graph has more than ~6 nodes, you probably need hierarchy, not a flat
   swarm.
2. **Write one-paragraph instructions per agent.** Role, what it handles, what it
   must collect before handing off, who it can hand to. Include 1–2 example
   handoffs.
3. **Define handoff triggers.** For each edge, write the condition that fires it.
   Vague handoff options produce arbitrary routing; triggered handoffs produce
   predictable flow.
4. **Define context variables.** Name the shared state explicitly (don't let agents
   improvise keys). Document which agent writes each variable.
5. **Implement the loop.** While not done: run current agent with conversation +
   context → get response + optional handoff → update context → switch agent. Cap
   total turns.
6. **Test the triage first.** Feed the entry agent a battery of representative
   inputs; misroutes are the most expensive failure. Aim for high routing accuracy
   before testing specialists.
7. **Trace and tune.** Log every handoff with the reason. Common fixes: an agent
   handing off too eagerly (needs a "finish it yourself if..." rule) or too
   reluctantly (needs an explicit escalation trigger).

Checklist for a swarm deployment:
- Handoff graph drawn and reviewed; cycles identified and guarded.
- Handoff triggers written as conditions, not vague options.
- Context variable schema defined and documented.
- Triage accuracy measured on representative inputs.
- Turn cap and handoff-cycle detection in place.
- Each agent's tools are the minimal set for its role.

## Common pitfalls

- **Handoff ping-pong.** Two agents bounce the task back and forth, each thinking
  the other should handle it. Fix with clear ownership rules and cycle detection.
- **Context variable chaos.** Agents inventing keys or overwriting each other's
  state. Schema the variables; validate updates.
- **Triage as an afterthought.** A weak entry agent misroutes everything
  downstream. It's the highest-leverage agent in the swarm — treat it that way.
- **Agents with overlapping mandates.** If two agents could both handle a request,
  the handoff decision becomes arbitrary. Carve responsibilities so they don't
  overlap.
- **No global view when you need one.** The swarm can't optimize across stages. If
  your workflow needs global planning (resource allocation, ordering), add a
  supervisor or switch patterns.
- **Over-decomposition.** Five agents where two would do adds latency, cost, and
  handoff failures. Merge agents until each one earns its existence.
- **Handoff without handover.** Transferring control without transferring the
  relevant context — the next agent re-asks what was already established. Pack
  context variables at handoff time.
- **Untested edge routing.** The triage handles common cases; weird inputs fall
  through. Test adversarial and ambiguous inputs explicitly, with a defined
  fallback agent.
