---
name: zig-pro
description: Idiomatic Zig: explicit allocators, comptime, error unions, and no-hidden-control-flow philosophy. Use when writing, reviewing, or structuring Zig programs.
category: development
---

# Zig Pro

## Overview

Zig's philosophy — **no hidden control flow, no hidden allocations, explicit everything** — makes
it a superb systems language for those willing to be explicit. Professional Zig means embracing
that explicitness: allocators passed as parameters, errors as values in the type system,
`comptime` for principled metaprogramming, and defer-based cleanup as a way of life.

The through-line: if something happens, you can see it in the code. That's the whole point.

## When to use

- Writing or reviewing Zig code for idiom and correctness.
- Designing APIs around allocators and error sets.
- Using comptime for generics and metaprogramming.
- Structuring Zig projects (build.zig, modules, packages).
- Debugging memory, allocator, or error-handling issues.

## Core concepts

- **Allocators are parameters, not globals.** Functions that allocate take an
  `std.mem.Allocator`. This makes allocation visible, testable (use a `FixedBufferAllocator` or
  testing allocator that detects leaks in tests), and flexible (arena for request-scoped work,
  GPA for long-lived). Never hide allocation.
- **Errors are values.** Error unions (`!T` = `T` or error) with `try`/`catch`; error sets inferred
  or declared explicitly for public APIs. `try` propagates with zero hidden machinery. Handle
  errors where you have context; propagate where you don't.
- **Defer + errdefer for cleanup.** `defer` runs at scope exit; `errdefer` runs only on error
  return — the precise tool for "free this if we fail partway." Together they replace RAII with
  visible, local reasoning.
- **Comptime is principled metaprogramming.** Generics via `comptime` parameters, type introspection
  via `@typeInfo`, and compile-time code generation — all type-checked, all visible. Prefer it over
  runtime polymorphism for performance-critical generic code.
- **Slices, arrays, and sentinels.** Zig distinguishes `[N]T`, `[]T`, `[]const u8`, and
  sentinel-terminated slices (`[:0]u8` for C interop). Know which you have; the type tells you the
  lifetime and mutability story.
- **Testing is built in.** `test` blocks colocated with code, `std.testing` with the
  leak-detecting allocator — `std.testing.allocator` fails tests on leaks. Run `zig build test`
  in CI; memory correctness is tested, not hoped for.

## Practical workflow

1. **Scaffold with the build system.** `zig init`; `build.zig` declares executables, tests, and
   options; modules for namespacing. Pin the Zig version — the language still evolves.
2. **Choose allocators deliberately.** Arena per request/frame for batch work (free once);
   GPA (`std.heap.GeneralPurposeAllocator`) with leak checking in dev/tests; fixed buffers for
   no-alloc hot paths. Pass the allocator down; document who frees.
3. **Write error sets explicitly on public APIs.** `error{OutOfMemory, InvalidFormat}` in the
   signature tells callers exactly what can go wrong — better than inferred sets leaking
   implementation details.
4. **Structure for testability.** Pure functions on slices; I/O at the edges; `test` blocks next
   to the code they cover, using `std.testing.allocator` so leaks fail the test.
5. **Use comptime where it earns its keep.** Generic containers/algorithms, compile-time lookup
   tables, and type-driven APIs. Keep comptime code readable — it's still code someone maintains.
6. **Interop with C carefully.** `@cImport` for headers; sentinel slices for C strings; be explicit
   about ownership across the boundary (who frees what, in which allocator).

Idiomatic snippets:

```zig
const std = @import("std");

// Allocator in, error union out, errdefer for partial-failure cleanup
fn readAll(allocator: std.mem.Allocator, path: []const u8) ![]u8 {
    const file = try std.fs.cwd().openFile(path, .{});
    defer file.close();
    const stat = try file.stat();
    const buf = try allocator.alloc(u8, stat.size);
    errdefer allocator.free(buf);
    _ = try file.readAll(buf);
    return buf; // caller owns buf, frees with the same allocator
}

// Test with leak detection
test "readAll roundtrip" {
    const allocator = std.testing.allocator;
    const data = try readAll(allocator, "testdata/hello.txt");
    defer allocator.free(data);
    try std.testing.expectEqualStrings("hello\n", data);
}
```

## Common pitfalls

- **Hiding the allocator.** Stashing a global allocator to avoid threading it through — defeats
  testability and the language's core promise. Pass it explicitly.
- **Leaking on error paths.** Allocating three things and returning early on the third failure
  without freeing the first two. `errdefer` exists precisely for this — use it at each step.
- **Ignoring error sets in public APIs.** Inferred error sets on exported functions leak internal
  errors to callers and break API stability. Declare them.
- **Comptime overuse.** Turning simple runtime logic into comptime puzzles hurts compile times
  and readability. Comptime for generics and tables; runtime for the rest.
- **Slice lifetime confusion.** Returning a slice into a stack buffer or a freed arena — the
  compiler won't save you here. Document lifetimes; prefer owned returns with clear ownership.
- **Fighting the "no hidden control flow" rule.** Trying to build exception-like or
  GC-like abstractions on top. Work with the language: explicit errors, explicit allocators,
  explicit cleanup.
- **Version drift.** Zig's rapid evolution means code written for 0.11 may not compile on 0.13.
  Pin versions in CI and read release notes on upgrade.
