---
name: differential-diagnosis-framework
description: Structured differential diagnosis — generating, prioritizing, and ruling out diagnostic hypotheses.
category: scientific
---

## Overview

differential-diagnosis-framework is a structured approach to diagnostic reasoning: generating a
complete hypothesis set from a presentation, prioritizing by probability and treatability, and
testing efficiently. It is aimed at clinical trainees, researchers building diagnostic tools, and
anyone who needs diagnostic reasoning made explicit — it does not replace clinical judgment and is
not a substitute for professional medical evaluation.

The framework fights the two classic diagnostic failure modes: premature closure (stopping at the
first plausible diagnosis) and shotgun testing (ordering everything, interpreting nothing).

## When to use

- Working up an undifferentiated presentation: building the initial differential.
- Prioritizing which diagnoses to test first (probability × urgency × treatability).
- Choosing tests by likelihood ratios and test-treatment thresholds.
- Avoiding cognitive biases: anchoring, confirmation bias, premature closure.
- Teaching or assessing clinical reasoning.
- Designing diagnostic decision-support tools or evaluating their output.

## Core concepts

- **Generate broadly, then prune.** Start with an exhaustive differential organized by system or
  by pathophysiologic category (anatomic, infectious, inflammatory, neoplastic, vascular,
  metabolic, traumatic, iatrogenic...). Use frameworks like VINDICATE or anatomic approaches to
  avoid missing categories. Exhaustive generation is cheap; missed diagnoses are expensive.
- **Prioritize by probability × stakes.** Rank hypotheses by pre-test probability given the
  presentation, weighted by urgency (can't-miss diagnoses: MI, sepsis, subarachnoid hemorrhage)
  and treatability. "Most likely" and "most dangerous" are different lists — work both.
- **Bayesian updating.** Pre-test probability → test with known likelihood ratio → post-test
  probability. A positive D-dimer in a low-risk patient barely moves the needle; the same result
  in a high-risk patient is decisive. Tests don't diagnose; they update probabilities.
- **Test and treatment thresholds.** Below the test threshold: don't test (even a positive won't
  change management). Above the treatment threshold: treat without further testing. Between:
  test. Explicit thresholds prevent both over-testing and dangerous under-testing.
- **Likelihood ratios over sensitivity/specificity.** LR+ = sens/(1−spec); LR− = (1−sens)/spec.
  LRs combine with pre-test odds directly and travel across populations better than predictive
  values. Memorize ballpark LRs for common tests rather than sens/spec pairs.
- **Cognitive bias countermeasures.** Anchoring (first impression dominates) → force alternative
  generation. Confirmation bias (seeking supporting evidence) → ask "what would disprove my
  leading diagnosis?" Premature closure → require explicit consideration of can't-miss diagnoses
  before closing. Base-rate neglect → state the pre-test probability numerically.
- **Occam vs Hickam.** Prefer a unifying diagnosis (Occam) but remember patients can have two
  diseases (Hickam's dictum). When the presentation doesn't quite fit one diagnosis, consider
  two — especially in elderly or complex patients.
- **Document reasoning.** Record the differential, the leading hypothesis with its probability,
  what would change your mind, and the plan. This is both good medicine and medicolegal sense.

## Practical workflow

1. **Gather data.** History (onset, character, associated symptoms, risk factors), exam,
   existing results. Note what's missing, not just what's present.
2. **Generate.** List all plausible diagnoses by category; include can't-miss diagnoses even at
   low probability.
3. **Prioritize.** Assign rough pre-test probabilities; flag the dangerous and the treatable.
4. **Test strategically.** Choose tests with the best LRs for the decision at hand; respect test
   and treatment thresholds; don't order tests that can't change management.
5. **Update.** Revise probabilities with each result; be willing to abandon the leading
   hypothesis (diagnostic timeout: scheduled re-examination of the differential).
6. **Treat and reassess.** Response to treatment is diagnostic information — but also confounded
   (placebo, natural history), so interpret cautiously.
7. **Close the loop.** Final diagnosis with reasoning documented; follow up on pending results;
   safety-net advice for what should prompt return.

## Common pitfalls

- Premature closure on the first plausible diagnosis.
- Anchoring on the referral diagnosis or triage label.
- Ordering broad panels instead of hypothesis-driven tests.
- Ignoring base rates (rare zebras over common horses without reason).
- Positive test results over-interpreted in low-prevalence settings.
- Failing to reconsider when the patient doesn't follow the expected course.
- Not documenting the differential or the reasoning behind test choices.

*Note: this skill supports clinical reasoning education and decision-support design. It does not
provide medical advice for individual patients — diagnostic decisions require qualified
clinicians with full clinical context.*
