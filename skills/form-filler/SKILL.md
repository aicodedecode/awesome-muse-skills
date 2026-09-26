---
name: form-filler
description: Programmatic form completion — web forms, PDF AcroForms, and data mapping — use when automating repetitive form filling.
category: document-processing
---

## Overview

Filling forms programmatically — web applications, PDF AcroForms, government
filings, onboarding paperwork — saves hours of copy-paste and eliminates
transcription errors. The work is mostly data mapping and edge-case handling,
not the filling mechanism itself. This skill covers the patterns for reliable
form automation.

## When to use

- Auto-filling web forms from structured data (applications, registrations)
- Completing PDF forms (AcroForms) in bulk
- Mapping messy source data to strict form fields and formats
- Handling multi-step wizards, conditional fields, and validations
- Building attended (human-supervised) vs unattended filling workflows

## Core concepts

**Map data to fields explicitly.** Build a field-mapping layer: source field →
target field + transformation (date format, name splitting, address parsing,
phone normalization). Keep mappings in config, not code — forms change, and
non-developers often own the mapping knowledge.

**Respect the form's validation.** Every form has rules: required fields,
formats, value ranges, conditional logic ("if X then Y required"). Encode the
form's validation in your pipeline and validate before submitting — catching
errors locally is 100x cheaper than handling rejections.

**Idempotency and partial completion.** Form submissions often can't be
"undone". Design for safe retries: check current state before acting, save
progress per step, and never double-submit. For multi-step wizards, persist
state after each step so failures resume rather than restart.

**Attended vs unattended.** Unattended (fully automatic) suits stable,
well-understood forms with clean data. Attended (automation fills, human
reviews and submits) suits high-stakes forms, captchas, or inconsistent data.
Choose per form — and build the review UI for attended flows, don't bolt it
on.

**Selectors and field identity.** For web forms, prefer stable identifiers
(labels, names, aria attributes) over positional or auto-generated selectors
that break on every redesign. For PDF AcroForms, enumerate actual field names
first — they rarely match the visual labels.

## Practical workflow

1. **Inventory the form:** list every field, its type, validation rules,
   conditional logic, and which are required — from the real form, not
   documentation.
2. **Build the mapping config:** source → target with transformations;
   define defaults and the policy for missing data (skip? flag? abort?).
3. **Implement fill + validate:** fill fields, run the form's own validation
   (or your encoded copy of it), and collect errors with field-level detail.
4. **Handle the tricky parts:** file uploads, date pickers, rich text,
   multi-selects, captchas (route to human or official APIs — never
   captcha-solving services of dubious legality), and confirmation steps.
5. **Add observability:** log what was filled per submission (values or hashes
   for sensitive data), screenshot/snapshot before submit for audit, and
   alert on validation failures or form-structure changes.
6. **Detect form drift:** forms change without notice; add a smoke check that
   verifies expected fields still exist before bulk runs, and fail loudly
   when they don't.

## Common pitfalls

- **Double submissions** — retry logic without idempotency creates duplicate
  applications/orders; verify state before resubmitting.
- **Brittle selectors** on web forms — auto-generated class names change per
  deploy; anchor on labels and semantic attributes.
- **Ignoring conditional logic** — filling hidden/irrelevant fields or missing
  newly-required ones when answers change the form's shape.
- **Sensitive data in logs** — SSNs, account numbers, and credentials in
  plaintext logs; log field names and hashes, not values.
- **No handling for "the form changed"** — silent breakage fills wrong fields
  or submits garbage; drift detection is mandatory for unattended flows.
- **Skipping the human review** on high-stakes forms — a wrong government
  filing or legal submission costs far more than the review time saved.
