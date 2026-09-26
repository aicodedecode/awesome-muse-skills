---
name: mcp-postgres
description: Accessing Postgres via the open Model Context Protocol — setup, tools, and secure querying patterns.
category: database
---

## Overview

The Model Context Protocol (MCP) is an open standard for connecting AI assistants
to data sources through typed "tools". A Postgres MCP server exposes database
operations — listing tables, describing schemas, running queries — as callable
tools, letting an assistant work with live data safely. This skill covers setting
up a Postgres MCP server and using it with secure, disciplined patterns.

## When to use

- Giving an AI assistant read (or carefully scoped write) access to Postgres
- Exploring an unfamiliar database schema conversationally
- Running ad-hoc analytical queries without a SQL client
- Building repeatable data-check workflows (row counts, freshness, integrity)
- Auditing what an assistant can and cannot do against production data

## Core concepts

**Tools, not raw connections.** An MCP server declares tools like
`list_tables`, `describe_table`, and `query` with JSON schemas. The assistant
calls tools; it never sees connection strings. This boundary is what makes MCP
safer than handing over credentials — capabilities are explicit and enumerable.

**Least privilege at the database level.** Create a dedicated database role for
the MCP server with only the grants it needs — typically `SELECT` on specific
schemas. If writes are required, grant them per-table and consider a separate
server instance or tool allowlist for write operations. The database's own
permission system is the enforcement point; MCP tool descriptions are just UI.

**Read-only by default.** Most Postgres MCP servers support a read-only mode
(rejecting `INSERT`/`UPDATE`/`DELETE`/`DDL`). Enable it unless the task genuinely
requires writes, and prefer a replica or a recent snapshot for exploratory work
against production.

**Schema discovery before querying.** Good MCP workflows start with
`list_tables` → `describe_table` (columns, types, keys) before any `SELECT`.
This avoids guessing column names and produces correct queries on the first try.

**Query hygiene.** Parameterize values rather than interpolating them; keep
result sets bounded (`LIMIT`, or server-side max-rows settings); avoid
`SELECT *` on wide tables. Long-running analytical queries belong on a replica
or with statement timeouts set.

## Practical workflow

1. **Provision a least-privilege role:**
   ```sql
   CREATE ROLE mcp_reader WITH LOGIN PASSWORD '<strong-secret>';
   GRANT CONNECT ON DATABASE appdb TO mcp_reader;
   GRANT USAGE ON SCHEMA public TO mcp_reader;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO mcp_reader;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public
     GRANT SELECT ON TABLES TO mcp_reader;
   ```
2. **Configure the MCP server** with the connection string (via environment
   variable or secrets manager — never hardcoded), read-only mode on, and
   sensible limits (max rows, statement timeout).
3. **Register it with your MCP client** (assistant config file) and verify with
   `list_tables` — you should see only what the role can see.
4. **Explore methodically:** list tables → describe the relevant ones → write
   small probe queries (`COUNT(*)`, sample rows) → build up to the real
   question.
5. **For recurring checks** (data freshness, constraint violations), save the
   query pattern as a documented prompt or script rather than re-deriving it.
6. **Audit periodically:** review the role's grants, rotate the credential,
   and check query logs for anything unexpected.

## Common pitfalls

- **Running the MCP server as a superuser or the app owner** — one misread tool
  description away from destructive writes; always use a scoped role.
- **Pointing at the primary for heavy analytics** — ad-hoc exploration can
  contend with production traffic; use a replica for anything non-trivial.
- **No statement timeout** — a runaway cartesian join holds connections and
  burns CPU; set `statement_timeout` on the role.
- **Trusting tool output blindly** — verify surprising results with an
  independent query; assistants can misread schemas just like humans.
- **Secrets in config files committed to git** — connection strings belong in
  environment variables or a secrets manager, with the config referencing them.
- **Granting on `ALL TABLES` in schemas with sensitive tables** — scope grants
  to explicit table lists when the schema mixes public and sensitive data.
