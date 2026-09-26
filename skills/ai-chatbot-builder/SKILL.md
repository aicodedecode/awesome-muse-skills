---
name: ai-chatbot-builder
description: Build AI chatbots end to end — conversation design, persona, retrieval grounding, escalation, and deployment. Use when creating a chatbot for support, sales, or internal assistance.
category: ai-research
---

# AI Chatbot Builder

A good chatbot is a designed conversation, not a model with a text box. This skill covers the full 
build: defining the job, designing the dialogue, grounding answers, handling failure gracefully, 
and shipping.

## Overview

Start from the job: what questions should this bot answer, and what actions should it take? Design 
the conversation — greeting, disambiguation, answer, follow-up — before writing prompts. Ground 
answers in your knowledge base so the bot says true things. Plan the failure paths: confusion, 
out-of-scope requests, angry users, and the handoff to humans. Then ship with analytics, because 
the first version is a hypothesis about what users will ask.

## When to use

- Customer support, sales assistance, or internal helpdesk automation.
- FAQ-style bots where answers exist in documentation.
- Lead qualification or intake bots with structured data capture.
- Replacing or upgrading a rules-based bot with an LLM-powered one.

## Core concepts

- **Conversation design**: the happy path plus the top failure paths, scripted as flows. Greeting 
→ intent → resolve → confirm → close. Design the unhappy paths with equal care.
- **Persona**: the bot's voice — tone, formality, name, boundaries. Consistent persona builds 
trust; document it so every prompt matches.
- **Grounding**: answers built from retrieved sources (docs, KB articles) with citations. The 
difference between a helpful bot and a confident liar.
- **Intent handling**: recognize what the user wants — including multi-intent and ambiguous 
messages — and disambiguate explicitly rather than guessing.
- **Escalation**: the human handoff — when (confidence low, sensitive topic, user asks), and how 
(with full context transferred, not a cold restart).
- **Analytics**: track intents, resolution rate, escalation rate, user satisfaction, and the 
"unknown" bucket. The unknown bucket is your roadmap.

## Practical workflow

1. Define scope: the top 20 questions/intents from real user data (tickets, logs). If you don't 
have data, interview the team that talks to users.
2. Build the knowledge base: clean, current source documents; chunk and index for retrieval.
3. Design conversation flows for the top intents plus failure paths (confused, out-of-scope, 
frustrated).
4. Implement with grounding: retrieve → generate with citations → confidence check → answer 
or escalate.
5. Test with real user phrasings — messy, typo'd, ambiguous — not your clean test cases.
6. Launch to a slice of traffic; review the unknown bucket weekly; expand scope based on data.

```text
Bot spec template:
SCOPE:    <top intents — from real data>
PERSONA:  <name, tone, formality, boundaries>
SOURCES:  <knowledge base docs + freshness owner>
FLOWS:    <happy paths + confusion + out-of-scope + escalation>
ESCALATE: <triggers + context handoff format>
METRICS:  <resolution %, escalation %, CSAT, unknown-bucket size>
```

## Common pitfalls

- **Scope creep at launch**: trying to answer everything on day one. Launch narrow, expand from the 
unknown bucket.
- **Ungrounded answers**: the bot improvising from model memory. Ground everything; abstain when 
sources are silent.
- **No escalation path**: trapping frustrated users in a bot loop. Always offer a human, early.
- **Testing with clean inputs**: real users are messy. Test with typos, slang, multi-intent 
messages.
- **Ignoring the unknown bucket**: the list of unhandled questions is the highest-value analytics 
you have. Review it weekly.
- **Set and forget**: knowledge goes stale, intents drift. Assign a KB owner and a review cadence.
