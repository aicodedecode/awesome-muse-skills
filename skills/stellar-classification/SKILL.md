---
name: stellar-classification
description: Classifying stars — spectral types, luminosity classes, color–magnitude diagrams, and deriving stellar parameters.
category: scientific
---

## Overview

Stellar classification sorts stars by the physics written in their
spectra: temperature (OBAFGKM), luminosity class (I–V), and composition.
This skill covers the MK system, reading color–magnitude and Hertzsprung–
Russell diagrams, deriving T_eff/log g/metallicity, and using standard
candles and isochrones to get distances and ages.

## When to use

- Classifying a star from its spectrum or colors
- Deriving stellar parameters (T_eff, log g, [Fe/H]) for exoplanet hosts or population studies
- Reading CMDs/HR diagrams: identifying main sequence, giants, white dwarfs, turnoff age
- Estimating distances via spectroscopic parallax or standard candles
- Dating a stellar population with isochrone fitting

## Core concepts

- **Spectral sequence OBAFGKM:** temperature decreasing (~30,000 K to ~3,000 K), diagnosed by line ratios — He II (O), He I (B), Balmer maximum (A), Ca H&K + metals (G/K), TiO molecules (M). Subtypes 0–9 subdivide each class.
- **Luminosity classes I–VII:** supergiants → giants → subgiants → dwarfs (V) → subdwarfs → white dwarfs — diagnosed by line widths (pressure broadening: dwarfs have broad lines, giants narrow) at the same temperature.
- **HR diagram / CMD:** luminosity (or absolute magnitude) vs temperature (or color) — the main sequence (core H burning), red-giant branch, horizontal branch, white-dwarf cooling sequence; position encodes mass, age, and evolutionary state.
- **Stellar parameters:** T_eff (excitation equilibrium, colors, line-depth ratios), log g (ionization balance Fe I/Fe II, pressure-broadened wings), [Fe/H] (weak Fe lines vs solar) — determined iteratively to mutual consistency.
- **Isochrones:** model loci of constant age in the CMD — fit cluster turnoff and giant branch to get age, distance, and reddening simultaneously (with degeneracies acknowledged).
- **Standard candles:** Cepheids (period–luminosity), RR Lyrae, tip of the red-giant branch (TRGB), red clump — each with calibrated absolute magnitudes and metallicity dependencies.

- **Chemical tagging:** detailed abundance patterns ([X/Fe] for many elements) fingerprint birth clusters — stars born together share chemistry even after dispersing; the basis of Galactic archaeology.
- **Asteroseismology:** oscillation frequencies probe interiors directly — scaling relations give masses and radii to a few percent, and ages far better than isochrones for field stars; Kepler/TESS made this mainstream.
- **White-dwarf cosmochronology:** cooling is well-understood physics — the white-dwarf luminosity function dates stellar populations independently of main-sequence turnoff fitting.

## Practical workflow

### 1. Classify from a spectrum

1. Estimate temperature first: Balmer-line strength (peaks at A), He lines (O/B), molecular bands (M), Ca triplet region for FGK.
2. Determine luminosity class: compare line widths at fixed temperature — narrow = giant, broad = dwarf; check gravity-sensitive features (Mg b triplet wings, Sr II 4077).
3. Note peculiarities: emission lines, chemical peculiarity (Am, Ap), rapid rotation (broadened everything), binarity (double lines) — classify the star you have, not the template.

### 2. Derive parameters quantitatively

1. Measure EWs of Fe I/Fe II lines spanning excitation potential and strength.
2. Iterate: T_eff from excitation equilibrium (no trend of abundance with χ), log g from ionization balance (Fe I = Fe II), microturbulence ξ from no trend with EW, [Fe/H] as the mean.
3. Cross-check with independent methods: photometric T_eff (IRFM/colors), Gaia parallax + isochrone log g — disagreement locates systematic errors.

### 3. Read the population

1. Build the CMD (apparent or absolute magnitude vs color); correct for reddening (dust maps, or fit E(B−V) with the isochrone).
2. Identify sequences: main sequence, turnoff (age indicator — brighter turnoff = younger), red-giant branch, horizontal branch/clump.
3. Fit isochrones: vary age, metallicity, distance, reddening; report the degeneracy (age–metallicity–distance trade-offs are real).

### 4. Distances and ages

1. **Spectroscopic parallax:** spectral type + luminosity class → absolute magnitude → distance modulus — good to ~20–30% with care.
2. **Gaia parallaxes:** use directly where precise (nearby); mind the parallax zero-point and Lutz–Kelker-type biases for marginal measurements.
3. **Cluster ages:** main-sequence turnoff fitting (with metallicity from spectra); white-dwarf cooling sequence as an independent clock.

### 5. Determine a star's age

1. Choose the clock for the star: isochrone fitting (clusters, turnoff stars), gyrochronology (rotation–age for FGK dwarfs, calibrated), asteroseismology (best for field stars with data), white-dwarf cooling (old populations).
2. Propagate the real uncertainties: metallicity errors dominate isochrone ages; gyrochronology needs calibrated relations for the spectral type.
3. Cross-check with a second clock where possible — discrepant ages reveal systematics (unresolved binarity is the usual suspect).

### 6. Quick-reference checklist

- [ ] Temperature estimated before luminosity class
- [ ] Reddening estimated and corrected (E(B−V))
- [ ] Unresolved binarity considered (brightening + reddening bias)
- [ ] Two independent gravity indicators for luminosity class
- [ ] Templates matched in metallicity/activity, not just temperature
- [ ] Isochrone fits report joint age–metallicity–distance–reddening uncertainties
- [ ] Gaia parallax zero-point applied where relevant
- [ ] Peculiarities (emission, rotation, chemical) noted explicitly

## Common pitfalls

- **Reddening blindness:** dust reddens and dims — uncorrected colors give wrong temperatures and distances; always estimate E(B−V).
- **Unresolved binarity:** a companion brightens and reddens the system — photometric classifications of binaries are systematically off.
- **Template mismatch:** classifying metal-poor or active stars against solar-metallicity templates biases T_eff and log g.
- **Isochrone degeneracy:** age, metallicity, distance, and reddening trade off — quote joint uncertainties, not single best fits.
- **Single-line luminosity classes:** one gravity indicator is suggestive; two independent ones are convincing.
- **Ignoring rotation:** rapid rotators have broadened lines that mimic high gravity or peculiarity — check v sin i before classifying oddballs.
- **Age from a single isochrone fit:** the age–metallicity–distance degeneracy means single-method ages carry hidden systematics — always state the metallicity assumption.
- **Activity-age confusion:** young active stars mimic peculiar classifications — check activity indicators before invoking exotic explanations.
