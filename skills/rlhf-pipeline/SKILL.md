---
name: rlhf-pipeline
description: Build the full reinforcement-learning-from-human-feedback stack — preference data, reward model, and policy optimization.
category: ai-research
---

## Overview

RLHF aligns a language model to human preferences in three stages. First, collect
preference data: human annotators rank or choose between pairs of model responses
to prompts. Second, train a reward model on these comparisons, typically with a
Bradley-Terry loss that predicts which response a human would prefer. Third,
optimize the policy — usually with PPO (proximal policy optimization) — to maximize
reward while staying close to the original model via a KL penalty, preventing
collapse into reward-hacking gibberish.

Variants replace pieces of this stack: DPO skips the reward model and optimizes
the policy directly on preference pairs; RLAIF uses AI-generated preferences;
online RLHF re-collects preferences as the policy changes. The classic three-stage
pipeline remains the reference design because each stage is independently
inspectable: you can audit the preference data, probe the reward model, and
monitor the KL budget during policy training.

The economic reality: RLHF is the most expensive common alignment method, in
labeling cost and engineering complexity. It earns that cost when nuanced human
judgment — tone, helpfulness trade-offs, refusal style — is the actual product
requirement.

## When to use

- Aligning a base or instruction-tuned model to nuanced human preferences that can't
  be captured by supervised data alone (tone, helpfulness trade-offs, refusal
  style).
- Building an assistant product where "which response is better" judgments matter
  more than "which is correct."
- Reducing harmful or unwanted outputs while keeping the model helpful, via a
  reward model that encodes those trade-offs.
- Researching alignment: each stage is a separate object of study (labeler
  agreement, reward model generalization, optimization dynamics).
- When you have the labeling budget and infrastructure for a multi-stage pipeline
  and the scale to justify it.
- As the final polish stage after SFT, when supervised data has taken you as far
  as demonstrations can.

## Core concepts

- **Preference pairs**: (prompt, chosen, rejected) triples. Quality dominates
  quantity: clear, well-annotated comparisons beat large volumes of noisy ones.
  Annotator guidelines are the real specification of your model's values.
- **Reward model**: usually the policy-sized (or smaller) model with a scalar head,
  trained to score responses. Evaluated by accuracy on held-out human preferences
  and by calibration on out-of-distribution prompts.
- **Bradley-Terry model**: the standard loss — the probability that response A is
  preferred over B is a sigmoid of their score difference. Simple, but assumes
  transitive, noise-free preferences; real data isn't.
- **PPO with KL penalty**: the policy update maximizes expected reward minus
  β·KL(policy || reference). The KL term is the guardrail against reward hacking.
  Track reward and KL jointly — rising reward with rising KL is a warning sign,
  not success.
- **Reward hacking**: the policy learns to exploit quirks of the reward model
  (verbosity, sycophancy, confident tone) rather than genuine quality. The single
  biggest failure mode of the whole pipeline.
- **Online vs. offline**: offline RLHF trains on a fixed preference dataset;
  online variants (iterative RLHF) generate new responses from the current policy
  and get fresh preferences, correcting distribution shift.
- **KL budget**: the total allowed divergence from the reference, spent across
  training. Spend it deliberately — monitor cumulative KL, not just the
  coefficient.
- **Annotator agreement**: the noise floor of your signal. Low inter-annotator
  agreement means the reward model learns noise; fix guidelines before scaling
  collection.

## Practical workflow

1. **Write annotation guidelines.** Specify what "better" means for your use case:
   factuality first? refusal style? tone? Include edge-case examples. Pilot with
   200–500 examples and measure inter-annotator agreement before scaling.
2. **Collect preference data.** Sample prompts covering the target distribution;
   generate 2–4 responses per prompt from the current policy; have annotators rank
   or pick best/worst. Aim for tens of thousands of pairs minimum for a serious
   run.
3. **Train the reward model.** Fine-tune from the policy or a smaller model with a
   scalar head. Validate on held-out pairs and on adversarial prompts; check that
   scores correlate with human judgment on a fresh sample.
4. **Probe the reward model.** Before PPO, test it on edge cases: does it prefer
   longer answers regardless of quality? Does it penalize refusals correctly? Fix
   what you find — PPO will amplify every flaw.
5. **Run PPO.** Standard hyperparameters: KL coefficient β tuned so KL stays in a
   target band, learning rate lower than SFT, batch sizes large enough for stable
   advantage estimates. Log reward, KL, response length, and win-rate against the
   base policy throughout.
6. **Evaluate holistically.** Reward score is not the metric — human win-rate on a
   blind eval set, plus targeted safety evals, plus capability regression checks
   (the aligned model shouldn't forget facts or reasoning).
7. **Iterate online if needed.** If you see distribution shift (the policy exploits
   regions the reward model never saw), collect fresh preferences on current-policy
   outputs and repeat.

Checklist before shipping an RLHF model:
- Held-out human win-rate beats the SFT baseline by a meaningful margin.
- Capability benchmarks haven't regressed (no "alignment tax" surprises).
- Reward hacking probes: verbosity, sycophancy, refusal-bait prompts tested.
- KL divergence stayed within the planned budget through training.
- Annotator guidelines versioned and agreement metrics recorded.

## Common pitfalls

- **Optimizing the reward, not the goal.** Goodhart's law is the default outcome.
  Treat the reward model as a proxy and validate with humans continuously.
- **Bad preference data.** Inconsistent annotators, unclear guidelines, or prompts
  that don't match deployment produce a reward model that encodes the wrong values
  precisely.
- **KL too loose or too tight.** Too loose → reward hacking and degenerate outputs.
  Too tight → the RL stage changes nothing and you've paid for nothing.
- **Ignoring length bias.** Reward models systematically prefer longer responses.
  Control for length in evaluation or the policy learns to ramble.
- **Single-turn optimization.** PPO on single responses can degrade multi-turn
  behavior (e.g., the model becomes agreeable rather than truthful across a
  conversation). Evaluate multi-turn explicitly.
- **Skipping the SFT stage.** RLHF on a raw base model is unstable; a solid
  supervised fine-tune first gives the policy a sensible starting distribution.
- **Reward model never probed.** Going straight from reward training to PPO without
  adversarially testing the reward model. Its flaws become the policy's features.
- **No online correction.** Running one offline round and declaring victory while
  the policy has drifted off the reward model's training distribution.
