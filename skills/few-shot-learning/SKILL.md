---
name: few-shot-learning
description: Teach models new tasks from a handful of examples — prompting strategies, example selection, and in-context learning mechanics.
category: ai-research
---

## Overview

Few-shot learning with large language models means teaching a task through examples
placed in the prompt — no weight updates. Show the model 2–10 input-output pairs
demonstrating the pattern, then give it a new input. The model infers the task
from the demonstrations: the output format, the label space, the reasoning style.
It's the fastest way to prototype a new capability, and for many tasks it matches
or beats fine-tuning, especially when labeled data is scarce.

What makes it work is still partly mysterious, but the practical levers are well
mapped: example selection (which demonstrations), example ordering (sequence
effects are real), formatting (consistent delimiters the model can latch onto),
and the number of shots (more isn't always better — context gets diluted). Modern
practice treats the few-shot prompt as a small program to be engineered and
evaluated, not as prose to be admired.

The strategic role of few-shot prompting has shifted: it's now the prototyping
layer. Prove the task works few-shot, then decide whether to keep the prompt, move
to fine-tuning, or distill into a smaller model.

## When to use

- Prototyping a new classification, extraction, or transformation task before
  committing to fine-tuning.
- Tasks with scarce labeled data where fine-tuning would overfit.
- One-off or rapidly-changing tasks where retraining is impractical.
- Steering output format precisely (JSON schemas, specific label sets, stylistic
  constraints).
- Evaluating whether a task is learnable at all — if few-shot fails badly, the
  task definition is probably the problem.
- Low-volume tasks where prompt-engineering cost beats fine-tuning cost.

## Core concepts

- **In-context learning**: the model's ability to infer a task from demonstrations
  without gradient updates. Emerges with scale; larger models need fewer, less
  carefully chosen examples.
- **Example selection**: the highest-leverage variable. Strategies: random
  (surprisingly strong baseline), semantic retrieval (pick training examples most
  similar to the query via embeddings), diversity sampling (cover the label space
  and edge cases), and difficulty-based (include hard examples the model gets wrong
  zero-shot).
- **Ordering effects**: models are recency-biased — examples near the end of the
  prompt influence the output more. Also susceptible to majority-label bias
  (predicting the most frequent label in the demonstrations). Shuffle and test
  multiple orders.
- **Format consistency**: use identical delimiters and structure across examples
  (`Input: ... Output: ...`). The model learns the template as much as the task;
  inconsistency in the template is inconsistency in the lesson.
- **Shot count trade-offs**: accuracy usually rises steeply to 4–8 shots then
  plateaus or degrades as the context fills with near-duplicates. Test the curve
  rather than assuming more is better.
- **Calibration**: few-shot predictions inherit the label bias of the
  demonstrations. If your examples are 80% class A, expect inflated class-A
  predictions. Balance the demonstration set or calibrate outputs.
- **Retrieval-augmented selection**: for production, retrieve per-query examples
  from a pool using embeddings. Usually beats a fixed example set, at the cost of
  a retrieval step.
- **Demonstration quality**: one wrong example teaches the wrong pattern
  confidently. Verify every demonstration's correctness — the model trusts them
  absolutely.

## Practical workflow

1. **Write the zero-shot baseline first.** A clear task instruction with no
   examples. Measure it — this tells you how much the examples are actually
   adding.
2. **Curate 8–15 candidate examples.** Cover every label/class, include 1–2 tricky
   edge cases, keep each example short. Quality and coverage beat quantity.
3. **Verify every example.** Each demonstration must be correct and representative.
   A single wrong example poisons the pattern the model infers.
4. **Build the prompt template.** Fixed instruction + examples in a rigid format +
   the query in the same format. Delimit examples clearly.
5. **Select per query (for harder tasks).** Retrieve the k most similar examples
   to each query from your candidate pool using embeddings. This usually beats a
   fixed example set.
6. **Evaluate systematically.** Test on a held-out set: vary shot count (0, 2, 4,
   8), example orders, and selection strategies. Report variance across orders —
   if results swing wildly, the prompt is fragile.
7. **Decide: prompt or fine-tune.** If few-shot with retrieved examples hits your
   accuracy bar reliably, ship the prompt. If it's fragile, slow (long contexts
   cost latency and money), or the task is stable and high-volume, distill the
   examples into a fine-tune.

Checklist for a production few-shot prompt:
- Evaluated on held-out data with multiple example orders; variance acceptable.
- Label distribution in demonstrations balanced or deliberately chosen.
- Every demonstration verified correct.
- Failure cases reviewed: model fails on genuinely hard inputs, not format
  confusion.
- Latency and cost of the long prompt acceptable at expected volume.
- Fallback defined for when retrieval finds no good examples.

## Common pitfalls

- **Testing on the training examples.** Evaluating few-shot accuracy on the same
  examples shown in the prompt measures memorization of the prompt, not learning.
  Always held-out.
- **Ignoring order variance.** A prompt that scores 90% with one order and 70%
  with another is not a 90% prompt. Report the distribution.
- **Kitchen-sink prompts.** Twenty rambling examples with inconsistent formatting
  teach the model that the task is "produce rambling text." Fewer, cleaner
  examples win.
- **Label bias blindness.** Demonstrations skewed toward one class silently become
  a prior. Balance or calibrate.
- **Assuming more shots = better.** Beyond the plateau, extra examples add
  latency, cost, and sometimes confusion. Find the knee of the curve.
- **Fragile formatting.** If changing "Output:" to "Answer:" breaks the task, you
  don't have a robust solution — you have a lucky incantation. Harden the template
  or fine-tune.
- **Unverified demonstrations.** Including an example you haven't checked. The
  model treats demonstrations as ground truth — so must you.
- **No per-query retrieval.** Using a fixed example set when queries vary widely.
  Retrieved examples usually win; the retrieval step is cheap compared to the
  accuracy gain.
