---
name: debugging-pro
description: Systematic debugging: reproduce, isolate, hypothesize, verify — with tooling for hard bugs. Use when stuck on a bug, flaky failure, or production incident.
category: development
---

# Debugging Pro

## Overview

Debugging is **applied scientific method**: reproduce reliably, form hypotheses, test them with
experiments, and verify the fix — not staring at code hoping for insight. Professionals debug
*faster* not because they're smarter, but because they're systematic: they bisect instead of
guessing, instrument instead of assuming, and fix root causes instead of symptoms.

The through-line: make the bug reproducible, shrink the search space ruthlessly, and never "fix"
what you can't explain.

## When to use

- Stuck on a bug that isn't obvious from reading code.
- Flaky tests or intermittent production failures.
- Production incidents requiring root-cause analysis.
- Performance degradations with unclear cause.
- Coaching systematic debugging habits.

## Core concepts

- **Reproduce first, always.** A bug you can't reproduce is a bug you can't verify fixed. Capture
  the exact inputs, environment, and sequence. If it's intermittent, instrument to *make* it
  reproducible (logging, deterministic seeds, stress loops) before theorizing.
- **Bisect the search space.** Half-split: does it happen with this half of the input/code?
  `git bisect` for regressions (find the exact commit), binary search on inputs, disable halves
  of features. Each bisection halves the suspect area — logarithmic debugging beats linear reading.
- **Hypothesize and test, don't guess and patch.** State the hypothesis explicitly ("the cache
  returns stale data because the key omits the tenant"), design the *smallest experiment* that
  distinguishes it (log the key), run it. One variable at a time.
- **Read the error completely.** Stack traces, error codes, and logs contain the answer more
  often than not — read top to bottom, follow the *first* failure (cascades mislead), and check
  the *caused by* chain. Most "mysterious" bugs are unread error messages.
- **Rubber-duck with precision.** Explaining the code's *actual* behavior (not intended behavior)
  line by line surfaces the gap between assumption and reality. The bug is always in the gap.
- **Fix the cause, verify the fix.** A fix you can't explain is a coincidence. After fixing:
  reproduce the original failure on the old code path (or via test), confirm it's gone, and add
  a regression test that fails without the fix.

## Practical workflow

1. **Stabilize the reproduction.** Script it: exact command, seed, dataset. `while` loop it for
   flakes until you can trigger on demand. No repro → instrument first (add logging around
   suspects, increase verbosity).
2. **Check the obvious systematically.** Recent changes (`git log` on the area), environment drift
   (versions, config, data), and the error message itself — fully read. 50% of bugs die here.
3. **Narrow with bisection.** `git bisect` for "it worked last week"; input minimization
   (delta debugging) for "this input crashes it"; feature flags to isolate subsystems.
4. **Instrument, don't guess.** Debugger breakpoints with conditions, targeted logging (with
   request IDs), profilers for perf bugs, sanitizers for memory bugs. Observe the *actual*
   values at the suspect point — assumptions are where bugs hide.
5. **Form and test hypotheses.** Write down 2–3 candidate causes ranked by likelihood; test the
   cheapest-to-verify first. Kill hypotheses with evidence, don't defend them.
6. **Fix, regress-test, and document.** Minimal fix at the root cause; regression test that
   fails pre-fix; note the mechanism in the commit message (future debuggers thank you).

Debugging toolkit by bug type:

```text
Logic bug        → debugger + targeted logging + rubber-duck the actual flow
Regression       → git bisect → offending commit → review the diff
Flaky test       → run in loop (100x), vary seed/order/parallelism; check shared state
Memory corruption→ ASan/Valgrind; reduce input; watchpoints on corrupted address
Deadlock         → thread dumps (jstack, py-spy, SIGQUIT); lock-order analysis
Perf regression  → profiler before/after; flame graphs; check data growth, not just code
Heisenbug        → more logging changes timing: use tracing/external observation instead
```

## Common pitfalls

- **Guessing and patching.** Changing code based on vibes, then "testing" by hoping. Each change
  should test a hypothesis; unexplained fixes are future regressions.
- **Debugging the cascade.** Chasing the 10th error in a cascade instead of the first. Always
  start at the earliest failure — later errors are usually consequences.
- **Assuming the new code is guilty.** "It worked before my change" — but also check: did the
  data change? the environment? the dependency? `git stash` and re-test to isolate.
- **Print-debugging everything.** `console.log` in 20 places instead of one conditional
  breakpoint. Logs for flows, debugger for state — use the right instrument.
- **Fixing symptoms.** Null-checking the crash site instead of asking why it's null. The crash
  is the messenger; the bug is upstream.
- **Not reproducing before fixing.** "I think I see it" → change → "seems fine now." Without a
  repro you can't distinguish fixed from hidden.
- **Skipping the regression test.** The same bug returns in six months because nothing pins the
  fix. Every debugged bug earns a test that fails without the fix.
