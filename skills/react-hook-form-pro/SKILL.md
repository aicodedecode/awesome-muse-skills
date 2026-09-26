---
name: react-hook-form-pro
description: Build performant React forms with React Hook Form: validation, controlled inputs, dynamic fields, and error UX. Use when forms need speed and clean validation.
category: development
---

# React Hook Form Pro

A practical guide to React Hook Form (RHF): uncontrolled-input performance, schema validation, dynamic field arrays, and error UX — building forms that stay fast and maintainable as they grow.

## Overview

RHF's core bet: **uncontrolled components + refs** instead of re-rendering on every keystroke. You `register` inputs, RHF reads values via refs at submit/validation time, and only the fields with errors re-render. The result is forms that stay fast at 50+ fields where controlled-component forms choke. Validation plugs in via resolvers (Zod, Yup, Valibot) — define the schema once, get types + runtime validation.

## When to use

- Any non-trivial React form: signup, checkout, settings, multi-step wizards.
- Dynamic forms: add/remove rows (field arrays), conditional fields.
- Schema validation shared between client and server (Zod).
- Performance-sensitive forms (large, nested, or on low-end devices).

## Core concepts

- **`useForm` + `register`.** `const { register, handleSubmit, formState } = useForm()`; `<input {...register('email')} />`. Minimal re-renders by default.
- **Resolvers.** `useForm({ resolver: zodResolver(schema) })` — validation logic lives in the schema, not in JSX. Errors land in `formState.errors` keyed by field.
- **`Controller`.** Bridge for controlled components (MUI inputs, date pickers, custom components): `<Controller name="date" control={control} render={({ field }) => <DatePicker {...field} />} />`. Use only where `register` can't reach.
- **`useFieldArray`.** Dynamic lists: `fields.map(f => ...)` with `append`/`remove`/`move`. Key by `field.id` (stable), never by index.
- **`formState`.** `errors`, `isDirty`, `isValid`, `isSubmitting`, `touchedFields`. Subscribe selectively (`const { errors } = formState` in the component that displays them) to limit re-renders.
- **`watch` vs `useWatch` vs `getValues`.** `watch` re-renders the component; `useWatch` isolates subscriptions; `getValues` reads without subscribing. Prefer `getValues` in submit handlers.
- **Modes.** `mode: 'onBlur' | 'onChange' | 'onSubmit'` (validation timing), `reValidateMode`. `onTouched` is the sweet spot for most UX: validate after first blur, then live.

## Practical workflow

**1. Schema-first.**
```ts
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
  plan: z.enum(['free', 'pro']),
});
type FormValues = z.infer<typeof schema>;
```

**2. Wire the form.**
```tsx
const { register, handleSubmit, control, formState: { errors, isSubmitting } } =
  useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onTouched' });

<form onSubmit={handleSubmit(async (data) => { await save(data); })}>
  <input {...register('email')} aria-invalid={!!errors.email} aria-describedby="email-error" />
  {errors.email && <p id="email-error" role="alert">{errors.email.message}</p>}
  <button disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save'}</button>
</form>
```

**3. Dynamic rows.**
```tsx
const { fields, append, remove } = useFieldArray({ control, name: 'members' });
{fields.map((f, i) => (
  <div key={f.id}>
    <input {...register(`members.${i}.name`)} />
    <button type="button" onClick={() => remove(i)}>Remove</button>
  </div>
))}
<button type="button" onClick={() => append({ name: '' })}>Add member</button>
```

**4. Multi-step.** One `useForm` at the wizard root (or `FormProvider`), validate per step with `trigger(['field1', 'field2'])` before advancing; submit once at the end.

**5. Errors UX.** Show errors after touch/submit (not on first keystroke), link errors to fields (`aria-describedby`, `role="alert"`), focus the first error on failed submit.

## Common pitfalls

- **Controlled everything.** Using `Controller` for plain inputs throws away RHF's performance win. `register` for native inputs; `Controller` only for truly controlled third-party components.
- **`watch` in the root component.** Re-renders the whole form on every keystroke. Isolate with `useWatch` in small components or `getValues` in handlers.
- **Index as key in field arrays.** Removing row 0 shifts keys → values scramble. Always `field.id`.
- **Validating on every keystroke from the start.** `mode: 'onChange'` on a pristine form = error messages before the user types. `onTouched` or `onBlur` first, then live revalidation.
- **Forgetting `defaultValues`.** Uncontrolled inputs need defaults for `isDirty`/reset to work and to avoid uncontrolled→controlled warnings. Provide them (async defaults via `values`/`reset` when loading).
- **Schema/client-server drift.** Validating differently on client and server. Share the Zod schema (monorepo package or duplicated with tests) so both agree.
- **Ignoring `isSubmitting`.** Double-submit races. Disable the button and guard the handler.
- **Nested error access.** `errors.members?.[i]?.name?.message` — optional-chain carefully or write a small `getError` helper; crashes on undefined paths are common.
