---
name: slack-channel-digest
description: Get a digest of recent activity across multiple Slack channels
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original command (ported as skill): https://github.com/anthropics/knowledge-work-plugins/tree/main/partner-built/slack/commands/channel-digest.md. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->

# channel-digest

*Ported from the `/channel-digest` slash command in the original Claude plugin. In Muse AI, run it as a skill: ask Muse AI to "Get a digest of recent activity across multiple Slack channe...".*

Given the comma-separated channel names provided in $ARGUMENTS (strip leading `#` and whitespace from each):

1. Parse the argument into individual channel names. Strip leading `#` and whitespace from each name.

2. For each channel:
   a. Use `slack_search_channels` to find the channel ID.
   b. Use `slack_read_channel` to read recent messages (use a limit of 50 messages per channel to keep things manageable).
   c. Summarize the key activity in that channel: main topics, decisions, questions, and notable messages.

3. Present the digest in this format:

   ```
   *Channel Digest — <today's date>*

   *#channel-1*
   - Summary point 1
   - Summary point 2

   *#channel-2*
   - Summary point 1
   - Summary point 2

   ...
   ```

4. For each channel, keep the summary to 3-5 bullet points maximum. Focus on what's actionable or noteworthy.

5. If a channel has no recent activity, note that it's been quiet and mention when the last message was posted (if visible).

6. If a channel name can't be found, let the user know and continue with the remaining channels.
