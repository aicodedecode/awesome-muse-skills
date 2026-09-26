---
name: mri-preprocessing
description: Structural and functional MRI preprocessing — bias correction, skull-stripping, registration, and QC with fMRIPrep-style pipelines.
category: scientific
---

## Overview

mri-preprocessing covers the unglamorous but decisive early steps of MRI analysis: converting
DICOMs, correcting intensity inhomogeneities, skull-stripping, tissue segmentation, and registering
brains to templates — plus the QC discipline that catches the misregistrations and artifacts that
would otherwise become "results."

Good preprocessing is invisible; bad preprocessing is the paper. This skill focuses on structural
(T1/T2) and the preprocessing half of functional pipelines, with fMRIPrep as the recommended
reference implementation.

## When to use

- Setting up a new MRI study: sequence choices that affect preprocessing (fieldmaps, multiband,
  resolution).
- DICOM to BIDS conversion and dataset organization.
- Structural preprocessing: bias field correction, skull-stripping, segmentation, surface
  reconstruction.
- Functional preprocessing: motion correction, susceptibility distortion correction, coregistration,
  normalization.
- QC: visual checks, automated reports, exclusion criteria.
- Troubleshooting: failed skull-strips, bad normalizations, ghosting, dropout.

## Core concepts

- **BIDS first.** Organize data in Brain Imaging Data Structure before anything else
  (`sub-01/ses-01/anat/sub-01_T1w.nii.gz` + JSON sidecars). Every major tool reads BIDS; ad-hoc
  folder layouts break reproducibility and collaboration.
- **Bias field correction.** Scanner inhomogeneities create smooth intensity gradients (N4ITK).
  Correct before segmentation — tissue classifiers assume uniform intensities per tissue class.
- **Skull-stripping.** Removing non-brain tissue (antsBrainExtraction, HD-BET, SynthStrip).
  Failures are common with lesions, atrophy, or unusual anatomy — always inspect; a bad brain
  mask poisons everything downstream.
- **Segmentation.** GM/WM/CSF probability maps (FAST, Atropos) feed normalization, nuisance
  regression (CompCor), and volumetry. Partial-volume effects at tissue boundaries are
  unavoidable at typical resolutions — interpret thin cortical findings cautiously.
- **Susceptibility distortion correction.** EPI images warp where the field is inhomogeneous
  (orbitofrontal cortex, temporal poles). A fieldmap or reverse-phase-encoding acquisition
  (TOPUP) unwarpes them; without it, "activations" can be mislocalized by centimeters.
- **Coregistration and normalization.** Functional→structural (boundary-based registration is
  the gold standard), structural→template (MNI152 via ANTs SyN). Check every subject visually —
  normalization failures are silent and common in lesioned or pediatric brains.
- **Motion.** Six-parameter rigid-body realignment; framewise displacement quantifies it.
  Scrubbing/censoring high-motion volumes is standard, but motion correlates with group
  (patients move more) — censoring can bias group comparisons, so report motion by group.
- **fMRIPrep as default.** It implements the community-consensus pipeline with per-subject HTML
  reports. Use it unless you have a specific reason not to, and cite its boilerplate methods text.

## Practical workflow

1. **Convert and validate.** `dcm2niix` → BIDS; run the BIDS validator. Fix naming now — renaming
   mid-project breaks provenance.
2. **Collect fieldmaps.** Acquire blip-up/blip-down EPI or a fieldmap sequence; preprocessing
   without distortion correction is a known-weakness choice, documented as such.
3. **Run fMRIPrep.** One command per dataset with consistent template and output spaces. Keep the
   working directory for debugging.
4. **QC every subject.** Read the HTML reports: brain mask outlines, coregistration edges,
   normalization warps, carpet plots, FD traces. Reject or flag failures with written criteria.
5. **Derivatives.** Use the preprocessed outputs + confound files (motion, CompCor, FD) as inputs
   to GLM, connectivity, or MVPA — never re-derive preprocessing inside the analysis script.
6. **Document.** Pipeline name + version, template, and exclusion counts go in the methods; share
   the boilerplate text fMRIPrep generates.

Example command sketch:
```bash
dcm2niix -b y -z y -o bids/ dicoms/
fmriprep bids/ derivatives/ participant --fs-license-file license.txt \
  --output-spaces MNI152NLin2009cAsym:res-2 --use-syn-sdc warn
```

## Common pitfalls

- Skipping distortion correction and mislocalizing frontal/temporal results.
- Trusting automated brain masks without visual inspection.
- Normalizing lesioned brains to a healthy template without cost-function masking.
- Motion scrubbing that differentially removes patient data.
- Mixing template spaces across studies (MNI152 variants differ by millimeters — enough to matter).
- Re-running preprocessing with tweaked parameters until results look "better" (preprocessing
  degrees of freedom are still degrees of freedom — preregister the pipeline).
