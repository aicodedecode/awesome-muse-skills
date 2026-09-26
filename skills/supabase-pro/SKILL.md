---
name: supabase-pro
description: Supabase backend development — Postgres, Auth, Storage, and Row Level Security — use when building on Supabase.
category: database
---

## Overview

Supabase is an open-source backend platform built on Postgres: hosted database,
authentication, storage, edge functions, and realtime subscriptions, all
accessible via auto-generated APIs. The core skill is Postgres plus Supabase's
security model — especially Row Level Security (RLS), which turns your database
into the authorization layer.

## When to use

- Designing tables and RLS policies for a Supabase project
- Implementing auth flows (email, OAuth, magic links) with Supabase Auth
- Using Storage buckets with access policies for user uploads
- Subscribing to realtime changes or writing edge functions
- Going to production: backups, connection pooling, migrations

## Core concepts

**RLS is your authorization layer.** With the client libraries talking directly
to Postgres, every table exposed to clients needs `ENABLE ROW LEVEL SECURITY`
plus policies defining who can `SELECT`/`INSERT`/`UPDATE`/`DELETE` which rows.
A table with RLS enabled but no policies denies everything — fail-closed by
default, which is exactly right.

**Policies are SQL on the requesting user.** `auth.uid()` gives the JWT's user
id; policies are `USING` (visibility) and `WITH CHECK` (writes) expressions:

```sql
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

Write policies per operation, test with different roles, and remember policies
combine with OR — overly broad policies leak data.

**Auth is JWT-based.** Supabase Auth issues JWTs; the API layer sets
`auth.uid()` and `auth.jwt()` from them. Custom claims (roles, tenant ids) can
be added via hooks. Service-role keys bypass RLS — they belong server-side
only, never in client bundles.

**Storage uses the same policy model.** Buckets have RLS-like policies on the
`storage.objects` table; structure paths as `<user_id>/<file>` and write
policies matching path prefixes for clean per-user isolation.

**Realtime is Postgres logical replication.** Subscribing to table changes
streams inserts/updates/deletes to clients — but RLS applies, so clients only
receive rows their policies allow. Enable replication per table deliberately.

## Practical workflow

1. **Model in Postgres first** (see database-designer): tables, keys,
   constraints — Supabase is Postgres, so normal design rules apply.
2. **Enable RLS on every client-facing table** before writing app code; add
   policies operation by operation; verify by querying as different users
   (the SQL editor's "run as" / JWT switching).
3. **Structure auth:** choose providers, configure redirect URLs, set up email
   templates; store profile data in a `profiles` table keyed to `auth.users.id`
   via trigger on signup.
4. **Wire Storage:** private buckets + path-based policies; generate signed URLs
   server-side for temporary access rather than making buckets public.
5. **Use edge functions for secrets and side effects** (payments, emails, third
   parties) — never put service-role keys or API secrets in client code.
6. **Ship safely:** use the CLI's migration workflow (`supabase db diff` →
   review → `supabase db push`), enable Point-in-Time Recovery / backups,
   and use the connection pooler (Supavisor) for serverless/high-connection
   workloads.

## Common pitfalls

- **Tables without RLS in production** — the dashboard warns, but it's easy to
  miss; audit with a query over `pg_tables` checking `rowsecurity`.
- **Policies that are too permissive** (`USING (true)` on writes) — equivalent
  to no security; write the narrowest correct policy.
- **Leaking the service-role key** into frontend code or a public repo — it
  bypasses all RLS; rotate immediately if exposed.
- **N+1 via the JS client:** chaining `.select()` with nested relations is
  convenient but can generate heavy queries; check the SQL in the dashboard's
  query performance view.
- **Realtime on high-churn tables** without considering fan-out — every write
  broadcasts to subscribers; scope channels and filters tightly.
- **Migrations done by clicking in the dashboard** with no CLI history —
  environments drift; keep migrations in version control and apply via CLI.
