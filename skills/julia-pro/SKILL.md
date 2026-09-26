---
name: julia-pro
description: Idiomatic Julia: multiple dispatch, type stability, performance patterns, and scientific computing workflows. Use when writing, reviewing, or structuring Julia code.
category: development
---

# Julia Pro

## Overview

Julia's promise — **high-level expressiveness with C-like speed** — is delivered through multiple
dispatch and JIT compilation, but only when code is *type-stable*. Professional Julia means
designing with dispatch in mind, writing type-stable functions, preallocating where it counts, and
using the ecosystem (DataFrames, JuMP, DifferentialEquations) instead of reinventing numerics.

The through-line: generic functions, concrete types, stable inference — then the compiler makes it fast.

## When to use

- Writing or reviewing Julia for correctness or performance.
- Designing APIs around multiple dispatch.
- Debugging type instability or slow code.
- Structuring Julia packages (modules, environments, testing).
- Scientific computing, optimization, or data workflows.

## Core concepts

- **Multiple dispatch as the design tool.** Functions specialized on argument types —
  `process(x::Float64)` vs `process(x::AbstractArray)` — replace class hierarchies and
  conditionals-on-type. Design *functions* around data, not methods inside classes.
- **Type stability is performance.** A function whose return type depends only on input types
  (inferable by the compiler) compiles to fast code; type-unstable functions (returning `Int`
  sometimes, `Float64` others) force dynamic dispatch and kill speed. `@code_warntype` shows
  instability in red (`Any`, `Union` where you didn't expect them).
- **Concrete field types.** `struct Point { x::Float64; y::Float64 }` — abstractly-typed fields
  (`x::Real`) make every access dynamic. Parametric types (`Point{T<:Real}`) give genericity
  *with* concreteness.
- **Avoid globals in hot code.** Global variables defeat inference (their type can change).
  Pass parameters explicitly, or declare `const` globals (type-fixed after definition).
- **Allocation awareness.** Profile allocations (`@allocated`, `--track-allocation`); preallocate
  outputs in hot loops; prefer views (`@views`) over copies for slices; mutate with `!`-suffixed
  functions where the API supports it. Most Julia slowness is accidental allocation.
- **The ecosystem is the point.** DataFrames.jl, CSV.jl, JuMP, DifferentialEquations.jl,
  Plots/Makie — world-class and composable via dispatch. Don't hand-roll solvers or data frames.

## Practical workflow

1. **Scaffold a package.** `] generate MyPkg` (or PkgTemplates); `Project.toml` + `Manifest.toml`
   (commit the manifest for apps, not for libraries); `test/runtests.jl` with Test stdlib.
2. **Write generic, stable functions.** Small functions, concrete-typed structs, dispatch on
   abstract types in signatures (`f(x::AbstractVector)`) while keeping fields concrete.
3. **Check stability early.** `@code_warntype f(args...)` on hot functions — red `Any`/`Union`
   means fix the types before optimizing anything else.
4. **Benchmark properly.** BenchmarkTools.jl `@btime`/`@benchmark` (with `$` interpolation of
   globals!); compare before/after; profile with `@profview` (ProfileView) or PProf.
5. **Reduce allocations deliberately.** Views, in-place ops, preallocation — but only in measured
   hotspots. Readable allocating code beats clever in-place code everywhere else.
6. **Test and document.** Unit tests for logic, regression tests for numerical results (with
   tolerances — `isapprox`, never `==` on floats), Documenter.jl for package docs.

Idiomatic snippets:

```julia
# Parametric struct: generic AND concrete
struct Measurement{T<:Real}
    value::T
    uncertainty::T
end

# Dispatch replaces conditionals-on-type
area(s::Circle) = π * s.r^2
area(s::Rectangle) = s.w * s.h

# Type-stable: return type follows input type
function mysum(xs::AbstractVector{T}) where T<:Number
    s = zero(T)
    for x in xs
        s += x
    end
    return s
end
```

## Common pitfalls

- **Type-unstable functions.** The #1 Julia performance bug. `if cond; return 1; else; return 1.5; end`
  poisons inference. Make branches return consistent types.
- **Abstractly-typed struct fields.** `struct Foo; x::Real; end` — every field access is dynamic
  dispatch. Always concrete or parametric.
- **Globals in hot loops.** Non-const globals force dynamic lookup per iteration. Pass as arguments
  or mark `const`.
- **Benchmarking wrong.** `@time` includes compilation; forgetting `$` interpolation measures
  global access. Use BenchmarkTools correctly or your "optimizations" are noise.
- **Float equality.** `0.1 + 0.2 == 0.3` is false. `isapprox` with tolerances; never exact equality
  on computed floats.
- **Over-vectorizing.** Dot-broadcasting everything into giant temporary arrays instead of writing
  a fused loop. Dots fuse (`@. a = b*c + d` is one pass) — but sometimes a plain loop is clearest.
- **Ignoring the manifest.** "It worked yesterday" because an unpinned dep updated. Environments
  per project; manifests committed for reproducibility.
