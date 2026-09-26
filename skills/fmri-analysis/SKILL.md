---
name: fmri-analysis
description: fMRI data analysis — preprocessing, GLM modeling, and group-level inference for task and resting-state studies.
category: scientific
---

## Overview

fmri-analysis covers the standard fMRI pipeline: preprocessing (motion correction, distortion
correction, normalization, smoothing), first-level modeling with the general linear model (GLM),
and group-level inference. It also covers the quality-control culture that fMRI requires — head
motion alone can manufacture "activations," and the field's replication history demands conservative
statistics.

The focus is task fMRI with the GLM; resting-state connectivity gets its own coverage in
resting-state-fmri, and preprocessing details live in mri-preprocessing.

## When to use

- Designing a task fMRI experiment: block vs event-related designs, jittering, trial timing,
  run length.
- First-level GLM: building design matrices, HRF convolution, contrasts.
- Group analysis: one-sample/two-sample t-tests, mixed-effects (FLAME), covariates.
- Multiple-comparisons correction: cluster correction, FWE, FDR, TFCE, permutation (randomise).
- ROI analysis: anatomical vs functional ROIs, percent signal change extraction.
- MVPA/decoding: searchlight and ROI-based multivariate pattern analysis.
- Reporting: what parameters, thresholds, and QC metrics a methods section needs.

## Core concepts

- **BOLD is indirect.** The signal reflects blood oxygenation, not spikes — delayed ~4-6 s,
  sluggish, and confounded by vasculature, motion, and physiology. Effect sizes are small (often
  <1% signal change); design accordingly.
- **The hemodynamic response function.** Model neural events convolved with a canonical HRF
  (double-gamma). Add temporal/dispersion derivatives to absorb HRF variability. Misspecified
  timing (wrong onsets, unmodeled durations) is the commonest GLM error.
- **Design efficiency.** Block designs maximize detection power; event-related designs (with
  jittered ISIs) allow estimating the HRF shape and separating close events. Efficiency depends on
  the contrast — optimize the design for the contrast you care about.
- **Nuisance regressors.** Six motion parameters plus derivatives, CSF/white-matter signals
  (CompCor), physiological regressors (RETROICOR) when available, and spike regressors for
  high-motion volumes. Motion correlates with task in many paradigms — unmodeled, it becomes
  "activation."
- **Preprocessing order matters.** Slice-timing → motion correction → distortion correction
  (fieldmaps/TOPUP) → coregistration → normalization → smoothing. Each step's errors propagate;
  check registrations visually for every subject.
- **Smoothing trade-off.** 6-8 mm FWHM boosts SNR for univariate GLM but blurs fine patterns —
  skip or minimize smoothing for MVPA. Match smoothing to the analysis, not to habit.
- **Multiple comparisons.** ~100k+ voxels tested. Valid options: voxel-wise FWE, cluster-level
  correction with proper cluster-forming thresholds (p<0.001, not p<0.01 — see Eklund et al.),
  TFCE, or permutation testing. Uncorrected p<0.001 with k>10 is not a correction.
- **Circular analysis.** Defining ROIs from the same contrast you then test inflates everything.
  Use independent localizers, anatomical atlases, or split-half data.

## Practical workflow

1. **Design.** Choose block vs event-related for the question; jitter ISIs; keep runs <10 min to
   limit motion; pilot the timing outside the scanner.
2. **QC raw data.** Check motion (framewise displacement; flag runs with mean FD >0.5 mm or many
   spikes), coverage, ghosting, and signal dropout (orbitofrontal/temporal regions).
3. **Preprocess.** fMRIPrep is the recommended default — it handles the boilerplate reproducibly.
   Visually verify coregistration and normalization for every subject.
4. **First-level GLM.** Build the design matrix with correct onsets/durations, HRF convolution,
   nuisance regressors, and high-pass filtering (cutoff ~1/128 Hz or matched to design). Check
   design orthogonality and efficiency; inspect residual maps.
5. **Contrasts.** Task > baseline, condition A > B, parametric modulators. Keep contrasts few and
   preregistered; exploratory whole-brain contrasts get full correction.
6. **Group analysis.** Mixed-effects model (subjects as random effects), covariates for age/sex/
   motion, proper multiple-comparisons correction. Report peak coordinates, cluster sizes, and
   effect sizes — not just "significant blobs."
7. **Report.** Preprocessing pipeline + versions, motion exclusion criteria, first-level model
   details, group model, correction method with thresholds, and unthresholded maps (NeuroVault).

Example (nilearn sketch):
```python
from nilearn.glm.first_level import FirstLevelModel
fm = FirstLevelModel(t_r=2.0, hrf_model="spm", drift_model="cosine",
                     smoothing_fwhm=6, mask_img=mask)
fm.fit(run_imgs, events=events_df, confounds=confounds_df)
z_map = fm.compute_contrast("task-baseline", output_type="z_score")
```

## Common pitfalls

- Cluster correction with lenient cluster-forming thresholds (the Eklund problem).
- Motion-task correlation passed off as activation (check motion regressors' correlation with design).
- Double-dipping ROIs: selecting voxels by the effect you then quantify.
- Interpreting BOLD as direct neural activity or as "the brain lighting up."
- Reverse inference: "amygdala active, therefore fear" — regions do many things.
- Smoothing before MVPA, destroying the patterns you want to decode.
- Small samples (n<20) with flexible analyses — the replication-crisis recipe.
