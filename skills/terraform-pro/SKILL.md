---
name: terraform-pro
description: Terraform guidance — HCL structure, modules, state management, workspaces, planning discipline, and safe applies.
category: development
---

## Overview

Terraform manages infrastructure as code: you declare resources in HCL, Terraform plans the diff between config and reality, and applies it. The plan/apply separation is the core safety mechanism — every infrastructure change gets reviewed before it executes. Teams that respect the plan step sleep well; teams that `-auto-approve` everything learn why the hard way.

The hard parts of Terraform are state management, module design, and blast-radius control — not HCL syntax. This skill covers structuring Terraform projects, handling state safely, writing reusable modules, and the planning discipline that keeps applies boring.

## When to use

- Structuring a new Terraform project (layout, modules, environments).
- Managing remote state (backends, locking, state surgery).
- Writing reusable modules (interfaces, versioning).
- Reviewing plans safely (what to look for, when to stop).
- Refactoring Terraform code (moved blocks, imports, renames).
- Choosing workspaces vs directories vs separate states.
- Migrating to/from Terraform, or adopting OpenTofu.

## Core concepts

- **Plan before apply, always.** `terraform plan` shows the diff; review it like code — especially deletions and replacements. Save plans (`-out`) and apply the saved plan so what you reviewed is what runs.
- **State is the source of truth.** The state file maps config to real resources. Lose it and Terraform wants to recreate everything; corrupt it and applies go sideways. Remote backends (S3+GCS+Azure with locking) are mandatory for teams.
- **State locking.** DynamoDB/GCS/Azure locks prevent concurrent applies from corrupting state. If a lock sticks, investigate before force-unlocking — the other apply might still be running.
- **Modules are the unit of reuse.** Encapsulate patterns (a VPC, a service with its IAM/DB/DNS) behind clean variable/output interfaces. Publish versioned modules (registry, git tags); pin versions in consumers.
- **Blast radius.** Small states per environment/component beat one giant state. A bad apply in a 500-resource state is a company-wide incident; in a 20-resource state it's a scoped fix. Split by lifecycle and team.
- **Workspaces vs directories.** Workspaces suit near-identical environments with tiny differences; separate directories/states suit environments that diverge. Most production setups use separate states per environment.
- **Resource addressing and `moved`.** Renaming resources or modules orphans them without `moved` blocks — Terraform plans to destroy + recreate. Use `moved` for refactors; verify with plan before applying.
- **Importing existing infrastructure.** `import` blocks (or `terraform import`) bring hand-created resources under management. Import, then immediately reconcile config to match reality — imported resources with drifting config are a trap.
- **Data sources.** Read existing infrastructure (AMIs, VPCs, secrets) without managing it. Prefer data sources over hardcoding IDs that change.
- **Sensitive values.** Mark variables/outputs `sensitive`; state files contain secrets in plaintext — encrypt backends, restrict access, and consider `sensitive` + external secret stores.
- **Provider versioning.** Pin provider versions (`required_providers` with `~>` constraints) and commit lock files. Unpinned providers upgrade themselves into breaking changes.
- **Count vs for_each.** `for_each` over maps for named instances (stable addressing when items change); `count` for identical multiples. `for_each` plans are readable; `count` plans shift identities.
- **Lifecycle meta-arguments.** `prevent_destroy` for stateful resources (databases), `create_before_destroy` for zero-downtime replacements, `ignore_changes` for externally-managed attributes.
- **Drift.** Reality diverges from state (console clicks, external automation). `terraform plan` shows drift; decide per case whether to reconcile config or re-import. Regular drift detection beats surprise diffs.
- **Policy as code.** Sentinel/OPA/Conftest checks in CI (no public S3 buckets, required tags, allowed regions) — guardrails that don't depend on reviewer vigilance.

## Practical workflow

1. **Lay out the project.** One directory per environment, shared modules in `modules/`, remote backend configured from the start.
   ```
   infra/
     modules/vpc/  modules/service/
     prod/  staging/
       main.tf backend.tf variables.tf outputs.tf
   ```
2. **Configure the backend first.** S3 with versioning + encryption + DynamoDB lock (or GCS/Azure equivalents); never local state for shared infrastructure.
   ```hcl
   terraform {
     backend "s3" {
       bucket         = "acme-tf-state"
       key            = "prod/terraform.tfstate"
       region         = "us-east-1"
       dynamodb_table = "tf-state-locks"
       encrypt        = true
     }
   }
   ```
3. **Write modules with clean interfaces.** Typed variables with descriptions and defaults, outputs for what consumers need, READMEs with examples. Version with git tags; pin in consumers.
4. **Plan and review.** `terraform plan -out=tfplan`; read the whole diff — count changes, scrutinize every deletion/replacement, check for unexpected modifications. In CI, post plans as PR comments.
5. **Apply the saved plan.** `terraform apply tfplan` — never re-plan at apply time in CI. For production, require approval on the plan artifact.
6. **Refactor with `moved`.** Renames and module extractions get `moved` blocks; verify the plan shows moves, not destroy/create.
   ```hcl
   moved {
     from = aws_instance.web
     to   = module.web.aws_instance.main
   }
   ```
7. **Protect stateful resources.** `prevent_destroy` on databases and buckets; `create_before_destroy` where replacements must not cause downtime; backups independent of Terraform.
8. **Detect drift and enforce policy.** Scheduled `plan` runs reporting drift; policy checks in CI; tag everything (owner, environment, cost center) via provider default_tags.

## Common pitfalls

- **Auto-approving applies** — skipping plan review; the plan is the safety mechanism, don't bypass it.
- **Local state for shared infra** — unmergeable, unlockable, losable; remote backend with locking from day one.
- **Giant monolithic state** — blast radius of a bad apply; split by environment and component.
- **Editing state by hand** — use `state mv/rm` commands; hand-edits corrupt.
- **Force-unlocking blindly** — another apply may be running; investigate first.
- **Unpinned providers** — surprise breaking upgrades; pin versions and commit lock files.
- **Secrets in state/outputs** — plaintext secrets in the state file; encrypt backend, restrict access, mark sensitive.
- **Renames without `moved`** — destroy + recreate instead of a move; data loss on stateful resources.
- **Console drift** — hand-editing resources Terraform manages; reconcile or import, don't ignore.
- **Missing `prevent_destroy`** — one bad plan deleting the production database; guard stateful resources.
- **`count` for named resources** — identity shifts when the list changes; `for_each` with stable keys.
- **Applying different plan than reviewed** — re-planning at apply time; apply the saved plan artifact.
- **No backups of state** — backend versioning on, plus periodic copies; state loss is rebuild-everything.
