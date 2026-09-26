---
name: ai-engineer
description: Ship AI features to production — model selection, evals, latency/cost optimization, guardrails, monitoring, and iteration loops. Use when turning an LLM prototype into a reliable product feature.
category: ai-research
---

# AI Engineer

The AI engineer ships: taking a promising model or prototype and making it fast, cheap, reliable, 
and safe enough for real users. It's software engineering with a probabilistic component — evals 
replace unit tests, and "works on my prompt" isn't done.

## Overview

Production AI work is a loop: define the task and success metric, build an eval set, prototype with 
the strongest model, then optimize down the cost/latency curve while holding quality. Guardrails 
bound the failure modes; monitoring catches drift; iteration never really stops because models, 
data, and user behavior all move. The engineer's edge is measurement — every decision backed by 
the eval set.

## When to use

- Turning a prototype prompt or agent into a user-facing feature.
- Choosing between models: quality vs. cost vs. latency trade-offs.
- Adding reliability: evals, fallbacks, guardrails, and monitoring.
- Debugging production AI issues: quality drops, cost spikes, weird outputs.

## Core concepts

- **Task definition**: the feature framed as inputs, outputs, and a measurable success criterion. 
"Helpful summary" becomes "summary covering all 5 key points, under 150 words, faithful to source."
- **Eval-driven development**: a fixed set of representative cases with graders, run on every 
change. The equivalent of a test suite for probabilistic systems.
- **Model routing**: strong model for hard cases, cheap model for easy ones; classifiers or 
heuristics route. Quality where it matters, cost where it doesn't.
- **Latency engineering**: streaming, prompt compression, smaller models, caching, parallel calls. 
Users feel every 500ms.
- **Guardrails**: input validation, output filtering, topic boundaries, PII handling, and 
escalation paths. Designed per failure mode, not bolted on.
- **Observability**: log prompts (redacted), outputs, latencies, costs, and user feedback per 
request. Drift shows up in the metrics before users complain.

## Practical workflow

1. Define the task contract and build the eval set (30+ real cases) before optimizing anything.
2. Prototype with the best available model; establish the quality ceiling and baseline cost/latency.
3. Optimize down the curve: try smaller models, compressed prompts, caching — keep whatever holds 
eval scores.
4. Add guardrails for the top failure modes found in evals and red-teaming.
5. Ship behind a feature flag with full logging; watch quality, cost, and latency dashboards.
6. Iterate: user feedback → new eval cases → prompt/model changes → re-eval → rollout.

```text
Production checklist:
[ ] Eval set with graders, run in CI
[ ] Cost per request budgeted + alerted
[ ] p95 latency target met (streaming where needed)
[ ] Guardrails for top failure modes
[ ] Redacted logging + dashboards
[ ] Rollback plan for model/prompt changes
[ ] Human escalation path defined
```

## Common pitfalls

- **Shipping the prototype prompt**: the demo prompt is rarely the production prompt. Harden with 
evals first.
- **Single-model thinking**: one model for everything. Route by difficulty; the savings are large.
- **No cost tracking**: per-request costs look tiny until scale. Budget and alert from day one.
- **Eval-free iteration**: tweaking prompts by feel in production. Every change goes through the 
eval set.
- **Ignoring the tail**: average quality is fine; the worst 5% of outputs cause the incidents. 
Study failures, not averages.
- **Model updates as surprises**: providers update models; behavior shifts. Pin versions, re-run 
evals on change.
