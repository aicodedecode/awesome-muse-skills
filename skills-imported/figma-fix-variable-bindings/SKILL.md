---
name: figma-fix-variable-bindings
description: Fix detached or missing variable bindings in Figma — typography (fontFamily, fontStyle, fontSize, fontWeight), padding/spacing (paddingTop/Right/Bottom/Left, itemSpacing, counterAxisSpacing), corner radii (cornerRadius, topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius), and colors (solid fills and strokes). Trigger when the user mentions detached styles, deleted variables, broken bindings, "Variable was deleted" warnings, wrong fonts, manual/hardcoded padding, unbound spacing, hardcoded corner radius / rounding, detached/hardcoded colors, unbound fills or strokes, broken color variables, or asks to audit/clean up/fix variables across a file or page. Covers the full scan → report → confirm → rebind workflow; read-only until the user approves the report. Trigger even if only one of typography/padding/roundings/colors is mentioned.
---
> Adapted for Muse from [schudarin/chudarin-design-skills](https://github.com/schudarin/chudarin-design-skills) (MIT) — plain-markdown portable unit. Claude Code-isms neutralized; any Figma MCP / write steps are kept as read-only reference knowledge.


# Figma Fix Variable Bindings

**Required companions:** this skill writes through `use_figma`, so your tool's own Figma API instructions must be loaded first — the `figma-use` plugin skill in Claude Code, the MCP resource `skill://figma/figma-use/SKILL.md` elsewhere — plus `figma-plugin-api-rules` for the silent-failure patterns this workflow depends on (per-paint colour bindings, per-corner radii, read-back after every write).

Figma nodes lose variable bindings when collections get orphaned, libraries update, or components migrate. This skill scans for broken/missing bindings on **typography** (text nodes), **padding/spacing** (auto-layout frames), **corner radii** (any node with radii), and **colors** (solid fills/strokes), then rebinds them to the correct library variables.

## How Bindings Work

**Typography** (TEXT nodes): `fontFamily` (STRING), `fontStyle` (STRING, e.g. "Bold"), `fontSize` (FLOAT), `fontWeight` (FLOAT, e.g. 700), `lineHeight`, `letterSpacing`.

**Padding** (auto-layout frames): `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `itemSpacing`, `counterAxisSpacing` — all FLOAT.

**Roundings** (any node with corner radii): `cornerRadius`, `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius` — all FLOAT. `cornerRadius` returns `figma.mixed` when corners differ; **don't treat this as a skip** — just bypass the aggregate property and let the four per-corner props be processed individually in the same walk. Mixed nodes still get fully bound, one corner at a time.

**Colors** (any node with `fills`/`strokes`): each is an **array of `Paint`** (or `figma.mixed`). A SOLID paint carries `.color` (`{r,g,b}`, floats 0–1) and `.opacity`. The color variable binding lives **per-paint** at `paint.boundVariables.color` (a `VARIABLE_ALIAS`) — **not** on `node.boundVariables`. Bind with `figma.variables.setBoundVariableForPaint(paint, 'color', variable)`, which **returns a new paint object** — you must clone the array, replace the entry, and reassign `node.fills` / `node.strokes` wholesale (mutating a paint in place silently no-ops). Match RGB only, normalized to `#RRGGBB` (round each channel ×255) so float-rounding noise doesn't cause misses. Only SOLID paints are handled; GRADIENT/IMAGE/VIDEO are reported, never bound.

A node can have **dual bindings** (remote library + local) on the same property. The local one wins at render time. `setBoundVariable(field, null)` only removes the remote binding — the local persists. `variable.remove()` silently no-ops if referenced. These are platform limitations.

## Workflow (target: 4–5 tool calls total)

**This skill writes to the user's file. Nothing is bound, changed or deleted before the user has seen the scan and said "apply".** Phase 1 and 2 are read-only; Phase 3 runs only after an explicit go-ahead on the report; Phase 4 (deleting variables and collections) needs its own separate confirmation — never bundle it into the "apply" answer.

### Phase 1: Unified Scan (1 call)

Single walk collecting all issues. Every node op in try/catch — one bad node must not abort the scan. Skip the root PAGE node's own property access (PAGE has no `boundVariables`, padding, or radius props — only walk its children).

```javascript
const root = await figma.getNodeByIdAsync("TARGET_NODE_ID");
const PAD_PROPS = ['paddingTop','paddingRight','paddingBottom','paddingLeft','itemSpacing','counterAxisSpacing'];
const RADIUS_PROPS = ['cornerRadius','topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const TYPO_PROPS = ['fontFamily','fontSize','fontStyle','fontWeight'];
const issues = { typo: [], padding: [], radius: [], color: [] };
const localVarIds = new Set();
const remoteVarMap = {};
const errors = [];

// Normalize a Figma {r,g,b} (floats 0–1) to "#RRGGBB" so float-rounding noise doesn't break exact matching.
const toHex = (c) => "#" + ["r","g","b"].map(k => Math.round((c[k] ?? 0) * 255).toString(16).padStart(2,"0")).join("").toUpperCase();

// FigJam-style nodes that lack boundVariables — skip but still descend into children.
const SKIP_TYPES = new Set(["CONNECTOR","STAMP","WIDGET","STICKY","SHAPE_WITH_TEXT","CODE_BLOCK","TABLE"]);

function walk(node) {
  try {
    const isPage = node.type === "PAGE";
    const isSkipType = SKIP_TYPES.has(node.type);
    if (isSkipType) { if ("children" in node) for (const c of node.children) walk(c); return; }
    const bv = isPage ? {} : (node.boundVariables || {});

    if (!isPage && node.type === "TEXT" && node.fontName !== figma.mixed) {
      const styled = typeof node.textStyleId === "string" && node.textStyleId.length > 0;
      const info = { id: node.id, name: node.name, font: `${node.fontName.family} ${node.fontName.style} ${node.fontSize}`, styled, boundVars: {} };
      for (const [prop, bindings] of Object.entries(bv)) {
        const arr = Array.isArray(bindings) ? bindings : [bindings];
        for (const b of arr) {
          if (!b.id.includes("/")) localVarIds.add(b.id);
          else if (styled) remoteVarMap[`${prop}:${b.id}`] = { prop, id: b.id };
        }
        if (TYPO_PROPS.includes(prop)) info.boundVars[prop] = arr.map(b => ({ id: b.id, isLocal: !b.id.includes("/") }));
      }
      if (!styled) issues.typo.push(info);
    }

    if (!isPage && ("paddingTop" in node || "layoutMode" in node)) {
      const padIssues = [];
      for (const prop of PAD_PROPS) {
        if (!(prop in node)) continue;
        const val = node[prop], bound = bv[prop];
        if (bound) {
          const arr = Array.isArray(bound) ? bound : [bound];
          for (const b of arr) { if (!b.id.includes("/")) { localVarIds.add(b.id); padIssues.push({ prop, issue: "orphaned", varId: b.id }); } }
        } else if (typeof val === "number") {
          padIssues.push({ prop, issue: "hardcoded", value: val });   // include 0 — it should bind to None
        }
      }
      if (padIssues.length) issues.padding.push({ id: node.id, name: node.name, type: node.type, issues: padIssues });
    }

    if (!isPage && ("cornerRadius" in node || "topLeftRadius" in node)) {
      const radIssues = [];
      for (const prop of RADIUS_PROPS) {
        if (!(prop in node)) continue;
        let val; try { val = node[prop]; } catch(_) { continue; }
        if (val === figma.mixed) continue;   // skip mixed cornerRadius (per-corner will be handled separately)
        const bound = bv[prop];
        if (bound) {
          const arr = Array.isArray(bound) ? bound : [bound];
          for (const b of arr) { if (!b.id.includes("/")) { localVarIds.add(b.id); radIssues.push({ prop, issue: "orphaned", varId: b.id }); } }
        } else if (typeof val === "number") {
          radIssues.push({ prop, issue: "hardcoded", value: val });
        }
      }
      if (radIssues.length) issues.radius.push({ id: node.id, name: node.name, type: node.type, issues: radIssues });
    }

    if (!isPage) {
      for (const surface of ["fills","strokes"]) {
        if (!(surface in node)) continue;
        const paints = node[surface];
        if (paints === figma.mixed) { issues.color.push({ id: node.id, name: node.name, type: node.type, surface, issue: "mixed" }); continue; }
        if (!Array.isArray(paints)) continue;
        paints.forEach((p, i) => {
          if (p.type !== "SOLID") { issues.color.push({ id: node.id, name: node.name, type: node.type, surface, index: i, issue: "non-solid", paintType: p.type }); return; }
          const bound = p.boundVariables && p.boundVariables.color;  // per-paint, single alias (not an array)
          if (bound) {
            if (!bound.id.includes("/")) { localVarIds.add(bound.id); issues.color.push({ id: node.id, name: node.name, type: node.type, surface, index: i, issue: "orphaned", varId: bound.id, hex: toHex(p.color), opacity: p.opacity }); }
          } else {
            issues.color.push({ id: node.id, name: node.name, type: node.type, surface, index: i, issue: "hardcoded", hex: toHex(p.color), opacity: p.opacity });
          }
        });
      }
    }

    if ("children" in node) for (const c of node.children) walk(c);
  } catch (e) { errors.push({ nodeId: node?.id, error: e.message }); }
}
walk(root);
```

### Phase 2: Resolve Library Variables (1 call)

**Don't rely on `search_design_system` alone** — its index frequently misses spacing/rounding tokens. Enumerate the library directly via `figma.teamLibrary`, which always returns the full set:

```javascript
const cols = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
// Match by name: Paddings | Spacing | Gaps | Roundings | Radii | Typography | Colors | Palette | Brand | Semantic
const wanted = cols.filter(c => /padding|spacing|gap|round|radius|radii|typography|colou?r|palette|brand|semantic|fill/i.test(c.name));
const libTokens = {}; // collectionName -> [{ name, key, id, type, value }]
for (const c of wanted) {
  const vars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key);
  const items = [];
  for (const v of vars) {
    const imp = await figma.variables.importVariableByKeyAsync(v.key);
    const firstVal = Object.values(imp.valuesByMode)[0];
    items.push({ name: imp.name, key: v.key, id: imp.id, type: imp.resolvedType, value: firstVal });
  }
  libTokens[c.name] = items;
}
```

Then resolve any orphaned **local** var IDs (follow alias chains) so you know what value each one represents:

```javascript
const localVars = {};
const queue = [...localVarIds], seen = new Set();
while (queue.length) {
  const vid = queue.pop();
  if (seen.has(vid)) continue; seen.add(vid);
  try {
    const v = await figma.variables.getVariableByIdAsync(vid);
    if (!v) continue;
    const col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
    localVars[vid] = { name: v.name, type: v.resolvedType, values: v.valuesByMode, collectionId: v.variableCollectionId, collectionName: col?.name };
    for (const val of Object.values(v.valuesByMode))
      if (typeof val === "object" && val.type === "VARIABLE_ALIAS" && !val.id.includes("/")) queue.push(val.id);
  } catch (e) { localVars[vid] = { error: e.message }; }
}
```

### Phase 2½: Report and stop — the gate

Before any write, show the user what Phase 1 + 2 found and what would change:

- per family (typography / padding / radius / colour): how many nodes, how many will bind to which token, how many have no exact match and stay untouched
- the list of unmatched values and hexes, so the designer can decide
- how many instance nodes are skipped (their master is the fix surface)
- whether any orphaned local variables/collections would be deletion candidates in Phase 4

Then ask, in one line, whether to apply — and wait. If the scope is a whole page or file, offer to apply to one frame first as a proof, then the rest. No "apply" → the run ends here with the report; that is a complete, useful outcome, not a failure.

### Phase 3: Build Replacement Maps & Apply Fixes (1–2 calls) — only after the user said "apply"

For each property family build `value → libraryVariable` maps from `libTokens`:

- **Paddings/Spacing/Gaps** → bind padding & itemSpacing properties.
- **Roundings/Radii** → bind cornerRadius & per-corner properties.
- **Typography** → bind fontFamily/fontStyle/fontSize (only when font matches the library's `Family/Font Type` value).
- **Colors** (COLOR-type tokens) → build a `#RRGGBB → libraryVariable` map (normalize each token's `{r,g,b}` via the same `toHex`). Bind solid fill/stroke paints whose hex is in the map.

**Matching rules:**
- **Exact value matching only** for paddings/spacings/typography. Hardcoded `16` → token whose value is `16`. No nearest-match.
- **Include zeros.** `0` should bind to the collection's `None` token (almost every spacing/radius library has one). This is a desired explicit binding, not noise.
- **Ignore negatives and sub-pixel values silently.** Negative paddings (e.g. `-16`) are deliberate overlap layouts; sub-pixel values (e.g. `4.5999…`, `1.9605…`, `27.220…`) are scale-transform artifacts. Neither should be auto-bound or surfaced as no-match in the report — skip them quietly. Detect sub-pixel via `!Number.isInteger(val)`, negative via `val < 0`.
- **Roundings: large radii are Circle, with one reserved exception.** Any radius value `>= 100` binds to the `Circle` token (typically value `999`). Designers use `100`, `500`, `1000`, sometimes the shape's half-dimension (e.g. `296`, `1123.875`) as sentinels for fully-rounded corners — semantically they're all Circle. Values `< 100` need exact-value matching.
  - **Reserved values.** A workspace may keep specific radius or spacing values deliberately unbound (a sentinel the team uses on purpose). Read them from `<project>/.claude/design.md`, or ask once before the first run; skip them and report as "intentionally preserved", not under "no match".
- **Typography (dual-bound nodes):** set the local var value to match the library value so both resolve identically. Local-only or unbound → `setBoundVariable` to the remote var.
- **Colors:** exact `#RRGGBB` match only (RGB), no nearest-color guessing. Opacity/alpha is **not** part of the match — if the paint's `opacity` or color alpha differs from the token, bind the color anyway and report the opacity mismatch separately. Non-SOLID paints (gradient/image/video) are never bound — report their counts for manual review.

**Critical guards:**
- **"Auto" spacing: NEVER touch.** Detect via `node.primaryAxisAlignItems === "SPACE_BETWEEN"` (itemSpacing) or `node.counterAxisAlignItems === "SPACE_BETWEEN"` (counterAxisSpacing).
- **Mixed `cornerRadius`:** bypass the aggregate property, but always process the four per-corner radii. Don't report this as a skip in the summary — those corners DO get fixed.
- **FigJam-style nodes: ALWAYS skip and descend.** `CONNECTOR`, `STAMP`, `WIDGET`, `STICKY`, `SHAPE_WITH_TEXT`, `CODE_BLOCK`, `TABLE` show up in design files (leftover from imports / FigJam blending) and throw on `boundVariables` access. Skip the node itself but continue walking its children. The `SKIP_TYPES` set in Phase 1 must always be applied.
- **Instance nodes** (ID contains `;`): skip — fix the main component instead. Report the instance count separately so the user knows the residual surface.
- **Pre-import variables once.** Cache `figma.variables.importVariableByKeyAsync` results outside the walk; calling it per-node is slow on large pages.
- **Color: clone → replace → reassign.** `setBoundVariableForPaint` returns a **new** paint; mutating the paint in place silently no-ops. Always rebuild the array and reassign `node.fills` / `node.strokes` once per node.
- **Color: only orphaned-local or hardcoded paints are candidates.** A paint already bound to a remote (library) color variable is correct — leave it alone.
- **Mixed `fills`/`strokes` (`=== figma.mixed`):** skip the node's paints and report; don't attempt per-segment binding.

```javascript
const node = await figma.getNodeByIdAsync(targetId);
const isInstance = node.id.includes(";");
if (isInstance) { /* skip */ } else {
  if (prop === "itemSpacing" && node.primaryAxisAlignItems === "SPACE_BETWEEN") continue;
  if (prop === "counterAxisSpacing" && node.counterAxisAlignItems === "SPACE_BETWEEN") continue;
  const libVar = valueMap[targetValue];
  if (libVar) node.setBoundVariable(prop, libVar);
}
```

Colors — bind per paint, then reassign the whole array (one write per surface):

```javascript
// colorMap: "#RRGGBB" -> imported library COLOR variable
for (const surface of ["fills","strokes"]) {
  const paints = node[surface];
  if (!Array.isArray(paints)) continue;       // skip figma.mixed / absent
  let changed = false;
  const next = paints.map(p => {
    if (p.type !== "SOLID") return p;          // gradient/image/video — never bind
    if (p.boundVariables?.color && !p.boundVariables.color.id.includes("/")) {
      // orphaned local binding — fall through to rebind by hex
    } else if (p.boundVariables?.color) {
      return p;                                // already remote-bound — leave alone
    }
    const libVar = colorMap[toHex(p.color)];
    if (!libVar) return p;                     // no exact match — report, don't guess
    changed = true;
    return figma.variables.setBoundVariableForPaint(p, "color", libVar);  // returns a NEW paint
  });
  if (changed) node[surface] = next;           // single write; in-place mutation no-ops
}
```

### Phase 4: Cleanup — separate, explicit confirmation required

Deleting orphaned local variables and collections is destructive and not reversible from the API. Do it only if the user confirmed *this step* by name after seeing the Phase 3 report ("also delete the N orphaned local variables?"). Never fold it into the earlier "apply". Silent failures expected — `variable.remove()` no-ops if anything still references it.

## Pitfalls

1. **Team-licensed fonts** absent from the plugin sandbox can't be loaded via `figma.loadFontAsync`, but you can still bind variables to them with `setBoundVariable`.
2. **`fontStyle`** = STRING weight name ("Bold"); **`fontWeight`** = FLOAT (700). Libraries typically use `fontStyle`.
3. **PAGE nodes have no `boundVariables`** — accessing it throws. Walk children, skip property reads on the page itself.
4. **`search_design_system` is incomplete** for spacing/rounding tokens. Always enumerate via `figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()` + `getVariablesInLibraryCollectionAsync()` (Phase 2).
5. **Bind 0 → None deliberately.** Don't filter out zero values during the scan — explicit `None` bindings are a goal, not a bug.
6. **`cornerRadius === figma.mixed`** when corners differ. Don't bind the aggregate; iterate per-corner instead. Mixed is not a skip — per-corner radii still get fully fixed in the same walk.
7. **All modes:** when calling `setValueForMode`, iterate all `collection.modes`.
8. **FigJam-style nodes leak into design files.** `CONNECTOR`, `STAMP`, `WIDGET`, `STICKY`, `SHAPE_WITH_TEXT`, `CODE_BLOCK`, `TABLE` have no `boundVariables` and throw on access. Skip them in the walk but keep descending into children.
9. **Color bindings are per-paint, not per-node.** Look at `paint.boundVariables.color` (a single `VARIABLE_ALIAS`, not an array), never `node.boundVariables`. `setBoundVariableForPaint` returns a **new** paint — clone the array, replace the entry, reassign `node.fills`/`node.strokes`. Mutating a paint object in place silently no-ops.
10. **Match colors by quantized hex, not raw float.** Two visually identical colors can differ in the 7th decimal from rounding. Normalize `{r,g,b}` to `#RRGGBB` (round each channel ×255) before comparing — strict float equality under-binds. Match RGB only; opacity/alpha is reported, not matched.
11. **Only SOLID paints bind.** GRADIENT_LINEAR/RADIAL/ANGULAR/DIAMOND, IMAGE, VIDEO are never auto-bound — report them for manual review. `fills`/`strokes` can also be `figma.mixed` (multi-segment text) — skip and report.

## Reporting

Brief summary after the run:
- ✅ X typography bindings fixed, Y padding bindings fixed, Z radii bindings fixed, C color bindings fixed (break out fills vs strokes, and zero → None separately, if meaningful)
- ⏭️ Skipped: auto spacing, no exact match (list the unmatched values/hexes with counts), mixed radii, mixed fills/strokes, gradient/image/video paints (count for manual review), instance occurrences (give an instance total so the user knows the follow-up surface)
- ⚠️ Color matched but opacity/alpha differs — list these (the color bind succeeded; opacity is the designer's call)
- ⚠️ N errors (list node IDs)
- 🧹 Orphaned vars removed: A succeeded, B need manual cleanup
- One-liner for manual cleanup: "Select layer → Design panel → click ⚠️ variable icon → detach and rebind."

**Call out unmatched values that look semantically equivalent to a library token but differ in value** (e.g. radii of `100` or `500` that are clearly meant to be `Circle/999`, itemSpacing of `10` when the system uses `8`/`12`, or a hex that's one channel off from a token color). These need a designer decision, not an automated fix.

**If any issues came up during execution that were resolved on the fly** (e.g. a variable resolved unexpectedly, an alias chain led somewhere surprising, a collection had unusual mode configurations, or a workaround was needed for an API quirk), briefly mention what happened and how it was handled at the end of the report. This helps the user understand if the file has unusual patterns that might recur, and feeds back into improving this skill for next time.
