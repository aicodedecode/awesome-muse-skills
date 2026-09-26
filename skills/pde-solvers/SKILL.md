---
name: pde-solvers
description: Solving partial differential equations numerically — finite differences, stability, boundary conditions, and verification.
category: scientific
---

## Overview

PDEs describe heat, waves, fluids, diffusion, and fields — most of
continuum physics. This skill covers discretizing PDEs with finite
differences (and when to reach for finite elements/volumes), stability
analysis (CFL condition), boundary-condition implementation, and the
verification discipline (method of manufactured solutions, convergence
tests) that distinguishes a solver from a random-number generator.

## When to use

- Solving heat/diffusion, wave, advection, or Poisson problems numerically
- Choosing explicit vs implicit time stepping for a stiff or multiscale problem
- Implementing boundary conditions (Dirichlet, Neumann, periodic, absorbing)
- Verifying a home-grown solver before trusting its output
- Deciding between finite differences, finite elements, and spectral methods

## Core concepts

- **Classification matters:** elliptic (Poisson/Laplace: boundary-value, global coupling — needs implicit/iterative solvers), parabolic (heat/diffusion: smoothing, stiff — implicit stepping), hyperbolic (wave/advection: finite propagation speed — explicit with CFL limit).
- **CFL condition:** for explicit hyperbolic schemes, c·Δt/Δx ≤ 1 (in 1D) — information can't skip cells; violate it and the solution blows up, guaranteed.
- **Stability vs accuracy:** explicit schemes are simple but stability-limited; implicit schemes (backward Euler, Crank–Nicolson) are unconditionally stable for diffusion but need linear solves each step.
- **Numerical diffusion/dispersion:** upwind schemes smear fronts (diffusion); centered schemes ring (dispersion) — know your scheme's artifacts before interpreting "physics" in the output.
- **Boundary conditions:** Dirichlet (fixed value), Neumann (fixed flux/derivative), periodic, outflow/absorbing — implemented via ghost cells or matrix rows; wrong BCs corrupt the whole domain, not just the edge.
- **Conservation form:** finite-volume discretization of ∂u/∂t + ∇·F = 0 conserves the quantity discretely — essential for shocks and long-time accuracy.

- **Operator splitting:** split multiphysics (advection + diffusion + reaction) into sequential substeps — each with its optimal scheme; Strang splitting keeps second-order accuracy.
- **Adaptive mesh refinement (AMR):** refine where the action is (fronts, shocks, boundary layers) — orders-of-magnitude savings for localized phenomena; the complexity is in the refinement criteria and load balancing.
- **Spectral methods:** for smooth problems in simple geometries, global basis functions give exponential convergence — Dedalus-style spectral PDE solving beats finite differences by orders of magnitude where applicable.

## Practical workflow

### 1. Discretize deliberately

```python
import numpy as np
# 1D heat equation, explicit FTCS: u_t = alpha * u_xx
# Stability: alpha*dt/dx^2 <= 1/2
r = alpha * dt / dx**2
assert r <= 0.5, "FTCS unstable: reduce dt"
u[1:-1] = u[1:-1] + r * (u[2:] - 2*u[1:-1] + u[:-2])
```

1. Choose the scheme for the PDE type: centered differences for diffusion/Poisson, upwind (or higher-order WENO) for advection-dominated flows.
2. Set Δt from the stability limit with a safety factor (0.5–0.9 of CFL), not at the limit.
3. For stiff problems (fast diffusion + slow advection), go implicit (Crank–Nicolson or BDF) and solve the linear system with a sparse solver.

### 2. Implement boundaries correctly

1. Dirichlet: set ghost/boundary values directly each step.
2. Neumann (insulated/flux): mirror or extrapolate into ghost cells to enforce the derivative.
3. Periodic: wrap indices — trivially correct, wonderfully useful for testing.
4. Outflow/absorbing for waves: sponge layers or characteristic BCs — reflecting boundaries fake resonances.

### 3. Verify before trusting (mandatory)

1. **Method of manufactured solutions:** pick a solution, derive the source term analytically, run the solver, measure error vs grid refinement — the observed order must match the scheme's theoretical order.
2. **Grid-convergence study:** halve Δx (and Δt per the stability scaling), confirm error drops at the expected rate — if it doesn't, there's a bug, usually in BCs.
3. **Conservation checks:** total mass/energy should be conserved (or change only through boundaries) to machine/solver tolerance.
4. **Known solutions:** compare against analytical solutions (Gaussian diffusion, standing waves) and limiting cases.

### 4. Choose the right tool

1. **FEniCS/Firedrake:** finite elements for complex geometries and multiphysics — learn the weak formulation.
2. **FiPy/Clawpack:** finite volumes for conservation laws and shocks.
3. **Dedalus:** spectral methods for smooth problems in simple geometries — exponential convergence when applicable.
4. **Hand-rolled FD:** fine for prototyping and learning — but verify as above; production work usually belongs in a tested library.

### 5. Handle a nonlinear PDE (e.g., Burgers, reaction–diffusion)

1. Treat nonlinearity explicitly or with Newton iteration on the implicit system — linearized-per-step (lagged coefficients) is the pragmatic middle ground.
2. For shock-forming equations, use conservative finite-volume form with limiters (TVD/MUSCL) — non-conservative discretizations get shock speeds wrong.
3. Verify against known solutions (traveling waves, similarity solutions) and check that refining the grid sharpens fronts rather than moving them.

## Common pitfalls

- **CFL violation:** the solution explodes and the cause is always the timestep — check it first, every time.
- **Unverified solvers:** a solver without MMS/convergence testing is a hypothesis, not a tool — verify before publishing any result.
- **BC bugs:** off-by-one ghost cells or wrong-sign Neumann conditions — the most common source of "converges at wrong order."
- **Interpreting numerical artifacts:** upwind smearing is not physical diffusion; centered ringing is not a wave — know your scheme's signature.
- **Explicit stepping for stiff problems:** diffusion with fine grids forces absurdly small Δt — switch to implicit.
- **Dimensional inconsistency:** mixing up Δx scalings in multi-D (the 1/2 limit becomes 1/4 in 2D, 1/6 in 3D for FTCS) — derive, don't guess.
- **Non-conservative form for conservation laws:** discretizing the advective form of a shock-forming equation gives wrong shock speeds — always use conservation form with limiters.
- **Boundary layers under-resolved:** high-Reynolds or thin-layer problems need stretched grids or AMR at walls — uniform grids either miss the layer or waste 99% of cells.
