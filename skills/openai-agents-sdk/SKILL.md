---
name: openai-agents-sdk
description: Build production agents with a code-first agents SDK — agent definitions, handoffs between specialists, guardrails, sessions, and tracing. Use when structuring multi-agent applications in code.
category: ai-research
---

# Code-First Agents SDK

An agents SDK turns agent building into ordinary software engineering: agents are objects with 
instructions, tools, and handoffs; runs are traced; guardrails are code. This skill covers the 
SDK-style approach to production agents.

## Overview

The SDK model: define agents as code — name, instructions, tools, output type. Agents hand off to 
each other when a task needs a specialist. Guardrails validate inputs and outputs as functions. 
Sessions persist conversation state. Tracing records every step for debugging. Because it's code, 
you get version control, tests, and composition for free — the agent system is a program, not a 
prompt.

## When to use

- Building multi-agent applications where agents hand work to specialists.
- Production systems needing guardrails, tracing, and session persistence as code.
- Teams that want agents reviewed, tested, and deployed like software.
- Migrating from notebook prototypes to maintainable agent code.

## Core concepts

- **Agent definitions**: name, instructions, tools, model choice, and output schema in one place. 
Agents become reviewable, diffable artifacts.
- **Handoffs**: an agent delegating to a specialist agent mid-task — with context transferred. 
The mechanism for "triage agent → billing specialist" flows.
- **Guardrails**: functions that validate input before the agent runs and output before it's 
returned. Policy as code, not as prompt wishes.
- **Sessions**: persistent conversation state across runs — the agent remembers the thread 
without you managing message lists.
- **Tracing**: structured spans for every model call, tool execution, and handoff. The 
observability layer for debugging agent behavior.
- **Runner**: the execution engine — runs the agent loop, enforces max turns, streams events. 
Your integration point for apps.

## Practical workflow

1. Define agents in code: one file per agent or domain, with instructions kept short and tools 
typed.
2. Wire handoffs: each agent knows which specialists exist and when to delegate; test handoff 
chains explicitly.
3. Write guardrails as pure functions with clear pass/fail semantics; unit-test them.
4. Set runner limits: max turns, timeouts, and what happens on guardrail trip (block, redact, 
escalate).
5. Enable tracing from the first run; build the habit of debugging from traces.
6. Test like software: unit-test tools and guardrails, integration-test agent flows with recorded 
traces, eval-test behavior on real tasks.

```text
Project layout:
agents/
  triage.py       # router agent + handoff rules
  billing.py      # specialist: tools + instructions
  support.py      # specialist
guardrails/
  pii_check.py    # input/output validators
tests/
  test_tools.py   # unit tests
  test_flows.py   # scripted agent runs
```

## Common pitfalls

- **Instructions as code comments**: stuffing all logic into instruction strings instead of using 
tools, handoffs, and guardrails. Structure in code, nuance in prompts.
- **Handoff ping-pong**: agents delegating back and forth. Define handoff direction; cap handoff 
depth.
- **Guardrails as afterthoughts**: adding validation after incidents. Write guardrails with the 
first version.
- **Untested handoffs**: the delegation paths nobody exercised. Script-test every handoff edge.
- **Trace neglect**: shipping without looking at traces. Traces are where agent bugs live — read 
them.
- **No max turns**: the runner looping indefinitely. Always bound execution.
