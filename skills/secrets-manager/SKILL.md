---
name: secrets-manager
description: Design secrets management — vaulting, rotation, least-privilege access, and eliminating hardcoded credentials.
category: security
---

## Overview

Secrets — API keys, passwords, tokens, certificates, connection strings — are the keys to the kingdom, and they leak constantly: hardcoded in repos, pasted in chat, baked into images. A secrets-management program gives every secret a safe home (a vault), a defined lifetime (rotation), and minimal exposure (least-privilege access with audit trails).

This skill covers selecting and operating secrets management: vault architecture, rotation, application integration patterns, and cleaning up the hardcoded-secret debt most orgs carry.

Secrets management fails most often not on technology but on developer experience: if the vault is harder than hardcoding, developers will hardcode. The winning pattern makes the secure path the easy path — SDKs, sidecar injectors, and CI integrations that fetch secrets with less effort than copying them into config files.

## When to use

- Replacing hardcoded credentials and config-file secrets with a vault.
- Designing secret rotation for databases, API keys, and service accounts.
- Responding to a leaked secret (revoke, rotate, investigate exposure).
- Auditing who can access which secrets and whether access is still needed.

## Core concepts

- **Vault as the system of record:** HashiCorp Vault, cloud KMS/secrets services, or equivalent — secrets live encrypted at rest, with access control, versioning, and audit logging. Spreadsheets, wikis, and chat are not vaults.
- **Dynamic vs static secrets:** dynamic (generated on demand, short-lived, e.g., per-request DB credentials) beats static (long-lived passwords) — stolen dynamic secrets expire before they can be used.
- **Rotation:** scheduled (e.g., 30–90 days) plus event-driven (employee departure, suspected leak, incident). Automated rotation beats manual; manual rotation gets skipped.
- **Least privilege + audit:** applications and humans get exactly the secrets they need, via short-lived tokens, with every access logged. Regular access reviews prune stale grants.
- **No secrets in code, ever:** repos, CI logs, container images, and client-side bundles must be secret-free. Pre-commit hooks and secret scanning enforce it.
- **Break-glass:** emergency access procedures for when the vault is down — sealed, logged, tested, and rotated after use.

- **Secret zero problem.** The credential used to authenticate to the vault is itself a secret — bootstrap it from platform identity (instance roles, workload identity) rather than another static token.
- **Rotation without downtime.** Versioned secrets plus graceful reload (or dual-support windows) let applications pick up rotated values without restarts or outages.
- **Ephemeral credentials.** The best secret is one that barely exists: dynamic, short-lived credentials issued per workload session minimize the value of any leak.

## Practical workflow

1. **Inventory secrets:** scan repos, CI configs, wikis, and chat exports for hardcoded secrets (automated secret scanning). Classify by blast radius: production DB creds and cloud root keys first.
2. **Stand up the vault:** choose the platform; configure encryption at rest, authentication (OIDC/IAM-based, not long-lived tokens), audit logging to the SIEM, and backup/restore tested.
3. **Migrate applications:** switch apps to vault APIs or injectors (sidecar/env at deploy time, never baked into images). Prefer dynamic secrets for databases and cloud access.
4. **Automate rotation:** scheduled rotation for static secrets; event-driven rotation runbooks for leaks and offboarding. Verify apps pick up rotated secrets without downtime (versioned secrets, graceful reload).
5. **Enforce prevention:** pre-commit secret scanning, CI pipeline secret detection (block on high-confidence finds), and container-image scanning. Treat a blocked commit as coaching, not punishment.
6. **Respond to leaks:** when a secret leaks — revoke/rotate immediately, search for where else it was used, check access logs for misuse during the exposure window, then fix the process that allowed the leak.

### Leak response checklist

- [ ] Secret revoked/rotated at the source (old value dead)
- [ ] All copies removed (repo history rewritten or repo rotated, chat deleted, images rebuilt)
- [ ] Access logs reviewed for the exposure window
- [ ] Root cause fixed (why was it hardcoded / over-exposed?)
- [ ] Detection improved (scanning rule, alert)

### Sustaining the practice

- Scan for hardcoded secrets on every commit and in every image build
- Review vault access grants quarterly against current team membership
- Test vault backup/restore and break-glass procedures annually
- Track mean-time-to-rotate after a suspected leak as a readiness metric

### Metrics that prove it works

- % of applications migrated from hardcoded/config secrets to the vault
- Rotation compliance % (secrets rotated within policy window)
- Hardcoded-secret scanner finds per quarter (trending down)
- Secret access review completion and stale-grant removal counts

## Common pitfalls

- **Vault with weak auth.** A vault fronted by a shared static token is a single point of compromise. Use short-lived, identity-based auth.
- **No rotation.** "Vaulted but never rotated" just centralizes stale secrets. Automate rotation or it will not happen.
- **Secrets in CI logs and images.** Mask secrets in pipeline output; never bake them into container layers (each layer persists even if a later layer deletes the file).
- **Over-broad access.** "The whole team can read prod secrets" defeats the purpose. Scope by environment and role; review quarterly.
- **Break-glass never tested.** An untested emergency procedure fails during the actual emergency. Test restores and break-glass annually.
- **Scanning without remediation.** Finding 500 hardcoded secrets with no rotation-and-removal program is just a list. Pair scanning with a cleanup backlog and SLA.
- **A vault nobody backs up.** Losing the vault means losing every secret at once. Test backup and restore, including the unseal/recovery procedure.
- **Long-lived vault tokens.** Static tokens for automation defeat the purpose. Use short-lived, identity-bound auth for workloads.
- **Vault sprawl.** Three teams running three different vaults means three audit trails and three backup stories. Standardize on one platform with proper multi-tenancy.
- **Secrets in backups and logs.** Encrypted vault backups are still sensitive; CI logs echo secrets without masking. Protect the copies, not just the vault.
