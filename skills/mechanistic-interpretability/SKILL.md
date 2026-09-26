---
name: mechanistic-interpretability
description: Reverse-engineer how language models think — features, circuits, and neurons — to explain and audit their behavior.
category: ai-research
---

## Overview

Mechanistic interpretability treats a neural network like a program to be decompiled
rather than a black box to be prodded. Instead of asking "what does the model output,"
it asks "which internal structures cause this output." The core insight is that
networks learn reusable, interpretable features — directions in activation space
that correspond to concepts — and compose them into circuits: small subgraphs of
neurons and attention heads that implement recognizable algorithms.

Progress in the field has moved from single neurons (often polysemantic, doing
several jobs at once) to features extracted with sparse autoencoders, which
decompose activations into a larger, cleaner dictionary of monosemantic directions.
For transformers, canonical circuits include induction heads (copying recent
patterns), attention heads that move subject tokens for factual recall, and refusal
directions in safety-relevant layers.

A typical investigation traces an activation backwards: find the logits the model
assigns, locate the attention heads and MLP layers that push those logits up, then
ablate or patch them to confirm causation rather than correlation. The end product
is a mechanistic story — "this is the algorithm the model implements" — backed by
interventions, not just observations.

## When to use

- Auditing why a model produces a specific unwanted behavior (hallucinated facts,
  biased completions, jailbreak susceptibility).
- Validating that a safety-relevant mechanism is actually implemented inside the
  model rather than relying on surface-level testing.
- Understanding emergent capabilities — e.g., whether a model "really" does
  arithmetic or pattern-matches memorized tables.
- Steering model behavior at the feature level (activation steering) instead of
  relying only on prompts or fine-tuning.
- Teaching and research communication, where showing an actual circuit is more
  convincing than benchmark scores.
- Debugging fine-tuning surprises — finding which internal mechanisms a fine-tune
  altered when behavior changes unexpectedly.

## Core concepts

- **Features vs. neurons**: a neuron is an arbitrary basis direction; a feature is
  a direction that means something. Polysemanticity (one neuron, many meanings)
  happens because networks use superposition — cramming more features than neurons
  by packing near-orthogonal directions.
- **Sparse autoencoders (SAEs)**: trained to reconstruct layer activations through
  a sparse, overcomplete code. The learned dictionary atoms are the interpretable
  features. Quality is judged by reconstruction fidelity plus sparsity (L0/L1).
- **Circuits**: connected sets of features across layers that implement a function.
  Naming convention: e.g., "the name-mover heads move the subject name into the
  final position."
- **Activation patching**: replace activations on a clean input with activations
  from a corrupted input at specific positions/components. If the behavior flips,
  that component was causally responsible. Corrupted-with-restoration variants give
  finer attribution.
- **Probing**: train a linear classifier on activations to test whether
  information is present. Probes show correlation; patching and ablation show
  causation. Never confuse the two.
- **Activation steering**: add or subtract a feature vector during generation to
  amplify or suppress a concept (e.g., honesty, sycophancy). Steering vectors are
  cheap but can bleed into unrelated behaviors.
- **Attribution methods**: gradient-based and perturbation-based techniques that
  score each component's contribution to an output. Useful for triage before the
  expensive patching experiments.
- **Universality**: the hypothesis that different models learn similar features
  and circuits. When it holds, findings transfer; when it breaks, expect
  architecture- and scale-specific mechanisms.

## Practical workflow

1. **Pick a crisp behavior.** One input template with controlled variation (e.g.,
   "The capital of X is" for factual recall). Interpretability needs a behavioral
   contrast: clean vs. corrupted prompts differing in one factor.
2. **Localize with logit difference.** Compare target-token logit between clean and
   corrupted runs, then patch activations per layer and per attention head. Rank
   components by their effect size.
3. **Hypothesize a circuit.** Map which heads move which information where. Draw
   the information flow: token positions → heads → residual stream → logits.
4. **Ablate to confirm.** Zero-out or mean-ablate candidate heads; the behavior
   should degrade proportionally. Re-run with steering: amplifying the feature
   should strengthen the behavior.
5. **Validate with SAEs (for deeper work).** Train or use a released SAE on the
   target layer; map the top activated dictionary features for your behavior;
   label them by inspecting max-activating examples.
6. **Test generalization.** Vary the template, the entities, and the phrasing. A
   circuit that only fires on one template is a memorized shortcut, not a general
   mechanism.
7. **Document the mechanism.** Write the explanation as an algorithm ("head 5.7
   copies the subject token to the final position; MLPs 12–15 retrieve the
   attribute"), with the patching evidence that supports each claim.

Checklist before claiming a finding:
- Effect replicated across multiple input templates, not one cherry-picked prompt.
- Patching shows causation, not just probe correlation.
- Ablating the circuit degrades the specific behavior more than general capability.
- Feature labels checked against counterexamples, not only max-activating examples.
- Results hold on the model scale you actually care about.

## Common pitfalls

- **Probe-only stories.** "The model knows X" from a probe means the information
  is linearly decodable, not that the model uses it. Demand causal evidence.
- **Single-prompt circuits.** A circuit that only fires on one template is a
  memorized shortcut, not a general mechanism. Vary the template before
  generalizing.
- **Overclaiming SAE features.** SAE features still have some polysemanticity and
  reconstruction error; treating every atom as a clean concept invites false
  stories.
- **Ignoring the residual stream.** Attention-only explanations miss the MLP
  layers, which hold most factual knowledge. Always check both.
- **Steering as proof.** A steering vector that changes behavior proves the
  direction is influential, not that the model natively uses it that way.
- **Scaling assumptions.** Circuits found in a small model may reorganize in
  larger ones. Verify on the target scale before drawing safety conclusions.
- **Confirmation bias in feature labeling.** Reading max-activating examples
  generously to fit a pet theory. Actively hunt for counterexamples.
- **Attribution without intervention.** Heatmaps and importance scores suggest;
  only patching and ablation confirm. Treat attribution as triage, not evidence.
