---
name: mechanical-testing-basics
description: Mechanical property measurement — tensile, hardness, fracture, and fatigue testing with proper specimen and data practice.
category: scientific
---

## Overview

Mechanical testing converts "this material feels strong" into numbers with
units and uncertainties. This skill covers the core tests — tensile,
hardness, fracture toughness, fatigue, creep — how to prepare specimens,
extract properties from raw data, and avoid the artifacts that make published
strength values irreproducible.

## When to use

- Measuring strength, ductility, stiffness, or toughness of a new material
- Comparing processing routes or heat treatments quantitatively
- Diagnosing failures: was it overload, fatigue, embrittlement, or a defect?
- Qualifying a material against a standard (ASTM/ISO) for an application
- Deciding which test actually answers your question (strength ≠ toughness ≠ hardness)

## Core concepts

- **Stress–strain vocabulary:** engineering vs true stress–strain; Young's modulus E (initial slope); 0.2% offset yield strength; UTS (maximum); elongation and reduction of area (ductility); toughness (area under the curve).
- **Hardness as a proxy:** Vickers/Brinell/Rockwell hardness correlates empirically with strength (Tabor relation) but measures resistance to plastic indentation — not a substitute for tensile data in design.
- **Fracture toughness (K_IC):** resistance to crack propagation, with units MPa√m; the property that determines whether a small flaw causes catastrophic failure. Strength without toughness is brittleness.
- **Fatigue:** S–N curves, endurance limit (steels) vs continuously declining life (aluminum); crack growth follows Paris law da/dN = C(ΔK)^m. Most service failures are fatigue.
- **Size and rate effects:** properties depend on specimen size (grain size vs thickness), strain rate, and temperature — a number without these conditions is incomplete.
- **Weibull statistics:** brittle materials (ceramics, composites) fail from the worst flaw; strength follows a Weibull distribution — report the modulus m, not just a mean.

- **True vs engineering stress–strain:** engineering uses the original area; true uses the instantaneous area — they diverge after necking; Considère's criterion (dσ/dε = σ) marks necking onset.
- **Strain-rate sensitivity:** m = ∂lnσ/∂ln(ε̇) — high m means rate hardening (superplasticity near m ≈ 0.5); strain-rate jump tests measure it without specimen-to-specimen scatter.
- **Notch sensitivity:** elastic stress concentration (K_t) vs actual notch behavior — brittle materials fail near K_t·σ while ductile ones redistribute stress; design with the criterion matching the material.

## Practical workflow

### 1. Choose the test for the question

| Question | Test |
|---|---|
| Stiffness, yield, ductility | Uniaxial tensile (ASTM E8/E8M) |
| Quick strength comparison | Vickers hardness (ASTM E384) |
| Flaw tolerance | Fracture toughness K_IC (ASTM E399/E1820) |
| Cyclic service life | Fatigue S–N or da/dN (ASTM E466/E647) |
| High-temperature service | Creep rupture (ASTM E139) |

### 2. Prepare specimens correctly

1. Machine to the standard geometry with polished gauge sections — surface scratches are crack starters that lower measured ductility.
2. Align the specimen in the grips; bending during a "tensile" test invalidates the result (check with a strain-gauged dummy).
3. Control temperature and strain rate; record both — they are part of the result.
4. Test enough replicates: ≥5 for metals, ≥10–30 for brittle materials (Weibull needs data).

### 3. Extract properties honestly

1. Determine E from the initial linear region with an extensometer — crosshead displacement includes machine compliance.
2. Use the 0.2% offset method for yield; report the method — "yield strength" without it is ambiguous.
3. For fracture toughness, verify plane-strain validity criteria (thickness, crack length) before quoting K_IC.
4. Plot full curves, not just table values; the curve shape diagnoses necking, serrated flow, and premature failure.

### 4. Fractography — read the broken pieces

1. Examine fracture surfaces (SEM): dimples = ductile, cleavage facets = brittle, beach marks/striations = fatigue, intergranular = embrittlement.
2. Find the origin: inclusions, pores, and machining marks locate where failure started.
3. Match the fractography to the test data — a low elongation with dimpled fracture means a defect, not an intrinsically brittle material.

### 5. Run a fracture-toughness test correctly

1. Pre-crack by fatigue — a machined notch is not sharp enough; a real crack is mandatory for valid K_IC.
2. Load per ASTM E399/E1820 and check every validity criterion (P_max/P_Q, thickness, crack length) — invalid tests produce numbers, not toughness values.
3. For ductile materials, use J-integral or CTOD (elastic-plastic fracture mechanics) rather than forcing linear-elastic K_IC.

### 6. Quick-reference checklist

- [ ] Test standard identified (ASTM/ISO) and specimen geometry compliant
- [ ] Strain measured with extensometer/DIC, not crosshead displacement
- [ ] Specimen alignment verified (bending check)
- [ ] Temperature and strain rate recorded as part of the result
- [ ] Replicates: ≥5 for metals, ≥10–30 for brittle materials
- [ ] Yield determined by stated method (0.2% offset)
- [ ] Fracture surfaces examined (fractography) for every failure analysis
- [ ] Full stress–strain curves archived, not just table values

## Common pitfalls

- **Crosshead displacement as strain:** machine compliance inflates apparent elongation; use an extensometer or DIC for modulus and yield.
- **One test, one number:** a single tensile bar proves nothing — scatter is data, report it.
- **Hardness-to-strength conversion abuse:** empirical relations are alloy-family specific; don't convert across material classes.
- **Ignoring the standard:** non-standard specimen geometry makes your numbers incomparable with literature — follow ASTM/ISO or justify the deviation.
- **Testing at the wrong rate/temperature:** quasi-static room-temperature data doesn't predict impact or high-temperature service.
- **Survivorship bias in fatigue:** runouts (unbroken specimens) are data — use proper statistical treatment (staircase method), don't discard them.
- **Grip failures:** stress concentrations at the grips cause breaks outside the gauge section — use proper specimen geometry and alignment; discard grip breaks, don't average them in.
- **Testing composites like metals:** anisotropic materials need directional testing under the appropriate standards — a single "tensile strength" number misleads.
