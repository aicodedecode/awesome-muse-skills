---
name: vpn-pro
description: Use VPNs correctly: when they help, when they don't, protocol and provider choice, and safe configuration. Use when setting up a VPN or deciding whether you need one.
category: productivity
---

# VPN Pro

## Overview

A VPN encrypts traffic between your device and the VPN server, hiding it from local networks and changing your apparent location.

What it does: protects on untrusted Wi-Fi, defeats local censorship/surveillance, bypasses geo-blocks. What it doesn't: make you anonymous, replace HTTPS, or protect from malware.

Choosing and configuring correctly matters more than simply 'having a VPN on.'

## When to use

- Deciding whether a VPN is worth it for your situation
- Choosing a VPN provider (or self-hosting)
- Securing work on public/untrusted Wi-Fi
- Accessing region-restricted content or bypassing censorship
- Setting up VPN on routers, phones, and computers

## Core concepts

- **Threat model first.**
  Coffee-shop snooping? ISP tracking? Geo-blocks? Censorship? Different threats need different tools — a VPN isn't always the answer.
- **Trust shift.**
  A VPN moves trust from your ISP/local network to the VPN provider. Choose providers with audited no-logs policies, not just marketing claims.
- **Protocols.**
  WireGuard: modern, fast, lean. OpenVPN: battle-tested, widely supported. Avoid PPTP/L2TP (obsolete/weak). IKEv2 good for mobile roaming.
- **Kill switch.**
  Blocks all traffic if the VPN drops. Essential — without it, a dropped connection silently exposes you. Enable on every device.
- **DNS leaks.**
  VPN must handle DNS or queries leak to the ISP, defeating the purpose. Test for leaks after setup; use provider DNS.
- **Jurisdiction matters.**
  Provider's legal home determines data demands. Prefer jurisdictions with strong privacy protections and no mandatory retention.
- **Self-hosting option.**
  A VPS running WireGuard gives full control and a static IP. But: single location, your VPS host sees traffic, and it's tied to your identity.
- **HTTPS already encrypts.**
  Most web traffic is HTTPS-encrypted anyway. VPN adds location-hiding and local-network protection — understand the marginal gain.

## Practical workflow

1. **Define your threat model.**
   Write down what you're protecting from whom. This determines provider choice, protocol, and whether a VPN suffices.
2. **Choose a provider carefully.**
   Audited no-logs, WireGuard support, kill switch on all platforms, transparent ownership, jurisdiction check. Trial before annual plans.
3. **Enable kill switch.**
   On every device, before first real use. Test it: drop the VPN, confirm traffic stops.
4. **Test for leaks.**
   IP, DNS, and WebRTC leak tests after setup and after updates. Leaks are silent — verify, don't assume.
5. **Configure all devices.**
   Phone, laptop, tablet — and consider router-level for IoT/TV. Partial coverage is partial protection.
6. **Use split tunneling deliberately.**
   Route only what needs the VPN (banking, sensitive) if full-tunnel breaks local services. Decide per app, consciously.
7. **Keep software updated.**
   VPN clients have had serious vulnerabilities. Auto-update; don't run a 2-year-old client.
8. **Know the limits.**
   VPN doesn't stop tracking cookies, fingerprinting, malware, or phishing. Pair with good browser hygiene and a password manager.

## Common pitfalls

- **VPN = total anonymity.**
  The provider sees everything your ISP used to see. Against targeted surveillance, a commercial VPN is a speed bump, not a shield.
- **Free VPNs.**
  Running servers costs money; free VPNs monetize somehow — usually your data. If you're not paying, you're the product.
- **No kill switch.**
  Connection drops on hotel Wi-Fi, traffic continues exposed. The kill switch is not optional.
- **Ignoring DNS leaks.**
  Encrypted tunnel, plaintext DNS to the ISP. Test after every setup and major update.
- **Geo-block whack-a-mole.**
  Streaming services actively block VPN IPs. Expect cat-and-mouse; no provider guarantees every service forever.
- **One device protected.**
  Laptop on VPN, phone leaking on the same hotel Wi-Fi. Cover every device or accept the gap consciously.
- **Torrenting assumptions.**
  Not all providers allow P2P; some log. Check policy explicitly if relevant — and know your local laws.
- **Set-and-forget config.**
  Protocols and clients age. Review provider audits yearly; re-test leaks after updates.
