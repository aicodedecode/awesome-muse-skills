---
name: setup-zoom-mcp
description: Decide when Zoom connector is the right fit and produce a safe setup plan for Muse AI. Use when planning AI workflows over Zoom data, deciding between connector and REST, or defining a hybrid connector architecture.
argument-hint: "<AI workflow or connector use case>"
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original skill: https://github.com/anthropics/knowledge-work-plugins/tree/main/partner-built/zoom-plugin/skills/setup-zoom-mcp. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->


# /setup-zoom-mcp

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](./CONNECTORS.md).

Plan a Zoom connector workflow and decide when to use connector alone versus a hybrid REST API + connector architecture.

## Usage

```text
/setup-zoom-mcp $ARGUMENTS
```

## Workflow

1. Determine whether the goal is deterministic automation, AI tool orchestration, or a hybrid.
2. If connector is appropriate, identify the likely Zoom connector surface and transport assumptions.
3. If connector alone is not enough, define the REST API responsibilities separately.
4. Call out auth, scope, and client capability constraints.
5. End with a minimal proof-of-concept sequence.

## Output

- Recommended connector strategy
- Connector expectations
- Hybrid boundaries if REST is also required
- Risks and setup notes
- Relevant skill links

## Related Skills

- [design-mcp-workflow](../design-mcp-workflow/SKILL.md)
- [choose-zoom-approach](../choose-zoom-approach/SKILL.md)
