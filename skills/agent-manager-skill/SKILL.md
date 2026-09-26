---
name: agent-manager-skill
description: Manage fleets of local AI agents — spawn, supervise, route tasks, monitor progress, and shut down workers cleanly. Use when coordinating multiple agents on parallel workstreams.
category: ai-research
---

# Agent Manager

When one agent isn't enough, you need a manager: something that spawns workers, assigns scoped 
tasks, watches progress, collects results, and cleans up. This skill covers the management layer 
above individual agents.

## Overview

Managing agents is managing concurrency with unreliable workers. Each worker gets a narrow task 
brief, a bounded scope, and a defined output format. The manager's loop is: dispatch -> monitor -> 
collect -> integrate -> terminate. Good management is mostly about briefs and contracts — most 
multi-agent failures are communication failures, not capability failures.

## When to use

- Parallelizable research: several agents investigate different sources or angles simultaneously.
- Large codebases: workers explore or refactor separate modules in parallel.
- Batch processing: the same analysis applied to many items independently.
- Long-running pipelines where stages can overlap and need supervision.

## Core concepts

- **Task briefs**: each worker gets goal, scope boundaries, output format, and a stop condition. 
Vague briefs produce vague results — the manager's main lever.
- **Worker isolation**: workers operate in separate sessions/contexts so their context windows 
don't contaminate each other. Share only what's needed.
- **Supervision loop**: the manager polls status, reads partial output, and intervenes when a 
worker stalls, loops, or drifts off-brief.
- **Result contracts**: define the exact shape of a worker's deliverable (file path, format, 
required fields) so integration is mechanical.
- **Lifecycle management**: spawn, health-check, graceful shutdown, and cleanup of worker sessions. 
Orphaned workers waste resources and confuse state.
- **Failure isolation**: one worker's failure must not corrupt others. Timeouts, retries with new 
briefs, and fallback plans per worker.

## Practical workflow

1. Decompose the work into independent units with clear boundaries and no shared mutable state.
2. Write a brief template: goal, scope, output contract, stop conditions, timeout.
3. Spawn workers one at a time; verify the first worker's output quality before spawning the rest.
4. Monitor with heartbeats: periodic status checks; kill and respawn workers that stall past their 
timeout.
5. Collect results against the contract; reject and re-brief incomplete deliverables rather than 
patching them yourself.
6. Integrate results, then shut down all workers and archive their logs for audit.

```text
Worker brief template:
GOAL:    <single concrete deliverable>
SCOPE:   <what it may read/touch; explicit exclusions>
OUTPUT:  <file path + format + required sections>
STOP:    <done condition; max runtime; escalation trigger>
```

## Common pitfalls

- **Overlapping scopes**: two workers editing the same files or researching the same question. 
Partition cleanly.
- **No output contract**: workers return prose essays instead of usable artifacts. Define the 
deliverable shape up front.
- **Fire and forget**: spawning workers without monitoring. Stalled workers are discovered too late.
- **Shared mutable state**: workers writing to the same files or databases. Give each its own 
workspace; merge at the manager level.
- **No timeout**: a stuck worker runs forever. Every worker gets a max runtime and a stall policy.
- **Skipping the pilot**: spawning ten workers before validating the brief on one. Always pilot 
first.
