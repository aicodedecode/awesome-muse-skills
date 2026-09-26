---
name: semantic-kernel
description: Build enterprise AI apps with Semantic Kernel — kernel, plugins, planners, and memory abstractions across languages.
category: ai-research
---

## Overview

Semantic Kernel (SK) is Microsoft's SDK for integrating LLMs into applications,
built around three abstractions: the Kernel (the central orchestrator holding
services, plugins, and memory), Plugins (collections of functions — both semantic
functions defined by prompts and native functions written in code), and Planners
(which decompose goals into function-call sequences). It's designed for enterprise
software teams: strongly typed, multi-language (C#, Python, Java), with connectors
for Azure OpenAI, memory stores, and observability hooks.

The mental model: your application's capabilities are plugins with well-described
functions; the kernel lets the model invoke them; planners chain them toward
goals. SK shines when you need AI inside a larger .NET or Python system with
dependency injection, logging, and testability — less when you want a quick agent
prototype, where lighter frameworks move faster.

SK treats AI features as software engineering: versioned, tested, observable. If
your organization already builds software that way, SK fits the culture.

## When to use

- Enterprise applications (especially .NET) that need LLM capabilities with proper
  engineering practices: DI, telemetry, unit testing.
- Building a function/plugin library your organization reuses across AI features.
- Scenarios needing both prompt-based functions and native code functions under
  one invocation model.
- Stepwise or action planning over a known function set (planners choosing among
  your plugins).
- Memory-augmented apps using SK's memory connectors (volatile, or vector
  stores).
- Teams that need multi-language support (C#, Python, Java) under one conceptual
  model.

## Core concepts

- **Kernel**: the runtime — register AI services (chat completion), plugins, and
  memory once; everything executes through it. One kernel per application scope is
  typical.
- **Plugins and kernel functions**: a plugin groups related functions. Semantic
  functions are prompt templates with declared inputs/outputs; native functions
  are code (C#/Python methods) with decorators describing them to the model. The
  model's function-calling decides which to invoke.
- **Function metadata**: name, description, parameter descriptions. This is the
  model's UI for your code — write descriptions like API docs, with examples of
  when to call each function.
- **Planners**: given a goal, produce a plan of function calls. Stepwise planner
  interleaves planning and execution (ReAct-like); action planner emits the full
  sequence upfront. Use stepwise when steps depend on intermediate results.
- **Memory**: semantic memory stores embeddings + text in a vector store,
  recallable by relevance. Good for user facts and domain knowledge that shouldn't
  live in prompts permanently.
- **Filters/pipeline**: interception points around function invocation (logging,
  validation, retry). Use for cross-cutting concerns instead of scattering them
  through functions.
- **Prompt templates**: semantic functions support templating with variables and
  basic control flow. Keep templates focused — a semantic function should do one
  thing well.
- **Connectors**: integrations for AI services, memory stores, and (in some
  versions) external systems. Prefer maintained first-party connectors over custom
  HTTP wrappers.

## Practical workflow

1. **Inventory capabilities as functions.** List what the app must do; each
   becomes a kernel function with clear inputs/outputs. Separate "model should
   decide" (semantic) from "code should do" (native).
2. **Set up the kernel.** Register the chat service, add plugins, configure memory
   store if needed. Keep kernel construction in one place (composition root).
3. **Write function descriptions for the model.** Every parameter gets a
   description and example. Test function selection: give the model ambiguous
   requests and check it picks the right functions with valid arguments.
4. **Choose invocation mode.** Direct function calling for simple flows; stepwise
   planner for multi-step goals. Start with explicit orchestration in code and
   graduate to planners only when the branching is genuinely dynamic.
5. **Add memory deliberately.** Store what's worth remembering (user preferences,
   domain facts); set recall limits so retrieved memories don't flood the context.
6. **Wire filters for cross-cutting concerns.** Logging, telemetry, retry
   policies, input validation — in the pipeline, not sprinkled through functions.
7. **Test like software.** Unit-test native functions normally; integration-test
   the kernel with recorded model responses; add evals for the end-to-end flows.
   SK's structure makes this natural — use it.

Checklist for an SK application:
- Function metadata reviewed for model clarity (descriptions + examples).
- Planner choice justified (explicit orchestration vs. stepwise vs. action).
- Memory recall bounded and relevant.
- Filters handle logging/retry/validation centrally.
- Telemetry on function invocations (which functions, how often, failure rates).
- Native functions unit-tested; E2E flows evaluated.

## Common pitfalls

- **Plugin sprawl.** Dozens of overlapping functions confuse the model's
  selection. Consolidate; prefer fewer, well-described functions.
- **Planner for deterministic flows.** If the steps are always A→B→C, write the
  code — a planner adds latency, cost, and a chance of creative reordering.
- **Underspecified function descriptions.** The model can't call what it doesn't
  understand. "Processes data" is not a description.
- **Memory as a junk drawer.** Storing everything retrievable means recalling
  noise. Curate what gets stored; memory quality is a data problem.
- **Ignoring the filters.** Reimplementing logging/retry per function instead of
  using the pipeline. Cross-cutting concerns belong in filters.
- **Testing only the happy path.** Function-calling fails in specific ways: wrong
  function, right function wrong args, hallucinated functions. Test each failure
  mode.
- **Semantic functions doing too much.** A prompt template that tries to do five
  things produces mush. One function, one job — compose them instead.
- **Version drift.** Updating prompts inside semantic functions without versioning.
  Treat prompt changes like code changes: review, test, version.
