---
name: distillation
description: Distill large models into smaller ones — teacher-student training, data generation, loss design, and quality validation. Use when you need big-model behavior at small-model cost.
category: ai-research
---

# Model Distillation

Distillation transfers capability from a large teacher model to a smaller student: train the 
student to mimic the teacher's outputs (or output distributions) on a representative dataset. The 
result runs cheaper and faster while retaining much of the teacher's behavior.

## Overview

The core idea: the teacher's soft outputs (probability distributions, reasoning traces) contain 
more information than hard labels — "dark knowledge" about similarities between classes and 
plausible alternatives. The student trains on teacher-generated data, often with a loss combining 
teacher imitation and ground-truth labels. Modern practice extends this to distilling reasoning: 
training students on teachers' chain-of-thought traces to transfer reasoning ability, not just 
answers.

## When to use

- Deploying big-model quality on limited hardware or budget.
- Reducing latency: smaller models respond faster.
- Creating specialized small models from a general large teacher.
- Offline/precompute scenarios where teacher cost is one-time and student cost is per-query.

## Core concepts

- **Teacher-student setup**: the teacher generates training signal; the student learns from it. The 
teacher should be strong on the target task — distilling a weak teacher teaches weakness.
- **Soft targets**: training on the teacher's output distribution, not just its top answer. 
Temperature softens the distribution to expose more dark knowledge.
- **Distillation data**: representative of deployment inputs. Coverage matters more than volume — 
the student only learns what it sees the teacher do.
- **Reasoning distillation**: including the teacher's reasoning traces in training data transfers 
problem-solving patterns, not just final answers. The current best practice for reasoning tasks.
- **Loss design**: balancing imitation loss (match the teacher) with task loss (match ground 
truth). Pure imitation inherits teacher errors; pure task loss wastes the teacher.
- **Capacity gap**: students too small can't absorb the teacher. Match student size to task 
complexity; sometimes a medium student beats a tiny one at similar cost.

## Practical workflow

1. Define the target behavior and build an eval set measuring it.
2. Choose the teacher (strong on the task) and student (fits the deployment budget) sizes.
3. Generate distillation data: diverse, representative inputs with teacher outputs (and reasoning 
traces for reasoning tasks).
4. Filter teacher outputs for quality — distilling teacher mistakes teaches mistakes. Keep 
ground-truth labels where available.
5. Train the student with combined imitation + task loss; tune temperature and loss weights.
6. Evaluate student vs. teacher vs. task baseline on the eval set; check where the student still 
lags and target those with more data.

```text
Distillation checklist:
[ ] Eval set for the target behavior
[ ] Teacher strong on the task; student fits budget
[ ] Distillation data covers deployment distribution
[ ] Teacher outputs quality-filtered
[ ] Loss balances imitation + ground truth
[ ] Student evaluated vs teacher; gaps analyzed
```

## Common pitfalls

- **Distilling teacher errors**: unfiltered teacher outputs bake mistakes into the student. Filter 
aggressively.
- **Unrepresentative data**: distilling on data unlike deployment. The student learns the wrong 
distribution.
- **Answers without reasoning**: distilling final answers only for reasoning tasks. Include traces 
— that's where the capability lives.
- **Student too small**: expecting a tiny model to absorb complex reasoning. Respect the capacity 
gap.
- **No ground-truth anchoring**: pure imitation with no task loss drifts from correctness. Anchor 
with labels where they exist.
- **Skipping the eval**: assuming the student retained "most" capability. Measure it — the gap is 
often task-specific.
