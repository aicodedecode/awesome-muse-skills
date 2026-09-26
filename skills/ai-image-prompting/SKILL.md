---
name: ai-image-prompting
description: Craft effective AI image prompts with structured syntax, style control, and iterative refinement techniques.
category: creative-design
---

## Overview

AI image generation is a design medium with its own grammar: the prompt is your
art direction, and
vague prompts produce vague images. Skilled prompting combines precise subject
description, style
vocabulary, compositional direction, and technical parameters — then iterates
deliberately. This
skill teaches structured prompting that produces consistent, art-directable
results.

## When to use

- Generating concept art, illustrations, or marketing visuals with AI

- Creating consistent character or style outputs across images

- Improving AI images that look generic or off-brief

- Building prompt libraries and reusable style templates

- Directing AI imagery for brand-aligned content

## Core concepts

- - - **Prompt anatomy.** Subject (what) + action/context (doing what, where) +
  style (how it looks) +
  composition/lighting (framing, mood) + technical (aspect ratio, quality
params). Missing layers
  produce generic output.
- - - **Style vocabulary matters.** "Cinematic" is vague; "35mm film still,
  shallow depth of field,
  golden-hour rim light, muted teal-and-orange grade" is direction. Build a
personal lexicon of
  style terms that work.
- - - **Specificity beats adjectives.** "A cozy coffee shop" → "a corner café at
  dusk, rain-streaked
  windows, warm Edison bulbs, a barista pouring latte art, worn leather chairs."
Concrete nouns
  outperform abstract adjectives.
- - - **Negative prompting and constraints.** State what to exclude (text,
  watermark, extra limbs,
  photorealistic when you want illustration). Constraints ("single subject,
centered, plain
  background") prevent the model's worst habits.
- - - **Seeds and consistency.** For series work: lock the seed, reuse style
  blocks verbatim, and
  describe recurring elements identically each time. Consistency comes from
repetition, not luck.
- - - **The 70/30 rule.** AI gets you 70% of the way fast; the last 30% (hands,
  text, brand accuracy,
  precise composition) usually needs human editing, inpainting, or compositing.
Plan for the finish,
  don't expect it from the prompt.

## Practical workflow

1. 1. 1. **Define the brief.** What's the image for, what must it communicate,
   what style, what
   dimensions? Write this before prompting — the brief disciplines the
iteration.
2. 2. 2. **Draft the structured prompt.** Build all five layers (subject,
   context, style,
   composition/lighting, technical). Start with your best guess at full
specificity.
3. 3. 3. **Generate variations.** Run 4-8 variations of the first prompt. Don't
   judge individual images
   — judge which direction is closest, then iterate on that one.
4. 4. 4. **Iterate one variable at a time.** Change the style term OR the
   composition OR the subject
   detail — not all three. Systematic iteration converges; random tweaking
doesn't.
5. 5. 5. **Fix with targeted tools.** Wrong hands? Inpaint/regenerate the
   region. Wrong text? Composite
   real typography over it. Close-but-not-quite? Image-to-image with a tight
prompt and low
   denoising.
6. 6. 6. **Build reusable templates.** When a style works, save the style block
   as a template: "[STYLE]
   + [SUBJECT] + [COMPOSITION]." Templates turn one-off wins into a production
system.
7. 7. 7. **Finish like a designer.** Color grade for consistency, composite
   brand elements and real
   type, retouch artifacts. The AI output is raw material; the final image is
designed.

## Common pitfalls

- - - **One-shot expectations.** Judging the medium by the first generation.
  Prompting is iterative —
  professionals run dozens of generations per final image.
- - - **Adjective soup.** "Beautiful stunning amazing ultra-detailed 8k
  masterpiece" — empty
  intensifiers the model mostly ignores. Replace with concrete visual
description.
- - - **Ignoring aspect ratio.** Generating square and cropping to banner.
  Compose for the final ratio
  from the start — composition doesn't survive aggressive crops.
- - - **Text in images.** AI mangles text reliably. Plan to add all typography
  in post — never prompt
  critical text into the generation.
- - - **Style inconsistency across a series.** Slightly different style terms
  each prompt produce a
  Frankenstein set. Lock the style block verbatim.
- - - **No disclosure where it matters.** Editorial, journalistic, and some
  commercial contexts
  require AI disclosure. Know the rules for your use case — and never present AI
imagery as
  photography of real events or people.
