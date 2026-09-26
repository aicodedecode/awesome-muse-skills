---
name: neural-decoding
description: Decoding mental states and stimuli from neural signals — classifiers, cross-validation, and leakage-free evaluation.
category: scientific
---

## Overview

neural-decoding is the practice of predicting stimuli, decisions, or behavior from measured neural
activity: which image was seen, which choice will be made, where attention is directed. It spans
fMRI MVPA, EEG/MEG classification, and spike-train decoding, and it is one of the most
leakage-prone analyses in neuroscience — most decoding "successes" that don't replicate trace back
to evaluation errors, not brain signals.

This skill is about doing decoding honestly: proper cross-validation, appropriate baselines, and
interpretations that don't outrun the evidence.

## When to use

- MVPA on fMRI: searchlight or ROI-based classification of conditions.
- EEG/MEG decoding: time-resolved classification (temporal generalization matrices).
- Spike-train decoding: population vector, Bayesian, or ML decoders.
- Choosing classifiers: linear SVM, logistic regression, LDA — and when not to use deep nets.
- Evaluating: cross-validation schemes, permutation-based significance, confusion matrices.
- Interpreting weights: why raw classifier weights mislead and what to use instead.

## Core concepts

- **Linear first.** Linear SVM, logistic regression, and LDA dominate neural decoding because
  neural datasets are small (tens-hundreds of trials) relative to features (thousands of voxels).
  Deep networks rarely help and usually overfit; start linear and only add complexity with
  evidence.
- **Cross-validation done right.** Split by independent units: runs/sessions for fMRI (never
  adjacent trials — temporal autocorrelation leaks), trials blocked by time for EEG, never shuffle
  within a trial. Leave-one-run-out is the fMRI default. Report the scheme explicitly.
- **The leakage catalog.** Feature selection on all data then CV; normalizing using all trials;
  hyperparameter tuning on the test set; trial-shuffled splits with autocorrelated data; using
  future time points to decode past ones. Each inflates accuracy; check for all of them.
- **Chance is not 50%.** With imbalanced classes, permutation testing gives the true null
  distribution — never compare to a theoretical chance level when classes are unbalanced or
  cross-validation is non-standard. Permute labels within the exact CV scheme, ≥1000 permutations.
- **Temporal generalization (EEG/MEG).** Train at time t, test at all times t′ — the resulting
  matrix reveals whether representations are stable (diagonal generalization) or dynamic
  (off-diagonal structure). This is more informative than single-time-point accuracy.
- **Searchlight.** A classifier in every local neighborhood, mapped back to the brain. Powerful
  but expensive and smooth-looking; correct for multiple comparisons (permutation + TFCE) and
  remember the map shows where information is, with searchlight-sized spatial uncertainty.
- **Weight interpretation.** Raw classifier weights are not importance maps — a large weight can
  reflect noise suppression, not signal. Use Haufe's activation-pattern transform (weights ×
  data covariance) for interpretable maps.
- **What decoding proves.** Above-chance decoding shows information about the label is present in
  the measured signal. It does not show the brain uses that information, that the representation
  is explicit, or (for fMRI) anything about timing. State exactly this.

## Practical workflow

1. **Define the question.** What label, what features, what would above-chance mean? Preregister
   the classifier and CV scheme.
2. **Prepare features.** fMRI: trial-wise betas or t-maps (not raw volumes); EEG: time-resolved
   voltages or time-frequency power; spikes: binned counts. Normalize within training folds only.
3. **Choose CV.** Leave-one-run-out (fMRI), blocked K-fold (EEG), stratified when classes are
   imbalanced. No peeking: all preprocessing parameters from training data.
4. **Baseline model.** Linear SVM or logistic regression with default-ish regularization. Tune C
   in nested CV if you must.
5. **Significance.** Permutation test within the same CV scheme; correct across searchlights/time
   points.
6. **Interpret.** Confusion matrices (which classes confuse?), Haufe-transformed patterns,
   temporal generalization. Report accuracy with CIs, not just "significant."

Example (Python sketch):
```python
from sklearn.svm import SVC
from sklearn.model_selection import LeaveOneGroupOut, permutation_test_score
clf = SVC(kernel="linear")
score, perm, p = permutation_test_score(clf, X, y, groups=runs,
                                        cv=LeaveOneGroupOut(), n_permutations=1000)
```

## Common pitfalls

- Feature selection or normalization before the CV split (leakage).
- Shuffled trial-wise CV on autocorrelated data.
- Comparing to 50% chance with imbalanced classes instead of permuting.
- Interpreting raw SVM weights as brain maps.
- Deep nets on 200 trials presented as methodological advance.
- Claiming the brain "represents" the label — decoding shows information presence, not use.
- Searchlight maps without multiple-comparisons correction.
