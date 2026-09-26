---
name: gitops-workflow
description: Run GitOps: declarative infrastructure and deployments driven by Git as the source of truth. Use when managing Kubernetes or infrastructure with auditable, reproducible deployments.
category: workflow-automation
---

# GitOps Workflow

## Overview

GitOps: the desired state of infrastructure and applications lives in Git; automated agents converge the live environment to match.

Benefits: every change is a reviewed PR, full audit history, easy rollbacks (revert the commit), and drift detection/correction.

Typical stack: Git repo(s) + a GitOps agent (Argo CD, Flux) + Kubernetes, though the pattern applies to Terraform and other IaC too.

## When to use

- Deploying to Kubernetes with auditable change history
- Teams wanting PR-reviewed infrastructure changes
- Multi-environment deployment management
- Drift detection between desired and actual state
- Disaster recovery via declarative state

## Core concepts

- **Desired state in Git.**
  All manifests/configs declarative in Git. Git is the single source of truth; manual kubectl edits are drift to be corrected, not changes to keep.
- **Reconciliation loop.**
  Agents continuously compare live state to Git and converge (sync). Drift gets detected and auto-corrected or alerted.
- **PR-based changes.**
  Every change = pull request = review + CI validation + audit trail. No direct prod edits, ever.
- **Environments as branches/folders.**
  Dev/staging/prod as repo branches, folders, or separate repos. Promotion = merge or sync, with gates between.
- **Secrets handling.**
  Never plaintext secrets in Git. Sealed Secrets, External Secrets Operator, or vault integrations — encrypted in repo, decrypted in cluster.
- **Progressive delivery.**
  Canary/blue-green via Argo Rollouts or Flagger on top of GitOps. Git declares the intent; the operator manages the rollout.
- **Drift detection.**
  Agents report out-of-sync resources. Policy: auto-heal for config drift, alert for unexpected changes (possible incidents).
- **Disaster recovery.**
  New cluster + point agent at Git = restored state. Test this. GitOps' best feature is boring, reliable recovery.

## Practical workflow

1. **Structure the repos.**
   App configs per environment; infra configs separate. Decide: mono-repo vs. per-app vs. per-env — document the choice.
2. **Install the agent.**
   Argo CD or Flux on the cluster, pointed at the config repo. RBAC scoped; UI/API access controlled.
3. **Define environments.**
   Dev/staging/prod overlays (Kustomize) or value files (Helm). Promotion path explicit: how does a change reach prod?
4. **Set up secrets flow.**
   Choose sealed/external secrets. Verify: secrets encrypted in Git, working in cluster, rotation procedure documented.
5. **Enforce PR workflow.**
   Branch protection on config repos, CI validating manifests (kubeconform, kube-linter), required reviews for prod paths.
6. **Configure sync policy.**
   Automated sync for dev; manual approval gates for prod. Drift: auto-heal config, alert on anomalies.
7. **Add progressive delivery.**
   Canary analysis for critical services. Start simple (manual promotion), add automation as confidence grows.
8. **Test disaster recovery.**
   Actually rebuild from Git in a test cluster. Document the runbook. Untested DR is a hope.

## Common pitfalls

- **Manual kubectl edits.**
  Every direct prod edit is drift that GitOps will revert — or worse, drift nobody notices. Git is the only write path.
- **Secrets in plaintext.**
  Committed secrets are compromised secrets (git history never forgets). Sealed/external secrets from day one.
- **No promotion gates.**
  Auto-sync straight to prod on every merge. Dev auto, prod gated — the minimum sane policy.
- **Mono-repo chaos.**
  200 apps in one repo with no structure. Organize deliberately; repo layout is architecture.
- **Ignoring drift alerts.**
  Drift alerts firing, nobody looking. Drift detection without response is just noise.
- **Untested recovery.**
  'We can rebuild from Git' — never tried. Test yearly at minimum; after every major change ideally.
- **CI that doesn't validate.**
  Merging invalid manifests that fail at sync time. Lint/validate/dry-run in CI before merge.
- **Secret rotation amnesia.**
  Secrets working but rotation never tested. Document and drill rotation for critical secrets.
