---
name: mcp-integration
description: Integrate with the Model Context Protocol — its primitives (tools, resources, prompts), transports, auth, and debugging. Use when connecting agents to external data and capabilities through this open protocol.
category: ai-research
---

# Model Context Protocol (MCP) Integration

MCP is an open protocol for connecting AI agents to external capabilities: a standard way for 
"servers" to expose tools, data, and prompts that any compliant client can use. Learn the 
primitives once, integrate with anything.

## Overview

MCP separates concerns: servers expose capabilities; clients (agents, apps) consume them; the 
protocol defines how they talk. A server offers three primitives — tools (actions the model can 
invoke), resources (data the model can read), and prompts (reusable prompt templates). Transports 
carry the messages (stdio for local, HTTP-based for remote). Because it's a standard, one client 
works with many servers, and capabilities compose without custom glue code per integration.

## When to use

- Giving an agent access to external systems (files, databases, APIs, services) through a standard 
interface.
- Building a server that exposes your system's capabilities to any MCP-compatible agent.
- Choosing between a custom integration and a protocol-based one (prefer the protocol when clients 
vary).
- Debugging a misbehaving MCP connection: handshake, capability, or transport issues.

## Core concepts

- **Tools**: executable functions a server exposes — with names, descriptions, and input schemas. 
The model's action interface. Design them like good APIs: narrow, typed, documented.
- **Resources**: readable data — files, records, query results — exposed at URIs the model can 
fetch. The model's read interface; separate from tools because reading isn't acting.
- **Prompts**: server-defined prompt templates with parameters. Let servers ship best-practice 
prompts for their own domain.
- **Transports**: stdio (server as a subprocess — simple, local) vs. networked HTTP transports 
(remote servers, multi-client). Choose by deployment: local tools → stdio; shared services → 
networked.
- **Capability negotiation**: client and server agree on what's supported at handshake. Check 
negotiated capabilities before assuming a feature exists.
- **Auth**: networked servers need authentication — tokens, OAuth flows — scoped to least 
privilege. Never put credentials in the protocol messages themselves beyond the auth layer.

## Practical workflow

1. Decide: consume or provide? Consuming = configure a client with server endpoints. Providing = 
implement the three primitives for your system.
2. As a consumer: configure servers, verify the handshake, list exposed tools/resources, and test 
each tool standalone before agent use.
3. As a provider: expose tools with clean schemas, resources with sensible URIs, and prompts for 
your common workflows. Start with read-only.
4. Test the round trip: client lists capabilities → invokes tool → reads resource → uses 
prompt. Verify each primitive independently.
5. Harden: auth on networked servers, input validation on tools, rate limits, and logging of every 
invocation.
6. Debug systematically: transport up? handshake complete? capabilities negotiated? tool schema 
valid? — in that order.

```text
Integration checklist:
[ ] Transport chosen (local stdio vs networked) and working
[ ] Handshake + capability negotiation verified
[ ] Tools listed, schemas inspected, each tested standalone
[ ] Resources readable at their URIs
[ ] Auth configured with least-privilege scopes (networked)
[ ] Invocation logging enabled
```

## Common pitfalls

- **Assuming capabilities**: calling a tool the server didn't advertise. Always list and verify 
after handshake.
- **No auth on networked servers**: exposing tools over the network without authentication. Treat 
it like any public API.
- **Tools that are too broad**: one tool that does everything defeats the protocol's composability. 
Keep tools narrow.
- **Skipping standalone tests**: wiring an untested server into an agent and debugging both at 
once. Test the server alone first.
- **Credential leakage**: embedding secrets in configs checked into repos. Use env vars and secret 
stores.
- **No versioning**: changing tool schemas without versioning breaks clients. Version your server's 
interface.
