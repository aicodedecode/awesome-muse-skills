---
name: cloud-security
description: Secure cloud environments — IAM, posture management, logging, and multi-account architecture across providers.
category: security
---

## Overview

Cloud security is identity security plus configuration discipline at API speed: the control plane is an API, misconfigurations deploy in seconds, and the blast radius of an over-permissioned role is the whole account. The shared-responsibility model means the provider secures the cloud, you secure what you put in it — and most cloud breaches are the customer's configuration, not the provider's infrastructure.

This skill covers the defensive program: account architecture, identity hardening, posture management (CSPM), detective controls, and data protection in AWS/Azure/GCP-style environments.

Design the account structure before the workloads: separate accounts/projects per environment and blast-radius boundary, centralized logging and security tooling, and SCP-style guardrails that make the dangerous thing hard. Retrofitting account architecture onto 200 workloads is ten times the cost of doing it on day one.

## When to use

- Designing a cloud landing zone or multi-account architecture.
- Remediating CSPM findings: public storage, over-permissive IAM, unencrypted data.
- Building cloud detective controls (audit logging, anomaly detection).
- Preparing for cloud-focused audits or incident response.
- Evaluating cloud security posture across providers consistently.

## Core concepts

- **Account/project architecture.** Separate by environment and sensitivity; centralize security tooling and logging; apply preventive guardrails (SCPs, organization policies) that block the worst misconfigurations by default.
- **Cloud IAM least privilege.** No long-lived access keys where roles/instance identities work; permission boundaries and conditions (MFA, source IP, time); regularly audit wildcard permissions — cloud IAM is where breaches start.
- **CSPM continuous posture.** Automated checks for public buckets, open security groups, unencrypted storage, disabled logging, and exposed admin consoles — with auto-remediation for the clear-cut cases and tickets for the rest.
- **Control-plane logging.** CloudTrail / Activity Logs / Audit Logs are non-negotiable: multi-region, immutable storage, alerting on key events (console logins, IAM changes, network modifications, data exports).
- **Network design.** Private subnets by default, no public IPs without justification, security groups as least-privilege firewalls, VPC flow logs for the sensitive segments, and no flat "everything talks to everything" VPCs.
- **Data protection.** Encryption at rest (with customer-managed keys for sensitive data), TLS in transit, backup with tested restore, and lifecycle policies so data does not accumulate forever.
- **Workload identity.** Prefer native workload identities (instance roles, workload identity federation) over static credentials — eliminate the secrets that get leaked from code and CI.
- **Anomaly detection.** Native threat detection (GuardDuty, Defender, Security Command Center) plus custom alerts on control-plane anomalies — tuned, triaged, and fed to the SOC.
- **Tagging and ownership.** Mandatory tags (owner, environment, data classification) make every other control — cost, incident response, compliance — actually work. Enforce at provisioning.

- **Cross-account role trust policies.** Trust policies with overly broad principals (entire orgs, external accounts without external IDs) are privilege-escalation paths. Constrain and review them.
- **Ephemeral environment hygiene.** Short-lived dev/test environments accumulate with production-grade access and no ownership. Tag, time-box, and auto-clean them.

## Practical workflow

1. **Architect accounts:** landing zone with separated accounts, centralized log archive, security tooling account, and preventive guardrails. Document the design and the blast-radius rationale.
2. **Harden identity:** eliminate root/management credential use (MFA, locked away), remove long-lived keys, implement least-privilege roles with boundaries, and enforce MFA everywhere including programmatic paths where possible.
3. **Deploy CSPM:** enable continuous posture checks mapped to CIS benchmarks; auto-remediate safe cases (e.g., unencrypted new buckets); ticket the rest with SLAs by severity.
4. **Build detective controls:** immutable control-plane logging, alerts on high-risk API calls, anomaly detection tuned to your baselines, all feeding the SIEM/SOC with runbooks.
5. **Protect data:** encryption standards, backup/restore testing, public-exposure monitoring (buckets, snapshots, AMIs), and data-lifecycle enforcement.
6. **Operate and review:** quarterly access reviews of cloud IAM, annual architecture review, game-day exercises for cloud incidents, and cost-aware security (alert on expensive anomalies too).

### Quick wins

- Lock down root/management accounts with MFA and alerting today
- Delete access keys older than 90 days; alert on any key older than that going forward
- Enable preventive guardrails blocking public storage buckets

### Sustaining the practice

- Review CSPM findings weekly; track mean-time-to-remediate by severity
- Re-certify cloud IAM permissions quarterly — privilege accumulates fast in cloud
- Test backup restores and incident runbooks with cloud game days
- Audit tagging compliance monthly; untagged resources get flagged or quarantined

### Metrics that prove it works

- CSPM critical/high finding count trend and MTTR
- % workloads using workload identity vs static credentials
- Control-plane log completeness (all accounts/regions shipping)
- Cloud IAM wildcard-permission count trending down

## Common pitfalls

- **Root account negligence.** Cloud root without MFA and alerting is the single worst cloud misconfiguration. Lock it down on day one.
- **Long-lived access keys.** Keys created in 2019 still active in 2026. Rotate aggressively, prefer roles, alert on old keys.
- **Public storage by default.** The classic breach pattern. Preventive guardrails blocking public buckets beat detective alerts about them.
- **Logging disabled for cost.** Disabling control-plane logs to save money blinds incident response. It is the worst possible saving.
- **Single-account sprawl.** Everything in one account means one compromise is total compromise. Separate early.
- **Assuming the provider handles it.** The shared-responsibility line runs through IAM, data, and configuration — the customer's side is where breaches happen.
- **Untagged shadow resources.** Resources nobody owns cannot be secured, patched, or decommissioned. Enforce tagging at creation.
- **No cloud IR plan.** Cloud incidents need cloud-specific runbooks (key revocation, snapshot isolation, log preservation). On-prem playbooks do not translate directly.
- **Console-only administration.** ClickOps leaves no audit trail of intent and drifts from IaC. Manage cloud through versioned infrastructure-as-code with peer review.
- **Ignoring cost anomalies.** A sudden spend spike can indicate cryptomining from a compromise. Cost monitoring is a security control.
