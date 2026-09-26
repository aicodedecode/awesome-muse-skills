---
name: 1password-pro
description: Master 1Password: vaults, Watchtower, passkeys, SSH agent, CLI, and family/team administration. Use when getting full value from 1Password personally or administering it for others.
category: productivity
---

# 1Password Pro

## Overview

1Password is a full-featured password manager: encrypted vaults, Watchtower security auditing, passkey support, and deep OS/browser integration.

Beyond passwords: secure notes, documents, credit cards, identities, SSH keys, and developer tooling (CLI, SSH agent, secrets automation).

Pro usage means organized vaults, Watchtower at zero issues, passkeys adopted, and the CLI/SSH features working for developers.

## When to use

- Setting up 1Password for personal or family use
- Organizing many vaults, items, and shared credentials
- Using Watchtower to eliminate weak/reused/compromised passwords
- Adopting passkeys and the SSH agent
- Administering 1Password for a team or business
- Automating secrets with the 1Password CLI

## Core concepts

- **Vault organization.**
  Separate vaults: Personal, Family/Shared, Work, plus per-project or per-client as needed. Sharing happens at vault level — design accordingly.
- **Watchtower.**
  Continuous audit: weak, reused, compromised, expiring passwords, unsecured sites, missing 2FA. Goal: zero actionable issues.
- **Item types.**
  Logins, secure notes, credit cards, identities, documents, API credentials, SSH keys. Use the right type — structured data beats notes.
- **Passkeys.**
  Create and sync passkeys in 1Password. Phishing-resistant, cross-device. Prefer passkeys over passwords wherever offered.
- **SSH agent.**
  1Password as SSH agent: keys stored securely, biometric approval per use. Replaces scattered ~/.ssh key management.
- **CLI (op).**
  Script secrets into dev workflows: inject into env, CI/CD, local dev. Secrets stay in the vault, never in repos or chat.
- **Tags and collections.**
  Tags for cross-vault views (e.g., 'finance', 'client-x'); collections to scope work vs. personal. Find anything in seconds.
- **Emergency Kit.**
  The PDF with sign-in address, email, and Secret Key. Printed, stored physically secure. Account recovery depends on it.

## Practical workflow

1. **Set up account properly.**
   Strong account password (memorized passphrase), Emergency Kit printed and stored, biometrics enabled on devices.
2. **Organize vaults.**
   Personal / Shared / Work minimum. Move items from the default vault; sharing = vault membership, so structure for it.
3. **Run Watchtower to zero.**
   Fix weak, reused, compromised passwords systematically. Start with email, financial, and cloud accounts.
4. **Adopt passkeys.**
   For each supporting site: create passkey in 1Password, verify login works, keep password as fallback initially.
5. **Configure SSH agent.**
   Move SSH keys into 1Password, enable agent, update configs. Biometric approval per use; no more unencrypted keys on disk.
6. **Set up the CLI.**
   Install `op`, authenticate, practice injecting secrets into a dev script. Document team patterns for shared secrets.
7. **Organize with tags.**
   Apply consistent tags; set up collections separating work/personal contexts.
8. **Onboard family/team.**
   Family: shared vault + individual vaults + recovery setup. Team: groups, vault permissions, onboarding/offboarding checklist.

## Common pitfalls

- **One giant vault.**
  Everything in Personal shared awkwardly. Vaults are the sharing boundary — organize for how you share.
- **Ignoring Watchtower.**
  Paying for auditing and never opening it. Monthly Watchtower review; zero actionable issues is the goal.
- **Emergency Kit lost.**
  No Kit = no recovery if you forget the password. Print it, store it like a passport.
- **SSH keys still on disk.**
  Using 1Password but leaving old keys in ~/.ssh. Migrate fully or the old keys are the weak link.
- **Secrets in repos.**
  API keys in code or .env committed. The CLI exists precisely to end this — inject at runtime.
- **Over-sharing vaults.**
  Sharing a vault with 200 items when someone needs 5. Least privilege: separate vaults per sharing need.
- **No biometric setup.**
  Typing the full password 50x daily trains weak-password temptation. Biometrics for daily, password memorized for recovery.
- **Forgetting the Secret Key.**
  The 128-bit Secret Key is half your encryption. It's in the Emergency Kit — which is why the Kit matters.
