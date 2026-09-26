---
name: c-pro
description: Professional C: memory ownership, defensive programming, build hygiene, and systems-level correctness. Use when writing, reviewing, or maintaining C code.
category: development
---

# C Pro

## Overview

C gives you **absolute control and zero safety net**: every allocation, every bound, every
lifetime is your responsibility. Professional C is therefore a discipline of *explicit contracts*
— who owns this memory, who frees it, what are the valid inputs — enforced by convention,
assertions, sanitizers, and relentless simplicity.

This skill covers writing C that's correct, readable, and maintainable: ownership discipline,
defensive interfaces, build hygiene, and the tooling that compensates for the language's lack of
guardrails.

## When to use

- Writing or reviewing C for correctness and safety.
- Designing C APIs (ownership, error reporting, lifetimes).
- Debugging memory corruption, leaks, or undefined behavior.
- Structuring C projects (build systems, modularization).
- Maintaining or hardening legacy C codebases.

## Core concepts

- **Ownership is a documented contract.** Every allocation site answers: who frees this, and when?
  Encode it in naming (`create_`/`destroy_`, `_new`/`_free` pairs) and document it on every function
  that transfers ownership. Consistent conventions beat clever ones.
- **Defensive interfaces.** Validate inputs at API boundaries (`NULL` checks, range checks, buffer
  sizes passed explicitly — never trust `strlen` on untrusted input). Return error codes or use
  out-params for errors; never fail silently. `assert` for internal invariants (programmer errors),
  runtime checks for external data.
- **Bounded everything.** `snprintf` not `sprintf`, `strncpy`-with-care (or better, `snprintf`),
  explicit lengths on every buffer operation. Buffer overflows remain the classic C vulnerability —
  the fix is boring and total: never write without knowing the bound.
- **Simple control flow, small functions.** C punishes cleverness disproportionately. Flat
  functions, early returns, one exit path for cleanup (`goto cleanup` is idiomatic C — used
  consistently, it's clearer than nested conditionals for resource teardown).
- **Opaque types for encapsulation.** `typedef struct Foo Foo;` in the header, full definition in
  the `.c` file — clients can't poke internals, and you're free to change representation. C's
  answer to private members.
- **The build is part of the program.** `-Wall -Wextra -Werror -Wpedantic`, sanitizers (ASan/UBSan)
  in test builds, `-fstack-protector`, and warnings reviewed — not suppressed. The compiler is
  your only static analyzer unless you add more (clang-tidy, cppcheck).

## Practical workflow

1. **Set compiler flags first.** `-std=c17 -Wall -Wextra -Werror -Wpedantic -g` for dev;
   sanitizer builds (`-fsanitize=address,undefined`) for tests; hardened flags for release.
2. **Design the API before the implementation.** Header first: types, ownership comments,
   error conventions. If the header needs a paragraph to explain, simplify the API.
3. **Write with the cleanup pattern.** Single exit with `goto cleanup` for functions acquiring
   multiple resources — consistent, reviewable, exception-free RAII:
   ```c
   int process(const char *path) {
       FILE *f = NULL; char *buf = NULL; int rc = -1;
       f = fopen(path, "r");
       if (!f) goto cleanup;
       buf = malloc(BUF_SIZE);
       if (!buf) goto cleanup;
       /* ... work ... */
       rc = 0;
   cleanup:
       free(buf);
       if (f) fclose(f);
       return rc;
   }
   ```
4. **Test with sanitizers.** Unit tests (cmocka/unity/greatest) run under ASan+UBSan in CI;
   fuzz anything parsing untrusted input (AFL++/libFuzzer).
5. **Check resources systematically.** Every `malloc` has a `free` on all paths; every `fopen` a
   `fclose`; every lock an unlock. Review diffs specifically for the error paths — that's where
   leaks live.
6. **Document the non-obvious.** Thread-safety guarantees, reentrancy, signal-safety, and
   ownership — in the header, where callers will see it.

## Common pitfalls

- **Use-after-free / double-free.** The classic. Clear pointers after free in complex teardown
  (`free(p); p = NULL;`), keep ownership single and obvious, and let ASan prove it.
- **Off-by-one and missing NUL.** `char buf[16]; strncpy` without termination, `<=` vs `<` in
  loops over buffers. Write the bound, then re-read it — or better, use `snprintf` and check its
  return.
- **Ignoring return values.** `malloc` can return NULL; `fread` can short-read; `snprintf` reports
  truncation. Unchecked returns are latent crashes — `-Wunused-result` helps for annotated functions.
- **Undefined behavior rationalized.** "It works" with signed overflow, strict-aliasing violations,
  or data races. UBSan + `-fstrict-aliasing` warnings exist because the optimizer *will* exploit UB.
- **Global mutable state.** Hidden coupling, untestable functions, thread-unsafety. Pass context
  structs explicitly; keep globals `const` or don't have them.
- **Clever macros.** Multi-statement macros without `do { } while(0)`, macros with side-effecting
  arguments evaluated twice, macro "generics" hiding type errors. Prefer `static inline` functions.
- **No bounds on input parsing.** `scanf("%s")`, `gets` (removed from the language for a reason),
  hand-rolled parsers without length discipline. Parse defensively or use a tested library.
