---
name: knowledge-graphs
description: Build and query knowledge graphs — entity extraction, relation modeling, graph databases, and graph-based reasoning. Use when relationships between entities matter as much as the entities themselves.
category: ai-research
---

# Knowledge Graphs

A knowledge graph stores the world as entities and relationships: people, places, concepts 
connected by typed edges. It answers questions that tables and vectors struggle with — multi-hop 
relationships, structured constraints, and "how are these connected?"

## Overview

Building one: extract entities and relations from text (or model them from structured data), 
resolve duplicates (entity linking), store in a graph database, and query with graph patterns. The 
power is in traversal — following relationships across hops — and in combining graph structure 
with vector similarity for hybrid retrieval. The cost is modeling effort: the schema (ontology) 
must be designed, and extraction quality bounds everything.

## When to use

- Questions needing multi-hop reasoning: "which suppliers of X were affected by event Y?"
- Connecting fragmented data: entities scattered across documents and systems.
- Enriching RAG with structured relationships alongside text retrieval.
- Domains with rich natural structure: biomedicine, law, enterprise data, research.

## Core concepts

- **Ontology/schema**: the entity and relation types you model. Design from the questions you need 
to answer — not from what's easy to extract. Start narrow; expand deliberately.
- **Entity extraction and linking**: finding mentions in text and resolving them to canonical 
entities ("Apple" the company vs. the fruit). Linking quality determines graph quality.
- **Relation extraction**: identifying typed relationships between entities. Harder than entity 
extraction; LLMs have made it practical, but validation is essential.
- **Graph storage**: graph databases for traversal-heavy workloads; triple stores for 
RDF/standards-based; property graphs for rich node/edge attributes. Match to query patterns.
- **Graph queries**: pattern matching (find subgraphs matching a shape), pathfinding 
(shortest/constrained paths), aggregations over neighborhoods. Think in traversals, not joins.
- **Graph + vector hybrid**: vector search for "find relevant entities," graph traversal for 
"expand along relationships." The combination outperforms either alone.

## Practical workflow

1. Define the questions first; derive the minimal ontology that answers them.
2. Prototype extraction on a sample: LLM-based extraction with a strict schema, then human 
validation of precision/recall.
3. Build the linking layer: canonical entity resolution with confidence scores; keep provenance for 
every edge.
4. Load into the graph store; index for your query patterns (traversal depth, common filters).
5. Write and test the key queries; verify answers against source documents.
6. Set up incremental updates: new documents → extract → link → merge, with conflict handling.

```text
KG build checklist:
[ ] Target questions defined; ontology derived from them
[ ] Extraction validated on sample (precision/recall measured)
[ ] Entity linking with confidence + provenance per edge
[ ] Store chosen for traversal patterns
[ ] Key queries tested against ground truth
[ ] Incremental update + conflict policy in place
```

## Common pitfalls

- **Ontology sprawl**: modeling everything possible instead of what's needed. Start from questions, 
keep it minimal.
- **Unvalidated extraction**: trusting LLM-extracted triples blindly. Sample and measure; errors 
compound across hops.
- **No entity resolution**: "IBM," "I.B.M.," "International Business Machines" as three nodes. 
Linking is not optional.
- **Provenance lost**: edges without sources can't be trusted or debugged. Record where every fact 
came from.
- **Graph-only retrieval**: ignoring vectors. Hybrid (vector for entry points, graph for expansion) 
wins.
- **Stale graphs**: built once, never updated. Knowledge changes; plan the update pipeline from day 
one.
