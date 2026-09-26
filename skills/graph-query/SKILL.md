---
name: graph-query
description: Query knowledge graphs for agents: model entities and relations, write traversals, and answer multi-hop questions. Use when answers need connected facts, not just documents.
category: ai-maestro
---

# Graph Query

## Overview

Knowledge graphs store facts as entities and relationships: (person)-[works_at]->(company). Queries traverse these connections to answer multi-hop questions.

Graphs excel where documents struggle: 'which suppliers serve factories in region X?' — two hops, precise answer, with provenance.

For agents: model the domain as entities/relations, load facts, query with traversals, and return answers with their paths.

## When to use

- Answering questions requiring connected facts
- Mapping relationships (org charts, dependencies, networks)
- Multi-hop reasoning over structured knowledge
- Building queryable domain models for agents
- Provenance: showing how an answer was derived

## Core concepts

- **Entities and relations.**
  Nodes (people, projects, components) + typed edges (works_on, depends_on, located_in). The schema is the model — design it deliberately.
- **Multi-hop traversals.**
  Follow chains: person -> project -> dependency -> owner. Each hop is a join; graphs make hops cheap and explicit.
- **Path queries.**
  Find routes between entities: shortest path, all paths, paths matching patterns. 'How is A connected to B?' is a native graph question.
- **Property filters.**
  Constrain traversals by properties: active projects, critical dependencies, region X. Filters prune the search space.
- **Aggregation.**
  Count, sum, group over traversals: 'dependencies per service,' 'people per project.' Graphs aggregate over structure naturally.
- **Provenance.**
  Answers include the path: which entities and relations were traversed. Auditable reasoning, not black-box output.
- **Schema discipline.**
  Consistent entity types and relation names. A messy schema makes queries unwriteable — model first, load second.
- **Graph + vector hybrid.**
  Vector search finds candidates by meaning; graph traverses their connections. Combined, they cover fuzzy and precise needs.

## Practical workflow

1. **Model the domain.**
   List entity types, relation types, key properties. Keep the schema minimal but sufficient — 5-10 entity types typical.
2. **Load facts.**
   Ingest from sources (docs, APIs, databases) into the graph. Validate: spot-check entities and relations for correctness.
3. **Write traversals.**
   Start with single-hop queries; build to multi-hop. Test each hop's results before chaining further.
4. **Answer with paths.**
   Return answers plus the traversal path (entities/relations used). Provenance is part of the answer.
5. **Add filters.**
   Constrain by properties and relation types. Unfiltered traversals on big graphs explode combinatorially.
6. **Aggregate where useful.**
   Counts and groupings over traversals for summary questions. Verify aggregates against spot checks.
7. **Maintain the graph.**
   Update on source changes; prune stale entities; evolve schema deliberately with migration notes.
8. **Combine with search.**
   Vector/semantic search for 'find relevant entities,' graph traversal for 'how do they connect.' Best of both.

## Common pitfalls

- **No schema.**
  Loading facts without a model produces an unqueryable hairball. Schema first, even a simple one.
- **Over-modeling.**
  50 entity types for a simple domain. Start minimal; extend when queries demand it.
- **Unfiltered traversals.**
  Multi-hop queries without constraints on large graphs: combinatorial explosion, timeouts, useless results.
- **Stale graphs.**
  Source data changed, graph didn't. Answers confidently wrong. Update pipelines or the graph rots.
- **Ignoring provenance.**
  Answers without paths. When the answer matters, 'trust me' isn't enough — show the traversal.
- **Graph for everything.**
  Using graph queries for full-text or fuzzy needs. Graphs are for connections; pair with search for meaning.
- **Unvalidated loads.**
  Bulk ingestion without spot-checks. Bad data in a graph propagates through every traversal.
- **No query testing.**
  Complex traversals run once in production. Test hops incrementally; verify against known answers.
