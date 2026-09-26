---
name: agent-memory-architectures
description: Architect persistent, searchable memory for agents — episodic, semantic, and procedural stores with retrieval, consolidation, and forgetting policies. Use when designing how an agent remembers across sessions.
category: ai-research
---

# Persistent Memory Architectures for Agents

An agent that forgets everything between sessions can't learn, personalize, or maintain long 
projects. This skill covers memory as a system architecture: layered stores, retrieval pipelines, 
consolidation jobs, and forgetting policies — protocol- and vendor-neutral.

## Overview

Think of agent memory like a data platform with three layers. The hot layer is working context: 
fast, exact, bounded. The warm layer is searchable episodic and semantic memory: past interactions, 
facts, preferences, indexed for similarity and keyword retrieval. The cold layer is consolidated 
knowledge: distilled playbooks, long-term project state, archived with pointers back to sources. 
Between layers run pipelines — consolidation (compressing hot into warm/cold) and retrieval 
(surfacing warm/cold into hot at decision time). Forgetting is a first-class pipeline too.

## When to use

- Designing memory for an agent that works with a user or project over weeks or months.
- Choosing between memory approaches: flat vector store vs. layered architecture vs. structured 
records.
- Debugging "the agent forgot" or "the agent remembers wrong" problems.
- Adding personalization or long-horizon project tracking to an existing agent.

## Core concepts

- **Layered stores**: working (session), episodic (what happened), semantic (what's true), 
procedural (how to do things). Different lifetimes, different retrieval, different update rules.
- **Memory records**: structured entries — content, type, timestamp, source, confidence, expiry 
— not raw text blobs. Structure enables precise retrieval and updates.
- **Hybrid retrieval**: combine semantic similarity, keyword matching, recency, and type filters. 
Pure vector search misses exact facts; pure keyword misses paraphrases.
- **Consolidation pipeline**: scheduled jobs that turn session transcripts into durable records — 
extract facts, resolve entities, merge duplicates, update confidences.
- **Conflict resolution**: when new information contradicts stored memory, update the record (with 
provenance) rather than appending a contradiction.
- **Forgetting policies**: TTLs per memory type, confidence decay on disuse, explicit user 
deletion. Stale memory is worse than no memory.
- **Access control**: memories have owners and visibility scopes. Personal facts stay private; 
project facts stay in the project.

## Practical workflow

1. Define the memory schema: record types, fields, and which layer each type lives in.
2. Build the write path: session-end consolidation that extracts structured records from raw 
interaction.
3. Build the read path: hybrid retrieval that injects a compact, ranked memory brief into working 
context.
4. Implement conflict handling: detect contradictions, update with provenance, keep a change 
history.
5. Set forgetting policies per type: session trivia expires fast; user preferences persist; project 
facts expire with the project.
6. Give users inspection and deletion: a memory browser beats a black box for trust and correctness.

```text
Memory record schema:
{id, type: episodic|semantic|procedural,
 content: "...", entities: [...],
 source: <session/transcript pointer>,
 confidence: 0-1, created: <ts>, updated: <ts>,
 expires: <ts|null>, owner: <user|project>}
```

## Common pitfalls

- **Flat vector store for everything**: one undifferentiated pile. Layer and type your memory; 
retrieval quality depends on it.
- **No consolidation**: raw transcripts piled into the store. Distill before storing or retrieval 
drowns in noise.
- **Append-only updates**: contradictions accumulate. Update and version records; keep provenance.
- **Retrieval without ranking**: injecting the top-k by similarity alone. Blend similarity, 
recency, type relevance, and confidence.
- **Ignoring privacy**: storing sensitive facts without scoping or deletion. Memory systems need 
access control and purge paths.
- **No forgetting**: everything remembered forever. Design expiry from day one — it's harder to 
retrofit.
