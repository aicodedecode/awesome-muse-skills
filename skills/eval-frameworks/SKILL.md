---
name: eval-frameworks
description: Build evaluation frameworks for LLM systems — harness design, graders, datasets, regression tracking, and human-in-the-loop eval. Use when you need systematic measurement of model or agent quality.
category: ai-research
---

# Eval Frameworks

If you can't measure it, you can't improve it — and you'll ship regressions you never notice. An 
eval framework is the harness, datasets, graders, and processes that turn "does it work?" from a 
feeling into a number tracked over time.

## Overview

Components: a task dataset (representative, versioned), a runner (executes the system on tasks, 
reproducibly), graders (deterministic checks, rubric judges, humans), metrics (aggregated, sliced 
by category), and tracking (scores over time, per change). The framework's value compounds: every 
eval run makes the next decision easier and the next regression harder to ship.

## When to use

- Any LLM feature heading to production: build the evals before launch.
- Comparing models, prompts, or architectures: decide by numbers.
- Regression prevention: catching quality drops from changes.
- Tracking quality over time as models and data evolve.

## Core concepts

- **Task datasets**: real tasks from production (logs, tickets, user queries), categorized by type 
and difficulty. Versioned; refreshed as the product evolves. 50–200 tasks is a practical range.
- **Runner**: executes tasks deterministically — fixed seeds where possible, recorded configs, 
parallel execution. Reproducibility is the point.
- **Graders**: exact match / structured checks for deterministic outputs; rubric-based LLM judges 
for open-ended (validated against humans); human grading for the highest-stakes slices.
- **Metrics**: aggregate scores plus slices — by task type, difficulty, and failure mode. The 
slices tell you what to fix; the aggregate tells you if you're improving.
- **Regression tracking**: scores stored per run with the code/prompt/model version. Diffs on every 
change; regressions block or flag.
- **Human-in-the-loop**: sampled human review calibrating automated graders and catching what they 
miss. Automation scales; humans ground truth.

## Practical workflow

1. Mine real tasks from production data; categorize by type and difficulty.
2. Write graders: deterministic where possible; rubric judges where needed — and validate judges 
against human grades first.
3. Build the runner: reproducible execution, parallel, with full per-task logging.
4. Establish baselines: current system scores, sliced by category. This is your "before" picture.
5. Integrate into the change process: evals run on every meaningful change; regressions 
investigated before shipping.
6. Maintain: refresh tasks as the product evolves, re-validate judges periodically, review slices 
for new failure modes.

```text
Eval framework anatomy:
TASKS/    versioned task sets, categorized
RUNNER/   reproducible execution + logging
GRADERS/  deterministic checks + validated judges
METRICS/  aggregates + slices by type/difficulty
HISTORY/  scores per version — the regression record
HUMAN/    sampled review calibrating automation
```

## Common pitfalls

- **Synthetic tasks only**: evals on invented tasks while production differs. Mine from real usage.
- **Unvalidated judges**: LLM graders never checked against humans. Measure agreement before 
trusting.
- **Aggregate-only reporting**: "82% pass" hiding a collapsed category. Slice always.
- **No versioning**: tasks or graders changing silently. Version everything; diffs must be 
meaningful.
- **Evals as ceremony**: run once, filed away. Value comes from repetition — integrate into the 
workflow.
- **Grader gaming**: optimizing for the grader instead of the task. Rotate tasks; keep humans in 
the loop.
