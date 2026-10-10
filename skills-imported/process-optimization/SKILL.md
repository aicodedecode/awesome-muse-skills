---
name: process-optimization
description: Analyze and improve business processes. Trigger with "this process is slow", "how can we improve", "streamline this workflow", "too many steps", "bottleneck", or when the user describes an inefficient process they want to fix.
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original skill: https://github.com/anthropics/knowledge-work-plugins/tree/main/operations/skills/process-optimization. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->


# Process Optimization

Analyze existing processes and recommend improvements.

## Analysis Framework

### 1. Map Current State
- Document every step, decision point, and handoff
- Identify who does what and how long each step takes
- Note manual steps, approvals, and waiting times

### 2. Identify Waste
- **Waiting**: Time spent in queues or waiting for approvals
- **Rework**: Steps that fail and need to be redone
- **Handoffs**: Each handoff is a potential point of failure or delay
- **Over-processing**: Steps that add no value
- **Manual work**: Tasks that could be automated

### 3. Design Future State
- Eliminate unnecessary steps
- Automate where possible
- Reduce handoffs
- Parallelize independent steps
- Add checkpoints (not gates)

### 4. Measure Impact
- Time saved per cycle
- Error rate reduction
- Cost savings
- Employee satisfaction improvement

## Output

Produce a before/after process comparison with specific improvement recommendations, estimated impact, and an implementation plan.
