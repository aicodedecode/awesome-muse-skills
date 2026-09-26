---
name: diagnostic-test-accuracy
description: Evaluating diagnostic tests — sensitivity, specificity, ROC analysis, likelihood ratios, and study design.
category: scientific
---

## Overview

diagnostic-test-accuracy covers how to evaluate whether a test distinguishes disease from
non-disease: study designs (cohort, case-control, with their biases), the core metrics
(sensitivity, specificity, predictive values, likelihood ratios, ROC/AUC), and the reporting
standards (STARD) that make accuracy studies credible. A test's accuracy in a paper and its
usefulness in practice are different things — this skill keeps both in view.

## When to use

- Designing a diagnostic accuracy study: population, reference standard, blinding.
- Computing and interpreting sensitivity, specificity, PPV/NPV, likelihood ratios.
- ROC analysis and AUC: what it means, when it misleads.
- Choosing cutoffs: Youden index, clinical utility, net benefit.
- Comparing two tests: paired designs, McNemar, ROC comparison.
- Appraising published accuracy studies for bias (QUADAS-2).
- Understanding why PPV collapses in low-prevalence screening.

## Core concepts

- **The 2×2 table.** Sensitivity = TP/(TP+FN) (rule-out power; SnNOut). Specificity =
  TN/(TN+FP) (rule-in power; SpPIn). These are properties of the test in a population — but
  they're estimated in a studied population, and spectrum effects mean they don't always travel.
- **Predictive values depend on prevalence.** PPV = probability of disease given a positive test.
  Even a 99%-sensitive, 99%-specific test has PPV ~50% at 1% prevalence. This is the math behind
  every screening controversy — always compute predictive values at the prevalence where the test
  will actually be used.
- **Likelihood ratios.** LR+ and LR− convert pre-test odds to post-test odds and are the most
  clinically useful single numbers. LRs >10 or <0.1 change probability decisively; LRs near 1 are
  useless regardless of statistical significance.
- **ROC and AUC.** The ROC curve plots sensitivity vs 1−specificity across cutoffs; AUC is the
  probability a random diseased subject scores higher than a random healthy one. AUC 0.5 = useless,
  0.7-0.8 = modest, >0.9 = excellent — but AUC averages over clinically irrelevant cutoff regions.
  Report partial AUC or sensitivity at clinically relevant specificity when it matters.
- **Cutoff selection.** The Youden index (max sens+spec−1) is statistically convenient but
  clinically arbitrary — it weights false positives and negatives equally. Choose cutoffs by
  clinical consequences (missing disease vs false alarms), ideally via decision-curve/net-benefit
  analysis.
- **Reference standard.** Accuracy is measured against a reference ("gold") standard — which is
  itself imperfect. Imperfect reference bias distorts everything; use composite references,
  expert panels, or latent-class analysis, and blind index-test interpreters to the reference
  (and vice versa).
- **Design biases.** Case-control (extreme cases vs healthy controls) inflates accuracy
  (spectrum bias); partial verification (only positives get the reference test) inflates
  sensitivity; incorporating the index test into the reference standard is circular. The
  preferred design: consecutive patients with diagnostic uncertainty, all receiving index and
  reference tests, blinded.
- **QUADAS-2 appraisal.** Four domains: patient selection, index test, reference standard, flow
  and timing. Use it to appraise any accuracy study before believing its numbers.

## Practical workflow

1. **Define the clinical role.** Triage, add-on, or replacement test? The role determines the
   required accuracy profile and the comparator.
2. **Design.** Consecutive eligible patients, prespecified index-test cutoff (or prespecified
   method for choosing it), reference standard applied to all, blinded interpretation.
3. **Analyze.** 2×2 table with 95% CIs (Wilson intervals); ROC/AUC; LRs; predictive values at
   relevant prevalences; decision-curve analysis for clinical utility.
4. **Compare properly.** Paired design when comparing tests (same patients, McNemar for
   sens/spec, DeLong for AUCs); report incremental value over existing workup, not standalone
   accuracy.
5. **Validate.** Independent population, preferably different setting/spectrum; report
   calibration as well as discrimination.
6. **Report STARD.** Flow diagram, indeterminate results handling, adverse events from testing,
   and the exact cutoff with its derivation.

Example (R sketch):
```r
library(pROC)
roc_obj <- roc(disease, test_score, ci = TRUE)
coords(roc_obj, "best", best.method = "youden")   # cutoff exploration
# predictive values at 5% prevalence:
ppv <- function(sens, spec, prev) sens*prev / (sens*prev + (1-spec)*(1-prev))
```

## Common pitfalls

- Case-control designs with healthy controls (spectrum bias inflating accuracy).
- Cutoff chosen on the same data used to report accuracy (optimism bias).
- PPV reported at study prevalence instead of clinical prevalence.
- AUC worship — ignoring the clinically relevant region of the ROC curve.
- Partial verification bias (reference test only for index-positives).
- Index test incorporated into the reference standard.
- Indeterminate/uninterpretable results silently dropped from the 2×2.
