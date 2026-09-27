---
name: figma-plugin-api-rules/text-and-styles
description: Read when working with TEXT nodes — fonts and font loading, loadFontAsync, textStyleId, figma.mixed, letterSpacing, truncation, measuring text width, stale width/height of fresh text in the sandbox, applying created text styles
---

# text-and-styles — use_figma rules

### fonts-bind-dont-load-and-binding-wont-always-rescue-you
**Principle:** Apply DS text styles by binding, never by installing/loading fonts. **But** when a licensed font is absent from the MCP sandbox, `loadFontAsync`, `setTextStyleIdAsync`, AND `setBoundVariable('fontFamily', …)` all fail — binding does **not** rescue you. The cause is structural, not a bug to word around: a server-side tool sees only fonts uploaded to Figma's servers, so a family added on the machine through Figma's font helper is invisible here however well it renders in the desktop UI, while a family uploaded to the organization or team is visible. Two answers, in this order. **(1) Name the real fix:** say the font is missing and ask whether it can be uploaded to the org or team — that fixes every later session too, and costs nothing at runtime. Its conditions: an org (or team) admin does it, on the Organization or Enterprise plans, `.TTF`/`.OTF` files only, so a foundry-hosted family such as Adobe Fonts is out of reach this way. **(2) Only if that's refused or unavailable:** author the text in **Inter** matched to the DS spec (sizes/weights/line-heights), say out loud that the font was substituted, and hand the restyle back — select-all in desktop, apply the real text styles. Either way, don't burn passes retrying font loads.
**Symptom:** repeated font-load errors on the same family across several calls; `figma.listAvailableFontsAsync` doesn't list it although existing TEXT nodes in the file use it.
**Pattern — one probe, not three:** check availability once with `listAvailableFontsAsync` and branch on the result; don't follow a miss with `loadFontAsync` attempts on other styles of the same family — every attempt is a `use_figma` call against the daily limit, and a family absent from the list is absent in every style.
```js
const fonts = await figma.listAvailableFontsAsync();
const has = fonts.some(f => f.fontName.family === 'Gilroy');
if (!has) { /* author in Inter to spec, hand the restyle to the user — do NOT try loadFontAsync */ }
```

### settextstyleidasync-swaps-the-font-mid-call-load-both-fonts-first
**Principle:** Loading fonts is still required even when you're binding a style, not loading one. `setTextStyleIdAsync` swaps the node's font to the style's font as part of applying it — any write to the node *after* that call (e.g. clearing `textDecoration`) then fails with `Cannot write to node with unloaded font "JetBrains Mono Medium"`, because the font the node now has was never loaded. Load **both** the node's current font and the style's target font, in that order, before the style-id write.
```js
// Both loads are needed: the node's current font (so the style-id write itself
// succeeds) and the target style's font (because setTextStyleIdAsync switches
// the node to it mid-call — any write after that touches the new font).
await figma.loadFontAsync(node.fontName);
await figma.loadFontAsync({family: 'JetBrains Mono', style: 'Medium'});
await node.setTextStyleIdAsync(styleId);
node.textDecoration = 'NONE'; // safe now — the new font is already loaded
```

### node-fontname-is-figma-mixed-on-multi-font-text
**Principle:** On a text node with more than one font in it, `node.fontName` reads back as `figma.mixed`, not a usable font descriptor — passing that straight to `loadFontAsync` throws. Walk the real per-run fonts instead.
**Symptom:** `Error: in loadFontAsync: Cannot unwrap symbol` — the error names neither the font nor `figma.mixed`. The same cause in a read-only dump reads `TypeError: cannot convert symbol to string`: a helper concatenated `fontName`, `fills`, `cornerRadius` or `letterSpacing` into a string while the value was `figma.mixed`. Test `=== figma.mixed` before loading or printing any of them.
```js
// figma.mixed carries no font info by itself — enumerate the actual fonts
// used in each styled run and load each one.
for (const seg of node.getStyledTextSegments(['fontName'])) {
  await figma.loadFontAsync(seg.fontName);
}
```

### mixed-segment-text-fills-invisible-to-node-level-fills-array
**Principle:** `node.fills` on a TEXT node with per-segment (per-character) styling returns the `figma.mixed` symbol, NOT an array — any bulk script checking `Array.isArray(node.fills)` before processing paint bindings (the standard pattern for a fills/strokes rebind) silently SKIPS such nodes entirely. Separately: `node.getStyledTextSegments(['boundVariables'])` does NOT return the per-segment colour binding in `segment.boundVariables.fills` — the real binding lives inside `segment.fills[i].boundVariables.color.id`, an ordinary Paint object; the `boundVariables` field on the segment itself concerns other typography properties (fontFamily etc.), not colour. Both facts together mean: a bulk variable rebind that doesn't handle mixed-style TEXT nodes by a separate path through `getStyledTextSegments(['fills',...])` leaves them entirely unchecked and unconverted — while the script reports 0 errors, because for it such nodes don't exist.
**Symptom:** a mass rebind (even with a subsequent read-only check through the same `Array.isArray(node.fills)` pattern) shows 0 remote/unbound findings, but a specific word/digit inside a paragraph with inline emphasis (a brand, a bold accent, part of a card number) stays on the old library/token — found only visually (the word is invisible or of the wrong colour on the new background), not by a structural check.
**Pattern:** a separate pass specifically over TEXT nodes: `const segs = node.getStyledTextSegments(['fills']); segs.map(s => s.fills[0]?.boundVariables?.color?.id)` — compare the segment signatures, find real differences/remote bindings, process each segment through `setBoundVariableForPaint` on its own paint. If the user asks to "split into layers" — record that case (moving the space at the split boundary) in your per-project notes file.

### hug-text-box-collapses-trailing-space-but-keeps-leading-space
**Principle:** On a TEXT node with `textAutoResize: 'WIDTH_AND_HEIGHT'` (HUG on both axes), a space that ends up as the LAST character of the string isn't included in the measured box width (visually collapses to zero) — while a space as the FIRST character is preserved correctly. The asymmetry is confirmed empirically (not documented in the Plugin API): when splitting one TEXT node with inline emphasis into several neighbouring TEXT children inside a HORIZONTAL auto-layout with `itemSpacing: 0`, the space that used to sit BETWEEN two styles (usually as the last character of the piece BEFORE the emphasis) must be moved to the first character of the NEXT piece, not left as the previous one's tail.
**Symptom:** after the split the text at the boundary of two new TEXT nodes visually sticks together ("use the function«Replace»" instead of "...the function «Replace»"), although both pieces contain the needed space in `.characters` and `row.children` are placed with the right `x`/`width` per the API — the space-containing part of the piece just doesn't render at the expected width.
**Pattern:** before assembling the split, walk the piece boundaries and move the space to the leading position of the next piece. A separate case — a piece consisting ENTIRELY of space(s) (e.g. the middle fragment of `"12,000" + " /" + " " + "50,000"`) — such a piece risks collapsing on BOTH sides; the right move is to delete it as a separate node and glue its text as leading characters onto the next piece in order.

### findone-text-may-hit-hidden-sibling-not-visible-content
**Principle:** A component with several TEXT children (e.g. `Title`+`Subtitle` inside one `Hint`/card-like instance) may keep ONE of them `visible=false` as an unused slot — `instance.findOne(n => n.type === 'TEXT')` returns the first in traversal order, which doesn't guarantee a visible / actually displayed node. A text mutation on the hidden node passes without error (the API doesn't check `visible`), nothing changes visually, and the real bug (the old text) stays on screen.
**Symptom:** `characters =` succeeds; `get_screenshot` after the edit shows the OLD text — a discrepancy between "the script said success" and "nothing changed on the canvas".
**Pattern:** for components with 2+ text children — always filter by `visible === true` explicitly; don't rely on the first match:
```js
const realText = instance.findAll(n => n.type === 'TEXT' && n.visible === true)[0];
// NOT instance.findOne(n => n.type === 'TEXT') — may return the hidden Title instead of the visible Subtitle
```

### letterspacing-detaches-textstyle
**Principle:** Setting ANY typographic property (`letterSpacing`, `fontSize`, `textCase`, probably others too: `fontName`, `lineHeight`) AFTER assigning `textStyleId` detaches the text style — `textStyleId` silently becomes `''`. The rule isn't specific to `letterSpacing` — it's a general effect: any raw typography override after binding resets the binding.
**Symptom:** `textStyleId` after the override becomes an empty string without error; the node keeps looking "roughly right" (the override did apply), so the bug isn't caught by eye — only by an explicit `node.textStyleId !== ''` check after the fact.
**Pattern:** assign `textStyleId` LAST of the typographic properties in the script (after `characters`, `fontSize`, `textCase`, etc.), or don't touch typography properties after binding at all. `fills` (colour) is a SEPARATE system from typography; it can be changed after `textStyleId` without risk of detaching (checked: red/grey caption overrides over `textStyleId` kept the binding).
```js
// ❌ WRONG — textStyleId resets to ''
label.textStyleId = 'S:abc...';
label.fontSize = 14; // OR label.textCase = 'UPPER'; OR label.letterSpacing = {...}

// ✅ RIGHT — typography/case first, textStyleId last; fills may come after — it's not typography
label.textCase = 'ORIGINAL';
label.characters = 'Account';
label.textStyleId = 'S:abc...'; // nothing typographic after this line
label.fills = [boundColorPaint]; // OK — fills don't detach the style
```

### texttruncation-ending-enum
**Principle:** `textTruncation` accepts `'ENDING'`, not `'ENDING_ELLIPSIS'`; for single-line truncation combine with a fixed width (resize) and `textAutoResize = 'TRUNCATE'`.
**Symptom:** `Property "textTruncation" failed validation: Invalid enum value. Expected 'DISABLED' | 'ENDING'`.
```js
valueText.resize(130, valueText.height);
valueText.textAutoResize = 'TRUNCATE';
valueText.textTruncation = 'ENDING';  // NOT 'ENDING_ELLIPSIS'
```

### loadfontasync-multiple-families-cross-instance
**Principle:** Before mutating `characters` on cross-instance text nodes load ALL the fonts actually used — complex DS components use different families in different text nodes, and a specific node's current fonts are found via `getStyledTextSegments(['fontName'])` followed by `loadFontAsync` per segment.
**Symptom:** the error "Cannot write to node with unloaded font..." on a text override inside an instance.
**Pattern:** preflight: load the pool of likely fonts (optional ones in try/catch) before any characters/setProperties; because the script is atomic, a failure on a font load cancels everything done — rerun whole.
```js
// Error: Cannot write to node with unloaded font "JetBrains Mono Regular".
// Please call figma.loadFontAsync({ family: "JetBrains Mono", style: "Regular" }) first.

// Preflight: load ALL potentially needed fonts BEFORE any characters/setProperties
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
// optional families — in try/catch, so as not to crash the whole preflight
try { await figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Regular' }); } catch (e) {}
try { await figma.loadFontAsync({ family: 'JetBrains Mono', style: 'Medium' }); } catch (e) {}
try { await figma.loadFontAsync({ family: 'Lora', style: 'Regular' }); } catch (e) {}

// Discovery pattern (if the parent CS is unknown) — learn the node's current fonts:
const segments = textNode.getStyledTextSegments(['fontName']);
for (const seg of segments) {
  await figma.loadFontAsync(seg.fontName);
}
// Only after this — the characters mutation.
// Script atomicity: a failure on a font load cancels the whole script — rerun whole.
```

### loadfontasync-proprietary-fonts-unavailable
**Principle:** Adobe Fonts / other proprietary-licensed fonts (e.g. Myriad Pro) are unavailable via the Plugin API — `figma.loadFontAsync({family, style})` fails even though the font is visible in the Figma UI and used in the file's existing TEXT nodes.
**Symptom:** `figma.listAvailableFontsAsync` doesn't contain such a font (`.find` returns undefined); `figma.createText` + `setFontName({family: 'Myriad Pro',...})` fails, and even `node.characters = '...'` on an existing node with that font fails (it calls loadFontAsync under the hood too).
**Pattern:** existing TEXT nodes with a proprietary font keep rendering correctly (the font reference is preserved); `node.clone()` preserves the font. For new text — clone-based creation (clone an existing node with the needed font, edit the other properties without rewriting characters under an unloaded font), or a fallback font (e.g. Inter) with a documented mismatch, or leave a manual UI fix to a person. Unlike a family the team holds as files, this one has no org-upload escape (see `fonts-bind-dont-load-and-binding-wont-always-rescue-you`): a foundry-hosted font isn't yours to upload as `.TTF`/`.OTF`, so don't offer that route here.
```js
// Discovery test
const fonts = await figma.listAvailableFontsAsync();
const myriad = fonts.find(f => f.fontName.family === 'Myriad Pro');
console.log(myriad);  // undefined → the API doesn't see the font

// ❌ fails — the Plugin API can't load a proprietary font
figma.createText();
node.setFontName({ family: 'Myriad Pro', style: 'Bold' });
node.characters = 'text';  // fails too: an implicit loadFontAsync under the hood

// ✅ clone-based creation — preserves the font reference without loadFontAsync
const clone = existingMyriadNode.clone();
```

### textalign-center-on-fill-width-drifts-with-text-length
**Principle:** A TEXT node with `layoutSizingHorizontal='FILL'` inside an auto-layout parent and `textAlignHorizontal='CENTER'` renders with a left inset that depends on the string's length (shorter text — larger inset, longer — smaller), even when the neighbouring column uses `LEFT` with identical paddings/cell width. Visually this reads as "the columns don't match / drift apart", although the actual cell widths (header↔rows) are identical.
**Symptom:** the table header is left-aligned in the column while the row values (of different lengths in different rows) each start at their own X position — creating the impression of a width desync, although `cell.width` of the header and rows match in px.
**Pattern:** diagnose by directly reading `textNode.textAlignHorizontal` on the suspicious column (don't rely on a visual width comparison) — if `CENTER` at `layoutSizingHorizontal='FILL'` while the neighbouring column is `LEFT` — bring it to `LEFT` for consistency, rather than trying to adjust cell widths.
```js
const label = linkCell.findOne(n => n.name === 'Label');
label.textAlignHorizontal; // 'CENTER' — this is the source of the "drift", not cell.width
label.textAlignHorizontal = 'LEFT';
```

### bulk-dictionary-text-localization-single-atomic-pass
**Principle:** A mass translation/replacement of text scattered over a page (tens to hundreds of TEXT nodes, including ones nested in INSTANCEs) is done efficiently with ONE atomic `use_figma` script: a recursive tree walk (descending into INSTANCE children — `node.children` works on instances too) → on each TEXT node a lookup of `node.characters` in a JS source→target dictionary → on a match, `getStyledTextSegments(['fontName'])` + `loadFontAsync` per segment → `node.characters = target`. Script atomicity means: even 200+ mutations in one call — either all applied, or (on an error somewhere in the middle) NONE; nothing to roll back.
**Symptom/motivation:** "translate all the text on page X" — the naive path (find each node separately, dozens of `use_figma` calls) is many times slower and unnecessary: a dictionary of identical strings (e.g. "Section name" occurs 12 times in different instances) covers all occurrences with one `DICT[chars]` lookup in one pass.
**Pattern (discovery → dictionary → apply → verify):**
```js
// Step 1 (read-only): collect a DEDUPLICATED text inventory — TSV/a compact format
// (not JSON with a full id array per entry — on pages with 150+ unique strings
// that exceeds the response token limit; see get-metadata-no-nodeid-timeout-on-huge-pages in mcp-and-environment.md).
figma.skipInvisibleInstanceChildren = true;
const CONTAINER_TYPES = new Set(['FRAME','COMPONENT','COMPONENT_SET','INSTANCE','GROUP','SECTION','PAGE','BOOLEAN_OPERATION']);
const dedup = new Map();
function walk(node) {
  if (node.visible === false) return;
  if (node.type === 'TEXT') {
    if (!dedup.has(node.characters)) dedup.set(node.characters, { count: 0, id: node.id });
    dedup.get(node.characters).count++;
    return;
  }
  if (CONTAINER_TYPES.has(node.type) && node.children) node.children.forEach(walk);
}
page.children.forEach(walk);
return { total: dedup.size, tsv: Array.from(dedup.entries()).map(([c, v]) => `${c}\t${v.count}\t${v.id}`).join('\n') };

// Step 2 (offline, not in use_figma): build the source→target dictionary from the found strings,
// checking each against the source of truth (the project's i18n JSON / a live staging) — don't translate "by eye".
// Data strings (slugs, IDs, dates, phones, enum codes like "STATUS_A"/"STATUS_B") — do NOT include
// in the dictionary; they stay unchanged automatically (a lookup miss = skip).

// Step 3 (write, one atomic call): the same walk, now with a mutation by dictionary.
const DICT = { "Source label": "Target translation", /* ... */ };
const fontCache = new Set();
async function apply(node) {
  if (node.visible === false) return;
  if (node.type === 'TEXT') {
    const t = DICT[node.characters];
    if (t && t !== node.characters) {
      for (const seg of node.getStyledTextSegments(['fontName'])) {
        const key = `${seg.fontName.family}|${seg.fontName.style}`;
        if (!fontCache.has(key)) { await figma.loadFontAsync(seg.fontName); fontCache.add(key); }
      }
      node.characters = t;
    }
    return;
  }
  if (CONTAINER_TYPES.has(node.type) && node.children) for (const c of node.children) await apply(c);
}
for (const c of page.children) await apply(c);

// Step 4 (read-only verify): a repeat walk with a regex filter (e.g. /[A-Za-z]/) —
// what remains must be ONLY the expected data (slugs/enum/dates), not forgotten UI text.
```
**Why fontCache matters:** without the cache `loadFontAsync` is called once per EVERY mutated node (200+ calls instead of a handful of unique `family|style` pairs) — not critical for correctness, but noticeable for throughput with a large dictionary.

### multiple-same-name-visible-text-siblings-findone-leaves-second-as-default-placeholder
_An adjacent entry — the reverse of `findone-text-may-hit-hidden-sibling-not-visible-content` above: there findOne hits a HIDDEN node first (the mutation isn't visible); here — a VISIBLE node of two identically named ones, and the second visible one stays with the default placeholder._
**Principle:** A component designed for multi-line content (e.g. a list item with "name + address", both layers named with the same generic name like `Field label`) may have BOTH text nodes `visible: true` — `instance.findOne(n => n.type === 'TEXT')` finds only the FIRST in traversal order and overrides it; the second stays with the master component's default text (a placeholder like "Label"/"Title").
**Symptom:** after a successful (error-free) `characters` mutation on the "found" text node the screenshot shows the NEEDED text on the first line, but under it — an unrequested placeholder ("Label" etc.) as a second line — easy to take for a separate, deliberately designed sub-label of the component rather than a forgotten default.
**Pattern:** for components originally meant for 2+ lines of text but reused for single-line content — find ALL TEXT children inside the target text frame (`textFrame.children.filter(c => c.type === 'TEXT')`), explicitly set the needed text on the first, and `visible = false` on the rest (don't "delete" — `.remove()` on an instance's children is forbidden; see `instance-child-remove-not-allowed` in `instances.md`).
```js
const textFrame = menuItem.findOne(n => n.name === 'text' && n.type === 'FRAME');
const textNodes = textFrame.children.filter(c => c.type === 'TEXT'); // both visible:true, the same name 'Field label'
// textNodes[0] was already overridden to the needed text earlier in the script
for (let i = 1; i < textNodes.length; i++) textNodes[i].visible = false; // hide the default placeholder
```

### textautoresize-height-wraps-instead-of-truncating-fix-via-truncate-mode-override
**Principle:** A TEXT node inside an instance with `layoutSizingHorizontal='FILL'` and `textAutoResize='HEIGHT'` (the typical configuration for "elastic" text in an auto-layout DS component) does NOT truncate long content with an ellipsis when the parent narrows — it WRAPS to 2+ lines, inflating the row's height. The master component may have `textTruncation: 'DISABLED'` by default, even when the rest of the design (single-line lists, a fixed row height) is clearly built for one line. This is NOT a bug, just a default that must be overridden at instance level.
**Symptom:** after `rowInstance.layoutSizingHorizontal='FILL'` (narrowing) a long username/label renders not as `«@some_very_long_...»` but as `«@some_very_long_`↵`handle»` — two lines inside the same text node; the row visually "inflates" in height although the width narrowed as planned.
**Pattern:** override on the TEXT node itself (an instance-sublayer-level override, allowed — see `textstyleid-mutable-on-instance-sublayer` in `instances.md`): temporarily `FIXED` + `resize` to the original single-line height → `textAutoResize='TRUNCATE'` → `textTruncation='ENDING'` → return `layoutSizingHorizontal='FILL'` for the width (the height stays pinned to one line — which is the point). The order is mandatory: `textAutoResize` can't be set to `'TRUNCATE'` while the node isn't `FIXED`; `FILL` is returned ONLY on the width, after the truncate mode is already applied.
```js
const singleLineHeight = usernameText.height; // the height BEFORE any mutations — one line
usernameText.layoutSizingHorizontal = 'FIXED';
usernameText.resize(usernameText.width, singleLineHeight);
usernameText.textAutoResize = 'TRUNCATE';
usernameText.textTruncation = 'ENDING';
usernameText.layoutSizingHorizontal = 'FILL'; // the width is elastic again; the height stayed pinned
```

### remote-ds-text-styles-mode-responsive-apply-plain-token-not-desktop-mobile-variants
**Principle:** A design system's remote text styles (e.g. a `Design System`-style library) are often **mode-responsive** — their `fontSize` is bound to a float variable with modes (Desktop/Mobile). One "plain" style token (e.g. `text-3xl`) resolves to a DIFFERENT size by the frame's active mode: the same `setTextStyleIdAsync(style.id)` on a desktop frame → 32 px, on a mobile frame → 24 px. Separate `Desktop/text-3xl` / `Mobile/text-3xl` variants exist too (non-responsive pins), but if the frames already carry the right mode (e.g. cloned from onboarding) — the plain token gives the desktop↔mobile pair automatically; no need to duplicate.
**Symptom/trap:** the temptation to set different sizes on desktop/mobile by hand or to look for separate Desktop/Mobile styles — in fact one plain token + the frame's mode covers both breakpoints. The reverse: if the frame has NO explicit mode, the plain style resolves to the default mode (may give the desktop size on mobile) → check by reading `node.fontSize` after applying.
**Pattern:**
- Remote style keys: `search_design_system(includeStyles:true)` (gives name + key + Desktop/Mobile variants) OR copy `node.textStyleId` from a node already using the style (the style is already imported into the file — no key needed).
- Application: `const s = await figma.importStyleByKeyAsync(key); await node.setTextStyleIdAsync(s.id);` — `setTextStyleIdAsync` (async!) overrides family/size/weight/lineHeight/letterSpacing with the DS values; does NOT touch fill (keep the colour as a separate binding to a colour variable). The style's font must be loaded (`loadFontAsync`) before applying.
- Responsive check: after applying, read `node.fontSize` on a desktop and a mobile frame — they must resolve to different values (e.g. 32/24); identical → the frame lacks the needed mode.
```js
const style = await figma.importStyleByKeyAsync('style-key-placeholder'); // text-3xl (internal DS, mode-responsive)
await titleNode.setTextStyleIdAsync(style.id); // desktop frame → 32, mobile frame → 24 (by the frame's mode)
```

### master-textstyleid-fix-cascades-to-live-uninstanced-nested-copies-detached-need-manual-fix
**Principle:** Applying `setTextStyleIdAsync` to a TEXT node of a master component (or a CS variant) automatically propagates to all nested live INSTANCE copies of that node across the file, IF the copy has no local override of its own on that property (the same mechanism as structural edits — see `component-cascade-instance-vs-manual-clone-inheritance-divergence` in `instances.md`, but here specifically about textStyleId/font). Copies that were `detachInstance`-ed (turned into independent FRAMEs) do NOT receive the cascade — a separate explicit fix is needed on each.
**Symptom:** a systematic text-style fix in one place (the master) during a system audit of several "copies of one pattern" scattered over the file saves a mass of separate calls — but it's easy to wrongly decide that EVERY place must be fixed by hand, without first checking which copies are live INSTANCEs and which are detached FRAMEs.
**Pattern:** before fixing "the same typographic mistake occurs in N places" — first check `node.type` of each place (or the instance ID of the form `I<parent>;<base>` — if the base ID matches the master, it's a live instance). Fix ONLY the master for live instances, then ALWAYS re-check by reading (`node.textStyleId`) at least one random nested copy that the cascade really worked — don't assume it on faith. Detached copies (usually the result of `detachInstance` while assembling compositions — see instances.md) require a separate explicit call on each.
```js
// After the master fix — a mandatory cascade re-check on a random nested copy
const nestedCopy = await figma.getNodeByIdAsync('I<parentInstanceId>;<masterTextNodeId>');
return { styleId: nestedCopy.textStyleId }; // must match the master's new style without extra actions
```

### fill-text-width-is-not-natural-width-measure-by-toggling-autoresize
**Principle:** On a TEXT node stretched by its parent (`textAutoResize='HEIGHT'`, width = the cell's width minus paddings), `node.width` shows the IMPOSED width, not the string's natural width. So the question "does the text fit" isn't settled by `t.width` vs `cell.width`: it always "fits". A real wrap is visible only indirectly — by the height (`t.height` is a multiple of the line height) or on a screenshot.
**Symptom:** a column-width check says "everything adds up, Δ=0", while on the render the headers are clipped and the values wrapped to two lines. Picking widths "by eye plus a margin" takes several iterations, because each new width again reports "fits".
**Pattern:** measure the natural width by toggling the mode and restoring it; compute the column's need as `max(natural over all rows and the header) + paddings`.
```js
async function natural(t) {
  for (const seg of t.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(seg.fontName);
  const mode = t.textAutoResize, w = t.width;
  if (mode === 'WIDTH_AND_HEIGHT') return Math.ceil(t.width);   // already auto-width
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  const nat = Math.ceil(t.width);
  t.textAutoResize = mode;
  t.resize(w, t.height);                                        // restore the imposed width
  return nat;
}
// column i's need = max(natural(header), natural(each cell), width(Badge instances)) + PAD
```

### capture-semibold-with-no-loaded-600-weight-means-browser-rendered-bold-not-medium
**Principle:** An html-to-figma capture may assign a text style the name `SemiBold` (font-weight:600 in the page's computed styles) even when NO font-face / font config of the product has a loaded 600 weight (checked in code: Roboto in that stack loads only 300/400/500/700 — 600 is declared nowhere as a real file). That doesn't mean 600 is a capture typo: `font-weight:600` may really be requested in the component's CSS/classes (a legitimate design intent), but the browser, not finding the exact weight, matches it to the nearest LOADED one by the CSS Fonts Module Level 4 algorithm: for a target weight **>500** the search goes through the available weights **upward** (in this stack — to 700/Bold), not down to 500/Medium. Additionally, most fonts (including the classic static Roboto) have no real `SemiBold` face as a separate file at all — i.e. even if a designer picked "Roboto SemiBold" in Figma, no such master style exists; the name is an artefact of how the capture names the computed numeric weight.
**Symptom:** a text node carries `fontName.style === 'SemiBold'` (or any other face non-existent in the real font), obtained from the page's computed `font-weight` at capture time; on the screenshot the node is visually BOLDER than the neighbouring `Regular` text of the same size — i.e. the browser really rendered it bold, not "medium".
**Pattern:** don't substitute "the nearest by name" (`Medium`) intuitively — set `Roboto Bold` (a really existing style) and CHECK by screenshot next to the neighbouring `Regular` text: it must read clearly bolder, not slightly denser. Verify the code evidence (a delegated code-archaeology request: "which font weights are really loaded for this font") BEFORE a mass fix — if 600 isn't requested anywhere in the code for this element at all, it may be a genuine font-substitution artefact on the capture machine, not the CSS round-up described above.
```js
await figma.loadFontAsync({ family: 'Roboto', style: 'Bold' });
node.fontName = { family: 'Roboto', style: 'Bold' }; // not 'Medium' — CSS Fonts L4 rounds >500 up, not down
```

### auto-lineheight-in-imports-means-not-captured-do-not-compute-a-value

**Principle:** In a mockup that arrived from html-to-figma (or any DOM capture), `lineHeight.unit === 'AUTO'` means "the capture didn't record a value", not "the value equals such-and-such". When "bringing line-height units to pixels" there's a temptation to run all runs through one rule and substitute something plausible for the AUTO cases (`fontSize × 1.3`, `× 1.2`, a value from a neighbouring mockup). That's substituting an invented number into a mockup that's later read as a spec: `AUTO` honestly says "inherited from the font", while baked-in pixels assert a specific layout that isn't in the source. Only `PERCENT` → `PIXELS` can be converted (there the value really exists, just in other units).
**Symptom:** after a "cosmetic normalisation" the screen's vertical rhythm changes on dozens of nodes, and there's nothing to justify the specific number with; in the diff it looks like meaningful work, because the units really became uniform.
**Pattern:** the conversion rule — only for `PERCENT`. Leave `AUTO` alone. If AUTO is already spoiled, the rollback is detected by the same factor that spoiled it.
```js
for (const s of t.getStyledTextSegments(['fontName','fontSize','lineHeight'])) {
  if (s.lineHeight.unit === 'PERCENT') {
    t.setRangeLineHeight(s.start, s.end, { unit:'PIXELS', value: Math.round(s.fontSize * s.lineHeight.value) / 100 });
  }
  // AUTO — leave as is
}
// rollback of a wrong substitution: return AUTO where value ≈ fontSize * factor
if (Math.abs(s.lineHeight.value - s.fontSize * 1.3) < 0.15) t.setRangeLineHeight(s.start, s.end, { unit:'AUTO' });
```

### retext-clone-keeps-donors-fixed-width-with-textautoresize-none
**Principle:** On a TEXT node with `textAutoResize: 'NONE'`, assigning new `.characters` does NOT recompute the box width — it stays what the donor had (relevant when cloning a similar row/card and replacing the text with a longer/shorter one). If the new text has a different length, it either wraps onto an extra line inside the old narrow box (visually breaking any fixed height of the parent container nearby), or stays with an excess empty tail of the box — `node.width` is reported after writing `.characters`, but it's the OLD box's width, not the new text's natural width.
**Symptom:** after cloning a row and replacing the heading with a longer phrase the heading wraps to 2 lines and runs over the neighbouring element below (a description / the next row), although structurally identical neighbouring rows with text of the same length are all on one line — `node.width` read right after writing `.characters` matches the original donor 1:1 (a suspicious signal that the width wasn't recomputed).
**Pattern:** measure the natural width explicitly — temporarily switch to `WIDTH_AND_HEIGHT`, read `.width`/`.height`, switch back to `NONE` with an explicit `resize` to the measured values (keeps the neighbours' original convention — `NONE`, but at the right size):
```js
titleNode.textAutoResize = 'WIDTH_AND_HEIGHT';
const naturalWidth = titleNode.width, naturalHeight = titleNode.height;
titleNode.textAutoResize = 'NONE';
titleNode.resize(naturalWidth, naturalHeight);
```
Any neighbouring elements whose position was computed from the old text width (e.g. indicators/icons right after the heading) — recompute by the NEW measured width, not the old.

### maxlines-truncation-invisible-to-characters-reads
**Principle:** Text truncation is a RENDER property (`textTruncation: 'ENDING'` + `maxLines: 1`), and `.characters` under it carries the string WHOLE. No structural walk (reading `characters`, comparing with a ledger/spec, a property diff) sees the truncation: the node honestly returns the full text, while the frame shows "Start of the lin…". So a check "the text in the frame equals the declared one" passes on a truncated heading.
**Symptom:** the run/diff is green, `.characters` matches the expected verbatim, and the render shows an ellipsis. Especially frequent on modal and card headings that receive a longer string than the donor had: the box width is set by the component (e.g. 342 px in a 426 px modal), and 20 px Semi Bold fits ~26 characters.
**Pattern:** read `textTruncation` and `maxLines` together with `characters` wherever the string may have lengthened; or (more reliable) look at the render. To lift the truncation — `textTruncation = 'DISABLED'; maxLines = null` (a wrap to a second line; the node's and its container's heights recompute if they're HUG). Both properties are overridable on an instance sublayer. **Caution:** if the node was configured per the `textautoresize-height-wraps-instead-of-truncating-fix-via-truncate-mode-override` recipe above (`textAutoResize='TRUNCATE'`), lifting `textTruncation`/`maxLines` alone isn't enough — `textAutoResize` must also be returned to `'HEIGHT'` (or the original mode); otherwise the node stays pinned in the `TRUNCATE` sizing mode even after the truncation itself is off.
```js
const t = await figma.getNodeByIdAsync('node-id-placeholder');
// the danger sign: maxLines === 1 with a string wider than the box
const risky = t.maxLines === 1 && t.textTruncation === 'ENDING';
const segs = t.getStyledTextSegments(['fontName']);
for (const s of segs) await figma.loadFontAsync(s.fontName);
t.textTruncation = 'DISABLED'; t.maxLines = null;
```

### custom-font-missing-unicode-symbol-glyph-fallback-to-system-font
**Principle:** Custom UI fonts (not Inter/system) often don't cover the Unicode Miscellaneous Symbols block (e.g. U+2665 BLACK HEART SUIT `♥`) even when neighbouring blocks (Arrows, basic Latin) are fully covered — `figma.loadFontAsync` and writing `.characters` pass without error, but the glyph renders empty (not a missing-glyph box — literally nothing).
**Symptom:** the screenshot shows an empty tile/badge fill instead of the glyph icon, while `.characters` reads correctly (the symbol is there; `codePointAt` confirms the right code point) — the discrepancy is visible only on the screenshot, not in a structural check.
**Pattern:** don't change the code point (the symbol is right) — switch the `fontName` of that specific text node to a broad-coverage system font (Inter usually has full coverage of the symbol blocks); leave the rest of the text on the original font. When using Unicode symbols as icons (↗/♥/★ etc.) instead of vectors — check glyph by glyph with a screenshot; don't assume that because one symbol rendered, the rest from the same block will too.
```js
await figma.loadFontAsync({ family: 'Inter', style: 'Black' });
heartGlyphNode.fontName = { family: 'Inter', style: 'Black' }; // the custom UI font has no U+2665 glyph
```

### measure-text-width-via-hug-toggle-fixed-restore-unsafe
**Principle:** To measure the real rendered width of a TEXT node whose `layoutSizingHorizontal` isn't `HUG` (i.e. `FILL` or `FIXED`), you can temporarily switch to `'HUG'`, read `.width`, and switch back. Switching back to `'FILL'` is safe (recomputed relative to the parent automatically). Switching back to `'FIXED'` is NOT safe: Figma pins the CURRENT (just measured, hug-derived) width as the new FIXED value, without restoring the original explicit number.
**Symptom:** after measuring via a HUG toggle a node with an originally `FIXED` width ends up permanently narrower (or wider) than it was — the discrepancy throws no error and isn't always noticeable at once (the text still fits on one line).
**Pattern:** if the original sizing is `FIXED`, save the numeric width value BEFORE the toggle and restore it explicitly via `resize` after measuring; don't rely on switching the sizing mode back.
```js
if (node.layoutSizingHorizontal === 'FIXED') {
  const savedWidth = node.width;
  node.layoutSizingHorizontal = 'HUG';
  const measured = node.width;
  node.layoutSizingHorizontal = 'FIXED';
  node.resize(savedWidth, node.height); // without this the width stays = measured, not savedWidth
} else {
  // 'FILL' — safe to toggle back and forth without an explicit resize
  node.layoutSizingHorizontal = 'HUG';
  const measured = node.width;
  node.layoutSizingHorizontal = 'FILL';
}
```

### created-text-style-does-not-apply-by-value-match-bind-by-id
**Principle:** `figma.createTextStyle()` and a TEXT node whose `fontName` / `fontSize` / `lineHeight` are set to the same values are unrelated objects — Figma never matches a node to a style by value. A file can carry a full type ramp and zero nodes using it, and nothing in the build reports that: every text renders exactly as specified, the styles panel shows the ramp, and the only tell is `textStyleId === ''` on every node. The text helper takes a style id, not a font tuple, and applies it with `await node.setTextStyleIdAsync(id)`; the readback at the end of the build counts `styled/total`.
**Symptom:** "the styles were created but nothing in the design uses them" — a restyle in the panel changes nothing on the canvas; `getLocalTextStylesAsync()` lists the ramp while `findAllWithCriteria({types:['TEXT']}).filter(t => t.textStyleId).length` is 0.
**Pattern:** resolve style ids once per call by name; the helper sets `characters`, fill, then the style; retrofit an unstyled screen by matching each node's `fontSize + fontName.style` to a style and binding, then re-count.
```js
const styles = await figma.getLocalTextStylesAsync();
const S = name => { const s = styles.find(x => x.name === name); if (!s) throw new Error('no text style ' + name); return s.id; };
const T = async (chars, styleName, fillVar) => {
  const t = figma.createText(); t.characters = chars;
  t.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', fillVar)];
  await t.setTextStyleIdAsync(S(styleName));   // the binding — not fontName/fontSize
  return t;
};
// readback before "done"
const texts = root.findAllWithCriteria({ types: ['TEXT'] });
return { styled: texts.filter(t => t.textStyleId).length, total: texts.length, unstyled: texts.filter(t => !t.textStyleId).map(t => t.id) };
```

### text-metrics-stale-in-sandbox-do-not-center-or-size-by-text-width
**Principle:** In the MCP sandbox a freshly created TEXT node's `width`, `height` and `absoluteRenderBounds` do not recompute after `fontName`, `fontSize`, `lineHeight` or `setTextStyleIdAsync` inside the call that created it — they stay at the default font's metrics for the characters (Inter 12: a five-letter word reads ≈37×15 whatever size was set). No in-call nudge fixes it: write order (font first or characters first), toggling `textAutoResize`, re-assigning `characters`, style binding, or appending into an auto-layout parent — the HUG parent hugs the stale size too. In later calls most nodes report real metrics, but some keep the stale ones indefinitely. The render is right; only the numbers lie.
**Symptom:** a 34px title reads `h: 15`; a label centred with `t.x = (box - t.width) / 2` lands off-centre; a numeric tap-zone or overflow check on text passes or fails for no visible reason; `absoluteRenderBounds` is a third of the rendered glyph box. Reading it as "the sandbox doesn't lay text out" and abandoning numeric checks altogether is the wrong conclusion — only TEXT metrics are affected, and only until Figma recomputes them.
**Pattern:** never derive a position or a size from `text.width` / `text.height` in the call that created or restyled the text — centre with auto-layout alignment (`counterAxisAlignItems`, `primaryAxisAlignItems`) or with constraints, give text a `FIXED` width from the design rather than from a measurement, and verify text geometry by `get_screenshot`, not by arithmetic. When a numeric audit returns `h ≈ 15` on a node whose `fontSize` isn't 12, classify the number as stale and re-read in a later call before filing a finding.
```js
// ❌ off-centre: t.width is the default font's width
pct.x = (ring.width - pct.width) / 2;
// ✅ let layout centre it
const box = figma.createAutoLayout('HORIZONTAL'); box.fills = []; box.resize(84, 84);
box.primaryAxisAlignItems = 'CENTER'; box.counterAxisAlignItems = 'CENTER'; box.appendChild(pct);
```

### apple-system-fonts-exposed-as-sf-pro-family-in-sandbox
**Principle:** Apple's system fonts reach the sandbox as the families `SF Pro`, `SF Pro Rounded`, `SF Compact` and `SF Compact Rounded`, with styles such as `Regular`, `Medium`, `Semibold`, `Bold` and the `Condensed` / `Expanded` variants inside the same family — there are no `SF Pro Display` or `SF Pro Text` families, so a spec written in those names fails on every style with a font-load error. Probe once with `listAvailableFontsAsync` and branch on `family === 'SF Pro'`; the optical size Display/Text is not a separate family here.
**Symptom:** `Cannot write to node with unloaded font "SF Pro Display Semibold"` while `SF Pro Semibold` loads fine.
