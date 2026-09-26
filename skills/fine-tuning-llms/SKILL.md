---
name: fine-tuning-llms
description: Fine-tune large language models — data curation, SFT, parameter-efficient methods (LoRA), evaluation, and avoiding common training failures. Use when a base model needs task-specific behavior or domain knowledge.
category: ai-research
---

# Fine-Tuning LLMs

Fine-tuning adapts a pretrained model to your task, domain, or style. Done well, it's the 
highest-leverage way to get reliable specialized behavior; done poorly, it's an expensive way to 
degrade a good model. The data matters more than the hyperparameters.

## Overview

The pipeline: curate high-quality demonstrations of desired behavior, choose the tuning method 
(full fine-tuning for maximum adaptation, LoRA/QLoRA for efficiency), train with careful 
hyperparameters, and evaluate against the base model on task-specific benchmarks. Most fine-tuning 
projects fail on data quality, not on training mechanics — a thousand excellent examples beat a 
million mediocre ones.

## When to use

- The base model doesn't follow your domain's conventions, format, or style reliably.
- You need consistent structured outputs or specialized reasoning patterns.
- Prompting alone can't achieve the reliability you need.
- Adapting to proprietary knowledge or terminology (paired with retrieval for facts).

## Core concepts

- **SFT (supervised fine-tuning)**: training on input/output demonstrations of desired behavior. 
Teaches format, style, and task patterns — not new facts (that's what retrieval is for).
- **Data quality**: diverse, correct, well-formatted examples in the target distribution. 
Deduplicate, filter for quality, and match the length/style of real usage.
- **LoRA/QLoRA**: training low-rank adapters instead of all weights — 1% of parameters, 
near-full-tuning quality for most tasks, runnable on single GPUs. The default choice.
- **Hyperparameters**: learning rate (small — you're adjusting, not training from scratch), 
epochs (few — overfitting is the main risk), batch size, warmup. Start from known-good configs 
for your model size.
- **Evaluation**: task-specific benchmarks plus general capability checks (did tuning break general 
abilities?). Compare against the base model and against a prompt-only baseline.
- **Catastrophic forgetting**: aggressive tuning erases general capabilities. Mitigate with small 
learning rates, few epochs, and mixed-in general data.

## Practical workflow

1. Define the target behavior precisely with examples; build an eval set before training anything.
2. Curate the dataset: quality over quantity, deduplicated, in the target distribution. Inspect 
samples manually.
3. Start with LoRA: known-good hyperparameters for your model size, 1–3 epochs.
4. Evaluate: task benchmark vs. base model vs. prompt-only baseline; check general capabilities 
didn't regress.
5. Iterate on data first (add failure-mode examples), hyperparameters second.
6. Version everything: dataset hash, config, base model, eval scores. Reproducibility is 
non-negotiable.

```text
Fine-tune checklist:
[ ] Eval set built BEFORE training
[ ] Dataset inspected manually; deduplicated
[ ] Started with LoRA + known-good hyperparams
[ ] Compared: tuned vs base vs prompt-only
[ ] General capability regression checked
[ ] Data/config/model versioned
```

## Common pitfalls

- **Bad data, tuned confidently**: noisy or misformatted training data teaches the model your 
mistakes. Curate ruthlessly.
- **Too many epochs**: overfitting to the training set's quirks. Few epochs, watch validation.
- **No prompt-only baseline**: fine-tuning when better prompting would've sufficed. Always compare.
- **Forgetting check skipped**: the tuned model aces your task and fails at everything else. Test 
general abilities.
- **Teaching facts via SFT**: fine-tuning memorizes poorly and hallucinates confidently. Use 
retrieval for knowledge, tuning for behavior.
- **Unversioned runs**: "the good model" with no record of data or config. Version everything or 
lose reproducibility.
