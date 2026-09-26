---
name: uuid-generator
description: Generate and work with UUIDs across versions with format handling, database, and URL best practices.
category: utilities
---

## Overview

UUIDs are the standard for unique identifiers: database keys, request IDs, filenames, distributed
systems. But "just generate a UUID" hides decisions — v4 vs v7, string format vs binary storage, and
whether UUIDs are even the right choice. This skill covers UUID versions, practical generation,
storage, and the alternatives worth knowing.

## When to use

- Generating unique IDs for records, files, or requests

- Choosing between UUID versions (v4, v7)

- Storing UUIDs efficiently in databases

- Using UUIDs in URLs and APIs

- Deciding between UUIDs and alternatives (ULID, Snowflake, auto-increment)

## Core concepts

- - **Versions matter.** v1 (time + MAC — leaks timestamp and machine info; avoid). v4 (random — the
  default choice, 122 bits of entropy). v7 (time-ordered random — sortable, database-friendly, the
  modern best practice for new systems). v5 (SHA-1 namespace-based — deterministic; same input =
  same UUID, useful for stable derived IDs).
- - **Uniqueness is probabilistic.** v4 collisions are theoretically possible but practically
  impossible (you'd need ~2^61 IDs for a 50% chance). Don't build dedup logic around "what if UUIDs
  collide" — worry about real problems.
- - **Sortability affects databases.** Random v4 UUIDs fragment B-tree indexes (page splits, poor
  locality). v7's time-ordered prefix keeps inserts sequential — measurably faster at scale. For new
  systems, prefer v7.
- - **Format variants.** Canonical: `123e4567-e89b-12d3-a456-426614174000` (36 chars with hyphens).
  Hex without hyphens (32 chars) for compact contexts. URN: `urn:uuid:...`. Braced `{...}`
  (Microsoft style). Normalize on input — accept liberally, store consistently.
- - **Not for security.** UUIDs are identifiers, not secrets. v4 has 122 bits of entropy
  (unguessable, fine as unguessable tokens in practice), but v1/v7 leak timestamps. For security
  tokens, use a CSPRNG directly and understand the threat model.
- - **Alternatives.** ULID (time-ordered, URL-safe, Crockford base32 — nice for logs/URLs).
  Snowflake-style (time + worker + sequence — needs coordination). Auto-increment integers (simple,
  but leak count/order and complicate distributed writes). Choose by constraints, not fashion.

## Practical workflow

1. 1. **Pick the version.** New system with a database → v7 (sortable). General purpose → v4
   (universal support). Deterministic derived IDs → v5 with a namespace. Avoid v1 (privacy leak).
2. **Generate.** Python:
   ```python
   import uuid
   uuid.uuid4()  # random
   uuid.uuid7()  # time-ordered (Python 3.14+; else use a library)
   uuid.uuid5(uuid.NAMESPACE_DNS, "example.com")  # deterministic
   str(u)              # canonical with hyphens
   u.hex               # 32 chars, no hyphens
   u.bytes             # 16 bytes for binary storage
   ```
   Shell: `uuidgen` (v4) or `python3 -c "import uuid; print(uuid.uuid4())"`.
3. 3. **Store efficiently.** Databases: native UUID type (Postgres `uuid`) or BINARY(16) — not
   CHAR(36), which wastes space and index performance. Application code converts at the boundary.
4. 4. **Use in URLs/APIs.** Canonical hyphenated form is fine and readable. For shorter URLs,
   hex-without-hyphens or base64url-encode the 16 bytes (22 chars). Never expose sequential internal
   IDs alongside UUIDs confusingly — pick one identity scheme per resource.
5. 5. **Validate input.** Accept the common formats (hyphenated, bare hex, braced, URN), normalize
   to one canonical form before storage/comparison. Reject malformed input early with a clear error.
6. 6. **Log with correlation.** Request-scoped UUIDs (or ULIDs) through logs and traces turn
   distributed debugging from archaeology into a query. Generate at the edge, propagate in headers.

## Common pitfalls

- - **v1 in privacy-sensitive contexts.** MAC address + timestamp embedded in every ID. An attacker
  learns when and on which machine IDs were created. Use v4/v7.
- - **CHAR(36) storage.** Storing the hyphenated string wastes 20 bytes per row and slows indexes.
  Use native UUID/binary types.
- - **Random UUIDs as clustered PKs.** v4 primary keys cause index fragmentation at scale. v7 (or
  sequential alternatives) for clustered primary keys.
- - **Exposing creation order.** Sequential IDs (auto-increment, v7 timestamps) leak business info
  (user counts, signup rates). If that matters, use v4 for public-facing IDs even with v7
  internally.
- - **Case sensitivity bugs.** `ABC...` vs `abc...` — normalize case before comparing. UUIDs are
  case-insensitive by spec; your string comparison might not be.
- - **Using UUIDs as passwords/tokens blindly.** v4 is fine as an unguessable bearer token, but
  understand rotation, revocation, and storage (hash tokens like passwords if they're long-lived
  secrets).
