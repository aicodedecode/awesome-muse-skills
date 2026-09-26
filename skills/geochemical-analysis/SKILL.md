---
name: geochemical-analysis
description: Geochemical data done right — major/trace elements, isotopes, QA/QC, and avoiding closure and normalization traps.
category: scientific
---

## Overview

Geochemistry reads Earth's history in elemental and isotopic compositions.
This skill covers the analytical methods (XRF, ICP-MS, TIMS/MC-ICP-MS),
data-quality discipline (standards, blanks, duplicates), the compositional-
data statistics that whole-rock analyses demand, and the classic
interpretive diagrams — used correctly.

## When to use

- Planning a geochemical sampling and analysis campaign on a budget
- Interpreting major/trace element and isotope data for petrogenesis or provenance
- Reviewing geochemical data quality in a paper or lab report
- Choosing between XRF, ICP-MS, EPMA, or laser-ablation for a question
- Avoiding the statistical traps of percentage data (closure, spurious correlation)

## Core concepts

- **Analytical hierarchy:** XRF (majors, fast, cheap, non-destructive) → ICP-MS/OES (traces, needs digestion) → EPMA (in-situ majors, µm scale) → LA-ICP-MS (in-situ traces) → TIMS/MC-ICP-MS (high-precision isotopes). Match the tool to the required precision and spatial scale.
- **Isotope systems:** radiogenic (Sr-Nd-Pb-Hf: source fingerprinting, dating via isochrons) vs stable (O, C, S, Li: fractionation processes, temperatures, fluid sources). Each system answers specific questions — choose deliberately.
- **Compositional data:** whole-rock analyses sum to ~100% (closure) — raw correlations between oxides are partly spurious. Use log-ratio transforms (CLR/ALR) for rigorous statistics.
- **Normalization:** REE/chondrite or primitive-mantle normalized spider diagrams reveal fractionation patterns; the normalizing values are conventions — cite them.
- **QA/QC:** certified reference materials (CRMs) in every batch, blanks, duplicates — accuracy (bias vs CRM) and precision (duplicate RSD) reported separately.
- **Detection limits:** below-detection values are censored data, not zeros — substituting zero or half-DL biases statistics; use proper censored-data methods.

- **Isotope dilution:** spiking with a known enriched isotope gives the most accurate concentration measurements in mass spectrometry — the gold standard for precise elemental analysis, at the cost of spike calibration effort.
- **Matrix effects in plasma MS:** easily ionized elements suppress analyte signals; internal standards (In, Re, Bi) and matrix-matched calibration correct drift — standardless "semiquant" scans are reconnaissance, not data.
- **Laser-ablation fractionation:** elemental fractionation during ablation (volatile vs refractory) biases LA-ICP-MS — matrix-matched standards and downhole fractionation correction are mandatory for accuracy.

## Practical workflow

### 1. Design the campaign

1. Define the question first: source fingerprinting needs isotopes; process modeling needs full majors + traces; mapping needs dense cheap analyses (pXRF screening, lab confirmation).
2. Budget for QA: ~10–15% of analyses should be CRMs, blanks, and duplicates — non-negotiable.
3. Collect with contamination control: steel hammers add Fe/Cr/Ni; weathering rinds shift mobile elements — sample fresh interiors and record the protocol.

### 2. Choose methods and labs

1. Majors by XRF (fused beads for accuracy); traces/REE by ICP-MS after full digestion (HF for zircons — incomplete digestion loses Zr/Hf/REE systematically).
2. For isotopes, check required precision vs the expected signal: ±0.00001 on ⁸⁷Sr/⁸⁶Sr needs TIMS/MC-ICP-MS, not quadrupole ICP-MS.
3. Ask the lab for its long-term CRM reproducibility, not just in-run precision.

### 3. Validate the data

1. Check totals (98.5–101.5% for XRF majors); low totals mean volatiles, Fe-oxidation-state issues, or missing components — investigate, don't renormalize blindly.
2. Plot CRMs on control charts across batches; reject or flag batches that drift.
3. Screen for alteration: LOI, mobile elements (K, Rb, Ba), and Ce anomalies flag samples that no longer record magmatic compositions.

### 4. Interpret

1. Use immobile elements (Ti, Zr, Nb, Y, REE) for altered or metamorphosed rocks — mobile elements lie.
2. Read normalized diagrams for pattern shape (slopes, anomalies like Eu/Eu*), not absolute heights.
3. Model quantitatively where possible: batch melting/fractional crystallization equations constrain source and process — eyeballing trends is a hypothesis, modeling is a test.
4. Apply log-ratio statistics for any correlation/regression/PCA on compositional data.

### 5. Design an isotope campaign

1. Choose the system for the question: Sr-Nd-Pb-Hf for source fingerprinting; O-H for fluid sources; Li-Mg-Ca for weathering/carbonate processes — each has characteristic precision requirements and costs.
2. Budget for chemistry: column separations determine data quality more than instrument time does; include total-procedural blanks in every batch.
3. Report in the community's units (epsilon, delta, per-mil) with the standard used — isotope data without stated standards are uninterpretable.

### 6. Quick-reference checklist

- [ ] Method matched to required precision and spatial scale
- [ ] Matrix-matched CRMs in every batch; blanks and duplicates included
- [ ] Totals checked (98.5–101.5% for XRF majors); low totals investigated
- [ ] Alteration screened (LOI, mobile elements) before petrogenetic interpretation
- [ ] Immobile elements used for altered/metamorphosed rocks
- [ ] Below-detection values treated as censored, not zero
- [ ] Log-ratio transforms applied for statistics on compositional data
- [ ] Normalizing values and isotope standards cited

## Common pitfalls

- **Closure correlations:** plotting SiO₂ vs MgO raw percentages manufactures trends — transform or use ratios with a common denominator.
- **Altered samples in magmatic diagrams:** TAS and AFM diagrams assume fresh compositions; altered rocks plot in fantasy fields.
- **Below-detection substitution:** replacing <DL with 0 or DL/2 then computing means/ratios — use censored statistics or report as limits.
- **CRM mismatch:** validating basalt analyses with a granite standard — matrix-match CRMs to samples.
- **Incomplete digestion:** "missing" Zr/Hf/REE usually means undigested zircon, not geology.
- **Isotope precision theater:** quoting 6 decimal places from a method with 5-decimal reproducibility — report what the method earns.
- **Contamination from sample prep:** tungsten carbide mills add W/Co; agate adds Si; steel adds Fe/Cr/Ni — choose grinding media for the elements you care about, and run prep blanks.
- **Reporting isotope ratios without the standard:** delta values are meaningless without the reference scale (VSMOW, VPDB) — always state it.
