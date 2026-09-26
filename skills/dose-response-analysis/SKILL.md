---
name: dose-response-analysis
description: Dose-response modeling — EC50 estimation, curve fitting, synergy analysis, and benchmark-dose methods.
category: scientific
---

## Overview

dose-response-analysis covers the quantitative relationship between dose (or concentration) and
effect: fitting sigmoidal curves, estimating EC50/IC50 with proper uncertainty, testing drug
combinations for synergy, and benchmark-dose modeling for toxicology. It applies from cell
culture to clinical trials — the math is the same, the interpretation differs.

## When to use

- Fitting concentration-response curves: EC50/IC50, Emax, Hill slope.
- Comparing potencies between compounds or conditions.
- Drug-combination synergy: Bliss, Loewe, Chou-Talalay, ZIP.
- Toxicology: benchmark dose (BMD) modeling, NOAEL vs BMD.
- Clinical dose-response: Emax models on trial data.
- Assay QC: curve-fit quality, outlier handling, plate effects.

## Core concepts

- **The 4-parameter logistic (Hill) model.** E = Bottom + (Top−Bottom)/(1 + (EC50/C)^HillSlope).
  The workhorse. Fit all four parameters when data support it; fix Top/Bottom to controls when
  they don't. The Hill slope carries meaning (steep = cooperative/threshold-like) — don't fix
  it to 1 by default without checking.
- **EC50/IC50 done right.** Report with 95% CIs (profile likelihood or bootstrap — not just
  ±SE from the fit). EC50s are log-normally distributed: average replicates in log space
  (geometric mean), never arithmetic. An EC50 without a CI is a rumor.
- **Design the concentration range.** Span at least 2-3 log units around the expected EC50,
  with points on both plateaus — EC50 estimated without a top plateau is extrapolation. Use
  half-log or third-log spacing; 8-10 concentrations in duplicate/triplicate beats 5 in
  sextuplicate.
- **Normalization.** Normalize to plate controls (0% and 100% effect) before fitting, and check
  control stability across plates. Edge effects and drift across plates are real — randomize
  compound placement or include inter-plate controls.
- **Comparing curves.** Don't compare EC50 point estimates — compare full curves (extra
  sum-of-squares F-test) or EC50 ratios with CIs. Ask whether Top, Bottom, or slope differ too;
  a "potency shift" with a changed Emax is a different pharmacology.
- **Synergy analysis.** Bliss independence (probabilistic), Loewe additivity (dose-equivalence),
  Chou-Talalay combination index, ZIP (zero interaction potency). They disagree with each other
  — state the model, show the full combination matrix (not just one ratio), and validate
  synergy hits in follow-up. Most "synergy" is additive effect plus noise.
- **Benchmark dose (BMD).** For toxicology: the dose causing a prespecified effect size
  (e.g. BMD10), with lower confidence limit BMDL as the point of departure. Superior to NOAEL
  (which depends on dose spacing and ignores the curve shape). Fit multiple models; average or
  select by fit.
- **Clinical dose-response.** Emax models on trial endpoints justify dose selection; MCP-Mod
  combines multiple-comparison and modeling for Phase II dose finding. A flat dose-response with
  efficacy at all doses means the doses were too high, not that dose doesn't matter.

## Practical workflow

1. **Design.** Concentration range spanning both plateaus; log spacing; replicates; plate
   controls; randomized layout.
2. **QC.** Control CVs, Z′-factor for assays, drift/edge checks, outlier review (documented,
   not silent).
3. **Fit.** 4PL (or 3PL with fixed asymptotes when justified); inspect residuals; check CI
   width — wide CIs mean redesign, not "non-significant."
4. **Compare.** Full-curve comparisons with CIs on ratios; report all curve parameters.
5. **Combinations.** Full matrix design; compute synergy under a stated model; visualize as
   synergy landscapes; confirm top hits independently.
6. **Report.** EC50/IC50 with 95% CIs (geometric means across replicates), Hill slopes,
   normalization method, and the raw data.

Example (Python sketch):
```python
from scipy.optimize import curve_fit
import numpy as np
def hill(c, bottom, top, ec50, h):
    return bottom + (top - bottom) / (1 + (ec50 / c) ** h)
popt, pcov = curve_fit(hill, conc, response, p0=[0, 100, 1e-6, 1])
# bootstrap CIs; geometric mean of replicate EC50s
```

## Common pitfalls

- EC50 without plateaus (extrapolated, not estimated).
- Arithmetic means of EC50s (use geometric).
- Comparing point estimates without CIs.
- Synergy claimed from a single combination ratio under one model.
- Silent outlier removal that "improves" fits.
- Plate effects and edge effects unaddressed.
- NOAEL treated as a biological threshold rather than a study-design artifact.
