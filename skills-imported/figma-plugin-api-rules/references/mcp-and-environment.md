---
name: figma-plugin-api-rules/mcp-and-environment
description: Read when actively orchestrating use_figma and the MCP read tools — node lookup (query/findOne), pages, rate limits, subagents, screenshots/export, response truncation, verification recipes, visual regression
---

# mcp-and-environment — use_figma rules

### node-query-no-spaces-in-names
_Core: full text — `../SKILL.md`._

### mcp-read-tools-subagent-propagation
**Principle:** The Figma MCP read tools (`get_screenshot`, `get_metadata`, `get_design_context`, `get_variable_defs`) propagate into subagents' context and work there; the shared rate limit of a Professional plan is ~70–100 calls/day (aggregate), reset at 00:00 UTC.

### page-ids-unstable-refind-by-name
_Core: full text — `../SKILL.md`._

### search-design-system-libraryname-filter
**Principle:** In `search_design_system` filter results by the target library's `libraryName`, and bear in mind that component names in the library may have been renamed — check the actual name, not the expected one.

### setcurrentpageasync-edit-vs-createinstance
**Principle:** `getNodeByIdAsync` works cross-page for `createInstance` but not for editing: `setCurrentPageAsync` is needed only before changing a component's properties, while when inserting an instance the target page must be the active one.

### appendchild-returns-void
_Core: full text — `../SKILL.md`._

### node-children-throws-non-container
_Core: full text — `../SKILL.md`._

### upload-assets-async-crop-race
**Principle:** The auto-placement of `upload_assets` sets `scaleMode:'CROP'` asynchronously AFTER the POST response and overwrites the `FILL` you set on the same node (a race).
**Symptom:** only the top part of the image is visible ("half a screenshot"), `imageTransform=[[1,0,0],[0,1,0]]`, the node is back to CROP.
**Pattern:** take only the `imageHash` from the response, put the image into your own frame with an explicit `{type:'IMAGE', scaleMode:'FILL'}`, and delete the auto-placed node (`placedOnNodeId`) after a ~4 s pause to let things settle.
```js
// ❌ setting n.fills=[FILL] on the node created by upload_assets → the race returns CROP
// ✅ your own frame by hash:
const f = figma.createFrame();
f.resize(360,800); f.clipsContent = true;
f.fills = [{type:'IMAGE', scaleMode:'FILL', imageHash:'<hash>'}];
```

### upload-assets-4096px-render-limit
**Principle:** `upload_assets` accepts an image with a long side >~4096 px and returns `success:true` + a valid `imageHash`, but Figma doesn't render an IMAGE fill of that size — the render limit is ≈4096 px on the long side; downscale before uploading (the frame can stay wider: FILL upscales).
**Symptom:** the fill is set (`scaleMode:'FILL'` visible in the API, the node isn't CROP), but visually the frame is empty — only the container; shows only on ultra-wide images.
```bash
# ✅ downscale BEFORE upload_assets; the aspect ratio is preserved
sips --resampleWidth 4096 wide.png --out wide_4096.png
# the frame can stay any width (e.g. 4808) — FILL upscales 4096→frame; the text stays readable
```

### annotations-color-enum-violet
_Core: moved to `references/annotations.md`._

### findone-type-guard-first-operand
_Core: full text — `../SKILL.md`._

### findone-first-match-traversal-order
_Core: full text — `../SKILL.md`._

### currentpage-resets-to-first-page
_Core: full text — `../SKILL.md`._

### screenshot-clipscontent-scroll-crop
**Principle:** `node.screenshot()` / `get_screenshot` on a descendant inside a clip-scroll container (`clipsContent:true`, narrower than its content) renders only the visible area — even when screenshotting the widest child itself, and even after a temporary `clipsContent=false` + resize of the ancestors in a previous call; verify content beyond the visible area by property inspection, not by screenshot.
**Symptom:** the screenshot stably returns the clip container's width instead of the node's full width, as if the unclip + resize hadn't taken (looks like a server-side render cache).
**Pattern:** verify via `componentProperties`, x/width, INSTANCE_SWAP values via `getNodeById`; don't spend calls on repeat screenshot attempts after the first failure. To verify the TEXT content (not structure/variant) of a clipped node — `get_design_context` is more reliable: it returns the exact text of all nested `<p>`/text nodes as code, not a render, and the parent's clipping doesn't affect it at all (checked on a production admin-dashboard table: `get_screenshot` on a `TABLE` node inside a clipped table container stably returned the container's 1152 width instead of the real 4984+ px; `get_design_context` on the same ROW node immediately gave the full exact list of 24 columns).
```js
// Doesn't work reliably for checking content beyond the visible width of a scroll container:
tableContainer.clipsContent = false;
tableContainer.resize(2900, tableContainer.height);
// ... the next get_screenshot(nodeId) still returns width:1152/1176
```

**Clarification (when a visual screenshot is needed after all, not only text):** if the structure HAS several nested clip containers (e.g. an outer layout wrapper and an inner table container — both `clipsContent:true` independently), temporarily disabling the clip only on the OUTER ancestor has no effect — the export is still cut by the clip container NEAREST to the target node. Walk the whole parent chain (`let p = node.parent; while (p) {...}`) and collect ALL `clipsContent:true` nodes; disable precisely the nearest one (usually the table container itself, not the outer layout wrapper); then `node.screenshot({scale})` returns the full unclipped width — don't forget to restore `clipsContent=true` right after the screenshot.
```js
// Find ALL clip ancestors, not just one — the nearest to the target is usually the culprit
let p = targetNode.parent, clips = [];
while (p) { if ('clipsContent' in p) clips.push({ id: p.id, name: p.name, clipsContent: p.clipsContent }); p = p.parent; }
// clips[0] (the nearest parent) — often the one that clips, not the outer "Main layout"
const nearest = await figma.getNodeByIdAsync(clips[0].id);
nearest.clipsContent = false;
const shot = await targetNode.screenshot({ scale: 0.5 }); // full width now
nearest.clipsContent = true; // restore right after
```

**Clarification (a table in another tab of the same file):** "disable only the nearest" isn't universal — there may be more than one pair of clips, and they are NOT necessarily adjacent links of one chain. On that node 4 independent `clipsContent:true` ancestors were found at DIFFERENT levels: the table container (the nearest — the table's own horizontal-scroll mechanism), its wrapper frame (second level), the outer layout wrapper (covering the whole tab, unrelated to the table), and the tab frame above that. Disabling only the nearest (the table container) had no effect — the same cropped width of 1152. All 4 had to be collected via the parent-chain walk and disabled at once; only then did `node.screenshot()` return the full 2328 px. Practical conclusion: don't take "nearest = culprit" as an axiom — collect ALL `clipsContent:true` ancestors and disable them ALL at once for inspection; restore them all at once afterwards too. `contentsOnly:true` on `get_screenshot` doesn't help here at all — that flag is about isolation from overlapping neighbours (connectors over a section, etc.), not about clip ancestors.

### findone-object-identity-indexof
_Core: full text — `../SKILL.md`._

### annotations-label-escapes-angle-brackets
_Core: moved to `references/annotations.md`._

## Screenshots and export to disk

**The right workflow:**
1. `get_screenshot(nodeId, fileKey)` — for viewing in the dialogue only, NOT for saving to disk. By default it returns a **short-lived URL, not image bytes** — treat anything you don't consume immediately as already expired. Either pass `enableBase64Response: true` to get the image inline, or `curl` the URL to disk right away and read it from there.
2. The only reliable way to save a node's screenshot to disk otherwise is a manual Export via Figma Desktop: select the node → Inspector → the Export section → `+` → "Export [name]" appears → click → the Save As dialogue → choose a folder → Save.
3. The Figma MCP Professional limit resets once a day, at 00:00 UTC.

**Dead ends — don't spend calls on these:**
- A desktop-screenshot tool with a save-to-disk option (e.g. a computer-use MCP) — saves the wrong window (not the one visible in the dialogue).
- `screencapture -D N` + `sips` — works only if you know the exact display number AND Figma hasn't moved to another file; unstable.
- `use_figma` + `exportAsync` → hex/bytes — the response is truncated at ~20 KB; a full PNG is never transferred.
- Chunked `exportAsync` — needs 10–15 `use_figma` calls per screenshot; burns the Figma MCP daily limit.
- `node.screenshot()` in `use_figma` — inline viewing only; doesn't save to disk.

**Pixel acceptance against a saved screenshot** — once both PNGs are on disk, use ImageMagick's `compare` outside the MCP call:
```bash
compare -metric AE approved.png now.png diff.png          # raw count of mismatched pixels
compare -metric AE -fuzz 2% approved.png now.png d2.png   # 0 = PASS (tolerates anti-aliasing noise)
```

**Hash-based proof that an edit didn't move a pixel** — cheaper than a visual diff when the claim is "this changed structure but not appearance":
```js
// FNV-1a-style hash: no deps, fast enough to run before/after in the same call,
// good enough to catch "this export changed" without a full image diff.
function h(b) { let a = 0x811c9dc5; for (let i = 0; i < b.length; i++) { a ^= b[i]; a = (a * 16777619) >>> 0; } return b.length + ':' + a.toString(16); }
const before = h(await master.exportAsync({format: 'PNG'}));
/* edits */
return {identical: before === h(await master.exportAsync({format: 'PNG'}))};
```

## Visual regression via MCP

Checking a design edit (a DS migration, a rebind, a refactor) for regressions without manually viewing the screens, by agents. A three-layer pipeline, cheap → expensive:

1. **Structural diff (free, no render).** `use_figma` dumps every document-level node of the page (w/h, position, mainComponent set key, variant, text) in both files (current vs backup) → comparison by id → categories: an expected swap (the key changed, geometry stable) vs flags (layout_shift / text / vis / removed / added). Catches the regression signal across the whole file without rate-limit cost.
2. **Pixel diff only on the flagged screens.** `get_screenshot` in both files, `pixelmatch` (includeAA=false) → diff + ratio. Fits within the Figma daily limit (~70–100 screenshots/day).
3. **AI triage** of the flags: a vision agent separates real regressions from AA noise.

Key facts:
- Figma duplicates preserve node ids → matching by id; exclude synthetic `;` ids (instance-internal — they spawn phantom removed/added on swaps).
- The `use_figma` return cap — the same 20 KB / a safe budget of ~14000 characters as in `use-figma-result-hard-truncated-at-20kb-plan-recursive-capture` below → pagination, `LIMIT≈80` (recompute for the actual budget, not for 25k).
- The diff mixes migration effects with the designer's intentional edits → user triage is always needed, not an automatic reject.
- Keep the implementation in your own tooling notes — it is reusable across files, unlike the node ids it runs on.

### library-import-key-format-lk-hash
**Principle:** Library keys for `importComponentByKeyAsync` have the format `lk-<hash>` — never construct them by hand; always obtain them via the `search_design_system` MCP with a `libraryName` filter; the same component in different files has different keys; only the pair (libraryName + componentName → key) can be cached, per session.
(Distinct from the existing `search-design-system-libraryname-filter`: that one is about renamed component names, this one — about the key format and the caching scope.)

### get-metadata-no-nodeid-timeout-on-huge-pages
**Principle:** `get_metadata` without a `nodeId` (or with the `nodeId` of a whole top-level page) does a full recursive XML dump of the entire subtree — on a large/draft page (hundreds of nodes and Figma comments, e.g. another author's volatile draft page) it can **time out** instead of returning a large-but-finite result. On a moderately large, not gigantic page (2 SECTIONs, ~800 lines of XML, ~85K characters) there's no timeout, but the result exceeds the tool's allowed token limit and comes back as the error `exceeds maximum allowed tokens` instead of data — the same root pattern (a full recursive dump is unfit for medium+ pages), a different specific symptom.
**Symptom:** `Tool call timed out waiting for server response` when calling `get_metadata` on a whole top-level page (or without a `nodeId` — the already-run "list top-level pages" call doesn't time out; it's the drill-down into a specific huge page that does). Or (smaller pages): `Error: result (N characters) exceeds maximum allowed tokens` — the tool returns the error at once, without a timeout, also without useful data.
**Pattern:** don't repeat the same call. Instead of a full XML dump — a targeted read-only `use_figma` listing only `page.children` (id/name/type/x/y/w/h, no recursion):
```js
const p = figma.root.children.find(pg => pg.id === 'PAGE_ID');
await figma.setCurrentPageAsync(p);
return p.children.map(c => ({ id: c.id, name: c.name, type: c.type, x: c.x, y: c.y, w: c.width, h: c.height }));
```
If a specific deeper node is needed — address it by `nodeId` directly (`get_metadata`/`get_screenshot` on a specific known node don't have this problem; only the full dump of a large page times out). For a page-level overview, a compact one-line-per-node dumper that doesn't descend into instance internals keeps even a 200-node page well under the token ceiling:
```js
// One line per node keeps even a 200-node page well under the token ceiling
// that get_metadata's full JSON tree blows through; instance internals are
// the main component's concern, not this page's, so skip them.
function dump(n, depth = 0) {
  console.log('  '.repeat(depth) + `${n.type} "${n.name}" ${n.id}`);
  if (n.type === 'INSTANCE') return;
  for (const c of n.children ?? []) dump(c, depth + 1);
}
```

### scaled-isolated-screenshot-can-misread-component-identity
**Principle:** `node.screenshot({scale: N})` on a small (~20×20) isolated instance magnified N times (e.g. `scale:10` → 200×200) can visually mislead about what the component represents — at magnification it's easy to confuse a checkbox with a tick (`Selected=Yes`) with a decorative icon glyph (e.g. "copy/duplicate"), especially when the component's name (`Checkbox`) doesn't match the expected semantics of the reference the user gave. An isolated crop without surrounding context (real use, the real ~20 px size next to text) removes the cues that in context would immediately say "this is a checkbox".
**Symptom:** a reference instance the user pointed at as the basis for an icon glyph reads on the first (magnified, isolated) check as one visual meaning (e.g. a "copy" glyph), but on a repeat check in the real usage context (native size, embedded in a demo row next to text) reads completely differently (an ordinary checkbox) — the discrepancy is confirmed by identical `componentProperties`/`mainComponent.id` between the fresh copy and the original (not an instantiation bug — a perception bug on the first check).
**Pattern:** for reference icons whose semantics aren't obvious from one magnified screenshot — check `instance.name` (the literal component name, e.g. `Checkbox` — already a signal) and `mainComponent.name` (the variant combination, e.g. `Selected=Yes` — also a signal) before trusting only the visual reading of a zoomed screenshot; or embed the reference into a real demo context at once (native size, next to text) before fixing the choice in the canon/plan. If the name/properties suggest a different meaning from the expected one — stop and clarify with the user; don't keep building on an unverified visual impression.

### get-metadata-zero-children-on-raster-fill-frame
_Checked while cataloguing a photo-verification scenario._
**Principle:** `get_metadata` returns `childCount: 0` (literally zero child layers) for a frame with visually rich content (a modal, a bottom sheet with text and buttons) — if that content is inserted as **a flat raster image fill on the frame itself** rather than as live child nodes. The node tree doesn't see the content inside a fill, only real child layers. Confirmed twice by independent `get_metadata` calls (both via a desktop-bridge server and via the remote server with a real fileKey) on 4 different nodes — not a fluke of one call.
**Symptom:** a frame with a telling name ("How it works", "Before you start...") and clearly non-empty visual content is reported as `childCount: 0` / empty — easy to misclassify as a decorative stub or a placeholder and miss real content.
**Pattern:** don't trust `childCount: 0` as an indicator of "nothing here" without a re-check via `get_screenshot` on the same node. If the screenshot shows content and `get_metadata` shows zero children, the frame is a flat image fill, not a live structure: `get_design_context` won't extract anything useful either (nothing to extract structurally). For a file audit/catalogue — record the raster-vs-live status explicitly per frame; it matters if the content is planned to be reused/changed programmatically (a raster version can't be edited other than by fully replacing the image).

### get-screenshot-maxdimension-caps-never-upscales
_Checked during a per-frame export of 18 frames of an onboarding-verification flow._
**Principle:** The `maxDimension` parameter of `get_screenshot` only **caps** (downscales) the long side — it NEVER upscales above the node's natural pixel size. A node smaller than `maxDimension` renders at its natural 1x resolution. The response carries both `width`/`height` (what was actually rendered) and `original_width`/`original_height` (the node's natural size before clamping) — compare them to tell whether a downscale happened.
**Symptom:** an export with `maxDimension: 2048`: desktop frames 1104×712 came back exactly 1104×712; mobile 375×812 → 375×812 (1x), not 2048 on the long side. For small mobile frames (375 px wide) this means a low final image resolution, and raising `maxDimension` doesn't cure it.
**Pattern:** to raise export sharpness ABOVE the node's natural size — `maxDimension` is useless; you need `node.exportAsync({format:'PNG', constraint:{type:'SCALE', value:2}})` via `use_figma`, or actually enlarge the node. The URL in the response is short-lived ("treat like a secret") — download with `curl` at once in the same batch; batch get_screenshot by ~6 and curl the batch while the URLs are alive (18 exports = 3 batches of 6; download each batch immediately).

### parallel-workflow-agents-growing-sibling-sections-need-a-page-level-coordination-pass
**Principle:** When several parallel workflow agents independently fix/re-lay content inside THEIR OWN SECTION nodes (each in isolation — the right pattern to avoid write conflicts), and at least one agent **grows its section's size** (`resizeWithoutConstraints`) for new content — none of the agents sees or checks the positions of NEIGHBOURING sections on the page, because each is (rightly, for isolation) given only its own scope. If the sections on the page originally stood flush against each other (without a large X/Y margin), the growth of one section "eats" the gap to the neighbour, and the page acquires a NEW page-level section-on-section overlap that didn't exist before the parallel pass.
**Symptom:** the final cross-check agent (or a manual check) finds several sections visually overlapping — the content of one section (especially later z-order neighbours) covers/clips the content of another, although EACH section separately (on an isolated screenshot) looks perfectly tidy with no internal overlaps. A separate trap: the final checking agent may ITSELF read the bboxes of different sections with DIFFERENT methods (a `use_figma` direct read of `node.x` vs a `get_metadata` XML dump) — if the coordinate spaces of these methods diverge even slightly, the check gives a FALSELY CLEAN result for some section pairs (matching by chance for some pairs, not for others) — don't trust bbox comparisons of mixed provenance; read ALL sections with ONE method in ONE script for an honest pairwise comparison.
**Pattern:** (1) after a parallel pass in which ANY agent may have grown its section — a separate, sequential (not parallel) final pass is mandatory, reading `x/y/width/height` of ALL affected top-level SECTION nodes in ONE script (`node.x`/`node.y`/`node.width`/`node.height` directly on each, without mixing sources) and computing pairwise bbox intersections arithmetically. (2) If intersections are found — fix by shifting `.x`/`.y` of the SECTION ITSELF (without touching the content inside): a section's children are stored in coordinates LOCAL to the section's origin (like a FRAME), so shifting `section.x` moves the whole section with its content as one — no need to recompute the children's positions by hand. (3) Build a "who can collide with whom" dependency graph by the actual intersection of Y ranges (sections with non-overlapping Y are automatically safe at any X — don't waste a shift on them), and resolve the remaining X conflicts by a sequential left-to-right shift with a constant gap (100–200 px, by the file's convention).
```js
// The final check with ONE method on ALL sections — don't mix a use_figma read and a get_metadata XML for different sections
const ids = ['id1', 'id2', 'id3'];
const boxes = [];
for (const id of ids) {
  const n = await figma.getNodeByIdAsync(id);
  boxes.push({ id, x: n.x, y: n.y, right: n.x + n.width, bottom: n.y + n.height });
}
// pairwise intersections arithmetically, then fix by shifting section.x (not the content inside)
```

### inline-node-screenshot-may-not-resolve-explicit-mode-pin-use-get_screenshot-to-verify
**Principle:** An inline `await node.screenshot()` inside a `use_figma` script doesn't always resolve an explicit variable-mode override pinned on an ancestor frame via `setExplicitVariableModeForCollection` (the standard pattern for Tests/composition frames pinned to a specific brand mode, e.g. Light/Dark). The separate MCP tool `get_screenshot` resolves it reliably.
**Symptom:** one and the same node screenshotted TWO ways in a row with no changes between the calls gives DIFFERENT pictures: the inline `node.screenshot()` — a light background instead of the expected dark/black, some content looking faded/empty (e.g. an icon renders as an empty outline); `get_screenshot` on the same ID right after — a correct dark/black background, a full icon. Trap: checking a fix ONLY with an inline screenshot makes it easy to wrongly conclude the fix didn't work or broke something else.
**Pattern:** to verify any fix on a mode-pinned composition/Tests frame — use a separate `get_screenshot` call; don't trust the inline `node.screenshot()` as the final source of truth (fine for a quick rough structure check, not for colour verification on explicit-mode frames).

### transient-sse-parse-error-on-read-retry-not-payload-size
**Principle:** `get_metadata` and read-only `use_figma` calls may fail with `Failed to parse SSE message... EOF while parsing a string` — transport instability of the MCP connection (a dropped/truncated SSE chunk), not a bug in the script itself and not an exceeded response-size limit. Observed on payloads of very different sizes in one session (from ~800 to ~4300 characters) in a row — reducing the returned volume (fewer fields, `JSON.stringify` instead of an object, a shallower walk) didn't give a reliable fix.
**Symptom:** the same (or a structurally similar, slightly smaller) read script fails with this error 2–3 times in a row on different payloads, then suddenly passes without any code changes — reproduces irregularly within one session.
**Pattern:** on this error — simply repeat the same (or a slightly simplified) read call; don't spend attempts on shrinking the payload as the presumed cause. Write calls (`use_figma` with node mutations) in the same unstable window ran stably — if the write is what matters, not the read, mutations can continue without waiting for reads to recover.
**Distinguish by the column in the error.** `EOF while parsing a string at line 1 column N` with N in the tens of thousands (seen at 33 000–35 000) is the size of the answer, not the connection: the same script fails every time, and the same question with a compact return (counts and ids instead of lists of names) passes at once. Shrink the return instead of retrying. In both cases only the answer was lost — the script itself has already run. A write inside a call that failed this way has landed, and running it again applies it twice: re-read the state before retrying any write.

### get-metadata-xml-frame-tag-does-not-reflect-real-node-type
**Principle:** `get_metadata` tags some atypical nodes (in particular `GROUP`) as `<frame>` in its XML output — a serialisation simplification of the MCP tool itself, not a reflection of the real `node.type` in the live Plugin API. Relying on the XML tag for type guards in a subsequent `use_figma` script (e.g. `n.type === 'FRAME'`) gives a false-negative search on nodes the XML showed as `<frame>` but which are really `GROUP`.
**Symptom:** `get_metadata` shows `<frame id="X" name="Icon"...>`, but `(await figma.getNodeByIdAsync('X')).type` returns `'GROUP'` — a script with the filter `n.type === 'FRAME' && n.name === 'Icon'` doesn't find the node (`null`) and fails on the next `.findOne` with `TypeError: cannot read property 'findOne' of null`.
**Pattern:** for type-sensitive traversal over nodes seen via `get_metadata` — search by name WITHOUT a type check (`n.name === 'Icon'`), or explicitly re-read the real `.type` via `use_figma` before relying on it in a filter. Don't trust the `get_metadata` XML tag as the source of truth about `node.type` for the FRAME/GROUP distinction.

### use-figma-result-hard-truncated-at-20kb-plan-recursive-capture
**Principle:** The `use_figma` result is hard-cut by the transport at **20 KB** — deterministically, not as a transient SSE failure (see `transient-sse-parse-error-on-read-retry-not-payload-size` above: that one is cured by a retry, this one never). Any attempt to "capture a node whole in one call" on a real screen is doomed: a full list screen of a production admin dashboard serialises to hundreds of kilobytes. Returned strings in the response are also escaped (≈×1.2), so the safe budget is **~14000 characters of raw JSON per call**, and objects must be returned, not a pre-made `JSON.stringify` (double escaping bloats the payload). Anything that returns bulk payload (SVG strings, long dumps) has to be batched to fit: ~13 icon-sized SVGs per call, not 40. Size the batch, then check the last element actually came back whole.
**Symptom:** the response arrives cut mid-string, sometimes with the literal marker `// truncated to 20kb`; the trailing fields of the returned object (counters, lengths, checksums) are lost entirely — i.e. exactly what could have detected the truncation disappears. No error is thrown: you silently get incomplete data and, if unchecked, write it to disk as a "snapshot".
**Pattern:** recursive capture with a budget: if it doesn't fit — return the node's own fields + the list of child ids and descend one level, then assemble the tree on disk. Always return the chunk's expected length along with it and compare with what was actually saved — otherwise truncation isn't detected. For nodes of hundreds of kilobytes the Figma REST API (`/v1/files/{key}/nodes?ids=…&geometry=paths`) is cheaper, with the response coerced to the same shape; equivalence must be proven by reproducing an already-finished fixture byte for byte, not claimed.
```js
const full = JSON.stringify(await serialize(node, depth));
if (full.length <= 14000) return { mode: 'full', node: await serialize(node, depth), size: full.length };
return { mode: 'split', own: await own(node), childIds: node.children.map(c => c.id), size: full.length };
```

### skip-invisible-instance-children-defaults-true-in-use-figma
**Principle:** In the `use_figma` sandbox the flag `figma.skipInvisibleInstanceChildren` defaults to **`true`**. Two consequences: (a) invisible nodes inside INSTANCE subtrees are absent from `node.children` entirely; (b) an invisible INSTANCE on cold access returns `children: []`, even when its own sublayers are visible. A tree walk is therefore not equivalent to what really lies in the file.
**Symptom:** the node count obtained by a plugin walk is smaller than via the Figma REST API, and the discrepancy is concentrated exactly in hidden branches (hidden variants, collapsed states, `visible=false` instances like a user card / the search-input component / a hidden Action bar). When reconciling two sources it looks like "REST lies", while it's the sandbox default that lies.
**Pattern:** for a full walk including hidden content — set `figma.skipInvisibleInstanceChildren = false` at the start of the script. An adjacent difference when reconciling with REST: REST returns a sublayer's **authored** visibility, the plugin — the **effective** one, with the owning instance's boolean property already applied; REST doesn't return `cornerRadius` for SECTION/CONNECTOR and omits `primaryAxisSizingMode` at `layoutMode: NONE` (where `counterAxisSizingMode` is always `FIXED`).

### get-metadata-without-nodeid-returns-partial-page-list
**Principle:** `get_metadata` without a `nodeId` is documented as "the list of the document's top-level pages", but actually returns only a subset — apparently only the pages loaded in the desktop app. As an inventory of a file's pages it's unreliable; the full list comes only from `figma.root.children` via `use_figma`.
**Symptom:** the call returned 4 pages for a file that has 71. A page for which the same tool had just successfully returned XML by an explicit `nodeId` was absent from the list — i.e. the response contradicts itself within two consecutive calls.
**Pattern:** for any task of "which pages exist in the file / where a section lives" — straight to `use_figma` with `return figma.root.children.map(p => ({id: p.id, name: p.name}))`. Use `get_metadata` only with an explicit `nodeId` for an XML dump of a subtree.

### page-loadasync-reads-many-pages-in-one-call
**Principle:** `await page.loadAsync()` loads a page's content **without** switching to it, so a read-only walk of many pages is done in one `use_figma` call. The rule "no more than one `setCurrentPageAsync` per call; spread multi-page work across parallel calls" concerns changing the current page, not reading as such.
**Symptom:** the task "read the top level of 13 pages" looks like 13 parallel calls under the MCP daily limit; in fact one suffices.
**Pattern:**
```js
const out = [];
for (const id of pageIds) {
  const p = await figma.getNodeByIdAsync(id);
  await p.loadAsync();                       // without setCurrentPageAsync
  out.push({ page: p.name, top: p.children.map(c => ({ id: c.id, t: c.type, name: c.name })) });
}
return out;
```
This isn't suitable for writing — there `setCurrentPageAsync` and its restrictions still apply (see `currentpage-resets-to-first-page` in the core). Verified on a production admin dashboard — 13 pages (11 sections + Patterns + sandbox) read in one call instead of thirteen.

### sharedplugindata-namespace-is-not-enumerable

**Principle:** `getSharedPluginData(namespace, key)` requires knowing the namespace in advance — there is no API for enumerating namespaces. Data written under an undocumented namespace is machine-unfindable: all that remains is guessing. Therefore the namespace and the key set must be recorded in the repository next to the rule that requires this data — otherwise the next session can neither read it nor prove it's absent.
**Symptom:** a subtree walk doesn't find previously written data; trying plausible namespaces (`canon`, `derived`, `adminCanon`…) yields nothing, although the values appear in reports as written. An extended search finds them under the fourth or fifth guess.
**Pattern:** at the moment of the first write — record the namespace, the keys and the value's algorithm in a doc. A namespace without hyphens (a hyphen in the namespace breaks `setSharedPluginData`); keys in camelCase. A value whose computation method isn't recorded is unverifiable forever: there's nothing to recompute it with, and matching itself proves nothing.
```js
// the namespace and the keys are part of the contract, not an implementation detail
node.setSharedPluginData('admin_canon', 'sourceFingerprint', sha256);
node.setSharedPluginData('admin_canon', 'fingerprintAlgo', 'sha256/v1 <path to the script that computes it>');
```

### get-screenshot-returns-1x1-placeholder-fall-back-to-rest-images

**Principle:** `get_screenshot` can return a correct-looking response (real `original_width`/`original_height`, a live `image_url`) and yet **a 149-byte 1×1 PNG**; an inline `await node.screenshot()` in the same window returns an empty frame. This is a render failure on the service side, not a node problem (see also the differentiator from the clip variant in `get-screenshot-degenerate-1x1-when-clipped` below): the same node renders fine via the Figma REST `/v1/images`. Don't spend attempts on tweaking `maxDimension`, `scale` and the node type — check the fact of the downloaded file (`file`/`sips`), not the response fields.
**Symptom:** the response says `"width":1,"height":1` with correct `original_*`; `curl` downloads 149 bytes; `file` says `PNG image data, 1 x 1`. The inline screenshot looks like a tiny white rectangle. Easy to take for "the node is empty" or "the clip ate the content".
**Pattern:** fall back to REST — a specific project's REST API token usually lives in its own repository as a separate `.env` file with its own variable names (project-specific — record the exact path and variable names in your own per-project notes; in one project it was a `FIGMA_REST_API_TOKEN`/`FIGMA_FILE_KEY` pair in its own credentials directory):
```bash
curl -s -H "X-Figma-Token: $FIGMA_REST_API_TOKEN" \
  "https://api.figma.com/v1/images/$KEY?ids=9259-3575,9277-4702&format=png&scale=2"
# → {"images":{"9259:3575":"https://…"}}; the id in the query uses a hyphen, in the response a colon
```
A separate rule of the same REST: for some **SECTION** nodes it stably returns `null` in `images` (three times in a row, with `err: null`), while the FRAMEs nested in them render at once. Render frames, not the section.

### findall-returns-a-partial-subtree-count-with-an-explicit-dfs

**Principle:** `node.findAll` in the `use_figma` sandbox can return an **incomplete subtree** — silently, without error and without a truncation marker. On one and the same node: `SECTION.findAll( => true)` → 104 nodes; an explicit recursive walk of the same node → **801**. The discrepancy isn't explained by `skipInvisibleInstanceChildren` (the flag was lifted) or by a "cold" page (`page.loadAsync()` was done — the numbers are the same). Any counter taken via `findAll` (the number of instances, TEXT nodes, detached ones) may be undercounted several times over.
**Symptom:** mutually contradictory measurements of one node: `findAll` on a SECTION gives fewer than `findAll` on its own child FRAME (104 vs 188). A predicate search "doesn't find" nodes that definitely exist: `frame.findAll(n => n.name === 'Nav item')` → 0, while `sidebar.findAll(...)` on a nested instance of the same tree → 13. On freshly assembled nodes the behaviour differs — there `findAll` returns the full tree, so the discrepancy doesn't reproduce on "your own" page and surfaces on someone else's.
**Pattern:** for any **number** that will go into an artefact — an explicit walk with a type guard on container types; keep `findAll` for finding a single node, and even then with a re-check. And record, next to the value, the method it was obtained by — otherwise the next reader gets a different number by the same legitimate means.
```js
const CONT = new Set(['FRAME','COMPONENT','COMPONENT_SET','INSTANCE','GROUP','SECTION','BOOLEAN_OPERATION']);
function dfs(n, acc) {
  acc.nodes++; if (n.type === 'INSTANCE') acc.inst++;
  if (!CONT.has(n.type)) return;
  let kids = []; try { kids = n.children; } catch (e) { return; }
  for (const c of kids) dfs(c, acc);
}
```

### rest-image-render-can-come-back-cold-without-image-fills

**Principle:** The Figma REST `/v1/images` can return an **under-loaded** frame: the vector and text parts are drawn while the raster fills (flags, avatars, any IMAGE fill) are missing. No error; the size and structure are right — from such a frame it's easy to conclude "the element isn't there" or "the icon doesn't render".
**Symptom:** a pairwise diff of two renders of one node before and after a small edit gives differences across the whole frame, not only in the edited spot: the text "doubles" with a 1 px shift, and somewhere a whole element surfaces (in the observed case — a flag in a language switcher) that wasn't in the first frame.
**Pattern:** before declaring a visual finding a defect — **re-render the node a second time and compare pixel by pixel**. A byte-for-byte match means the finding is real; a mismatch means a cold frame, and conclusions drawn from it must be redone. Cheap: one extra request.
```python
from PIL import Image, ImageChops
a, b = Image.open('pass1.png').convert('RGB'), Image.open('pass2.png').convert('RGB')
print(ImageChops.difference(a, b).getbbox())   # None → the frame is stable
```

### get-metadata-hides-real-children-on-some-frame-nodes-not-just-raster-fills
**Principle:** Separately from the already documented `get-metadata-zero-children-on-raster-fill-frame` (there children REALLY aren't there — the content is a flat image fill) — `get_metadata` can show `<frame... />` (self-closing, no children) for a node that via a direct `use_figma` walk (`node.children`) turns out to have REAL live child nodes (vectors, nested frames). The specific trigger isn't established (not tied predictably to nesting depth — reproduced both on top-level icons and on 3–4-level nested ones), but it recurs systematically on the same nodes across repeat calls; not a one-off glitch.
**Symptom:** `get_metadata` on a specific nodeId draws the node without children; meanwhile (a) an earlier `use_figma` walk of the same tree (over `node.children`) already found and counted this very node's children, OR (b) a neighbour in the pattern (the same component on another card/instance) shows children normally via `get_metadata` — a discrepancy within one and the same structure gives away that it's the tool, not the fact. Example: an `icon-logo-mark` icon (two `Vector` paths of the glyph) and a profile card's "Photo" placeholder (an `online status dot` icon hidden inside) — both were reported empty via `get_metadata`, both turned out non-empty via `use_figma`.
**Pattern:** for structural decisions (how many children a node has, whether to descend) don't trust `get_metadata`'s absence of children as proof of emptiness — re-check via a direct `use_figma`: `(await figma.getNodeByIdAsync(id)).children.length`. Especially important before classifying a node as "already clean" / "nothing to convert" on the basis of a `get_metadata` dump alone.
```js
const n = await figma.getNodeByIdAsync(id);
return { metadataSaidEmpty: true /* from the XML dump */, actualChildCount: n.children ? n.children.length : 0 };
// actualChildCount > 0 with an empty get_metadata → the tool under-reported; not a fact about the node
```

### get-metadata-page-list-shows-only-loaded-pages
_See `get-metadata-without-nodeid-returns-partial-page-list` above in this file — the same fact (`get_metadata` without a `nodeId` returns only the loaded pages, not the full list), the same fix via `figma.root.children`._

### clipscontent-true-with-stale-height-hides-content-from-canvas-and-export
**Principle:** A top-level frame with `clipsContent: true` and a height not recomputed after content was added below its current boundary is a real visual clip, not just an "imprecise metadata field": the clipped nodes are visible neither in `get_screenshot` nor in export, although structurally (`get_metadata`, a tree walk) they look normal. Child containers inside may themselves have `clipsContent: false` and honestly carry correct (if also not updated from outside) sizes — it's the top frame that clips, if it has `clipsContent: true`.
**Symptom:** `get_screenshot` of a node deep inside such a frame returns `width:1, height:1` instead of a real image (see `get-screenshot-degenerate-1x1-when-clipped` below) — or, when shooting the top frame whole, the content simply breaks off at the boundary; looks like "the page ended", although structurally there are more nodes below. Sometimes the bug is already documented by an existing Dev Mode annotation ("clipped by the frame edge"), but the frame doesn't grow for years because the annotation isn't tied to an automatic check.
**Pattern:** before declaring a section/table "under-drawn" or "empty" — check `clipsContent` and the height of EVERY ancestor up to the top-level frame (the `node.parent` chain), not only the node itself. If the top frame clips and the real content is below — compute the true bottom edge (`parent.y + child.y + child.height`, cumulatively along the whole chain) and `resize(width, trueBottom)` the frame. Child pinned elements (`constraints.vertical: 'MAX'`) move to the new bottom by themselves — see `bottom-pinned-constraint-follows-parent-resize` in `layout-and-geometry.md`.
```js
async function clipsChain(id) {
  const results = [];
  let n = await figma.getNodeByIdAsync(id);
  while (n) {
    results.push({ id: n.id, name: n.name, clipsContent: 'clipsContent' in n ? n.clipsContent : null, height: n.height });
    n = n.parent;
    if (n && (n.type === 'PAGE' || n.type === 'DOCUMENT')) break;
  }
  return results;
}
```

### get-screenshot-degenerate-1x1-when-clipped
**Principle:** `get_screenshot` of a node that physically lies outside the visible (clipped) area of an ancestor returns no error — it gives a "successful" response with `width:1, height:1` (while `original_width`/`original_height` in the response honestly show the node's true size). This is a reliable diagnostic signal of a hidden clip, distinguishable from "the node is just empty/white" (that would give a normal size with a flat fill).
**Symptom:** a screenshot of a specific table cell/row returns an almost-zero picture with perfectly correct `fills`/`characters` on the text nodes read via `get_metadata` — the first suspicion should fall on an ancestor's `clipsContent`, not on "the text is invisible/transparent".
**Pattern:** see `clipscontent-true-with-stale-height-hides-content-from-canvas-and-export` above — the same bug; this principle just describes how to catch it from a single screenshot call without walking the whole ancestor chain.
**Distinguish from** `get-screenshot-returns-1x1-placeholder-fall-back-to-rest-images` above: the same 1×1 signature with correct `original_*` is possible WITHOUT an ancestor clip too — as a render failure on the service side. Differentiator: collect `clipsChain` (see the pattern above) — if no ancestor clips the node and 1×1 still comes back, it's a server-side render failure (REST fallback), not a clip.

### use_figma-single-filekey-per-call-no-cross-file-clone
**Principle:** Every `use_figma` call runs in the context of exactly ONE `fileKey` — the `figma` global inside the script doesn't see another file's content, even if both files are reachable through the same MCP connector. `node.clone()`, `parent.appendChild(node)` and any other node transfer work only WITHIN one file. A donor from another file can't be imported programmatically (unlike `cross-page-appendchild-moves-node`, which works BETWEEN pages of ONE file) — only: (a) read it read-only in a separate call with ITS `fileKey` (geometry, colours, patterns, text strings), then (b) recreate what's needed by hand in the target file in a separate call with ITS `fileKey`. There is no plugin API for copying nodes between files at all — the only programmatic route is `exportAsync({format: 'SVG_STRING'})` in the source plus `createNodeFromSvg` in the target — with the 20 KB cap that is ~15 pairs of calls and about an hour for a 199-icon set, against ten seconds of Cmd+C / Cmd+V, which preserves vectors, names and component status. Offer the manual route first and take over after the paste: collecting, renaming, and publishing is where the API is actually faster than hand work.
**Symptom:** the temptation to "take a node from there and paste it here" in one script — the tool offers no parameter for a second file, and `getNodeByIdAsync` with an id from a foreign file silently returns `null`, not an error with a clear text.
**Pattern:** two (or more) separate `use_figma` calls with different `fileKey`s: the first read-only on the donor file — collect the exact numbers (`x`/`y`/`width`/`height`/`fills`/`cornerRadius`/`vectorPaths`/fonts); the second — on the target file, `figma.createFrame`/`createText`/`createVector` etc. with those numbers as constants in the code. The donor is used only as a reference for COMPARISON (geometry / the "empty cell = not included" pattern / colours), not as a source of nodes to copy.

### screenshot-raster-before-asserting-what-it-contains
**Principle:** Before asserting what a flat raster node does (`fills:[{type:'IMAGE'}]`, no child nodes — `get_metadata` fundamentally can't see what's inside), let alone before deleting/replacing it — take a `get_screenshot` of that very node and look with your eyes. Indirect evidence (Y coordinates matching a neighbouring already-built element, a general resemblance to another reference screenshot, a semantically fitting node name) is systematically insufficient: the raster may cover far more content than the context suggests.
**Symptom:** the raster is deleted and replaced with "what should have been there" on indirect evidence; on review it turns out the raster carried several sections (e.g. a payment method + a consent checkbox + a comparison table), and only one of them was replaced/restored — the rest simply vanished from the task's scope because their existence was never checked.
**Pattern:** `get_screenshot(rasterNodeId)` — one call, before any mutations. The node's name is not a source of truth (a raster block in fact turned out to be the entire bottom half of the page, not just the payment method).

### search-whole-page-before-external-donor
**Principle:** Before going to ANOTHER Figma file for a structure/pattern "donor" — search for existing material across the WHOLE page of the current file (`figma.currentPage.children` in full, not only the catalogued sections), not only inside the named sections documented in your own node registry. The registry documents what someone deliberately wrote into it — orphaned nodes detached from sections (e.g. a forgotten draft html-to-figma import) aren't covered by the registry and aren't found by the usual per-section search.
**Symptom:** full, exact, reuse-ready material (a real capture of the very same page) lies right in the current file — but outside the x/y range of the catalogued sections, a top-level child of the page — and isn't found, because the search went "by the registry", not by the raw page tree. The solution is sought in an EXTERNAL file, although inside it was better and closer.
**Pattern:** one read-only call `figma.currentPage.children.map(n => ({id, name, x, y, width, height}))` before deciding "an external donor is needed" — especially if an html-to-figma import was clearly used elsewhere in the file (sign: other nodes named like `div.xxx`, generic `Background`/`Container`/`SVG`, traces of `Helvetica Neue`).

### new-node-default-constraints-not-center-drifts-on-later-ancestor-resize
**Principle:** A node created with `createVector`/`createFrame`/etc. and centred by hand via an explicit `node.x = (parent.width - node.width) / 2` (and likewise `y`) keeps its centring only while its `constraints` are `CENTER/CENTER`. By default new nodes are created with `constraints: {horizontal: 'MIN', vertical: 'MIN'}` — visually indistinguishable from centring at that moment (both give the same `x`/`y` right after assignment), but `MIN/MIN` keeps the node glued to the parent's LEFT/TOP edge on any subsequent parent resize, not to the centre. If, after the manual centring, somewhere further in the same or later scripts the parent (or a more distant ancestor via an auto-layout cascade) changes size even once — a `MIN/MIN` node slides from the centre to the edge, although it looked centred at creation.
**Symptom:** dozens of identically built nodes (e.g. checkmarks in a table) are visually shifted toward the same edge (not chaotically but systematically) — while an isolated repro "create a node, set x/y as the centre" reproduces the right result, because the repro has no subsequent parent resize. Reading `node.x` shows 0 (or another "edge" value) instead of the computed centre, and `node.constraints` — `MIN/MIN`, not `CENTER/CENTER`.
**Pattern:** for any node that must STAY centred (not just be born centred once) — explicitly set `node.constraints = {horizontal: 'CENTER', vertical: 'CENTER'}` right after positioning, as a separate assignment, without relying on the default. If drift has already happened — don't just recompute `x`/`y` (the same bug recurs on the next ancestor resize); set both `constraints` and `x`/`y` in one pass.

### infinite-loop-in-plugin-script-surfaces-as-mcp-connection-lost-not-timeout
**Principle:** A non-terminating loop in a `use_figma` script does **not** return a timeout error — the Figma plugin sandbox is single-threaded; the hung script simply stops responding, the MCP session degrades with it, and the proxy reports a "MCP server connection lost"-style error. All symptoms point at infrastructure, while the bug is in the authored script. Distinguish from the already documented `get-metadata-no-nodeid-timeout-on-huge-pages`: there the signature differs (`Tool call timed out waiting for server response`) and the cause is server-side (a heavy recursive dump with a live transport); here the transport collapses because of a deadlock in the editor.
**Symptom (the diagnostic signature — identify by it):** a transport-looking error that is **deterministic for one specific script** (6 of 6 attempts) and **absent for trivial scripts** on the same connection, while earlier in the same session definitely heavy calls passed (80 text mutations, multi-kilobyte recursive dumps). The payload size isn't a variable here — don't spend attempts on shrinking it.
**Pattern:** on seeing such a signature, **don't retry** — re-read your own script for a loop whose continuation condition depends on generated data (`while`, `do-while`, `for(;;)`, a recursive retry, rejection sampling). The rule going forward: such a loop must carry (1) a literal iteration ceiling checked every pass, and (2) a `throw` on exhaustion with the loop's state in the message. Never a silent `break`. Better still — a closed form instead of a search.
```js
// ❌ hangs dead if the predicate is unsatisfiable — and looks like an infrastructure failure
while (out.length < N) { const v = gen(seed++); if (!used.has(v)) out.push(v); }

// ✅ a search with a ceiling and a loud failure
for (let seed = 0, guard = 0; out.length < N; seed++) {
  if (++guard > 10000) throw new Error('search exhausted after ' + guard + ' tries, found ' + out.length + '/' + N);
  const v = gen(seed); if (!used.has(v)) out.push(v);
}
// ✅✅ better: a closed form, injective by construction — nothing to search for
```
**The adjacent trap that spawned that loop (an LCG mod 2^32 + `% 16`):** a generator of the form `s = (Math.imul(s, 1103515245) + 12345) >>> 0; out += hex[s % 16]` takes the LOW 4 bits. The low k bits of an LCG modulo 2^32 have a period ≤ 2^k, because `(a·s + c) mod 16` depends only on `s mod 16`. Result: the whole output is a function of `seed % 16`, **exactly 16 distinct values over the whole 32-bit seed space**, each a rotation of one cycle (`674d2309efc5ab81`). Two consequences: (a) "unique" values silently duplicate every 16 seeds; (b) a search for "an unused value" becomes unsatisfiable as soon as 16 are used. For pseudo-random mock data take an avalanche mixer (murmur3 `fmix32` — a composition of bijections on Z/2^32, injective by construction), and render the field carrying the uniqueness requirement from the FULL 32 bits without truncation. Uniqueness is then proven, not searched for. A cheap safeguard at the script's start: `if ((Math.imul(0x85ebca6b, 3) >>> 0) !== 2445500225) throw...` — the injectivity proof relies on a spec-correct `Math.imul`, and the sandbox's behaviour isn't directly observable.
**Honest caveats (don't present as established):** the link "hang → precisely this error string" is a plausible reconstruction, not an observation: the proxy/session internals are inaccessible, and the "connection lost" string hadn't appeared in any repo or pack before this case. Separately: one trivial ping WITHOUT any loops also failed (1 of 4) — most likely it hit the teardown window after the hang (~65–70%), but an independent transient (~30–35%) isn't ruled out. Practical consequence: **don't automatically attribute a failure of a loop-free call to a second bug in the script**. Raw call timestamps would have separated these hypotheses — keep them in the next such investigation.
**A mechanical rail (don't rely on memory) — worth building once.** A PreToolUse hook on `use_figma` calls (matcher `use_figma`, registered in your agent's hook configuration) can read the code BEFORE sending and **block** (`permissionDecision: deny`) two provably dangerous forms — (1) a search with a membership check (`.has`/`.includes`/`.indexOf`) inside a loop with no `throw` anywhere in the script (the literal form of the incident; caught in both `while` and `for` spellings); (2) `while(true)`/`for(;;)` without a single `break`/`return`/`throw`. Everything else — a warning, not a block. **Deliberately narrow:** the first version of the hook blocked any `while` without a "hint word" and, on measurement, rejected 9 of 11 loops taken verbatim from this very pack (8 of which provably terminate) — the standard `while (stack.length)` tree walk and the parent-chain pass. A tool with that false-positive rate gets disabled and stops catching anything at all. Opt-out — a comment `// LOOP-GUARD: <why it terminates>` (specifically a comment: a marker inside a string literal deliberately doesn't count).

### clipscontent-plus-fixed-height-plus-shadow-child-renders-phantom-box-in-get-screenshot
**Principle:** `get_screenshot` on a FRAME with `primaryAxisSizingMode: 'FIXED'` (an explicit height larger than the content) **and** `clipsContent: true` **and** a child with a visible `DROP_SHADOW` effect near the content boundary can draw, in the empty area below the content, an extra floating white rounded rectangle — visually resembling a duplicate copy of the shadow-bearing child, but corresponding to no node in the tree.
**Symptom:** the screenshot shows a "phantom" box without text in an area where per `page.children`/`node.children` absolutely nothing is placed (checked `absoluteRenderBounds`, `layoutSizingVertical`, the fills of all candidates — empty). The artefact **reproduces stably** (not flaky — two independent `get_screenshot` requests give it again), but **disappears instantly** if `clipsContent: false` is temporarily set on the same node (the height and everything else unchanged) — it doesn't disappear from a simple repeat screenshot with the same settings.
**Pattern:** don't spend rounds searching for "remove the extra node" — there is no node; it's a render-service bug on a specific combination of properties. Diagnosis: (1) check the node tree — if there are no structural candidates, (2) temporarily lift `clipsContent`, reshoot — if the artefact vanished, the cause is confirmed as a render side effect, not content; (3) if the content is shorter than the set height — there's physically nothing to clip, so `clipsContent:false` can stay without functional loss (unless avoiding overflow content, which at the moment is shorter than the frame anyway, is explicitly required) — or keep `clipsContent:true` for consistency with neighbouring screens and tell the user the artefact belongs to the screenshot service, not the file.

### use-figma-timeout-may-have-partially-or-fully-executed
**Principle:** A `use_figma` timeout ("Plugin execution failed due to internal timeout") doesn't guarantee the script performed no mutation — the script runs sequentially, and the timeout may occur AFTER the early lines (including heavy operations like `.clone()` of a remote-linked instance) have already really applied to the file.
**Symptom:** a multi-step script (e.g. clone + several property assignments) fails with a timeout; a subsequent read-only check finds that some or all mutations have already applied.
**Pattern:** after ANY timeout — before rerunning the script from scratch (risk of duplicates) — first read-only check the expected state (`getNodeByIdAsync` on the node that should have appeared/changed). Continue from the diagnosed point, not from the start.

### group-for-combined-screenshot-empty-group-self-deletes
**Principle:** For a combined screenshot of several page-level nodes — `figma.group([...], page)` → `screenshot(grp.id)` → `appendChild` the children back. An empty GROUP deletes itself as soon as it loses its last child; calling `grp.remove()` after the child-return loop throws (the node is gone) and atomically rolls back the whole script.
**Pattern:** don't call `grp.remove()` explicitly after all children are returned — the GROUP vanishes by itself. See also `group-auto-dissolves-on-last-child-removal-remove-call-throws` in `layout-and-geometry.md` — the same mechanism for an arbitrary GROUP→FRAME conversion, not only for a temporary screenshot GROUP.
```js
for (const c of grp.children) page.appendChild(c);
grp.remove(); // ❌ Error: The node with id "..." does not exist → rolls back the whole script

for (const c of grp.children) page.appendChild(c);
return { restoredIds: grp.children.map(c => c.id) }; // ✅ grp no longer exists by now; delete nothing
```
_(moved from `connectors.md` — the GROUP/remove fact is general to screenshots, not CONNECTOR-specific)_

### get-screenshot-stale-immediately-after-use-figma-mutation-in-same-turn
**Principle:** `get_screenshot` called right after a `use_figma` mutation of the same node in the same dialogue turn can return a cached render of the OLD state — a separate cache from the one described in `use-figma-stale-reads-after-mutation` (the core SKILL.md): that one is about a repeat READ via `use_figma`; this one is about a DIFFERENT tool (`get_screenshot`), with its own independent cache on the render service's side.
**Symptom:** a read-only check via `use_figma` (`getNodeByIdAsync` / a children walk) confirms the mutation applied (the needed node is removed/added/renamed), but `get_screenshot` of the same nodeId visually shows the old picture — a discrepancy between "the structure is right" and "the picture is right" at one and the same moment.
**Pattern:** don't trust the first `get_screenshot` right after a mutation as final proof — if it looks unexpected (shows what should have vanished/appeared), first re-ask `get_screenshot` once more with the same nodeId (without a repeat mutation) — the second call usually returns a fresh render. Don't confuse with the case where the script really didn't apply (for that — `use-figma-stale-reads-after-mutation` / `use-figma-timeout-may-have-partially-or-fully-executed`).
**Not only the same turn.** The stale render can survive a second `get_screenshot` in the next turn and more than a minute of real time — two consecutive shots 80 s apart both showed 17px titles while the readback said 34px, and a shot taken later showed the 34px titles. So the readback decides, never the picture: when `use_figma` reports `fontSize: 34` and the screenshot shows small text, the file is right and the render is old. Three consequences. (1) Don't edit the file to match the screenshot — the "fix" lands on a node that was already correct and breaks the layout for real (a title bumped a second time overflowed its container). (2) Don't save a screenshot as the project's reference frame while it disagrees with the readback on any property you just changed; verify agreement on one changed property first. (3) A Look-based check (`references/checks.md` in a design skill, or your own eyeballing) counts only on a frame that agrees with Read — until then it's a check of the cache.
```js
// freshness gate: one changed property, read back, compared with what the shot shows
const t = await figma.getNodeByIdAsync('TITLE_ID');
return { fontSize: t.fontSize, chars: t.characters };   // 34 → the shot must show a 34px title, or the shot is stale
```

### inline-node-screenshot-more-stale-than-standalone-get-screenshot-for-fresh-text
**Principle:** An inline `await node.screenshot()` (called FROM INSIDE a `use_figma` script) can show a stale (invisible/wrong) colour of a freshly created or just-rebound TEXT node NOT only right after the mutation but also in a SEPARATE, later `use_figma` call — i.e. it outlives the `get_screenshot` cache from the neighbouring entry above. A read-only check via `use_figma` (`node.fills[0].color`, `boundVariables`) meanwhile stably shows the correct value (e.g. an honest `{r:1,g:1,b:1}` for white) — the discrepancy is in the RENDER, not the data.
**Symptom:** two consecutive `node.screenshot()` calls (in different `use_figma` calls, with real time between them) both show the text invisible/wrong, although the structural read confirms the right binding and the right cached colour — creating a false impression that "the fix didn't work" when it actually did.
**Pattern:** to verify specifically a TEXT colour after a variable rebind — don't trust `node.screenshot()` as final proof on either the first or a repeat call; switch to the separate `get_screenshot` MCP tool (the same nodeId) — in this case it returned the correct render first time while both inline screenshots were still lying. If `get_screenshot` also looks wrong — then the neighbouring entry's rule applies (re-ask `get_screenshot` a second time).

### get-variable-defs-needs-a-node-id-not-a-page-id
**Principle:** `get_variable_defs` doesn't accept a page id — pass a node or frame id instead, or it fails with `You currently have nothing selected`.

### never-walk-a-whole-production-page-with-findallwithcriteria
**Principle:** A single read-only pass over a large interface page (collecting `effects` per node) hung the plugin until the MCP client gave up after 928 s. Scope every traversal to a specific frame or component, and when you need one fact about the design system — a shadow, a radius, a padding — read it off one known node instead of surveying for it.
