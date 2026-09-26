---
name: zod-pro
description: Validate with Zod: schemas, coercion, transforms, discriminated unions, and shared client/server contracts. Use when runtime validation and type inference matter.
category: development
---

# Zod Pro

A practical guide to Zod: schema-first TypeScript — runtime validation with static type inference, coercion, transforms, discriminated unions, and sharing one schema between client, server, and forms.

## Overview

Zod lets you declare a schema once and get **both** runtime validation and a TypeScript type (`z.infer`). This kills the most common API bug class: "the type said X but the runtime sent Y." Schemas validate API responses, form input, env vars, and config — anywhere untrusted data crosses a boundary.

## When to use

- Validating API request/response payloads (tRPC, REST, webhooks).
- Form validation (with React Hook Form's zodResolver).
- Environment variable and config validation at startup (fail fast on bad config).
- Discriminated unions: event types, polymorphic API responses.
- Generating types from a single source of truth.

## Core concepts

- **Primitives & composition.** `z.string()`, `z.number()`, `z.object({...})`, `z.array(...)`, `.optional()`, `.nullable()`, `.default()`. Compose freely; schemas are just values.
- **`z.infer`.** `type User = z.infer<typeof userSchema>` — the type follows the schema, never the reverse.
- **Refinements.** `.refine(check, 'message')` and `.superRefine` for cross-field rules (password match). Keep them pure and fast.
- **Transforms.** `.transform(v => ...)` converts after validation (string→Date, trim, normalize). Note: inferred *output* type differs from input — use `z.input`/`z.output` when both matter.
- **Coercion.** `z.coerce.number()` parses strings from query params/FormData. Essential at the HTTP boundary where everything is a string.
- **Discriminated unions.** `z.discriminatedUnion('type', [aSchema, bSchema])` — fast, precise narrowing for tagged payloads (webhook events, Redux-style actions).
- **`.strict()` vs `.strip()` vs `.passthrough()`.** Unknown keys: strip (default, forgiving), strict (reject — good for catching typos in configs), passthrough (keep).
- **Error formatting.** `result.error.issues` structured; `z.treeifyError` / flatten for UI display. Map issues to form fields by `path`.

## Practical workflow

**1. Schema as contract.**
```ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  age: z.coerce.number().int().min(13).optional(),
  role: z.enum(['admin', 'member']).default('member'),
});
export type CreateUser = z.infer<typeof createUserSchema>;
```

**2. Validate at boundaries.**
```ts
// API handler
const parsed = createUserSchema.safeParse(req.body);
if (!parsed.success) return res.status(400).json({ errors: z.treeifyError(parsed.error) });
const data: CreateUser = parsed.data; // typed AND validated
```

**3. Env validation (fail fast).**
```ts
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
});
export const env = envSchema.parse(process.env); // throws on boot if misconfigured
```

**4. Discriminated events.**
```ts
const eventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('user.created'), userId: z.string().uuid() }),
  z.object({ type: z.literal('user.deleted'), userId: z.string().uuid(), reason: z.string().optional() }),
]);
```

**5. Share across the stack.** Put schemas in a shared package; client forms, server handlers, and tests all import the same definition. One change propagates everywhere.

## Common pitfalls

- **`.parse` without try/catch.** `parse` throws; at trust boundaries use `safeParse` and handle the failure explicitly.
- **Validating too late.** Validating deep in business logic instead of at the boundary lets bad data travel. Validate at entry: handlers, form submit, env boot.
- **Transform/input type confusion.** After `.transform`, `z.infer` gives the *output* type. For function params accepting raw input, use `z.input<typeof schema>`.
- **Coercion hiding bugs.** `z.coerce.number()` turns `""` into `0` — sometimes you want rejection, not coercion. Choose per field.
- **Overly strict on responses.** `.strict()` on third-party API responses breaks when they add a field. Strict for your own configs; strip/passthrough for external data.
- **Giant mega-schemas.** One 200-field schema is unmaintainable. Compose small schemas; reuse pieces.
- **Refine in hot paths.** Regexes and DB lookups in refinements run per validation — keep them cheap or use async refinements deliberately (`parseAsync`).
- **Error messages for users.** Raw Zod messages ("Expected string, received number") aren't user-facing copy. Map issues to friendly messages at the UI layer.
