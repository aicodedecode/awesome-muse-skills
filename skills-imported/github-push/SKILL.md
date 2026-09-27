---
name: github-push
description: Push a local directory to a GitHub repository without needing the raw personal access token. Use when the user wants to publish, upload, or push files or a project to GitHub and a GitHub connector credential is stored in the Secure Vault. Works from any machine via the GitHub git-database API — no git CLI credentials needed.
---

# GitHub Push

Pushes a local directory's files to a GitHub repo (`owner/repo`, branch) using the GitHub git-database REST API. Authenticates through the Secure Vault GitHub connector via the authd surrogate exchange — the real token is never exposed; the script fetches a short-lived surrogate (`authdc cred surrogate custom.github`) and sends it as a Bearer header, which authd swaps for the real credential at egress.

## When to use

- The user asked to publish/push/upload a local project or folder to their GitHub repo.
- A GitHub connector credential is already stored (via `credentials.request_api_access` with provider `github`).
- The git CLI can't be authenticated (e.g., no credential helper, mobile-driven workflows, sandboxed machines).

## How it works

`scripts/push_repo.py` performs the equivalent of an initial (or updating) push:

1. Verifies the repo exists and reads its default branch.
2. Walks the local directory (skips `.git/`, `node_modules/`, `.next/`, `out/`, `.DS_Store`), creating one git blob per file via `POST /repos/{owner}/{repo}/git/blobs` (parallel, base64-encoded). On repeat pushes it diffs first: local git blob SHAs are compared against the branch's remote tree, so unchanged files are skipped with zero API calls.
3. Creates the tree **incrementally** (in chunks of 100 entries chained via `base_tree`) — GitHub times out on very large single tree creations, and full slash-paths in entries auto-create intermediate trees.
4. Creates a commit via `POST .../git/commits`, parented on the branch tip if the branch already exists.
5. Creates or fast-forward-updates `refs/heads/{branch}`.

## Usage

```bash
python3 ~/workspace/skills/github-push/scripts/push_repo.py \
  --dir /path/to/project \
  --owner <github-username> \
  --repo <repo-name> \
  --branch main \
  --message "Initial commit"
```

Options:
- `--dir` (required): local directory to push.
- `--owner`, `--repo` (required): target `owner/repo`.
- `--branch`: defaults to the repo's default branch.
- `--message`: commit message (default: "Push via github-push skill").
- `--workers`: parallel blob-upload workers (default: 12).

## Notes

- Requires the `custom.github` connector credential (api_hosts `api.github.com`, `github.com`) and the `authdc` CLI on PATH.
- The token needs `Contents: read and write` on the target repo (fine-grained PAT scoped to that repo is enough).
- Large pushes: blob API accepts files up to ~100 MB; trees are built incrementally in chunks of 100 entries chained via `base_tree` (GitHub times out on very large single tree creations).
- Never print or log the surrogate token; it is short-lived but treat it as sensitive.
- If the API returns 401/403, the credential is missing, expired, or lacks scope — ask the user to reconnect via the Secure Vault card rather than retrying blindly.
