# Routing

Docs are managed as docs sets, not as one Page per Markdown file.

## Docs Groups

Docs groups reserve namespaces such as `/plugins` or `/internal/tools`.

## Docs Sets

Docs sets represent one documentation site. Their route base is derived from an
optional group plus the docs set slug and `routeMode`.

`docs-root` routes docs at the product route:

```text
/plugins/payload-markdown-docs
```

`product-nested` routes docs below `/docs` so the product route can be owned by
the host app or Pages collection:

```text
/plugins/payload-markdown-docs
/plugins/payload-markdown-docs/docs
```

## Generated Docs

Generated docs records are internal storage for routing, search, sync correctness, and per-doc overrides.

`index.md` routes to the docs set route base. Nested files route below it.

## Group Pages

Docs groups use `pageMode`. `auto` lets the docs plugin render a generated group
landing page such as `/plugins`; `custom` leaves that route for the host app.

## Links

Use root-relative links inside the docs set:

```markdown
[Quick start](/getting-started/quick-start)
```

Do not hardcode production docs domains for internal navigation.

## Route Adapter

The `/next` export can resolve docs routes and let an app fall back to normal
Pages rendering when no docs route matches. It does not mutate Pages.

For Next App Router slug routes, prefer `path`. It accepts a normalized path
string, a single `[slug]` string, or a `[...slug]` / `[[...slug]]` segment
array. Use `getPayloadMarkdownDocsRoutePath({ path: slug })` when the fallback
Pages query also needs the normalized path string. The legacy `slug` option is
still supported for compatibility.

## Agent Skills

Agent-facing workflow packs live outside the human docs tree under
`skills/<source>/<agent>/`. They can be copied into project-local agent
directories with `pmdocs install skill` or synced by `push` as
raw assets. They are not docs pages and should not be routed as generated docs
records.

Public raw asset URLs such as `/llms.txt` and
`/plugins/payload-markdown-docs/skills/codex` require committed Next route files
from `pmdocs install routes`. `/api/...` asset URLs are
implementation/internal fallback URLs, not public canonical docs URLs.
