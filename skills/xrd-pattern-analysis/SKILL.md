---
name: xrd-pattern-analysis
description: Powder X-ray diffraction from measurement to meaning — phase ID, lattice parameters, crystallite size, and Rietveld refinement.
category: scientific
---

## Overview

Powder XRD turns a polycrystalline sample into a fingerprint of its crystal
structure. This skill covers the full pipeline: collecting good data,
identifying phases, extracting lattice parameters and crystallite size, and
performing Rietveld refinement — with the data-quality discipline that makes
the difference between a publishable pattern and a pretty picture.

## When to use

- Identifying unknown phases in a synthesis product (search–match against PDF/ICSD databases)
- Tracking lattice parameter shifts from doping, strain, or thermal expansion
- Estimating crystallite size and microstrain from peak broadening
- Quantifying phase mixtures via Rietveld refinement
- Monitoring reactions in situ (variable temperature, gas atmosphere)

## Core concepts

- **Bragg's law (nλ = 2d sinθ):** peak positions encode d-spacings; everything quantitative starts here. A systematic shift means the lattice changed (composition, temperature, stress).
- **Structure factor:** peak intensities encode which atoms sit where — the basis of structure determination and Rietveld refinement.
- **Peak broadening:** three contributors — instrumental, crystallite size (Scherrer: β = Kλ/(L cosθ)), and microstrain (Williamson–Hall separates size from strain by their different θ-dependence).
- **Systematic absences:** missing reflections fingerprint the lattice centering and glide/screw symmetry (e.g., FCC shows only all-even or all-odd hkl).
- **Rietveld refinement:** fits the entire pattern (background, peak shapes, structure model) by least squares; the difference plot, not R_wp alone, judges the fit.
- **Preferred orientation:** plate/needle crystallites align in the holder, distorting intensities — a sample-prep artifact, not a structural feature.

- **Intensity corrections:** Lorentz-polarization correction is mandatory; microabsorption (Brindley) matters when phases differ strongly in absorption — quantitative phase analysis without absorption correction is only approximate.
- **Anisotropic broadening:** plate- or needle-shaped crystallites and directional strain broaden different (hkl) differently — model with anisotropic terms rather than forcing an isotropic size that fits nothing well.
- **Pair distribution function (PDF):** the Fourier transform of total scattering gives real-space atom-pair distances — the structural tool for amorphous and nanoscale materials where Bragg analysis fails.

## Practical workflow

### 1. Collect data worth analyzing

1. Grind to a fine, uniform powder; pack flat without pressing texture into it (back-loading or side-loading holders help).
2. Choose scan range and step: cover at least 10–80° 2θ (Cu Kα) with steps ≤ 1/5 of the narrowest peak width; count long enough that the weakest peak of interest is well above background.
3. Run a standard (e.g., NIST Si or LaB₆) periodically to verify zero shift and instrumental broadening.
4. Note the radiation (Cu Kα vs Mo/Co), slit settings, and sample holder — fluorescence (e.g., Fe/Co samples with Cu radiation) ruins data.

### 2. Phase identification

1. Strip Kα₂ / correct zero shift, then search–match peak positions (positions first, intensities second — texture distorts intensities).
2. Confirm with the full pattern, not just the three strongest lines; check for unindexed peaks (impurities, new phases).
3. For mixtures, identify the major phase first, then hunt residuals.

### 3. Extract numbers

1. **Lattice parameters:** least-squares fit of ≥6 well-resolved peak positions; report with estimated standard deviations.
2. **Crystallite size:** Scherrer on an isolated peak after subtracting instrumental broadening; cross-check with Williamson–Hall for strain contribution.
3. **Phase fractions:** Rietveld with refined scale factors — needs good data and correct structure models for every phase present.

### 4. Rietveld refinement sequence

1. Fit background and scale, then lattice parameters, then peak-shape/profile terms.
2. Refine atomic positions, then occupancies and displacement parameters — in that order, releasing parameters gradually.
3. Inspect the difference curve at every step; a structured residual means the model is wrong, not the data.
4. Report R_wp, R_exp, χ², and the refined parameters with uncertainties; never refine more parameters than the data supports.

### 5. Do a proper quantitative phase analysis

1. Add an internal standard (e.g., 10 wt% corundum) to quantify amorphous content — Rietveld normalizes crystalline phases to 100%, hiding glass.
2. Refine all phases with correct structure models; validate refined weight fractions against known spike compositions.
3. Report refinement uncertainties and cross-check with an independent method (chemical analysis, NMR, or Mössbauer).

### 6. Quick-reference checklist

- [ ] Radiation type and instrument configuration verified in the data header
- [ ] Zero shift / sample displacement corrected (standard or internal Si)
- [ ] Kα₂ stripped or modeled; tube artifacts identified
- [ ] Preferred orientation assessed and addressed in sample prep or model
- [ ] Instrumental broadening subtracted before Scherrer analysis
- [ ] Phase ID confirmed on full pattern, not just strongest lines
- [ ] Rietveld difference plot inspected at every refinement stage
- [ ] Amorphous content quantified with an internal standard where relevant

## Common pitfalls

- **Preferred orientation:** pressing the powder flat aligns plates — intensities lie; re-prep or model it (March–Dollase) rather than believing it.
- **Misidentifying the Kβ or W contamination lines:** know your tube's artifacts before claiming new peaks.
- **Scherrer on strained or textured samples:** broadening has three sources; attributing it all to size is the most common XRD error.
- **Rietveld over-refinement:** refining occupancies and ADPs simultaneously on mediocre data produces precise-looking nonsense.
- **Ignoring amorphous content:** a broad hump under the pattern is real material — quantify it with an internal standard (spiking) if it matters.
- **Wrong wavelength in the software:** a Cu/Mo mixup shifts every d-spacing — verify the instrument configuration in the data file header.
- **Sample-displacement error:** a mispositioned sample shifts peaks systematically — refine the zero shift or use an internal standard (Si) rather than absorbing the error into lattice parameters.
- **Texture modeled as structure:** strong preferred orientation refined through atomic parameters instead of a texture model produces chemically absurd occupancies — model the texture explicitly.
