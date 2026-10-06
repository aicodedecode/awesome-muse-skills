---
name: ai-video-prompts
description: Proven prompts behind viral AI-made videos across 4 models — Claude, Muse AI, ChatGPT, Gemini. Browse by model, category, or tech tag, copy a creator's prompt, adapt it to your own model and renderer. Use when you need a motion-graphic, explainer visual, 3D scene, interactive animation, or AI video-gen prompt that already worked in the wild.
category: creative-design
---

# AI Video Prompts

Real prompts behind viral AI-made videos — collected across **Claude, Muse AI, ChatGPT, and Gemini**. Every entry links the creator's original post so you can see the result and credit the source.

Two genres live here side by side:

- **Code-driven animation** — the prompt asks the model to write the animation *as code* (HTML, Canvas, SVG, Three.js, GSAP, shaders). Dominates the Claude/ChatGPT/Muse AI entries. Render with any browser, or pipe through HyperFrames for video output.
- **Video-gen prompts** — the prompt *is* the video direction (Veo, Sora, and similar). Common in the Gemini entries. Paste into the matching video model.

## What's inside

| model | entries | mostly |
| --- | --- | --- |
| claude | 475 | code-driven (Opus 5.5) |
| muse-ai | 7 | official video-gen prompts + early creator clips |
| chatgpt | 24 | code-driven + Sora 2 |
| gemini | 39 | Veo 3 video-gen |

Categories (shared across models): **explainer** (diagram builds, concept visualizations, data-viz), **motion** (kinetic type, particles, showreel-style motion graphics), **3d** (Three.js/WebGL/GLSL scenes), **interactive** (playable pieces, physics toys).

Top tech tags: `canvas`, `svg`, `threejs`, `shader`, `gsap`, `css`, `ai-video`, `veo`, `sora`.

## Layout

- `data/videos.json` — machine-readable index (545 entries). Fields: `slug`, `model`, `model_version`, `title`, `author`, `author_url`, `post_url`, `category`, `tech_tags[]`, `prompt`, `prompt_partial`, `added`, `featured`.
- `data/provenance.json` — per-entry curation notes (why it's notable, which source table it came from) for the 70 hand-curated entries.
- `prompts/<slug>.md` — the prompt text as the creator shared it, one file per entry.

## How to use

1. **Find candidates.** Filter `data/videos.json` by `model`, `category`, `tech_tags`:
   ```bash
   python3 -c "
   import json
   vs = json.load(open('data/videos.json'))
   for v in vs:
       if v['model']=='gemini' and 'veo' in v['tech_tags']:
           print(v['slug'], '-', v['title'])
   "
   ```
2. **Read the prompt.** Open `prompts/<slug>.md` (or the `prompt` field). Note `prompt_partial: true` — the creator only shared part of it. Treat those as inspiration, not recipes.
3. **Adapt, don't paste blindly.** Swap the subject matter, keep the *technique*: how the prompt describes motion, timing, camera, layers, loop structure. Technique transfers across models better than literal wording — a Veo prompt's shot language ("slow dolly-in, 35mm") works in Sora too; a canvas prompt's easing language works in any code model.
4. **Credit the creator** if you publish something visibly derived — `post_url` is on every entry.

## Model notes

- **Claude (Opus 5.5):** the largest set, all code-driven. Prompts lean cinematic and precise — good technique mine for any code model.
- **Muse AI:** small seed set — 4 official Meta preview prompts plus early creator clips. Expect this section to grow via community submissions once Muse Video goes public.
- **ChatGPT:** two flavors — code-driven builds (GPT-6 Astra writing games, 3D scenes, cartoon pipelines) and Sora 2 video-gen prompts (post text *is* the prompt).
- **Gemini:** Veo 3 video-gen prompts from the launch wave — shot lists, camera moves, subject choreography. Model-specific in *knobs* (Veo camera syntax) but the shot design transfers.
- Some prompts reference paid tools or MCPs — skip or substitute those parts; the core technique is the value.

## Attribution

- **Claude entries (475)** adapted from [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) (MIT).
- **Muse AI entries (7):** 4 official Meta preview prompts via [imaginevid/awesome-muse-video-prompts-and-skills](https://github.com/imaginevid/awesome-muse-video-prompts-and-skills) (CC BY 4.0); 3 curated originally.
- **ChatGPT entries (24)** selected, re-titled, and re-tagged from [kikichalks/awesome_sora2_prompt](https://github.com/kikichalks/awesome_sora2_prompt) (MIT) and [beatapi/awesome-3d-prompts](https://github.com/beatapi/awesome-3d-prompts) (MIT).
- **Gemini entries (39)** selected and re-tagged from [akirakai/awesome-veo3-videos](https://github.com/akirakai/awesome-veo3-videos) (CC0).

Every entry credits its creator via `post_url` — the prompts are their words, quoted with credit. "Viral" is survivorship bias: these are the hits. Use them for craft, not as a guarantee.
