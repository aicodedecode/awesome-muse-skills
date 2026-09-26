---
name: ai-ui-generation
description: Generate UI with AI tools effectively: prompt structure, design-system grounding, iteration technique, and evaluating output quality. Use when using AI to create interfaces.
category: web-development
---

# AI UI Generation

A vendor-neutral guide to generating user interfaces with AI tools: how to prompt for UI (structure, constraints, references), grounding output in your design system, iterating effectively, and judging quality — principles that apply whether the tool is a chat assistant, a dedicated UI generator, or an IDE agent.

## Overview

AI UI generation works best as **directed iteration**, not wish fulfillment. The tools produce plausible layouts fast; your job is supplying the constraints that make output match your product: the stack, the design tokens, the content, the states. Garbage in (vague prompt, no context) → generic in (a purple-gradient landing page that looks like every other AI landing page).

## When to use

- Drafting screens, layouts, and components with AI assistance.
- Exploring design directions quickly (divergent options, then converge).
- Generating boilerplate UI (forms, tables, settings pages) to refine by hand.
- Evaluating which parts of UI work to delegate vs hand-craft.

## Core concepts

- **Constraint-rich prompts.** Stack + framework + styling system + color palette + typography + layout structure + content (real copy, not lorem) + states (loading/error/empty) + responsive behavior. Every missing constraint is filled with a cliché.
- **Design-system grounding.** Paste your tokens/components: "use these Button/Card components, these colors, this spacing scale." AI respects concrete references far better than abstract adjectives.
- **Reference images.** "Like this screenshot's density, but our branding" beats "make it modern." Provide 1–2 references for style, layout, or vibe.
- **Real content.** Generate with actual copy and realistic data volumes. Lorem ipsum hides layout failures (long names, empty states, 200-row tables).
- **State coverage.** Prompt for loading, error, empty, and edge states explicitly — generators default to the happy path.
- **Iterative refinement.** Generate → critique (specifics: "denser", "less rounded", "match our nav") → regenerate the part, not the whole. Targeted follow-ups beat "try again."
- **Divergence then convergence.** Ask for 2–3 distinct directions first; pick one; refine. Refining the first output prematurely locks in mediocrity.

## Practical workflow

**1. Write the brief (template).**
```
Build a [screen/component]: [purpose, user, context].
Stack: React + Tailwind. Use existing components: Button, Card, Input from ./components.
Style: light theme, zinc + indigo accent, Inter, 8px spacing, rounded-lg, subtle shadows.
Layout: [describe structure: sidebar nav, main content grid, etc.]
Content: [real copy / realistic sample data — paste it]
States: loading skeleton, empty state ("No results"), error state with retry.
Responsive: single column under md, [layout] above.
Avoid: gradients, emojis, placeholder text.
```

**2. Generate, then audit.**
- Visual: hierarchy clear? spacing consistent? matches brand?
- Code: uses your components/tokens? accessible markup (labels, buttons, headings)? responsive classes present?
- Functionality: states covered? realistic data? no hardcoded secrets?

**3. Refine surgically.** "Keep everything, but: make the table denser (py-1.5), add sortable headers, handle the 0-results state." One concern per iteration.

**4. Hand-finish.** AI gets you 80%: layout, structure, boilerplate. The last 20% — micro-interactions, a11y details, edge cases, performance — is human craft. Budget for it.

**5. Extract patterns.** Repeated AI-generated blocks (cards, rows, forms) → extract into real components in your design system. Don't let generated code fossilize as copy-paste.

## Common pitfalls

- **Vague prompts.** "Make a dashboard" → generic output. Specificity is the entire game.
- **No design grounding.** Without tokens/components, output invents its own system — pretty, inconsistent, unmaintainable.
- **Lorem ipsum.** Hides real layout problems. Always use realistic content.
- **Happy-path only.** No loading/error/empty states = a demo, not a feature. Prompt for them explicitly.
- **Accepting the first output.** The first generation is a starting point. Diverge, critique, converge.
- **Inaccessible output.** AI often skips labels, focus management, ARIA, and semantic HTML. Audit every generated screen; fix by hand.
- **Style monoculture.** Unconstrained AI UI converges on the same look (gradients, glassmorphism, Inter). Constraints + references are the antidote.
- **Copy-paste fossilization.** Generated code duplicated across the codebase rots fast. Extract components; delete the rest.
- **No responsive check.** Generated desktop layouts break on mobile. Verify at 375px; prompt for responsive behavior up front.
