---
name: agent-tool-builder
description: Design tools for AI agents — clean function interfaces, typed schemas, informative errors, idempotency, and tool documentation. Use when giving an agent new capabilities or fixing flaky tool use.
category: ai-research
---

# Agent Tool Builder

Tools are the agent's hands and senses. A well-designed tool is small, predictable, and 
self-documenting; a bad one is the source of most agent unreliability. Build tools like public APIs 
— because to the agent, they are.

## Overview

The model sees only a tool's name, description, and schema. Everything else — side effects, 
latency, failure modes — is invisible until it bites. Good tool design therefore means: narrow 
scope, explicit schemas, errors that explain how to recover, and descriptions written for a reader 
that takes everything literally. Test each tool as a standalone function before the agent ever 
calls it.

## When to use

- Adding a new capability to an agent (search, database, file ops, API calls).
- The agent misuses an existing tool: wrong arguments, wrong tool chosen, ignoring errors.
- Consolidating several overlapping tools into one clean interface.
- Writing tools that wrap internal APIs for agent consumption.

## Core concepts

- **Single responsibility**: one tool, one job. A `search_orders` tool beats a `do_database_stuff` 
tool every time.
- **Schema as documentation**: typed parameters with descriptions, enums for fixed choices, 
sensible defaults. The schema is the primary instruction the agent reads.
- **Descriptive naming**: `get_customer_order_status`, not `query2`. Names should make the right 
tool choice obvious.
- **Informative errors**: errors should say what went wrong and what to try next ("order not found; 
try listing orders for this customer with list_orders").
- **Idempotency**: repeated identical calls should be safe. Agents retry; design for it — use 
idempotency keys for writes.
- **Least privilege**: each tool exposes only what the agent needs. A read-only variant for 
exploration, a write variant with stricter gating.

## Practical workflow

1. Write the tool's contract first: name, description, parameters, return shape, error cases — 
before any code.
2. Implement it as a plain function with no agent-specific logic; test it standalone with 
representative inputs.
3. Write the description for a literal-minded reader: what it does, when to use it, what the 
arguments mean, what errors mean.
4. Add validation at the boundary: reject bad inputs with helpful messages rather than failing deep 
inside.
5. Load-test the failure paths: timeouts, empty results, malformed data. The agent will hit all of 
them.
6. Version the tool contract; log every call with arguments for debugging agent behavior.

```text
Tool contract template:
NAME:   get_order_status
DOES:   Returns current status + tracking for one order.
ARGS:   order_id (string, required) — the ID from list_orders
RETURNS:{status, tracking_url, updated_at}
ERRORS: NOT_FOUND → use list_orders to find valid IDs
        AUTH     → credentials missing; escalate to user
```

## Common pitfalls

- **Vague descriptions**: "queries the database." The agent can't choose tools it doesn't 
understand. Describe inputs, outputs, and when to use it.
- **Mega-tools**: one tool with a mode parameter doing five things. Split them; the agent picks 
tools, not modes.
- **Silent failures**: returning empty results or generic errors. The agent will hallucinate around 
the gap — make errors loud and specific.
- **Non-idempotent writes**: the agent retries a failed payment and charges twice. Design writes to 
be safely repeatable.
- **Leaking internals**: stack traces and internal IDs in tool output. Sanitize; give the agent 
actionable information.
- **No logging**: when the agent misbehaves you need the call history. Log every invocation with 
arguments and results.
