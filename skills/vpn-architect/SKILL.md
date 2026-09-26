---
name: vpn-architect
description: Design secure remote-access VPN architecture — protocol choice, authentication, segmentation, and migration to zero-trust access.
category: security
---

## Overview

VPNs extend the trusted network to remote users and sites — which is exactly why their security posture matters so much: a VPN concentrator is one of the most attacked assets in any estate, and a compromised VPN credential historically meant broad network access. Modern practice hardens traditional VPNs while migrating toward zero-trust network access (ZTNA) where it fits.

This skill covers defensive VPN architecture: protocol and product selection, strong authentication, segmentation, logging, and the pragmatic path toward ZTNA.

VPN architecture sits at an awkward transition: still essential for many use cases, increasingly supplemented by zero-trust access. The pragmatic stance is to harden what you have while deliberately migrating what you can — running a neglected VPN 'until we do zero trust someday' is how appliances become the initial-access vector in someone else's incident report.

## When to use

- Designing or replacing remote-access VPN for a hybrid/remote workforce.
- Hardening an existing VPN (patches, MFA, config review) after incidents or audit findings.
- Segmenting VPN users so a compromised endpoint does not mean the whole network.
- Evaluating ZTNA as a VPN complement or replacement.

## Core concepts

- **The VPN is a high-value target:** internet-facing, authentication-bearing, and historically vulnerability-prone. Patch aggressively, monitor auth logs, and treat it as crown-jewel infrastructure.
- **Protocols:** WireGuard and IKEv2/IPsec are the modern defaults (strong crypto, good performance); OpenVPN remains solid; avoid PPTP/L2TP-with-PSK and SSL-VPN products with poor patch histories unless risk-accepted.
- **Authentication:** MFA mandatory, ideally phishing-resistant; machine certificates plus user auth for managed devices; no split-tunnel exceptions without justification.
- **Least-privilege network access:** VPN users should reach only what their role needs — per-group ACLs, segmented zones — not "the whole corporate LAN." Full-tunnel by default for managed devices.
- **Logging:** authentication attempts, session start/stop, bytes transferred, and endpoint posture — shipped to the SIEM with alerts on anomalies (impossible travel, off-hours admin access).
- **ZTNA direction:** identity- and device-aware per-application access instead of network-level tunnels. Evaluate for new deployments; migrate high-risk use cases first.

- **Always-on VPN for managed devices.** Removes the user decision entirely — the device is either connected and protected or it is not on the network. Pair with device compliance checks.
- **Endpoint posture before access.** Require disk encryption, OS patch level, and EDR presence as VPN admission criteria — a compromised endpoint should not get a tunnel.
- **Split tunneling governance.** Every split-tunnel exception needs a documented business reason and periodic review; default-deny the bypass, not the tunnel.

## Practical workflow

1. **Define access requirements:** who connects (employees, contractors, admins), from what devices, to which resources. This drives segmentation and auth design.
2. **Select and harden the platform:** current, supported software; hardened config (strong ciphers, no legacy protocols); management interface not internet-exposed; tested backup/failover.
3. **Enforce strong auth:** MFA for all users; certificates for managed devices; lockout and rate-limiting on auth; disable or tightly control any legacy auth methods.
4. **Segment:** role-based access groups mapped to firewall zones; admins get a separate, more restricted path; contractors get time-boxed, resource-scoped access.
5. **Monitor:** SIEM alerts for brute force, impossible travel, concurrent sessions, and new-device enrollments; quarterly access reviews of VPN entitlements.
6. **Plan the ZTNA path:** pilot ZTNA for a high-risk app or contractor population; measure user experience and security outcomes; expand where it wins, keep VPN where tunnels are genuinely needed (site-to-site, legacy).

### VPN hardening checklist

- [ ] Patched to current; management interface not internet-facing
- [ ] MFA enforced for all users; weak auth methods disabled
- [ ] Strong protocols/ciphers only; legacy protocols removed
- [ ] Role-based segmentation; no flat "VPN = LAN" access
- [ ] Full-tunnel default for managed devices; split-tunnel justified and reviewed
- [ ] Auth and session logging to SIEM with anomaly alerts
- [ ] Quarterly entitlement reviews; contractor access time-boxed

### Sustaining the practice

- Review VPN access entitlements quarterly alongside all privileged access
- Track appliance vulnerabilities as P1 patch items with dedicated SLAs
- Measure ZTNA pilot outcomes to build the migration business case
- Audit split-tunnel exceptions annually — they accumulate silently

### Metrics that prove it works

- Patch latency on VPN appliances (days from vendor release)
- MFA enforcement coverage % of VPN users
- Authentication-anomaly alerts triaged within SLA
- % of remote access migrated to ZTNA (where targeted)

## Common pitfalls

- **Unpatched VPN appliances.** VPN vulnerabilities are routinely exploited within days of disclosure. Patch like your network depends on it — it does.
- **Flat access.** VPN into the whole LAN turns one phished credential into a network-wide incident. Segment by role.
- **MFA gaps.** "MFA except for these legacy clients" is the hole attackers find. Close it or document and mitigate the risk explicitly.
- **Split-tunnel sprawl.** Convenience split tunneling exposes the endpoint to the open internet while connected. Default to full tunnel; exception with justification.
- **No session monitoring.** Authentication without anomaly detection misses credential-reuse and session-hijack patterns.
- **Treating VPN as the forever answer.** For app-level remote access, ZTNA usually offers better least-privilege and UX. Reassess periodically.
- **Site-to-site VPNs forgotten in reviews.** Everyone hardens remote-access VPN; the decade-old site-to-site tunnels with static PSKs get ignored. Inventory them too.
- **Vendor-default credentials on appliances.** Still found in real estates. Change them during deployment and verify in audits.
- **Contractor VPN accounts that never expire.** Time-box every non-employee account at creation; expiry should be automatic, renewal deliberate.
- **No bandwidth or session anomaly monitoring.** Data exfiltration over VPN looks like normal traffic without baselines. Monitor session patterns, not just logins.
