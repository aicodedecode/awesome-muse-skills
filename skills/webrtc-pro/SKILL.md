---
name: webrtc-pro
description: Build real-time audio/video with WebRTC: signaling, peer connections, media devices, and TURN infrastructure. Use for video calls and peer-to-peer media.
category: web-development
---

# WebRTC Pro

A practical guide to WebRTC: browser-to-browser real-time audio, video, and data — signaling, peer connections, NAT traversal (STUN/TURN), media handling, and the infrastructure decisions that determine whether calls actually connect.

## Overview

WebRTC enables **peer-to-peer** real-time communication in the browser: audio/video calls, screen sharing, and data channels — with encryption (DTLS-SRTP) built in. The catch: browsers can't find each other alone. You need **signaling** (your server exchanging session descriptions/ICE candidates) and **NAT traversal** (STUN to discover addresses, TURN to relay when direct fails). Media flows peer-to-peer; signaling and TURN are your infrastructure.

## When to use

- 1:1 or group video/voice calls.
- Screen sharing.
- Peer-to-peer data transfer (files, game state) via data channels.
- Live broadcasting with sub-second latency (WHIP/WHEP or custom).

## Core concepts

- **Signaling.** Your WebSocket/HTTP channel exchanging: offers/answers (SDP session descriptions) and ICE candidates. Not standardized — you design it. Keep it simple: `{ type: 'offer'|'answer'|'candidate', ... }`.
- **RTCPeerConnection.** The core object: `addTrack`/`createOffer` → set local/remote descriptions → ICE gathering → connected. One per peer (mesh) or per SFU uplink.
- **ICE.** Interactive Connectivity Establishment: tries host → STUN (server-reflexive) → TURN (relay) candidates, picks the best working path. Most failures are ICE failures.
- **STUN.** Discovers your public address (`stun:stun.l.google.com:19302` or your own). Cheap, stateless.
- **TURN.** Relays media when direct connection fails (symmetric NATs, restrictive firewalls). **You must run TURN** — without it, 10–30% of calls fail. Bandwidth costs money; budget it.
- **Media devices.** `getUserMedia({ video, audio })` — permission prompt; handle denial gracefully. `getDisplayMedia` for screen share. Device selection via `enumerateDevices`.
- **Data channels.** `createDataChannel` — low-latency peer-to-peer messaging (chat in calls, file transfer, game state). Ordered/reliable or unordered/unreliable modes.
- **Topologies.** Mesh (each peer connects to each — fine for ≤4), SFU (Selective Forwarding Unit server routes streams — the standard for groups), MCU (server mixes — heavy, legacy).

## Practical workflow

**1. Signaling flow (1:1).**
```
A: pc.createOffer() → setLocalDescription → send offer via signaling
B: receive offer → setRemoteDescription → createAnswer → setLocalDescription → send answer
A: receive answer → setRemoteDescription
Both: exchange ICE candidates as they trickle (onicecandidate → signaling → addIceCandidate)
```

**2. Basic setup.**
```js
const pc = new RTCPeerConnection({ iceServers: [
  { urls: 'stun:stun.example.com:3478' },
  { urls: 'turn:turn.example.com:3478', username: 'user', credential: 'pass' },
]});
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
stream.getTracks().forEach(t => pc.addTrack(t, stream));
pc.ontrack = (e) => { remoteVideo.srcObject = e.streams[0]; };
```

**3. TURN.** Deploy coturn (or managed TURN). Generate time-limited credentials server-side (don't hardcode). Test with TURN-only (block UDP/host candidates) to prove relay works.

**4. Call UX.** Pre-call device check (camera/mic preview + selection); in-call: mute, camera toggle, screen share, connection quality indicator; handle `iceconnectionstatechange` → "reconnecting..." UI → recovery or clean failure.

**5. Group calls.** Don't mesh beyond ~4. Use an SFU (LiveKit, Janus, mediasoup, or managed) — clients publish once, SFU forwards selectively.

## Common pitfalls

- **No TURN server.** "Works on my network" then fails for users behind corporate/symmetric NATs. TURN is mandatory infrastructure, not optional.
- **Hardcoded TURN credentials.** Long-lived credentials in client code get abused (bandwidth theft). Time-limited credentials minted server-side.
- **Mesh for groups.** 8-person mesh = 56 connections, everyone's uplink saturated. SFU for groups.
- **Ignoring ICE failures.** `iceConnectionState === 'failed'` needs restart (`pc.restartIce()`) or re-offer — not a silent dead call.
- **getUserMedia without fallback.** Permission denied / no devices = crash without handling. Graceful degradation (audio-only, or join muted).
- **Echo.** Open speakers + mic = feedback. Advise headsets; use `echoCancellation: true`; the browser helps but physics wins.
- **Signaling as an afterthought.** Dropped signaling messages = stuck calls. Reliable transport (WebSocket with reconnection) + message acks for critical signals.
- **No stats monitoring.** `pc.getStats()` reveals bitrate, packet loss, jitter — without it you're blind to quality issues. Monitor and adapt (degrade video before dropping audio).
- **Bandwidth blindness.** HD video × N participants costs real TURN/server bandwidth. Budget per concurrent user; consider simulcast (SFU sends appropriate quality per receiver).
- **Mobile battery/heat.** Sustained WebRTC on phones drains fast. Prefer audio-first defaults on mobile; pause video when backgrounded.
