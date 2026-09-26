---
name: llm-benchmarks
description: Use LLM benchmarks wisely — what major benchmarks measure, their limits, contamination risks, and how to interpret scores. Use when evaluating models or reading benchmark claims critically.
category: ai-research
---

# LLM Benchmarks — A Critical Guide

Benchmarks are the industry's shared scoreboard — and widely misread. This skill covers what the 
major benchmark families actually measure, why scores mislead, and how to use benchmarks without 
fooling yourself.

## Overview

Benchmark families: knowledge (multi-choice QA across subjects), reasoning (math, logic, code — 
often with verifiable answers), instruction-following (did it do what was asked, how asked), 
long-context (retrieval and reasoning over long inputs), multilingual (quality beyond English), and 
agentic (multi-step tool use). Each measures something real and something narrow. The critical 
skills: knowing which family matches your use case, discounting for contamination (benchmark 
questions in training data), and never mistaking a leaderboard for a buying decision.

## When to use

- Choosing between models for a task: which benchmarks are actually relevant.
- Reading vendor benchmark claims critically.
- Designing your own evaluations informed by benchmark methodology.
- Understanding what a new benchmark release does and doesn't prove.

## Core concepts

- **Benchmark families**: knowledge QA, reasoning/math/code, instruction following, long-context, 
multilingual, agentic/tool-use, safety/refusal. Map your task to families; ignore the rest.
- **What's measured vs. what's claimed**: a multi-choice science score measures test-taking on 
science questions, not scientific judgment. Interpret literally.
- **Contamination**: benchmark items leaking into training data inflates scores. Suspect unusually 
high scores on popular benchmarks; prefer fresh or private evals for decisions.
- **Saturation**: benchmarks get maxed out and stop discriminating. A 95% vs 97% gap on a saturated 
benchmark means little; look at harder or newer tests.
- **Variance**: small benchmarks have wide confidence intervals; single-run scores wobble. Ask for 
error bars or multiple runs before concluding.
- **Your evals beat public ones**: public benchmarks measure general capability; your 50 
task-specific cases measure what you actually need. Always build your own.

## Practical workflow

1. Define your task; identify the 1–2 benchmark families most related — treat the rest as 
background.
2. Read benchmark claims critically: which version, what prompting, how many shots, any 
contamination notes?
3. Shortlist models on relevant benchmarks, then evaluate finalists on your own task-specific set.
4. For high-stakes decisions, prefer private/fresh evals over public leaderboard positions.
5. Track benchmarks over time for the models you use — but re-validate on your tasks when models 
update.
6. Document which benchmarks informed each model choice, so the decision is auditable.

```text
Benchmark reading checklist:
[ ] Which family? Relevant to my task?
[ ] Version, shots, prompting disclosed?
[ ] Contamination addressed?
[ ] Saturated? (near-ceiling scores = weak signal)
[ ] Variance reported?
[ ] Validated against MY eval set before deciding?
```

## Common pitfalls

- **Leaderboard shopping**: picking the #1 model without checking relevance to your task. Rank ≠ 
fit.
- **Ignoring contamination**: treating inflated scores as real capability. Discount popular 
benchmarks.
- **Single-number decisions**: one benchmark score choosing a model. Triangulate across families + 
your evals.
- **Saturated benchmark worship**: celebrating 0.5% gains at the ceiling. Noise, not signal.
- **No task-specific eval**: shipping on public scores alone. Your data, your distribution, your 
eval.
- **Benchmark as safety proof**: capability benchmarks don't measure safety. Separate safety evals 
are their own discipline.
