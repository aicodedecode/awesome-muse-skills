---
name: password-manager
description: Use a password manager correctly: setup, strong unique passwords, 2FA, passkeys, sharing, and emergency access. Use when securing accounts or helping others adopt a password manager.
category: productivity
---

# Password Manager

## Overview

A password manager is the single highest-ROI security tool: unique random passwords everywhere, one strong master password to remember.

It solves the real problem — password reuse across breaches — not the imaginary one of 'hackers guessing.'

Correct usage: generator for every password, 2FA codes inside, passkeys where offered, secure sharing, emergency access configured.

## When to use

- Setting up a password manager for the first time
- Cleaning up password reuse across accounts
- Adding two-factor authentication to important accounts
- Adopting passkeys alongside passwords
- Setting up family or team password sharing
- Planning emergency access to your accounts

## Core concepts

- **Unique passwords everywhere.**
  Every site gets its own random 20+ character password. Breach of one site can't cascade to others. Non-negotiable.
- **The master password.**
  One long, memorable passphrase (4-6 random words). This is the only password you memorize. Make it strong; it's the keys to the kingdom.
- **Generator defaults.**
  Max length, all character types, per-site. Never hand-craft passwords — humans are predictable, generators aren't.
- **2FA in the manager.**
  Store TOTP codes in the manager for convenience, but keep critical accounts (email, manager itself) on a separate authenticator.
- **Passkeys.**
  Adopt where offered: phishing-resistant, no password to steal. Manager-stored passkeys sync across devices.
- **Breach monitoring.**
  Enable breach alerts. When a service you use is breached: change that password immediately (it's unique, so damage is contained).
- **Secure sharing.**
  Share credentials through the manager's sharing — never email, chat, or sticky notes. Revoke when access ends.
- **Emergency access.**
  Designate a trusted person with delayed-access recovery. Without this, your accounts die with your memory.

## Practical workflow

1. **Choose a reputable manager.**
   Open-source audited or well-established commercial. Criteria: zero-knowledge encryption, cross-platform, passkey support.
2. **Create the master passphrase.**
   Long, random-word passphrase, written down and stored physically secure until memorized. Enable biometrics for daily unlock.
3. **Import and audit.**
   Import browser-saved passwords, then run the security audit: reused, weak, and breached passwords flagged.
4. **Fix the critical ten.**
   Email, bank, password manager, cloud, social: unique passwords + 2FA first. These ten accounts are 90% of your risk.
5. **Roll through the rest.**
   Change remaining passwords as you log in naturally. Aim for full coverage in 1-2 months, not one exhausting weekend.
6. **Enable 2FA everywhere offered.**
   Authenticator app or manager TOTP; prefer passkeys/security keys for high-value accounts.
7. **Set up sharing.**
   Family vault for shared accounts (streaming, utilities); team vaults for work with least-privilege access.
8. **Configure emergency access.**
   Trusted contact with time-delayed access. Document the plan where they'll find it.

## Common pitfalls

- **Reusing passwords.**
  The #1 real-world risk. One breach + reuse = every account compromised. Unique everywhere, no exceptions.
- **Weak master password.**
  'Password123!' protecting 300 accounts. The master passphrase must be long — it's the single point of failure.
- **Storing 2FA with passwords.**
  TOTP in the same manager as passwords removes the 'second factor' for a manager breach. Separate critical ones.
- **Browser-only saving.**
  Browser password stores lack the generator discipline, auditing, and cross-browser portability. Use a real manager.
- **Sharing via email/chat.**
  Credentials in plaintext chat logs live forever. Always share through the manager's encrypted sharing.
- **No emergency plan.**
  Sole keeper of family accounts with no recovery path. Emergency access isn't morbid; it's responsible.
- **Ignoring breach alerts.**
  Alerts without action are theater. Breach on a unique password = 5-minute fix. That's the payoff of the system.
- **Same password + 2FA complacency.**
  'I have 2FA so reuse is fine.' 2FA helps; unique passwords are still required. Defense in depth, not either/or.
