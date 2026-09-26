---
name: dft-workflows
description: Density functional theory calculations end to end — structure relaxation, convergence, band structures, and defect energetics.
category: scientific
---

## Overview

DFT is the workhorse of computational materials science: approximate quantum
mechanics accurate enough for structures, energetics, and electronic
properties of most solids. This skill covers building a reliable DFT
workflow — functional choice, convergence discipline, and the standard
calculations (relaxation, DOS, bands, defects, surfaces) with the checks
that separate trustworthy results from expensive noise.

## When to use

- Predicting or rationalizing crystal structures, phase stability, and reaction energies
- Computing electronic structure: band gaps, DOS, charge transfer, bonding analysis
- Studying defects, dopants, surfaces, and interfaces via supercell models
- Screening materials (stability, band alignment, adsorption energies) before experiments
- Setting up high-throughput calculations with consistent, documented settings

## Core concepts

- **Functionals and their biases:** LDA/GGA (PBE) underbind and underestimate gaps; hybrids (HSE06) fix gaps at ~10× cost; +U corrects localized d/f electrons; vdW corrections (D3, rVV10) matter for layered and molecular crystals. No functional is universally best.
- **Basis and k-points:** plane-wave cutoff (ENCUT) and k-mesh density are convergence parameters, not truths — converge them per system. Metals need denser meshes than insulators.
- **Energy above hull:** the formation energy relative to the convex hull of competing phases; < ~25 meV/atom is often considered (meta)stable and synthesizable.
- **Band gap problem:** standard GGA gaps are systematically too small; compare trends across materials rather than absolute values unless using hybrids or GW.
- **Charged defects:** formation energies depend on the Fermi level and chemical potentials; finite-size corrections (Freysoldt/FNV) are mandatory for charged supercells.
- **Thermodynamics from DFT:** 0 K energies need vibrational (phonon) and configurational entropy corrections for finite-temperature phase diagrams.

- **Pseudopotentials/PAW:** core electrons are replaced by effective potentials — verify the valence configuration includes semicore states for transition metals, which affect energetics noticeably.
- **Smearing:** Fermi-Dirac or Gaussian smearing aids SCF convergence for metals, but smearing entropy contaminates free energies — extrapolate σ→0 or use the tetrahedron method for final energies.
- **Hubbard U:** DFT+U corrects self-interaction for localized d/f states — U is material-specific, not universal; determine it by linear response or benchmark fitting, and always report the value used.

## Practical workflow

### 1. Converge before you compute

```bash
# Typical convergence test: vary ENCUT and k-mesh, watch total energy per atom
# Converge to < 1-5 meV/atom before any production run
```

1. Fix the structure; scan ENCUT in steps, then k-mesh density — converge each to your target tolerance.
2. Choose the functional for the property: PBE(+U/+D3) for structures and trends; HSE06/GW for gaps and band alignment.
3. Document the full setting set (functional, cutoff, k-mesh, smearing, convergence criteria) — reproducibility requires all of it.

### 2. Standard calculation sequence

1. **Relaxation:** optimize lattice + ions (ISIF=3 in VASP terms) until forces < 0.01 eV/Å.
2. **Static run:** single-point at relaxed geometry with a denser k-mesh for accurate energies and DOS.
3. **Bands:** non-self-consistent run along high-symmetry k-paths (use standard paths for the lattice type).
4. **Phonons:** finite-displacement or DFPT to confirm dynamical stability (no imaginary modes) and get vibrational free energy.

### 3. Defects and surfaces

1. Build a supercell; relax; check that defect-defect distance exceeds ~10 Å (test size convergence).
2. Compute formation energies across charge states and Fermi-level positions; apply charge corrections.
3. For surfaces: use symmetric slabs or dipole corrections; converge slab thickness and vacuum gap (~15 Å).

### 4. High-throughput discipline

1. Lock one setting set for the whole campaign; never compare energies across different functionals or cutoffs.
2. Automate with a workflow manager (AiiDA, atomate, ASE) and store full provenance.
3. Validate a subset against experiment or higher-level theory before trusting the screen.

### 5. Run ab initio molecular dynamics when statics are not enough

1. Use AIMD for finite-temperature structures, diffusion, or phase transitions — equilibrate in NVT, then collect statistics in NVE or NVT.
2. Use ~1 fs timesteps (0.5 fs with hydrogen); check energy drift in NVE — drift means the timestep is too large or SCF convergence too loose.
3. Extract radial distribution functions, mean-square displacements (diffusion coefficients), and time-averaged structures — extend the run until these stabilize.

### 6. Quick-reference checklist

- [ ] ENCUT and k-mesh converged to < 5 meV/atom for this system
- [ ] Functional chosen for the property (structures vs gaps vs barriers)
- [ ] Spin polarization enabled with sensible initial moments where relevant
- [ ] Solvent/dispersion corrections applied where physically needed
- [ ] Forces < 0.01 eV/Å on the relaxed structure
- [ ] Charged-defect corrections (FNV/Freysoldt) applied
- [ ] Phonons checked for imaginary modes (dynamical stability)
- [ ] Full settings (functional, cutoff, k-mesh, U values) recorded for reproducibility

## Common pitfalls

- **Comparing unconverged or mixed-setting energies:** a 50 meV/atom error swamps most phase-stability conclusions.
- **Forgetting spin:** magnetic systems need spin-polarized calculations with sensible initial moments; non-magnetic defaults give wrong ground states.
- **Trusting GGA band gaps:** always caveat them; use hybrids or GW when the gap value itself matters.
- **Charged defects without corrections:** raw supercell energies for charged defects are meaningless — apply FNV/Freysoldt corrections.
- **Ignoring zero-point and thermal effects:** 0 K DFT energies can invert the true finite-temperature stability ordering.
- **Overinterpreting small differences:** energy differences below your convergence tolerance are noise, not physics.
- **Metal settings on insulators and vice versa:** insufficient k-point density or wrong smearing for metals gives noisy, unreliable energetics — match the electronic settings to the electronic structure.
- **Missing dispersion in soft matter:** PBE without vdW corrections gets interlayer and intermolecular distances badly wrong — add D3 or rVV10 where non-covalent binding matters.
