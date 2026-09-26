---
name: langgraph
description: Build stateful agent workflows as graphs — nodes, edges, conditional routing, cycles, and persistent state. Use when agent logic needs branching, loops, retries, or human-in-the-loop checkpoints.
category: ai-research
---

# Stateful Agent Workflows as Graphs

Linear chains break when work needs branching, retries, or human approval. The graph pattern models 
agent workflows as nodes (steps) and edges (transitions), with shared state flowing through — 
giving you loops, conditional routing, and checkpoints as first-class constructs.

## Overview

Each node is a unit of work: call the model, run a tool, transform data. Edges decide what happens 
next — fixed sequence, conditional branch on the state, or a loop back for retry. A shared state 
object (typed, versioned) carries context between nodes, and persistence lets the graph pause and 
resume — the foundation of human-in-the-loop. This turns "agent spaghetti" into something you can 
draw, test, and reason about.

## When to use

- Workflows with branching: different paths for different inputs or intermediate results.
- Retry loops: attempt → check → retry with adjustments, up to a limit.
- Human-in-the-loop: pause for approval, then resume exactly where you left off.
- Multi-step pipelines where steps need shared, structured state rather than prompt-passing.

## Core concepts

- **Nodes**: discrete steps with typed inputs/outputs — model calls, tool executions, data 
transforms. Keep nodes small and testable in isolation.
- **Edges**: transitions between nodes — direct, conditional (route on state), or cyclic (loop 
back). The graph's control flow lives here, not in prompts.
- **State**: a shared, schema-defined object updated by nodes. Typed state prevents the "what's in 
the context?" guessing game.
- **Persistence/checkpointing**: saving state after each node so execution can pause, resume, or 
rewind. Enables human approval gates and crash recovery.
- **Conditional routing**: edges that inspect state and choose the next node — the mechanism for 
branching, escalation, and early exit.
- **Subgraphs**: reusable graph fragments (a research subgraph, a review subgraph) composed into 
larger workflows.

## Practical workflow

1. Sketch the workflow on paper first: nodes, decision points, loops, and where humans intervene.
2. Define the state schema: what every node needs to read and write. Keep it minimal and typed.
3. Implement nodes as pure-ish functions of state; test each node standalone with fixture states.
4. Wire edges: start with the happy path, then add conditional branches and retry loops with caps.
5. Add persistence and at least one human checkpoint for any consequential branch.
6. Test the graph end-to-end with trace logging; verify pause/resume and retry behavior explicitly.

```text
Graph sketch template:
[NODES]    plan → research → draft → review → (approve?) → publish
[STATE]    {goal, findings[], draft, review_notes, approved: bool}
[BRANCHES] review: approved → publish | rejected → draft (max 3)
[PAUSE]    before publish — human approval required
[RETRY]    research: empty findings → retry with broader query (max 2)
```

## Common pitfalls

- **State bloat**: stuffing everything into shared state. Nodes should read what they need; keep 
state lean and typed.
- **Uncapped cycles**: retry loops without limits. Every cycle needs a max-iteration guard and an 
exit branch.
- **Logic in prompts**: branching decisions hidden inside model prose instead of explicit 
conditional edges. Make control flow visible.
- **No persistence**: long graphs without checkpointing can't pause or recover. Persist after each 
node.
- **Untestable nodes**: nodes that only work inside the full graph. Design nodes to run standalone 
with fixture state.
- **Graph for everything**: simple linear work doesn't need a graph. Use the lightest structure 
that fits — upgrade when branching appears.
