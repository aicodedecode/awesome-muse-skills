---
name: design-mcp-workflow
description: Design a Zoom connector workflow for Muse AI. Use when deciding whether Zoom connector fits a task, when planning tool-based AI workflows, or when separating connector responsibilities from REST API responsibilities.
user-invocable: false
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original skill: https://github.com/anthropics/knowledge-work-plugins/tree/main/partner-built/zoom-plugin/skills/design-mcp-workflow. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->


# Design connector Workflow

Use this skill when the user wants Muse AI or another connector-capable client to interact with Zoom via tool calls instead of only deterministic API code.

## Covers

- connector fit assessment
- REST API vs connector boundaries
- Hybrid architectures
- Connector expectations
- Whiteboard-specific connector routing

## Workflow

1. Decide whether the problem is agentic tooling, deterministic automation, or both.
2. Route connector-only tasks to [zoom-mcp](../zoom-mcp/SKILL.md).
3. Route hybrid tasks to both [zoom-mcp](../zoom-mcp/SKILL.md) and [rest-api](../rest-api/SKILL.md).
4. If Whiteboard is central, route to [zoom-mcp/whiteboard](../zoom-mcp/whiteboard/SKILL.md).
5. Call out transport, auth, and client capability assumptions explicitly.

## Common Mistakes

- Using connector for deterministic backend jobs that should stay in REST
- Treating connector as a replacement for all API design
- Ignoring client transport support and auth requirements
