---
name: pdf-sign
description: Place a signature or initials image on a PDF
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original command (ported as skill): https://github.com/anthropics/knowledge-work-plugins/tree/main/pdf-viewer/commands/sign.md. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->

# sign

*Ported from the `/sign` slash command in the original Claude plugin. In Muse AI, run it as a skill: ask Muse AI to "Place a signature or initials image on a PDF...".*

> If you see unfamiliar placeholders like `~~category`, they refer to whatever tool is connected in that category.

# Sign PDF

Add a visual signature or initials to a document using an image
annotation.

> **Disclaimer:** This places your signature **image** on the page. It
> is **not** a certified or cryptographic digital signature. For
> legally binding e-signatures, use a dedicated signing service.

## Workflow

1. **Get the signature image** — ask the user for a local file path
   (PNG/JPG) to their signature or initials. If they don't have one,
   suggest they create one and save it to a known path.

2. **Open the PDF** — `display_pdf` (or reuse existing `viewUUID`).
   Check the returned `formFields` for signature-type fields — they
   include page and bounding-box coordinates.

3. **Locate the target** — if there's a signature field, use its
   coordinates. Otherwise ask: "Which page, and where on the page?
   (e.g., bottom-right of page 3)"

4. **Place it** — `interact` → `add_annotations`:
   ```json
   {"action": "add_annotations", "annotations": [
     {"id": "sig1", "type": "image", "page": 3,
      "imageUrl": "/path/to/signature.png",
      "x": 400, "y": 700, "width": 150}
   ]}
   ```
   Width/height auto-detected from the image if omitted.

5. **Verify** — follow with `get_screenshot` of that page. Show the
   user. Adjust position if needed via `update_annotations`.

6. **Initials on every page** — batch one `image` annotation per page
   in a single `add_annotations` call.

## Tips

- `imageUrl` accepts local file paths or HTTPS URLs (no data: URIs)
- Users can also drag & drop the signature image directly onto the
  viewer
- Coordinate origin is top-left; a typical bottom-right signature on
  US Letter is around `x: 400, y: 700`
- Pair with `the "fill-form" skill` for complete form workflows
