---
name: build-zoom-bot
description: Build a Zoom meeting bot, recorder, or real-time media workflow. Use when joining meetings programmatically, processing live media or transcripts, or combining Meeting SDK, RTMS, and backend services.
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original skill: https://github.com/anthropics/knowledge-work-plugins/tree/main/partner-built/zoom-plugin/skills/build-zoom-bot. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->


# /build-zoom-bot

Use this skill for automation that joins meetings, captures media, or reacts to live session data.

## Covers

- Bot architecture
- Meeting join strategy
- Real-time media and transcript handling
- Backend orchestration
- Storage, post-processing, and event flow design

## Workflow

1. Clarify whether the bot needs to join, observe, transcribe, summarize, or act.
2. Route to Meeting SDK and RTMS as the core implementation path.
3. Add REST API for meeting/resource management and Webhooks for asynchronous events when needed.
4. Call out environment and lifecycle constraints early.

## Primary References

- [meeting-sdk](../meeting-sdk/SKILL.md)
- [rtms](../rtms/SKILL.md)
- [scribe](../scribe/SKILL.md)
- [rest-api](../rest-api/SKILL.md)
- [webhooks](../webhooks/SKILL.md)

## Common Mistakes

- Treating batch transcription and live media as the same workflow
- Designing the bot before defining join authority and auth model
- Forgetting post-meeting storage and retry behavior
