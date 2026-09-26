---
name: polymer-science-basics
description: Polymer fundamentals — molecular weight, polymerization methods, thermal transitions, and mechanical behavior of plastics and elastomers.
category: scientific
---

## Overview

Polymers are defined by their long-chain architecture: molecular weight,
distribution, branching, and crosslinking control everything from melt
viscosity to toughness. This skill covers the essential concepts (Mn, Mw,
PDI, Tg, crystallinity), the main synthesis routes, key characterization
methods, and how structure maps to properties and processing.

## When to use

- Selecting a polymer for an application: matching Tg, crystallinity, and toughness to service conditions
- Troubleshooting synthesis: low molecular weight, broad distribution, gelation
- Interpreting GPC, DSC, DMA, and rheology data
- Diagnosing product failures: environmental stress cracking, UV degradation, creep
- Designing processing: extrusion, injection molding, and the role of melt viscosity

## Core concepts

- **Molecular weight averages:** Mn (number-average), Mw (weight-average); PDI = Mw/Mn measures breadth. Two polymers with the same Mn but different PDI process and perform differently.
- **Polymerization mechanisms:** step-growth (condensation; high conversion needed for high MW — Carothers equation) vs chain-growth (radical/anionic/cationic; high MW early, control via initiation/termination).
- **Glass transition (Tg):** the amorphous-phase transition from glassy to rubbery; set by chain stiffness and free volume. Below Tg: stiff/brittle; above: flexible (if uncrosslinked, it flows).
- **Crystallinity:** only regular chains crystallize (HDPE yes, atactic PS no); crystalline regions raise modulus, chemical resistance, and opacity; degree of crystallinity depends on cooling rate.
- **Crosslinking:** covalent networks (thermosets, rubbers) don't melt — they degrade; crosslink density sets modulus and swelling via rubber elasticity theory.
- **Viscoelasticity:** polymers are neither Hookean solids nor Newtonian fluids; time–temperature superposition (WLF equation) lets short tests predict long-term creep.

- **Entanglement molecular weight (M_e):** below M_e chains slide past each other — no toughness; the plateau modulus G_N^0 = ρRT/M_e connects rheology directly to molecular architecture.
- **Flory–Huggins theory:** the χ parameter predicts miscibility — blends phase-separate above χN ≈ 2; block copolymers microphase-separate into ordered nanostructures at the same threshold.
- **Free volume and WLF:** the Williams–Landel–Ferry equation shifts viscoelastic data across temperatures — time–temperature superposition turns minutes of testing into years of creep prediction.

## Practical workflow

### 1. Characterize before you conclude

1. **GPC/SEC:** Mn, Mw, PDI — calibrate with appropriate standards (polystyrene calibration misleads for other chemistries; use universal calibration or light scattering).
2. **DSC:** Tg (step change), Tm and crystallinity (melting endotherm area vs 100% crystalline reference), curing exotherms for thermosets.
3. **DMA:** modulus vs temperature — the most sensitive Tg measurement (tan δ peak) and a window into relaxations and crosslink density.
4. **TGA:** degradation onset, filler/ash content, composition of blends by step analysis.

### 2. Connect structure to the problem

1. Low strength/toughness → check MW first (below the entanglement MW, polymers are waxes, not plastics).
2. Brittleness at service temperature → is the use temperature near or below Tg? (The classic failure.)
3. Poor chemical resistance → increase crystallinity or crosslink density.
4. Processing difficulty → MW too high or distribution too broad; melt viscosity scales as ~MW^3.4 above entanglement.

### 3. Design a synthesis

1. Choose mechanism for the target: step-growth for polyesters/polyamides (drive conversion >99% — remove condensate); controlled radical (RAFT/ATRP) for narrow PDI and block copolymers.
2. Monitor conversion (NMR, FTIR) and MW (GPC) vs time — don't assume the recipe worked.
3. For crosslinked systems, track gel point and cure kinetics (rheology, DSC) — undercure and overcure fail differently.

### 4. Failure diagnosis checklist

1. Identify the fracture mode and check for stress whitening, crazing (glassy polymers), or discoloration (degradation).
2. FTIR for oxidation (carbonyl growth), DSC for crystallinity/Tg shifts, GPC for chain scission (MW drop).
3. Consider environmental factors: UV, solvents (ESC needs stress + fluid + susceptible polymer), temperature excursions above Tg.

### 5. Predict long-term performance with accelerated aging

1. Measure creep or stress relaxation at several elevated temperatures; build the master curve via WLF shifting.
2. Validate the shift factors against a second property (e.g., DMA) — consistent shifts mean the deformation mechanism didn't change with temperature.
3. Extrapolate cautiously: no more than ~2 decades beyond the data, and never across a transition (Tg, Tm) where mechanisms change.

### 6. Quick-reference checklist

- [ ] Mn vs Mw specified wherever "molecular weight" is quoted, with PDI
- [ ] GPC calibration appropriate to the polymer chemistry (not blind PS calibration)
- [ ] Tg measured (DSC step or DMA tan δ) and compared with service temperature
- [ ] Crystallinity quantified where relevant (DSC vs 100% crystalline reference)
- [ ] Additive package identified (plasticizers, stabilizers, fillers)
- [ ] Samples conditioned (annealing, physical aging) before testing
- [ ] Failure analysis includes FTIR (oxidation), DSC (transitions), GPC (scission)
- [ ] Regrind fraction controlled in processing

## Common pitfalls

- **Single-point MW values:** reporting "MW = 50k" without saying Mn or Mw (and PDI) is meaningless.
- **PS-calibrated GPC taken literally:** hydrodynamic volume differs by chemistry — errors of 2× are common without proper calibration.
- **Confusing Tg with Tm:** amorphous polymers soften at Tg; only semicrystalline ones have a true melting point — and they have both.
- **Ignoring physical aging:** quenched glasses densify over time below Tg, embrittling the product months after molding.
- **Additive amnesia:** plasticizers, stabilizers, and fillers dominate real-world performance — the "same" polymer from two suppliers differs.
- **Recycling blindness:** each melt cycle cuts chains (MW drops); regrind fractions must be controlled or properties drift.
- **Plasticizer migration:** flexible PVC and rubbers lose plasticizer over time — embrittlement blamed on "aging" is often just migration; test for it before reformulating.
- **Post-crystallization drift:** crystallization continues after processing below Tm — dimensions and properties drift for weeks; condition samples before testing or reporting.
