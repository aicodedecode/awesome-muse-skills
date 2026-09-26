---
name: chatbot-ui-patterns
description: Design chatbot user interfaces — message layouts, suggestion chips, rich cards, feedback controls, and accessibility. Use when designing the visual and interaction layer of conversational UIs.
category: ai-research
---

# Chatbot UI Patterns

The interface is the product for most chatbot users. These patterns cover what works: message 
design, guidance controls, rich content, feedback loops, and the accessibility details that 
separate professional bots from demos.

## Overview

Good chat UI reduces the user's cognitive load: clear message hierarchy, suggested next actions, 
rich rendering of structured content, and obvious paths when things go wrong. The patterns below 
are interface conventions proven across consumer and enterprise bots — layout, components, and 
micro-interactions that make conversations feel effortless.

## When to use

- Designing or redesigning a chatbot interface from scratch.
- Auditing an existing bot UI for usability issues.
- Adding rich interactions: cards, carousels, forms inside chat.
- Making a bot accessible to keyboard and screen-reader users.

## Core concepts

- **Message hierarchy**: user vs. assistant visually distinct; timestamps subtle; avatars minimal. 
The conversation should scan like a dialogue, not a wall of bubbles.
- **Suggestion chips**: tappable follow-ups and common queries above the input. They teach users 
what the bot can do — the single best onboarding device.
- **Rich cards**: structured content (products, appointments, results) rendered as cards with 
actions, not as paragraphs. Carousels for multiple options.
- **Progressive disclosure**: long answers with expandable sections; tool activity collapsible. 
Don't overwhelm; let users drill in.
- **Feedback controls**: thumbs up/down per message, with optional reason. Feeds evals and model 
improvement — make it one tap.
- **Empty and error states**: first-run suggestions, graceful "I didn't understand" with 
alternatives, offline/retry states. Designed, not defaulted.

## Practical workflow

1. Define the message anatomy: parts (text, cards, chips, citations) and how each renders on 
desktop and mobile.
2. Design the input area: text field, suggestion chips, attachments, voice — only what the bot 
actually supports.
3. Build rich components for your top intents: if users book appointments, design the appointment 
card first.
4. Add feedback on every assistant message; wire it to your eval pipeline.
5. Design the failure states: confusion, out-of-scope, errors, escalation — each with a clear 
next step.
6. Accessibility pass: keyboard navigation, screen-reader labels, focus management, color contrast, 
reduced-motion support.

```text
Chat UI checklist:
[ ] User/assistant visually distinct, scannable
[ ] Suggestion chips teach capabilities
[ ] Top intents have rich (non-text) renderings
[ ] Feedback control on every assistant message
[ ] Designed empty, error, and escalation states
[ ] Keyboard + screen-reader navigable
[ ] Works on small screens without horizontal scroll
```

## Common pitfalls

- **Bubbles for everything**: long answers as giant bubbles are unreadable. Use structured layouts 
for structured content.
- **No guidance**: an empty input box with no hints. Users don't know what to ask — chips and 
examples fix this.
- **Feedback nobody reads**: collecting ratings into a void. Wire feedback to evals and review it.
- **Desktop-only design**: chat is heavily mobile. Design small-screen first.
- **Inaccessible by default**: divs instead of buttons, no ARIA, focus lost on updates. 
Accessibility is a design requirement, not a polish step.
- **Citations as an afterthought**: grounded bots need visible sources. Design citation display 
into the message anatomy.
