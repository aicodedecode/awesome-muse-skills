---
name: microscopy-basics
description: Light microscopy fundamentals — brightfield, fluorescence, confocal, image acquisition, and quantitative analysis.
category: scientific
---

## Overview

microscopy-basics covers practical light microscopy for biology: choosing modalities
(brightfield, phase, DIC, widefield fluorescence, confocal), acquiring publication-quality
images, and doing honest quantitative image analysis. It emphasizes the physics that constrains
what images mean — resolution limits, photobleaching, and the processing steps that turn data
into illustrations.

## When to use

- Choosing modality: brightfield vs fluorescence vs confocal for the question.
- Fluorescence imaging: fluorophore selection, filter sets, exposure, controls.
- Confocal: pinhole, z-stacks, Nyquist sampling.
- Image acquisition: avoiding saturation, photobleaching minimization, tiling.
- Quantitative analysis: cell counting, colocalization, intensity measurements in Fiji/ImageJ.
- Figure preparation: ethical image processing, scale bars, LUTs.

## Core concepts

- **Resolution limits.** Abbe diffraction limit: ~200 nm lateral, ~500 nm axial for visible
  light. Pixel size should satisfy Nyquist (2-3x oversampling of the resolution limit).
  Magnification beyond resolution is empty magnification — a 100x image of a 500-nm structure
  shows no more detail than a properly sampled 40x.
- **Contrast methods.** Brightfield (stained samples), phase contrast (unstained cells —
  halo artifacts), DIC (pseudo-3D relief, great for unstained specimens, no fluorescence
  compatibility issues). Choose by sample, not habit.
- **Fluorescence essentials.** Match fluorophores to filter sets/lasers (check excitation/
  emission overlap); controls: unstained (autofluorescence), single-stains (bleed-through),
  secondary-only (non-specific binding). Bleed-through is optical — verify with single-stain
  controls, don't assume software unmixing fixes bad panel design.
- **Exposure discipline.** Expose to fill the dynamic range without saturation (saturated
  pixels are not data); keep exposure/laser power constant across compared conditions;
  minimize illumination (photobleaching destroys fluorophores; phototoxicity kills live
  cells). For quantification, identical acquisition settings are non-negotiable.
- **Confocal.** Pinhole rejects out-of-focus light → optical sectioning; pinhole at 1 Airy
  unit is the standard trade-off; z-step at Nyquist (∼0.5× axial resolution); match
  refractive index (oil/water/glycerol objectives to mounting medium) or suffer spherical
  aberration. Confocal is slower and more phototoxic than widefield — use it when you need
  sectioning, not by default.
- **Live imaging.** Environmental control (37°C, CO₂, humidity); low light doses; sufficient
  temporal resolution without photodamage; drift correction. Cells imaged to death produce
  beautiful artifacts.
- **Quantitative analysis (Fiji/ImageJ).** Segment (thresholding, watershed, or trained
  classifiers — ilastik/Cellpose for hard cases); measure on raw data (never on
  contrast-adjusted copies); count with unbiased rules; colocalization via Pearson/Manders
  with Costes randomization controls (not just yellow overlap). Analyze blinded.
- **Ethical image processing.** Linear adjustments (brightness/contrast) applied equally to
  whole images and controls are fine; selective enhancement, cloning, or splicing without
  disclosure is misconduct. Keep raw files; document processing; include scale bars (not
  "40x" — magnification is meaningless after resizing).

## Practical workflow

1. **Choose modality.** Question → required resolution/sectioning → simplest adequate method.
2. **Prepare.** Appropriate fixation (PFA vs methanol — epitope-dependent), mounting medium
   matched to objective, #1.5 coverslips (0.17 mm — objectives are corrected for these).
3. **Controls.** Unstained, single-stains, secondary-only — every session.
4. **Acquire.** Nyquist sampling, no saturation, constant settings across comparisons,
   minimal light dose.
5. **Analyze.** On raw data, blinded, with validated segmentation; appropriate statistics
   (nested data — fields within samples — need mixed models, not pooled t-tests).
6. **Present.** Scale bars, identical processing of compared images, raw data archived,
   processing documented.

Example (Fiji macro sketch):
```
run("Set Measurements...", "area mean integrated redirect=None decimal=3");
setAutoThreshold("Otsu dark"); run("Analyze Particles...", "size=50-Infinity show=Masks");
```

## Common pitfalls

- Saturated pixels quantified as real intensities.
- Different acquisition settings between compared conditions.
- Colocalization by "yellow overlap" without coefficients and controls.
- Selective contrast adjustment (enhancing the experimental image only).
- Missing scale bars / reporting magnification instead.
- Phototoxicity artifacts interpreted as biology.
- Pseudoreplication: treating 500 cells from 3 dishes as n=500.
