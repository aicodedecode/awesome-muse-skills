---
name: slack-summarize-channel
description: Summarize recent activity in a Slack channel
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original command (ported as skill): https://github.com/anthropics/knowledge-work-plugins/tree/main/partner-built/slack/commands/summarize-channel.md. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->

# summarize-channel

*Ported from the `/summarize-channel` slash command in the original Claude plugin. In Muse AI, run it as a skill: ask Muse AI to "Summarize recent activity in a Slack channel...".*

Given the channel name provided in $ARGUMENTS (strip any leading `#`):

1. Use the `slack_search_channels` tool to find the channel ID for the provided channel name. Strip any leading `#` from the argument before searching.
2. Use the `slack_read_channel` tool to read recent messages from the channel (default limit of 100 messages).
3. For any messages that have threads with replies, use `slack_read_thread` to read the thread contents so the summary captures threaded discussions.
4. Produce a concise summary organized by topic or theme. The summary should include:
   - An overview of the main topics discussed
   - Key decisions or action items mentioned
   - Notable announcements or updates
   - Active threads and their conclusions (if any)
5. Keep the summary scannable — use short bullet points grouped by topic. Mention who said what when it's relevant (e.g., decisions, action items).
6. If the channel has very little recent activity, say so and note the last time a message was posted.
