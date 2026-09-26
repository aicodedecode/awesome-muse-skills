---
name: resting-state-fmri
description: Resting-state fMRI analysis — denoising, seed-based and ICA networks, and reliability-aware interpretation.
category: scientific
---

## Overview

resting-state-fmri covers the analysis of task-free fMRI: the brain's intrinsic functional
architecture measured through spontaneous BOLD fluctuations. It focuses on aggressive denoising
(resting-state has no task model to absorb noise), the standard network-mapping approaches
(seed-based, ICA, parcellation connectomes), and the reliability limits that make resting-state
findings fragile without care.

Resting-state's strength — no task needed, usable in patients, infants, and sleep — is also its
weakness: everything in the signal is "signal," including motion, breathing, and cardiac
pulsation.

## When to use

- Preprocessing resting-state data: denoising strategies (CompCor, ICA-AROMA, GSR decisions).
- Mapping networks: seed-based correlation, group ICA, parcellation-based connectomes.
- Denoising QC: QC-FC plots, motion scrubbing decisions, carpet plots.
- Group comparisons and brain-behavior correlations with proper correction.
- Reliability: test-retest assessment (ICC) and what it implies for individual differences.
- Dynamic connectivity: sliding windows and co-activation patterns, with skepticism.

## Core concepts

- **Denoising is the analysis.** Without a task regressor, noise dominates. Standard stack:
  motion parameters + derivatives, CompCor (anatomical or temporal), ICA-AROMA or manual ICA
  denoising, band-pass filtering (0.01-0.1 Hz), censoring high-motion volumes. Each choice
  changes connectivity — document all of them.
- **Motion: the eternal confound.** Even sub-millimeter motion systematically biases connectivity
  (inflates short-range, reduces long-range). QC-FC plots (correlation between connectivity and
  motion across subjects) diagnose residual artifact; if QC-FC is significant, denoising failed.
- **Global signal regression.** Removes widespread respiratory and motion artifacts but shifts the
  correlation distribution (mandates negative correlations) and can create or erase group
  differences. Run key analyses with and without GSR and report both.
- **Seed-based correlation.** Pick a seed (e.g. posterior cingulate for the default mode network),
  correlate its time series with every voxel. Simple and interpretable; results depend on seed
  placement — use published coordinates or atlas ROIs, not hand-drawn seeds.
- **ICA.** Data-driven decomposition into spatial networks (default mode, salience, executive
  control, etc.). Group ICA + dual regression gives subject-specific network maps. Choosing the
  model order (20 vs 100 components) changes what counts as "a network" — justify it.
- **Parcellation connectomes.** Full region×region matrices enable graph analysis and
  connectome-based predictive modeling. Parcellation choice (Schaefer 100/400, Glasser) strongly
  affects results; test at least two granularities for key findings.
- **Reliability.** Test-retest ICC for connectivity edges is typically 0.3-0.6 — modest. This
  caps observable brain-behavior correlations and demands larger samples for individual-differences
  claims. Report ICC for your primary measure; underpowered "biomarker" studies are the field's
  recurring embarrassment.
- **Dynamic connectivity.** Sliding-window correlations and CAPs can reveal time-varying states,
  but windowed correlations are extremely noisy and sampling variability mimics dynamics. Require
  statistical tests against stationary nulls (phase-randomized surrogates) before claiming
  non-stationarity.

## Practical workflow

1. **Acquire well.** ≥10 min of rest (more is better for reliability), eyes-open with fixation
   (standardize it — eyes open vs closed changes networks), multiband for temporal resolution,
   fieldmaps for distortion correction.
2. **Preprocess with fMRIPrep.** Then apply your chosen denoising stack to the outputs. Inspect
   carpet plots before and after denoising — structured bands surviving denoising mean failure.
3. **QC.** FD distributions by group, QC-FC plots, number of censored volumes. Exclude by
   prespecified motion criteria, applied equally across groups.
4. **Map networks.** Seed-based or ICA for canonical networks; parcellation connectome for
   whole-brain analysis. Keep the approach preregistered.
5. **Statistics.** Permutation-based tests (NBS for connectomes, randomise for maps); correct
   for the actual number of tests run. Brain-behavior correlations need out-of-sample validation
   (cross-validated prediction), not just significant r values.
6. **Report.** Denoising pipeline in full, motion by group, reliability estimates, and
   unthresholded maps. State GSR choice explicitly.

Example (Python sketch):
```python
from nilearn.input_data import NiftiSpheresMasker
masker = NiftiSpheresMasker(seeds=[(0, -53, 26)], radius=8,  # PCC
                            detrend=True, standardize=True,
                            low_pass=0.1, high_pass=0.01, t_r=2.0)
seed_ts = masker.fit_transform(func_img, confounds=confounds_df)
```

## Common pitfalls

- Weak denoising presented as a neural finding (check QC-FC).
- GSR applied or omitted without discussion of its consequences.
- Brain-behavior correlations without cross-validation ("voodoo correlations" redux).
- Claiming dynamic connectivity without testing against stationary nulls.
- Eyes-open vs eyes-closed mixed across subjects or sessions.
- Small samples for individual-differences claims given modest ICC.
- Double-dipping: defining networks from group differences, then testing those differences.
