---
name: chemistry-pro
description: Practical computational and experimental chemistry workflows — cheminformatics, quantum chemistry, kinetics, and analytical methods.
category: scientific
---

## Overview

Chemistry-pro is a working toolkit for practicing chemists: computational
predictions (quantum chemistry, cheminformatics), experimental design
(reaction optimization, kinetics), and analytical characterization (NMR,
MS, IR, chromatography). It bridges what you compute and what you measure,
with concrete tool choices and validation steps at each stage.

## When to use

- Planning a synthesis: predict properties, check reaction feasibility, design the optimization screen
- Running calculations: DFT geometry optimizations, transition states, NMR shifts, conformer searches
- Designing experiments: DoE for reaction conditions, kinetic experiments, catalyst screening
- Characterizing compounds: assigning spectra, validating purity, interpreting mass spec fragments
- Communicating: writing experimental sections with the detail needed for reproducibility

## Core concepts

- **Cheminformatics representations:** SMILES/SMARTS/InChI for identity, fingerprints (Morgan/ECFP) for similarity, descriptors (logP, TPSA, MW) for property estimation. Tanimoto similarity for comparing molecules.
- **Quantum chemistry levels:** molecular mechanics (fast, crude) → semiempirical (xTB, fast screening) → DFT (ωB97X-D, M06-2X for barriers) → wavefunction methods (CCSD(T) for benchmarks). Match method to the property: geometries tolerate cheaper methods; barriers and excitation energies do not.
- **Thermochemistry:** free energies from frequency calculations (ΔG = ΔH − TΔS), quasi-harmonic corrections for low-frequency modes, Boltzmann weighting over conformers.
- **Kinetics:** Arrhenius and Eyring analysis, order determination by initial rates, steady-state vs pre-equilibrium mechanisms, kinetic isotope effects as mechanistic probes.
- **Analytical pillars:** NMR (structure), MS (mass/formula), IR (functional groups), UV-Vis (concentration/conjugation), chromatography (purity/separation), elemental analysis (composition).
- **Reaction optimization:** one-variable-at-a-time (intuitive but misses interactions) vs DoE (factorial/response-surface, captures interactions with fewer total runs).

- **Spectroscopy selection rules:** IR activity needs a changing dipole moment; Raman needs changing polarizability — symmetric stretches are often Raman-only; use both for complete vibrational assignment.
- **pKa and redox framing:** pKa tables predict proton-transfer direction; standard potentials predict redox feasibility — most "unexpected" reactivity is a misjudged pKa or potential.
- **Microscopic reversibility:** every elementary step's reverse exists; catalysts accelerate both directions equally — they change the path, never the equilibrium.

## Practical workflow

### 1. Pre-lab computation

```bash
# Generate conformers + quick xTB screen, then promote best to DFT
crest input.xyz --gfn2 --T 4
```

- Sketch the target and starting materials in SMILES; compute key descriptors with RDKit.
- Check retrosynthetic plausibility and literature precedent (Reaxys/SciFinder patterns).
- For a novel reaction step, compute the barrier (ΔG‡) with DFT; >30 kcal/mol at reaction temperature means rethink the design.
- Predict NMR shifts (GIAO) for expected products to speed up assignment later.

### 2. Reaction setup and optimization

1. Start from literature conditions; if none, run a small factorial screen: vary temperature, solvent, catalyst loading, base/equivalents.
2. Use internal standards (1,3,5-trimethoxybenzene for NMR; dodecane for GC) so yields are quantitative, not eyeballed from TLC.
3. Quench aliquots and monitor by LC/GC-MS: track mass balance — disappearance of starting material without product formation means side reactions or decomposition.
4. Scale only after the optimum is reproducible at small scale (≥3 repeats).

### 3. Kinetics experiment

1. Choose a method that doesn't perturb the system: in situ IR/Raman, NMR, UV-Vis, or quenched aliquots.
2. Determine orders by the method of initial rates; confirm with integrated rate laws.
3. Measure k at ≥4 temperatures, build an Eyring plot (ln(k/T) vs 1/T) to extract ΔH‡ and ΔS‡.
4. Compare computed barriers to experimental ΔG‡ — agreement within ~3 kcal/mol is good; systematic offset points to a missed conformer, solvent model, or mechanism.

### 4. Characterization checklist

- ¹H and ¹³C NMR with full assignment; 2D (COSY/HSQC/HMBC) for anything ambiguous.
- HRMS for molecular formula; low-res MS + fragmentation for confirmation.
- IR for functional groups; melting point or chromatography for purity (≥95%).
- Report spectra processing details: solvent, frequency, reference, temperature.

### 5. Validate computation against experiment

1. Compare computed vs measured values: NMR shifts (target ±0.2 ppm for 1H), scaled IR frequencies, computed barriers vs Eyring-derived ΔG‡.
2. Systematic deviation points to missed conformers, wrong spin state, or inadequate solvation — check these before doubting the experiment.
3. Publish the comparison table — it calibrates the method for everyone who follows.

## Common pitfalls

- **Trusting a single conformer:** energies from one geometry can be off by several kcal/mol; always conformer-search flexible molecules.
- **Ignoring solvent:** gas-phase barriers mislead for polar/ionic reactions — use an implicit solvent model (SMD/PCM) at minimum.
- **Eyeballing yields:** TLC spots and crude NMR without an internal standard are not yields; reviewers will notice.
- **Overinterpreting DFT:** functionals have systematic errors; benchmark against a known reaction or a higher-level single point before claiming quantitative accuracy.
- **Publishing irreproducible procedures:** record exact addition order, rates, and exotherms — "stirred overnight" is not a procedure.
- **Confirmation bias in spectra:** don't assign the peak you want; list every observed signal and account for impurities explicitly.
- **Forgetting BSSE in weak complexes:** uncorrected basis-set superposition error overbinds non-covalent complexes — apply counterpoise correction or use large basis sets.
- **NMR referencing errors:** misreferenced spectra shift every assignment — lock, shim, and reference explicitly (TMS or the solvent residual) and report it.
