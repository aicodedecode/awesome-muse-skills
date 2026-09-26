---
name: prompt-engineer
description: Act as a dedicated prompt engineer — audit existing prompts, diagnose failure modes, rewrite for reliability, and build prompt test suites. Use when you need a systematic review of prompts already in production.
category: ai-research
---

# Prompt Engineer (Audit and Rewrite Practice)

This is the practitioner's companion to prompt engineering: not how to write a first prompt, but 
how to diagnose, rewrite, and maintain prompts that already exist in a system. Think of it as 
prompt code review.

## Overview

Most production prompts were written once, under deadline, and never revisited. A prompt engineer 
audits them like code: reads the intent, samples real inputs and outputs, classifies failure modes, 
rewrites with minimal changes, and installs a regression test set. The goal is reliability per 
token — the smallest prompt that passes the test set consistently.

## When to use

- Inherited prompts that "mostly work" but fail in ways nobody can explain.
- Preparing prompts for production: hardening against edge cases and adversarial inputs.
- Cost review: prompts that are long, repetitive, or carry dead instructions.
- After a model upgrade: re-validating that existing prompts still behave.

## Core concepts

- **Failure-mode taxonomy**: classify failures before fixing — instruction ignored, format drift, 
hallucinated content, context overflow, example leakage (model copies examples instead of 
generalizing), sycophancy.
- **Minimal rewrite**: change one thing at a time. Prompts are sensitive; wholesale rewrites lose 
the implicit knowledge in the old version.
- **Prompt diffing**: track versions and compare outputs side-by-side on the same test inputs. 
Judge rewrites by measured delta, not by reading.
- **Token economy**: every instruction costs on every call. Cut dead rules, compress context, move 
static reference material out of the prompt into retrieval.
- **Guard clauses**: explicit behavior for uncertainty — "if the input is ambiguous, ask for 
clarification rather than guessing." Absence of a guard clause is the most common rewrite fix.
- **Regression sets**: 15–30 real inputs with expected outputs. The prompt's unit tests.

## Practical workflow

1. Collect the prompt plus 10+ real input/output pairs from production. Read them before touching 
anything.
2. Classify failures with the taxonomy above; tally which failure mode dominates.
3. Form a hypothesis for each dominant failure ("format drift comes from the example being too 
long").
4. Rewrite minimally — one fix per iteration — and A/B old vs. new on the regression set.
5. Prune: remove instructions that no test case exercises. Shorter prompts are cheaper and often 
more reliable.
6. Ship the prompt with its regression set and a re-validation schedule (model changes, quarterly).

```text
Prompt audit report template:
PROMPT:      <name + version>
INTENT:      <what it's supposed to do>
FAILURES:    <mode: count, with examples>
HYPOTHESIS:  <why each failure happens>
REWRITE:     <the changed prompt>
DELTA:       <regression pass rate before -> after>
PRUNED:      <instructions removed as dead weight>
```

## Common pitfalls

- **Rewriting from scratch**: discards hard-won implicit tuning. Prefer surgical edits guided by 
failure data.
- **Fixing without a test set**: every rewrite needs before/after numbers or you're guessing.
- **Adding instructions to fix example problems**: if the model mishandles an edge case, a targeted 
example usually beats a new rule.
- **Overfitting to one failure**: optimizing for a single bad input while regressing the common 
case. The regression set protects you.
- **Ignoring cost**: a prompt that passes tests but doubles token cost per call may not be worth 
it. Track tokens per call.
- **One-and-done audits**: prompts rot as models and data change. Schedule re-validation, don't 
assume permanence.
