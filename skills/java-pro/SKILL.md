---
name: java-pro
description: Idiomatic modern Java: project structure, streams, records, concurrency, build tooling, and testing. Use when writing, reviewing, or structuring Java applications.
category: development
---

# Java Pro

## Overview

Modern Java (17+) is a different language from the Java of 2010: **records, sealed classes, pattern
matching, and virtual threads** have retired reams of boilerplate. Professional Java today means
using these features idiomatically, leaning on the ecosystem's mature tooling (Maven/Gradle, JUnit
5, Spring Boot or lighter alternatives where apt), and writing code that's explicit about
nullability, concurrency, and failure.

The through-line: modern Java rewards modeling the domain precisely and letting the platform handle
the plumbing.

## When to use

- Starting or structuring a Java application (Maven/Gradle layout, modules).
- Writing or reviewing Java for modern idiom (records, sealed types, pattern matching).
- Designing concurrency (virtual threads, executors, CompletableFuture).
- Choosing frameworks, build tools, or test setups.
- Debugging build, dependency, or performance issues.

## Core concepts

- **Project structure (Maven/Gradle standard).** `src/main/java/com/example/app`,
  `src/main/resources`, `src/test/java`. One build file as source of truth; dependency versions in
  a BOM or version catalog; wrapper scripts (`mvnw`/`gradlew`) committed so builds are reproducible.
- **Records for data.** `record Order(String id, Money total) {}` — immutable data carriers with
  auto-generated equals/hashCode/toString. Use for DTOs, value objects, and messages. Add compact
  constructors for validation.
- **Sealed classes + pattern matching.** Model closed hierarchies (`sealed interface Result permits
  Ok, Err`) and let `switch` pattern matching enforce exhaustiveness — the compiler flags unhandled
  cases when you add a variant.
- **Nullability discipline.** `Optional` for return values that may be absent (never for fields or
  parameters); null-checks at boundaries; consider nullness annotations (Checker Framework/JSpecify)
  on larger codebases. NPEs are design failures, not acts of god.
- **Concurrency, modernized.** Virtual threads (Project Loom) make "thread per task" viable again —
  write straightforward blocking code on virtual threads instead of reactive gymnastics, unless you
  have a measured reason not to. `ExecutorService` for pools; `CompletableFuture` for composition;
  prefer `java.util.concurrent` primitives over hand-rolled synchronization.
- **Streams for transformation.** `stream().filter().map().collect()` for data pipelines; but
  plain loops for side-effecting or complex logic — streams aren't mandatory everywhere.

## Practical workflow

1. **Scaffold:** Maven or Gradle with wrapper, Java 17+ (21+ for virtual threads in production),
   package by feature (`order/`, `payment/`) not by layer (`controllers/`, `services/`).
2. **Model the domain.** Records for immutable data, sealed hierarchies for variants, enums with
   behavior for fixed sets. Validate in constructors/factories — invalid objects shouldn't exist.
3. **Write the service layer plainly.** Constructor injection, small focused classes, interfaces
   only where multiple implementations genuinely exist (don't interface-everything preemptively).
4. **Handle errors explicitly.** Checked vs unchecked: use unchecked domain exceptions with rich
   context; catch at boundaries (controllers translate to HTTP status codes). Never swallow
   exceptions; log with correlation IDs.
5. **Test in the pyramid.** JUnit 5 + AssertJ for unit tests (parameterized via `@ParameterizedTest`),
   Testcontainers for real Postgres/Kafka in integration tests, MockMvc/REST-assured for API tests.
6. **Build the pipeline.** `./mvnw -B verify` in CI: compile, test, and package; add static analysis
   (SpotBugs/Error Prone, Checkstyle for style) and dependency vulnerability scanning (OWASP
   dependency-check or Snyk).

Idiomatic snippets:

```java
// Record with validation
public record Email(String value) {
    public Email {
        if (value == null || !value.contains("@"))
            throw new IllegalArgumentException("Invalid email: " + value);
    }
}

// Sealed hierarchy + exhaustive switch
sealed interface PaymentResult permits PaymentResult.Ok, PaymentResult.Failed {
    record Ok(String txnId) implements PaymentResult {}
    record Failed(String reason) implements PaymentResult {}
}
String message = switch (result) {
    case PaymentResult.Ok(var id) -> "Paid: " + id;
    case PaymentResult.Failed(var r) -> "Failed: " + r;
};
```

## Common pitfalls

- **Boilerplate nostalgia.** Writing 2010-style Java (getters/setters everywhere, anonymous inner
  classes, manual null checks) when records, pattern matching, and `var` (used judiciously) exist.
- **Optional abuse.** `Optional` fields, `Optional` parameters, `optional.get()` without checking —
  all worse than the nulls they replaced. `Optional` is a return-type signal, nothing more.
- **Checked-exception sprawl.** Declaring `throws Exception` everywhere or wrapping everything in
  `RuntimeException` without context. Design a small domain exception hierarchy.
- **Static mutable state.** `public static` collections mutated at runtime — untestable and
  thread-unsafe. Inject state; keep statics immutable.
- **Thread-per-request on platform threads at scale.** Or the opposite: reactive-everything when
  virtual threads would let you write simple blocking code. Match the concurrency model to the
  workload and measure.
- **Dependency version chaos.** Transitive version conflicts resolved by hope. Use a BOM, enforce
  versions in one place, and fail the build on known-vulnerable dependencies.
- **God Spring contexts.** Autowiring the world with circular dependencies papered over by `@Lazy`.
  Constructor injection makes cycles compile-time visible — listen to it.
