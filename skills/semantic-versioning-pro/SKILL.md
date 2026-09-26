---
name: semantic-versioning-pro
description: Apply semantic versioning correctly: MAJOR.MINOR.PATCH discipline, breaking-change detection, and version policies. Use when versioning libraries, APIs, or packages.
category: development
---

# Semantic Versioning Pro

## Overview

Semantic versioning — **MAJOR.MINOR.PATCH** — is a *contract with your consumers*: given a version
number, they know what kind of change to expect. MAJOR = breaking, MINOR = backward-compatible
features, PATCH = backward-compatible fixes. The discipline isn't in the numbers — it's in honestly
classifying changes and respecting what each bump promises.

The through-line: the version number is a promise — break it and you break trust, not just builds.

## When to use

- Versioning a library, SDK, API, or package.
- Deciding whether a change is major, minor, or patch.
- Setting up automated versioning (changesets, semantic-release).
- Defining deprecation and breaking-change policies.
- Reviewing version bumps in releases.

## Core concepts

- **The contract.** MAJOR: incompatible API changes. MINOR: new functionality, backward compatible.
  PATCH: bug fixes, backward compatible. Consumers on `^1.2.3` get minors and patches automatically —
  every bump is a promise about what *won't* break them.
- **What counts as breaking.** Removing/renaming public APIs, changing signatures or return shapes,
  altering behavior consumers depend on, dropping supported platforms/versions, changing default
  behavior. When in doubt, it's breaking — consumers depend on more than you think.
- **Public API surface, defined.** Semver applies to the *declared* public API — document what's
  public (exported symbols, documented endpoints) vs internal. Undocumented internals changing
  isn't breaking; but if consumers *use* it, expect anger anyway. Be explicit.
- **Zero-major special case.** `0.x.y`: anything may change; the API is unstable by declaration.
  Don't linger in 0.x for widely-used software — it's a signal, and prolonged 0.x erodes the
  signal's meaning. 1.0.0 declares stability intent.
- **Pre-releases and build metadata.** `1.0.0-rc.1`, `2.0.0-beta.3` — for soaking breaking changes
  before the major lands. Pre-releases don't satisfy normal ranges (`^1.0.0` won't take `2.0.0-rc.1`),
  which is exactly the safety you want.
- **Deprecation policy.** Never break without warning: deprecate in a minor (with warnings/logs
  pointing to the migration), remove in the next major. Give consumers at least one full minor
  series to migrate — breaking-change timelines are a trust instrument.

## Practical workflow

1. **Define the public API.** Document what's covered by semver (and what isn't). For libraries:
   exported functions/types; for HTTP APIs: endpoints, fields, status codes, auth behavior.
2. **Classify every change.** In each PR: breaking? → major; new compatible feature? → minor;
   fix only? → patch. Make classification part of review — it's a design decision, not bookkeeping.
3. **Automate the mechanics.** Changesets (human-written, per-PR: patch/minor/major + description)
   or semantic-release (from conventional commits). Humans classify; machines bump and publish.
4. **Deprecate before removing.** Minor release: add the new way, deprecate the old with warnings
   and migration docs. Next major: remove. Never surprise-break.
5. **Publish pre-releases for majors.** `-rc.1` weeks before the major; invite consumers to test;
   fix the fallout *before* the major lands. Majors are the highest-stakes releases — soak them.
6. **Enforce in CI.** Breaking-change detection (API diff tools: `cargo semver-checks`,
   `revapi`, `japicmp`, public-API snapshots), and changelog entries matching the bump level.

Classification guide:

```text
MAJOR (breaking):
  - Remove/rename public function, class, endpoint, or field
  - Change parameter types/order, return shapes
  - Change default behavior consumers may rely on
  - Drop support for a runtime/platform version
  - Tighten validation (previously-accepted input now rejected)

MINOR (new, compatible):
  - Add new function/endpoint/field (optional)
  - Add new optional parameter
  - Deprecate (without removing) existing API
  - Performance improvements with identical behavior

PATCH (fix, compatible):
  - Fix incorrect behavior to match documented contract
  - Security fix with no API change
  - Docs, internal refactoring, dependency updates
```

## Common pitfalls

- **Breaking in a minor.** "It's a small change" — but it removed a field someone parsed.
  If any reasonable consumer could break, it's major. Err toward major.
- **0.x forever.** A widely-depended `0.14.2` where every minor breaks consumers — the version
  number lies about stability. Ship 1.0 when the API is used in production by others.
- **Patch bumps with behavior change.** "Fixing" behavior consumers depended on (even if the old
  behavior was buggy) — that's a breaking change wearing a patch costume. Hyrum's law: all
  observable behaviors will be depended on.
- **No deprecation path.** Removing APIs in the same release they're deprecated — or without
  deprecation at all. The deprecation period *is* the migration budget you give consumers.
- **Version ranges misunderstood.** Publishing a breaking change as minor breaks every consumer
  on `^` ranges simultaneously — a distributed outage of trust. This is why classification matters.
- **Forgetting the ecosystem.** Bumping major without checking downstream (plugins, adapters,
  docs, examples) — the release isn't done until the ecosystem story is coherent.
- **Manual versioning drift.** Humans forgetting to bump, or bumping inconsistently. Automate
  (changesets/semantic-release); let humans do the classification they uniquely can.
