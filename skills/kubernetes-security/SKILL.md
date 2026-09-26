---
name: kubernetes-security
description: Harden Kubernetes clusters — RBAC, pod security, network policies, secrets, and control-plane protection.
category: security
---

## Overview

Kubernetes orchestrates containers at scale — and its powerful defaults are insecure defaults: open dashboards, permissive RBAC, flat pod networking, and secrets in etcd. Securing Kubernetes means hardening the control plane, constraining workloads, segmenting the network, and governing the supply chain of what gets scheduled.

This skill covers the defensive hardening lifecycle: cluster configuration, workload policies, network segmentation, and continuous compliance checking.

Harden in layers from the outside in: control-plane and API access first (it is the keys to everything), then node security, then workload constraints, then network policy. A perfectly configured pod security policy means nothing if the API server is reachable with a stolen over-permissioned kubeconfig.

## When to use

- Provisioning or auditing a Kubernetes cluster (managed or self-hosted).
- Remediating benchmark findings (CIS Kubernetes Benchmark).
- Designing multi-tenant or multi-team cluster isolation.
- Implementing pod security, network policies, and admission control.
- Responding to a cluster compromise.

## Core concepts

- **API server is the crown jewel.** Restrict network access, require strong authentication (no static tokens), audit-log everything, and protect etcd (encryption at rest, restricted access, regular backups).
- **RBAC least privilege.** No cluster-admin for humans day-to-day; namespace-scoped roles per team; service accounts with minimal permissions; regularly audit bindings — especially wildcard and cluster-scoped ones.
- **Pod Security Standards.** Enforce baseline/restricted policies per namespace via Pod Security Admission: no privileged pods, no host namespaces, read-only root filesystems, non-root users, dropped capabilities.
- **Network policies.** Default-deny ingress/egress per namespace, then allow explicitly. Without them, every compromised pod can reach every other pod — flat networks are lateral-movement heaven.
- **Secrets management.** etcd encryption for secrets at rest; prefer external secret stores with short-lived injection over native Secrets; never commit Secrets to git (use sealed/encrypted or external references).
- **Admission control.** OPA Gatekeeper / Kyverno policies as code: require signed images, disallow :latest, enforce labels/resource limits, block dangerous capabilities. Audit mode first, then enforce.
- **Node hardening.** CIS-hardened node images, restricted SSH, kubelet authentication/authorization, and read-only ports closed. Nodes are shared fate — one compromised node threatens co-located pods.
- **Supply chain.** Signed images only, private registries, image scanning in CI, and admission-time verification. The cluster should only run what your pipeline built.
- **Runtime security.** Behavioral monitoring (unexpected processes, network, file writes in pods), Falco-style syscall rules, and alerts on admission-policy violations.
- **Multi-tenancy isolation.** Namespaces are not security boundaries alone — combine with network policies, resource quotas, RBAC, and pod security per tenant. True hard isolation needs separate clusters or virtualization.

- **Audit log volume management.** Full API audit logging is verbose; tune the audit policy to capture security-relevant verbs while keeping volume (and cost) manageable.
- **etcd encryption verification.** Enabling encryption at rest is not enough — verify it actually encrypts secrets (not just config) and that keys are managed, not default.

## Practical workflow

1. **Benchmark the cluster:** run CIS Kubernetes Benchmark checks (kube-bench or equivalent); prioritize control-plane, etcd, and API-server findings first.
2. **Lock down access:** RBAC audit and least-privilege rebuild; remove static tokens and anonymous access; enable comprehensive API audit logging shipped to the SIEM.
3. **Enforce pod security:** apply Pod Security Standards per namespace (restricted where possible); admission policies for images, tags, and capabilities; start audit, move to enforce.
4. **Segment the network:** default-deny network policies per namespace; explicit allow rules for required flows; verify with traffic tests, not just policy review.
5. **Secure secrets and supply chain:** etcd encryption, external secret management, image signing with admission verification, registry scanning.
6. **Monitor continuously:** API audit-log alerting (anomalous RBAC changes, secret access, exec into pods), runtime behavioral alerts, and CIS drift checks on cadence.

### Quick wins

- Run the CIS benchmark this week; fix control-plane findings first
- Audit cluster-admin bindings — remove every human day-to-day grant
- Apply default-deny network policies to the highest-risk namespaces first

### Sustaining the practice

- Re-run CIS benchmarks quarterly; track compliance trend
- Review RBAC bindings and service-account permissions semi-annually
- Test network policies with actual traffic probes after changes
- Rotate cluster credentials and certificates before expiry, with runbooks

### Metrics that prove it works

- CIS benchmark pass rate, trended quarterly
- % namespaces under enforced pod security and default-deny network policy
- Mean time to remediate critical misconfigurations
- API audit-log alert triage SLA compliance

## Common pitfalls

- **cluster-admin for everyone.** The fastest path to total cluster compromise. Break-glass only, with alerting on its use.
- **No network policies.** The default allow-all pod network is the most exploited Kubernetes misconfiguration. Default-deny is step one.
- **Secrets in git.** Even "private" repos leak. External secret stores or sealed secrets — never plaintext manifests.
- **Ignoring the CIS benchmark.** "It works" is not "it's secure." Benchmark on provisioning and quarterly after.
- **Managed-control-plane complacency.** Managed Kubernetes secures the control plane, not your RBAC, pod security, or network policies. The shared-responsibility line is real.
- **Admission audit-only forever.** Set the enforcement date when deploying policy, or audit mode becomes permanent.
- **Over-permissioned CI/CD service accounts.** The pipeline's deploy account with cluster-admin undermines every other control. Scope it to namespaces and verbs it needs.
- **No etcd backup/restore testing.** Encrypted, backed-up etcd you cannot restore is a false safety net. Test restores.
- **Exposed dashboards and APIs.** Kubernetes dashboards and unauthenticated API endpoints exposed to networks are instant compromise. No dashboard without auth, ever.
- **Helm chart defaults.** Charts ship with permissive defaults for easy demos. Every chart needs a security values review before production.
