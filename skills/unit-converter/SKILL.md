---
name: unit-converter
description: Convert units accurately across measurement systems with precision handling and reference tables.
category: utilities
---

## Overview

Unit conversion errors have crashed spacecraft — precision matters. This skill covers reliable
conversion across measurement systems (metric/imperial, temperature, data, currency-adjacent),
handling significant figures, avoiding the classic traps (temperature offsets, US vs imperial
gallons), and building conversion references you can trust.

## When to use

- Converting between metric and imperial units

- Handling temperature, data storage, or cooking conversions

- Checking conversion precision and significant figures

- Building conversion tables or calculator references

- Avoiding common conversion mistakes in technical work

## Core concepts

- - **Exact vs approximate factors.** Some conversions are defined exactly (1 inch = 2.54 cm, by
  international agreement). Others are measured (currency rates) or conventional (1 cup = 236.588 ml
  US, but 250 ml in many recipes). Know which you're dealing with.
- - **Temperature is special.** It's an offset scale, not just a multiplier: °F = °C × 9/5 + 32. For
  differences (not absolute temps), 1°C difference = 1.8°F difference — the offset drops out. Mixing
  these up is the classic error.
- - **Significant figures.** Converting 5 miles with a 10-digit factor gives 8.04672 km — but if the
  input was approximate, the output's precision is a lie. Match output precision to input precision.
- - **The gallon trap.** US gallon (3.785 L) ≠ imperial gallon (4.546 L). Same for pints, quarts,
  fluid ounces. Always clarify which system — "gallon" alone is ambiguous.
- - **Data units: decimal vs binary.** 1 KB = 1000 bytes (SI, storage marketing) vs 1 KiB = 1021024
  bytes (binary, OS reporting). The "missing" disk space on every hard drive is this confusion. Use
  KiB/MiB/GiB when you mean powers of 1024.
- - **Dimensional analysis.** Write units through the calculation: miles × (km/mile) = km. If the
  units don't cancel to what you want, the setup is wrong — this catches most errors before they
  happen.

## Practical workflow

1. 1. **Identify both systems precisely.** Not just "gallons" — US or imperial? Not just "tons" —
   metric tonne, US short ton, or imperial long ton? Ambiguity here is where errors breed.
2. 2. **Use defined factors.** Prefer exact definitions (inch = 2.54 cm) over rounded memories. For
   chained conversions, use one precise factor rather than rounding intermediates.
3. 3. **Handle temperature correctly.** Absolute: apply offset + scale. Differences: scale only.
   Double-check which one the problem needs.
4. 4. **Round to the input's precision.** If the input has 2 significant figures, the output gets 2
   (8.0 km, not 8.04672). Exception: keep extra digits in intermediate steps, round only the final
   answer.
5. 5. **Sanity-check the magnitude.** 100°F ≈ 38°C (fever), not 212. 70 kg ≈ 154 lb, not 700. Every
   conversion deserves a reality check — if it feels wrong, it probably is.
6. 6. **Document the factor.** In technical work, note the conversion factor used. "Converted at 1
   USD = 83.2 INR (2026-09-26)" beats a naked number when someone audits later.

**Quick reference (exact where defined):**
- Length: 1 in = 2.54 cm | 1 ft = 30.48 cm | 1 mi = 1.609344 km | 1 m = 3.28084 ft

- Mass: 1 lb = 453.59237 g | 1 oz = 28.3495 g | 1 kg = 2.20462 lb

- Volume: 1 US gal = 3.78541 L | 1 imp gal = 4.54609 L | 1 US fl oz = 29.5735 ml

- Temp: °F = °C×9/5+32 | K = °C+273.15

- Data: 1 KiB = 1024 B | 1 KB = 1000 B (SI)

## Common pitfalls

- - **US vs imperial volumes.** The silent killer in recipes, fuel economy, and engineering. Always
  disambiguate.
- - **Temperature offset errors.** Multiplying instead of offset-converting (or vice versa). Write
  the formula out; don't do it in your head.
- - **False precision.** Reporting 8.04672 km from "about 5 miles." Precision theater undermines
  credibility.
- - **KB vs KiB.** Expecting 1000-based and getting 1024-based (or reverse) in storage, memory, and
  network calculations.
- - **Currency as conversion.** Exchange rates fluctuate — a "conversion" is a snapshot with a
  timestamp, not a constant. Always date currency conversions.
- - **Chained rounding.** Rounding at each step of a multi-step conversion accumulates error. Keep
  full precision until the final result.
