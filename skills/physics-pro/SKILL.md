---
name: physics-pro
description: Applied physics problem-solving — mechanics, E&M, statistical mechanics, and data analysis with real unit and error discipline.
category: scientific
---

## Overview

Physics-pro is a practical companion for doing physics: setting up problems
correctly (units, scales, symmetries), choosing the right formalism
(Lagrangian vs Newtonian, circuit vs field picture), analyzing experimental
data with honest error propagation, and sanity-checking results with
dimensional analysis and limiting cases.

## When to use

- Solving mechanics/E&M/thermo problems: choose coordinates, identify conserved quantities, set up equations of motion
- Designing or debugging experiments: sensor choice, noise budgets, calibration strategy
- Analyzing data: fitting models, propagating uncertainties, comparing theory to measurement
- Estimating before calculating: order-of-magnitude checks, scaling laws, Fermi problems
- Writing up results: presenting numbers with meaningful precision and uncertainty

## Core concepts

- **Units and dimensions:** every quantity carries dimensions; dimensional analysis catches algebraic errors and yields scaling laws (e.g., pendulum period T ∝ √(L/g)) before solving anything.
- **Conservation laws:** energy, momentum, angular momentum, charge — find what is conserved first; it often determines the answer without solving differential equations.
- **Symmetries:** translational, rotational, and gauge symmetries constrain solutions (Noether's theorem: symmetry ↔ conservation law). Exploit symmetry in coordinate choice.
- **Statistical mechanics:** partition functions connect microstates to thermodynamics; the Boltzmann factor e^(−E/kT) governs thermal populations.
- **Electromagnetism:** Maxwell's equations in integral form (flux/circulation) for symmetric geometries, differential form for fields in space.
- **Error analysis:** random vs systematic errors; standard error of the mean σ/√N; propagate with partial derivatives; never quote more digits than the uncertainty justifies.
- **Linear response:** small perturbations around equilibrium (SHM, RC circuits, thermal relaxation) share the same mathematics — recognize the pattern.

- **Action principles:** the realized path extremizes the action — Lagrangian mechanics handles constraints elegantly; when forces get messy, switch to energy methods.
- **Fourier thinking:** linear systems decompose into modes; the dispersion relation ω(k) encodes the wave physics — learn to read problems in frequency space.
- **Effective theories:** physics at one scale decouples from distant scales — friction, viscosity, and band structure are features of scale separation, not apologies.

## Practical workflow

### 1. Estimate first

1. Do a Fermi estimate of the expected answer before any detailed calculation.
2. Identify the dominant scale: what is big, what is negligible? Drop terms <1% early.
3. Check dimensions of every intermediate expression — a mismatch is a guaranteed error.

### 2. Set up the problem

1. Draw the system, label forces/fields, choose coordinates that match the symmetry (polar for central forces, Cartesian for linear circuits).
2. List knowns, unknowns, and constraints; count equations vs unknowns before solving.
3. Decide the formalism: energy methods when forces are messy, Newton's laws when you need trajectories, Lagrangian for constrained systems.

### 3. Solve and validate

1. Solve symbolically first; substitute numbers at the end (catches unit errors, preserves insight).
2. Check limiting cases: does the answer reduce to the known result when a parameter → 0 or ∞?
3. Compare against your Fermi estimate — a 10× discrepancy means find the missing factor before proceeding.

### 4. Experimental data analysis

```python
import numpy as np
from scipy.optimize import curve_fit

# Fit with uncertainties; report parameter errors from the covariance matrix
popt, pcov = curve_fit(model, x, y, sigma=y_err, absolute_sigma=True)
perr = np.sqrt(np.diag(pcov))
chi2_red = np.sum(((y - model(x, *popt)) / y_err) ** 2) / (len(x) - len(popt))
# chi2_red ≈ 1 means the model fits within the stated errors
```

1. Calibrate sensors against a known standard; record the calibration with date and conditions.
2. Distinguish noise (averages down) from drift/systematics (doesn't) — plot residuals vs time.
3. Report results as value ± uncertainty with the uncertainty's dominant source named.

### 5. Run the limiting-case audit

1. Take every parameter to 0 and ∞ in the final expression — each limit should reduce to a known simple case.
2. Check symmetries: a spherically symmetric setup cannot produce a preferred direction in the answer.
3. Dimensionally check the final answer, not just the intermediates — and compare against the Fermi estimate from step 1.

## Common pitfalls

- **Mixing unit systems:** SI vs cgs/Gaussian in E&M is a classic trap — pick one and convert everything at the input stage.
- **Forgetting the vector nature:** force, field, and momentum are vectors; scalar shortcuts fail for anything with direction.
- **Overfitting data:** a 5-parameter fit to 8 points proves nothing — prefer models with physical parameters and report reduced χ².
- **Confusing precision with accuracy:** ten repeat measurements give a precise but possibly biased mean; calibrate to address accuracy.
- **Ignoring the apparatus:** leads, contacts, and loading effects are part of the circuit; thermal masses are part of the thermodynamics.
- **Trusting the simulation blindly:** check mesh/grid convergence and validate against an analytic limit before believing numerical results.
- **Significant-figure theater:** quoting 9.81234 m/s² from a stopwatch measurement — let the uncertainty set the digits, always.
- **Confusing models with reality:** the harmonic oscillator, ideal gas, and point charge are models with domains — know where each breaks before applying it.
