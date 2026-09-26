---
name: web3-pro
description: Build dApps on EVM chains: wallet connection, providers and signers, contract reads/writes, gas estimation, events, and chain handling. Use when a frontend needs to talk to a blockchain.
category: development
---

# Web3 Pro

A practical playbook for building decentralized apps (dApps) on EVM-compatible chains: connecting wallets, reading and writing contract state, estimating gas, listening to events, and handling multiple networks — from any JavaScript/TypeScript frontend.

## Overview

A dApp frontend talks to a blockchain through an RPC endpoint using a wallet as the user's signing device. The mental model has three layers:

1. **Provider** — read-only connection to a chain (RPC URL + chain ID).
2. **Signer** — a wallet account authorized to sign transactions and messages.
3. **Contract** — an ABI plus address that turns blockchain state into typed function calls.

Most production bugs come from confusing these layers: doing reads through a signer (slow, prompts the user), sending writes through a provider (impossible), or assuming the user is on the right chain.

## When to use

- Adding "Connect Wallet" to a web app (EIP-1193 injected providers like browser wallets, or WalletConnect for mobile).
- Reading token balances, NFT ownership, or any contract view function.
- Sending transactions: transfers, approvals, contract calls.
- Listening to on-chain events to update UI in real time.
- Supporting multiple chains (mainnet, L2s, testnets) with chain switching.
- Signing messages for off-chain login (SIWE-style "Sign-In with Ethereum").

## Core concepts

- **EIP-1193 providers.** Browser wallets inject `window.ethereum`. Request accounts with `eth_requestAccounts`; always handle user rejection (`4001`) gracefully.
- **Chain ID.** Every network has one (1 = Ethereum mainnet, 137 = Polygon, 8453 = Base, 42161 = Arbitrum). Verify `eth_chainId` before sending anything.
- **Decimals.** Tokens store integer amounts; display divides by `10^decimals` (usually 18). Use big-number math — never floats — for amounts.
- **Gas.** Every write costs gas = `gasUsed × gasPrice`. Always `estimateGas` first; surface failures to the user before they sign.
- **ABIs.** The JSON interface of a contract. You only need the functions you call — a minimal ABI is fine and keeps bundles small.
- **Events/logs.** Contracts emit events; index them for history (transfers, mints). For real-time UI, subscribe via websocket provider.
- **Approvals.** ERC-20 `approve` grants a spender an allowance. Prefer approving exact amounts over unlimited allowances; many wallets now support permit (EIP-2612) signatures to skip the approval tx.
- **Testnets & faucets.** Develop on Sepolia or a local node (Anvil/Hardhat network) — never test with real funds.

## Practical workflow

**1. Connect the wallet**
```ts
// Detect provider, request accounts, get chain
const provider = new ethers.BrowserProvider(window.ethereum);
const accounts = await provider.send("eth_requestAccounts", []);
const network = await provider.getNetwork(); // check network.chainId
```
Handle: no provider installed → show install prompt; user rejects → stay disconnected, no error toast storm.

**2. Read contract state (no signature needed)**
```ts
const token = new ethers.Contract(address, ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"], provider);
const [raw, decimals] = await Promise.all([token.balanceOf(user), token.decimals()]);
const display = ethers.formatUnits(raw, decimals);
```

**3. Write: estimate, then send**
```ts
const signer = await provider.getSigner();
const contract = token.connect(signer);
const tx = await contract.populateTransaction.transfer(to, ethers.parseUnits("1.5", decimals));
const gas = await provider.estimateGas({ ...tx, from: await signer.getAddress() });
// show user the action + estimated fee, then:
const sent = await signer.sendTransaction({ ...tx, gasLimit: gas * 120n / 100n });
const receipt = await sent.wait(1); // wait for 1 confirmation
if (receipt.status !== 1) throw new Error("Transaction reverted");
```
The 20% gas buffer absorbs estimation drift; `receipt.status` is the only reliable success signal.

**4. Handle chain switching**
```ts
try {
  await provider.send("wallet_switchEthereumChain", [{ chainId: "0x89" }]);
} catch (e) {
  if (e.code === 4902) await provider.send("wallet_addEthereumChain", [chainParams]);
}
```

**5. React to account/chain changes.** Listen for `accountsChanged` and `chainChanged` and reset app state — stale signers are a top source of failed transactions.

## Common pitfalls

- **Private keys in frontend code.** Never. Signing happens in the wallet; the app never sees keys. Same for `.env` files shipped to the browser.
- **Float math on token amounts.** `0.1 + 0.2` bugs lose real money. BigInts / `parseUnits` / `formatUnits` only.
- **Skipping gas estimation.** A revert discovered after signing wastes the user's fee and trust. Estimate first, explain failures in plain language.
- **Assuming the chain.** Always check `chainId` before writes; a mainnet address on a testnet (or vice versa) silently targets the wrong network.
- **Unlimited approvals by default.** Request the minimum allowance the flow needs; offer "revoke" UX.
- **Nonce races.** Don't fire parallel transactions from one account without managing nonces — use sequential sends or a queue.
- **Trusting event data blindly.** Events are not access control; validate critical state with a fresh `eth_call`.
- **Phishing-shaped UX.** Never ask users to sign opaque hex or "eth_sign" raw messages; use typed data (EIP-712) so wallets show readable content.
