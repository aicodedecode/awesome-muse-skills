---
name: active-learning
description: Label smarter, not more — pick the most informative examples for annotation to maximize model gains per label.
category: ai-research
---

## Overview

Active learning is the discipline of choosing which unlabeled examples to label
next, so each annotation buys maximum model improvement. Instead of labeling a
random sample, you train on a small seed set, ask the model which examples it's
most uncertain about (or which would most change its beliefs), label those,
retrain, and repeat. In the right conditions this cuts labeling cost by 30–70% for
the same accuracy — the savings are largest when labels are expensive (experts,
preference judgments) and the data pool is large and redundant.

The classic loop is simple; the engineering is not. You need an acquisition
function (uncertainty, diversity, or expected model change), a batch strategy
(labeling one example at a time is optimal but impractical), and a retraining
cadence that keeps the loop moving. Modern practice combines uncertainty sampling
with diversity constraints to avoid labeling 500 near-identical confusing
examples, and uses model-based or embedding-based proxies when retraining a giant
model every round is too costly.

Active learning is a bet that not all labels are equal. The skill is in collecting
the evidence — a random-sampling baseline — that tells you whether the bet is
paying off.

## When to use

- Labeling budget is the bottleneck and each label costs real money or expert
  time.
- The unlabeled pool is large and redundant (web crawls, logs, user queries).
- Building a classifier or preference model where the decision boundary region is
  small relative to the data.
- Cold-starting a model for a new domain with zero labeled data.
- Deciding which examples deserve expensive human review in a human-in-the-loop
  system.
- Preference data collection, where each judgment is costly and the informative
  comparisons are a small fraction of possible pairs.

## Core concepts

- **Uncertainty sampling**: pick examples where the model is least confident —
  highest entropy, smallest margin between top classes, or largest disagreement
  across an ensemble/dropout passes. Simple and often the best baseline.
- **Query-by-committee**: train several models (or sample with dropout) and pick
  examples where they disagree most. Disagreement signals genuine ambiguity rather
  than single-model miscalibration.
- **Diversity sampling**: uncertainty alone clusters on near-duplicates. Constrain
  batches for coverage — cluster embeddings and sample across clusters, or use
  coreset methods that pick a representative subset.
- **Expected model change / expected error reduction**: pick the example whose
  label would most change the model or reduce expected error. Theoretically
  principled, computationally brutal; usually approximated.
- **Batch-mode active learning**: label in batches of tens to hundreds per round.
  Balance per-batch diversity against round latency — more rounds with smaller
  batches is statistically better but operationally slower.
- **Stopping criteria**: when the acquisition scores flatten, when validation
  accuracy plateaus across rounds, or when the marginal cost per point of accuracy
  exceeds the budget. Define this before starting.
- **Proxy models**: when the production model is expensive to retrain, use a
  smaller proxy for acquisition scoring. Validate that the proxy's uncertainty
  correlates with the real model's — otherwise you're optimizing the wrong thing.
- **Sampling bias**: active selection oversamples hard cases, skewing the training
  distribution. Account for this before deployment (reweighting, calibration on
  random samples).

## Practical workflow

1. **Seed with a small random set.** Label 100–500 random examples to get a
   baseline model. Random seeds avoid pathological early bias toward one region.
2. **Set up the random baseline.** Run a parallel random-sampling track from the
   start. This is your ROI evidence — without it you can't tell if active learning
   is helping.
3. **Choose an acquisition function.** Start with margin/entropy uncertainty +
   embedding-diversity constraint. It's the 80/20 choice; only reach for fancier
   methods if this underperforms random sampling.
4. **Run the loop.** Score the pool → select a diverse batch → label → retrain (or
   fine-tune incrementally) → evaluate on a fixed held-out set. Keep the eval set
   fixed across rounds so progress is comparable.
5. **Track the learning curve.** Plot accuracy vs. cumulative labels for active vs.
   random. The gap is your ROI evidence. If active isn't beating random by round 3,
   debug the acquisition function or the pool.
6. **Watch for sampling bias.** Active learning oversamples hard/ambiguous cases,
   which skews the training distribution. For final model calibration, mix in a
   random sample or reweight.
7. **Stop deliberately.** When the curve flattens or the cost-per-gain crosses your
   threshold, stop and do a final training run on everything labeled.

Checklist for an active learning run:
- Random-sampling baseline running in parallel for comparison.
- Fixed held-out eval set, untouched by acquisition.
- Batch diversity enforced (no 500 near-duplicates).
- Stopping rule defined up front.
- Final calibration accounts for selection bias.

## Common pitfalls

- **Uncertainty without diversity.** The model is uncertain about a whole cluster
  of duplicates; you label all of them and learn one thing 500 times.
- **No random baseline.** Active learning sometimes loses to random sampling
  (small pools, noisy labels, miscalibrated models). Without the baseline you'll
  never know.
- **Retraining cost killing the loop.** Full retraining of a large model per round
  is often infeasible; use incremental fine-tuning or a small proxy model for
  acquisition scoring.
- **Biased final dataset.** The actively-selected set is not representative — it's
  enriched for hard cases. Calibrate on a random sample before deployment.
- **Cold-start failure.** With a tiny seed set the model's uncertainty estimates
  are noise. Seed adequately and consider pure diversity sampling for the first
  rounds.
- **Label noise amplification.** Active learning preferentially selects ambiguous
  examples, which are exactly the ones annotators disagree on. Pair with
  adjudication or the "informative" examples are just noise.
- **Proxy-target mismatch.** The proxy model's uncertainty doesn't reflect the
  production model's. Validate the correlation before trusting proxy acquisition.
- **Moving the eval set.** Changing evaluation data between rounds destroys
  comparability. Fix the eval set for the entire run.
