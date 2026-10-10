---
name: zoom-plugin-start
description: Start here for any Zoom integration or app idea. Use when you need to choose the right Zoom surface, shape the architecture, or route into the correct implementation skill without reading the whole Zoom doc set first.
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original skill: https://github.com/anthropics/knowledge-work-plugins/tree/main/partner-built/zoom-plugin/skills/start. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->


# Start

Use this as the default entry skill for the plugin.

## What This Skill Does

- Classifies the request by job-to-be-done, not by product name alone
- Routes into the right implementation skill
- Pulls in product-specific Zoom references only after the route is clear
- Prevents common early mistakes, especially Meeting SDK vs Video SDK and REST API vs connector confusion

## Routing Table

| If the user wants to... | Route to |
|---|---|
| Choose the right Zoom surface for a new project | [plan-zoom-product](../plan-zoom-product/SKILL.md) |
| Set up OAuth, tokens, scopes, or app credentials | [setup-zoom-oauth](../setup-zoom-oauth/SKILL.md) |
| Embed or customize a Zoom meeting flow | [build-zoom-meeting-app](../build-zoom-meeting-app/SKILL.md) |
| Build a bot, recorder, or real-time meeting processor | [build-zoom-bot](../build-zoom-bot/SKILL.md) |
| Use Zoom-hosted connector for AI workflows | [setup-zoom-mcp](../setup-zoom-mcp/SKILL.md) |
| Debug a broken integration | [debug-zoom](../debug-zoom/SKILL.md) |

## Supporting Zoom References

Use these only after selecting the workflow:

- [general](../general/SKILL.md)
- [rest-api](../rest-api/SKILL.md)
- [meeting-sdk](../meeting-sdk/SKILL.md)
- [video-sdk](../video-sdk/SKILL.md)
- [webhooks](../webhooks/SKILL.md)
- [websockets](../websockets/SKILL.md)
- [oauth](../oauth/SKILL.md)
- [zoom-mcp](../zoom-mcp/SKILL.md)

## Operating Rules

1. Prefer one clear recommendation over a product catalog dump.
2. Ask a short clarifier only when the route is genuinely ambiguous.
3. Keep the first response architectural and actionable, then go deep.
4. Pull in deeper references only when they directly help the current decision or implementation.
