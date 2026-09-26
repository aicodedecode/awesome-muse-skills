---
name: mcp-builder
description: Design and build Model Context Protocol servers: tools, resources, prompts, transports, and security. Use when exposing APIs, data, or capabilities to AI assistants via MCP.
category: development
---

# MCP Builder

## Overview

The Model Context Protocol (MCP) is a standard way to expose **tools, data, and prompts** to AI
assistants: your server advertises capabilities, the client (an AI app) discovers them, and the
model invokes tools or reads resources as needed. Think of it as "USB-C for AI integrations" — one
protocol instead of bespoke plugins per assistant.

This skill covers designing and building MCP servers well: capability modeling, tool design,
transports, auth, and the security posture that matters when a model can invoke your code.

## When to use

- Exposing an internal API, database, or service to AI assistants.
- Building a tool integration (GitHub, Postgres, filesystem, custom SaaS) for MCP clients.
- Designing the tool surface: what operations a model should be able to call.
- Choosing transports (stdio vs HTTP/SSE) and auth for an MCP server.
- Reviewing an MCP server for security issues before deployment.

## Core concepts

- **Three capability types.** *Tools* (model-invoked actions with side effects — the workhorse),
  *Resources* (read-only data the model can fetch, like files or records), *Prompts* (reusable
  templates). Most servers are 90% tools; reach for resources when the model needs to *read*,
  tools when it needs to *do*.
- **Tool design is API design.** Each tool: a clear name (`create_ticket`, not `do_thing`), a
  precise description (the model reads this to decide when to call it), a strict input schema
  (required fields, enums, formats), and structured output. Vague tools get misused; oversized
  tools (one tool that does everything) get miscalled.
- **Schemas are contracts.** Use JSON Schema rigorously: types, required arrays, descriptions per
  field, sensible defaults. Validate inputs server-side — the model *will* send malformed
  arguments eventually.
- **Transports.** `stdio` for local servers (spawned by the client — simplest, no network);
  Streamable HTTP for remote servers (needs auth, TLS, and all the usual web hardening). Choose
  stdio unless the server must be shared across machines.
- **Progressive disclosure.** Don't dump your whole API as 200 tools. Expose the operations that
  match real workflows; compose complex flows from a few well-chosen primitives. Fewer, better
  tools beat exhaustive coverage.
- **Security model.** The model is an *untrusted caller with a trusted user's intent*: authenticate
  the user, authorize every tool call against their permissions, validate and sanitize all inputs,
  and treat tool *outputs* as untrusted data (they can contain injected instructions — never let
  tool output drive privileged actions without checks).

## Practical workflow

1. **Model the workflows first.** List the 3–5 real tasks users will ask the assistant to do with
   your system. Each task maps to 1–4 tools — that's your v1 surface.
2. **Define tools with ruthless clarity.** For each: name (verb_noun), one-paragraph description
   stating *when to use it and when not to*, input schema with examples, and output shape.
   Write the descriptions as if the model has never seen your domain.
3. **Implement with an SDK.** Use the official MCP SDK for your language (TypeScript/Python);
   don't hand-roll the protocol. Structure: transport setup → capability registration →
   handlers with input validation → structured results and typed errors.
4. **Handle errors like an API.** Return structured errors (code, message, retryable?) — the model
   can recover from "rate_limited, retry in 60s" but not from a stack trace. Never leak internals.
5. **Add auth for remote servers.** OAuth 2.1 / bearer tokens at the HTTP layer; scope tokens to
   the minimum capability set; log and audit tool invocations per user.
6. **Test as a client.** Connect with a real MCP client (e.g., the inspector tool), run each
   workflow end-to-end, and try adversarial inputs: missing fields, wrong types, oversized
   payloads, and prompt-injection strings in tool arguments.

Example tool definition sketch:

```json
{
  "name": "search_tickets",
  "description": "Search support tickets by status, assignee, or keyword. Use for finding existing tickets before creating new ones; do not use for modifying tickets (see update_ticket).",
  "inputSchema": {
    "type": "object",
    "properties": {
      "status": { "type": "string", "enum": ["open", "pending", "closed"] },
      "assignee": { "type": "string", "description": "User email, or 'unassigned'" },
      "query": { "type": "string", "maxLength": 200 }
    },
    "required": ["status"]
  }
}
```

## Common pitfalls

- **Tool sprawl.** Auto-generating one tool per API endpoint (200 tools) overwhelms the model's
  selection and burns context. Curate: expose workflow-level tools, not endpoint-level mirrors.
- **Vague descriptions.** "Interacts with the ticket system" tells the model nothing. Say when to
  call it, what it returns, and what *not* to use it for.
- **Missing input validation.** Trusting the model to send correct arguments. Validate types,
  ranges, and enums server-side; return helpful errors naming the offending field.
- **Destructive tools without guardrails.** A `delete_database` tool with no confirmation
  parameter is an incident waiting for a misread prompt. Require explicit confirmation fields for
  destructive ops, and scope them to least privilege.
- **Prompt injection via tool output.** Tool results containing "ignore previous instructions and
  …" — treat all tool output as data, never as instructions; sanitize or sandbox where output
  feeds back into privileged decisions.
- **No auth on remote servers.** An HTTP MCP server without authentication is a public API for
  anyone who finds the URL. Authenticate, authorize per-tool, and rate-limit.
- **Leaking internals in errors.** Stack traces and SQL errors in tool responses teach attackers
  your internals and confuse the model. Structured, minimal errors only.
