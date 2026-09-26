---
name: go-pro
description: Idiomatic Go: project layout, error handling, concurrency with goroutines/channels, interfaces, and tooling. Use when writing, reviewing, or structuring Go programs and services.
category: development
---

# Go Pro

## Overview

Go rewards **simplicity and explicitness**: small interfaces, explicit error handling, and
concurrency as a first-class but carefully-managed tool. The best Go code is boring in the best
way — obvious control flow, minimal abstraction, and the standard library doing heavy lifting.

This skill covers professional Go: module layout, error handling philosophy, goroutine/channel
patterns, interface design, and the tooling (`go vet`, `gofmt`, linters) that keeps Go codebases
uniform and reliable.

## When to use

- Starting or structuring a Go module/service.
- Writing or reviewing Go for idiom and correctness.
- Designing concurrency (goroutines, channels, worker pools).
- Handling errors, context propagation, and graceful shutdown.
- Setting up linting, testing, and CI for Go.

## Core concepts

- **Errors are values.** Return them, check them, wrap them with context (`fmt.Errorf("…: %w", err)`).
  Sentinel errors for expected cases, custom types when callers must distinguish. Never ignore an
  error without a comment saying why (`_ = f.Close()` on read-only files is the rare exception).
- **Interfaces: small and consumer-defined.** Accept interfaces, return structs. The `io.Reader` /
  `io.Writer` philosophy: one- or two-method interfaces defined where *used*, not where implemented.
  Empty interfaces (`any`) in APIs push type problems to runtime — constrain with generics or
  concrete types.
- **Concurrency: share memory by communicating.** Goroutines + channels for orchestration; `sync`
  primitives for shared state. `context.Context` carries cancellation/deadlines through call chains
  — always the first parameter, never stored in structs. Worker pools bound concurrency; `errgroup`
  manages fan-out/fan-in with error propagation.
- **Project layout (standard-ish).** `cmd/<app>/main.go` (thin), `internal/` for private packages,
  `pkg/` only for genuinely reusable libraries. Flat is fine for small services — don't create
  twelve packages for 2,000 lines. Package names: short, lowercase, no underscores (`httpx` not
  `http_utils`).
- **Defer for cleanup, and mind loop gotchas.** `defer` runs LIFO at function return — perfect for
  `Close`/`Unlock`. In Go 1.22+ loop variables are per-iteration (the old capture bug is gone),
  but know your toolchain version when reading older code.
- **Testing is built in.** Table-driven tests, `t.Run` subtests, `testify` optional but common,
  `httptest` for handlers, `-race` in CI always. Benchmarks (`BenchmarkXxx`) for hot paths.

## Practical workflow

1. **Scaffold:** `go mod init <module>`, `cmd/` + `internal/` layout, `.golangci.yml` with a
   curated linter set, `go vet` + `gofmt -l` in CI (gofmt diff = fail).
2. **Write the happy path first**, then handle every error return explicitly. Wrap with context
   at boundaries (where you have the most information), check/log at the top.
3. **Thread `context.Context`** through I/O paths; respect cancellation in loops and workers;
   set timeouts on outbound calls (`http.Client{Timeout: …}`).
4. **Concurrency pattern selection:**
   - Fan-out/fan-in with results → `errgroup.Group` + channels.
   - Bounded parallelism → worker pool with buffered channel.
   - Periodic work → `time.Ticker` + context cancellation, not `time.Sleep` loops.
   - Never leak goroutines: every spawned goroutine must have an exit path.
5. **Graceful shutdown.** Catch SIGTERM/SIGINT → cancel root context → stop accepting → drain
   in-flight with a timeout → exit. `http.Server.Shutdown(ctx)` exists; use it.
6. **Review checklist:** errors wrapped with context, no ignored errors, contexts plumbed,
   goroutine exit paths, no data races (`go test -race`), exported symbols documented.

Idiomatic snippets:

```go
// Wrap errors with context at the boundary
func LoadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("load config %s: %w", path, err)
    }
    ...
}

// errgroup fan-out
g, ctx := errgroup.WithContext(ctx)
for _, id := range ids {
    g.Go(func() error { return process(ctx, id) })
}
if err := g.Wait(); err != nil { return err }
```

## Common pitfalls

- **Ignoring errors.** `val, _ := strconv.Atoi(s)` sprinkled everywhere. Handle or document why not.
- **Goroutine leaks.** Spawning goroutines blocked forever on channel sends with no receiver.
  Every goroutine needs a `ctx.Done()` / close-channel exit.
- **Copying locks.** Passing `sync.Mutex` by value (go vet flags it). Use pointers for structs
  containing locks; `go vet` in CI catches this.
- **Interface pollution.** `type Service interface { 25 methods }` — huge interfaces are hard to
  mock and hard to implement. Small interfaces, composed as needed.
- **Premature optimization with sync.** Reaching for atomics and lock-free tricks before profiling.
  A plain mutex is fast; correctness first, `pprof` second.
- **Global state.** Package-level `var db *sql.DB` mutated in tests causes order-dependent flakes.
  Inject dependencies; keep globals read-only after init.
- **Not running `-race`.** Data races are silent until production. `go test -race ./...` in CI,
  always — it's the cheapest concurrency bug-finder in the industry.
