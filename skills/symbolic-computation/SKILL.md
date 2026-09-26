---
name: symbolic-computation
description: Computer algebra with SymPy — exact calculus, equation solving, series, and generating verified numerical code.
category: scientific
---

## Overview

Symbolic computation manipulates mathematics exactly: derivatives,
integrals, series, matrix algebra, and differential equations in closed
form. This skill covers SymPy workflows — when exact answers beat
numerics, how to simplify without getting lost, solving ODEs/PDEs
symbolically, and lambdifying verified expressions into fast numerical
code.

## When to use

- Deriving formulas: gradients, Jacobians, series expansions, perturbation theory
- Checking hand calculations: differentiate/integrate to verify algebra
- Solving ODEs analytically before resorting to numerics
- Generating exact code for numerical kernels (lambdify / codegen)
- Teaching or documenting derivations with executable mathematics

## Core concepts

- **Exact vs floating:** symbols (x, π, √2) stay exact until you ask for numerics — no rounding error accumulates through a derivation; evaluate with evalf only at the end.
- **Assumptions:** declare real/positive/integer on symbols — simplification, integration, and limit results depend on them (√(x²) = |x|, or x if positive).
- **Simplification is a toolbox, not a button:** simplify, expand, factor, cancel, trigsimp, radsimp, nsimplify — each targets different structure; blind simplify() can hang on big expressions.
- **dsolve/pde:** SymPy solves many ODEs analytically (classification-based) and some PDEs by separation — always verify the solution by substitution (checkodesol).
- **Series:** series expansion for asymptotics, perturbation theory, and limits that defeat naive evaluation (0/0 forms).
- **Lambdify/codegen:** turn verified symbolic expressions into NumPy/JAX/C/Fortran functions — exact derivation, fast execution, no transcription errors.

- **Gröbner bases:** algorithmic elimination for polynomial systems — solves (in principle) any system of polynomial equations; the engine behind elimination in algebraic geometry and kinematics.
- **Holonomic functions:** functions satisfying linear ODEs with polynomial coefficients — closure under addition, multiplication, integration; the theoretical basis for automatic identity proving (Zeilberger's algorithm).
- **Symbolic–numeric hybrid:** use exact methods to derive, then numeric methods to evaluate — e.g., exact Jacobian via SymPy, Newton iteration numerically; each does what it's best at.

## Practical workflow

### 1. Set up symbols with assumptions

```python
import sympy as sp
x, t = sp.symbols('x t', real=True)
k, m = sp.symbols('k m', positive=True)
# Assumptions drive simplification: sqrt(k**2) -> k only if k positive
```

1. Declare domains up front — most "SymPy gave a weird answer" cases are missing assumptions.
2. Build expressions programmatically for anything beyond a few terms — hand-typed long expressions contain typos.

### 2. Differentiate, integrate, expand

1. **Verify hand derivations:** differentiate your result and compare with the expected integrand/gradient — a 10-second check that catches sign errors.
2. **Integrals:** try integrate(); if it hangs or returns unevaluated, try manualintegrate, meijerg, or risch — and consider whether a series or numeric answer suffices.
3. **Series:** `expr.series(x, 0, 5)` for perturbation expansions; use `O()` removal deliberately — dropping the order term silently is a bug source.

### 3. Solve equations and ODEs

1. **Algebraic:** solve() for closed forms; nsolve() when closed form fails (supply a good initial guess — it uses Newton).
2. **ODEs:** `dsolve(eq, f(t))` — inspect which hint matched; verify with `checkodesol`; apply initial conditions via ics=.
3. **Linear algebra:** exact eigenvalues, nullspaces, and matrix exponentials for small systems — verify identities (A·A⁻¹ = I) symbolically.

### 4. Generate numerical code

```python
f = sp.lambdify((x, k, m), expr, modules="numpy")
# For repeated heavy use: sp.printing.ccode / fcode, or sympy.utilities.codegen
```

1. Simplify before lambdifying — common-subexpression elimination (cse) can speed the generated code dramatically.
2. Test the generated function against direct evalf at sample points — codegen bugs are silent.
3. For gradients in optimization/ML: lambdify the analytic gradient rather than finite-differencing.

### 5. Verify a numerical method symbolically

1. Derive the method's truncation error by Taylor expansion (SymPy series) — confirm the theoretical order before testing numerically.
2. Check algebraic invariants: does the discretized scheme preserve the continuous conservation law? Substitute and simplify — a scheme that breaks conservation discretely will drift.
3. Generate the method's coefficients (finite-difference stencils, quadrature weights) symbolically, then lambdify — no hand-transcribed numbers to mistype.

## Common pitfalls

- **Missing assumptions:** sqrt(x**2), abs, and piecewise results proliferate without real/positive declarations.
- **simplify() as a hammer:** it can be exponentially slow — target the structure (trigsimp for trig, factor for polynomials, nsimplify for floats).
- **Unevaluated integrals accepted silently:** an Integral object is not an answer — check whether it actually evaluated.
- **Floating-point contamination:** mixing 0.5 with symbols forces approximate arithmetic — use Rational(1,2) to stay exact.
- **Series order confusion:** forgetting the O(x^n) term is still there (or removing it without noting) — track truncation explicitly.
- **Lambdify without verification:** transcription is exact, but the source expression may be wrong — test numerically at known points.
- **Expression swell:** intermediate expressions can explode exponentially (especially with solve/elimination) — simplify incrementally and substitute numbers for known constants early.
- **Branch-cut blindness:** symbolic results with logs, roots, and inverse trig functions carry branch choices — verify numeric equivalence on the domain you actually use.
