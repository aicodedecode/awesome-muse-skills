---
name: ffmpeg-pro
description: Master FFmpeg for video/audio conversion, compression, trimming, subtitles, streaming, and batch processing.
category: media
---

## Overview

FFmpeg is the Swiss Army knife of media: conversion, compression, trimming, subtitles, streaming,
thumbnails, GIFs — all scriptable, all free. Professionals use it for batch pipelines no GUI can
match. This skill covers the essential FFmpeg patterns: the flags you actually need, quality
control, and recipes for the 20 tasks that cover 95% of real work.

## When to use

- Converting video/audio between formats and codecs

- Compressing files for web delivery or messaging apps

- Trimming, concatenating, or extracting clips without re-encoding

- Burning in subtitles or extracting subtitle tracks

- Batch-processing media files with scripts

## Core concepts

- - **The basic anatomy.** `ffmpeg -i input.mp4 [options] output.mp4`. Input flags before `-i`,
  output flags after. Order matters; `-ss` before `-i` is fast seek, after is accurate seek.
- - **Codecs: `-c:v` and `-c:a`.** `copy` = stream copy (no re-encode, instant, lossless).
  `libx264`/`libx265` for video, `aac` for audio. Default aac bitrate is low — always set `-b:a
  192k` or higher.
- - **Quality control: CRF.** Constant Rate Factor: `-crf 23` is default for x264 (lower = better
  quality, larger file). Sweet spots: 18-20 (high quality), 21-24 (web delivery), 28+ (small files,
  visible loss). One number beats bitrate guessing for most jobs.
- - **Presets trade time for size.** `-preset slow` compresses better than `ultrafast` at the same
  CRF — same quality, smaller file, longer encode. For one-off encodes, `medium`/`slow` is worth it;
  for live, `ultrafast`.
- - **Filters: `-vf` and `-af`.** Video/audio filter chains: `scale`, `crop`, `fps`, `subtitles`,
  `loudnorm`, `volume`. Chain with commas: `-vf "scale=1280:-1,subtitles=subs.srt"`.
- - **Never overwrite blindly.** FFmpeg prompts before overwriting; in scripts use `-n` (never
  overwrite) or `-y` (always). Test commands on copies first — a wrong flag can destroy the only
  copy.

## Practical workflow

**Essential recipes (adapt paths as needed):**

1. **Compress for web (H.264):**
   `ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 192k -movflags +faststart
output.mp4`
   (`faststart` moves metadata to the front for web streaming.)
2. **Compress smaller (H.265):**
   `ffmpeg -i input.mp4 -c:v libx265 -crf 26 -preset medium -c:a aac -b:a 160k -tag:v hvc1
output.mp4`
3. **Lossless trim (no re-encode):**
   `ffmpeg -ss 00:01:30 -i input.mp4 -t 00:00:45 -c copy clip.mp4`
4. **Extract audio:**
   `ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3`
5. **Convert to GIF (high quality, two-pass palette):**
   `ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,palettegen" palette.png`
   `ffmpeg -i input.mp4 -i palette.png -lavfi
"fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse" out.gif`
6. **Burn in subtitles:**
   `ffmpeg -i input.mp4 -vf "subtitles=subs.srt:force_style='FontSize=18'" -c:a copy out.mp4`
7. **Extract thumbnail strip / single frame:**
   `ffmpeg -ss 00:00:10 -i input.mp4 -frames:v 1 thumb.jpg`
8. **Concatenate same-codec files:**

   - Write a list file (`file 'a.mp4'` per line), then:
   `ffmpeg -f concat -safe 0 -i list.txt -c copy joined.mp4`
9. **Normalize loudness (podcast to -16 LUFS):**
   `ffmpeg -i in.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 out.wav`
10. **Batch convert a folder:**
    `for f in *.mov; do ffmpeg -i "$f" -c:v libx264 -crf 23 -c:a aac -b:a 192k "${f%.mov}.mp4";
done`

## Common pitfalls

- - **Forgetting `-c:a` bitrate.** Default AAC bitrate (~128k or lower) can audibly degrade. Always
  set it explicitly.
- - **Re-encoding when copy would do.** Trimming or remuxing with default settings re-encodes
  unnecessarily — slower and lossy. Use `-c copy` when not changing the streams.
- - **`-ss` placement confusion.** Before `-i`: fast but keyframe-limited (cuts snap to keyframes).
  After `-i`: frame-accurate but slower. For precise cuts, put it after.
- - **No `faststart` for web.** Without `-movflags +faststart`, MP4s must fully download before
  playback starts. Always include it for web delivery.
- - **Overwriting originals.** Running conversions in-place or with `-y` in a loop over the source
  folder. Output to a separate directory, verify, then clean up.
- - **Ignoring pixel formats.** Some players choke on `yuv444p` from x264 defaults with certain
  inputs — add `-pix_fmt yuv420p` for maximum compatibility.
