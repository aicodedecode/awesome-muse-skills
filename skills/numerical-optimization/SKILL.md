---
name: numerical-optimization
description: Practical optimization — choosing algorithms, handling constraints, tuning, and diagnosing convergence failures.
category: scientific
---

## Overview

Optimization is everywhere in science: fitting models, designing
experiments, training ML, calibrating simulations. This skill covers
selecting the right algorithm for the problem structure (smooth vs
non-smooth, constrained vs free, convex vs non-convex), setting up
objectives correctly (scaling, gradients), and diagnosing the failures
that waste weeks of compute.

## When to use

- Fitting a model to data (least squares, maximum likelihood)
- Choosing between gradient-based, derivative-free, and global optimizers
- Handling constraints: bounds, equalities, inequalities
- Tuning hyperparameters or calibrating simulation parameters
- Debugging an optimizer that stalls, diverges, or returns nonsense

## Core concepts

- **Problem taxonomy:** convex (one global minimum — use gradient methods confidently) vs non-convex (many minima — need global search or multi-start); smooth (gradients help) vs non-smooth/noisy (derivative-free: Nelder–Mead, CMA-ES, Bayesian optimization).
- **Gradient methods:** steepest descent (slow), conjugate gradient, (L-)BFGS (quasi-Newton, the default for smooth unconstrained problems), Newton (needs Hessians). Supply analytic or autodiff gradients — finite differences are slower and noisier.
- **Constrained optimization:** bounds (L-BFGS-B), general constraints (SLSQP, trust-constr, augmented Lagrangian, interior-point). Reformulate when possible: log-transforms turn positivity into unconstrained problems.
- **Global optimization:** basin-hopping, differential evolution, dual annealing, Bayesian optimization (expensive objectives) — for rugged landscapes; always follow with a local polish.
- **Scaling:** optimizers assume ~O(1) variables; rescale parameters to similar magnitudes or the Hessian conditioning destroys convergence.
- **Least squares structure:** separable linear/nonlinear parameters (variable projection), sparse Jacobians — exploit structure instead of treating everything as a black box.

- **Automatic differentiation:** exact gradients at the cost of a function evaluation (JAX, autograd) — eliminates finite-difference noise entirely; the single biggest upgrade for gradient-based optimization of coded objectives.
- **Stochastic optimization:** SGD and Adam for noisy/large-scale objectives (machine learning) — the noise is a feature (escapes sharp minima); learning-rate schedules and batch sizes are the tuning knobs.
- **Derivative-free for the truly black box:** Bayesian optimization builds a surrogate (Gaussian process) and explores efficiently — the method of choice when each evaluation costs minutes or dollars.

## Practical workflow

### 1. Formulate well

```python
from scipy.optimize import minimize
# Scale variables to O(1); supply a gradient; bound what must stay physical
res = minimize(fun, x0_scaled, jac=grad, method="L-BFGS-B",
               bounds=bounds, options={"ftol": 1e-10, "maxiter": 10000})
```

1. Define the objective precisely: what is minimized, over what variables, subject to what — write it mathematically before coding.
2. Scale all variables to order unity; log-transform strictly positive parameters.
3. Provide gradients (analytic or autodiff via JAX/autograd) — finite-difference gradients fail on noisy objectives.

### 2. Choose the algorithm

| Problem | First choice |
|---|---|
| Smooth, unconstrained | L-BFGS (with gradients) |
| Smooth, bounds | L-BFGS-B |
| Smooth, general constraints | trust-constr / SLSQP |
| Non-smooth, low-dim | Nelder–Mead |
| Noisy/expensive, low-dim | Bayesian optimization |
| Non-convex, global search | Differential evolution → local polish |
| Least squares | Levenberg–Marquardt / trust-region reflective |

### 3. Multi-start and validate

1. For non-convex problems: multi-start from diverse initial points (Latin hypercube) — the best of many local optima beats one hopeful run.
2. Check convergence: gradient norm small, constraints satisfied, objective stable across restarts.
3. Validate the solution: does it make physical sense? Perturb the data slightly — stable solutions survive, overfit ones don't.

### 4. Diagnose failures

1. **Stalls immediately:** scaling (variables differ by 10⁶), bad gradient, or starting at a bound — check and rescale.
2. **Hits maxiter without converging:** loosen tolerances for noisy objectives, or the landscape is flat — reparameterize.
3. **Different answers per run:** non-convex landscape or stochastic objective — go global or multi-start; fix random seeds for reproducibility.
4. **Constraint violations:** penalty weights too small, or the feasible set is empty — check feasibility first.

### 5. Optimize an expensive black-box function

1. Define tight bounds from physical plausibility — Bayesian optimization wastes evaluations exploring absurd regions otherwise.
2. Choose the surrogate and acquisition function (expected improvement is the default); seed with a space-filling design (Latin hypercube, ~10 points per dimension).
3. Run in batches where parallel evaluation is possible; stop on a budget (evaluations or time), not on a tolerance — expensive objectives never get tight tolerances.

## Common pitfalls

- **Unscaled variables:** the #1 convergence killer — a parameter in nanometers next to one in gigapascals breaks every quasi-Newton method.
- **Finite-difference gradients on noisy objectives:** noise gets amplified into garbage search directions — use autodiff or derivative-free methods.
- **Single start on non-convex problems:** finding a local minimum and declaring victory — multi-start is mandatory.
- **Over-tight tolerances:** demanding 1e-12 on a noisy experimental objective wastes iterations chasing noise.
- **Ignoring constraints in the formulation:** optimizing then clipping to bounds gives infeasible "optima" — constrain properly.
- **Black-boxing structured problems:** least-squares and separable problems have specialized solvers 10–100× faster than generic ones.
- **Optimizing a stochastic objective as if deterministic:** re-evaluating the same point gives different values — use noise-aware methods (replicated evaluations, stochastic kriging) or the optimizer chases noise.
- **Ignoring integer/discrete variables:** rounding continuous optima to integers can be arbitrarily bad — use mixed-integer methods (or enumerate when the discrete space is small).
