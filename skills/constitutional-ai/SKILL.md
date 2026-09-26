---
name: constitutional-ai
description: Train safer, more steerable AI by having the model critique and revise itself against an explicit written constitution.
category: ai-research
---

## Overview

Constitutional AI (CAI) is a training methodology in which a model's behavior is
shaped by an explicit, written constitution — a set of principles covering honesty,
harmlessness, autonomy-preservation, and other values — rather than by thousands of
example human judgments. The model itself generates candidate responses, critiques
them against the constitution, and revises them. These self-revisions become
training data, so the system internalizes the principles rather than merely
imitating labeled examples.

The pipeline has two stages. First, supervised learning: the model critiques and
revises its own outputs across a broad distribution of prompts, and the best
revisions are used as supervised fine-tuning data. Second, reinforcement learning
from AI feedback (RLAIF): the model compares pairs of its own responses against
constitutional principles, and those preference judgments train a reward model for
policy optimization. Because the feedback is AI-generated, the method scales
without per-example human labeling — though humans still write the constitution,
design the principles, and evaluate the results.

The transparency payoff is structural: unlike implicit labeler preferences, a
constitution can be published, versioned, debated, and audited. When the model
refuses or hedges, its behavior should trace back to identifiable principles.

## When to use

- Building an assistant that needs consistent, explainable behavior derived from
  principles rather than black-box preference data.
- Scaling alignment work when human labeler throughput is the bottleneck.
- Reducing labeler-driven bias: a written constitution is auditable and
  version-controlled; implicit labeler preferences are not.
- Producing models that can explain refusals and judgments by citing the
  underlying principles.
- Researching scalable oversight — using AI to supervise AI — where the
  constitution is the compact specification.
- Organizations that need a governance artifact: the constitution doubles as the
  documented behavior policy for review boards and regulators.

## Core concepts

- **The constitution**: a list of normative principles ("choose the response that
  is most helpful while avoiding harm..."). Good constitutions are specific enough
  to adjudicate real cases, short enough to be consistently applied, and layered
  (e.g., corrigibility → duties → virtues).
- **Self-critique and revision**: given a prompt and a draft response, the model is
  asked to identify constitutional violations, then rewrite the response to fix
  them. The critique-revision loop is where most of the alignment signal comes
  from.
- **RLAIF**: replacing human preference labels with AI-generated ones. The
  critique model scores which of two responses better satisfies the constitution; a
  reward model learns from these judgments.
- **Red-teaming prompts**: the training distribution matters as much as the
  constitution. Generate adversarial prompts that probe the principles' boundaries,
  or the model never learns where they bite.
- **Constitution as documentation**: unlike weights, a constitution can be
  published, debated, and audited. This is the main transparency advantage of the
  approach.
- **Corrigibility**: the model's first duty — to remain shapeable by its
  developers — precedes all other principles, so the constitution can't be used to
  justify resisting oversight.
- **Principle precedence**: when principles conflict, an explicit ordering decides.
  Without precedence rules, the model resolves conflicts arbitrarily and
  inconsistently.
- **Critique model quality**: the ceiling of the whole method. A weak or biased
  critique model bakes its flaws into every downstream artifact.

## Practical workflow

1. **Draft the constitution.** Write 10–40 principles organized in tiers: hard
   constraints (safety, legality), then duties (honesty, fidelity to user), then
   virtues (helpfulness, humility). Write them as instructions a careful reviewer
   could apply.
2. **Stress-test the draft.** Run the principles against hard cases before any
   training. Where two careful readers disagree on what a principle requires,
   rewrite the principle.
3. **Generate critique data.** Sample diverse prompts including red-team cases. For
   each, generate a base response, prompt the model to critique it against the
   constitution, and produce a revised response.
4. **Filter and fine-tune.** Keep revisions that genuinely improve on the originals
   (a second model can judge this); discard trivial rewrites. Supervised-fine-tune
   on the revision pairs.
5. **Train the preference model.** For prompt-response pairs, have the critique
   model rank responses by constitutional compliance. Train the reward model on
   these rankings.
6. **Run RL.** Optimize the policy against the reward model with a KL penalty to
   the supervised baseline, monitoring for reward hacking on a held-out evaluation
   set.
7. **Evaluate against the constitution explicitly.** Build an eval set where each
   item tests a specific principle. Report pass rates per principle — aggregate
   scores hide principle-level failures.

Checklist before deployment:
- Each principle has dedicated eval items, including adversarial ones.
- The model cites or reflects principles when refusing, not just stonewalling.
- RLAIF judgments were spot-checked by humans for systematic bias.
- Reward hacking monitored: KL divergence and eval scores tracked jointly.
- Constitution version recorded alongside the model checkpoint.

## Common pitfalls

- **Vague constitutions.** "Be good" is not a constitution. Principles that can't
  adjudicate a disputed case add no signal beyond generic helpfulness training.
- **Self-grading bias.** The same model critiquing itself can entrench its own
  blind spots. Use a stronger or differently-trained critique model where possible,
  plus human spot checks.
- **Critique quality as the ceiling.** RLAIF can only be as good as the critique
  prompts and critique model. Invest in them like you'd invest in labeler training.
- **Reward hacking.** The policy will find ways to score high on the reward model
  without following the spirit of the principles. Hold out evals the reward model
  never saw.
- **Principle conflicts.** Principles genuinely conflict in edge cases (honesty vs.
  kindness, helpfulness vs. safety). The constitution needs explicit precedence
  rules; otherwise the model picks arbitrarily.
- **Treating the constitution as secret sauce.** The methodology's transparency
  benefit only materializes if you publish or at least document the constitution
  and its rationale.
- **Static constitutions.** Principles that made sense at training time drift from
  organizational values. Version the constitution and re-evaluate on revision.
- **Critique-revision collapse.** If revisions barely differ from originals, the
  supervised stage teaches nothing. Measure revision distance and filter
  aggressively.
