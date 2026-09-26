---
name: voice-ai-pro
description: Build voice features: speech-to-text, text-to-speech, streaming transcription, voice agents, and telephony pipelines. Use when adding speech interfaces to apps.
category: development
---

# Voice AI Pro

A builder's guide to speech technology: speech-to-text (STT), text-to-speech (TTS), real-time voice agents, and telephony. Covers the pipeline architecture, latency budgets, and the UX details that separate usable voice products from demos.

## Overview

A voice pipeline is a chain: **capture → voice activity detection → STT → intelligence (LLM/dialog) → TTS → playback**. End-to-end latency is the product metric that matters most — every 500ms of delay makes conversation feel broken. The architecture trick is streaming and overlap: start transcribing before the user finishes, start synthesizing before the LLM finishes, play audio while generating the rest.

## When to use

- Transcribing meetings, calls, or audio files (batch or streaming).
- Adding TTS voiceovers to content or apps.
- Building conversational voice agents (support lines, IVR replacement).
- Wake-word / push-to-talk interfaces.
- Speaker diarization ("who said what") for multi-speaker audio.

## Core concepts

- **STT (speech-to-text).** Batch models for files (highest accuracy); streaming models for live audio (partial results, lower latency). Word-level timestamps enable captions and search.
- **VAD (voice activity detection).** Detects speech vs silence/noise. Drives endpointing (when the user is "done") and saves compute by skipping silence.
- **Endpointing.** Deciding the user finished speaking. Too aggressive = interruptions; too lax = awkward pauses. Tune silence thresholds per use case (300–800ms typical).
- **TTS.** Neural voices, near-human quality. Control via SSML (pauses, emphasis, pronunciation) or plain text. Voice cloning exists — treat as consent-gated.
- **Barge-in.** Letting the user interrupt the agent mid-speech. Requires echo cancellation and fast pipeline teardown; without it, voice agents feel like bad IVR.
- **Diarization.** Assigning transcript segments to speakers. Accuracy drops with overlapping speech and similar voices.
- **Telephony.** SIP trunks / CPaaS providers bridge phone calls to your pipeline (typically via WebSocket media streams, 8kHz μ-law audio).
- **Duplex architecture.** Full-duplex (user and agent can speak simultaneously, like a phone call) vs half-duplex (walkie-talkie turns). Full-duplex needs barge-in + echo cancellation.

## Practical workflow

**1. Choose the pipeline shape.**
- Transcription feature → batch STT API, store transcript + timestamps.
- Live captions → streaming STT with partial results.
- Voice agent → streaming STT + LLM + streaming TTS, all overlapped.

**2. Set the latency budget.** Work backwards from a target (e.g., <1.2s user-stops-speaking to agent-starts-speaking): VAD/endpointing ~300ms, STT final ~200ms, LLM first token ~400ms, TTS first audio ~300ms. Measure each stage separately.

**3. Stream everything.**
```
mic → VAD → streaming STT (partials) → on endpoint: final transcript
final transcript → LLM (stream tokens) → sentence buffer → TTS (stream audio) → playback
```
Start TTS on the first complete sentence, not the full response. Play while generating.

**4. Handle the messy middle.** Partial transcripts will revise themselves — display them as provisional. Handle filler ("um"), restarts, and background noise with VAD tuning and noise suppression.

**5. Telephony integration.** Receive call via SIP/WebSocket, decode μ-law to PCM, run the pipeline, encode back. Test with real phone audio (8kHz, compressed) — lab-mic quality lies.

**6. Consent and disclosure.** Inform callers they're speaking to an AI; get explicit consent for recording where law requires (two-party consent jurisdictions).

## Common pitfalls

- **Latency death by sequential design.** Waiting for full STT → full LLM → full TTS before playing anything yields 4–6s pauses. Overlap stages.
- **No barge-in.** Users will talk over the agent; without interruption handling they must wait through every prompt.
- **Endpointing mistuned.** Cutting users off mid-thought (too fast) or long dead air (too slow) — tune per population, and use semantic endpointing (LLM judges completeness) for complex queries.
- **Echo/feedback.** Speaker audio re-entering the mic creates loops. Use echo cancellation (AEC) on devices, headsets in testing.
- **Voice cloning without consent.** Cloning a real person's voice — especially without explicit permission — is legally radioactive and banned by most TTS providers' terms. Use licensed/stock voices.
- **Ignoring audio quality.** 8kHz phone audio, car noise, accents — test on the actual channel, not clean studio recordings. Accuracy numbers from benchmarks won't match your users.
- **No fallback for STT failures.** Silence, unintelligible audio, or API errors need graceful handling ("I didn't catch that — could you repeat?") not crashes.
- **Cost per minute.** Streaming STT + LLM + TTS compounds; a 10-minute call can cost dollars. Monitor, set session caps, and consider smaller models for the dialog layer.
