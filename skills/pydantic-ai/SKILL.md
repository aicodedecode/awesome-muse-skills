---
name: pydantic-ai
description: Build type-safe AI agents with typed agent frameworks — structured outputs via data models, dependency injection, tool validation, and testable agent code. Use when agent reliability matters and you want types enforcing contracts.
category: ai-research
---

# Type-Safe Agents with Typed Frameworks

Dynamic agent code fails at runtime in ways types could have caught: malformed tool arguments, 
wrong output shapes, missing dependencies. Typed agent frameworks bring data models, dependency 
injection, and structured validation to agent building — so contracts are checked by the type 
system, not by hope.

## Overview

The pattern: define your agent's world as types. Tool inputs and outputs are data models with 
validation. The agent's dependencies (API clients, database handles) are injected through a typed 
context rather than globals. Model outputs are parsed into models, with retries on validation 
failure. The result is agent code you can test like normal code — unit-test tools, type-check the 
wiring, and mock dependencies — instead of integration-testing everything through the model.

## When to use

- Agents with many tools where argument mismatches are a real risk.
- Production agents where runtime type errors are unacceptable.
- Codebases where agents must integrate with existing typed services.
- Teams that want agents testable with standard unit-testing practices.

## Core concepts

- **Data models as contracts**: tool parameters and results defined as validated models. The 
framework validates before the tool runs and after it returns.
- **Structured outputs**: the model returns data matching a schema; validation failures trigger 
automatic retry with the error explained. No regex parsing.
- **Dependency injection**: shared resources (clients, config, state) passed through a typed 
context object. Tools declare what they need; the framework provides it.
- **Tool registration**: tools as decorated functions with type hints — the schema is derived 
from the signature, keeping docs and types in sync automatically.
- **Testability**: tools are plain functions — unit-test them without the model. Agent logic is 
testable with mocked model responses.
- **Streaming + validation**: stream partial results for UX while still validating the final 
structured output.

## Practical workflow

1. Model the domain: define data models for every tool's inputs/outputs and the agent's final 
result type.
2. Write tools as typed functions; let the framework derive schemas from signatures.
3. Define the dependency context: what resources tools need, injected once, typed throughout.
4. Unit-test every tool standalone; test the agent flow with scripted model responses.
5. Enable validation-retry on structured outputs; log validation failures — they reveal 
prompt/schema mismatches.
6. Add integration tests hitting the real model on your eval set; types don't replace behavioral 
testing.

```text
Anatomy of a typed agent:
MODELS:   OrderLookupArgs {order_id: str}, OrderStatus {status, eta}
CTX:      AppContext {db: Database, config: Settings}
TOOLS:    get_order_status(ctx, args: OrderLookupArgs) -> OrderStatus
AGENT:    system prompt + tools + result_type=TaskResult
TESTS:    unit (tools) + scripted (agent flow) + eval (real model)
```

## Common pitfalls

- **Types without validation**: annotations that are never checked at runtime. Use validated models 
at every boundary.
- **Over-typed rigidity**: modeling every nuance makes tools brittle. Type the contract; keep 
internals flexible.
- **Skipping unit tests**: "the types will catch it." Types catch shape errors, not logic errors. 
Test behavior too.
- **Leaky context**: stuffing everything into the dependency context. Inject only what tools 
actually need.
- **Validation-retry loops**: the model repeatedly failing validation burns tokens. After 2–3 
retries, surface the error instead.
- **No eval set**: type safety is not behavioral correctness. You still need task-level evals with 
the real model.
