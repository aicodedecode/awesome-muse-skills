---
name: base64-pro
description: Encode and decode Base64 correctly with URL-safe variants, padding rules, and binary handling.
category: utilities
---

## Overview

Base64 shows up everywhere: data URIs, JWTs, basic auth headers, email attachments, embedding binary
in JSON. It's simple — 3 bytes become 4 ASCII characters — but the variants (standard vs URL-safe),
padding rules, and text-vs-binary confusions cause endless bugs. This skill covers correct Base64
handling in practice.

## When to use

- Encoding/decoding Base64 strings and files

- Working with data URIs, JWTs, or auth headers

- Choosing between standard and URL-safe Base64

- Debugging padding errors and character-set issues

- Embedding binary data in text formats (JSON, XML)

## Core concepts

- - **What it is (and isn't).** Base64 is an encoding, not encryption — it provides zero security.
  It expands data by ~33% (plus padding). Anyone can decode it; never put secrets in Base64 thinking
  they're protected.
- - **Standard vs URL-safe.** Standard alphabet: `A–Z a–z 0–9 + /`. URL-safe replaces `+`→`-` and
  `/`→`_` (JWTs, URLs, filenames). Mixing alphabets is the #1 decode failure — know which variant
  you're holding.
- - **Padding.** `=` pads the output to a multiple of 4 characters. Some systems omit padding (JWT
  does); some require it. When decoding, you may need to re-add padding: `s + "=" * (-len(s) % 4)`.
- - **Text vs bytes.** Base64 operates on bytes. Encoding text requires choosing a character
  encoding first (UTF-8, almost always). The classic bug: encoding a Python `str` without
  `.encode("utf-8")`, or decoding to bytes and printing garbage instead of `.decode("utf-8")`.
- - **Line wrapping.** MIME Base64 wraps at 76 characters (email); most modern uses don't wrap.
  Unexpected newlines in encoded output break naive decoders — strip whitespace before decoding.
- - **Data URIs.** `data:image/png;base64,iVBOR...` embeds images in HTML/CSS. Convenient for small
  assets; bloats pages for large ones (33% overhead + no caching). Rule of thumb: inline under ~4KB,
  link above.

## Practical workflow

1. 1. **Identify the variant.** Look at the alphabet: `+`/`/` = standard, `-`/`_` = URL-safe. Check
   for padding (`=` at the end) or its absence. JWT segments are URL-safe without padding.
2. 2. **Encode correctly.** Text → UTF-8 bytes → Base64. Binary files → read as bytes → Base64.
   Specify the variant explicitly; don't rely on defaults across languages.
3. 3. **Decode defensively.** Strip whitespace/newlines, restore padding if missing, use the
   matching variant decoder. Validate the decoded bytes (is it actually UTF-8 text? a valid image
   header?).
4. **Handle in code.** Python:
   ```python
   import base64
   # Standard
   enc = base64.b64encode(b"hello").decode()          # 'aGVsbG8='
   dec = base64.b64decode("aGVsbG8=").decode()        # 'hello'
   # URL-safe (JWT-style), no padding
   enc = base64.urlsafe_b64encode(b"hello").decode().rstrip("=")
   padded = enc + "=" * (-len(enc) % 4)
   dec = base64.urlsafe_b64decode(padded).decode()
   ```
   Shell: `echo -n "hello" | base64` / `echo "aGVsbG8=" | base64 -d`
5. 5. **Size-check the use case.** For large binaries in JSON/APIs, consider whether Base64 (33%
   overhead) is right vs multipart upload or direct binary transfer.
6. 6. **Never for secrecy.** If the data needs protection, encrypt first (then Base64 the ciphertext
   for transport if needed). Base64 alone is obfuscation, not security.

## Common pitfalls

- - **Variant mismatch.** Decoding URL-safe input with a standard decoder (or vice versa) — fails on
  `-`, `_`, `+`, `/`. Match the variant.
- - **Missing padding.** "Incorrect padding" errors from JWT-style unpadded input. Re-pad before
  decoding.
- - **Str/bytes confusion.** Forgetting to encode text to bytes first, or forgetting to decode bytes
  after. In typed languages this is a compile error; in Python it's a runtime surprise.
- - **Wrong text encoding.** Encoding as Latin-1 but decoding as UTF-8 (or vice versa) corrupts
  non-ASCII text. UTF-8 everywhere, explicitly.
- - **Newlines in output.** MIME-wrapped Base64 pasted into JSON or URLs breaks. Strip whitespace or
  use non-wrapping encoders.
- - **Security theater.** "We Base64-encoded the API key in the client" — it's visible to anyone who
  looks. Encoding ≠ encryption, ever.
