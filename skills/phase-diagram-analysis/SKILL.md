---
name: phase-diagram-analysis
description: Reading and constructing phase diagrams — Gibbs phase rule, lever rule, invariant reactions, and CALPHAD basics.
category: scientific
---

## Overview

Phase diagrams are maps of material stability: which phases exist at a given
composition and temperature, and in what proportions. This skill covers
reading binary and ternary diagrams fluently (phase fields, solubility
limits, invariant reactions), quantitative use of the lever rule, and the
basics of CALPHAD-type computational thermodynamics.

## When to use

- Choosing alloy compositions and heat treatments (solutionizing, aging, annealing temperatures)
- Predicting solidification paths and the microstructures they produce
- Interpreting DSC/DTA thermal arrests and linking them to diagram features
- Assessing whether a reported phase is equilibrium or metastable
- Building or critiquing a CALPHAD thermodynamic database assessment

## Core concepts

- **Gibbs phase rule:** F = C − P + 2 (at constant pressure, F = C − P + 1). At an invariant reaction in a binary system (C=2, P=3), F = 0 — it occurs at a single temperature.
- **Invariant reactions:** eutectic (L → α + β), eutectoid (γ → α + β), peritectic (L + α → β), peritectoid, monotectic — each with a characteristic microstructure and thermal signature.
- **Lever rule:** in a two-phase field, the fraction of each phase is the opposite lever arm: W_α = (C_β − C_0)/(C_β − C_α). Works for any conserved quantity (mass, moles) with consistent units.
- **Solubility limits:** solvus lines set the maximum solute in solid solution — the driving force for precipitation hardening lives between the solvus and the alloy composition.
- **Metastable vs equilibrium:** rapid cooling suppresses equilibrium phases (martensite, metallic glasses); TTT/CCT diagrams describe the kinetic competition the equilibrium diagram omits.
- **CALPHAD:** models Gibbs energies of phases as functions of T and composition (Redlich–Kister polynomials, sublattice models), then computes diagrams by energy minimization; only as good as its assessed parameters.

- **Spinodal vs nucleation-and-growth:** inside the spinodal, infinitesimal fluctuations grow with no barrier; between binodal and spinodal, nucleation needs a critical nucleus — interconnected vs discrete precipitate morphologies reveal which operated.
- **Scheil solidification:** assumes no diffusion in the solid and complete mixing in the liquid — predicts microsegregation and eutectic fractions in castings; the non-equilibrium counterpart of the lever rule.
- **Metastable extensions:** extrapolating phase boundaries below invariant temperatures guides heat treatment — e.g., GP zones form where the equilibrium precipitate cannot nucleate.

## Practical workflow

### 1. Read a binary diagram systematically

1. Identify the components, phases, and axes (check: wt% vs at% — lever-rule math differs).
2. Trace the liquidus, solidus, solvus, and any invariant horizontals; label each reaction.
3. For your alloy composition, draw the vertical isopleth and list the phase fields crossed on cooling.
4. At each temperature of interest, apply the lever rule for phase fractions and phase compositions.

### 2. Design a heat treatment

1. **Solutionize:** above the solvus but below the solidus/eutectic — dissolve precipitates into single phase.
2. **Quench:** fast enough to retain supersaturated solid solution (check the TTT diagram nose).
3. **Age:** below the solvus at a temperature balancing nucleation rate and diffusion (typically 0.3–0.5 T_m).
4. Verify with hardness curves and microscopy; overaging (Ostwald ripening) is the predictable failure mode.

### 3. Link thermal analysis to the diagram

1. DSC/DTA peaks on heating/cooling correspond to crossing phase boundaries; onset temperatures map to solvus/solidus/liquidus.
2. Invariant reactions give sharp peaks; solidus/liquidus crossings in alloys give broad signals (freezing range).
3. Compare measured arrests with the diagram — systematic offsets suggest the assessed diagram needs revision or your composition is off.

### 4. Use CALPHAD responsibly

1. Check which systems the database was assessed for; extrapolating to unassessed ternaries is risky.
2. Validate key invariant temperatures and solubilities against your own experiments.
3. Remember: CALPHAD gives equilibrium — combine with kinetic data (diffusion, TTT) for real processing.

### 5. Compute a simple diagram (CALPHAD-lite)

1. For a regular-solution binary, write G(x,T) for each phase and find common tangents numerically — the geometric construction that generates the diagram.
2. Compare against the published diagram — misfit locates bad interaction parameters or missing phases.
3. Extend to a ternary isotherm via the tangent-plane construction on the composition triangle.

### 6. Quick-reference checklist

- [ ] Axis units confirmed (wt% vs at%) before any lever-rule math
- [ ] Invariant reactions identified and labeled on the diagram
- [ ] Lever rule applied only in two-phase fields
- [ ] Diagram's provenance checked (assessed vs experimental, thermal history)
- [ ] Pressure assumption noted (most diagrams are 1 atm)
- [ ] Kinetic constraints (TTT/CCT) consulted alongside equilibrium
- [ ] CALPHAD database applicability verified for the system in question
- [ ] DSC/DTA arrests mapped to specific phase boundaries

## Common pitfalls

- **wt% vs at% confusion:** phase boundaries and the lever rule shift between the two; always check the axis units.
- **Reading a metastable diagram as equilibrium:** published "diagrams" from quenched samples may show suppressed phases.
- **Forgetting pressure:** most diagrams are at 1 atm; high-pressure processing or deep-earth contexts need the P dimension.
- **Lever rule across three-phase fields:** the simple two-phase lever rule doesn't apply at invariant temperatures — use the reaction stoichiometry instead.
- **Assuming the diagram is correct:** many published diagrams are old, partial, or assessed from limited data; treat them as models, not scripture.
- **Ignoring kinetics:** the diagram says what wants to form, not what forms in your furnace time — always pair with TTT/CCT thinking.
- **Equilibrium diagrams for rapid solidification:** additive manufacturing and melt-spinning suppress equilibrium phases — use Scheil or kinetic models, not the equilibrium diagram.
- **Metastable phases on "equilibrium" diagrams:** quenched-in phases (martensite, omega phase) appear on diagrams derived from quenched samples — always check the thermal history behind a published diagram.
