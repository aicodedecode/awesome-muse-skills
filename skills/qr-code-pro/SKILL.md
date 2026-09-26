---
name: qr-code-pro
description: Generate and customize QR codes with error correction, styling, and scan-reliability best practices.
category: utilities
---

## Overview

QR codes bridge physical and digital — menus, payments, WiFi sharing, event check-ins. But a QR code
that doesn't scan is worse than none. Professional QR work means choosing the right error
correction, keeping data short (shorter = denser = easier to scan), styling without breaking
scannability, and testing on real devices before printing thousands.

## When to use

- Generating QR codes for URLs, WiFi, vCards, or payments

- Styling QR codes with brand colors and logos

- Choosing error correction levels for print contexts

- Troubleshooting QR codes that won't scan

- Planning QR placement on packaging, signage, or print

## Core concepts

- - **Error correction levels.** L (7%), M (15%), Q (25%), H (30%) — how much damage the code
  survives. Use H when adding a logo overlay or printing where wear is expected; M is fine for clean
  digital display. Higher correction = denser code = needs larger print size.
- - **Data density vs scannability.** Shorter payloads make simpler, more reliable codes. A
  200-character URL creates a dense code that struggles at small sizes — shorten URLs first, then
  encode.
- - **Quiet zone.** The blank margin around the code (4 modules minimum) is part of the code.
  Designs that crowd text or graphics against the code break scanning — protect the quiet zone
  ruthlessly.
- - **Contrast is critical.** Dark modules on light background. Inverted (light on dark) often
  fails; low-contrast brand colors fail. Test styled codes — beauty that doesn't scan is decoration.
- - **Logo overlays.** Center logos work only with high error correction (H) and small logo size
  (≤20% of code area). The logo covers data modules; error correction reconstructs them — up to its
  limit.
- - **Dynamic vs static.** Static codes embed the destination permanently. Dynamic codes point to a
  redirect service (changeable destination, scan analytics) — useful for print runs where URLs may
  change, but they depend on the service staying alive.

## Practical workflow

1. 1. **Define the payload.** URL (shortened), WiFi credentials
   (`WIFI:T:WPA;S:network;P:password;;`), vCard contact, plain text, or payment string. Keep it as
   short as possible.
2. 2. **Choose error correction.** H for print with logos or harsh environments; M/Q for general
   use; L only for clean digital display of short payloads.
3. 3. **Generate at high resolution.** Vector (SVG/EPS) for print — infinitely scalable. Minimum
   print size: ~2×2 cm for short URLs; larger for dense codes or long scan distances (billboards
   need huge codes — calculate by distance).
4. 4. **Style carefully.** Brand colors only if contrast stays high (test!), rounded modules are
   fine, logo overlay small and centered. Never distort the three finder patterns (the big squares)
   — scanners need them intact.
5. 5. **Test on real devices.** iOS camera, Android camera, 2-3 scanner apps, at the actual print
   size and expected lighting/distance. Test a physical proof before the full print run.
6. 6. **Add a fallback.** Print the short URL or instructions beneath the code ("Scan or visit
   example.com/menu"). Codes fail (dead phones, no signal) — always provide the alternative path.

**Quick generation (Python, requires `qrcode` and `Pillow`):**
```python
import qrcode
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H,
                   box_size=10, border=4)
qr.add_data("https://example.com/menu")
qr.make(fit=True)
qr.make_image(fill_color="black", back_color="white").save("qr.png")
```

## Common pitfalls

- - **Too small to scan.** A dense code printed at 1cm is unscannable. Size scales with data density
  and scan distance — when in doubt, go bigger.
- - **Low-contrast styling.** Brand-colored codes (light blue on white) that look great and scan
  never. Contrast first, branding second.
- - **No quiet zone.** Design elements crowding the code edges. The quiet zone isn't optional
  whitespace — it's functional.
- - **Huge logo overlays.** A logo covering 40% of the code exceeds error correction. Keep logos
  small or lose the code.
- - **Encoding long URLs directly.** Dense, fragile codes. Shorten first — every character removed
  improves reliability.
- - **No testing.** Assuming it scans because it generated. Print proofs, test multiple devices,
  test in situ (lighting, angles, distances) before committing.
