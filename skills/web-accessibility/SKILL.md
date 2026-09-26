---
name: web-accessibility
description: Build accessible websites: semantic HTML, ARIA, keyboard support, focus management, and WCAG testing. Use for inclusive, compliant web development.
category: web-development
---

# Web Accessibility

A practical guide to building accessible websites: semantic HTML first, ARIA where needed, keyboard support, focus management, color contrast, and testing — covering WCAG 2.2 AA in practice, not just theory.

## Overview

Accessibility is **usability for everyone**, including people using screen readers, keyboards, voice control, or with low vision, color blindness, or motor/cognitive differences. The good news: 80% of it is unglamorous fundamentals — semantic HTML, labels, contrast, keyboard support. The expensive failures come from custom components (dropdowns, modals, tabs) built without the platform's built-in behaviors.

Rule: **use native elements first** (`<button>`, `<input>`, `<select>`, `<dialog>`). Custom components must reimplement everything native gives free.

## When to use

- Every web project (a11y is a requirement, not a feature).
- Auditing an existing site for WCAG compliance.
- Building custom interactive components (menus, dialogs, tabs, tooltips).
- Meeting legal requirements (ADA, EAA, Section 508).

## Core concepts

- **Semantic HTML.** Headings (`h1`–`h6` hierarchical, one `h1`), landmarks (`header`, `nav`, `main`, `footer`), lists for list content, `<button>` for actions, `<a>` for navigation. Screen readers navigate by these.
- **ARIA.** Roles, states, properties — a *supplement*, not a substitute. `aria-label`/`aria-labelledby` for naming, `aria-describedby` for descriptions/errors, `aria-expanded`/`aria-pressed` for state, `role="alert"`/`aria-live` for dynamic updates. First rule of ARIA: don't use it if native HTML works.
- **Keyboard.** Everything interactive reachable and operable by keyboard: visible focus indicators, logical tab order, no keyboard traps, skip links for long pages, roving tabindex for composite widgets (menus, tablists, grids).
- **Focus management.** Dialogs: trap focus inside, return focus to trigger on close, move focus into dialog on open. Route changes (SPAs): move focus to the new page heading.
- **Contrast.** 4.5:1 for normal text, 3:1 for large text/UI components (WCAG AA). Test with real tools, not eyeballing.
- **Motion.** `prefers-reduced-motion`: disable/simplify non-essential animation.
- **Forms.** Every input has a label (`<label for>` or wrapping); errors identified in text and linked via `aria-describedby`; required indicated programmatically (`required`/`aria-required`).

## Practical workflow

**1. Semantic pass.** Review markup: headings hierarchy valid? landmarks present? buttons are `<button>`? lists are lists? Fix the HTML before touching ARIA.

**2. Keyboard pass.** Unplug the mouse: tab through everything. Can you reach it all? See focus? Operate menus/dialogs? Escape closes? Fix traps and invisible focus.

**3. Screen reader pass.** Test with NVDA/VoiceOver (free): does the page make sense linearly? Are dynamic updates announced? Are images described (or decorative-marked `alt=""`)?

**4. Automated + manual.** axe/ Lighthouse catch ~30–40% of issues (contrast, missing labels, invalid ARIA). The rest needs manual testing — automation is a floor, not a ceiling.

**5. Component checklist (custom widgets).** For each custom dropdown/tab/dialog/tooltip: keyboard spec (arrows, Home/End, Escape), focus behavior, ARIA roles/states, and test with a screen reader. Or use a headless library (Radix, Headless UI) that implements the patterns.

**6. Test matrix.** Keyboard-only, screen reader (at least one), 200% zoom, reduced motion, high contrast mode. Add axe to CI to prevent regressions.

## Common pitfalls

- **Divs as buttons.** `<div onClick>` = no keyboard, no role, no focus. Use `<button>`. Always.
- **Missing labels.** Placeholder is not a label (disappears, low contrast, unread by some AT). Every input gets a real `<label>`.
- **Focus invisible.** `outline: none` without a replacement = keyboard users are lost. Design a visible focus style.
- **Positive tabindex.** `tabindex="1"` hijacks tab order chaos. Use `tabindex="0"` (in order) or `-1` (programmatic only). Never positive.
- **ARIA overuse.** `role="button"` on a div instead of a button; redundant `aria-label` overriding good text. ARIA should be rare in well-structured HTML.
- **Color-only information.** Red/green status without text or icons. Always pair color with text/shape.
- **Autoplaying/animated content.** No pause control, ignores reduced-motion. Provide controls; respect the preference.
- **SPA route changes.** Focus stays on the old nav after navigation — screen reader users are stranded. Move focus to main content heading on route change.
- **Inaccessible CAPTCHAs/custom auth.** Third-party widgets often fail a11y. Vet them; provide alternatives.
- **"We'll fix it later."** Retrofitting a11y costs 10–100x building it in. Gate releases on the keyboard + axe pass.
- **Assuming `aria-hidden` fixes everything.** Hiding broken widgets from screen readers instead of fixing them excludes users rather than helping. Fix the widget.
- **Touch targets too small.** WCAG 2.2 AA requires 24×24px minimum targets (AAA: 44×44). Cramped icon buttons fail real users, not just audits.
- **Status messages not announced.** Form success, cart updates, or async results that only change visually. Use `role="status"` (polite live region) so assistive tech announces them.
- **Language not declared.** Missing `lang` attribute (or wrong one on mixed-language content) makes screen readers mispronounce everything. Set it correctly per page and per span.
