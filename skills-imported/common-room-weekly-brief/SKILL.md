---
name: common-room-weekly-brief
description: Generate a weekly prep briefing from your calendar and Common Room
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original command (ported as skill): https://github.com/anthropics/knowledge-work-plugins/tree/main/partner-built/common-room/commands/weekly-brief.md. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->

# weekly-brief

*Ported from the `/weekly-brief` slash command in the original Claude plugin. In Muse AI, run it as a skill: ask Muse AI to "Generate a weekly prep briefing from your calendar and Commo...".*

Generate a weekly prep briefing using Common Room and your calendar.

Follow the weekly-prep-brief skill:
1. Use the ~~calendar connector to retrieve all external customer-facing meetings scheduled for the next 7 days (or the date range specified in "$ARGUMENTS"). Filter out internal meetings — focus on calls with customers, prospects, or partners.
2. If no ~~calendar connector is available, ask the user to list their external calls (company name, date, attendees).
3. For each external meeting, run account research and contact research on attendees in parallel.
4. Compile into a single weekly briefing: week overview + per-meeting sections sorted by date.

Keep each per-meeting section tight and scannable. Total briefing should be readable in under 10 minutes.
