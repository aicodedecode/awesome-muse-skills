---
name: spectroscopy-basics
description: Astronomical spectroscopy — line identification, redshift measurement, equivalent widths, and abundance basics.
category: scientific
---

## Overview

Spectra spread light into wavelength, revealing composition, motion,
temperature, and density through lines. This skill covers the practical
spectroscopy chain: wavelength calibration, line identification,
measuring redshifts and equivalent widths, and the first steps of
abundance analysis — for stars, galaxies, and nebulae.

## When to use

- Measuring a redshift from galaxy or quasar emission/absorption lines
- Identifying lines in a stellar or nebular spectrum
- Measuring equivalent widths and line ratios for physical diagnostics
- Estimating stellar metallicity or nebular abundances
- Reducing long-slit or fiber spectra: calibration, sky subtraction, extraction

## Core concepts

- **Line formation:** emission lines (hot gas, recombination/collisional excitation) vs absorption lines (cooler gas against a continuum) — the same transition appears in emission or absorption depending on geometry.
- **Doppler shift:** Δλ/λ = v/c (non-relativistic) — redshifts measure recession velocity/expansion; line widths measure velocity dispersion (thermal + turbulent + rotational).
- **Equivalent width (EW):** the wavelength-integrated line strength, continuum-normalized — the fundamental observable for abundance work, robust against flux-calibration errors.
- **Curve of growth:** EW vs column density — linear (weak lines) → flat (saturated) → damping wings; saturated lines lie about abundances — use weak lines or damping wings.
- **Ionization diagnostics:** line ratios (BPT diagram: [O III]/Hβ vs [N II]/Hα) separate star formation from AGN/shocks — ratios of nearby lines cancel reddening and calibration errors.
- **Resolution:** R = λ/Δλ — low (R~1000: redshifts, coarse abundances), medium (R~5000–10000: kinematics), high (R>20000: detailed abundances, isotope ratios). Match resolution to the question.

- **Telluric correction:** Earth's atmosphere imprints its own absorption (H₂O, O₂, CO₂ bands) — correct with standard stars or atmospheric models (molecfit); uncorrected tellurics fake astrophysical features.
- **Spectral resolution vs S/N trade:** higher resolution spreads photons over more pixels — for faint sources, lower resolution at higher S/N per pixel often detects more; match resolution to the science, not the instrument's maximum.
- **Flux calibration limits:** slit losses, atmospheric dispersion, and variable seeing make absolute spectrophotometry uncertain at the 5–10% level — line ratios and equivalent widths are more robust than absolute fluxes.

## Practical workflow

### 1. Reduce the spectrum

1. **Wavelength calibration:** arc-lamp lines (or sky lines) → polynomial solution; verify with known sky lines — residuals should be ≪ resolution element.
2. **Sky subtraction:** nod-and-shuffle, offset sky fibers, or model sky — residuals at bright OH lines are the eternal enemy of near-IR spectroscopy.
3. **Extraction and flux calibration:** optimal (Horne) extraction for faint sources; spectrophotometric standard stars for fluxing — note that EW work doesn't need fluxing, only continuum normalization.

### 2. Identify lines and measure redshift

1. Mark the strongest features first (Hα, [O III] 5007, Ca H&K, Mg b, Na D, Lyα depending on type/redshift).
2. Cross-correlate against templates (stars, galaxies) for robust redshifts; verify visually — template mismatch at low S/N invents redshifts.
3. Fit line centers with Gaussians (or Voigt for strong lines); report redshift with uncertainty from the fit, not from eyeballing.

### 3. Measure lines

1. Define continuum windows flanking each line (Lick-index style bandpasses are the standardized approach for galaxies).
2. Fit Gaussian profiles (multiple components for blends/outflows); integrate for EW; propagate continuum-placement uncertainty — it dominates for weak lines.
3. Correct for underlying stellar absorption in emission-line work (Hβ absorption eats Hβ emission — model the stellar continuum first).

### 4. Derive physics

1. **Nebulae:** electron temperature from auroral/nebular ratios ([O III] 4363/5007), density from [S II] 6717/6731 doublet, then ionic abundances — the direct method; strong-line calibrations (R23, O3N2) when auroral lines are undetected, with stated calibration uncertainty.
2. **Stars:** excitation/ionization equilibrium of Fe I/Fe II for T_eff/log g; microturbulence from EW trends — iterate to consistency.
3. Always state the solar reference scale and atomic data sources — abundances are relative to both.

### 5. Plan a spectroscopic observation

1. Compute the required S/N for the measurement: equivalent-width precision scales as (S/N)⁻¹ per resolution element — work backward from the science requirement to exposure time with the exposure-time calculator.
2. Choose the setup: wavelength coverage must include both the lines of interest and continuum/feature-free regions for normalization; resolution must resolve the narrowest feature you need.
3. Plan calibrations: arcs (wavelength), flats (pixel response), standards (flux/telluric) — typically 20–30% overhead; skipping them to "save time" wastes the science time.

### 6. Quick-reference checklist

- [ ] Wavelength solution verified against sky lines (residuals ≪ resolution element)
- [ ] Sky subtraction quality checked at bright OH lines
- [ ] Multiple lines (or template match) required for redshifts
- [ ] Continuum windows documented; EW sensitivity tested
- [ ] Saturated lines excluded from abundance work
- [ ] Stellar absorption corrected before emission-line ratios
- [ ] Resolution deconvolved before quoting velocity dispersions
- [ ] Solar scale and atomic data sources stated

## Common pitfalls

- **Saturated lines for abundances:** flat-curve-of-growth lines give lower limits, not measurements — find weak lines.
- **Sky-line residuals as features:** near-IR "detections" at OH wavelengths are guilty until proven innocent — check the sky spectrum.
- **Ignoring stellar absorption:** emission-line ratios without stellar-continuum subtraction are systematically biased.
- **Single-line redshifts:** one line is a guess (could be a different transition) — require multiple lines or a template match.
- **Resolution–linewidth confusion:** unresolved lines have instrumental widths — deconvolve before quoting velocity dispersions.
- **Strong-line calibration shopping:** different calibrations disagree by 0.3–0.7 dex — pick one, justify it, and state the systematic.
- **Blended lines treated as single:** unresolved blends bias centroids, widths, and abundances — check line lists for blends at your resolution before measuring.
- **Continuum placement bias:** systematically high/low continuum placement biases every equivalent width — use consistent, documented windows and test sensitivity.
