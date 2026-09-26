---
name: argo-cd-pro
description: Argo CD guidance — GitOps workflows, Application manifests, sync strategies, AppProjects, and multi-cluster ops.
category: development
---

## Overview

Argo CD is the GitOps continuous-delivery tool for Kubernetes: it watches git repositories and syncs cluster state to match, with a UI showing live vs desired state, diffs, and sync history. The core promise — git as the single source of truth for what's running — makes deployments auditable, reviewable, and reversible.

Doing GitOps well means structuring repos (app configs vs environment values), choosing sync strategies deliberately, and locking down Argo CD itself (it's a powerful control plane). This skill covers Application design, sync policies, AppProjects for multi-tenancy, and operating Argo CD at scale.

## When to use

- Implementing GitOps for Kubernetes deployments.
- Writing Argo CD Application manifests.
- Choosing sync strategies (manual vs automated, prune, self-heal).
- Structuring git repos for app + environment configuration.
- Setting up AppProjects for team isolation.
- Managing multiple clusters with Argo CD.
- Debugging OutOfSync, sync failures, and drift.

## Core concepts

- **Git as source of truth.** Desired state lives in git; Argo CD reconciles the cluster toward it. Every change is a commit — reviewed, timestamped, revertible. `kubectl apply` from laptops breaks the model.
- **Applications.** The CRD binding a git path to a cluster/namespace: source (repo, path, targetRevision) + destination. One Application per deployable unit per environment is the common granularity.
- **Sync strategies.** Manual (click to sync — safe for production starts), automated (sync on git change), with prune (delete resources removed from git) and self-heal (revert manual `kubectl` changes). Automated + prune + self-heal is full GitOps; adopt it progressively.
- **Target revisions.** Branch, tag, or commit SHA. Branches move (convenient, less auditable); tags/SHAs are immutable (auditable, need automation to advance). Production typically tracks tags or SHAs advanced by CI.
- **App of apps.** A meta-Application that syncs other Applications — the bootstrapping pattern for managing dozens of apps without manual onboarding.
- **ApplicationSets.** Template Applications across clusters/environments from generators (git directories, cluster lists, matrix combos) — the scaling mechanism. One ApplicationSet can manage hundreds of Applications.
- **AppProjects.** Namespaces for Argo CD tenancy: which sources, destinations, and resource types a team may use. Without projects, every team can deploy anything anywhere.
- **Sync waves and hooks.** Order resource application (CRDs before custom resources, migrations before app) with sync waves; hooks (pre/post-sync jobs) for migrations and verification. Waves are the deployment-sequencing primitive.
- **Resource health and custom health checks.** Argo CD knows Deployments/Services; CRDs need custom health Lua scripts to report Healthy/Degraded correctly — otherwise syncs hang in Progressing.
- **Diff customization.** Ignore differences Argo CD shouldn't fight over (replicas managed by HPA, injected sidecars, defaulted fields) via `ignoreDifferences` — otherwise everything shows OutOfSync forever.
- **RBAC.** Argo CD's own RBAC (roles for teams: read-only, sync-only, admin) + SSO integration. The Argo CD admin account is cluster-admin-equivalent — protect it accordingly.
- **Multi-cluster.** One Argo CD managing many clusters via cluster credentials; or Argo CD per cluster. Central management scales ops; per-cluster isolates blast radius.
- **Image updater.** Argo CD Image Updater bumps image tags in git automatically — closing the loop so CI pushing images updates the deployment source.
- **Notifications.** Webhook/Slack/email on sync success/failure/health changes — wire into the team's existing alerting, not a separate channel nobody watches.

## Practical workflow

1. **Structure repos.** App repo (code + base manifests) separate from config repo (environment overlays/values); CI updates image tags in the config repo; Argo CD syncs from it.
   ```
   config-repo/
     apps/shop-api/base/          # kustomize base or helm values
     apps/shop-api/overlays/prod/
   ```
2. **Write Applications.** Source pointing at the config repo path + targetRevision policy; destination cluster/namespace; sync policy per environment.
   ```yaml
   apiVersion: argoproj.io/v1alpha1
   kind: Application
   metadata: { name: shop-api-prod, namespace: argocd }
   spec:
     project: shop-team
     source: { repoURL: https://git.example.com/config.git, targetRevision: prod, path: apps/shop-api/overlays/prod }
     destination: { server: https://kubernetes.default.svc, namespace: shop-prod }
     syncPolicy: { automated: { prune: true, selfHeal: true } }
   ```
3. **Start manual, automate progressively.** Manual sync for production initially; enable automated + prune + self-heal once the team trusts the pipeline. Staging can be automated from day one.
4. **Isolate with AppProjects.** Per-team projects restricting source repos, destination clusters/namespaces, and permitted resource kinds; RBAC roles mapped to SSO groups.
5. **Handle sequencing.** Sync waves for ordered resources (namespaces → CRDs → operators → apps); pre-sync hooks for DB migrations; post-sync hooks for smoke tests.
6. **Tame the diff.** `ignoreDifferences` for HPA-managed replicas, mutated fields, and operator-managed status; custom health checks for CRDs so syncs complete.
7. **Scale with ApplicationSets.** Generators across environments/clusters from a single template; app-of-apps for the bootstrap layer.
8. **Observe and notify.** Sync status dashboards, notifications on failure/degradation, audit of who synced what; monitor Argo CD's own health (repo server, controller queue depth).

## Common pitfalls

- **`kubectl` edits in a GitOps world** — manual changes reverted by self-heal (confusion) or fought forever (without self-heal); all changes via git.
- **Automated sync too early** — every commit auto-deploying to prod before the pipeline is trusted; progress manual → automated.
- **No prune** — deleted-from-git resources lingering in the cluster; enable prune deliberately.
- **Missing `ignoreDifferences`** — perpetual OutOfSync from HPA replicas and defaulted fields; ignore what's externally managed.
- **No custom health for CRDs** — syncs stuck Progressing; write health Lua for operators' resources.
- **Tracking moving branches in prod** — unauditable deploys; tags/SHAs advanced by CI.
- **Single project for all teams** — no isolation; AppProjects per team with RBAC.
- **Argo CD itself unsecured** — default admin password, no SSO/RBAC; it's cluster-admin, protect it.
- **Sync waves misordered** — apps before CRDs/operators; sequence dependencies explicitly.
- **Image tags not advancing** — CI builds images but git still points at old tags; Image Updater or CI commits.
- **Monorepo config sprawl** — one giant path for everything; per-app directories with clear ownership.
- **Notifications to nowhere** — alerts in a channel nobody watches; integrate with real on-call.
- **No disaster recovery for git** — config repo as single point of truth with no backup/mirror; protect it like production data.
