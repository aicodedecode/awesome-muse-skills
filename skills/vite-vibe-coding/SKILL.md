---
name: vite-vibe-coding
description: Prototype at speed with Vite + AI coding assistants: scaffolding, rapid iteration loops, and knowing when to slow down for production. Use for fast AI-assisted prototyping.
category: web-development
---

# Vite Vibe Coding

A practical guide to high-velocity prototyping with Vite and AI coding assistants: scaffolding in seconds, tight iteration loops, and — critically — the checkpoints that turn a vibe-coded prototype into something shippable.

## Overview

"Vibe coding" = describing what you want and letting an AI assistant write the code, iterating conversationally. Vite is the ideal substrate: instant dev server, HMR, zero config for the common cases. This skill covers the **workflow** that makes AI-assisted building fast without producing an unmaintainable tangle: small prompts, verified increments, and deliberate hardening passes.

## When to use

- Prototypes, MVPs, hackathons, internal tools.
- Exploring an idea's UI/UX before committing to architecture.
- Learning a stack by building with AI guidance.
- Anytime speed matters more than structure — with a plan to add structure later.

## Core concepts

- **Scaffold first.** `npm create vite@latest` + the framework template. Don't let the AI reinvent project setup — start from the blessed template.
- **Small prompts, verified increments.** One feature per prompt; run it; see it work. Big-bang prompts ("build me a SaaS") produce big-bang messes.
- **The loop.** Prompt → generate → run (`npm run dev`) → observe (browser + console) → paste errors back → fix. The AI debugs best with actual error text and screenshots.
- **Pin the stack early.** Tell the assistant the exact stack (React + TS + Tailwind + shadcn-style components) in the first prompt; otherwise it improvises inconsistently.
- **Checkpoints.** After each working increment: does it run? Is the structure sane? Commit to git. Vibe coding without commits is just typing with extra steps.
- **Hardening pass.** Prototypes skip: error handling, loading states, accessibility, security, tests. Schedule the pass explicitly — "now harden" is a prompt too.

## Practical workflow

**1. Kickoff prompt (example).**
```
Scaffold a Vite + React + TypeScript + Tailwind app: a kanban board.
- Columns: Todo, Doing, Done. Drag cards between columns (use dnd-kit).
- Cards: title, description, labels. Persist to localStorage.
- One component per file under src/components. No backend.
```

**2. Iterate in slices.** "Add card editing via modal" → run → verify → commit. "Add due dates with overdue highlighting" → run → verify → commit. Each slice is reviewable.

**3. Debug with evidence.** Paste the actual terminal error + the relevant file. "It doesn't work" gets generic advice; the stack trace gets a fix.

**4. Refactor prompts.** "Extract the card logic into a useCards hook", "split Board.tsx — it's 400 lines", "replace these inline styles with the Button component". AI is good at mechanical refactors; direct them.

**5. Harden before shipping.**
- `npm run build` clean, no TS errors (`tsc --noEmit`).
- Loading/error/empty states on every async path.
- No secrets in client code; env vars documented.
- Basic a11y: labels, focus states, keyboard paths.
- Remove dead code and console.logs; run the linter.

**6. Know when to stop vibing.** Multi-user auth, payments, compliance, real-time collaboration — these need designed architecture, not vibes. Prototype the UI with vibes; engineer the critical paths deliberately.

## Common pitfalls

- **Mega-prompts.** "Build a full e-commerce site" → 2000 lines of plausible-looking, subtly-broken code. Slice it.
- **No verification.** Accepting code without running it. The loop is prompt→run→observe; skipping "run" accumulates invisible breakage.
- **Stack drift.** Letting the AI pick different libraries per prompt (axios here, fetch there, three styling approaches). Pin the stack in prompt #1 and repeat it.
- **No commits.** Hours of AI iteration with no git history = no rollback when it goes sideways. Commit per working slice.
- **Trusting the happy path.** AI-generated code rarely handles errors, empty states, or edge cases. Explicitly prompt for them: "add error and empty states to every data fetch."
- **Security blindness.** AI will happily put API keys in frontend code and skip auth checks. Review every network call and secret before shipping.
- **Dependency sprawl.** AI loves adding packages. Question each one: is it maintained? does the bundle need it? could stdlib do it?
- **Shipping the prototype.** Vibe code is a draft. The hardening pass isn't optional for anything users touch — it's what separates a demo from a product.
- **Context rot.** Long sessions degrade AI output quality. Start fresh sessions per major feature with a summary of the codebase state.
