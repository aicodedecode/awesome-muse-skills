---
name: payload-overrides
description: >-
  Host-project overrides for the vendored Payload skill. Prefer this before
  upstream payload docs when they conflict: config path, typed env, generated
  types path, folder-per-collection layout, co-located access/hooks, barrels,
  host-owned migrations/seed, Bun vs pnpm. Database-agnostic by default.
---

# Payload overrides

Read this skill **before** the vendored [payload skill](../payload/SKILL.md) when they disagree. Upstream examples often assume `pnpm`, `src/payload.config.ts`, flat `collections/Posts.ts`, and `payload-types.ts`.

Product-specific skills (multi-tenant product models, branded i18n packages, hard DB policy) belong in the **host app** skill. When both exist, the host product skill wins over this package for product facts; this package wins over the vendored Payload skill for shared host conventions.

## Reading order

1. Host product skill (if any), e.g. under `apps/<app>/.agents/skills/`.
2. This skill (`payload-overrides`) — pick a reference below.
3. Vendored [payload/SKILL.md](../payload/SKILL.md).
4. Synced rules: `security-critical`, Payload `i18n`, plus `@dappermountain/agent-practices` when present.

## Reference

| Topic | File |
|-------|------|
| Config entry, typed env, generated types | [reference/CONFIG.md](reference/CONFIG.md) |
| Collections, access, hooks, barrels | [reference/LAYOUT.md](reference/LAYOUT.md) |
| Host-owned migrations/seed; plugins | [reference/HOST.md](reference/HOST.md) |

## Package manager

Ignore upstream **pnpm** assumptions. Prefer the host’s `bun.mdc` / package manager when synced from `@dappermountain/agent-practices`.

## Security

Follow `.agents/rules/security-critical.mdc`: `overrideAccess: false` with `user`, pass `req` in hooks, context flags to avoid loops.

## Vendored payload skill

- Hub: `.agents/skills/payload/SKILL.md`
- Update via host `skills:install` / `skills:update`
- **Do not hand-edit** vendored `skills/payload/`

## Keeping docs in sync

When host layout or config conventions change in a way that should apply to all DapperMountain Payload hosts, update this skill’s `reference/` in `@dappermountain/agent-payload` and re-sync consumers.
