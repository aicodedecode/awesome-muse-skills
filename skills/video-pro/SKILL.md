---
name: video-pro
description: Handle professional video tasks with codecs, compression, aspect ratios, and delivery specifications.
category: media
---

## Overview

Video is the heaviest medium — technically and logistically. Professional video handling means
understanding codecs and containers, compression tradeoffs, aspect ratios for each platform, and
delivery specs that prevent rejections. This skill covers the technical pipeline from ingest to
delivery, complementing the creative side of editing.

## When to use

- Choosing codecs, containers, and export settings

- Compressing video for web, social, or streaming

- Converting between formats and frame rates

- Preparing deliverables to platform specs (YouTube, broadcast, client)

- Troubleshooting playback, quality, or file-size issues

## Core concepts

- - **Codec vs container.** The container (MP4, MOV, MKV) is the wrapper; the codec (H.264,
  H.265/HEVC, VP9, AV1) is the compression. MP4 + H.264 is the universal delivery combo;
  ProRes/DNxHR are editing intermediates (huge files, no generation loss).
- - **The quality triangle.** Quality, file size, encoding time — pick two. H.264 is fast and
  universal; H.265 halves file sizes but encodes slower and plays on fewer old devices; AV1 is the
  future but still heavy to encode.
- - **Bitrate is the real control.** For delivery, target bitrate matters more than codec choice:
  1080p YouTube ~8-12 Mbps, 4K ~35-45 Mbps. Constant quality (CRF 18-23 for H.264) beats fixed
  bitrate for most uses — it spends bits where they're needed.
- - **Frame rates and standards.** 24fps (cinematic), 30fps (US broadcast/social default), 25fps
  (PAL regions), 60fps (sports, gaming, smooth motion). Match the delivery spec; converting frame
  rates introduces judder or requires interpolation.
- - **Aspect ratios per platform.** 16:9 (YouTube, landscape), 9:16 (Reels/Shorts/TikTok), 1:1 (feed
  posts), 4:5 (Instagram portrait). Shoot and frame for the primary ratio; reframe (don't just
  crop-center) for others.
- - **Masters and proxies.** Keep a high-quality master (ProRes/DNxHR or high-bitrate H.264). Edit
  with proxies (low-res stand-ins) for smooth timelines, relink to full-res for export. Never
  deliver the proxy.

## Practical workflow

1. 1. **Know the delivery spec.** Platform, resolution, codec, max file size, aspect ratio, frame
   rate, audio specs. YouTube, broadcasters, and clients all publish specs — read them before
   exporting.
2. 2. **Organize the ingest.** Consistent folder structure, descriptive filenames, backup originals
   before any transcoding. Verify integrity of transferred files (spot-check playback, check
   durations).
3. 3. **Choose the editing codec.** Transcode camera originals to an edit-friendly intermediate
   (ProRes LT/Proxy, DNxHR LB) if the camera codec is heavy (H.265, RAW). Generate proxies for 4K+
   timelines.
4. 4. **Export deliberately.** Match timeline settings to delivery: resolution, frame rate (no
   unnecessary conversions), codec per spec, CRF or target bitrate per the quality needed. Two-pass
   encoding for fixed-bitrate targets.
5. 5. **Handle audio properly.** 48kHz sample rate standard for video, AAC 192-320 kbps for
   delivery, loudness normalized (YouTube ~-14 LUFS, broadcast often -24 LUFS). Peaking audio is the
   fastest way to sound amateur.
6. 6. **QC the export.** Watch it through: start to finish, on the target device if possible. Check
   audio sync, no dropped frames, correct aspect (no stretching/black bars unless intended),
   captions burned in or sidecar as required.
7. 7. **Deliver and archive.** Named per client convention, with checksums for large transfers.
   Archive the project file, masters, and exports — storage is cheap, reshoots aren't.

## Common pitfalls

- - **Wrong frame rate conversion.** 24fps timeline exported at 30fps (or vice versa) without proper
  handling causes judder. Decide frame rate at project setup, not export.
- - **Over-compression.** Starving the bitrate produces blocky mush, especially in dark scenes and
  fast motion. When in doubt, raise the bitrate — storage is cheaper than reshoots.
- - **Audio as afterthought.** Great video with clipping, humming, or wildly varying levels. Monitor
  on headphones, normalize loudness, and never let peaks hit 0 dBFS.
- - **Stretching aspect ratios.** Squished or stretched video from mismatched pixel aspect ratios.
  Check: do circles look like circles? Fix with proper interpretation, not eyeballing.
- - **No backup of camera originals.** Transcoding over the only copy, or deleting originals after
  proxy creation. Originals are irreplaceable — archive before anything else.
- - **Ignoring platform recompression.** Uploading a 50 Mbps file to a platform that recompresses to
  8 Mbps anyway. Upload slightly above the platform's target quality — massive files just waste
  upload time.
