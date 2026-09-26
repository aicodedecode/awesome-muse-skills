---
name: agent-workflows
description: Build reusable agent workflow patterns — subagents with scoped briefs, event hooks, slash commands, and session management. Use when turning one-off agent tasks into repeatable, composable workflows.
category: ai-research
---

# Reusable Agent Workflow Patterns

One-off agent sessions don't scale; workflows do. The reusable patterns are: subagents (scoped 
workers with briefs), hooks (event-triggered automations), slash commands (parameterized task 
templates), and session management (state that survives across runs).

## Overview

Think of workflows as the operating system layer above individual agent sessions. Subagents let a 
coordinator delegate bounded work without context contamination. Hooks automate responses to events 
— a file changes, a check runs. Slash commands turn repeated task shapes into invokable templates 
with arguments. Session management — persistent notes, handoffs, resumable state — makes long 
work survive interruptions. Together they turn "ask the agent" into a reliable production practice.

## When to use

- The same agent task recurs: research briefs, code reviews, weekly reports.
- Coordinating multiple agents on one objective without tangling their contexts.
- Automating routine responses: lint-on-save, test-on-commit, summarize-on-arrival.
- Long projects that span many sessions and must resume cleanly.

## Core concepts

- **Subagents**: child agents spawned with a scoped brief — goal, boundaries, output contract. 
Isolation keeps their context clean; the brief keeps their work useful.
- **Hooks**: event → action mappings. File saved → run formatter; task completed → update the 
log. Keep hooks fast, idempotent, and observable.
- **Slash commands**: named, parameterized task templates (`/review <pr>`, `/brief <topic>`). They 
encode the task shape — steps, output format, quality bar — so every invocation is consistent.
- **Session management**: durable state across sessions — decision logs, progress trackers, 
handoff notes. The workflow remembers so the agent doesn't have to.
- **Composition**: commands that spawn subagents, hooks that trigger commands, sessions that chain. 
Design the pieces to combine.
- **Idempotency**: workflow steps safe to rerun. Hooks fire twice, sessions resume mid-way — 
design for it.

## Practical workflow

1. Identify the recurring task; write down its steps, inputs, outputs, and quality bar as observed 
in manual runs.
2. Encode it as a slash command: parameterized template with the steps and output contract baked in.
3. Where the task has parallelizable parts, have the command spawn subagents with scoped briefs 
instead of doing everything inline.
4. Add hooks for the trigger events: what should happen automatically, with what guardrails.
5. Set up session state: a progress file or log the workflow updates, so interruptions resume 
instead of restart.
6. Run it three times manually via the command; fix the rough edges; then trust the automation.

```text
Workflow anatomy:
COMMAND:  /weekly-brief <topic> — steps, output format, sources to check
SUBAGENTS: researcher (sources) + analyst (synthesis) — scoped briefs
HOOK:      on Friday 09:00 → run /weekly-brief automatically
SESSION:   briefs/ log — what was covered, open threads
```

## Common pitfalls

- **Automating before stabilizing**: encoding a flaky manual process into a workflow. Stabilize by 
hand first, then automate.
- **Vague subagent briefs**: "look into this." Subagents need the same rigor as any delegation — 
goal, scope, output contract.
- **Hook sprawl**: dozens of overlapping triggers firing unpredictably. Keep hooks few, logged, and 
individually disableable.
- **Non-idempotent steps**: reruns that duplicate work or corrupt state. Make every step safe to 
repeat.
- **No session state**: long workflows that restart from zero on interruption. Persist progress; 
resume, don't redo.
- **Over-composition**: commands calling commands calling subagents until no one can trace what 
happened. Keep the call depth shallow and logged.
