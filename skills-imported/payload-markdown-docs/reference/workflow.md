# Agent Docs Workflow

Use this workflow when editing docs source files.

1. Inspect the docs tree, usually `{{docsRoot}}`.
2. Edit Markdown files in place.
3. Keep frontmatter valid and simple.
4. Keep internal docs links root-relative.
5. Use the sibling `payload-markdown` skill for directive syntax and formatting.
6. Run validation.
7. Run plan when sync impact matters.
8. Only push when the user asks for upload/sync and provides endpoint/auth context.

Source id safety:

- `main-docs` is only a quick-start example name.
- The real `--source` value is `<users-upstream-docs-id>`, the Payload docs set
  slug for the upstream docs package.
- When adding a GitHub Actions OIDC workflow, stop if the user did not provide
  the source/docs id. Explain that there is not enough context to add OIDC
  safely and ask for the Payload docs set slug.
- Do not infer the source id from the repository name or `GITHUB_REPOSITORY`.

Validation:

```bash
pmdocs validate --source <users-upstream-docs-id>
```

Plan:

```bash
pmdocs plan --source <users-upstream-docs-id>
```

Use `--docs {{docsRoot}}` only when the docs source is not the conventional
`./docs` directory.

Sync with GitHub OIDC:

```bash
pmdocs push \
  --endpoint "$DOCS_SYNC_ENDPOINT" \
  --source <users-upstream-docs-id> \
  --github-oidc
```

Explicit dry-run:

```bash
pmdocs push \
  --endpoint "$DOCS_SYNC_ENDPOINT" \
  --source <users-upstream-docs-id> \
  --github-oidc \
  --dry-run
```

Use Ed25519 key flags only when the project is not using GitHub OIDC:

```bash
pmdocs push \
  --endpoint "$DOCS_SYNC_ENDPOINT" \
  --source <users-upstream-docs-id> \
  --key-id github-actions-main \
  --private-key-env DOCS_SYNC_PRIVATE_KEY
```

Use `--publish` only when the user explicitly asks for published output and the
server supports publishing.

Do not directly edit generated Payload docs records unless the user specifically
asks for Payload-side overrides.
