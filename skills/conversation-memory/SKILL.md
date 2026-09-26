---
name: conversation-memory
description: Keep long conversations coherent — summarization checkpoints, entity tracking, topic stacks, and graceful context handoffs. Use when dialogues run long or span sessions and the agent keeps losing the thread.
category: ai-research
---

# Conversation Memory

A conversation is a stream of context that eventually overflows. Conversation memory is the 
practice of compressing, indexing, and resurfacing dialogue so long interactions stay coherent 
without drowning in tokens.

## Overview

The technique is checkpoints: at intervals, distill the conversation so far into a compact summary 
capturing decisions, open questions, entities, and tone. Between checkpoints, keep raw recent turns 
for fidelity. When the context fills, drop old raw turns but keep the summaries — the thread 
survives even as the details fade. Add entity tracking (who/what was mentioned and their status) 
and the agent can reference things from an hour ago as naturally as from a minute ago.

## When to use

- Conversations that run for dozens or hundreds of turns.
- Multi-session dialogues where the user expects the agent to remember earlier sessions.
- Support or advisory chats where decisions and commitments must be tracked.
- Any flow where the agent says "as I mentioned earlier" and gets it wrong.

## Core concepts

- **Rolling summary**: a living document updated every N turns or at topic boundaries — decisions 
made, facts learned, open items. The single highest-leverage memory technique.
- **Recency window**: the last K raw turns kept verbatim. Recent detail stays exact; old detail is 
summarized. Tune K to the task's need for precision.
- **Entity tracking**: named people, projects, and items mentioned, each with current status. 
Prevents the agent from forgetting or confusing key nouns.
- **Topic stack**: when the conversation branches, record the stack of open topics so the agent can 
return to a suspended thread gracefully.
- **Checkpoint triggers**: summarize on turn count, topic shift, or user request ("let's pause — 
recap where we are"). Don't wait for overflow.
- **Handoff notes**: a compact brief written at session end — context, decisions, next steps — 
so a fresh session or agent resumes cleanly.

## Practical workflow

1. Set a checkpoint cadence (e.g., every 20 turns or each topic change) and a summary template: 
decisions, facts, open items, entities.
2. After each checkpoint, keep summaries in the system context and trim raw turns beyond the 
recency window.
3. Maintain an entity list in the working context; update statuses as the conversation evolves.
4. When the user references something old, retrieve from summaries first; quote the summary back to 
confirm ("Earlier you decided X — still true?").
5. At session end, write handoff notes: state, pending decisions, suggested next step.
6. On session start, load the last handoff and the entity list — not the full transcript.

```text
Checkpoint summary template:
DECISIONS:  <what was decided, with rationale>
FACTS:      <durable facts learned about user/project>
OPEN:       <unresolved questions, pending items>
ENTITIES:   <name — status — last mentioned>
NEXT:       <suggested continuation>
```

## Common pitfalls

- **Summarizing too late**: waiting for the context to overflow. Summarize proactively at natural 
breakpoints.
- **Lossy summaries**: dropping numbers, names, or commitments. Summaries must preserve specifics, 
not just vibes.
- **No entity tracking**: the agent confuses two people or projects with similar names. Keep an 
explicit list.
- **Stale summaries**: facts corrected later never update the summary. Treat summaries as editable, 
not append-only.
- **Full-transcript reload**: dumping old transcripts into a new session wastes context and 
confuses recency. Use handoff notes.
- **Silent forgetting**: dropping context without telling the user. When you compress, say so 
briefly — trust depends on it.
