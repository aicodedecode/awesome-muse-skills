---
name: reviewing-code-for-science
description: Reviewing scientific code — correctness, reproducibility, numerical soundness, and constructive feedback.
category: scientific
---

## Overview

Scientific code review differs from software code review: the primary
question is whether the code correctly implements the science, not
whether it follows style guides. This skill covers reviewing for
correctness (algorithms, units, edge cases), reproducibility
(environments, seeds, versions), numerical soundness, and giving
feedback that improves both the code and the science it produces.

## When to use

- Reviewing code accompanying a manuscript or in a pull request
- Auditing a collaborator's analysis pipeline before trusting its output
- Checking reproducibility of published computational results
- Setting code-review standards for a lab or project
- Deciding whether code is "good enough" to archive with a paper

## Core concepts

- **Correctness over style:** a PEP8-perfect script that integrates the wrong equation is worse than ugly code that's right — prioritize the science, then the engineering.
- **The reimplementation test:** can you understand what the code does well enough to reimplement it? If not, it's either too clever or undocumented — both are review findings.
- **Reproducibility stack:** code + data + environment (dependencies, versions) + random seeds + documentation — a review checks all five, not just the .py files.
- **Numerical soundness:** floating-point behavior, stability of algorithms, convergence of iterative methods, unit consistency — the silent killers of scientific code.
- **Test coverage for science:** unit tests for mathematical functions (against known analytical solutions), regression tests for pipelines, and invariant checks (conservation laws, symmetries) — not just "does it run".
- **Provenance:** every output traceable to inputs + code version + parameters — the minimum for code that supports published claims.

- **Dependency and environment review:** pinned versions, declared system dependencies, containerization (Docker/conda-lock) — "works on my machine" is the most common reproducibility failure and it's checkable in minutes.
- **Randomness audit:** seeds set for every stochastic component (data splits, initialization, sampling) with the seed values recorded — unseeded code can't be verified, only admired.
- **Provenance chains:** every figure/table traceable to code version + data version + parameters — the minimum standard for code supporting published claims; check one figure end-to-end.

## Practical workflow

### 1. Get it running

1. Follow the README/docs to set up the environment — if you can't reproduce the setup, that's finding #1.
2. Run the tests; run the main pipeline on the provided example data — note runtime, memory, and any warnings.
3. Check that outputs match the paper's reported numbers/figures (bit-identical not required; scientifically identical required).

### 2. Review the science first

1. **Algorithms:** does the implementation match the described method? Check formulas against the paper — transcription errors (sign flips, off-by-one, wrong normalization) are the classic bugs.
2. **Units and conventions:** consistent throughout? Coordinate frames, angle units, index conventions (0- vs 1-based across languages) documented?
3. **Edge cases:** empty inputs, NaNs, single-element arrays, boundary conditions — scientific code fails most often where the author didn't look.
4. **Statistics:** correct tests, assumptions checked in code (not just assumed), multiple comparisons handled, random seeds set for stochastic parts.

### 3. Review the engineering

1. **Readability:** meaningful names, functions with single responsibilities, comments explaining why (not what) — you'll reread this code in two years.
2. **No magic numbers:** physical constants and tuning parameters named, sourced, and documented — "0.017" without a comment is a bug waiting to happen.
3. **Dependencies:** pinned versions (requirements.txt/environment.yml), no undeclared imports, no "works on my machine" system dependencies.
4. **Performance sanity:** vectorized where it matters, no accidental O(n²) on large data — but don't demand optimization of code that's fast enough.

### 4. Write the review

1. Separate blocking issues (wrong results, irreproducible) from suggestions (refactoring, style).
2. For each blocking issue: what's wrong, why it matters scientifically, and a concrete fix or test that would resolve it.
3. Acknowledge what's good — authors respond better, and it records what shouldn't change.

### 5. Review for performance and scale honesty

1. Check complexity claims: is that O(n²) loop actually fine at the stated data sizes, or does it silently assume small inputs?
2. Look for accidental quadratic behavior in data pipelines (nested loops over growing frames) — the most common performance bug in analysis code.
3. Verify memory usage on realistic inputs — code tested on 1% samples that OOMs on full data is not "working code".

### 6. Quick-reference checklist

- [ ] Code RUNS in a clean environment (container/lockfile)
- [ ] Seeds set for every stochastic component
- [ ] One published figure traced end-to-end to code + data + parameters
- [ ] Science-to-code transcription verified (formulas, signs, units)
- [ ] No test-set or target leakage anywhere in the pipeline
- [ ] Input validation and physical sanity checks present
- [ ] Dependency versions pinned and declared
- [ ] Major issues fixed first; style nits flagged for the linter

## Common pitfalls

- **Style-only reviews:** 50 comments on formatting, zero on whether the integration is correct — invert the priority.
- **"Looks right to me":** approving without running anything — the minimum review runs the code.
- **Untested numerics:** no test against an analytical solution — the single most valuable test in scientific code, and the most often missing.
- **Seedlessness:** stochastic code without set seeds — results that can't be reproduced can't be reviewed.
- **Data/code version drift:** reviewing code that doesn't match the paper's results because the data changed — pin everything.
- **Perfectionism:** demanding production software engineering from a research script — calibrate to the code's purpose and lifespan.
- **Approving without running:** the minimum viable review executes the code — static reading misses environment, data-path, and version issues every time.
- **Nitpicking style while missing a sign error:** prioritize the science-to-code transcription; formatting debates can wait for the linter.
