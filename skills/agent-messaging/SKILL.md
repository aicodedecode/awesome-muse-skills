---
name: agent-messaging
description: Coordinate agents via messaging: send, receive, and manage inter-agent communication. Use when agents need to collaborate, hand off work, or notify each other.
category: ai-maestro
---

# Agent Messaging

## Overview

Multi-agent work needs communication: task assignments, handoffs, status updates, and questions — passed as messages between agents.

The Agent Messaging Protocol pattern: signed, addressed messages with types (task, result, question, notification), routed through the orchestrator.

Good messaging: explicit recipients, structured payloads, acknowledged receipt, and a searchable history.

## When to use

- Agents handing off work to each other
- Coordinator assigning tasks to worker agents
- Agents requesting info or review from peers
- Broadcasting status or alerts across a fleet
- Auditing what agents told each other

## Core concepts

- **Addressed messages.**
  Every message has sender, recipient(s), and type. Broadcast sparingly; addressed messages create accountability.
- **Message types.**
  Task (do this), result (done, here's output), question (need input), notification (FYI), escalation (needs human). Types drive handling.
- **Structured payloads.**
  Machine-readable bodies: task specs, file paths, data — not prose paragraphs. Structure enables automation on receipt.
- **Signed messages.**
  Cryptographic signatures prove sender identity. In multi-agent systems, spoofed instructions are a real attack vector.
- **Acknowledgment.**
  Recipients ack receipt; senders retry or escalate on no-ack. Unacknowledged critical messages are how work silently dies.
- **Threading.**
  Replies reference the original message ID. Threads keep multi-turn coordination coherent across many agents.
- **Inbox discipline.**
  Agents process inboxes in priority order, archive handled messages, escalate what they can't handle. Inbox zero applies to agents too.
- **History and audit.**
  Message log is the collaboration audit trail: who asked what, who promised what, when. Invaluable for debugging and accountability.

## Practical workflow

1. **Define the protocol.**
   Message types, required fields, addressing rules, ack expectations. Write it down — agents follow specs, not vibes.
2. **Set up identities.**
   Each agent has a verifiable identity (keys for signing). The orchestrator routes and logs.
3. **Send structured messages.**
   Task assignments with full specs; handoffs with artifact locations; questions with context and deadline.
4. **Process inboxes.**
   Agents triage on wake: urgent first, tasks next, FYIs last. Ack everything actionable; archive handled.
5. **Thread conversations.**
   Multi-turn coordination stays in threads. New topic = new thread, not a reply to an old one.
6. **Escalate properly.**
   Blocked or confused: escalate to coordinator/human with context, not silence. Escalation is a message type, use it.
7. **Audit regularly.**
   Review message logs for patterns: bottlenecks, dropped handoffs, unclear specs. The log reveals system problems.
8. **Secure the channel.**
   Signatures verified, sensitive payloads encrypted, access scoped. Inter-agent messaging is infrastructure — harden it.

## Common pitfalls

- **Unaddressed broadcasts.**
  Everything to everyone = nothing to anyone. Address messages; broadcast only true announcements.
- **Prose payloads.**
  'Hey can you look at the thing?' as a task. Structured specs or the recipient guesses — and guesses wrong.
- **No acknowledgment.**
  Fire-and-forget task assignment. No-ack means no accountability; require acks on anything important.
- **Unsigned messages.**
  Any agent can claim to be the coordinator. Sign messages; verify signatures — prompt injection via messaging is real.
- **Thread chaos.**
  Ten topics in one thread. One thread per topic; discipline here prevents coordination collapse.
- **Inbox neglect.**
  Agents that never check messages. Inbox processing must be scheduled, not optional.
- **No escalation path.**
  Stuck agents staying silent. Escalation must be easy, expected, and blameless.
- **Unlogged coordination.**
  Decisions made in messages nobody can find later. The log is the memory of the collaboration — keep it.
