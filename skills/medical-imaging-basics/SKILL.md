---
name: medical-imaging-basics
description: Medical imaging fundamentals — modalities, DICOM handling, visualization, and quantitative image analysis.
category: scientific
---

## Overview

medical-imaging-basics covers the major imaging modalities (X-ray/CT, MRI, ultrasound, PET, nuclear
medicine), how images are stored and viewed (DICOM, windowing), and the quantitative analysis
pipeline: preprocessing, segmentation, registration, and radiomics. It is aimed at researchers and
analysts working with medical images, not at clinical interpretation — reading scans for diagnosis
requires medical training and is out of scope.

## When to use

- Understanding modality trade-offs: when CT vs MRI vs ultrasound vs PET answers the question.
- Handling DICOM data: reading, anonymizing, converting, organizing.
- Visualization: windowing, multiplanar reconstruction, 3D rendering.
- Preprocessing: bias correction, denoising, intensity normalization.
- Segmentation: manual, atlas-based, and deep-learning approaches with validation.
- Registration: aligning images across time points, modalities, or to atlases.
- Radiomics: feature extraction and the reproducibility discipline it demands.

## Core concepts

- **Modalities and what they show.** X-ray/CT: X-ray attenuation — bone, lung, contrast-enhanced
  vessels; fast, ionizing radiation. MRI: proton environments — superb soft-tissue contrast, no
  ionizing radiation, slow and expensive. Ultrasound: real-time, cheap, operator-dependent, poor
  through bone/air. PET: metabolic function via radiotracers (FDG for glucose metabolism) —
  functional but low resolution, always co-registered with CT/MRI. Nuclear medicine (SPECT):
  functional, widely available.
- **Hounsfield units (CT).** Absolute scale: air −1000, water 0, bone +1000+. This quantitation
  is CT's strength — use it (e.g. lung thresholds, calcium scoring) rather than eyeballing.
- **MRI sequences.** T1: anatomy (fat bright, fluid dark). T2: pathology (fluid bright — edema,
  inflammation light up). FLAIR: T2 with CSF suppressed (periventricular lesions visible). DWI/ADC:
  restricted diffusion (acute stroke bright on DWI, dark on ADC). Know which sequence answers
  which question before requesting or analyzing.
- **DICOM.** The standard container: pixel data plus metadata (patient, acquisition parameters,
  geometry). Never work on identified DICOMs without authorization — anonymize (remove PHI tags,
  deface structural MRIs) before analysis or sharing. Tools: pydicom, dcm2niix.
- **Windowing.** CT/MRI display maps a subrange of intensities to grayscale (window width/level).
  Lung windows, bone windows, brain windows show different things in the same data — a finding
  invisible in one window is obvious in another. Quantitative analysis should use raw values, not
  windowed display.
- **Segmentation.** Manual (expert, slow, variable — measure inter-rater Dice), atlas-based,
  and deep learning (nnU-Net is the strong baseline). Validate with Dice coefficient and
  Hausdorff distance on held-out data; report failure cases. A model with Dice 0.95 on easy
  cases and 0.40 on hard ones is not "a 0.95 model."
- **Registration.** Rigid (6 DOF, within-subject), affine (12 DOF), deformable (longitudinal
  change, atlas mapping). Always inspect overlays — registration failures are silent and common.
- **Radiomics.** Hundreds of shape/texture/intensity features from ROIs. Extremely
  overfitting-prone: features are unstable across scanners and segmentations. Require test-retest
  stability filtering, external validation, and reporting per TRIPOD/RQS guidelines. Most
  published radiomics signatures do not replicate — assume yours won't until proven otherwise.

## Practical workflow

1. **Define the imaging question.** Which modality and sequence actually shows the target
   pathology? Consult a radiologist at design time, not after acquisition.
2. **Acquire consistently.** Fixed protocols across sites/scanners; phantom scans for
   calibration; record all acquisition parameters in DICOM metadata.
3. **Anonymize and organize.** Deface, strip PHI, convert to NIfTI/BIDS where appropriate.
4. **QC.** Check for motion, artifacts, coverage, and correct sequence labeling — mislabeled
   sequences are a real and embarrassing error source.
5. **Preprocess.** Bias correction (N4), denoising, intensity normalization (within-modality
   appropriate methods — z-scoring MRI intensities across subjects is often wrong).
6. **Segment/register.** Validated method, inspected outputs, reported metrics with CIs.
7. **Quantify.** Volumes, thickness, SUV, ADC values, or radiomics — with stability analysis and
   external validation for any predictive claim.
8. **Report.** Acquisition parameters, preprocessing, validation metrics, and failure rates.
   Share code; share data when consent allows.

Example (Python sketch):
```python
import pydicom, numpy as np
ds = pydicom.dcmread("scan.dcm")
img = ds.pixel_array * ds.RescaleSlope + ds.RescaleIntercept  # Hounsfield units
lung = (img > -1000) & (img < -500)  # rough lung mask example
```

## Common pitfalls

- Analyzing windowed display images instead of raw intensities.
- Mislabeled MRI sequences (T1 analyzed as T2).
- Segmentation validated only on easy cases.
- Radiomics without external validation or stability filtering.
- Uninspected registrations silently misaligning longitudinal data.
- Working with identified DICOMs without authorization or anonymization.
- Interpreting scans diagnostically without medical training — this skill does not teach that.
