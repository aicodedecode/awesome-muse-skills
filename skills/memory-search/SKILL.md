---
name: memory-search
description: Search agent memory effectively: recall prior decisions, facts, and context across conversations. Use when an agent needs to remember what was learned before.
category: ai-maestro
---

# Memory Search

## Overview

Agents without memory start every conversation from zero. Memory systems store durable facts, decisions, preferences, and history — searchable when needed.

Effective memory search: store well (atomic claims, sourced, dated), retrieve with multiple query phrasings, and verify before acting on old memories.

The pattern: write memories as you learn, search before deciding, and update when facts change.

## When to use

- Agent needs prior context about the user or project
- Recalling past decisions and their reasoning
- Finding what was learned in earlier sessions
- Verifying a fact before acting on it
- Maintaining continuity across long-running work

## Core concepts

- **Atomic claims.**
  Store one fact per memory entry: who said it, when, the exact claim. Atomic entries retrieve precisely; paragraphs retrieve vaguely.
- **Source and date.**
  Every memory notes its origin (conversation date, document) and timestamp. Old memories need age-checking before use.
- **Multiple query phrasings.**
  Search with 2-3 different wordings of the same question. Retrieval is fuzzy — varied phrasings catch what one misses.
- **Verify before acting.**
  Retrieved memories are leads, not gospel. Check the source context for anything consequential before acting on it.
- **Update, don't just add.**
  When facts change, update or supersede the old memory. Contradictory memories without resolution poison future retrieval.
- **Salience and decay.**
  Not all memories matter equally. Boost frequently-used, correct memories; let stale, unused ones fade. Memory needs gardening.
- **Scoped retrieval.**
  Search the right store: user preferences vs. project facts vs. session history. Scoped search beats global noise.
- **Provenance chains.**
  For important claims, keep the chain: memory -> source conversation -> original evidence. Auditability matters for trust.

## Practical workflow

1. **Capture as you learn.**
   Durable facts, decisions, preferences -> memory immediately, in atomic form with source and date. Don't batch 'later.'
2. **Search before deciding.**
   Before acting on prior work, preferences, or history: search memory with 2-3 phrasings. Make it a habit, not an afterthought.
3. **Read the context.**
   For top hits, pull the surrounding source context. A claim without context is easy to misapply.
4. **Act on verified memories.**
   Use verified memories to inform decisions; note the memory as the basis so the reasoning is traceable.
5. **Update on change.**
   New information contradicting a memory? Update the entry (or mark superseded) immediately. Stale memories are worse than none.
6. **Garden periodically.**
   Review memories: still true? Still relevant? Merge duplicates, retire the dead. Monthly for active stores.
7. **Handle conflicts.**
   Two memories disagree: check sources and dates, prefer newer + better-sourced, record the resolution.
8. **Respect privacy.**
   Memories contain personal data. Scope access, never leak across users, and honor deletion requests completely.

## Common pitfalls

- **Never searching.**
  Having memory but deciding from scratch each time. The search habit is the whole value proposition.
- **Single phrasing.**
  One query, no hits, giving up. Retrieval needs 2-3 varied phrasings — different words catch different entries.
- **Acting on stale memories.**
  Using a year-old preference as current fact. Check dates; verify anything consequential.
- **Memory hoarding.**
  Storing everything verbatim. Uncurated memory becomes unsearchable noise — atomic, salient, gardened.
- **Contradictions unresolved.**
  Old and new memories disagreeing silently. Resolve explicitly or retrieval becomes a coin flip.
- **No provenance.**
  Facts without sources. When challenged ('where did you learn that?'), sourceless memories collapse.
- **Cross-user leakage.**
  One user's memories surfacing for another. Scope strictly; this is a privacy failure, not a feature.
- **Treating memory as truth.**
  Memory is a lead, not evidence. Verify against sources for anything that matters.
