---
name: linear-algebra-practice
description: Applied linear algebra — decompositions, least squares, conditioning, and numerical habits for real matrices.
category: scientific
---

## Overview

Linear algebra is the computational substrate of science: every fit,
simulation, and data analysis reduces to matrix operations. This skill
covers choosing the right decomposition (LU, QR, SVD, eigendecomposition),
solving least-squares problems properly, understanding conditioning and
stability, and the numerical habits (never invert explicitly, exploit
structure) that separate working code from slow, wrong code.

## When to use

- Solving linear systems or least-squares problems
- Choosing between SVD, QR, eigendecomposition, Cholesky for a task
- Diagnosing numerical instability: huge condition numbers, rank deficiency
- Dimensionality reduction (PCA), low-rank approximation, pseudoinverses
- Reviewing numerical code for stability and efficiency

## Core concepts

- **The decompositions and their jobs:** LU (general square systems), Cholesky (symmetric positive-definite — 2× faster than LU), QR (least squares, orthogonalization), SVD (rank, pseudoinverse, PCA — the most revealing, most expensive), eigendecomposition (symmetric/Hermitian only for guaranteed orthogonal eigenvectors).
- **Condition number κ:** κ = σ_max/σ_min — measures error amplification; κ ~ 10^k means losing ~k digits. A large κ is a property of the problem, not the algorithm — regularize or reformulate.
- **Least squares done right:** solve via QR or SVD, never via the normal equations (AᵀA squares the condition number: κ²). `lstsq` with SVD is the safe default.
- **Rank and nullspace:** SVD reveals numerical rank (singular values near zero), nullspace (right singular vectors), and range — the diagnostic toolkit for degenerate problems.
- **Sparsity and structure:** sparse (scipy.sparse), banded, Toeplitz, Kronecker — structured solvers are orders of magnitude faster; forming a dense matrix from a sparse problem is the classic performance bug.
- **Floating point:** double precision has ~16 digits; catastrophic cancellation (subtracting nearly equal numbers) and overflow in naive formulas (use hypot, log-sum-exp) are the perennial traps.

- **Krylov subspace methods:** CG, GMRES, Lanczos build solutions in expanding Krylov spaces — matrix-free (only matvecs needed), the only option for million-degree-of-freedom systems; preconditioning makes or breaks them.
- **Randomized algorithms:** randomized SVD and sketching give near-optimal low-rank approximations in a fraction of the time — the practical tool for huge dense matrices in data science.
- **Tensor decompositions:** CP and Tucker generalize SVD to multiway arrays — compression and latent-structure discovery for multidimensional scientific data.

## Practical workflow

### 1. Solve systems correctly

```python
import numpy as np
from scipy import linalg
# Least squares via SVD (safe default); never form inv(A) or A.T @ A
x, residuals, rank, sv = linalg.lstsq(A, b)
# Check conditioning before trusting the answer
kappa = sv[0] / sv[-1]
```

1. Never compute the matrix inverse explicitly — solve the system (`solve`, `lstsq`) instead.
2. Check κ (or the singular-value spectrum) routinely; if κ > 1/√ε (~10⁸ in double), treat results as suspect.
3. For SPD systems use Cholesky; for least squares use QR/SVD — match the decomposition to the structure.

### 2. Diagnose trouble

1. **Huge κ:** rescale columns (column equilibration), remove collinear features, or regularize (ridge/Tikhonov: minimize ‖Ax−b‖² + λ‖x‖², choosing λ by L-curve or cross-validation).
2. **Rank deficiency:** inspect small singular values and their vectors — they tell you which combinations of variables are unidentifiable.
3. **Residual analysis:** large residuals + small κ = model wrong; small residuals + huge κ = solution unstable — different diseases, different cures.

### 3. Exploit structure

1. Sparse systems: iterative solvers (CG for SPD, GMRES/BiCGSTAB general) with preconditioners (incomplete Cholesky/LU) — direct sparse factorization for moderate sizes.
2. Use matrix-free formulations (linear operators) when A is too big to form — common in inverse problems and PDE-constrained optimization.
3. Randomized SVD for huge matrices when only the top-k singular vectors are needed.

### 4. PCA and low-rank work

1. Center (and consider scaling) before PCA — the first component of uncentered data is usually the mean.
2. Choose rank by the singular-value spectrum (elbow, or a variance threshold) and validate that discarded components are noise (compare against a shuffled null).
3. Remember PCA is variance-maximizing, not signal-maximizing — high-variance components can be artifacts (batch effects, trends).

### 5. Solve a large sparse system iteratively

1. Choose the solver for the structure: CG for symmetric positive-definite, GMRES/BiCGSTAB otherwise — and always precondition (incomplete Cholesky/LU, or algebraic multigrid for PDE-derived systems).
2. Monitor the residual norm and the true error (they differ) — set tolerances on the quantity you actually care about.
3. Verify against a direct solve on a small version of the problem — iterative solvers with bad preconditioners converge to wrong answers slowly and confidently.

## Common pitfalls

- **Explicit inverses:** `inv(A) @ b` is slower and less accurate than `solve(A, b)` — always.
- **Normal equations:** forming AᵀA squares the condition number — the textbook method that fails in practice.
- **Ignoring κ:** publishing solutions from κ ~ 10¹² systems as if they were precise.
- **Uncentered PCA:** first component captures the mean, not the interesting variation.
- **Dense treatment of sparse problems:** forming a million×million dense matrix instead of using sparse/iterative methods.
- **Single precision by accident:** float32 halves your digits — fine for ML, dangerous for ill-conditioned solves; check dtypes.
- **Iterative solver without preconditioning:** unpreconditioned Krylov methods on ill-conditioned systems stall for thousands of iterations — preconditioning is not optional.
- **Confusing residual with error:** a small residual with an ill-conditioned matrix still means a large error — bound the error by κ times the residual.
