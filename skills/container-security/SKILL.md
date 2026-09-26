---
name: container-security
description: Secure containerized workloads — image hardening, registry scanning, runtime protection, and supply-chain integrity.
category: security
---

## Overview

Containers package applications with their dependencies — which means they also package vulnerabilities, misconfigurations, and secrets at scale and speed. Container security covers the full lifecycle: hardened base images, scanned registries, signed artifacts, least-privilege runtime, and monitoring for anomalous container behavior.

This skill gives you the defensive lifecycle: build secure images, verify what you deploy, constrain what runs, and watch it in production.

Shift left with guardrails, not gates: image scanning and policy checks in the pipeline should guide developers with fast feedback, not become a security tollbooth that everyone routes around. The goal is secure-by-default base images and pipelines, so the average developer never has to think about it.

## When to use

- Building the container security program (image standards, registry, runtime).
- Remediating scanner findings: vulnerable base images, misconfigurations, leaked secrets.
- Defining admission policies (what may deploy to the cluster).
- Responding to a compromised container or malicious image.

## Core concepts

- **Minimal base images.** Distroless or minimal bases slash the vulnerability surface — fewer packages means fewer CVEs to triage. Standardize 2–3 blessed base images org-wide.
- **Image scanning in the pipeline.** Scan every build for OS and language-package CVEs; fail builds on criticals with fixes available; track the rest with SLAs. Scan the final image, not just the Dockerfile.
- **No secrets in images.** Secrets baked into layers persist even if deleted in later layers. Inject at runtime from a vault; scan images for leaked secrets in CI.
- **Image signing and provenance.** Sign images (Sigstore/Cosign) and verify signatures at admission — deploy only what your pipeline built. Attestations bind the image to its source and build.
- **Least-privilege runtime.** Run as non-root, read-only filesystems, dropped capabilities, no privileged containers. The container that gets compromised should offer the attacker as little as possible.
- **Admission control.** Policy engines (OPA/Kyverno or platform-native) enforce the rules at deploy time: signed images only, no :latest tags, required labels, resource limits, disallowed registries.
- **Runtime protection.** Monitor container behavior — unexpected processes, network connections, file writes — and alert or block. Containers should behave predictably; deviations are signal.
- **Registry hygiene.** Private registries with access control, retention policies, and continuous re-scanning (new CVEs appear in old images). Prune aggressively.

- **Base-image provenance verification.** Verify your blessed bases come from trusted publishers with signed attestations — a compromised base image poisons every downstream build.
- **Language-package lockfiles.** Committed lockfiles with hashed integrity make builds reproducible and tamper-evident; unpinned transitive updates are supply-chain roulette.

## Practical workflow

1. **Standardize base images:** pick minimal blessed bases per stack; rebuild them on cadence; publish with vulnerability reports so teams choose securely by default.
2. **Secure the pipeline:** scan on every build, block criticals with available fixes, secret-scan layers, sign and attest on success. Make the secure path the fast path.
3. **Enforce at admission:** deploy policy that rejects unsigned images, :latest tags, root containers, and unapproved registries. Start in audit mode, then enforce.
4. **Harden runtime defaults:** non-root, read-only root filesystem, dropped capabilities, seccomp/AppArmor profiles, resource limits — as namespace/cluster defaults where possible.
5. **Monitor runtime:** behavioral monitoring for anomalous processes, network, and file activity; alert on policy violations; maintain container-incident runbooks (quarantine the pod, capture forensics, rotate exposed secrets).
6. **Manage the lifecycle:** continuous re-scanning of deployed images, rebuild-and-redeploy SLAs for new criticals, registry pruning, and base-image refresh cadence.

### Quick wins

- Standardize on minimal blessed base images per stack this quarter
- Enable admission blocking for :latest tags and unsigned images (audit mode first)
- Scan one production image manually today — the findings motivate the program

### Sustaining the practice

- Re-scan all registry images weekly against fresh CVE feeds
- Review admission-policy violations monthly — patterns indicate pipeline gaps
- Refresh blessed base images on a fixed cadence, not ad hoc
- Exercise the container-incident runbook with a simulated compromise

### Metrics that prove it works

- % of deployed images from blessed bases, signed and scanned
- Mean time from critical CVE publish to patched redeploy
- Admission-policy violation rate (trending down as pipelines mature)
- Runtime anomaly alerts investigated within SLA

## Common pitfalls

- **Scanning without a fix path.** Finding 500 CVEs with no base-image update process is just a list. Pair scanning with blessed-image maintenance and rebuild SLAs.
- **:latest in production.** Mutable tags destroy reproducibility and auditability. Pin digests for anything that matters.
- **Running as root by default.** The single most common and most impactful misconfiguration. Non-root should be the default, with exceptions justified.
- **Admission in audit-only forever.** Audit mode that never becomes enforce mode is documentation, not control. Set the enforcement date at deployment.
- **Secrets in environment variables of dubious provenance.** Env vars are better than layers but still leak into logs and debug endpoints. Prefer vault-injected, short-lived secrets.
- **Ignoring the supply chain.** Base images and language packages come from somewhere — verify provenance, pin versions, and monitor for compromised upstream packages.
- **Runtime monitoring gaps.** Build-time scanning does not catch runtime exploitation. Behavioral runtime protection is the backstop.
- **Registry as a junk drawer.** Old, unscanned, untagged images accumulate. Retention policies and pruning are security controls.
- **Scanning the Dockerfile instead of the image.** What matters is the final artifact's contents, including everything the build pulled in. Scan final images.
- **Forgetting init and sidecar containers.** Security policies must cover every container in the pod, not just the application container.
