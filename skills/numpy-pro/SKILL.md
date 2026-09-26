---
name: numpy-pro
description: NumPy guidance — array operations, broadcasting, vectorization, indexing, linear algebra, and performance.
category: development
---

## Overview

NumPy is the foundation of numerical Python: N-dimensional arrays, vectorized operations, and the broadcasting rules that make array code concise and fast. pandas, scikit-learn, and most scientific libraries are built on it — understanding NumPy deeply makes all of them clearer.

This skill covers the NumPy mental model: shapes and strides, broadcasting, advanced indexing, vectorization, linear algebra, and the performance practices (memory layout, views vs copies) that matter at scale.

## When to use

- Writing numerical/array code.
- Understanding broadcasting behavior.
- Vectorizing loops.
- Doing linear algebra (decompositions, solves, eigenvalues).
- Optimizing NumPy performance (views, contiguity, memory).
- Debugging shape mismatches.

## Core concepts

- **ndarray.** Homogeneous typed N-dimensional arrays: `shape`, `dtype`, `strides`. Everything flows from these three — print them when confused.
- **Broadcasting.** Element-wise ops align trailing dimensions; size-1 dimensions stretch. `(3,4) + (4,)` works; `(3,4) + (3,)` doesn't. Learn the rules once and shape bugs become readable.
- **Vectorization.** `a + b`, `np.sqrt(a)`, `a > 0` operate on whole arrays in C — Python loops over arrays are the cardinal sin (100x+ slower). `np.where`, `np.select` for conditional logic.
- **Indexing.** Basic slicing (views!), boolean masks (`a[a > 0]`), fancy indexing (`a[[0, 2, 4]]` — copies), `np.ix_` for outer indexing. Slice = view (mutation visible); fancy = copy — know which you have.
- **Views vs copies.** Slices and `reshape` (usually) are views — modifying them modifies the original. `.copy()` when independence matters. This aliasing is the source of subtle bugs and the enabler of zero-copy performance.
- **Reshaping.** `reshape`, `ravel`/`flatten` (view vs copy!), `transpose`/`.T`, `newaxis`/`None` for adding dimensions (`a[:, None]` turns (n,) into (n,1) for broadcasting). `-1` infers a dimension.
- **Reductions.** `sum`/`mean`/`max` with `axis=` — axis semantics (which dimension collapses) is the key concept; `keepdims=True` for broadcasting the result back.
- **Stacking/splitting.** `concatenate`, `stack`, `vstack`/`hstack`, `split`/`array_split` — assembling and disassembling arrays along axes.
- **Linear algebra.** `np.linalg`: `solve` (never invert explicitly — `inv` then multiply is slower and less stable), `lstsq`, `eig`/`svd`/`qr`, `norm`. `@` for matmul. Prefer `solve` over `inv` always.
- **Random.** `np.random.default_rng(seed)` (the modern Generator API — not the legacy global functions) for reproducible randomness: `integers`, `normal`, `choice`, `permutation`, `shuffle`.
- **Dtypes.** `float64`/`float32`, `int64`/`int32`, bool — precision vs memory/speed; overflow in integer ops (uint8 image arithmetic!); use `result_type`/`astype` deliberately.
- **Memory layout.** C-order (row-major) vs F-order; contiguous arrays are faster for vectorized ops; `ascontiguousarray` before heavy computation; strided views (via `as_strided`/sliding_window_view) for windowed ops without copies.
- **NaN handling.** `np.nan` semantics (comparisons false, propagation), `nansum`/`nanmean`, `isnan`/`isinf` checks. NaNs poison silently — validate inputs.
- **Structured/edge tools.** `np.einsum` (expressive tensor contractions — learn it for complex products), `np.vectorize` (convenience, NOT performance), masked arrays for missing data, `np.pad`, `np.clip`, `np.digitize`/`searchsorted` for binning.
- **Interop.** The `__array__` protocol — pandas Series/DataFrames, torch tensors, and others convert freely; zero-copy via `__array_interface__`/DLPack where supported.
- **Masked arrays.** `np.ma` for data with invalid entries — operations skip masked values without NaN contagion; cleaner than NaN sentinels for some workflows.
- **Built-in analytics.** `np.polyfit`, `np.percentile`, `np.histogram`, `np.corrcoef`, `np.unique(return_counts=True)` — the statistics helpers that avoid hand-rolling.

## Practical workflow

1. **Think in shapes.** Before writing, sketch the shapes: input (n,d), weights (d,k), output (n,k). Most NumPy code is shape choreography.
2. **Broadcast deliberately.** Add dimensions with `None` to align; verify with a small example:
   ```python
   # pairwise distances without loops: (n,d) vs (m,d) -> (n,m)
   diff = X[:, None, :] - Y[None, :, :]   # (n,1,d) - (1,m,d) -> (n,m,d)
   dists = np.sqrt((diff ** 2).sum(axis=-1))
   ```
3. **Index precisely.** Slices for views, boolean masks for filtering, fancy indexing for reordering — and know which copies:
   ```python
   row_norms = np.linalg.norm(A, axis=1, keepdims=True)
   A_normalized = A / row_norms          # broadcasting (n,1) over (n,d)
   top_k_idx = np.argsort(scores)[-k:]   # fancy index -> copy
   ```
4. **Reduce along axes.** `axis=` semantics explicit; `keepdims` for downstream broadcasting; `where=` for masked reductions.
5. **Solve, don't invert.** `np.linalg.solve(A, b)`; `lstsq` for overdetermined; check `cond` for ill-conditioning.
6. **Seed RNG properly.** `rng = np.random.default_rng(42)` per experiment; never the legacy global API in new code.
7. **Mind memory.** Views where possible; `out=` parameters to avoid temporaries in hot loops; contiguity before heavy ops; chunked processing for arrays bigger than RAM (or reach for dask/zarr).
8. **Validate numerics.** Check for NaN/inf after risky ops; assert shapes in functions (`assert a.shape == (n, d)`); test against naive loop implementations on small inputs.

## Common pitfalls

- **Python loops over arrays** — the cardinal sin; vectorize (100x+).
- **Broadcasting surprises** — `(n,)` aligning unexpectedly; add explicit dimensions with `None`.
- **View aliasing bugs** — modifying a slice mutates the original; `.copy()` when independent.
- **`flatten` vs `ravel` confusion** — copy vs maybe-view; know which you need.
- **Inverting matrices** — `inv(A) @ b` instead of `solve(A, b)`; slower and less stable.
- **Integer overflow** — uint8 arithmetic wrapping; upcast before math.
- **NaN propagation** — silent poisoning; `isnan` checks and `nan*` reductions.
- **Legacy random API** — global `np.random.seed` in libraries; `default_rng` per use.
- **Axis confusion** — reducing the wrong dimension; verify on small examples.
- **Fancy indexing copies** — expecting view semantics; it copies.
- **`np.vectorize` for speed** — it's convenience, not performance; still Python-level.
- **Non-contiguous slowness** — strided views in hot loops; `ascontiguousarray`.
- **Shape (n,) vs (n,1)** — 1-D vs 2-D mismatches; be explicit with dimensions.
- **Using lists where arrays belong** — Python-list arithmetic failing or looping; convert at boundaries (`np.asarray`).
- **Forgetting `dtype` in constructors** — `np.zeros(n)` defaulting to float64; specify dtype deliberately.
- **Exact float equality** — `a == b` on floats; use `np.isclose`/`np.allclose`.
