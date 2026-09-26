---
name: email-templates
description: Build HTML emails that render everywhere: table layouts, MJML, dark mode, testing, and deliverability basics. Use for transactional and marketing email.
category: web-development
---

# Email Templates

A practical guide to HTML email: the table-based layouts that render across 50+ clients, MJML for sane authoring, dark-mode handling, testing, and deliverability fundamentals.

## Overview

Email HTML is frozen in ~1999: tables for layout, inline CSS, limited support for modern features. Different clients (Outlook uses Word's renderer; Gmail strips `<style>` in some contexts; Apple Mail is the most capable) demand defensive coding. The sane path: **author in MJML** (component syntax compiling to battle-tested table HTML) or a similar framework, then test in real clients.

## When to use

- Transactional emails (receipts, resets, notifications).
- Marketing newsletters and campaigns.
- Email design systems (reusable components).

## Core concepts

- **Table layouts.** `<table role="presentation" cellspacing="0" cellpadding="0" border="0">` nesting for structure. `role="presentation"` keeps screen readers from announcing layout tables as data.
- **Inline CSS.** Most styles inline (`style="..."`); some clients strip `<style>` blocks. MJML inlines automatically.
- **600px width.** The de facto standard content width; fluid/hybrid techniques for mobile (max-width + width 100%).
- **MJML.** `<mjml><mj-body><mj-section><mj-column><mj-text>` — components compile to client-proof HTML. `mjml input.mjml -o output.html`.
- **Dark mode.** `@media (prefers-color-scheme: dark)` works in some clients; also `data-ogsc` (Outlook app) hacks. Design with enough contrast that auto-inversion doesn't break readability; transparent PNG logos need dark-mode variants.
- **Fallbacks.** Background images (VML for Outlook), web fonts (fallback stacks — most clients ignore webfonts), buttons (bulletproof: table-cell with bgcolor, not just styled `<a>`).
- **Deliverability.** SPF, DKIM, DMARC configured; consistent from-domain; plain-text alternative (`multipart/alternative`); list hygiene (bounces, unsubscribes honored); avoid spam triggers (URL shorteners, image-only emails).

## Practical workflow

**1. Author in MJML.**
```xml
<mjml><mj-body background-color="#f4f4f5">
  <mj-section><mj-column>
    <mj-image width="120px" src="https://example.com/logo.png" alt="Acme" />
    <mj-text font-size="20px" font-weight="bold">Order confirmed</mj-text>
    <mj-text>Hi {{name}}, your order #{{id}} is on its way.</mj-text>
    <mj-button background-color="#4f46e5" href="{{trackingUrl}}">Track order</mj-button>
  </mj-column></mj-section>
  <mj-section><mj-column><mj-text font-size="12px" color="#71717a">
    <a href="{{unsubscribeUrl}}">Unsubscribe</a>
  </mj-text></mj-column></mj-section>
</mjml>
```

**2. Templating.** MJML output + your template engine (Handlebars, etc.) for variables. Escape user data (`{{name}}` escaped by default in most engines — verify).

**3. Test rendering.** Litmus/Email on Acid (or manual: Gmail, Outlook, Apple Mail, iOS Mail) — check: layout intact, images alt-shown when blocked, links work, dark mode readable.

**4. Test deliverability.** Mail-tester score; seed-list inbox placement; check SPF/DKIM/DMARC alignment.

**5. Transactional vs marketing.** Transactional: plain, fast, single CTA, high deliverability priority. Marketing: branded, but keep image:text balance (image-only = spam filters + blocked images = blank email).

## Common pitfalls

- **Div-based layouts.** Flexbox/grid support is spotty (Outlook!). Tables are ugly and reliable — use them.
- **Untested in Outlook.** Desktop Outlook (Word renderer) breaks: no background images (needs VML), limited padding, no webfonts. Test it specifically.
- **Images blocked by default.** Many clients block images initially — design so the email works with alt text: real text for headlines, alt on every image, bgcolor behind image areas.
- **No plain-text version.** Some clients/users prefer it; spam filters like it. Generate from the HTML or write it.
- **Broken dark mode.** White text on white after auto-inversion, invisible logos. Test dark mode; provide logo variants.
- **Missing unsubscribe.** Legally required (CAN-SPAM, GDPR) and practically required (else "spam" button). One-click, working, honored promptly.
- **Spam trigger patterns.** ALL CAPS, excessive !!!, URL shorteners, misleading subjects. Write like a human, not a 2005 spammer.
- **No preheader.** The preview text next to the subject — wasted as "view in browser". Write a compelling preheader.
- **Sending from noreply.** Kills replies and engagement signals. Use a monitored address.
- **Untested variables.** `Hi {{firstName}}` rendering literally when data is missing. Fallbacks for every variable (`{{firstName|default:"there"}}`).
