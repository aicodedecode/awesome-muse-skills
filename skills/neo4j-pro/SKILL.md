---
name: neo4j-pro
description: Neo4j graph modeling and Cypher — use when relationships are the data: fraud, recommendations, knowledge graphs.
category: database
---

## Overview

Neo4j stores data as nodes and relationships, making multi-hop traversals —
"friends of friends who bought X" — fast where relational joins get expensive.
The skill is in modeling the graph well and writing Cypher that traverses
efficiently. This skill covers both, plus operations.

## When to use

- Modeling highly connected domains (fraud rings, org charts, supply chains,
  knowledge graphs, recommendations)
- Writing Cypher: `MATCH` patterns, aggregations, path queries
- Choosing between relationship properties vs intermediate nodes
- Tuning traversals with indexes, query plans (`EXPLAIN`/`PROFILE`)
- Running Neo4j: backups, clustering, memory config

## Core concepts

**Model relationships as first-class citizens.** In a graph, the edge is data:
`(:Person)-[:WORKS_AT {since: 2020}]->(:Company)`. Direction matters semantically
("manages" vs "managed by") even though traversals can ignore it. Relationship
properties hold facts about the connection itself; if the connection needs its
own identity or many attributes, promote it to a node (reification).

**Cypher reads like ASCII art.** `(a:Person)-[:KNOWS]->(b:Person)` declares the
pattern and the engine finds it. Keep patterns anchored: start from indexed,
selective nodes (`MATCH (p:Person {id: $id})`) before expanding — unanchored
traversals scan the graph.

**Supernodes are the enemy.** A node with millions of relationships (a "celebrity"
user, a "USD" currency node) makes traversals touching it explode. Mitigate with
more specific relationship types, time-bucketed intermediate nodes, or by
excluding supernodes from traversal patterns.

**Variable-length paths are powerful and dangerous.** `(a)-[:KNOWS*1..3]->(b)`
finds friends up to 3 hops away — but unbounded `*` on a dense graph can run
forever. Always bound depth, and prefer shortest-path functions
(`shortestPath`, `allShortestPaths`) for pathfinding.

**Indexes and constraints.** Create indexes on node properties used for lookup
anchors (`CREATE INDEX FOR (p:Person) ON (p.id)`); unique constraints double as
indexes and enforce integrity. Without them, every query starts with a label
scan.

## Practical workflow

1. **Whiteboard the domain** as circles and arrows first — if you can't draw it,
   the model isn't ready. Name relationship types as verbs in SCREAMING_SNAKE.
2. **Load a representative sample** and run your top queries with `PROFILE`;
   confirm traversals start from indexed anchors and expand selectively.
3. **Write Cypher in stages:** `MATCH` anchors → `OPTIONAL MATCH` or `WHERE`
   filters → `WITH` to reshape → aggregations/`RETURN`. Keep `WITH` boundaries
   explicit so you control cardinality.
4. **Parameterize everything** (`$userId`, not literals) — enables plan caching
   and prevents injection.
5. **Batch writes** (`UNWIND $batch` + `MERGE`) instead of one query per row;
   use `apoc.periodic.iterate` (APOC) for very large loads.
6. **Operate:** regular backups (`neo4j-admin backup` / dump), causal clustering
   for HA, page-cache sized to the graph, and monitoring of store sizes and
   query latency.

## Common pitfalls

- **Cartesian products:** comma-separated `MATCH (a), (b)` with no relationship
  multiplies rows silently — check row counts after each `WITH`.
- **Eager loading in writes:** a `MATCH` that pulls millions of rows into a
  `CREATE`/`MERGE` blows memory; batch and commit incrementally.
- **Using properties where relationships belong** (storing `friend_ids` as a
  list property) — defeats the graph; model connections as edges.
- **Unbounded traversals** (`-[*]->`) on production graphs — bound depth or use
  shortest-path algorithms.
- **MERGE without full pattern uniqueness** — `MERGE` matches the whole pattern;
  partial matches create duplicates. `MERGE` nodes on unique keys first, then
  `MERGE` relationships separately.
- **Forgetting direction semantics** in the model — inconsistent direction
  conventions make queries confusing and some traversals wrong; pick a
  convention and document it.
