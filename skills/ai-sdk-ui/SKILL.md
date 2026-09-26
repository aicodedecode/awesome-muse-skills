---
name: ai-sdk-ui
description: Build streaming AI user interfaces with AI SDK patterns — message rendering, tool-call displays, loading states, and optimistic updates. Use when creating chat UIs that stream model output and show agent activity.
category: ai-research
---

# Streaming AI Interfaces with AI SDK Patterns

Modern AI UIs stream: tokens appear as they're generated, tool calls show as activity, and the 
interface stays responsive throughout. AI SDKs provide the hooks and helpers for this — this 
skill covers the patterns, not any single SDK's API.

## Overview

The core pattern: a `useChat`-style hook manages messages, input, and streaming state; the UI 
renders message parts (text, tool calls, images) as they arrive. Tool invocations render as 
activity cards — "searching…", "reading file…" — so users see the agent working. State 
handling covers the lifecycle: idle, streaming, awaiting tool, error. Get these patterns right and 
the UI feels alive; get them wrong and it feels broken even when the model is fine.

## When to use

- Building a chat interface over a streaming model API.
- Showing agent activity: tool calls, reasoning progress, multi-step work.
- Adding AI features to an existing app: copilots, assistants, smart compose.
- Any UI where the model takes more than a second to respond (which is all of them).

## Core concepts

- **Streaming messages**: render tokens incrementally; handle the stream lifecycle (start, chunk, 
done, error, abort). Never leave the user staring at a spinner with no feedback.
- **Message parts**: messages as lists of parts — text, tool-call, tool-result, image, reasoning. 
Render each part with its own component.
- **Tool-call UI**: show tool activity as it happens — pending, running, complete — with 
human-readable labels, not raw JSON. Collapsible details for the curious.
- **Optimistic updates**: show the user's message immediately; show a typing/progress indicator for 
the assistant. Perceived latency matters as much as real latency.
- **Regeneration and editing**: let users retry a response or edit their message and re-run. These 
are core interactions, not extras.
- **Error and abort**: network failures, rate limits, user-cancelled streams — each needs a clear 
UI state and a recovery action (retry button, not a dead chat).

## Practical workflow

1. Set up the chat hook: messages state, send function, streaming status, abort controller.
2. Build the message list: part-based rendering — text streams in, tool calls show as activity 
cards.
3. Add input with submit-on-enter, disabled-during-streaming (or queueing), and a stop button.
4. Implement tool-call displays: map each tool to a friendly label and status indicator.
5. Handle the unhappy paths: errors with retry, abort with partial-message preservation, empty 
states with suggestions.
6. Polish: auto-scroll management, markdown rendering with sanitization, copy buttons, token/cost 
display if relevant.

```text
UI state machine:
idle → (send) → streaming → (done) → idle
                 ↓ (tool call)
            awaiting-tool → streaming (result in)
                 ↓ (error)              ↓ (abort)
               error → [retry]      partial kept → idle
```

## Common pitfalls

- **No streaming feedback**: waiting for the full response before rendering. Stream from the first 
token.
- **Raw JSON in the UI**: dumping tool calls as JSON blobs. Map tools to human-readable activity.
- **Broken auto-scroll**: jumping while the user reads history. Only auto-scroll when already at 
the bottom.
- **No abort**: users can't stop a runaway generation. Always provide stop.
- **Unsanitized markdown**: rendering model output as HTML without sanitization. XSS via chatbot is 
a real attack.
- **State loss on error**: a failed stream wiping the conversation. Preserve partial messages and 
offer retry.
