---
name: agent-memory-systems
description: Design memory for AI agents — short-term context, long-term stores, retrieval strategies, and memory-augmented reasoning. Use when an agent must remember facts, learn preferences, or stay coherent across sessions.
category: ai-research
---

# Agent Memory Systems

Memory is what turns a stateless chatbot into an agent that learns. A memory system has three 
parts: what gets stored, how it's retrieved, and how it's forgotten or updated. Design all three 
deliberately.

## Overview

Short-term memory is the working context: the conversation, recent tool outputs, the current plan. 
It's fast, exact, and bounded by the context window. Long-term memory persists across sessions: 
facts about the user, project state, learned preferences, past decisions. The bridge between them 
is retrieval — deciding what to recall and when — and write policies — deciding what deserves 
to be remembered. The best systems treat memory as a living document with explicit update and 
expiry rules, not an append-only log.

## When to use

- The agent must remember user preferences or project facts between sessions.
- Long conversations lose track of earlier decisions or constraints.
- The agent repeats questions the user already answered.
- You want the agent to learn from corrections ("I prefer X, stop doing Y").
- Multi-step work needs durable state: plans, progress, intermediate results.

## Core concepts

- **Working memory**: the active context — system prompt, recent messages, scratchpad. Managed by 
window size, summarization, and attention to what matters now.
- **Episodic memory**: records of past interactions — "on Tuesday the user asked for X and we 
decided Y." Useful for continuity and personalization.
- **Semantic memory**: durable facts and preferences — "user prefers concise answers," "project 
uses Postgres." Updated by explicit correction or inferred from patterns.
- **Procedural memory**: reusable skills and workflows the agent has learned — playbooks, 
checklists, prior successful plans. The highest-leverage memory type.
- **Retrieval**: similarity search over stored memories at decision time, injected as context. 
Retrieval quality determines whether memory helps or adds noise.
- **Consolidation**: periodically compressing working memory into long-term stores — nightly 
summaries, session notes, preference extraction.
- **Forgetting**: TTLs, confidence decay, and explicit deletion. Without forgetting, memory fills 
with stale facts that mislead the agent.

## Practical workflow

1. Decide the memory contract: what must persist across sessions vs. what lives in one conversation.
2. Implement a session-end consolidation step: summarize decisions, extract durable facts, file 
them by category.
3. On session start, load a compact memory brief (top facts + active goals), not the entire store.
4. Use mid-session retrieval: before answering, query long-term memory for relevant facts with the 
current context as the query.
5. Give the user visibility and control: let them inspect, edit, and delete stored memories — 
trust and correctness both improve.
6. Version or timestamp everything; when a new fact contradicts an old one, update rather than 
append.

```text
Memory brief injected each session:
- User facts:  [name, timezone, project, preferences]
- Open items:  [in-progress tasks, pending decisions]
- Constraints: [things to never do again — from corrections]
```

## Common pitfalls

- **Append-only memory**: storing everything and updating nothing. Stale facts accumulate and the 
agent starts contradicting itself.
- **Retrieval without relevance**: injecting loosely related memories adds noise. Set a similarity 
threshold; show sources so the agent can judge.
- **No forgetting policy**: facts from months ago treated as current. Add TTLs or confidence decay, 
and review periodically.
- **Memory as black box**: the user can't see or fix what's stored. Expose it; the best correction 
mechanism is the user.
- **Storing raw transcripts**: huge, unstructured, expensive. Store distilled facts and summaries 
with pointers back to the source.
- **Single-tier design**: one flat store for everything. Separate working, episodic, semantic, and 
procedural memory — they need different retrieval and update rules.
