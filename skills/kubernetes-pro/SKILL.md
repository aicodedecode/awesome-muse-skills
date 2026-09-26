---
name: kubernetes-pro
description: Kubernetes guidance — workloads, services, config, RBAC, Helm/Kustomize, troubleshooting, and cluster operations.
category: development
---

## Overview

Kubernetes orchestrates containers at scale: it schedules pods, heals failures, rolls out updates, and wires up networking, storage, and configuration declaratively. You describe desired state in YAML; controllers converge reality toward it. That declarative model is powerful — and unforgiving of sloppy manifests.

Production Kubernetes is as much about the surrounding practices (GitOps, RBAC, resource management, observability) as the API objects. This skill covers the core workload types, the configuration model, safe deployment patterns, and the troubleshooting approach that resolves most cluster problems.

## When to use

- Deploying applications to Kubernetes (writing manifests).
- Choosing workload types (Deployment, StatefulSet, Job, DaemonSet).
- Debugging pods (CrashLoopBackOff, ImagePullBackOff, OOMKilled, pending).
- Configuring networking (Services, Ingress, NetworkPolicy).
- Managing config and secrets (ConfigMaps, Secrets, external secret stores).
- Setting up RBAC and pod security.
- Packaging with Helm or Kustomize; GitOps with Argo CD/Flux.

## Core concepts

- **Declarative desired state.** You declare what should exist; controllers make it so. `kubectl apply` a manifest, and the Deployment controller, ReplicaSet controller, and kubelet collaborate to converge. Debug by comparing desired vs actual state.
- **Pods are ephemeral.** The smallest unit; they die and get replaced. Never rely on pod identity, local state, or manual pod creation — use controllers (Deployments) that manage pods for you.
- **Deployments for stateless.** Rolling updates with `maxUnavailable`/`maxSurge`, rollbacks via `rollout undo`. The default workload for web services and APIs.
- **StatefulSets for stateful.** Stable network identities and persistent storage per replica — databases, Kafka, Elasticsearch. More operational care required; don't run stateful systems casually.
- **Jobs and CronJobs.** Run-to-completion work (migrations, batch jobs) and scheduled tasks. Set `backoffLimit`, `activeDeadlineSeconds`, and history limits; idempotent job logic matters because retries happen.
- **Services and DNS.** ClusterIP (internal), NodePort, LoadBalancer, headless. Services give stable virtual IPs + DNS names for ephemeral pods — the service discovery primitive.
- **Ingress.** HTTP(S) routing into the cluster (host/path rules, TLS termination). An Ingress is just config — you need an ingress controller (nginx, Traefik, ALB controller) actually running.
- **ConfigMaps and Secrets.** Configuration decoupled from images. Secrets are base64-encoded, not encrypted by default — enable encryption at rest and prefer external secret stores (Vault, cloud KMS) synced via operators.
- **Resource requests and limits.** Requests drive scheduling and QoS; limits cap usage. Set both on every container — unset limits let one pod starve a node; unset requests make scheduling unpredictable.
- **Probes.** Liveness (restart if dead), readiness (remove from service if not ready), startup (for slow-starting apps). Wrong probes cause cascading restarts — tune them to real app behavior.
- **RBAC.** Roles/ClusterRoles + Bindings following least privilege. ServiceAccounts per workload, not the default one. Audit who can do what — `cluster-admin` bindings are a finding, not a convenience.
- **Namespaces.** Isolation boundaries for teams/environments (with quotas and policies). Not a security boundary alone — combine with NetworkPolicy and RBAC.
- **NetworkPolicy.** Firewall rules between pods; default-deny is the secure posture. Without policies, any compromised pod can reach any other pod.
- **Helm vs Kustomize.** Helm: templated packages with values (great for third-party charts). Kustomize: overlay-based patching without templates (great for your own apps). Many teams use both.
- **GitOps.** Argo CD/Flux sync cluster state from git — the deployment and audit model for production. `kubectl apply` from laptops doesn't scale and isn't auditable.

## Practical workflow

1. **Write minimal correct manifests.** Deployment + Service to start; add ConfigMap/Secret, Ingress, HPA as needed. Validate with `kubeconform` or `kube-linter` in CI.
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata: { name: shop-api }
   spec:
     replicas: 3
     selector: { matchLabels: { app: shop-api } }
     template:
       metadata: { labels: { app: shop-api } }
       spec:
         containers:
         - name: api
           image: registry/shop-api:abc123
           ports: [{ containerPort: 3000 }]
           resources:
             requests: { cpu: 100m, memory: 256Mi }
             limits: { cpu: 500m, memory: 512Mi }
           readinessProbe:
             httpGet: { path: /health, port: 3000 }
             periodSeconds: 10
   ```
2. **Externalize config.** ConfigMaps for non-sensitive config, Secrets (or external-secrets) for credentials; mount as env or files; never bake config into images.
3. **Set probes and resources.** Every container gets requests/limits and appropriate probes; startup probes for slow starters; liveness probes that actually detect deadlocks, not just process existence.
4. **Wire networking.** ClusterIP Service for internal traffic; Ingress + TLS for external; NetworkPolicy default-deny with explicit allows per workload.
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata: { name: default-deny }
   spec:
     podSelector: {}
     policyTypes: [Ingress]
   ```
5. **Manage with Helm/Kustomize.** Helm charts for third-party software with pinned versions and values files per environment; Kustomize overlays for your own apps' environment differences.
6. **Deploy via GitOps.** Argo CD/Flux watching the repo; automated sync with manual promotion gates for production; every change reviewed, every deploy traceable.
7. **Debug systematically.** `kubectl describe` (events tell the story), `kubectl logs` (current + `--previous` for crashed), `kubectl get events --sort-by=.lastTimestamp`. Common patterns: ImagePullBackOff (registry/auth), CrashLoopBackOff (app dying — check previous logs), Pending (resources/taints/affinity), OOMKilled (raise memory limit or fix leak).
   ```bash
   kubectl describe pod shop-api-abc
   kubectl logs shop-api-abc --previous
   kubectl get events --sort-by=.lastTimestamp | tail -20
   ```
8. **Operate the cluster.** Upgrade control plane before nodes (version skew policy), drain nodes properly, monitor etcd, API server latency, and node pressure; back up etcd.

## Common pitfalls

- **No resource limits** — one pod OOMing or starving a node; set requests and limits everywhere.
- **`:latest` image tags** — nodes caching stale images; use immutable tags and `imagePullPolicy: Always` for mutable ones.
- **Liveness probe killing slow apps** — aggressive probes causing restart cascades; tune to real startup/behavior.
- **Secrets in plain YAML** — base64 is not encryption; enable etcd encryption and use external secret management.
- **Running as root** — set `runAsNonRoot`, read-only filesystems, drop capabilities via pod security standards.
- **No NetworkPolicy** — flat network where any pod reaches any pod; default-deny + explicit allows.
- **Stateful workloads treated as stateless** — databases on Deployments with emptyDir; use StatefulSets + PVCs or managed services.
- **Ignoring PodDisruptionBudgets** — voluntary disruptions (upgrades, drains) taking down all replicas; set PDBs.
- **Cluster-admin for everything** — overprivileged service accounts and users; least-privilege RBAC.
- **Manual `kubectl apply` in prod** — unauditable, unrepeatable; GitOps from versioned manifests.
- **HPA without resource requests** — autoscaling on CPU needs requests set; misconfigured HPA thrashes replicas.
- **Forgetting storage classes** — PVCs pending forever; define and default a StorageClass.
- **Single-replica "HA"** — one replica is not highly available; minimum 2-3 with anti-affinity for critical services.
