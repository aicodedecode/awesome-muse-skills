---
name: research-engineer
description: Do applied AI research engineering — reproduce papers, run ablations, manage experiments, and turn prototypes into reliable systems. Use when bridging the gap between a research idea and working code.
category: ai-research
---

# Research Engineer

The research engineer lives between the paper and the product: reproducing results, running clean 
experiments, ablating ideas, and hardening prototypes. The craft is rigor at speed — scientific 
discipline without academic timescales.

## Overview

A research idea is a hypothesis until it's reproduced and ablated. The workflow: understand the 
paper deeply enough to reimplement from scratch, reproduce the key result, then vary one thing at a 
time to learn what actually matters. Experiment management — configs, seeds, logs, versioning — 
is what separates real findings from anecdotes. The output is knowledge (what works, what doesn't, 
why) plus code others can build on.

## When to use

- A paper claims a result you want to use or build on — reproduce it first.
- Comparing approaches: which component actually drives the gain?
- Turning a promising prototype into something reliable enough to ship.
- Debugging why a published method doesn't work in your setting.

## Core concepts

- **Reproduction**: reimplementing from the paper (not just running released code) to truly 
understand it. If you can't reproduce it, you don't understand it.
- **Ablations**: removing or varying one component at a time to measure its contribution. The 
single most informative experiment type.
- **Experiment tracking**: every run logged with config, code version, seed, data version, and 
metrics. Untracked experiments are rumors.
- **Baselines**: the simplest alternative that could work. New ideas must beat strong baselines, 
not strawmen.
- **Statistical honesty**: multiple seeds, error bars, and pre-registered comparisons. One lucky 
seed is not a result.
- **Negative results**: documenting what didn't work is as valuable as what did. Keep a lab 
notebook of failures.

## Practical workflow

1. Read the paper for the mechanism, not the marketing: what is the actual claim, and what would 
falsify it?
2. Reimplement the core idea minimally; reproduce the headline result on the paper's setup before 
adapting it.
3. Establish baselines on your data/task — including the "dumb" approaches.
4. Ablate: vary one factor at a time (architecture, data, hyperparameters, prompts) and record the 
delta.
5. Stress-test the winner: distribution shift, edge cases, ablations of your own additions.
6. Write it up: method, setup, results with uncertainty, what failed, and what you'd try next.

```text
Experiment log template:
HYPOTHESIS: <what you expect and why>
SETUP:      <config, code commit, seed, data version>
BASELINE:   <score to beat>
RESULT:     <score ± spread over seeds>
DELTA:      <vs baseline and vs ablations>
VERDICT:    <keep / kill / investigate>
```

## Common pitfalls

- **Running released code only**: you learn to operate it, not understand it. Reimplement the core.
- **Weak baselines**: beating a poorly tuned baseline proves nothing. Tune baselines as hard as 
your idea.
- **Single-seed results**: reporting one lucky run. Use multiple seeds and report spread.
- **Ablation theater**: ablating trivial variants while the real question goes untested. Ablate the 
claim, not the decoration.
- **Untracked experiments**: "I think we tried that." Log everything; memory lies.
- **HARKing**: hypothesizing after results are known. Write the hypothesis before running, and 
honor negative results.
