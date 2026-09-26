---
name: agent-evaluation
description: Evaluate AI agents rigorously — task benchmarks, success criteria, failure taxonomy, cost/latency tracking, and regression testing. Use when you need to know whether an agent actually works, not whether it demos well.
category: ai-research
---

# Agent Evaluation

Demos lie; evals tell the truth. Agent evaluation is the practice of measuring what an agent does 
on representative tasks with clear success criteria — so improvements are real and regressions 
get caught.

## Overview

An eval is a task plus a grader. Tasks should mirror real usage: same tools, same ambiguity, same 
edge cases. Graders range from exact-match checks to model-based judges to human review. Track 
success rate, cost, latency, and failure modes together — an agent that's 95% successful at 10× 
the cost may be worse than the 90% one. Run evals on every meaningful change; that's what makes 
them a safety net instead of a ceremony.

## When to use

- Before shipping any agent: establishing a baseline of real performance.
- Comparing approaches: prompts, models, tools, architectures — decide by numbers.
- After any change: catching regressions before users do.
- Debugging: a failing eval case is a reproducible bug report.

## Core concepts

- **Task suites**: 20–100 representative tasks covering happy paths, edge cases, and adversarial 
inputs. Small enough to run often, diverse enough to matter.
- **Graders**: exact match for deterministic outputs; structured rubrics for open-ended work; model 
judges for scale (with spot-checked human agreement); humans for the highest-stakes cases.
- **Success criteria**: defined per task before running — what counts as done, including partial 
credit rules. Vague criteria produce arguable results.
- **Failure taxonomy**: classify failures — wrong tool, bad arguments, premature completion, 
loop/stall, hallucinated data, guardrail violation. The taxonomy tells you what to fix.
- **Cost and latency**: tokens per task, wall-clock time, tool-call counts. Report alongside 
success rate; optimize the trade-off deliberately.
- **Regression discipline**: evals run in CI or on a schedule; results tracked over time; 
regressions block releases.

## Practical workflow

1. Collect real tasks from logs, support tickets, and user requests — not invented ones.
2. Write success criteria per task: checkable, specific, with partial-credit rules where sensible.
3. Build graders: deterministic checks first, rubric-based judges where needed; validate judges 
against human grades on a sample.
4. Establish the baseline: run the current agent, record success rate, cost, latency, and failure 
taxonomy.
5. On each change, rerun and compare: did success improve without cost/latency blowing up? Which 
failure modes moved?
6. Promote the eval suite to a gate: changes that regress the suite don't ship.

```text
Eval report template:
SUITE:    <name> — N tasks, last run <date>
SUCCESS:  <rate> (Δ vs baseline)
COST:     <tokens/task, $/task>   LATENCY: <p50/p95>
FAILURES: <taxonomy counts — top 3 modes>
NOTES:    <qualitative observations>
```

## Common pitfalls

- **Toy tasks**: evals on clean, simple tasks while production is messy. Mine tasks from real usage.
- **Grader gaming**: the agent learns to satisfy the grader, not the task. Rotate tasks; spot-check 
with humans.
- **Ignoring cost**: reporting success rate alone. A useful agent is successful *and* affordable.
- **One-shot evals**: running once and filing the report. Evals only pay off as a repeated practice.
- **Unvalidated judges**: model-graded evals where the judge was never checked against humans. 
Measure judge agreement first.
- **No failure taxonomy**: "it got 70%." Seventy percent of what, failing how? The taxonomy is the 
roadmap.
