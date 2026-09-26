---
name: context-window-management
description: Manage LLM context windows deliberately — budgeting, prioritization, summarization, and retrieval instead of dumping everything in. Use when prompts grow long, costs rise, or the model loses track of key details.
category: ai-research
---

# Context Window Management

The context window is the model's working memory: finite, expensive, and subject to attention 
dilution. Managing it means deciding what deserves space, in what form, and for how long.

## Overview

Bigger windows tempt you to dump everything in — full documents, entire histories, all tool 
outputs. But models attend unevenly: information in the middle gets lost, irrelevant content 
distracts, and every token costs money and latency. The skill is curation: budget the window like a 
budget, put the most decision-relevant content where attention is strongest (start and end), and 
move the rest into retrieval or summaries.

## When to use

- Prompts are getting long and outputs are getting worse or more expensive.
- The model ignores instructions buried in large contexts.
- Multi-turn agents accumulate history until they slow down or degrade.
- You're deciding between a bigger model and a better context strategy (try the strategy first).

## Core concepts

- **Context budgeting**: allocate the window explicitly — e.g., 20% system/task, 30% retrieved 
evidence, 30% working state, 20% headroom. Measure actual usage per category.
- **Positional bias**: models attend best to the start (instructions) and end (most recent). Put 
critical instructions first, the immediate task last, and bulk reference material in the middle — 
or better, retrieve it on demand.
- **Compression ladder**: raw text → extractive summary → abstractive summary → key facts → 
embeddings. Move content down the ladder as its immediacy fades.
- **Retrieval over stuffing**: keep a large corpus outside the window; pull in only the passages 
relevant to the current step. RAG is context management.
- **Working state**: a compact, structured scratchpad (goals, decisions, current step) maintained 
separately from the raw history. Cheaper and more reliable than full history.
- **Eviction policies**: when the window fills, what goes? Oldest-first is simple; relevance-based 
is better. Define the policy; don't let it be accidental.

## Practical workflow

1. Measure: log token usage per request broken down by content type. You can't manage what you 
don't measure.
2. Set a budget per category and enforce it in code — truncate, summarize, or retrieve when a 
category overflows.
3. Restructure prompts: instructions first, task and latest context last, reference material 
retrieved per-step.
4. Replace raw history with a maintained working state plus a short recency window.
5. For long documents, retrieve-then-read: fetch relevant chunks per question instead of loading 
the whole document.
6. Re-measure after changes: confirm quality held (or improved) while tokens dropped.

```text
Context budget example (128k window):
System + task instructions:  4k   (front-load, never evict)
Working state (structured):  6k   (maintained, rewritten)
Retrieved evidence:         20k   (per-step, relevance-ranked)
Recent history:             10k   (recency window)
Headroom:                   rest  (for generation)
```

## Common pitfalls

- **Dump-and-pray**: loading everything "because the window is big." Attention dilution degrades 
quality before the window fills.
- **Lost in the middle**: critical instructions buried mid-context. Test with the instruction moved 
to the start; the difference is often dramatic.
- **No measurement**: guessing about token usage. Instrument it — surprises are common.
- **Summarizing away specifics**: compression that drops numbers, names, and commitments. Summaries 
must preserve decision-relevant detail.
- **Retrieval as an afterthought**: bolting RAG onto a stuffed-context design. Design 
retrieval-first for large corpora.
- **Ignoring latency**: long contexts slow generation (quadratic attention costs in many 
architectures). Shorter contexts are faster as well as cheaper.
