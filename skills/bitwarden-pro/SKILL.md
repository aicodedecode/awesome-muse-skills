---
name: bitwarden-pro
description: Master Bitwarden: vaults, collections, self-hosting options, CLI, and organization administration. Use when using Bitwarden personally or running it for a team, including self-hosted setups.
category: productivity
---

# Bitwarden Pro

## Overview

Bitwarden is an open-source password manager: audited, cross-platform, with a generous free tier and affordable premium/family plans.

Strengths: transparency (open source), self-hosting option, organizations with collections, CLI, and full feature parity across platforms.

Pro usage: organized vaults + collections, all reports clean, passkeys adopted, and (for teams) well-administered organizations.

## When to use

- Setting up Bitwarden for personal or family use
- Migrating to Bitwarden from another manager
- Considering self-hosting (Vaultwarden/official) for control
- Administering a Bitwarden organization for a team
- Using the Bitwarden CLI in scripts and automation

## Core concepts

- **Open-source transparency.**
  Code is public and audited. You can verify claims rather than trust marketing — the core reason many choose Bitwarden.
- **Vault + organizations.**
  Personal vault plus organization vaults with collections (e.g., Engineering, Finance). Sharing via collections with role-based access.
- **Reports.**
  Exposed, reused, weak, unsecured-website, and inactive-2FA reports. The cleanup dashboard — run to zero.
- **Passkeys.**
  Store and sync passkeys in Bitwarden. Same phishing-resistant benefits, inside your existing vault.
- **Self-hosting option.**
  Official server or lightweight Vaultwarden for full data control. Trade-off: you own backups, updates, and availability.
- **CLI (bw).**
  Script vault access: CI/CD secrets, server provisioning, bulk operations. Serve mode for local API access.
- **Emergency access.**
  Grant trusted contacts view/takeover with configurable wait period. Set it up before you need it.
- **File attachments.**
  Encrypted attachments on items (premium). Store key files, certificates, recovery codes alongside credentials.

## Practical workflow

1. **Create account securely.**
   Strong master passphrase, 2FA on the Bitwarden account itself (authenticator or security key), emergency sheet stored physically.
2. **Import existing passwords.**
   Import from browser or old manager, then immediately change the master approach: unique passwords everywhere.
3. **Organize vault.**
   Folders for personal; organizations + collections for shared. Design collections around who needs what.
4. **Run reports to zero.**
   Fix exposed/reused/weak passwords, starting with email, bank, cloud. This is the highest-value hour in the setup.
5. **Enable 2FA everywhere.**
   TOTP in Bitwarden for convenience; security keys for the Bitwarden account and email.
6. **Adopt passkeys.**
   Create passkeys in Bitwarden where offered; verify cross-device sync works.
7. **Set up emergency access.**
   One trusted contact minimum, tested understanding of the process.
8. **Evaluate self-hosting honestly.**
   Self-host only if you'll maintain backups, updates, and uptime. Otherwise the official cloud is the safer choice.

## Common pitfalls

- **Weak master password.**
  Open-source doesn't help if the master passphrase is 'Summer2024!'. Long random-word passphrase, memorized.
- **No 2FA on Bitwarden itself.**
  The vault holding everything protected by password alone. Authenticator or security key, mandatory.
- **Self-hosting without maintenance.**
  A neglected self-hosted server is worse than the cloud: unpatched, unbacked-up. Host only with an ops plan.
- **Ignoring reports.**
  Free auditing unused. Monthly report review keeps the vault healthy.
- **Sharing via copy-paste.**
  Organizations and collections exist for sharing. Credentials in chat defeat the purpose.
- **Attachments for everything.**
  Storing huge files in the vault bloats sync. Attachments for key documents; files belong in encrypted storage.
- **No emergency access.**
  Sole admin with no recovery path. Configure it on day one, not during a crisis.
- **CLI secrets in shell history.**
  Using `bw` with passwords in command lines leaks to history. Use env vars, stdin, or the serve API properly.
