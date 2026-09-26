---
name: agents-openai
description: Build agents on OpenAI's platform patterns — assistants-style threads, function calling, structured outputs, and multi-step tool workflows. Use when working with OpenAI models as the agent engine.
category: ai-research
---

# Agents on OpenAI Platform Patterns

OpenAI's agent-building surface centers on a few primitives: chat models with native function 
calling, structured outputs, persistent threads for conversation state, and file/code-interpreter 
tools. This skill covers using them as an agent substrate.

## Overview

The core loop: the model reasons, emits function calls with structured arguments, your code 
executes them, results go back into the conversation, repeat. Structured outputs (JSON schema mode) 
make the model's responses machine-readable. Threads persist conversation state server-side so you 
don't manage history yourself. Built-in tools — code execution, file search — cover common 
needs without custom tooling. Your architecture decisions sit on top: when to call functions vs. 
answer, how to manage the loop, where humans intervene.

## When to use

- Building an agent or assistant powered by OpenAI models.
- Needing reliable function calling with validated arguments.
- Prototyping quickly with managed threads and built-in tools before custom infrastructure.
- Migrating from raw chat completions to a structured agent loop.

## Core concepts

- **Function calling**: the model emits structured calls to your functions; you execute and return 
results. Define functions with clear names, descriptions, and JSON schemas.
- **Structured outputs**: schema-constrained generation — the model must return valid JSON 
matching your schema. Eliminates parsing hacks for data extraction and tool args.
- **Threads**: server-side conversation state — messages, tool outputs, file attachments persist 
across calls. Simplifies long sessions; know the retention and cost implications.
- **Built-in tools**: code interpreter (run code, analyze files), file search (retrieval over your 
documents). Evaluate them before building custom equivalents.
- **The run loop**: create a run, poll for status, handle required actions (tool calls), submit 
outputs, repeat. Manage timeouts and step budgets yourself.
- **Instructions hierarchy**: system-level instructions steer behavior across the thread; 
per-message instructions handle the immediate turn. Keep the persistent instructions lean.

## Practical workflow

1. Define functions with precise schemas; test them standalone before the model ever calls them.
2. Write thread-level instructions covering role, scope, and guardrails — short and durable.
3. Implement the run loop with a step cap, timeout, and handling for every terminal state 
(completed, failed, expired, cancelled).
4. Use structured outputs wherever your code consumes the result — never parse free text you 
could have schematized.
5. Evaluate built-in tools on your data before building custom retrieval or execution.
6. Log every run: inputs, tool calls, outputs, tokens. Debug from the trace, not from memory.

```text
Run loop checklist:
[ ] Functions defined + tested standalone
[ ] Step budget and timeout set
[ ] All terminal states handled (completed/failed/expired/cancelled)
[ ] Structured output schemas for machine-consumed results
[ ] Run logging: messages, tool calls, tokens
[ ] Human gate before irreversible tool actions
```

## Common pitfalls

- **Unbounded runs**: polling forever on a stuck run. Cap steps and time; handle expiry explicitly.
- **Bloated instructions**: thread instructions that grow into mega-prompts. Keep them minimal; put 
task context in messages.
- **Trusting tool args blindly**: the model can emit plausible-but-wrong arguments. Validate before 
executing, especially writes.
- **No state hygiene**: threads growing unboundedly. Summarize or truncate old turns; know 
retention limits.
- **Built-in tool assumptions**: file search or code execution behaving differently than expected 
on your data. Test on your corpus first.
- **Ignoring cost**: threads + tool calls + long contexts add up. Track per-thread spend and set 
budgets.
