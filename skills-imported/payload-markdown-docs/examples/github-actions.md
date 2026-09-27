# GitHub Actions Example

```yaml
name: Publish docs

on:
  pull_request:
    paths:
      - 'docs/**'
      - 'skills/**'
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'skills/**'

permissions:
  id-token: write
  contents: read

env:
  # Replace with the Payload docs set slug. Do not infer this value.
  PMDOCS_SOURCE: "<users-upstream-docs-id>"

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install pmdocs
        run: |
          sudo install -d -m 0755 /etc/apt/keyrings
          sudo curl -fsSL https://apt.valkyrianlabs.com/pubkey.gpg \
            -o /etc/apt/keyrings/valkyrianlabs.gpg
          sudo chmod 0644 /etc/apt/keyrings/valkyrianlabs.gpg
          echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/valkyrianlabs.gpg] https://apt.valkyrianlabs.com stable main" \
            | sudo tee /etc/apt/sources.list.d/valkyrianlabs.list > /dev/null
          sudo apt-get update
          sudo apt-get install -y pmdocs

      - name: Check pmdocs
        run: |
          pmdocs --version
          pmdocs --help

      - name: Validate docs package
        run: pmdocs validate --source "$PMDOCS_SOURCE"

      - name: Dry-run docs package sync
        if: github.event_name == 'pull_request'
        run: |
          pmdocs push \
            --endpoint "$DOCS_SYNC_ENDPOINT" \
            --source "$PMDOCS_SOURCE" \
            --github-oidc \
            --dry-run
        env:
          DOCS_SYNC_ENDPOINT: ${{ secrets.DOCS_SYNC_ENDPOINT }}

      - name: Publish docs package
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: |
          pmdocs push \
            --endpoint "$DOCS_SYNC_ENDPOINT" \
            --source "$PMDOCS_SOURCE" \
            --github-oidc \
            --publish
        env:
          DOCS_SYNC_ENDPOINT: ${{ secrets.DOCS_SYNC_ENDPOINT }}
```
