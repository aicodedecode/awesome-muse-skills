---
name: subtitle-pro
description: Create accurate subtitles and captions with timing, formatting standards, SRT/VTT workflows, and QC.
category: video
---

## Overview

Subtitles expand reach (global audiences), accessibility (deaf/hard-of-hearing
viewers), and
retention (most social video is watched muted). Professional subtitling is a
craft: accurate
transcription, readable timing, proper formatting, and standards compliance
(SRT/VTT). This skill
covers creating, syncing, styling, and quality-checking subtitles.

## When to use

- Creating subtitles for YouTube, courses, or marketing videos

- Adding captions for accessibility compliance

- Translating content with subtitle files

- Fixing auto-generated captions

- Burning in subtitles vs delivering sidecar files

## Core concepts

- - - **Subtitles vs captions.** Subtitles = dialogue translation/transcription.
  Captions (closed
  captions) = dialogue + sound descriptions ([music], [laughter]) for
accessibility. Know which you
  need — accessibility compliance requires captions, not just subtitles.
- - - **Timing rules.** Minimum duration ~1 second, maximum ~7 seconds per cue.
  Reading speed: ~20
  characters/second (160-180 wpm) for adults. Cues should sync to speech —
appear as speaking
  starts, clear at natural pauses, never straddling a shot cut awkwardly.
- - - **Line discipline.** Max 2 lines per cue, ~42 characters per line. Break
  lines at natural phrase
  boundaries — never split a phrase awkwardly across lines. One idea per cue
where possible.
- - - **Format basics.** SRT: numbered cues with `HH:MM:SS,mmm` timestamps —
  universal, simple.
  WebVTT: like SRT but with styling/positioning for web players. ASS/SSA:
advanced styling (karaoke,
  positioning) for burned-in/enthusiast use.
- - - **Sidecar vs burned-in.** Sidecar files (SRT/VTT uploaded alongside) =
  toggleable, SEO-friendly,
  platform-preferred. Burned-in = always visible, necessary for some social
feeds, but unchangeable.
  Default to sidecar; burn in for platforms that need it.
- - - **Auto-captions need humans.** ASR gets you 80-90% there fast, but errors
  cluster in names,
  jargon, and homophones — exactly where accuracy matters most. Always review;
never ship raw
  auto-captions for professional work.

## Practical workflow

1. 1. 1. **Transcribe accurately.** Verbatim for captions (include false starts?
   usually cleaned
   lightly), speaker labels for multi-speaker content, sound descriptions in
brackets for captions.
   Get names and jargon right — ask the client for a term list.
2. 2. 2. **Time the cues.** Align to speech with ~100-200ms lead-in. Split long
   sentences into multiple
   cues at phrase boundaries. Ensure no overlaps and no gaps that flash cues.
3. 3. 3. **Format properly.** 1-2 lines, ≤42 chars/line, proper SRT/VTT syntax
   (validate with a linter
   — one malformed timestamp breaks the whole file). UTF-8 encoding for special
characters.
4. 4. 4. **Style deliberately.** For burned-in: readable font, adequate size for
   phone viewing,
   high-contrast (white text + black outline/shadow works on any background),
safe-area positioning
   (not under platform UI).
5. 5. 5. **QC pass.** Watch with subtitles only (mute the video — can you follow
   it?). Check: sync
   drift over long videos, spelling/grammar, consistent speaker labels, no
overlapping cues, timing
   within min/max durations.
6. 6. 6. **Deliver correctly.** Named per convention (`video.en.srt`), uploaded
   as sidecar where
   supported, burned in where required. For translations: translate meaning (not
word-for-word),
   respect the timing constraints, and have a native speaker review.

## Common pitfalls

- - - **Shipping raw auto-captions.** "Let's checkout the new calendar" instead
  of "check out." ASR
  errors in professional content look careless — always review.
- - - **Wall-of-text cues.** 4-line paragraphs flashing for 2 seconds. Split
  into digestible cues at
  natural breaks; respect reading speed.
- - - **Bad line breaks.** Splitting "unbeliev- / able" or separating adjectives
  from nouns across
  lines. Break at phrase boundaries.
- - - **Sync drift.** Captions progressively out of sync in long videos (often
  from frame-rate
  mismatches). Check the end, not just the start.
- - - **Text under UI.** Burned-in subtitles hidden behind platform controls or
  profile overlays. Know
  each platform's safe zones.
- - - **Forgetting accessibility.** Dialogue-only subtitles when captions were
  needed, no sound
  descriptions, tiny low-contrast text. If accessibility is the goal, caption
fully.
