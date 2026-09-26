---
name: elixir-pro
description: Idiomatic Elixir: functional design, OTP supervision, GenServers, Ecto, and Phoenix patterns. Use when writing, reviewing, or structuring Elixir applications.
category: development
---

# Elixir Pro

## Overview

Elixir's superpower — **fault-tolerant, concurrent systems via OTP on the BEAM** — comes with a
philosophy: let processes crash and supervisors restart them; keep state isolated in processes;
model with pure functions and pipelines. Professional Elixir means thinking in processes and
supervision trees, writing small composable functions, and using Phoenix/Ecto idiomatically.

The through-line: embrace "let it crash" — but design the supervision tree so crashes don't matter.

## When to use

- Writing or reviewing Elixir code for idiom and OTP correctness.
- Designing supervision trees, GenServers, and concurrent workflows.
- Structuring Phoenix applications (contexts, Ecto schemas, LiveView).
- Debugging process crashes, mailbox buildup, or supervision issues.
- Choosing between processes, Tasks, Agents, and ETS.

## Core concepts

- **Functional core.** Immutable data, pure functions, pattern matching in function heads, and the
  pipe operator (`|>`) for data transformation pipelines. Side effects pushed to the edges;
  business logic as composable pure functions that are trivial to test.
- **"Let it crash" (with supervision).** Don't defensively code every failure — write the happy
  path clearly, and let supervisors restart failed processes to a known-good state. The discipline
  is in the supervision tree design: which restarts, in what order, with what intensity limits.
- **Processes are cheap; choose the right abstraction.** `Task` for one-off async work,
  `GenServer` for stateful services, `Agent` for simple state (rarely — prefer GenServer),
  ETS for shared in-memory lookup (with ownership discipline), Broadway for data pipelines.
  Don't reach for GenServer when a pure function suffices.
- **Phoenix contexts as boundaries.** `Accounts`, `Orders`, `Billing` — contexts group related
  functionality and are the public API of that domain. Controllers/LiveViews talk to contexts,
  never directly to Ecto schemas across boundaries. This is where your architecture lives.
- **Ecto: changesets for validation, queries composed.** Changesets cast + validate at the
  boundary (never trust params); composable `Ecto.Query` for readable data access; database
  constraints as the final integrity guarantee; migrations backward-compatible.
- **Pattern matching over conditionals.** Multi-clause functions dispatching on shape
  (`handle_call({:deposit, amt}, _, %{balance: b})`) — clearer than nested `if`s and the compiler
  warns on unreachable or non-exhaustive patterns in many cases.

## Practical workflow

1. **Start with pure functions.** Model the domain as data transformations; test them without
   processes, databases, or mocks — this is where most logic should live.
2. **Design the supervision tree.** Draw it: which workers, which supervisors, restart strategies
   (`one_for_one` vs `one_for_all` vs `rest_for_one`), max restarts. Stateless workers restart
   trivially; stateful ones need a recovery story (rebuild from DB, not from memory).
3. **Build Phoenix contexts.** One context per domain; public functions with clear contracts;
   Ecto schemas private to the context where possible.
4. **Handle concurrency deliberately.** `Task.async_stream` for bounded parallel work with
   backpressure; GenServer `call` (sync, with timeouts) vs `cast` (async, no backpressure —
   beware mailbox flooding); monitor don't link across trust boundaries.
5. **Observe the BEAM.** `:observer` in dev, telemetry + Prometheus/Grafana in prod; watch
   process counts, mailbox sizes, and memory — BEAM systems fail in BEAM-specific ways (a
   GenServer mailbox growing unboundedly is the classic).
6. **Test in layers.** ExUnit for pure functions (fast, async); context tests with Ecto sandbox;
   LiveView tests for critical interactions; property-based tests (StreamData) for tricky logic.

Idiomatic snippets:

```elixir
# Pipeline + pattern matching over conditionals
def checkout(cart, user) do
  cart
  |> validate_cart()
  |> apply_discounts(user)
  |> charge_payment()
  |> create_order()
end

defp apply_discounts({:error, _} = err, _user), do: err
defp apply_discounts({:ok, cart}, %{tier: :gold}), do: {:ok, Discounts.gold(cart)}
defp apply_discounts({:ok, cart}, _user), do: {:ok, cart}

# Bounded concurrency with backpressure
urls
|> Task.async_stream(&fetch/1, max_concurrency: 10, timeout: 5_000)
|> Enum.map(fn {:ok, result} -> result end)
```

## Common pitfalls

- **GenServer for everything.** Wrapping pure logic in GenServers "for concurrency" serializes
  work through one process and creates bottlenecks. Processes for state/lifecycle; functions for logic.
- **Unbounded casts.** `GenServer.cast` with no backpressure under load → mailbox grows until the
  VM struggles. Prefer `call` with timeouts, or add explicit backpressure (GenStage/Broadway).
- **State that can't be rebuilt.** Keeping critical state only in process memory with no recovery
  path. Supervisors restart processes; they don't restore amnesia — persist or rebuild.
- **Leaking Ecto across contexts.** Controllers reaching into another context's schemas couples
  domains. Contexts are APIs; respect them.
- **Stringly-typed everything.** Atoms for known fixed sets (careful: atoms aren't GC'd — never
  `String.to_atom` on user input; use `to_existing_atom`), structs for domain data, not bare maps
  passed six functions deep.
- **Ignoring process leaks.** Spawning unsupervised processes (plain `spawn`) that outlive their
  purpose. Everything runs under a supervisor, or it's a leak with a timer.
- **Overusing macros/metaprogramming.** Compile-time magic that's hard to grep and debug. The
  BEAM community's rule holds: macros when they remove real boilerplate at call sites, functions otherwise.
