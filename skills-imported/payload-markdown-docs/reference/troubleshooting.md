# Troubleshooting

## Invalid signature

Check key id, private key, endpoint pathname, timestamp, nonce, and exact body string.

## OIDC invalid token

Check that the workflow uses `--github-oidc`, grants `id-token: write`, and uses a source matching the docs set slug.

## OIDC repository or ref not allowed

Check GitHub OIDC records in `Docs Globals > Access` for owner/repository trust and the docs set branch for ref trust.

## OIDC replay

Rerun the workflow so GitHub issues a fresh OIDC token with a new `jti`.

## Body hash mismatch

The signed body is not the body that was sent. Sign and send the exact same JSON string.

## Nonce replay

Generate a fresh request. Do not reuse signed headers.

## Source not allowed

Create or update a docs set with the expected slug.

## Publish disabled

The server needs `sync.allowPublish: true` and a draft-enabled docs collection.

## Hard delete disabled

Hard delete requires `sync.allowHardDelete: true`. Prefer archive unless the user explicitly needs deletion.

## Route collision

A generated docs route overlaps another docs route or an opt-in Pages collision check.

## Manual edit conflict

A generated docs record was edited outside the docs sync workflow. The sync aborts before writes.

## Invalid frontmatter

Use only supported fields and simple YAML.

## Non-root-relative link

Internal docs links should look like `/workflow/signed-push`, not `workflow/signed-push` or a production URL.

## Public asset route 404

If `/api/llms.txt` works but `/llms.txt` or docs-set skill URLs return HTML 404,
the consuming Next app is missing committed public asset route files. Run
`pmdocs install routes --payload-app "src/app/(payload)"`,
commit the generated files, deploy them, and purge any cached 404 responses.
