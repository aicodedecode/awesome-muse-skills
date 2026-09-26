---
name: forms-pro
description: Build excellent web forms: UX patterns, validation, accessibility, multi-step flows, and file uploads. Use for any form beyond trivial inputs.
category: web-development
---

# Forms Pro

A practical guide to web forms that convert and don't frustrate: UX patterns, validation timing, accessibility, multi-step flows, and file uploads — the details separating forms users complete from forms they abandon.

## Overview

Forms are where business happens (signup, checkout, application) and where UX most often fails. The principles: **minimize friction** (fewer fields, smart defaults, autofill), **validate helpfully** (right time, clear messages, preserve input), and **never lose user data** (drafts, recovery). Technical implementation (React Hook Form, Zod — see those skills) serves these goals.

## When to use

- Signup, checkout, application, settings, and contact forms.
- Multi-step wizards and conditional flows.
- File uploads with progress.
- Form UX audits and conversion optimization.

## Core concepts

- **Friction budget.** Every field costs conversion. Cut ruthlessly: is this needed now, or can it be collected later / inferred / defaulted?
- **Validation timing.** Validate on blur/touch first, then live as the user fixes. Never error on pristine fields; never wait until submit for obvious mistakes (but always validate on submit too).
- **Error UX.** Inline errors next to fields, linked via `aria-describedby`; error summary at top with anchor links on submit failure; focus moves to first error. Preserve all input on failed submit.
- **Input design.** Right input for the data: `type="email|tel|number"`, `inputmode`, `autocomplete` attributes (huge for mobile), date pickers for dates (not free text), masks that help (not hinder).
- **Multi-step.** One topic per step; progress indicator; back preserves everything; validate per step before advancing; review step before final submit; save drafts.
- **File uploads.** Drag-and-drop + browse; accept filters; size/type validation client-side (and server-side!); progress bars; resumable/chunked for large files; previews.
- **Autosave.** Draft persistence (localStorage or server) for long forms — losing 20 minutes of input is unforgivable.

## Practical workflow

**1. Design the fields.**
- List every field; justify each ("why now?"). Remove half.
- Order: easiest first, sensitive (payment, SSN-equivalents) last.
- Group related fields with `<fieldset>`/`<legend>`.

**2. Markup (accessible by default).**
```html
<div>
  <label for="email">Email address</label>
  <input id="email" name="email" type="email" autocomplete="email"
         required aria-describedby="email-hint email-error" />
  <p id="email-hint">We'll send your receipt here.</p>
  <p id="email-error" role="alert">Enter a valid email address.</p>
</div>
```

**3. Validation.**
- Schema (Zod/Yup) shared client/server.
- `mode: 'onTouched'` (RHF) — validate after blur, revalidate live.
- Server revalidates everything (client validation is UX, not security).

**4. Multi-step state.**
```ts
// single form state at wizard root; per-step validation via trigger(fields)
// persist draft: useEffect debounce → localStorage; restore on mount
```

**5. Submit.**
- Disable during submission; prevent double-submit.
- Success: clear draft, show confirmation (don't just redirect silently).
- Failure: preserve input, show errors, focus first error, log for debugging.

**6. Uploads.**
```js
// chunked upload sketch: slice file, POST chunks with index, server assembles
// show per-file progress; validate type/size before uploading a byte
```

## Common pitfalls

- **Too many fields.** The #1 form killer. Audit every field's necessity.
- **Errors on pristine fields.** Validating before the user interacts = hostile. onTouched/onBlur first.
- **Wiping input on error.** Failed submit clearing the form. Preserve everything, always.
- **Placeholder as label.** Disappears on type, poor contrast, not a real label. Real `<label>` elements.
- **No autocomplete.** Missing `autocomplete` attributes = mobile users typing everything manually. Add them; it's free conversion.
- **Client-only validation.** Bypassable in seconds. Server validates independently.
- **No draft saving.** Long forms without autosave. Persist drafts; users get interrupted.
- **File upload failures.** No size limits communicated, no progress, no resume — large uploads fail silently. Validate early, show progress, chunk large files.
- **Inaccessible errors.** Errors shown only in red text (no text = color-only), not linked to fields, not announced. Text + `aria-describedby` + `role="alert"`.
- **Submit button ambiguity.** "Submit" vs "Create account" vs "Pay $49" — the button should say what happens. Include the consequence.
