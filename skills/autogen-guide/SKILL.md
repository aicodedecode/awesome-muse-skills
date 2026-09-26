---
name: autogen-guide
description: Build conversational multi-agent systems with AutoGen — agent types, group chats, and orchestration patterns.
category: ai-research
---

## Overview

AutoGen structures multi-agent systems as conversations: agents are participants
that send and receive messages, and complex behavior emerges from their dialogue.
The core abstractions are conversable agents (LLM-backed agents that can chat, use
tools, and execute code), the two-agent patterns (assistant + user-proxy, where
the proxy represents human interests and can execute code), and group chat
(multiple agents with a manager selecting who speaks next). Code execution is a
first-class citizen — agents write code, a proxy executes it, and results flow
back into the conversation.

The framework's strength is flexibility: the same conversational substrate
supports pair programming, multi-agent debate, tool-use loops, and
human-in-the-loop workflows. The cost is that conversation is an undisciplined
medium — without careful speaker selection and termination conditions, group chats
ramble, loop, or stall. AutoGen gives you the pieces; the orchestration
discipline is yours to supply.

AutoGen rewards explicitness: every behavior you want (who speaks, when to stop,
what to do with code) must be configured. The defaults get you a demo; the
configuration gets you a system.

## When to use

- Code-centric agent tasks: agents that write, execute, and debug code
  collaboratively.
- Multi-agent discussion formats: debate, critique panels, brainstorming with
  distinct personas.
- Human-in-the-loop workflows where a person can interject in the agent
  conversation naturally.
- Research prototyping of novel multi-agent interaction patterns.
- Tasks where the "shared scratchpad" of a conversation history is a natural fit
  for coordination.
- Tool-use loops where code execution is the primary tool.

## Core concepts

- **ConversableAgent**: the base — an agent with an LLM, optional tools/code
  execution, and the ability to send/receive messages. Configure system messages
  carefully; they're the agent's entire identity.
- **AssistantAgent vs. UserProxyAgent**: the canonical pair. The assistant suggests
  (code, plans, analysis); the proxy executes code and represents human interests,
  relaying results back. The proxy can be set to auto-reply, ask for human input,
  or terminate.
- **Code execution**: the proxy runs code the assistant writes (in a sandbox —
  always sandboxed) and returns stdout/errors. This write-execute-debug loop is
  AutoGen's signature capability and its signature risk.
- **GroupChat + GroupChatManager**: N agents converse; the manager (LLM-based)
  picks the next speaker each round. Speaker selection quality determines whether
  the chat converges or meanders.
- **Termination conditions**: max rounds, termination keywords ("TERMINATE"), or
  custom predicates. Group chats without crisp termination run until the budget
  dies. Always set at least two independent stop conditions.
- **Nested chats**: an agent can spawn a sub-conversation with other agents and
  return the summary. Useful for delegating subtasks without polluting the main
  thread.
- **Speaker selection strategies**: round-robin (predictable, good for structured
  debate), random, manual, and LLM-managed (flexible, needs good prompts). Match
  the strategy to the conversation shape.
- **Message history as state**: the conversation IS the shared state. Long chats
  accumulate everything — which is powerful for context and dangerous for
  relevance and cost.

## Practical workflow

1. **Start with the two-agent pattern.** Assistant + proxy with code execution
   covers a surprising range of tasks (data analysis, coding,
   research-with-computation). Master this before group chat.
2. **Sandbox code execution.** Docker or an equivalent isolated environment,
   network-restricted, with timeouts. Agents writing code that executes on your
   machine is powerful and dangerous — treat the sandbox as non-negotiable.
3. **Write tight system messages.** Each agent: role, capabilities, what it should
   and shouldn't do, when to terminate. Include the termination keyword protocol
   explicitly.
4. **Choose speaker selection deliberately.** Round-robin for structured
   discussions; LLM-managed for dynamic collaboration — with a well-written
   selection prompt that encodes your intended discussion order.
5. **Add group chat deliberately.** Define participants, write the manager's
   speaker-selection prompt (order matters: "prefer the critic after the coder
   proposes"), and set max rounds conservatively (10–20).
6. **Instrument the conversation.** Log every message with speaker and timestamp.
   Debugging multi-agent chats means reading transcripts — build the tooling to
   search and filter them.
7. **Harden termination.** Test that chats actually stop: on success, on repeated
   failure, on nonsense. A chat that can't terminate is a billing incident.

Checklist for an AutoGen deployment:
- Code execution sandboxed with network and time limits.
- At least two independent termination conditions.
- System messages include termination protocol.
- Speaker selection strategy chosen deliberately and tested.
- Transcript logging with speaker attribution.
- Human-in-the-loop hook for irreversible actions.

## Common pitfalls

- **Unsandboxed execution.** The single biggest risk. An agent that writes and
  runs code needs a cage, not trust.
- **Manager picking poorly.** LLM speaker selection degrades with many
  participants or vague roles. Keep groups small (3–5) and roles distinct;
  consider round-robin for structured debates.
- **Termination failures.** Chats that loop ("looks good!" "thanks!" "TERMINATE"
  never comes) or stall (no agent willing to speak). Test termination explicitly
  with adversarial runs.
- **Context explosion.** Every message goes to every participant's context. Long
  group chats drown in their own history. Summarize periodically or use nested
  chats for subtasks.
- **Vague agent identities.** "You are a helpful agent" in a group of five helpful
  agents produces mush. Give each agent a sharp role, distinct tools, and explicit
  speaking triggers.
- **Human-in-the-loop as default.** Requiring approval per message kills autonomy;
  never requiring it risks damage. Gate the irreversible actions, automate the
  rest.
- **Single termination condition.** One mechanism (just max rounds, just a
  keyword) fails in exactly the case you didn't anticipate. Layer them.
- **No transcript tooling.** Trying to debug multi-agent behavior from raw logs.
  Build search, filtering, and per-agent views from the start.
