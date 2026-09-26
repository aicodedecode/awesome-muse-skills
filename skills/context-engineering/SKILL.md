---
name: context-engineering
description: Engineer the full context a model sees — system prompts, retrieved knowledge, tool definitions, state, and history as one designed artifact. Use when moving beyond prompt tweaks to systematic context design.
category: ai-research
---

# Context Engineering

Prompt engineering optimizes the words; context engineering designs everything the model sees — 
instructions, knowledge, tools, memory, state, and history — as one coherent, budgeted artifact. 
It's the discipline behind reliable agents.

## Overview

Every model call receives a context: system instructions, user input, retrieved documents, tool 
schemas, conversation history, working state. Each component competes for attention and tokens. 
Context engineering treats this as a design problem: what goes in, in what order, in what form, 
with what budget — and how it evolves across turns. The output is a context architecture: 
specified, measured, and iterated like any system design.

## When to use

- Agent reliability plateaus despite prompt tuning — the problem is usually context, not wording.
- Designing a new agent or assistant from scratch: specify the context before the prompts.
- Debugging "the model forgot / ignored / got distracted" issues.
- Optimizing cost and latency: context is where the tokens (and money) go.

## Core concepts

- **Context components**: instructions (durable behavior), knowledge (retrieved facts), tools 
(available actions), state (current task progress), history (what happened). Name each; budget each.
- **Assembly pipeline**: how context gets built per turn — retrieve, rank, truncate, order, 
inject. A real pipeline with stages, not string concatenation.
- **Ordering**: instructions first, task-relevant state next, evidence in the middle, immediate 
query last. Order encodes priority for attention.
- **Dynamic context**: context that changes per turn — retrieved passages for this step, tools 
relevant to this phase, summaries replacing old history. Static contexts rot.
- **Budgets**: per-component token budgets enforced in code. When retrieval overflows, truncate by 
relevance — don't let one component starve the rest.
- **Context observability**: log the assembled context (or its digest) per call. When the model 
misbehaves, inspect what it actually saw.

## Practical workflow

1. Inventory the context: list every component currently fed to the model and its typical token 
cost.
2. Set budgets per component based on measured value — cut or compress the lowest-value tokens 
first.
3. Design the assembly pipeline: retrieval → ranking → budget enforcement → ordering → 
injection.
4. Make it dynamic: per-turn retrieval, phase-appropriate tools, summarized history, maintained 
state.
5. Add observability: log component sizes and a digest of content per call; sample full contexts 
for review.
6. Iterate against evals: change one component at a time, measure quality and cost deltas.

```text
Context architecture spec:
INSTRUCTIONS:  2k tokens — role, guardrails (static, front-loaded)
STATE:         3k — {goal, plan, progress} (rewritten per turn)
TOOLS:         4k — phase-relevant subset (dynamic)
KNOWLEDGE:    15k — retrieved per-step, relevance-ranked (dynamic)
HISTORY:      8k — recency window + rolling summary
BUDGET:       32k soft cap — truncate knowledge first, never instructions
```

## Common pitfalls

- **Prompt-only thinking**: tuning words while the context architecture is broken. Zoom out to the 
full assembly.
- **Static contexts**: the same giant blob every turn. Retrieve per-step; summarize history; phase 
your tools.
- **Unbudgeted growth**: components growing until quality collapses. Enforce budgets in code, not 
in hope.
- **No observability**: debugging model behavior without seeing its context. Log what it saw.
- **Attention naivety**: assuming all context is attended equally. Order deliberately; test 
placement effects.
- **Over-engineering early**: a full dynamic pipeline for a simple task. Start with a spec and 
budgets; add machinery when evals justify it.
