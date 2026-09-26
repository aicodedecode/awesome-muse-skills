---
name: pocketbase-pro
description: PocketBase backend mastery — collections, APIs, and self-hosted operations — use when building on PocketBase.
category: pocketbase
---

## Overview

PocketBase is an open-source backend in a single Go binary: embedded database
(SQLite), auth, file storage, realtime, and an admin dashboard — no separate
services to operate. This skill covers data modeling with collections, using
the generated APIs, and running PocketBase reliably in production.

## When to use

- Modeling data with PocketBase collections (base, auth, view)
- Choosing between the REST API and the realtime/client SDKs
- Designing API rules (PocketBase's per-collection access control)
- Backing up, scaling, and updating a PocketBase instance
- Extending with Go/JavaScript hooks and custom routes

## Core concepts

**Collections are the schema.** Base collections hold regular records; auth
collections add users with email/password/OAuth2; view collections expose
SQL queries as read-only collections. Fields are typed (text, number, bool,
date, file, relation, JSON…), and relations are first-class — design them
like a normalized relational schema, because that's what it is.

**API rules are the security model.** Each collection defines list/view/
create/update/delete rules as filter expressions evaluated against the
request (`@request.auth.id != ""`, `@request.data.owner = @request.auth.id`).
No rule = denied. Rules run per record, so design them carefully — they're
your authorization layer, equivalent in spirit to row-level security.

**One binary, embedded SQLite.** PocketBase's simplicity is the feature: a
single executable with data in one directory. This makes deploys trivial but
shapes scaling — SQLite handles impressive throughput on one node (WAL mode,
proper indexes), and PocketBase is fundamentally single-node; scale vertically
and know the ceiling rather than assuming horizontal scale-out.

**SDKs over raw REST.** The official JS/Dart SDKs handle auth state, token
refresh, and realtime subscriptions; use them instead of hand-rolling HTTP.
The admin dashboard (`/_/`) is genuinely useful for inspecting data and
testing rules during development.

**Migrations are code.** Collection changes made in the dashboard generate
migration files — commit them and apply via `migrate` commands so environments
stay in sync. Dashboard-clicking without migrations is how staging and prod
drift apart.

## Practical workflow

1. **Model collections** with proper field types and relations; add indexes
   for your query patterns (PocketBase exposes index management per
   collection).
2. **Write API rules first**, before client code: define who can do what per
   collection and operation; test with authenticated and anonymous requests
   (the dashboard's API preview helps).
3. **Build the client** with the SDK: auth flows, CRUD with `expand` for
   relations, pagination (`page`/`perPage`), and filters using PocketBase's
   filter syntax.
4. **Handle files** via file fields with thumbs/protected-file rules; serve
   private files through signed/authorized access, not public URLs, when
   they need protection.
5. **Deploy as one unit:** the binary + data directory on a VM/container with
   persistent storage; reverse-proxy with TLS; schedule data-directory
   backups (SQLite file copies are consistent when done correctly — or use
   the backup API).
6. **Update carefully:** test new versions in staging (migrations run on
   boot), keep backups before upgrading, and pin versions in production.

## Common pitfalls

- **Permissive API rules in production** (`""` = public on list/view) —
  audit every collection's rules; the dashboard flags public access, heed it.
- **No migration discipline** — dashboard changes never exported; environments
  diverge and deploys become manual archaeology.
- **Treating it as horizontally scalable** — it's single-node by design;
  plan vertical scaling and know your throughput ceiling via load testing.
- **Backing up the data dir while writes happen** without SQLite-safe
  procedure — use the built-in backup or WAL-aware copy methods.
- **Storing secrets in collection records** — API rules protect records, but
  secrets belong in environment config / a secrets manager, not the database.
- **N+1 via expand abuse** — expanding deep relation trees on list endpoints
  generates heavy queries; paginate and expand narrowly.
