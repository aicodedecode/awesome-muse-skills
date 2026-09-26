---
name: email-designer
description: Design effective emails with inbox-friendly layouts, accessible HTML, dark mode, and testing checklists.
category: creative-design
---

## Overview

Email design is web design from 1999 that somehow still runs the world:
inconsistent clients, no
flexbox in Outlook, images blocked by default, and dark mode inversions. Yet
email drives more
revenue per effort than almost any channel. This skill covers designing emails
that render
everywhere, get opened, and convert — from layout constraints to testing.

## When to use

- Designing marketing emails, newsletters, or transactional emails

- Building email templates or design systems

- Improving open rates, click rates, or conversions

- Troubleshooting rendering issues across email clients

- Planning dark mode support for emails

## Core concepts

- - - **The inbox is the first design.** Subject line, preheader, and sender
  name determine opens
  before the email is ever seen. Design the email backwards from the inbox:
would you open this?
- - - **Single column, 600px.** The email standard: max-width 600px, single
  column, generous spacing.
  Multi-column layouts break on mobile (60%+ of opens) and in Outlook.
- - - **Design for images-off.** Many clients block images by default. The email
  must communicate with
  text alone: real HTML text (not image text), alt text on every image,
background colors as
  fallbacks.
- - - **Hierarchy for scanners.** Headline, hero visual, 2-3 content blocks max,
  one primary CTA.
  Email readers scan in seconds — long newsletters need ruthless editing or
clear section anchors.
- - - **The CTA rules.** One primary action per email, button-style (bulletproof
  buttons: HTML text +
  background color, not images), minimum 44px tall, repeated after long content.
Every link should
  be obviously tappable.
- - - **Dark mode is mandatory.** Clients auto-invert or apply dark themes.
  Design with transparent
  PNGs, test both modes, use meta tags where supported — and never rely on
"it'll be fine."

## Practical workflow

1. 1. 1. **Define the email's job.** One goal per email (click, purchase, reply,
   read). Know the
   audience segment and what they already know — relevance beats design polish.
2. 2. 2. **Write inbox-first.** Subject line (under 50 characters, specific over
   clever), preheader
   (extends the subject, not repeats it), sender name (recognizable human or
brand).
3. 3. 3. **Design the layout.** 600px single column: header (logo small, not
   dominant), headline, hero,
   body blocks, CTA, footer (unsubscribe prominent — hiding it creates spam
complaints, which are
   worse). Plain-text version included.
4. 4. 4. **Build bulletproof HTML.** Table-based layout, inline CSS, web-safe
   font stacks with
   fallbacks, alt text everywhere, background colors behind images. Test in the
big three problem
   clients: Outlook (Word engine), Gmail (strips <style> in some contexts),
Apple Mail.
5. 5. 5. **Handle dark mode.** Test auto-inversions, use transparent images,
   consider
   dark-mode-specific meta styles. Check logos: a dark logo on a transparent
background vanishes in
   dark mode — use a white stroke version or contained logo block.
6. 6. 6. **Check accessibility.** Semantic headings, meaningful alt text, 4.5:1
   text contrast, logical
   reading order, no text in images for critical content, sufficient tap
targets.
7. 7. 7. **Test before sending.** Litmus/Email on Acid or manual: top clients
   (Apple Mail, Gmail,
   Outlook), mobile + desktop, images on/off, dark/light mode. Send a live test
to yourself; click
   every link. Check spam score basics (balanced image/text ratio, no spam
trigger words in
   subject).

## Common pitfalls

- - - **Image-only emails.** One big image with all the text baked in: blocked
  by default in many
  clients, unreadable, inaccessible, unclickable. Never.
- - - **Tiny text.** Below 14px body text on mobile is unreadable. 16px body
  minimum, generous line
  height.
- - - **Hidden unsubscribe.** Making it hard to leave generates spam complaints,
  which tank
  deliverability for everyone. One-click, visible unsubscribe.
- - - **No plain-text version.** Multipart emails need a text fallback for
  accessibility tools and
  strict clients. Auto-generated is better than none; hand-tuned is best.
- - - **Broken in Outlook.** Outlook's Word rendering engine ignores modern CSS.
  If you didn't test
  Outlook, you didn't test email.
- - - **Subject-line clickbait.** "You won't believe..." gets opens and
  unsubscribes. Specific, honest
  subjects build the long-term list health that actually drives revenue.
