---
name: context7-auto-research
description: Research libraries and APIs automatically by pulling live documentation into the agent's context before answering. Use when writing code against unfamiliar or fast-moving libraries so examples match current versions.
category: ai-research
---

# Auto-Research with Live Documentation

Libraries change faster than training data. The auto-research pattern is simple: before writing 
code against a library, fetch its current documentation into context, then generate code from that 
— never from memory of an old API.

## Overview

Stale API knowledge is the top cause of hallucinated code: invented parameters, renamed functions, 
deprecated patterns. The fix is a research step that retrieves the live docs for exactly the 
library and version in use and puts them in front of the model. This turns code generation into 
grounded generation — the model quotes real signatures instead of reconstructing them from memory.

## When to use

- Writing code with a library you haven't used recently, or one with frequent breaking changes.
- The user mentions a specific version — resolve the docs for that version, not "the latest you 
remember."
- An API call fails or returns unexpected results — re-check the docs before debugging your logic.
- Reviewing generated code that uses an unfamiliar library: verify signatures against live docs.

## Core concepts

- **Doc-first generation**: research step precedes code step. Fetch first, generate second — 
never the reverse.
- **Version pinning**: docs for the installed version, matched by package lockfile or explicit user 
statement. "Latest" docs and a pinned old dependency is a classic mismatch.
- **Targeted retrieval**: pull the specific reference pages (API signatures, config options, 
migration guides), not the whole documentation site. Noise dilutes the context.
- **Freshness check**: note the doc page's date/version. If the docs look older than the installed 
version, flag the mismatch.
- **Cache with expiry**: doc lookups are network calls; cache them per project but invalidate when 
the version changes.

## Practical workflow

1. Identify the library and version from the project's lockfile or package manifest — don't guess.
2. Fetch the current reference docs: API signatures, quickstart, and migration notes for that 
version.
3. Extract the exact signatures and options needed for the task; quote them in your working notes.
4. Generate code against the fetched docs, citing which doc page each pattern comes from.
5. If generated code fails, re-read the docs before assuming a bug in your logic — check 
parameter names, defaults, and async behavior.
6. Cache the fetched docs in the project workspace; note the version so the next session 
revalidates instead of re-fetching blindly.

```text
Research note format (keep in workspace):
Library: <name> @ <version>
Source:  <doc URL + access date>
Needs:   <signatures/options relevant to the task>
Watch:   <deprecations, version-specific gotchas>
```

## Common pitfalls

- **Generating from memory first**: the default habit. Make doc-fetching the mandatory first step 
for unfamiliar libraries.
- **Version mismatch**: reading latest docs while the project pins an old version. Always 
cross-check against the lockfile.
- **Over-fetching**: dumping entire doc sites into context. Retrieve the pages that match the task; 
summarize the rest.
- **No freshness note**: docs fetched months ago treated as current. Record the access date and 
revalidate on version bumps.
- **Trusting examples blindly**: doc examples sometimes lag the reference. Prefer the signature 
reference over tutorial prose.
- **Skipping the step under time pressure**: that's exactly when stale-API hallucinations happen. 
The research step is cheapest insurance.
