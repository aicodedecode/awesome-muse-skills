---
name: prompt-to-ui-workflows
description: Take AI-generated UI into production: code review, hardening, accessibility, performance, and design-system integration. Use after generating UI with AI tools.
category: web-development
---

# Prompt-to-UI Workflows

A vendor-neutral production pipeline for AI-generated UI: the review checklist, hardening steps, accessibility remediation, and design-system integration that turn generated drafts into shippable interfaces — with any AI tool.

## Overview

AI generates UI fast; production requires **trust**. This skill is the bridge: a systematic workflow applied to any AI-generated interface before it ships. Think of generated code as a junior developer's first draft — promising, needing review, never merged blind. The pipeline: **review → integrate → harden → verify.**

## When to use

- After any AI tool generates screens, components, or layouts.
- Setting team standards for AI-assisted frontend work.
- Auditing a codebase with significant AI-generated UI.
- Deciding what "done" means for generated interfaces.

## Core concepts

- **Generated code is untrusted input.** Review it like a PR from someone you don't know: verify behavior, check for secrets, question dependencies.
- **The 80/20 split.** Generation covers structure and boilerplate (80%); humans own the last 20%: edge cases, a11y, performance, polish.
- **Design-system conformance.** Generated code must use your tokens and components — or explicitly justify exceptions. Visual consistency is a feature.
- **Progressive hardening.** Review → integrate → states → a11y → perf → security, in that order. Each gate has a checklist.

## Practical workflow

**1. Code review gate.** Read every line of generated code (it's usually <500 lines per screen — readable).
- [ ] No secrets, API keys, or hardcoded credentials.
- [ ] No unexpected dependencies (check imports; question each new package).
- [ ] No `dangerouslySetInnerHTML` / `innerHTML` with unescaped data.
- [ ] Follows project conventions (file layout, naming, component patterns).
- [ ] TypeScript types are real, not `any` soup.

**2. Integration gate.**
- [ ] Uses design-system components/tokens (Button, colors, spacing) — replace invented one-offs.
- [ ] Repeated blocks extracted into shared components.
- [ ] Routing, data fetching wired to real sources (replace mocks deliberately, not accidentally).
- [ ] Removed placeholder content, lorem ipsum, fake data.

**3. States gate.**
- [ ] Loading skeletons/spinners on every async path.
- [ ] Empty states with helpful copy + action.
- [ ] Error states with retry; errors logged to tracking.
- [ ] Disabled states during submission; no double-submit.

**4. Accessibility gate.**
- [ ] Semantic HTML (headings hierarchy, lists, buttons vs divs).
- [ ] Labels on all inputs; error messages linked via `aria-describedby`.
- [ ] Keyboard navigable; visible focus states; logical tab order.
- [ ] Color contrast meets AA; no information by color alone.
- [ ] Screen-reader check on dynamic content (live regions where needed).

**5. Performance gate.**
- [ ] Images optimized (modern formats, sizes, lazy loading).
- [ ] No render loops; lists virtualized/keyed properly.
- [ ] Bundle impact checked (new deps justified).
- [ ] Lighthouse / Core Web Vitals within targets.

**6. Verify.** Run the full test suite + manual pass on mobile and desktop; check the production build (`npm run build` clean).

## Common pitfalls

- **Merging blind.** The #1 failure: generated code committed without reading. Always review.
- **Mock data shipped.** Placeholder data that "looked fine in the demo" reaching production. Grep for TODO/lorem/sample before release.
- **Invented design system.** Generated components duplicating your existing ones with slightly different styles. Enforce reuse.
- **A11y deferred forever.** "We'll fix accessibility later" = never. Gate on it now; remediation later costs 10x.
- **Secret leakage.** AI-generated examples with API keys, or real keys pasted into prompts ending up in code. Scan before merge.
- **Dependency surprises.** AI-added packages with vulnerabilities, huge size, or abandoned maintenance. Audit each addition.
- **No owner.** "The AI wrote it" → nobody understands it → nobody maintains it. Assign a human owner to every generated module.
- **Skipping the build check.** Generated code that works in dev but breaks the production build (SSR issues, bad imports). Build + preview before merging.
