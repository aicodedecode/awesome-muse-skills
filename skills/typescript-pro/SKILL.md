---
name: typescript-pro
description: Idiomatic TypeScript: strict typing, generics, discriminated unions, project setup, and type-driven design. Use when writing or reviewing TypeScript, or configuring TS projects.
category: development
---

# TypeScript Pro

## Overview

TypeScript's value isn't "JavaScript with types sprinkled on" — it's **making illegal states
unrepresentable** so whole bug classes disappear at compile time. This skill covers professional
TypeScript: strict configuration, modeling with the type system (unions, narrowing, branded types),
generics done right, and the tooling setup (build, lint, test) that keeps a TS codebase healthy.

The through-line: let the compiler carry the weight. If a bug is expressible as a type error,
express it.

## When to use

- Starting or configuring a TypeScript project (`tsconfig`, build, lint).
- Modeling domain concepts (states, API payloads, configs) with types.
- Reviewing TS for type-safety gaps (`any` leaks, unchecked narrowing).
- Choosing patterns: generics vs overloads, enums vs unions, classes vs functions.
- Debugging type errors or improving inference in a codebase.

## Core concepts

- **Strict mode is non-negotiable.** `strict: true` (plus `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes` where tolerable). Non-strict TS is documentation-flavored JS;
  strict TS is a proof assistant for your domain logic. Enable on new projects; ratchet up on old.
- **Model states, not flags.** Discriminated unions over boolean soup:
  `{ status: "loading" } | { status: "ok", data: T } | { status: "error", error: E }` — the
  compiler then *forces* every consumer to handle every case. Booleans like `isLoading`,
  `isError` allow impossible combinations the union forbids.
- **Narrowing is the workflow.** Type guards, `in` checks, discriminants, and assertion functions
  turn `unknown` into precise types. Parse at the boundary (API responses, user input) with a
  validation library (zod/valibot) → typed domain objects inside. `any` is a loan shark: convenient
  now, expensive forever.
- **Generics with constraints.** Generic where the *caller* varies the type; constrain with
  `extends` so misuse fails fast. Prefer inference (`function first<T>(xs: T[])`) over explicit
  type arguments at call sites. Reaching for overloads? Often one generic signature is clearer.
- **`unknown` over `any`, `satisfies` over casts.** `unknown` forces handling; `satisfies` checks a
  value against a type without widening it (keeps literal types for exhaustiveness). Type
  assertions (`as`) are escape hatches — each one deserves a comment explaining why it's safe.
- **Types as API design.** Export the types consumers need; keep internals unexported. A change
  that breaks consumers should break compilation loudly, not silently at runtime.

## Practical workflow

1. **Configure strictly from day one:**
   ```json
   { "compilerOptions": {
       "strict": true, "noUncheckedIndexedAccess": true,
       "exactOptionalPropertyTypes": true, "noImplicitReturns": true,
       "moduleResolution": "bundler", "target": "ES2022" } }
   ```
2. **Define the domain model in types first.** States as unions, IDs as branded types
   (`type UserId = string & { readonly brand: unique symbol }`), configs as exact object types.
3. **Validate at boundaries.** API layer parses `unknown` JSON into domain types (zod schema);
   everything downstream trusts the types. One parsing chokepoint per boundary.
4. **Write functions with precise signatures.** Narrow inputs, specific return types (avoid
   `Promise<any>`); use `readonly` for inputs you don't mutate; prefer `ReadonlyArray` in APIs.
5. **Test types where they matter.** `expectTypeOf` assertions for tricky generics; exhaustiveness
   checks (`const _exhaustive: never = state`) so new union members break compilation, not runtime.
6. **Tooling:** `tsc --noEmit` in CI, ESLint with type-aware rules (or biome), Vitest/Jest for
   tests, and `tsup`/`tsc` for builds. Keep `skipLibCheck: true` for sanity.

Idiomatic snippets:

```ts
// Branded IDs prevent mixing them up
type UserId = string & { readonly __brand: "UserId" };
declare function getUser(id: UserId): Promise<User>;

// Exhaustive handling enforced by the compiler
type State = { s: "idle" } | { s: "loading" } | { s: "done"; data: string } | { s: "failed"; err: Error };
function render(st: State): string {
  switch (st.s) {
    case "idle": return "…";
    case "loading": return "…";
    case "done": return st.data;
    case "failed": throw st.err;
  }
}
```

## Common pitfalls

- **`any` creep.** One `any` poisons everything downstream (operations on `any` are `any`).
  Quarantine with `unknown` + narrowing; lint-ban `any` in new code (`@typescript-eslint/no-explicit-any`).
- **Type assertions as lies.** `data as User` without validation — the compiler believes you and
  runtime disagrees. Assert only what you've verified; parse what you haven't.
- **Enums vs unions.** Numeric enums have surprising runtime behavior; string unions
  (`"a" | "b"`) are simpler, tree-shakeable, and interop-friendly. Prefer unions; use `as const`
  objects when you need a runtime map too.
- **Over-generic code.** Generics with 4 type params for a function called twice. Start concrete;
  generalize on the third use.
- **Ignoring `strictNullChecks` fallout.** Non-strict codebases "migrating" by sprinkling `!`
  (non-null assertions) everywhere — you've kept the bugs and lost the safety. Fix the nullability
  model instead.
- **Interface vs type bikeshedding.** For most code they're interchangeable; pick `type` for
  unions/intersections, `interface` for object shapes meant to be extended/implemented — then move on.
- **Not leveraging inference.** Annotating everything (`const x: string = "hi"`) adds noise without
  safety. Annotate boundaries (function signatures, exports); let inference handle locals.
