---
name: solidity-pro
description: Write secure, gas-efficient Solidity smart contracts for EVM chains: tokens, vaults, access control, upgrade patterns, testing and audit checklists. Use when developing or reviewing on-chain contracts.
category: development
---

# Solidity Pro

A field guide to writing Solidity contracts that are correct first and cheap second: secure defaults, gas-aware patterns, thorough testing, and a pre-deploy audit checklist. Covers ERC-20/721/1155 tokens, vaults, access control, and proxy upgrades.

## Overview

Solidity runs on the EVM where every storage write costs gas, code is immutable once deployed (unless proxied), and bugs can lock or drain real funds. The discipline that matters most is **defensive design**: assume every external call is hostile, every input is adversarial, and every privileged function will be probed.

Two invariants cover most vulnerabilities:
1. **Checks-Effects-Interactions** — validate, update your own state, then call out.
2. **Least privilege** — no function is more powerful than it needs to be.

## When to use

- Writing ERC-20, ERC-721, or ERC-1155 tokens and NFT contracts.
- Building vaults, staking, vesting, escrow, or simple DeFi primitives.
- Adding role-based access control (owner, minter, pauser).
- Reviewing someone else's contract before integration or audit.
- Choosing upgradeability (proxies) vs immutable deployment.
- Estimating and optimizing gas for high-frequency functions.

## Core concepts

- **Data locations.** `storage` (persistent, expensive), `memory` (temporary, cheap), `calldata` (read-only inputs, cheapest). Mark function parameters `calldata` when you only read them.
- **Visibility.** `external` > `public` > `internal` > `private`. Default to the most restrictive that works.
- **Custom errors.** `error InsufficientBalance(uint256 have, uint256 need);` + `revert` is cheaper than `require` strings and carries data.
- **Fixed pragma.** `pragma solidity 0.8.24;` — floating pragmas (`^0.8.0`) let the compiler version drift between test and deploy.
- **Reentrancy guards.** A `nonReentrant` modifier (or CEI pattern) on any function that sends ETH/tokens or calls untrusted contracts.
- **Pull over push.** Let recipients withdraw funds (`claim()`) instead of pushing to many addresses in one transaction — avoids griefing via a single failing recipient and unbounded loops.
- **Events.** Emit an event for every state-changing action. Events are the contract's audit trail and how indexers track history.
- **Proxies.** UUPS or Transparent proxies enable upgrades but add trust assumptions: protect the `initialize` function (no constructors), and keep storage layout append-only across upgrades.
- **Oracle caution.** Never use on-chain spot prices from a single DEX pool as truth — they are manipulable within one block. Use time-weighted or multi-source feeds.

## Practical workflow

**1. Scaffold and pin the toolchain**
```bash
forge init my-protocol && cd my-protocol
# pin solc in foundry.toml, e.g. solc_version = "0.8.24"
```

**2. Write the contract with secure defaults**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is Ownable, ReentrancyGuard {
    mapping(address => uint256) public balances;

    error ZeroAmount();
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    function deposit() external payable nonReentrant {
        if (msg.value == 0) revert ZeroAmount();
        balances[msg.sender] += msg.value;   // effects first
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0 || amount > balances[msg.sender]) revert ZeroAmount();
        balances[msg.sender] -= amount;       // effects...
        (bool ok, ) = msg.sender.call{value: amount}(""); // ...then interaction
        require(ok, "transfer failed");
        emit Withdrawn(msg.sender, amount);
    }
}
```

**3. Test like an attacker.** Unit tests for happy paths, then fuzzing (`forge test --fuzz`) with invariants: "sum of balances == contract balance" must hold across random call sequences.

**4. Static analysis.** Run Slither (or equivalent) and address every finding — even informational ones deserve a written reason for dismissal.

**5. Gas snapshot.** `forge snapshot` before and after changes; a sudden jump in a hot function is a regression.

**6. Deploy script + verify.** Deploy from a script (not a manual console), verify source on the block explorer immediately, and transfer ownership to a multisig.

## Common pitfalls

- **Reentrancy.** The classic. Any external call before state updates is suspect — use CEI + guards, and remember `transfer`/`send` are not safe assumptions anymore; prefer `call` with a guard.
- **`tx.origin` for auth.** Phishable — an attacker contract can trick a user into calling it. Use `msg.sender`.
- **Unprotected initializers.** Proxy contracts must call `initialize` exactly once; an unprotected initializer lets anyone seize ownership.
- **Storage collisions in upgrades.** Never reorder or remove storage variables in an upgradeable contract; only append.
- **Unchecked return values.** Low-level `.call` returns `(bool, bytes)` — ignoring the bool silently swallows failures.
- **Block timestamp dependence.** Miners can skew `block.timestamp` by seconds; fine for vesting cliffs, fatal for randomness or tight deadlines.
- **DoS via unbounded loops.** Iterating over user-controlled arrays can exceed block gas limits and brick the function. Paginate or use pull patterns.
- **Missing access control on sensitive functions.** Every `mint`, `pause`, `setFee`, `upgrade` needs a role check. Grep for `external`/`public` state-changers without modifiers before every deploy.
- **Copy-pasted math.** Prefer audited libraries (OpenZeppelin, Solmate-style fixed-point) over hand-rolled arithmetic.
