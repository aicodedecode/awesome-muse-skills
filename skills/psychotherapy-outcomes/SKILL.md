---
name: psychotherapy-outcomes
description: Measuring psychotherapy effectiveness — outcome instruments, reliable change, and benchmarking clinical significance.
category: scientific
---

## Overview

psychotherapy-outcomes covers how to measure whether therapy works: choosing outcome instruments,
designing outcome studies, computing reliable and clinically significant change, and benchmarking
against expected recovery curves. It bridges clinical practice and research — from the solo
practitioner doing measurement-based care to the trialist running an RCT.

The core discipline: symptom scores are not outcomes until you show the change is reliable (beyond
measurement error), clinically meaningful (not just statistically significant), and attributable to
treatment (not time, regression, or placebo).

## When to use

- Selecting outcome measures for a practice or study (PHQ-9, GAD-7, OQ-45, CORE-OM, etc.).
- Measurement-based care: session-by-session monitoring and feedback.
- Computing reliable change index (RCI) and clinically significant change (Jacobson-Truax).
- Designing psychotherapy trials: comparators, allegiance effects, therapist effects.
- Benchmarking: comparing local outcomes to published norms and expected recovery curves.
- Handling missing outcome data and dropout (which is itself an outcome).

## Core concepts

- **Choosing instruments.** Brief, free, validated, sensitive to change: PHQ-9 (depression),
  GAD-7 (anxiety), OQ-45/CORE-OM (general distress + functioning), disorder-specific scales
  (PCL-5, Y-BOCS) when relevant. Match the measure to the population and the decision the score
  will inform. Re-validate cutoffs in your population — imported cutoffs misclassify.
- **Measurement-based care (MBC).** Administering a brief measure every session and feeding
  results back to therapist and patient. Meta-analyses show MBC improves outcomes, especially by
  catching not-on-track cases early. The measure must be short enough to actually use (<5 min)
  or it won't happen.
- **Reliable change index (RCI).** RCI = (post − pre) / S_diff, where S_diff accounts for the
  measure's reliability. |RCI| > 1.96 means change beyond measurement error (p < .05). Report
  counts of reliably improved / unchanged / deteriorated — deterioration happens (~5-10%) and
  hiding it is dishonest.
- **Clinically significant change (Jacobson-Truax).** Reliable change plus crossing from the
  clinical to the non-clinical distribution (cutoff c). Four categories: recovered, improved,
  unchanged, deteriorated. This is the standard for "did therapy work" at the individual level.
- **Expected recovery curves.** Dose-response models (Howard et al.) give the expected
  improvement by session number. Patients below the expected curve ("not on track") are at high
  risk of failure — flag them for clinical review rather than continuing unchanged treatment.
- **Trial design issues.** Comparators matter: waitlist controls inflate effect sizes (nocebo +
  no treatment); use active/placebo-psychotherapy controls. Allegiance effects (researchers'
  preferred therapy wins) are large — use adversarial collaboration or at least independent
  assessors. Therapist effects (some therapists consistently better) need multilevel modeling —
  ignoring them underestimates uncertainty.
- **Dropout.** 20-40% dropout is typical. Analyze by intention-to-treat; model dropout as
  informative (it's often related to outcome); report dropout rates by condition — differential
  dropout biases everything.
- **Follow-up.** Post-treatment gains fade. Measure at 6-12 months; report sustained recovery,
  not just end-of-treatment scores.

## Practical workflow

1. **Select measures.** One general + one disorder-specific; brief enough for every session;
   validated in your population.
2. **Baseline.** Full assessment including severity, functioning, and risk; establish the
   clinical-range cutoff for your setting.
3. **Monitor.** Every-session brief measure; plot the trajectory against expected recovery
   curves; review not-on-track cases in supervision.
4. **Compute change.** RCI per patient; Jacobson-Truax categories; group-level effect sizes
   (within- and between-group d) with CIs.
5. **Handle missingness.** Intention-to-treat; multiple imputation or pattern-mixture models;
   sensitivity analyses for MNAR dropout.
6. **Benchmark.** Compare recovery rates to published norms for the same measures and
   populations; investigate systematic underperformance.
7. **Report.** CONSORT-style flow, reliable/clinical change counts (including deterioration),
   follow-up outcomes, and therapist-effect estimates where data allow.

Example computation sketch:
```r
S_diff <- sd_pre * sqrt(2 * (1 - reliability))
RCI <- (post - pre) / S_diff          # |RCI| > 1.96 = reliable change
# Jacobson-Truax cutoff c:
c <- (sd_clin * mean_norm + sd_norm * mean_clin) / (sd_clin + sd_norm)
```

## Common pitfalls

- Reporting only group means — hiding individual deterioration.
- Waitlist-controlled trials presented as strong efficacy evidence.
- Allegiance effects unaddressed (developer testing their own therapy).
- Ignoring therapist effects in the analysis.
- Dropout analyzed as missing-completely-at-random.
- No follow-up — claiming lasting benefit from end-of-treatment scores.
- Imported cutoffs applied to a different population without validation.
