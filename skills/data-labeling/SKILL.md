---
name: data-labeling
description: Design annotation pipelines that produce reliable training labels — guidelines, agreement measurement, and quality control.
category: ai-research
---

## Overview

Data labeling turns raw examples into training signal: class labels, preference
rankings, bounding boxes, span annotations, or structured judgments. The
uncomfortable truth of the field is that model quality is bounded by label quality
— a state-of-the-art architecture trained on noisy labels underperforms a simpler
model trained on clean ones. Professional labeling is not "pay people to click";
it's a measurement operation with guidelines as the spec, agreement metrics as the
QC, and adjudication as the error correction.

The pipeline has four parts: task design (what exactly is being labeled and what
the edge cases are), guidelines (the written contract between you and annotators),
the labeling pass itself (with redundancy for measurement), and quality control
(agreement metrics, gold questions, adjudication). Whether annotators are in-house
experts, crowd workers, or AI models doing the labeling, the same structure
applies — only the cost of iteration changes.

Labeling is the foundation every model stands on. Cracks here propagate silently
into every downstream metric, which is why the discipline matters more than the
tooling.

## When to use

- Building any supervised dataset: classification, NER, preference pairs, safety
  labels, evaluation sets.
- Diagnosing a model that "should work" but doesn't — label noise is a prime
  suspect.
- Creating gold-standard eval sets where label correctness is the whole point.
- Scaling annotation with AI labelers while keeping a human-verified quality bar.
- Regulated or high-stakes domains where label provenance and agreement must be
  auditable.
- Before any "the model is bad" conclusion — rule out "the labels are bad" first.

## Core concepts

- **Annotation guidelines**: the single highest-leverage artifact. Good guidelines
  define each label with positive and negative examples, adjudicate the 20 most
  common edge cases explicitly, and are versioned like code. If two careful
  readers disagree after reading the guidelines, the guidelines are broken, not the
  readers.
- **Inter-annotator agreement**: measured with Cohen's kappa or Krippendorff's
  alpha (not raw percent agreement, which inflates with class imbalance). Track
  per-label agreement — aggregate scores hide the labels annotators actually
  confuse.
- **Redundancy**: labeling each item 2–3 times lets you measure agreement and
  resolve by majority or adjudication. The cost is real; spend it on ambiguous
  slices, not on trivially easy items.
- **Gold questions**: items with known answers seeded into the queue to measure
  individual annotator accuracy continuously. Annotators falling below threshold
  get retrained or removed.
- **Adjudication**: an expert resolves disagreements. The adjudicated set doubles
  as the hardest, most informative training data — and as material for guideline
  v2.
- **AI-assisted labeling**: models pre-label, humans correct. Faster, but watch
  for automation bias — humans rubber-stamping model outputs. Mitigate with blind
  review samples and by measuring correction rates.
- **Label schema design**: the set of labels and their definitions. Smaller schemas
  are more reliable; every added label multiplies ambiguity. Design the schema
  from the pilot data, not from a priori taxonomies.
- **Provenance**: who labeled what, when, under which guideline version. Audit
  trails turn "the data says" into a checkable claim.

## Practical workflow

1. **Define the label schema.** Enumerate labels, write one-paragraph definitions
   with examples. Keep the schema as small as the task allows — every added label
   multiplies ambiguity.
2. **Pilot on 100–200 items.** Two annotators, full guidelines. Measure agreement
   per label. Anything below ~0.7 kappa (for trained annotators) means the
   guidelines or schema need work — fix before scaling.
3. **Write guidelines v1 from the pilot.** Every disagreement in the pilot becomes
   an explicit rule or example in the guidelines. This is the step most teams skip
   and most regret skipping.
4. **Qualify annotators.** A paid trial batch with gold questions before production
   work. Annotator quality varies enormously — selection beats training.
5. **Scale with QC.** Deploy gold questions (5–10% of queue), track per-annotator
   accuracy, and double-label a sample for ongoing agreement measurement.
6. **Adjudicate disagreements.** Expert review of conflicting labels; feed
   resolutions back into guideline updates. Version the guidelines and re-annotate
   affected slices when definitions change.
7. **Audit the final dataset.** Sample 2–5% for independent expert review. Report:
   agreement metrics, adjudication rate, annotator accuracy distribution, guideline
   version. Ship these stats with the dataset.

Checklist before training on a labeled dataset:
- Agreement measured on a representative sample, reported per label.
- Guideline version recorded; edge-case rules documented.
- Gold-question accuracy thresholds enforced during collection.
- Annotator qualification process documented.
- A final audit sample reviewed by someone who didn't write the guidelines.

## Common pitfalls

- **Guidelines written once, never updated.** The pilot disagreements are the
  guidelines trying to tell you what's ambiguous. Listen.
- **Percent agreement instead of kappa.** With 95% negative class, "always label
  negative" scores 95% agreement and teaches nothing. Use chance-corrected metrics.
- **No redundancy anywhere.** Without overlap you can't measure agreement, and
  without measurement you're guessing about quality.
- **Annotator pool mismatch.** Crowd workers for expert tasks (medical, legal)
  without qualification screening produces confident, wrong labels.
- **Automation bias in AI-assisted labeling.** If humans correct less than ~5% of
  model pre-labels, they're probably not really reviewing. Insert blind human-only
  samples to check.
- **Label schema churn mid-project.** Changing definitions halfway invalidates
  earlier labels. Version guidelines and re-annotate affected data, or quarantine
  by version.
- **Skipping annotator qualification.** Assuming all annotators are equivalent.
  The quality spread is huge — measure individuals and act on it.
- **No provenance.** Labels without records of who, when, and under which
  guidelines. When problems surface, you can't trace or fix them.
