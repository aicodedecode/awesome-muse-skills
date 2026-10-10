---
name: pdf-annotate
description: Collaboratively annotate a PDF — propose markup, review together, iterate
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original command (ported as skill): https://github.com/anthropics/knowledge-work-plugins/tree/main/pdf-viewer/commands/annotate.md. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->

# annotate

*Ported from the `/annotate` slash command in the original Claude plugin. In Muse AI, run it as a skill: ask Muse AI to "Collaboratively annotate a PDF — propose markup, review toge...".*

> If you see unfamiliar placeholders like `~~category`, they refer to whatever tool is connected in that category.

# Annotate PDF

Walk through a document with the user, proposing and applying
annotations section by section. The user reviews each batch in the
live viewer before you continue.

## Workflow (AI-driven default)

1. **Open** — `display_pdf` (or use existing `viewUUID` if already open)
2. **Understand** — `interact` → `get_text` on the first page range
   (≤20 pages) to read content
3. **Propose** — describe to the user what you plan to annotate:
   > "I'll highlight the termination clause on page 2, add a note
   > 'Review 30-day window' next to it, and stamp page 1 as DRAFT.
   > Sound good?"
4. **Apply** — on approval, `interact` with batched commands:
   `add_annotations` + `get_screenshot` of the affected page
5. **Review** — show the screenshot, ask for edits
6. **Iterate** — move to the next section, repeat
7. **Finish** — remind the user they can download the annotated PDF
   from the viewer toolbar

## Manual mode

If the user gives explicit instructions ("highlight paragraph 3",
"stamp CONFIDENTIAL on every page"), skip the proposal step and
execute directly. Still confirm with a screenshot.

## Annotation types available

- **Text markup:** `highlight_text` (auto-finds text — preferred),
  highlight, underline, strikethrough
- **Comments:** note (sticky), freetext (visible on page)
- **Shapes:** rectangle, circle, line
- **Stamps:** any label — APPROVED, DRAFT, CONFIDENTIAL, REVIEWED
- **Images:** signatures, initials, logos (see `the "sign" skill`)

## Tips

- Prefer `highlight_text` over manual `rects` for text — it finds
  coordinates automatically
- Batch related annotations in one `interact` call
- End each batch with `get_screenshot` so the user sees the result
- Keep proposals small (3–5 annotations per batch) so review is easy
