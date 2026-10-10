---
name: build-zoom-meeting-app
description: Build or embed a Zoom meeting flow. Use when implementing Meeting SDK joins, web or mobile meeting embeds, meeting lifecycle flows, or when deciding between Meeting SDK and Video SDK.
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original skill: https://github.com/anthropics/knowledge-work-plugins/tree/main/partner-built/zoom-plugin/skills/build-zoom-meeting-app. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->


# /build-zoom-meeting-app

Use this skill for embedded meeting experiences and meeting lifecycle implementation.

## Covers

- Meeting SDK selection and platform routing
- Join/auth implementation planning
- Meeting creation plus join flow design
- Web vs native platform considerations
- Meeting SDK vs Video SDK boundary decisions

## Workflow

1. Confirm whether the user wants a Zoom meeting or a custom video session.
2. Route to Meeting SDK if the user needs actual Zoom meetings.
3. Pull in the relevant platform references.
4. Add REST API only for meeting creation, resource management, or reporting.
5. Add webhooks or RTMS only when the use case explicitly needs them.

## Primary References

- [meeting-sdk](../meeting-sdk/SKILL.md)
- [rest-api](../rest-api/SKILL.md)
- [webhooks](../webhooks/SKILL.md)
- [rtms](../rtms/SKILL.md)
- [video-sdk](../video-sdk/SKILL.md)

## Common Mistakes

- Using Video SDK for normal Zoom meeting embeds
- Mixing resource-management APIs into the core join flow without reason
- Skipping platform-specific SDK constraints until too late
