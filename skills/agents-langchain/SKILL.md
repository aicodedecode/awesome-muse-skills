---
name: agents-langchain
description: Build LLM applications with chain-style orchestration frameworks — prompts, chains, tool-calling agents, memory, and retrieval pipelines. Use when structuring multi-step LLM programs, adding tools to a model, or composing RAG systems in code.
category: ai-research
---

# Agents with Chain-Style LLM Frameworks

Chain-style orchestration libraries give you composable building blocks — prompt templates, model 
wrappers, output parsers, memory, document loaders, and agent loops — so you write pipelines 
instead of raw API calls.

## Overview

The core idea is composition: small, typed units (prompt -> model -> parser) that snap together 
into chains, which in turn become tools inside an agent loop. A model provider wrapper normalizes 
API differences; a prompt template keeps prompts version-controlled and parameterizable; a parser 
turns model text into structured data; a retriever plus chain gives you retrieval-augmented 
generation. Agents emerge when a model is allowed to choose between tools in a loop until the task 
is done.

## When to use

- Turning a hand-rolled prompt script into a maintainable multi-step pipeline.
- Giving a model tools (search, calculator, database) via a standard agent loop.
- Building RAG: load documents, split them, embed, store, retrieve, generate.
- Adding conversation or entity memory to a prototype agent.
- Evaluating and streaming: you need token streaming, callbacks, or trace hooks out of the box.

## Core concepts

- **Prompt templates**: parameterized prompt strings with named variables (`{question}`, 
`{context}`) so prompts are testable artifacts, not inline string soup. Keep few-shot examples in 
the template, not in code.
- **Chains**: sequential composition — `prompt | model | parser`. The classic patterns are simple 
chains, sequential chains (output of step N feeds step N+1), and map-reduce chains (summarize 
chunks, then combine).
- **Tool-calling agents**: the model sees tool descriptions and emits structured calls; a loop 
executes the call and feeds the result back. Prefer structured tool-calling models over regex 
parsing of free text.
- **Memory**: short-term chat history, sliding windows, or summary memory that compresses old 
turns. Choose memory by cost budget — raw history is exact but expensive.
- **Retrieval**: loaders split documents into chunks, embeddings index them, and a retriever 
fetches top-k passages into the prompt. Chain the retriever with a QA chain for the standard RAG 
recipe.
- **Callbacks and tracing**: hooks for logging, streaming tokens, and timing each component. Turn 
these on early; debugging agents without traces is guesswork.

## Practical workflow

1. Start with the simplest chain: prompt template + model + output parser. Validate end-to-end 
before adding tools.
2. Define tools as small functions with clear names and docstring-style descriptions; test each 
tool standalone.
3. Wrap the chain in an agent loop with a max-iteration cap and a fallback answer so it always 
terminates.
4. Add memory: try a sliding-window chat history first; switch to summary memory only if tokens 
blow up.
5. For RAG, prototype the retriever offline — inspect which chunks actually come back for sample 
queries before wiring generation.
6. Enable tracing/callbacks from day one and keep a small eval set of representative tasks to rerun 
after every change.

```text
# Mental model of a standard agent loop
while not done and iterations < MAX:
    thought = model(prompt(history, tools))
    if thought is tool_call:
        result = execute(tool, args)
        history.append(result)
    else:
        answer = thought; done = True
```

## Common pitfalls

- **Regex-parsed actions**: letting the model emit free text like "Action: Search" and parsing with 
regex is brittle. Use models with native structured tool calling.
- **Unbounded agent loops**: no iteration cap or time budget means infinite loops and runaway 
costs. Always cap and add a graceful fallback.
- **Giant context windows as memory**: dumping full history is simple but slow and expensive; 
compress or summarize.
- **Retrieval never inspected**: trusting a vector store blindly. Look at the actual chunks 
retrieved for real queries; bad chunks explain most RAG failures.
- **Prompt drift**: prompts edited inline across the codebase. Keep them as versioned templates 
with a changelog.
- **Skipping evals**: agent changes that "feel better" but aren't measured. Keep a fixed eval set 
and score it on every iteration.
