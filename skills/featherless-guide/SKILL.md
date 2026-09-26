---
name: featherless-guide
description: Uncensored open-model inference on Featherless AI — raw model behavior for research and evaluation.
category: ai-research
---

## Overview

Featherless AI offers inference for open models without the additional content
filtering layers many providers add — serving models as they are, including
uncensored fine-tunes. The use case is specific and legitimate: research,
evaluation, and development where you need to observe raw model behavior —
red-teaming, safety research, behavior evaluation, and creative applications
where provider-level refusals interfere with the work.

This is a specialized tool with a clear boundary: it's for studying and working
with unfiltered model behavior in appropriate contexts, not for circumventing
safety in production user-facing products. The skill covers the legitimate
research and evaluation workflows; the responsibility for appropriate use sits
with you and your organization's policies.

The practical framing: Featherless is an evaluation and research instrument.
Use it to understand what models do without guardrails, to test your own safety
layers, and to develop applications where you implement the content policy
yourself.

## When to use

- Safety research: studying model behavior, jailbreak robustness, refusal
  patterns on unfiltered models.
- Red-teaming your own applications: testing your safety layers against raw
  model outputs.
- Behavior evaluation: comparing filtered vs. unfiltered model behavior on
  benchmarks.
- Creative/research applications where provider refusals block legitimate work
  (fiction writing, academic research).
- Developing your own content moderation: generating test cases for classifiers.
- Model comparison: evaluating base vs. aligned behavior differences.

## Core concepts

- **Unfiltered inference**: models served without provider-added refusal layers.
  What you get is the model's trained behavior — including its failure modes.
  Plan for that in your handling.
- **Model catalog**: open models including uncensored fine-tunes. Know exactly
  which model you're running — "uncensored" varies by fine-tune.
- **Research framing**: treat outputs as data about model behavior, not as
  endorsed content. Log, analyze, and handle accordingly.
- **Your policy layer**: when building on unfiltered models, you own content
  policy. Implement your own moderation/classification appropriate to the use
  case — don't ship raw outputs to users unexamined.
- **Evaluation use**: paired comparisons (filtered vs. unfiltered) on safety
  benchmarks quantify what alignment layers actually change. Design these
  comparisons carefully.
- **Red-team methodology**: systematic adversarial testing needs methodology,
  not vibes — define attack categories, success criteria, and coverage before
  running.
- **Data handling**: unfiltered outputs may contain harmful content. Handle
  research data responsibly: access controls, no redistribution, appropriate
  storage.
- **API basics**: standard inference API patterns — integrate like any
  provider, with extra care around logging and data retention.

## Practical workflow

1. **Define the research question.** "Study uncensored models" is not a plan.
   Specify: what behavior, what comparison, what success looks like.
2. **Choose models deliberately.** Select the specific models/fine-tunes
   relevant to the question. Document versions — behavior varies widely.
3. **Set up responsible data handling.** Access controls on outputs, no
   logging of harmful content to shared systems, retention policies. Decide
   this before generating anything.
4. **Design the evaluation.** For safety research: attack taxonomies, benign
   baselines (measure over-refusal too), and clear scoring rubrics.
5. **Run systematically.** Batch your probes; log everything needed for
   analysis; keep benign and adversarial sets separate.
6. **Analyze comparatively.** The interesting findings are usually comparative:
   what changes between filtered and unfiltered, which attacks transfer, where
   alignment holds vs. breaks.
7. **Implement your own policy layer.** If building a product: classifiers,
   rules, and human review appropriate to the risk — tested against the
  unfiltered outputs you've now characterized.

Checklist for Featherless research work:
- Research question and methodology defined upfront.
- Model versions documented.
- Responsible data-handling plan in place.
- Benign baselines included (not just adversarial probes).
- Findings comparative and reproducible.

## Common pitfalls

- **No research question.** Generating unfiltered outputs without a plan
  produces noise, not insight. Define the question first.
- **Irresponsible data handling.** Logging harmful outputs to shared systems,
  redistributing them, or storing without access controls. Plan handling first.
- **Adversarial-only testing.** Probing only for failures without benign
  baselines. You can't distinguish "broken" from "permissive" without both.
- **Shipping raw outputs.** Putting unfiltered model outputs in front of users
  without your own policy layer. You own the policy — implement it.
- **Overgeneralizing from one fine-tune.** "Uncensored" isn't one thing;
  behavior varies by model and fine-tune. Scope conclusions to what you tested.
- **No documentation.** Running probes without recording methodology and
  versions. Unreproducible safety research helps no one.
- **Confusing permissiveness with capability.** An unfiltered model isn't
  smarter — it's less restrained. Evaluate capability and restraint separately.
- **Ignoring legal/policy constraints.** Your organization and jurisdiction
  have rules about this work. Confirm authorization before starting.
