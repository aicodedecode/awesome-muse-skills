---
name: crystallography-basics
description: Crystal structure fundamentals — lattices, space groups, Miller indices, and reading crystallographic data correctly.
category: scientific
---

## Overview

Crystallography is the language materials scientists use to describe ordered
solids. This skill covers the essentials: the seven crystal systems, Bravais
lattices, space-group notation, Miller indices, and how to extract useful
information (coordination, density, cleavage) from a CIF file or a published
structure.

## When to use

- Interpreting a crystal structure from a paper or database (CIF, ICSD, Materials Project)
- Indexing diffraction peaks or assigning Miller indices to crystal faces
- Predicting or rationalizing material properties from symmetry (piezoelectricity, anisotropy)
- Setting up a structure for DFT or molecular dynamics — getting the cell and symmetry right
- Explaining why a material cleaves, twins, or grows in a particular habit

## Core concepts

- **Lattice vs basis:** the lattice is the periodic array of points; the basis is the atom(s) attached to each point. Structure = lattice + basis.
- **The 14 Bravais lattices:** all 3D periodic point arrays, spanning 7 crystal systems (cubic, tetragonal, orthorhombic, hexagonal, trigonal, monoclinic, triclinic).
- **Space groups (230):** the full set of symmetry operations (rotations, mirrors, glides, screws) compatible with a lattice. Notation like Pnma or Fm-3m encodes them compactly.
- **Miller indices (hkl):** reciprocal intercepts of a plane with the axes, reduced to smallest integers. [uvw] denotes directions; {hkl} and ⟨uvw⟩ denote symmetry-equivalent families.
- **Bragg's law:** nλ = 2d sin θ connects diffraction angles to interplanar spacings — the bridge between crystal geometry and measured patterns.
- **Symmetry → properties:** centrosymmetric crystals cannot be piezoelectric or ferroelectric; cubic crystals are optically isotropic; these are rigorous consequences of the space group, not accidents.

- **Reciprocal lattice:** diffraction patterns live in reciprocal space — each spot is a reciprocal-lattice point; indexing is the mapping from spots back to (hkl).
- **Structure-factor extinctions:** F_hkl = Σ f_j exp(2πi(hx_j+ky_j+lz_j)) — systematic zeros reveal lattice centering and screw/glide symmetry directly from the data.
- **Twinning:** intergrown domains related by an operation the structure lacks — mimics higher symmetry and corrupts refinement; test for twinning whenever R-factors stall inexplicably.

## Practical workflow

### 1. Read a CIF file properly

```bash
# Inspect a CIF with the essentials: symmetry, cell, atom sites
grep -E "_symmetry_space_group_name_H-M|_cell_length|_cell_angle|_atom_site" structure.cif
```

1. Note the space group and cell parameters first — they define everything else.
2. Check the asymmetric unit and Wyckoff positions: fewer unique sites = higher symmetry.
3. Verify occupancies and displacement parameters; partial occupancy or huge ADPs flag disorder or a bad refinement.

### 2. Compute what you need from the structure

1. Density: ρ = Z·M / (N_A·V_cell) — compare with the measured value as a sanity check.
2. Coordination: count nearest neighbors within a sensible cutoff; polyhedral connectivity (corner/edge/face sharing) controls many properties.
3. Interplanar spacings: d_hkl from the cell parameters; predict where diffraction peaks should appear.

### 3. Connect symmetry to behavior

1. List the point group; look up which tensor properties are forbidden or constrained by it.
2. Identify cleavage planes: low-index planes with weak bonding across them ({111} in NaCl-type structures, basal planes in layered materials).
3. For epitaxy or interfaces, compare lattice parameters and compute mismatch: (a_film − a_sub)/a_sub.

### 4. Prepare structures for computation

1. Download from a curated database (Materials Project, COD) and check the provenance/energy above hull.
2. Convert primitive ↔ conventional cells consistently; keep the setting documented.
3. For defects or surfaces, build supercells large enough that periodic images don't interact (test convergence).

### 5. Solve or verify a structure

1. Index the pattern (auto-indexing programs for powder); assign the space group from systematic absences.
2. Solve by direct methods or charge flipping (single crystal) or Rietveld refinement from a starting model (powder).
3. Validate with checkCIF — address every A- and B-level alert; residual electron density should be < 1 e/Å³ for light-atom structures.

### 6. Quick-reference checklist

- [ ] Space group, cell parameters, and Z recorded from the CIF before any analysis
- [ ] Conventional vs primitive cell choice stated explicitly
- [ ] Density computed from the structure and compared with measured values
- [ ] Systematic absences checked against the assigned space group
- [ ] R-factors and checkCIF alerts reviewed for database structures
- [ ] Temperature of the structure determination noted (thermal expansion matters)
- [ ] Supercell size tested for defect/surface calculations
- [ ] Provenance of the structure (database, DOI) documented

## Common pitfalls

- **Confusing the conventional and primitive cell:** atom counts, k-point meshes, and reported lattice parameters all depend on the choice — state it explicitly.
- **Trusting a CIF blindly:** database entries include poor refinements; check R-factors and chemical plausibility (bond lengths, charge balance).
- **Forgetting that powder diffraction loses information:** overlapping peaks and preferred orientation make structure solution from powder data much harder than from single crystals.
- **Assuming "cubic" means isotropic:** cubic crystals are optically isotropic but can be elastically and thermally anisotropic.
- **Ignoring temperature:** cell parameters from a 100 K structure differ from room-temperature values; thermal expansion shifts every d-spacing.
- **Wrong space-group setting:** non-standard settings scramble systematic absences — convert to the standard setting before any symmetry analysis.
- **Disorder modeled as thermal motion:** huge displacement ellipsoids often mean split atomic positions — try a disorder model before accepting unphysical ADPs.
