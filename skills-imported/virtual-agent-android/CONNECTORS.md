# Connectors

This plugin works in two modes:

- Standalone: Muse AI uses the bundled Zoom skills and reference material included with this plugin.
- Supercharged: Muse AI can also use the bundled Zoom connectors from [`connector config`](./connector config) for live tool access.

## Included connector Servers

| Connector | Endpoint | Use For |
|---|---|---|
| `zoom-mcp` | `https://mcp-us.zoom.us/mcp/zoom/streamable` | Zoom-hosted connector workflows for meetings, recordings, summaries, and meeting assets |
| `zoom-docs-mcp` | `https://mcp.zoom.us/mcp/docs/streamable` | Zoom Docs creation, retrieval, and Markdown-based document workflows |
| `zoom-whiteboard-mcp` | `https://mcp-us.zoom.us/mcp/whiteboard/streamable` | Whiteboard-specific connector workflows |

## Authentication

The bundled connector definitions expect bearer tokens in these environment variables:

```bash
export ZOOM_MCP_ACCESS_TOKEN="your_zoom_user_oauth_access_token"
export ZOOM_DOCS_MCP_ACCESS_TOKEN="your_zoom_docs_mcp_access_token"
export ZOOM_WHITEBOARD_MCP_ACCESS_TOKEN="your_zoom_user_oauth_access_token"
```

- `ZOOM_MCP_ACCESS_TOKEN` is used for the main Zoom connector.
- `ZOOM_DOCS_MCP_ACCESS_TOKEN` is used for the Zoom Docs connector.
- `ZOOM_WHITEBOARD_MCP_ACCESS_TOKEN` is used for the Whiteboard connector.
- If one OAuth token includes both the main Zoom connector scopes and the Zoom Docs connector scopes, both variables can use the same value.
- After setting or rotating any of these tokens, restart Muse AI or re-enable the plugin so the connectors restart with the new environment.

## What You Can Do Without Connectors

- Choose the right Zoom surface for a new integration
- Plan SDK, REST API, webhook, OAuth, and connector implementations
- Compare Meeting SDK vs Video SDK vs Zoom Apps vs REST API
- Debug architecture, auth, event-delivery, and integration mistakes
- Use the deep Zoom reference library bundled in `skills/`

## What Connectors Add

- Live connector tool discovery and execution against Zoom-hosted connectors
- Real meeting-search, recording-resource, and document workflows
- Whiteboard-specific tool access when applicable

## Notes

- If a command or skill mentions connectors and you are not connected, continue in standalone mode using the reference docs.
- If you are unsure which connector is relevant, start with [`/setup-zoom-mcp`](./skills/setup-zoom-mcp/SKILL.md).
