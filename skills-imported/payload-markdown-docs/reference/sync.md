# Sync Safety Model

The sync workflow is authenticated and server-owned.

Important concepts:

- `source.id` maps to a Payload Admin docs set.
- The docs set slug, optional group, and `routeMode` determine the route base.
- Human docs are manifest `files`.
- Skills are manifest `assets`; AI discovery files are generated from synced
  docs and skills unless custom static fallback assets are explicitly provided.
- Access records own reusable authentication trust.
- The manifest does not choose target collections or fields.
- CLI `push` defaults to sync mode; `--dry-run` is the explicit validation-only mode.
- `sync.allowWrites: true` is required for `mode: "sync"`.
- `sync.allowPublish: true` and `target.enableDrafts: true` are required for publishing.
- `sync.allowHardDelete: true` is required for hard delete.
- Archive is safer than delete.
- Manual edit conflicts abort before writes.

Ed25519 signed pushes verify:

- key id
- timestamp skew
- nonce replay
- body SHA-256
- Ed25519 signature
- manifest validity

GitHub OIDC pushes verify:

- bearer JWT signature through GitHub JWKS
- docs set slug as audience
- trusted owner/repository and docs set branch
- advanced workflow refs only when explicitly enabled on the docs set
- pull request policy
- JWT `jti` replay protection
- body SHA-256
- manifest validity

Do not bypass failed auth or body verification. Fix the key, endpoint, docs set
slug, body, or server config.
