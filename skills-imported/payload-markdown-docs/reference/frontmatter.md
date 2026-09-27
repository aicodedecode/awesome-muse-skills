# Frontmatter

Use only this supported frontmatter subset.

```yaml
---
title: Installation
navTitle: Install
description: Install and configure docs sync.
order: 10
status: published
tags:
  - getting-started
dependencies:
  - "@valkyrianlabs/payload-markdown"
redirectFrom:
  - /docs/install
---
```

Supported fields:

- `title`
- `navTitle`
- `description`
- `order`
- `status`
- `slug`
- `tags`
- `dependencies`
- `redirectFrom`
- `draft`

Rules:

- `status` must be `draft` or `published`.
- `order` must be a number.
- `tags`, `dependencies`, and `redirectFrom` must use list item syntax.
- `slug` may contain letters, numbers, and hyphens.
- Avoid arbitrary nested YAML objects.
- Avoid inline arrays such as `tags: [getting-started]`.
- Avoid unsupported fields unless the user accepts validation warnings.
- Explicit `title` is preferred even though title fallback exists.
- Use `slug` only to override the final route segment; move files to change route hierarchy.
