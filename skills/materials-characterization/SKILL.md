---
name: materials-characterization
description: Choosing and combining characterization techniques — diffraction, microscopy, spectroscopy, and thermal methods — to fully describe a material.
category: scientific
---

## Overview

No single technique fully characterizes a material. This skill is a
decision framework: given a question (phase purity? composition?
microstructure? surface chemistry?), pick the right combination of
diffraction, microscopy, spectroscopy, and thermal/electrical methods,
prepare samples correctly, and interpret results without overclaiming.

## When to use

- A new material is synthesized: prove what it is, how pure it is, and what it looks like
- A device or batch fails: root-cause analysis across structure, composition, and morphology
- Comparing samples: establish which differences are real and which are artifacts
- Writing the characterization section of a paper or report with appropriate claims
- Deciding whether an expensive technique (TEM, synchrotron, APT) is actually needed

## Core concepts

- **Length scales:** XRD probes the average crystal structure (bulk, nm-scale coherence); SEM shows morphology (µm); TEM reaches atomic resolution but on a tiny, possibly unrepresentative volume. Match the technique to the scale of the question.
- **Surface vs bulk:** XPS and Auger see the top ~5–10 nm; XRD and bulk chemical analysis see the whole sample. A "pure" XRD pattern can hide a completely different surface.
- **Detection limits:** XRD misses amorphous phases and <~2–5 wt% minority phases; EDS is semi-quantitative for light elements; always state what a null result actually rules out.
- **Complementary pairs:** structure (XRD) + composition (EDS/ICP) + morphology (SEM) + thermal behavior (TGA/DSC) covers most new materials; spectroscopy (Raman/IR/XPS) adds bonding and surface state.
- **Quantitative vs qualitative:** peak positions are precise; peak intensities in XRD depend on texture, absorption, and instrument geometry — Rietveld refinement is needed for real quantification.

- **Depth profiling:** angle-resolved XPS, SIMS sputter profiles, cross-sectional TEM — when surface and bulk disagree, profile the transition instead of arguing about which measurement is "right".
- **In situ and operando measurement:** observing during heating, biasing, or reaction — ex situ snapshots miss transient states; the working material often differs from the as-made one.
- **Microstructure statistics:** grain-size and particle-size distributions need real counts (n ≥ 300 particles) — report histograms, not single "average" values from a glance.

## Practical workflow

### 1. Start with the cheap, fast, informative trio

1. **Powder XRD:** phase identification against databases (PDF/ICSD); check for peak shifts (doping/strain), broadening (small crystallites — Scherrer), and amorphous humps.
2. **SEM + EDS:** morphology, particle size, elemental mapping; look for inhomogeneity and secondary phases the XRD missed.
3. **TGA/DSC:** thermal stability, decomposition steps, phase transitions, solvent/water content.

### 2. Answer specific questions with targeted tools

| Question | Technique |
|---|---|
| Atomic structure / defects | TEM (HRTEM, STEM-EELS) |
| Surface chemistry / oxidation states | XPS |
| Local bonding / disorder | Raman, solid-state NMR, PDF analysis |
| Trace composition | ICP-MS/OES |
| Porosity / surface area | BET gas sorption |
| Magnetic/electronic state | SQUID/VSM, transport, UV-Vis |

### 3. Sample preparation discipline

1. Grind powders to avoid preferred orientation in XRD; use a zero-background holder for small quantities.
2. For SEM, ensure conductivity (sputter-coat insulators) and avoid charging artifacts misread as features.
3. For TEM, the thinning/preparation can alter the sample — compare with bulk measurements.
4. Store air-sensitive samples properly; an oxidized surface measured by XPS tells you about your handling, not your material.

### 4. Report honestly

1. State instrument, conditions, and calibration for every technique.
2. Distinguish "not detected" (with the technique's limit) from "absent."
3. Show raw data alongside fits (Rietveld, XPS deconvolution) — hidden residuals hide bad models.

### 5. Correlate across techniques (the closure test)

1. Tabulate each technique's answer to the same question (e.g., particle size from XRD, TEM, BET, DLS) — they probe different moments of the distribution and should bracket each other, not match exactly.
2. Investigate systematic disagreements: XRD size << TEM size means polycrystalline aggregates or amorphous shells.
3. Present the multi-technique comparison table in the paper — it is the most convincing characterization figure there is.

### 6. Quick-reference checklist

- [ ] XRD + SEM/EDS + thermal analysis completed as the baseline trio
- [ ] Surface-sensitive (XPS) vs bulk techniques compared, not conflated
- [ ] Detection limits stated for every "not detected" claim
- [ ] Sample preparation documented (grinding, coating, atmosphere)
- [ ] TEM observations backed by bulk statistics, not single images
- [ ] Raw data shown alongside every fit (Rietveld, XPS deconvolution)
- [ ] Instrument, conditions, and calibration recorded per technique
- [ ] Beam-damage checks done for sensitive samples

## Common pitfalls

- **XRD-only characterization:** a clean diffraction pattern does not prove purity — amorphous and minor phases are invisible.
- **EDS as exact composition:** standardless EDS is ±5–10% at best and unreliable for light elements; use ICP or WDS for numbers you will publish.
- **TEM sampling bias:** a beautiful atomic image of one grain says nothing about the other 99.9% of the sample.
- **Overfitting XPS:** every extra peak component needs a physical justification; unconstrained deconvolution can "find" any oxidation state.
- **Ignoring beam damage:** electron and X-ray beams modify sensitive samples (polymers, halides, MOFs) — check for damage with dose series.
- **Forgetting the substrate/contamination:** peaks from the holder, carbon tape, or adsorbed water routinely get published as discoveries.
- **Charging shifts in XPS/SEM:** sample charging shifts binding energies and distorts images — reference XPS to adventitious C 1s (284.8 eV) or use a flood gun; coat insulators for SEM.
- **EDS on rough surfaces:** take-off-angle variations corrupt standardless quantification — use flat, polished regions for any number you will publish.
