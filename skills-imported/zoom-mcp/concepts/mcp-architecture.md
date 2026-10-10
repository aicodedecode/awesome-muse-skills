# connector Architecture — Zoom connector Server

## What is connector?

Model Context Protocol (connector) standardizes how AI systems connect to external tools and data
sources. Zoom exposes hosted connector surfaces that clients can discover and call over MCP.

## Hosted Zoom connector Surfaces

### Zoom connector

| Transport | URL |
|-----------|-----|
| Streamable HTTP (recommended) | `https://mcp-us.zoom.us/mcp/zoom/streamable` |
| SSE (fallback) | `https://mcp-us.zoom.us/mcp/zoom/sse` |

### Whiteboard connector

| Transport | URL |
|-----------|-----|
| Streamable HTTP (recommended) | `https://mcp-us.zoom.us/mcp/whiteboard/streamable` |
| SSE (fallback) | `https://mcp-us.zoom.us/mcp/whiteboard/sse` |

Whiteboard connector is covered by the dedicated skill
[../whiteboard/SKILL.md](../whiteboard/SKILL.md).

## Discovery Model

Do not hardcode tool counts in client logic.

Use the connector protocol `tools/list` response as the current source of truth for:
- tool names
- descriptions
- parameter schemas
- newly added or removed tools

## Current Capability Shape

The current Zoom connector surface is centered on:
- semantic meeting search
- meeting asset retrieval
- recording resource retrieval
- Zoom Docs creation from Markdown

If the task requires deterministic meeting CRUD, use the REST API skill instead of assuming
those operations exist on the current Zoom connector surface.

## Authentication Model

User OAuth is the primary documented path.
Use user OAuth as the expected auth model for the bundled Zoom connectors in this plugin.

## Protected Resource Metadata

The hosted connector surfaces advertise supported scopes through OAuth protected-resource metadata.
Zoom connector protected-resource metadata currently exposes:
- `ai_companion:read:search`
- `meeting:read:assets`
- `meeting:read:search`
- `cloud_recording:read:content`
- `cloud_recording:read:list_user_recordings`
- `docs:write:import`
- `docs:read:export`

Whiteboard connector protected-resource metadata currently exposes:
- `whiteboard:write:whiteboard`
- `whiteboard:read:list_whiteboards`
- `whiteboard:read:whiteboard`

## Retrieval Model

`search_meetings` is not just a title filter. It is a semantic retrieval path over meeting
content, recap-linked assets, and recording-linked artifacts.

Useful result families:
- recap-oriented results with AI summaries and linked assets
- recording-oriented results for post-meeting content retrieval

When writing parsers, validate the live response shape from the server rather than relying on
older example field names.

## Feature Prerequisites

AI Companion features such as **Smart Recording** and **Meeting Summary** are feature
prerequisites for useful semantic retrieval and recap-linked content. They do not replace the
required OAuth scopes.

## Error Layering

Failures can happen at two layers:
- connector protocol layer (`-32001`, `-32602`, `-32603`)
- underlying Zoom API-style permission/resource failures surfaced through the connector response

See [../references/error-codes.md](../references/error-codes.md).
