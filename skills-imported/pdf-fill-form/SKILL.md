---
name: pdf-fill-form
description: Fill PDF form fields interactively with live visual feedback
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original command (ported as skill): https://github.com/anthropics/knowledge-work-plugins/tree/main/pdf-viewer/commands/fill-form.md. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->

# fill-form

*Ported from the `/fill-form` slash command in the original Claude plugin. In Muse AI, run it as a skill: ask Muse AI to "Fill PDF form fields interactively with live visual feedback...".*

> If you see unfamiliar placeholders like `~~category`, they refer to whatever tool is connected in that category.

# Fill Form

Help the user complete a fillable PDF form in the live viewer. Unlike
programmatic form tools, this gives the user **direct visual feedback**
on every field as it's filled, with easy undo/edit in the viewer.

## Why use this instead of programmatic form filling

- **Visual confirmation** — the user sees each value land in the right
  box, not just a success message
- **Unnamed/unlabeled fields** — many real-world PDFs have fields with
  machine names like `Text1`, `Field_7`, or no name at all. The label
  ("Date of Birth", "SSN") is printed **next to** the field on the
  rendered page, not in the field metadata. Use `get_screenshot` to
  see what each field actually is, then fill by name.
- **Easy correction** — the user can edit or clear any field directly
  in the viewer, or ask you to `fill_form` again with new values

## Two approaches

### User-driven (simple, well-labeled forms)

Call `display_pdf` with `elicit_form_inputs: true`. The server detects
form fields and prompts the user to enter values **before** the viewer
opens. The filled PDF is then displayed.

### AI-assisted (complex forms, unnamed fields, or when you have context)

1. `display_pdf` (without elicit) — inspect returned `formFields`
   (name, type, page, bounding box)
2. If field names are cryptic (`Text1`, `Field_7`), use `interact` →
   `get_screenshot` of each page with fields. Look at the visual
   labels next to each bounding box to understand what each field is.
3. For each field, either:
   - Infer the value from conversation context (name, date, email)
   - Ask the user, describing the field by its **visual** label
     ("the 'Date of Birth' box on page 1")
4. `interact` → `fill_form` with `fields: [{name, value}, ...]`
5. `interact` → `get_screenshot` of each filled page
6. Show the user, ask them to confirm or edit

## Example

> **User:** Help me fill out this W-9
>
> *You:* `display_pdf` → formFields: `f1_1`, `f1_2`, `f1_3`, `c1_1`, ...
> (cryptic names)
>
> *You:* `interact` → `get_screenshot` page 1 → see `f1_1` is next to
> "Name", `f1_2` is "Business name", `c1_1` is the "Individual" checkbox
>
> *You:* "I can see Name, Business name, Address, TIN, and tax
> classification checkboxes. I'll fill Name and Date from what I
> know — what's your TIN and business address?"
>
> *After answers:* `interact` → `fill_form` + `get_screenshot`
>
> *You:* "Here's the filled form [screenshot]. The signature line is
> still blank — want to add your signature with `the "sign" skill`?"

## Notes

- Signature fields are usually separate — fill text first, then hand
  off to `the "sign" skill` for the image
- Checkbox/radio values are `true`/`false` or the option string
- The user can always drag & edit fields directly in the viewer
