---
name: figma-plugin-api-rules/layout-and-geometry
description: Read when creating or editing frames and geometry — auto-layout, HUG/FILL, resize, coordinates, rotation, strokes/shadows, radii, vector paths, traversal and safe deletion, canvas collisions
---

# layout-and-geometry — use_figma rules

### minwidth-zero-rejected-use-null
**Principle:** Assigning `minWidth = 0` is rejected by the API — use `null` to clear the constraint.

### createframe-default-white-fill
_Core: full text — `../SKILL.md`._

### vector-rotation-bbox-swap
**Principle:** Rotating a VECTOR by 90°/270° swaps the axis-aligned bounding box dimensions (8×4 becomes 4×8 in the parent's coordinates) — compute x/y knowing that rotation is applied AFTER.

### rotated-rectangle-rotation-property-wrong-pivot-use-relativetransform
**Principle:** `rectangle.rotation = deg` does NOT rotate around the node's centre, contrary to expectation and docs — empirically the pivot is displaced (neither top-left nor the centre in any obvious place), so the rotated rectangle ends up in an arbitrary position instead of on the expected diagonal through the given point. Workaround: compute `relativeTransform` by hand as a rotation matrix around an explicit point (cx, cy) — `a=cos, b=sin, c=-sin, d=cos` (Figma format `[[a,c,tx],[b,d,ty]]`), with `tx/ty` chosen so that the node's LOCAL centre (w/2, h/2) maps exactly onto (cx, cy).
**Symptom:** `rect.resize(L,T); rect.x=…; rect.y=…; rect.rotation=45` — numerically everything looks consistent (width/height/rotation correct), but the render shows the rotated rectangle displaced / not through the canvas centre.
**Pattern:**
```js
function centeredRotatedTransform(w, h, cx, cy, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  const localCx = w / 2, localCy = h / 2;
  const tx = cx - (cos * localCx - sin * localCy);
  const ty = cy - (sin * localCx + cos * localCy);
  return [[cos, -sin, tx], [sin, cos, ty]];
}
rect.resize(w, h);
rect.relativeTransform = centeredRotatedTransform(w, h, cx, cy, angleDeg);
```

### mixed-orientation-content-in-clipped-frame-renders-blank
**Principle:** If ANY descendant of a frame with `clipsContent=true` (usually together with `cornerRadius` — a round mask) contains both axis-aligned geometry (0°/90°: ordinary RECTANGLEs or unrotated VECTOR rectangles) AND rotated geometry (45°, via `relativeTransform` OR via `vectorPaths` with explicitly computed rotated points) — the whole clip-masked subtree renders EMPTY (transparent/white), including the clip frame's own fill, regardless of the nesting level of the conflicting nodes (even when axis-aligned and rotated content sit in DIFFERENT child FRAMEs, both branches under one clip ancestor still trigger the bug). It does NOT depend on node type (RECTANGLE vs VECTOR), sibling count, use of `figma.union`/BOOLEAN_OPERATION (reproduces on the union result too), or colour mixing — reproduced solely by the combination "has 0° content" + "has 45° content" + "has a clip ancestor". A single orientation family (only 0° OR only rotated, any count) renders correctly.
**Symptom:** `use_figma` throws no error at any step; `node.fills` / `node.children` / `absoluteBoundingBox` after the mutation show COMPLETELY correct data (checked repeatedly), but `node.screenshot()` / `get_screenshot` renders emptiness — sometimes with a partial artefact (the last-added / topmost layer is visible, earlier layers and the clip frame's background are not). Cheap false lead: looks like "stale read after mutation" (see `use-figma-stale-reads-after-mutation` in SKILL.md) — but a repeat screenshot in a separate call (even after several read calls) gives the same empty result; this is NOT staleness.
**Pattern (workaround):** temporarily set `clipsContent=false` / `cornerRadius=0` on the frame — the mixed axis+rotated content then renders correctly (confirming the bug is in the clip pipeline, not the geometry). For the final round/rounded result either (a) don't mix 0° and 45° geometry inside a clip subtree at all (simplify the design to one orientation family — e.g. a GB flag built as an axis-aligned white+red cross only, without the diagonal saltire, instead of the full Union Jack), or (b) for shapes without diagonals, plain ELLIPSE/STAR (without custom rotation via vectorPaths) inside the clip frame render fine (e.g. a TR flag as a red circle + white crescent from two overlaid ELLIPSEs + `figma.createStar`, not a single rotated rectangle — worked first try).
**Symptom when trying to prove it via `figma.union`:** merging axis+rotated shapes into ONE `BOOLEAN_OPERATION` node (hoping to dodge a "sibling conflict") does NOT help — the union result itself renders empty inside a clip ancestor; hiding one of the two union nodes (white/red) doesn't restore the other's visibility — the whole clip subtree breaks together, not layer by layer.

### layoutsizing-fill-silent-noop-primary-axis
**Principle:** `layoutSizingHorizontal = 'FILL'` is silently not applied on a frame with its own `layoutMode` whose primary axis matches the FILL direction — `primaryAxisSizingMode: 'FIXED'` blocks it; for containers with `layoutMode: NONE` use constraints instead of sizing (`horizontal: 'STRETCH'` — stretch to the parent, `'SCALE'` — keep the proportion).
**Symptom:** no error, but the property stays FIXED — even when called from a separate script or with `resize` beforehand.
```js
// ❌ WRONG — not applied
ticksFrame.layoutSizingHorizontal = 'FILL';

// ✅ RIGHT — constraints work regardless of layoutMode
trackFrame.constraints = { horizontal: 'STRETCH', vertical: 'CENTER' }; // stretch to the parent's width
activeFill.constraints = { horizontal: 'SCALE', vertical: 'CENTER' };   // keep the proportion (%)
thumbEllipse.constraints = { horizontal: 'SCALE', vertical: 'CENTER' };  // position scales
```

### createautolayout-default-size-hug-collapse
_Core: full text — `../SKILL.md`._

### fill-spacer-fifty-fifty-split
**Principle:** Two FILL siblings in a HORIZONTAL layout split the space exactly 50/50 — an empty FILL spacer takes half the width from the content FILL block; for variants where the spacer is empty, switch it to FIXED with a 1 px width (not 0).
**Symptom:** text in the content block clips even in a wide parent; content width ≈ spacer width — confirmation of the 50/50 split.
**Pattern:** don't apply the FIXED fix to variants where the spacer carries optional content — there it must stay FILL.
```js
// Diagnosis: Info.width ≈ Spacer.width → confirms the 50/50 split
const spacer = variant.findOne(n => n.name === 'Spacer' && n.layoutMode === 'NONE');
spacer.layoutSizingHorizontal = 'FIXED';
spacer.resize(1, spacer.height);  // 1 px minimum, not 0
```

### layoutmode-change-resets-sizing
**Principle:** Changing `node.layoutMode` silently resets `layoutSizingHorizontal/Vertical` to a HUG-derived mode — a FIXED node collapses to the width of its widest FIXED child; right after changing layoutMode, restore `resize` and set layoutSizing explicitly.
**Symptom:** a component suddenly becomes e.g. 48 px instead of 390 px after switching HORIZONTAL→VERTICAL.
```js
node.layoutMode = 'VERTICAL';
// Do NOTHING else without these two lines:
node.resize(390, node.height);           // restore the width
node.layoutSizingHorizontal = 'FIXED';  // pin FIXED (otherwise HUG)
node.layoutSizingVertical   = 'HUG';   // HUG on height — usually what you want
```

### vectorpaths-data-requires-spaces
**Principle:** `vectorPaths.data` requires a space between the SVG command and its coordinates (`'M 0 90 L 60 70'`, not `'M0 90 L60 70'`) — the SVG standard allows both, but the Figma Plugin API fails; applies to all commands (M, L, C, Q, Z, H, V, …).
**Symptom:** error `Invalid command at M0`.
```js
// ❌ WRONG — fails with Invalid command
vector.vectorPaths = [{ windingRule: 'NONZERO', data: 'M0 90 L60 70 L120 80 L180 50 L240 60 L300 30' }];

// ✅ RIGHT — spaces between commands and numbers
vector.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 0 90 L 60 70 L 120 80 L 180 50 L 240 60 L 300 30' }];
```

### absolute-negative-coords-invisible
**Principle:** An ABSOLUTE-positioned child with negative x/y relative to its auto-layout parent may not render even with `parent.clipsContent = false` — the node is in the tree with the right coordinates but visually invisible.
**Symptom:** a protruding element (popover arrow, tooltip pointer, badge anchor) is present in the tree but not visible on the canvas.
**Pattern:** add padding to the parent on the protrusion side and keep the ABSOLUTE child's coordinates in the positive zone; padding shifts the auto-layout children but does NOT affect ABSOLUTE children's positions.
```js
// ❌ DOESN'T WORK — Arrow doesn't render
variant.paddingTop = 0;
arrow.x = 92; arrow.y = -7; // negative y → invisible

// ✅ WORKS — Arrow in the positive zone of the enlarged parent
variant.paddingTop = 8;  // makes the variant 8 px taller
panelChild.y = 8;        // Panel shifts down
arrow.x = 92; arrow.y = 0; // Arrow in the 0..8 zone, before Panel
```

### drop-shadow-directional-protrusion
**Principle:** A DROP_SHADOW on an element protruding from its container must be offset along the protrusion axis (down y:+, up y:-, right x:+, left x:-) — the default downward shadow `{x:0, y:4}` on an element protruding sideways/upwards falls onto the parent panel and creates a dark blot at the seam.
**Symptom:** a "cutting" dark shadow blot at the seam between the protruding element and the panel.
**Pattern:** shadow direction outranks the DS rule "all shadows point down"; removing the shadow entirely is worse (visibility is lost).
```js
// Arrow points down (Placement=top, Panel above Arrow):
{ offset: { x: 0,  y:  4 } }  // shadow down — continues the Arrow ↓
// Arrow points up (Placement=bottom, Panel below Arrow):
{ offset: { x: 0,  y: -4 } }  // shadow up
// Arrow points right (Placement=left, Panel left of Arrow):
{ offset: { x: 4,  y:  0 } }  // shadow right
// Arrow points left (Placement=right, Panel right of Arrow):
{ offset: { x: -4, y:  0 } }  // shadow left
```

### inside-stroke-seam-one-px-overlap
**Principle:** A component's INSIDE stroke shows as a thin line at a flat-to-flat seam with an adjacent element — fix: shift the adjacent element 1 px inward so its fill covers the stroke in the overlap zone.
**Symptom:** a thin "cap" line at the boundary of butted components, especially visible with identical fills.
**Pattern:** conditions: the adjacent element is on top in z-order (`parent.appendChild` makes it last), has no stroke of its own, and its fill matches the parent's.
```js
// PopoverContent (Panel) with a 1 px INSIDE stroke; Arrow butts against it
// Placement=top: Arrow below Panel, panel.height=148
arrow.y = panel.height - 1; // 147, 1 px overlap → Panel stroke hidden
// Placement=bottom: Arrow above Panel (Panel shifted by paddingTop=8)
arrow.y = 1; // overlap into the Panel zone 8..9 → stroke hidden
```

### clipscontent-clips-ring-outside-stroke
**Principle:** `clipsContent=true` on a small circle frame clips a drop-shadow ring (`spread>0`, emulating `box-shadow 0 0 0 Npx`) to the frame's rectangle and cuts off the outer half of a border with `strokeAlign='OUTSIDE'`/`'CENTER'` — for dots/markers set `clipsContent=false` and `strokeAlign='INSIDE'` (the equivalent of `box-sizing: border-box`).
**Symptom:** instead of a round halo a "grey square backing"; the circle outline looks "flattened"; invisible at small zoom, caught only by a large screenshot of the node.
```js
// ✅ for circular dots with a ring/border
marker.clipsContent = false;
dot.clipsContent = false;            // halo and edge render in full
if (dot.strokes?.length) dot.strokeAlign = 'INSIDE';  // border inside the 16 px (box-sizing: border-box in CSS)
```

### autolayout-child-x-assignment-orphans-node
**Principle:** Manually assigning `.x`/`.y` to a child of an auto-layout frame (layoutMode HORIZONTAL/VERTICAL) does not position the node — with no error the node is silently reparented to the page as a top-level orphan, visible only in the NEXT call; change children's order and positions only via `insertChild` / `appendChild`.
**Symptom:** the script "succeeds" and the return shows the new `.x`, but on the next read `node.parent === page` and the siblings snapped back to their old positions.
**Pattern:** diagnosis: `parent.layoutMode !== 'NONE'` + `child.layoutSizingHorizontal === 'FIXED'` → x is effectively read-only; move via `parent.insertChild(targetIdx, node)`.
```js
// ❌ WRONG — clone an auto-layout child + manual x → the node escapes to the page
const clone = srcHeader.clone();       // the clone lands correctly in headerRow next to the source
clone.x = 2236;                        // ⚠️ "succeeds" in this call, but on the NEXT read — clone.parent === page!

// ✅ RIGHT — don't touch .x at all, move via insertChild (order → automatic position recalculation)
const clone = srcHeader.clone();                                   // lands next to the source
const targetIdx = headerRow.children.findIndex(c => c.id === balanceHeaderId);
headerRow.insertChild(targetIdx, clone);                           // auto-layout recomputed x of every column itself
```

### page-children-bbox-collision-check
_Core: full text — `../SKILL.md`._

### clone-reference-frame-check-size
**Principle:** A top-level "reference frame" may turn out to be a page-sized wrapper with a single small real component inside — before `.clone()` compare `ref.width`/`ref.height` with the expected content size, and on a large mismatch clone the real compact sub-frame from `ref.children`, not the wrapper.
**Symptom:** a blind `.clone()` yields a giant, nearly empty clone (e.g. 1440×1024 instead of 426×160) covering neighbouring grid cells.

### table-header-cell-column-width-mismatch
**Principle:** Header cells and data cells cloned from DIFFERENT master templates auto-size independently to the length of THEIR OWN text — the total widths of the header row and data rows diverge and columns don't align, even with identical `layoutMode: 'HORIZONTAL', itemSpacing: 0`.
**Symptom:** `headerRow.width !== row.width`; header and data columns visibly don't line up.
**Pattern:** first build ONE complete data row with real content (its natural width is the source of truth), then force the same widths onto the header and the remaining rows: `resize(targetWidth, h)` + `layoutSizingHorizontal = 'FIXED'`; verify with a per-column comparison of `row.children.map(c => c.width)` arrays (0 mismatches), not a visual screenshot (a scroll-viewport screenshot may return a cached crop).
```js
// ❌ independent assembly — columns diverge
const headerCell = headerTemplate.clone(); headerRow.appendChild(headerCell);
// headerCell auto-fitted the short label "UUID" → width ~120
const dataCell = cellTemplate.clone(); row.appendChild(dataCell);
setCellText(dataCell, 'e346d173-1d88-449c-ba75-cc7e337c09b0'); // auto-fitted the long text → width ~470
// headerRow.width !== row.width, columns don't match

// ✅ force the same width on the header AND on every data row of the same column,
// based on REAL content (not an arbitrary number)
const targetWidth = dataCell.width; // the width of an already-built data cell beats guessing
headerCell.resize(targetWidth, headerCell.height);
headerCell.layoutSizingHorizontal = 'FIXED';
dataCell.layoutSizingHorizontal = 'FIXED'; // and on every data cell of the same column in the other rows too
```

### vector-fills-overwrite-per-region
**Principle:** `vector.fills = [...]` is a global setter — it applies to all regions and destroys per-region fills of a multi-region VectorNetwork (several paths with different colours via `vectorNetwork.regions[i].fills`).
**Symptom:** a two-colour (or more) Vector becomes single-colour after an API fill edit.
**Pattern:** to keep multi-region colours, clone the Vector with `.clone()` (preserves per-region fills), then override selectively via `vectorNetwork.regions[i].fills`; or work with `vectorNetwork.regions` directly as a whole, not via `.fills`.
```js
// Discovery
const v = await figma.getNodeByIdAsync(vectorId);
console.log('paths:', v.vectorPaths?.length);         // >1 = multi-path
console.log('regions:', v.vectorNetwork?.regions?.length); // >1 = multi-region with own fills

// ❌ WRONG — overwrites per-region fills with one colour
vector.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];

// ✅ RIGHT — clone, then override regions selectively
const clone = vector.clone();
clone.vectorNetwork = { ...clone().vectorNetwork, regions: newRegionsArray };
```

### createnodefromsvg-orphan-nodes
**Principle:** If `figma.createNodeFromSvg(svgString)` succeeds but the following code throws BEFORE `parent.appendChild(result)`, the node stays an orphan on the page root at (0,0) — in batch creation dozens of orphan nodes pile up and litter the canvas.
**Pattern:** always wrap creation in try + an immediate `appendChild` BEFORE any other operation that may throw; in catch — `node.remove()` if the node was created.
```js
let node;
try {
  node = figma.createNodeFromSvg(svgString);
  parentFrame.appendChild(node);  // critical: BEFORE any other ops that may throw
  // ... other modifications after
} catch (e) {
  if (node && !node.removed) node.remove();
  throw e;
}
```

### svg-viewbox-vs-node-composition
**Principle:** Web code often uses one SVG viewBox canvas with several `<path>`s at different x positions (viewBox overlay); in Figma every path becomes a separate Vector node, and side-by-side placement via cumulative x offsets duplicates the viewBox width and creates empty space between the parts.
**Symptom:** e.g. "Ex....... ample" — a giant gap between parts of a wordmark after placing the paths separately, each at its original viewBox position.
**Pattern:** before an SVG rebuild check overlay vs concatenation in the source. If the viewBox is shared — either merge all paths into one Vector with per-region fills (see `vector-fills-overwrite-per-region` above), or overlap-position them in a shared frame (NOT an auto-layout HORIZONTAL), or take a fundamentally different approach (TEXT nodes).

### clone-into-autolayout-inherits-stale-layoutpositioning
**Principle:** `sourceNode.clone()` + `autoLayoutParent.appendChild(clone)` does not guarantee that the clone respects manually set `x`/`y` — if the clone's `layoutPositioning` stayed `'AUTO'` (inherited from the source parent's context, e.g. `layoutMode: 'NONE'`, where the property had no effect), the new auto-layout parent (`VERTICAL`/`HORIZONTAL`) pulls the clone into the flow and recomputes its position, ignoring the assigned `x`/`y` — visually the clone "drifts" down/sideways and overlaps unrelated neighbours.
**Symptom:** an overlay element (tooltip, badge, courtesy cursor icon) cloned from a frame with `layoutMode: NONE` and inserted into a frame with `layoutMode: VERTICAL/HORIZONTAL` renders in an unexpected place (e.g. under a button, stretching the parent's height), although `x`/`y` were explicitly assigned right after `appendChild`.
**Pattern:** after `appendChild` of a clone into an auto-layout parent — always set `clone.layoutPositioning = 'ABSOLUTE'` explicitly BEFORE (or right after) assigning `x`/`y`; never rely on the inherited value. Check `parent.layoutMode` in advance (`'NONE'` vs `'VERTICAL'/'HORIZONTAL'`) — if auto-layout, `ABSOLUTE` is mandatory for any manually positioned overlay.
```js
const clone = template.clone();
autoLayoutParent.appendChild(clone);
clone.layoutPositioning = 'ABSOLUTE'; // mandatory if autoLayoutParent.layoutMode !== 'NONE'
clone.x = 272;
clone.y = 12;
```

### add-column-clone-neighbor-not-build-from-scratch
**Principle:** When adding a new column to an auto-layout table (ROW = `layoutMode: HORIZONTAL`, every cell an INSTANCE of the same `table header` / `table cell` component) — clone a NEIGHBOURING cell of the same type (`anchorNode.clone()`), change only the clone's text, and `insertChild` it at the right position using a live `row.children.findIndex(c => c.id === anchorNode.id)` (not a cached index). Don't assemble a new cell from primitives — hand-picking padding / width / text colour / border almost never matches the other cells of the same row 1:1.
**Pattern:** do the removal of extra columns and the insertion of the missing one in a single pass per EVERY row (header + all data rows): first capture references to all affected nodes (the ones to delete + the anchor to clone) BEFORE any mutation, then clone + insert, then delete — "insert-then-remove" is robust to index shifts, "remove-then-insert by cached index" is not. Auto-layout recomputes the `x` of all neighbours after `insertChild` / `.remove()` — don't touch geometry by hand.
```js
const children = row.children;               // snapshot BEFORE mutations
const toDelete = [children[9], children[15], children[24]];
const anchor = children[18];                  // the neighbour whose style we clone

const clone = anchor.clone();
const cloneText = clone.findOne(n => n.type === 'TEXT');
await figma.loadFontAsync(cloneText.fontName); // the current font, not a hardcode
cloneText.characters = 'COLUMN NAME';
row.insertChild(row.children.findIndex(c => c.id === anchor.id), clone); // live index

toDelete.forEach(n => n.remove());            // remove AFTER insert, by reference — not by index
```

### fixed-sizing-row-frame-does-not-shrink-after-child-deletion
**Principle:** A table ROW frame (`layoutMode: HORIZONTAL`, `primaryAxisSizingMode: 'FIXED'`) stores its own `.width` as a separate property, not derived from the sum of its children — deleting/narrowing child columns does NOT recompute `row.width` automatically (unlike `primaryAxisSizingMode: 'AUTO'`, where it happens by itself). The row stays physically wide (e.g. 5264 px — the old 24-column size) even when the visible children already sum to 1184 px — the extra space is simply empty and invisible while the container clips to its narrow width.
**Symptom:** a table copy cloned as an "uncropped reference" (cloning itself works fine for cells/headers) suddenly renders across the whole old extent with `clipsContent=false` — the screenshot tool returns an `original_width` matching no sensible number in the current structure (the screenshot's aspect ratio is truly wider than what the preview shows). A direct check of `row.width` reveals the old number, while `row.children.reduce((s,c)=>s+c.width,0)` gives the right (small) sum.
**Pattern:** after ANY deletion/narrowing of children in a FIXED-sizing row (the header ROW and every data ROW) — explicitly `row.resize(row.children.reduce((s,c)=>s+c.width,0), row.height)`. Do this even when the children's width sum has long looked right visually (with a clipping parent the bug is invisible) — the "ghost" surfaces only when the parent is unclipped (`clipsContent=false`) or the parent container expands to full width (the typical case — building an uncropped full-width reference).
```js
// after resizing/removing children in every ROW (header + all data rows)
for (const row of tableFrame.children) {
  const sum = row.children.reduce((s, c) => s + c.width, 0);
  row.resize(sum, row.height); // without this row.width keeps the old value, hidden by the clip for now
}
```

### table-header-resize-silently-reverts-row-cells-keep-it
**Principle:** In a table with separate `table header` / `table cell` INSTANCE rows (not a single grid structure), a `.resize(w, h)` call on a HEADER cell can be confirmed by the call itself (the `return` value shows the new width) and yet revert to the original width by the NEXT `use_figma` call — while `table cell` instances in the SAME data rows, changed in the same script, keep the new width stably. Both types are instances of the same remote `COMPONENT_SET`; the exact cause of the asymmetry (why the header variants revert) is not established.
**Symptom:** after a column resize the screenshot shows mismatched header↔row width (the header text truncates with an ellipsis, or the data column is wider/narrower than the header), although the previous `use_figma` call returned `w: <expected>` for ALL affected nodes, header included.
**Pattern:** don't trust the resize call's `return` as proof of persistence — for `table header` instances ALWAYS do a separate read-only `use_figma` AFTERWARDS (in the next call, not the same script) and compare the actual `width` of the header vs the corresponding row cells across all rows before treating the column as aligned. If a revert is found — just set the width again (the re-set holds on the second attempt in practice).
```js
// Call N: resize + confirmation in return
header.resize(260, header.height);
return { w: header.width }; // shows 260 — but that is NOT a guarantee of persistence

// Call N+1 (next, separate): mandatory re-check
const h = await figma.getNodeByIdAsync(headerId);
const r = await figma.getNodeByIdAsync(rowCellId);
if (h.width !== r.width) { h.resize(r.width, h.height); } // re-set on mismatch
```

### space-between-row-single-child-does-not-snap-to-start
**Principle:** A HORIZONTAL auto-layout row with `primaryAxisAlignItems='SPACE_BETWEEN'` and two children (e.g. "title + actions button") does NOT move the remaining child to the start of the row after one of the two is removed — `SPACE_BETWEEN` with a single child visually behaves like centring / arbitrary offset, not like `MIN` (left).
**Symptom:** after `actionsGroupNode.remove()` the title text in the cloned row renders noticeably to the right of the expected left edge (not at x=0 inside the row), with no other visible cause and no other structural change.
**Pattern:** when removing one of two children in a `SPACE_BETWEEN` row — explicitly set `row.primaryAxisAlignItems = 'MIN'` (and `counterAxisAlignItems = 'MIN'` if top alignment is needed); don't expect the remaining child to "slide" to the start by itself.
```js
const titleRow = clone.findOne(n => n.name === 'Frame 2147225513'); // HORIZONTAL, was primaryAxisAlignItems='SPACE_BETWEEN'
const actionsGroup = titleRow.findOne(n => n.name === 'actions group');
actionsGroup.remove(); // removed the duplicate Actions button (design note: don't build it here a second time)
titleRow.primaryAxisAlignItems = 'MIN'; // without this the remaining text "drifts" right of centre / old space-between logic
titleRow.counterAxisAlignItems = 'MIN';
```

### appendchild-cross-orientation-resets-fill-to-fixed
**Principle:** `parent.appendChild(existingNode)`, when the new parent is an auto-layout with a DIFFERENT orientation from the previous one (e.g. the node lived in a `VERTICAL` stack with `layoutSizingHorizontal='FILL'` and moves into a `HORIZONTAL` row), silently resets the child's `layoutSizingHorizontal` to `'FIXED'` at the currently rendered width — even if the prop was `'FILL'` before the move. No error; the value just stops being `'FILL'`.
**Symptom:** after a restructure (e.g. turning a single-column list into a grid of pairs) the second/subsequent node in each pair gets the old FIXED width and sticks far out of its new narrow parent (e.g. a child with the former 880 px width in a 568 px column) — on the screenshot the content looks "gone" (it actually just left the visible area).
**Pattern:** after EVERY `appendChild` that changes the parent's orientation, set `node.layoutSizingHorizontal = 'FILL'` (or `'HUG'` / the needed value) again explicitly — don't rely on the prop "carrying over" from the pre-move state. If you do this in one loop over N nodes — verify the result with a SCREENSHOT, not only the `return` value: raw JS reads of `node.width` right after the mutation can give unstable intermediate numbers in batch processing (see `use-figma-stale-reads-after-mutation` in the core).
```js
// ❌ before the move fieldRow.layoutSizingHorizontal === 'FILL'; expectation — it stays FILL
verticalStack.children.forEach(fieldRow => horizontalRow.appendChild(fieldRow)); // silently became 'FIXED'

// ✅ set explicitly after every move that changes orientation
horizontalRow.appendChild(fieldRow);
fieldRow.layoutSizingHorizontal = 'FILL'; // mandatory, even if it was FILL before appendChild
```

### layoutpositioning-auto-blocks-manual-x-assignment
**Principle:** Direct assignment of `node.x` on a child of an auto-layout parent silently has no effect if `node.layoutPositioning === 'AUTO'` (it participates in the flow) — the engine recomputes the position by flow logic (order / itemSpacing / align) immediately, regardless of an explicit `.x` assignment in the same script. No error; the `return` value may even show the "applied" number if `.x` is read before the recomputation, but on the next inspection call the position is unchanged.
**Symptom:** a script repositioning an icon/overlay finishes without errors, the `return` shows `oldX===newX` (unchanged), although the formula and the parent width are right.
**Pattern:** before a direct `.x`/`.y` — first `node.layoutPositioning = 'ABSOLUTE'`, then assign coordinates (the node must already be appended; see `createautolayout-default-size-hug-collapse` in the core about the right ABSOLUTE-after-appendChild order).
**Side effect that is easy to miss:** switching a child from `AUTO` to `ABSOLUTE` removes it from the parent's flow computation — if there is a FILL sibling nearby (e.g. a text block whose width was computed as "available space minus the icon"), that sibling silently GROWS into the freed space (including the freed itemSpacing). If that FILL width was a deliberate reserve (e.g. "leave 48 px for the icon" — such reserves belong in your project-specific notes), the reserve disappears once the icon becomes ABSOLUTE, and the sibling must be pinned SEPARATELY: `sibling.layoutSizingHorizontal = 'FIXED'; sibling.resize(reservedWidth, sibling.height)` — don't expect FILL to hold the old width by itself.
```js
const icon = await figma.getNodeByIdAsync(iconId);
icon.layoutPositioning = 'ABSOLUTE';           // without this the n.x below is a no-op
icon.x = icon.parent.width - icon.width - 16;

// the sibling whose FILL width held the reserve for the icon — pin explicitly
const value = await figma.getNodeByIdAsync(valueId);
value.layoutSizingHorizontal = 'FIXED';
value.resize(264, value.height);               // the same reserve, independent of the icon's presence in the flow
```

### axis-spread-heuristic-misclassifies-2d-grid-as-single-row-explodes-width
**Principle:** The heuristic "compare the children's X spread and Y spread, pick HORIZONTAL/VERTICAL by the larger" is correct only for true 1D rows/columns. On a true 2D grid (N rows × M columns, e.g. a Compare Features block — 16 feature cards 3 per row, 6 partial rows) BOTH X and Y vary across all children — the heuristic still picks ONE axis (whichever spread is larger) and lays ALL N×M children out in a single row/column. Result: the container's width/height explodes to the sum of all cells along that axis (16 cards × ~334 px ≈ 5087 px instead of the original 980 px), and HUG parents further up the tree (VERTICAL, `counterAxisSizingMode:'AUTO'`) inherit the bloated size and shift the whole section (in the observed case to x=-1758; the content visually vanished beyond the frame's viewport).
**Symptom:** after a batch auto-layout conversion the frame screenshot shows content up to a certain section and EMPTINESS after it — not broken elements but absence: the content physically moved outside the clipped frame because of a bloated HUG ancestor. Diagnosis: walk the `Page content`-like chain of parents and compare `child.width` with the expected (980 for the neighbours, 5087+ for the culprit) — the culprit is ONE node an order of magnitude wider than its siblings at the same level.
**Pattern:** before converting — if a frame has MANY children (>6–8) and they don't sort cleanly by one coordinate (i.e. both X and Y vary meaningfully, neither is "almost constant") — it's a grid candidate, not a row/column; skip-and-report rather than forcing an axis. If already broken — restore the EXACT original x/y of every child from the PRE-conversion snapshot (the pre-conversion diagnostics must save the original coordinates precisely for this rollback) and return `layoutMode='NONE'`; do NOT try to guess `layoutWrap:'WRAP'` blindly from residual data. Cross-check signal: if a sibling file (same pattern library, same component) already went through the same cleanup earlier — check how that section looks THERE before inventing grid auto-layout anew: the reference file (a profile-detail paywall screen) turned out to keep the identical 16-card Compare table as a PLAIN `layoutMode:'NONE'` with absolute x/y — the same deliberate choice to "leave it a flat grid", not an auto-layout hack.
```js
// Grid-candidate detector (run BEFORE conversion, not after):
function looksLikeGrid(node) {
  const kids = node.children;
  if (kids.length < 6) return false;
  const xs = new Set(kids.map(k => Math.round(k.x)));
  const ys = new Set(kids.map(k => Math.round(k.y)));
  return xs.size >= 3 && ys.size >= 3; // several unique X AND several unique Y → grid, not row/column
}
// Rollback of an already-broken node — restore from the saved pre-conversion snapshot, don't recompute:
table.layoutMode = 'NONE';
table.resize(980, 665); // original values
for (const [id, pos] of Object.entries(originalPositions)) { const c = await figma.getNodeByIdAsync(id); c.x = pos.x; c.y = pos.y; }
```

### group-auto-dissolves-on-last-child-removal-remove-call-throws
**Principle:** A Figma GROUP cannot exist without at least one child — when a programmatic "GROUP → FRAME" conversion (create a new FRAME in the group's place, move all children via `appendChild` into the new container) takes the GROUP's last child, the group **auto-deletes itself** by the same engine, before any explicit `.remove()` on it.
**Symptom:** `Error: in remove: The node with id "<groupId>" does not exist` — while a few lines earlier the same `groupId` resolved fine through `getNodeByIdAsync` and was used (`group.name`, `group.children`, etc.) without errors. The script is atomic — the error on the last line rolls back everything, including the already created FRAME and the moved children.
**Pattern:** after the `frame.appendChild(child)` loop that takes the group's last child — do NOT call `.remove()` on the original groupId blindly; re-read it via `getNodeByIdAsync` and call `.remove()` only if the reference still exists.
```js
const children = [...group.children];
for (const child of children) frame.appendChild(child);
const stillThere = await figma.getNodeByIdAsync(gid);
if (stillThere) stillThere.remove(); // the group may have self-deleted already — remove() on a missing id throws
```

### counter-axis-center-with-asymmetric-padding-biases-content
**Principle:** `counterAxisAlignItems: 'CENTER'` on an auto-layout frame centres in-flow children (TEXT/FRAME without `layoutPositioning: 'ABSOLUTE'`) relative to the area MINUS padding, not to the frame's full height/width — asymmetric `paddingTop`≠`paddingBottom` (or `paddingLeft`≠`paddingRight` for VERTICAL) gives a STABLE, not random, visual shift of the content by `|paddingBottom - paddingTop| / 2`, identical at any frame height (33 px, 50 px, 56 px — same offset). ABSOLUTE overlays (icons, cursors, hover backings) are not affected — they are positioned directly, independent of the parent's padding/alignment.
**Symptom:** content looks consistently shifted toward one edge (e.g. the top) in ALL rows/cards with the same auto-layout structure, but is especially visible on elements with a pair of neighbours of different heights (a 1-line value next to a 2-line one) — there the skew reads as "forgot to centre" or "didn't recompute the position after resize", although the centring formula is applied correctly and uniformly everywhere. A point fix of one node by hand (recomputing its y) cures the symptom in one place, not the cause — the bug resurfaces anywhere with the same structure.
**Pattern:** before fixing "uncentred" text with point y/x coordinates — first check `row.paddingTop` vs `row.paddingBottom` (and left/right for VERTICAL). If asymmetric and `counterAxisAlignItems === 'CENTER'` — just equalise the padding (usually 0 on both sides if the width/height is already pinned via `resize` in FIXED mode) and let the auto-layout engine recompute the in-flow children's positions by itself — without a single manual y coordinate. ABSOLUTE overlays (icon-box, nav icons, hover tint, cursors) are untouched by padding — they must be repositioned separately, by hand, with the true-centre formula (`(H - childHeight) / 2`), since they take no part in the auto-layout computation.
```js
// Diagnosis BEFORE a point fix of coordinates:
const row = await figma.getNodeByIdAsync(fieldRowId);
console.log(row.counterAxisAlignItems, row.paddingTop, row.paddingBottom);
// 'CENTER', 0, 16  → the asymmetry explains a systematic 16/2=8 px upward shift

// ❌ WRONG — fix every shifted label/value by hand with a compensation formula
label.y = (row.height - label.height) / 2 - 8; // the "magic" -8 is actually the padding bug, not a constant

// ✅ RIGHT — remove the asymmetry, let auto-layout recompute
row.paddingBottom = 0; // was 16, paddingTop already 0
row.resize(row.width, 56); // if the height must be pinned too — resize AFTER or BEFORE, order doesn't matter for padding
// label/value now centre truly, without a single manual coordinate

// ABSOLUTE overlays — separately, padding doesn't apply to them:
iconBox.y = (56 - 32) / 2; // 12, the true centre by formula
```

### space-between-single-child-centers-not-x-position
_Same mechanism as `space-between-row-single-child-does-not-snap-to-start` above (SPACE_BETWEEN with a single child doesn't left-align; fix — `primaryAxisAlignItems='MIN'` on the parent) — a different verification session, a fuller write-up._
**Principle:** A HORIZONTAL auto-layout row with `primaryAxisAlignItems: 'SPACE_BETWEEN'` and ONE child renders it CENTRED, not pinned to the start — SPACE_BETWEEN is designed for 2+ items (it stretches the space BETWEEN them); with one item Figma collapses the effect into centring. A direct `child.x = 0` does NOT fix it and silently has no effect — auto-layout recomputes the child's position on every render by the parent's rules; the specific `.x` value is ignored entirely until the parent's `primaryAxisAlignItems` is `MIN`/`MAX`.
**Symptom:** a title/label "floats" in the middle of an empty row instead of the expected left alignment; `child.x` before and after the `= 0` assignment shows the same (non-zero) value — as if the mutation didn't apply, although there was no error.
**Pattern:** find the real parent (`node.parent`), check `parent.layoutMode` / `parent.primaryAxisAlignItems` / `parent.children.length` BEFORE trying to fix the text's x/y directly. If the parent originally had 2 children (e.g. title + secondary action link) and one was removed — SPACE_BETWEEN on the remaining single child always centres it; the fix is `parent.primaryAxisAlignItems = 'MIN'` on the parent itself, not on the child.
```js
// ❌ doesn't work — auto-layout ignores a direct x mutation on the child
const titleText = titleRow.findOne(n => n.type === 'TEXT');
titleText.x = 0; // titleText.x after the assignment is still != 0

// ✅ find the parent, diagnose, fix the alignment on it
const titleRow = titleText.parent; // HORIZONTAL auto-layout, primaryAxisAlignItems=SPACE_BETWEEN, 1 child
titleRow.primaryAxisAlignItems = 'MIN';
// titleText.x is now truly 0
```
**Important consequence:** if the same title-row pattern (title + optional secondary link) is reused on several cloned pages, and on each cloned page the secondary link is removed (irrelevant to the content) — the centring bug returns on EVERY clone separately and needs the same `primaryAxisAlignItems='MIN'` fix each time; don't expect a fix on one instance to propagate to clones made BEFORE the master pattern was fixed.

### section-node-children-use-section-relative-coordinates
**Principle:** Children of a `SECTION` node are addressed in coordinates RELATIVE to the section's top-left corner, not in absolute canvas coordinates — contrary to the intuition that "a section is just a visual grouping on the canvas". `child.x = 48` puts the child 48 px from the section's left edge wherever the section itself sits (`section.x` can be anything). A `SECTION` is NOT auto-layout — manual `child.x`/`child.y` are set and respected (unlike an auto-layout FRAME, where a manual x is ignored — see `autolayout-child-x-assignment-orphans-node`).
**Symptom:** assembling content inside a section by "absolute" coordinates (`child.x = section.x + PADDING`) pushes the child far to the right; relative ones (`child.x = PADDING`) land correctly.
**Pattern:** quick convention check — for a section at `y=2100` its first child has `y≈88` (not `≈2188`) ⇒ coordinates are section-local. Position children as in an ordinary container: `child.x = PADDING; child.y = PADDING`.

### new-section-can-get-spatially-absorbed-into-existing-section
**Principle:** `page.appendChild(newSection)` does not guarantee that the new `SECTION` stays a sibling at page level — Figma periodically recomputes SECTION membership by geometry (bounding box), not by the explicit parent from the Plugin API. If the new section's position/size (or a later growth of an existing neighbouring section) leads to a geometric overlap with an existing SECTION, the new section may end up REPARENTED inside the existing one as a child — silently, without error, despite the explicit `page.appendChild` at creation.
**Symptom:** `node.parent` of a section meant to be top-level unexpectedly points at ANOTHER SECTION, not the `PAGE` — found not by an error but by redundant results: a `findAll` walk from the "independent" new section yields THE SAME nodes already found when walking the neighbouring section (duplicates in the combined list where 2 disjoint trees were expected).
**Pattern:** if 2 independent trees were expected (e.g. the main cluster + a new section next to it) — before walking "each separately", compare `newSection.parent.id` with the expected `page.id`. If the parent is another SECTION, walk ONCE from the outer (root) node — the nested tree is already in the result; a separate pass over the nested section gives pure duplicates, not new data.
```js
const section = await figma.getNodeByIdAsync(newSectionId);
if (section.parent.type === 'SECTION') {
  // reparented — walk only from section.parent (or the page), not from both separately
}
```

**Related symptom — the same geometric reshuffle moves `x`, not only `parent`.** After `resizeWithoutConstraints` on SEVERAL neighbouring top-level SECTION nodes in a row (the height of two sections out of five reduced sharply in one pass), all 5 sections of the page silently changed their order by `x` once — without a single line of code touching `x` directly; no error, no warning. Found not at the moment of the height edit but by a separate read-only call a bit later. Manually re-setting `x` to the original plan held on a repeated independent check. Looks like the same periodic geometry recompute mechanism of SECTIONs as the reparenting above, but here the effect is not a change of `parent` but a silent "tidying" of SIBLING positions at page level. Verified on a mobile chat app file — pattern: after ANY `resizeWithoutConstraints` on several sections in a row, if the relative order of sections matters (e.g. a narrative sequence of screens) — re-read `page.children.filter(n => n.type === 'SECTION')` and explicitly re-set `x` to the intended plan AFTER all resize operations; don't trust the values set at creation time.

### unclip-clipped-table-clone-for-fullwidth-uncropped-reference
**Principle:** To assemble an "uncropped full-width reference" of a table that in its real form clips to the viewport — clone not the clip-container wrapper but the inner table frame itself (the VERTICAL frame whose rows are wider than it), then on the clone: `clipsContent=false` + `counterAxisSizingMode='FIXED'` + `resize(fullRowWidth, h)` (width = the rows' own width, e.g. 2328) + hide the scrollbar-layout child (`visible=false` — there is no scroll in full width). The clone's bounding box MUST become = the content width via `resize`, otherwise with `clipsContent=false` the rows visibly stick out but `node.width` stays viewport-narrow, and the section / neighbour is sized by the wrong width.
**Symptom:** a table clone with `clipsContent=false` shows the full content, but `node.width` = 1152 (viewport) → the section under it sizes narrow; the content's right edge crosses the section boundary.
**Pattern:** rows inside the table frame are usually `FIXED width=fullWidth` (assembly legacy, see `fixed-sizing-row-frame-does-not-shrink-after-child-deletion`); the table frame itself is often `counterAxisSizingMode=FIXED` at viewport width + `clipsContent=true`. The clip on the clone comes off easily (the wrapper parent isn't in the clone), after which `resize(clone, fullWidth)` shows the rows in full.

### new-instance-in-autolayout-defaults-to-auto-positioning
**Principle:** `masterComponent.createInstance()` inside an auto-layout parent creates the instance with `layoutPositioning='AUTO'` by default — a direct `x`/`y` assignment RIGHT AFTER `appendChild` is silently ignored (the parent recomputes the position by auto-layout flow on every render). This differs from cloning an EXISTING instance of the same component (e.g. from a donor page) — if the original's `layoutPositioning` was already `ABSOLUTE` (typical "floating" component behaviour), the clone inherits that value and manual x/y works at once.
**Symptom:** `instance.x = 24` throws no error, but `get_metadata` / a re-read shows `x=0` (or an auto-computed position) — the assignment "didn't stick", although there were no other mutations between the set and the read.
**Pattern:** before setting x/y on a CREATED (not cloned) instance inside auto-layout — explicitly `instance.layoutPositioning = 'ABSOLUTE'`, then `instance.x =` / `instance.y =`.
```js
const actionBar = actionBarMaster.createInstance();
mainContent.appendChild(actionBar);
actionBar.x = 24; actionBar.y = 626; // ❌ ignored — mainContent is auto-layout, positioning=AUTO by default

actionBar.layoutPositioning = 'ABSOLUTE'; // ✅ this first
actionBar.x = 24; actionBar.y = 626; // now applies and stays
```

### insertchild-reorder-index-relative-to-current-state-not-original
**Principle:** `autoLayoutFrame.insertChild(index, existingChild)`, when reordering SEVERAL children over several consecutive calls, counts `index` from the CURRENT state of the children array at the moment of each call, not from the original (pre-reorder) state — planning final indices "on paper" from the original list and blindly applying them as a series of calls gives the wrong order once one `insertChild` has already shifted the other elements.
**Symptom:** after a series of `insertChild` calls the final order doesn't match the expectation — e.g. two elements that should have been separated by a divider end up adjacent, and the divider "disappears" from the middle (it actually just moved to another position).
**Pattern:** after each `insertChild` — re-read `parent.children.map(c => c.id)`; don't rely on indices computed before the first call of the series. For a 2-element swap ONE `insertChild` with a recomputed (not original) index of the second element is usually enough.

### primaryaxis-vs-counteraxis-sizing-mode-depends-on-parent-layoutmode-direction
**Principle:** `primaryAxisSizingMode` controls the size along the container's MAIN axis (for `layoutMode='HORIZONTAL'` — width, for `'VERTICAL'` — height); `counterAxisSizingMode` — along the CROSS axis (for `HORIZONTAL` — height, for `VERTICAL` — width). The rule applies at EVERY hierarchy level INDEPENDENTLY — if a child ROW frame is `HORIZONTAL` and the parent TABLE frame is `VERTICAL`, then "width" for one is controlled by `primaryAxisSizingMode` and for the other by `counterAxisSizingMode`, ALTHOUGH visually it's the same horizontal width down the whole column of frames. Setting `primaryAxisSizingMode='AUTO'` on the child ROWs (correct for HORIZONTAL — wants auto width) does NOT hug the parent VERTICAL TABLE to their width — the TABLE's width is governed by its OWN `counterAxisSizingMode`, which stays as it was (usually `FIXED` at a stale value), and the parent's `.width` keeps showing the old number even when all visible children have already recomputed to the new width.
**Symptom:** after fixing the width of the ROW children (`row.width` became correct, e.g. 5000), the parent container (`table.width`) STILL shows the old value (e.g. 5264) — visible as an "overhang" / empty space after the last real column before the outer container's edge, with perfectly correct inner data. Easy to mistake for "the fix didn't apply" and start re-checking already-fixed data instead of the parent.
**Pattern:** on finding "container wider than content" — check the PARENT's `counterAxisSizingMode` (if the parent is `VERTICAL`) or `primaryAxisSizingMode` (if `HORIZONTAL`) — i.e. the axis CROSS to the direction of the children's stack inside the parent, not the same property that was fixed on the children. Walk the WHOLE chain of parents from the row to the outermost auto-layout container, checking at each level the axis that is right for ITS orientation — a fix at one level doesn't propagate upward automatically if the parent has a different `layoutMode`.
```js
// ❌ fixing only the rows — the parent stays FIXED at the old width
for (const row of table.children) row.primaryAxisSizingMode = 'AUTO'; // row.layoutMode='HORIZONTAL' — right for the row
// table.layoutMode==='VERTICAL', table.width still 5264 (counterAxisSizingMode untouched)

// ✅ additionally pin the parent along ITS axis
table.counterAxisSizingMode = 'AUTO'; // VERTICAL parent — width = counter axis
// table.width is now correctly = max(children width) = 5000
```

### hardcoded-resize-height-drifts-from-hug-as-content-changes
**Principle:** When a donor container (e.g. a modal template) is auto-layout with `HUG` height, and the clone/adaptation sets an explicit `resize(w, h)` to a "hand-computed" height (the sum of known child heights at build time) — that number goes stale immediately on any later content change (text grew and wrapped to 2 lines, a child was added/removed), because `resize` switches the container's `primaryAxisSizingMode` / `layoutSizingVertical` to `FIXED`, decoupling the height from the content. The same pattern hits not only the modal root but ANY wrapper around auto-layout content (e.g. a wrapper around a table + action bar) if the wrapper's height was set by hand rather than inherited via `HUG` from the `HUG` content inside.
**Symptom:** content is clipped at the bottom/top edge (with `primaryAxisAlignItems=CENTER` — symmetrically at both edges) for no visible reason; to the eye it's "just cramped", although every child looks fine on its own. Not caught by static code review — visible only on a screenshot of the real assembled state.
**Pattern:** default — auto-layout + `HUG` along the whole container chain where applicable; do NOT compute height by hand and don't call `resize` for it. If the container is already auto-layout and `resize` accidentally pinned it — roll back: `container.primaryAxisSizingMode = 'AUTO'` (or `layoutSizingVertical = 'HUG'` in the child context) instead of recomputing the sum again. Check after cloning a template — compare the clone's `primaryAxisSizingMode` / `layoutSizingVertical` WITH THE ORIGINAL; don't rely on visual similarity.

### fixed-width-row-badge-overflows-append-as-flow-sibling-use-fill-plus-absolute-overlay
**Principle:** When a design component (e.g. a reusable DS row with a fixed native width, say 256 px) must go into a card container of FIXED width (e.g. 300 px) TOGETHER with an extra small element (badge/icon), appending the badge as a HORIZONTAL flow sibling next to the row (`rowCard.appendChild(rowInstance); rowCard.appendChild(badgeInstance);`) visually overflows the container if `padding + rowWidth + itemSpacing + badgeWidth > cardWidth` — HORIZONTAL auto-layout does NOT shrink/clip children with `primaryAxisSizingMode='FIXED'`; the excess content simply renders BEYOND the card's visible edge (cut off by the next layout neighbour, looks like a "partially vanished" badge). The working pattern (confirmed on a reference row with a badge and a kebab menu in the same file): stretch the row with `rowInstance.layoutSizingHorizontal = 'FILL'` (using the WHOLE card budget minus padding), and make the badge/icon `layoutPositioning='ABSOLUTE'` inside the same rowCard, positioned into the freed "empty" space to the right of the row content (`x = paddingLeft + rowInstance.width - overlay.width - marginRight`). The DS component's inner auto-layout, when stretched, keeps its content (avatar + text) left-anchored rather than stretching it — the block on the right stays empty and safely takes the overlay.
**Symptom:** `get_screenshot` shows the badge/icon cut off at the card's right edge (only a fragment visible, e.g. "• C" instead of the full "Primary"), or entirely shifted past the card into the next sibling's area — while `get_metadata` confirms both nodes exist and are formally appended to the right parent, masking the real cause (the node seems "lost", while the issue is fixed-width overflow).
**Pattern:** extra nuance — with test content of variable length (a long username) the overlay may VISUALLY overlap the row text even after FILL+ABSOLUTE if the overlay's width (e.g. an 82 px badge) exceeds the available "tail" of empty space for that text — large overlays (a badge) may need shorter test content in the row; small ones (a 40 px kebab icon) usually have enough room even with long text.

### variant-swap-on-fill-child-inside-fixed-parent-has-no-visible-effect
**Principle:** When a node with `layoutSizingHorizontal='FILL'` is a nested INSTANCE whose variant axis (e.g. `Size: Mobile|Desktop`) in theory changes its "preferred"/intrinsic width — and its direct parent has `primaryAxisSizingMode='FIXED'` (not `AUTO`/HUG), `setProperties` on the child instance applies correctly (the value verifiably changes in `componentProperties`), but the RENDER doesn't change at all: `.width` before and after is identical. Cause — FILL ignores the variant's intrinsic size entirely and always takes exactly the space the FIXED parent gives minus siblings/gap/padding; the instance's "wish" to become wider after the variant change never reaches the outside until the FIXED container itself physically grows.
**Symptom:** `setProperties({'Size': 'Desktop'})` throws no error, `componentProperties['Size'].value === 'Desktop'` is confirmed by reading, but the instance's `.width` (and the whole visual state) is identical to before the call — looks like "the mutation didn't work", although structurally it fully did.
**Pattern:** diagnosis — read the target instance's `layoutSizingHorizontal` AND its direct parent's `primaryAxisSizingMode` / `counterAxisSizingMode` BEFORE changing the variant for the sake of width growth. If the parent is `FIXED` and the child `FILL` — growth must go through an explicit `parent.resize(newWidth, parent.height)` (the parent stays FIXED, just at a new value), not through attempts to make the variant itself "grow"; the FILL child picks up the new width automatically without a separate mutation.
```js
// ❌ no visible effect — trigger.layoutSizingHorizontal === 'FILL', rowCard.primaryAxisSizingMode === 'FIXED'
trigger.setProperties({ Size: 'Desktop' }); // componentProperties change, .width doesn't

// ✅ resize the FIXED parent directly — the FILL child stretches automatically
rowCard.resize(362, rowCard.height); // was 338; trigger.width jumped from 184 to 208 without a separate mutation
```
```js
const rowInstance = variant.createInstance();
rowCard.appendChild(rowInstance);
rowCard.layoutSizingHorizontal = 'FIXED';
rowCard.resize(300, rowCard.height);
rowInstance.layoutSizingHorizontal = 'FILL'; // stretches the 256 px row to 276 px (300 - 2*12 padding)

const badgeInstance = badgeMaster.createInstance();
rowCard.appendChild(badgeInstance);
badgeInstance.layoutPositioning = 'ABSOLUTE'; // leaves the flow — takes no part in the overflow
const contentRight = rowCard.paddingLeft + rowInstance.width;
badgeInstance.x = contentRight - badgeInstance.width - 8; // overlay in the row's empty tail
badgeInstance.y = rowCard.paddingTop + 8;
```

**Important correction (same file, the redesign session right after):** FILL+ABSOLUTE above is a workaround, not the only solution. The component that "overflowed" above turned out to be a FULL auto-layout component (not hard 256 px) — a direct `topLevelInstance.layoutSizingHorizontal='FIXED'; topLevelInstance.resize(narrowerWidth, height)` on the INSTANCE itself (not its parent) correctly cascaded all nested FILL children (Master→Container→username) down to at least 176 px without a single error. If the task is a genuine flow-based accessory (not an overlay but a real width neighbour) — first check whether the component instance resizes on its own (a scratch test instance, `layoutSizingHorizontal='FIXED'` + `resize`, read the nested children's `.width`) — if yes, ABSOLUTE isn't needed at all: build `[instance(FILL)] [accessory(FIXED)]` as ordinary HORIZONTAL siblings. The ABSOLUTE pattern above remains the right solution only when the instance REALLY doesn't resize (hard HUG without an inner FILL cascade).
```js
// Discovery — check before reaching for the ABSOLUTE hack
const scratch = variant.createInstance();
page.appendChild(scratch); scratch.x = 40000; scratch.y = 40000; // park off-canvas
scratch.layoutSizingHorizontal = 'FIXED';
scratch.resize(narrowerWidth, scratch.height);
const stillOk = scratch.width === narrowerWidth; // true → the component is resizable, ABSOLUTE not needed
scratch.remove();
```

### clone-fill-collapses-in-hug-parent

**Principle:** `sourceNode.clone()` + `appendChild` into a NEW auto-layout parent of the same orientation but with `primaryAxisSizingMode='AUTO'` (HUG) instead of `FIXED` does not reset the clone's inherited `layoutSizingHorizontal='FILL'` (unlike an orientation change, see the `parent.appendChild(existingNode)` rule above) — but the result is still wrong: FILL in a HUG parent has no available width to lean on, so Figma resolves it by the width of the other HUG-defining siblings (e.g. a text label), not by the cloned node's "natural"/original width.
**Symptom:** a cloned component with an original width of 338/362 px (it was `FILL` against a FIXED parent like a card scroll container), after cloning into a new VERTICAL cell next to a short text caption, collapses to the caption's width (e.g. 84–95 px) — visually a narrow, ruined card, although the structure and all child nodes are intact.
**Pattern:** right after `cell.appendChild(clone)` — explicitly `clone.layoutSizingHorizontal = 'FIXED'; clone.resize(originalWidth, clone.height)`; don't expect the clone to "remember" its former FILL-resolved width. Check numerically (`clone.width`), not by eye — on a screenshot a narrow card may not be obvious without a same-width reference next to it.
```js
const clone = sourceRowCard.clone();      // sourceRowCard.layoutSizingHorizontal === 'FILL' inherited from the scroll container
cell.appendChild(clone);                   // cell — VERTICAL, HUG on both axes
// ❌ without the fix: clone.width collapses to the neighbouring label's width inside cell
clone.layoutSizingHorizontal = 'FIXED';
clone.resize(338, clone.height);           // ✅ restore the original width explicitly
```

### autolayout-manual-xy-silently-ignored-order-controls-position

**Principle:** Manually assigning `.x`/`.y` to a child inside an auto-layout parent (`layoutMode` = `HORIZONTAL`/`VERTICAL`) is silently ignored by the auto-layout engine — the real position is recomputed from the ORDER in `parent.children` (plus `itemSpacing`), not from the assigned coordinates. `appendChild(node)` inserts the node at the END of the children list regardless of the coordinates set on it afterwards.
**Symptom:** after `parent.appendChild(newChild); newChild.x = desiredX;` the node visually lands not where `x` was set but where its actual position in the children list puts it — e.g. elements meant to go at the START of the row (`x=0,478,956…`) actually appear at the END (after the existing children), because `appendChild` added them last and the subsequent `.x` assignment was silently overwritten by the auto-layout reflow. Deceptive: the script throws no error, `node.x` right after the assignment may even read as the "right" value, but the next `get_screenshot` / recomputation shows a different order.
**Pattern:** to insert nodes at a specific position in an auto-layout row — use `parent.insertChild(index, node)` with the needed index (not `appendChild` + manual `.x`). To insert several nodes AT THE START — call `insertChild(0, nodeA); insertChild(1, nodeB); insertChild(2, nodeC)` in sequence (each next call shifts the already inserted ones). Afterwards — do NOT set `.x` by hand at all; auto-layout recomputes positions by `itemSpacing`; read `node.x` AFTER the reorder for verification, don't rely on a value assigned before it.
```js
// ❌ WRONG — appendChild puts it last; the manual .x is overwritten by auto-layout
row.appendChild(shellA); shellA.x = 0;   // actually ends up LAST in the row; x ignored

// ✅ RIGHT — insertChild controls the order; auto-layout lays out x by itemSpacing itself
row.insertChild(0, shellA);
row.insertChild(1, shellB);
row.insertChild(2, shellC);
const verifiedX = row.children.map(c => c.x); // read AFTER the reorder; don't trust .x from before
```

### section-resize-must-use-local-not-page-absolute-coordinates

**Principle:** `SECTION.resizeWithoutConstraints(w, h)` expects dimensions computed from the children's **section-local** coordinates (the ones children have RIGHT AFTER `section.appendChild(child)` — see `section-node-children-use-section-relative-coordinates` above), not from the section's own page-absolute coordinates. Subtracting `section.x`/`section.y` (page-absolute) from already-local `child.x`/`child.y` is a double shift into the negative, not a normalisation.
**Symptom:** `resizeWithoutConstraints` throws `Property "width" failed validation: Number must be greater than or equal to 0` — the section sits at a large page-absolute offset (e.g. x=15356, typical for the Nth section in a row of existing ones), while its children have small local coordinates (e.g. x=2140) — subtracting `section.x` from `child.x` gives a deeply negative number.
**Pattern:** compute `sectionWidth`/`sectionHeight` DIRECTLY from the local `child.x + child.width` (+ margin) — without any arithmetic on `section.x`/`section.y`. The section itself already sits at the right page-absolute place (set by a separate `section.x = …; section.y = …;` before or after appending the children) — its own position and its size are computed in independent coordinate systems (the first — absolute position on the page, the second — a bounding box in the children's local coordinates).
```js
// ❌ WRONG — child.x is already section-local (60..2140), but the code also subtracts section.x (15356, page-absolute)
const sectionW = (wrap3.x + wrap3.width + 60) - section.x;  // 2140+940+60-15356 = negative → throws

// ✅ RIGHT — the children's local coordinates are self-sufficient; section.x is not part of the formula
const sectionW = wrap3.x + wrap3.width + 60;                 // 2140+940+60 = 3140, correct
section.resizeWithoutConstraints(sectionW, sectionH);
```

### clone-into-plain-frame-with-scale-constraints-distorts-on-resize

**Principle:** A cloned INSTANCE with `constraints={horizontal:'SCALE', vertical:'SCALE'}` (a frequent default for small icon instances inside third-party components), placed via `appendChild` into a NEW `figma.createFrame` (default size 100×100), gets visually DISTORTED (loses proportions) if that new frame is later resized via `.resize(w, h)` to dimensions with a different aspect ratio from the original 100×100 — the SCALE constraint scales the child PROPORTIONALLY to the parent's size change instead of keeping its original size.
**Symptom:** an icon (e.g. an x-circle icon, normally 24×24) renders as a squashed oval/ellipse instead of a circle — on inspection `icon.height` is a fractional number far below 24 (e.g. 5.76) while `icon.width` stayed 24. The arithmetic matches the parent's compression factor: `newParentHeight / 100 * originalIconHeight` (e.g. `24/100 * 24 = 5.76`) — confirming the cause is the SCALE constraint reacting to the **default** 100×100 size of the freshly created `createFrame`, not to an intermediate size the cloned icon "expected".
**Pattern:** before placing a third-party cloned instance into a new `figma.createFrame` that will then be resized — either (a) right after `appendChild` set `icon.constraints = {horizontal:'MIN', vertical:'MIN'}` BEFORE calling `.resize` on the parent, or (b) resize the parent to its final size FIRST, then append + position the icon (no proportional scaling happens, because the parent no longer changes after the child appears). If the bug has already shown — post-hoc fix: `icon.constraints = {horizontal:'MIN', vertical:'MIN'}; icon.resize(24, 24);` (or the original correct size).
```js
// ❌ WRONG — an icon with SCALE constraints lands in a 100×100 default frame, then the frame is resized to the table column
const cell = figma.createFrame();          // default 100×100
cell.appendChild(iconClone);               // iconClone: 24×24, constraints SCALE/SCALE
cell.resize(100, 24);                      // parent 100×100 → 100×24, child squashed proportionally: 24×5.76

// ✅ RIGHT — reset constraints to MIN right after appendChild, before any parent resize
const cell = figma.createFrame();
cell.appendChild(iconClone);
iconClone.constraints = { horizontal: 'MIN', vertical: 'MIN' };
cell.resize(100, 24);                      // the child no longer scales with the parent
```

### clone-then-extract-child-leaves-orphaned-wrapper-at-page-level

**Principle:** The pattern `const wrapper = donor.clone(); const child = wrapper.children.find(...); targetParent.appendChild(child);` moves only `child` INTO targetParent, while the `wrapper` ITSELF (already separated from `child` after the `appendChild`, which physically detaches the moved node) stays hanging as a separate top-level node on the current page (see the related core rule `clone-reparents-to-currentpage-if-source-not-on-currentpage` in SKILL.md — this also covers the fact that `wrapper` was never explicitly removed).
**Symptom:** a page-wide collision check suddenly shows N extra top-level nodes named after the donor (e.g. the content-body wrapper) that weren't in the page plan — usually located near (0,0) or wherever `figma.currentPage` was at clone time; visually an empty frame with one orphaned text node (e.g. the donor's section heading, left without its original body).
**Pattern:** either (a) don't clone the whole `donor` if only one of its children is needed — clone THE needed child directly (`donor.children.find(...).clone()`), or (b) after extracting the needed child from `wrapper.clone()` explicitly call `wrapper.remove()`. The final page-wide collision check before screenshot QA (already a mandatory item of the guardrail checklist) catches these orphans — provided it runs AFTER all clone-and-extract operations, not only after the main assembly.

### counteraxis-hug-then-child-fill-collapses-single-child-frame

**Principle:** Toggling `counterAxisSizingMode` back to `'AUTO'` (HUG) AFTER pinning the width with `resize`, then appending a single child with `layoutSizingHorizontal='FILL'`, creates a circular dependency (FILL needs a fixed parent, HUG needs a size from the child), and Figma resolves it degenerately: `primaryAxisSizingMode` falls back to `FIXED` with height ~1, and the parent's width collapses to the unwrapped single-line text width, not the planned fixed width.
**Symptom:** after creating an auto-layout "bubble"/tooltip frame with one TEXT child (`resize(280,1)` → `counterAxisSizingMode='FIXED'` → back to `'AUTO'` → append text → `text.layoutSizingHorizontal='FILL'`) the final screenshot/readback shows `height:1` and a `width` far larger than planned (e.g. 559 instead of 280) — the text doesn't wrap by words and reads as a single line over a narrow "bubble".
**Pattern:** don't switch `counterAxisSizingMode` back to `'AUTO'` for the axis that needs a FIXED width with text filling it via `FILL`. Sequence: `resize(w, anyH)` (pins BOTH axes to FIXED) → `primaryAxisSizingMode='AUTO'` (HUG on height only) → leave `counterAxisSizingMode` as is (FIXED from the resize) → append text → `text.layoutSizingHorizontal='FILL'`. If the bug has already shown — the post-hoc fix is the same sequence on the existing node (resize restores both FIXED, then set only primaryAxisSizingMode='AUTO').
```js
// ❌ WRONG — counterAxis returned to AUTO right before the FILL child
bubble.counterAxisSizingMode = 'FIXED';
bubble.resize(280, 1);
bubble.counterAxisSizingMode = 'AUTO';   // breaks the fixed width
bubble.appendChild(text);
text.layoutSizingHorizontal = 'FILL';    // circular dependency → height:1, width inflated

// ✅ RIGHT — counterAxis stays FIXED (already set by resize()); change only primaryAxis
bubble.resize(280, 40);                  // resize resets BOTH axes to FIXED
bubble.primaryAxisSizingMode = 'AUTO';   // HUG on height only; width stays FIXED 280
bubble.appendChild(text);
text.layoutSizingHorizontal = 'FILL';    // now FILL fills a real FIXED parent
```

### patternpaint-type-exists-in-dts-but-runtime-rejects-it
**Principle:** `PatternPaint` (`{type:'PATTERN', sourceNodeId, tileType, scalingFactor, spacing, horizontalAlignment}`) exists as a full interface in `plugin-api-standalone.d.ts` (Figma documented pattern fills in the Plugin API), but assigning `node.fills = [{type:'PATTERN',...}]` in the `use_figma` runtime fails validation — the `PATTERN` type is missing from the actually accepted discriminator list.
**Symptom:** `Error: in set_fills: Property "fills" failed validation: Invalid discriminator value. Expected 'SOLID' | 'SHADER' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'VIDEO' at [0].type` — `PATTERN` is literally not in the accepted list despite the type being in the `.d.ts`.
**Pattern (working substitute for repeating patterns such as 45° hatching):** instead of paint-level tiling — build one small tile node (a FRAME with a base fill + overlay geometry of the pattern) once, then **clone it into a grid** (`Math.ceil(width/tileSize)+1` columns × `Math.ceil(height/tileSize)+1` rows) inside a container with `clipsContent=true`. For a 45° / period P / width W two-colour diagonal hatch (the equivalent of CSS `repeating-linear-gradient(45deg, …)`) — a `P×P` tile (where `P=2W`), base fill = colour B over the whole tile, on top — ONE vector polygon (not two separate triangles + a parallelogram — they form one continuous band): for W=4, P=8 the polygon is `M 0 0 L 4 0 L 8 4 L 8 8 L 4 4 Z` (a pentagon from (0,0) to (8,8) through the midpoints of the side edges) — with RECTANGULAR tiling of the clones this geometry joins without a visible seam.
```js
// tile source: 8x8, base=accent@30%, overlay pentagon=accent@100% (45°/period 8/width 4 stripe)
const tile = figma.createFrame();
tile.resize(8, 8); tile.clipsContent = true;
tile.fills = [{ type: 'SOLID', color: accentRGB, opacity: 0.3 }];
const stripe = figma.createVector();
stripe.resize(8, 8);
stripe.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 0 0 L 4 0 L 8 4 L 8 8 L 4 4 Z' }]; // note the spaces — see vectorpaths-data-requires-spaces
stripe.fills = [{ type: 'SOLID', color: accentRGB }];
tile.appendChild(stripe);

// application: clone the tile into a grid inside a clipsContent container of any size
const cols = Math.ceil(targetWidth / 8) + 1, rows = Math.ceil(targetHeight / 8) + 1;
for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
  const clone = tile.clone();
  container.appendChild(clone);
  clone.x = c * 8; clone.y = r * 8;
}
tile.remove(); // the master tile is no longer needed after cloning unless reuse is planned
```

### tests-frame-needs-own-bg-fill-bound-to-semantic-for-dark-mode-visibility
**Principle:** A Tests block (light/dark) must have ITS OWN fill bound to `fill/bg/primary` (or an equivalent mode-dependent bg token) — if the frame is left transparent/white and relies only on child text/icons flipping colour by mode, `setExplicitVariableModeForCollection(..., darkModeId)` on the frame itself creates no visible dark background, and the light-themed text nodes (switched to a light colour by the dark mode) render almost invisible on Figma's default white canvas.
**Symptom:** the Tests Dark screenshot shows barely visible grey text on a white/light background instead of the expected light text on a dark background — while the component itself inside (not the Tests wrapper) switches correctly.
**Pattern:** before pinning the mode — `frame.fills = [boundToVariable(bgPrimaryVar)]` on the Tests CONTAINER itself, not only on child nodes. Check a neighbouring component's reference (`await figma.getNodeByIdAsync(knownGoodTestsId)`) — `fills[0].boundVariables` almost certainly points at `fill/bg/primary`.

### counteraxissizingmode-silent-auto-collapses-hug-width-below-fixed-children
**Principle:** An auto-layout frame (`layoutMode='VERTICAL'`) whose `counterAxisSizingMode` is unexpectedly `'AUTO'` (not `'FIXED'` as designed) hugs its width not "sensibly to the widest visible child" but may give a value substantially SMALLER than the width of deeply nested FIXED-width nodes further down the tree (e.g. `header row` / `body list` pinned at 394 px while the frame collapses to 209 px) — nested FILL chains without a defined parent width resolve to their minimal intrinsic size, not to the widest descendant.
**Symptom:** a visually "squeezed" window/card — text truncates/wraps aggressively although no text node changed on its own; the cause isn't obvious to the eye until you compare `counterAxisSizingMode` with a neighbouring correct instance of the same pattern.
**Pattern:** find a correct sibling/analogue (the same component in another state/variant) and compare `counterAxisSizingMode` + `width` — if the working one is `FIXED` + explicit width and the broken one `AUTO`, restore `FIXED` + `resize(correctWidth, currentHeight)`. The cascade of inner FILL children recomputes automatically, without separate edits at each level.
```js
const broken = await figma.getNodeByIdAsync(id);
broken.counterAxisSizingMode = 'FIXED';
broken.resize(426, broken.height);         // the reference width
broken.primaryAxisSizingMode = 'AUTO';     // re-set HUG height AFTER resize (resize resets both axes to FIXED)
```

### manual-fixed-gap-row-reflow-after-resizing-one-item
**Principle:** When several nodes form a "row" through MANUAL positioning (same Y, each next X = previous X + width + a fixed gap) — NOT auto-layout — changing the width of ONE element doesn't move the neighbours automatically (unlike auto-layout, where itemSpacing keeps the gap by itself). An explicit reflow of all elements AFTER the changed one is needed.
**Symptom:** after `resize` of one frame in the row it overlaps the next neighbour (or forms an uneven gap), although the resize itself ran without errors; the collision is caught only by an explicit bbox check, not by eye on a single-frame screenshot.
**Pattern:** sort all row elements by current `x` (with a common parent raw `.x` is directly comparable — no `absoluteTransform` needed), walk left to right, recompute `x = runningX; runningX += width + GAP`. Then check whether the last element crossed the containing SECTION/FRAME's edge — `resizeWithoutConstraints` the container to the new `maxRight` if needed.
```js
const GAP = 100;
const items = [...container.children].sort((a, b) => a.x - b.x);
let runningX = items[0].x;
for (const item of items) {
  item.x = runningX;
  runningX += item.width + GAP;
}
```

### instance-sublayer-in-none-layout-parent-blocks-resize-and-x-y-override-detach-first
**Principle:** A child inside a LIVE INSTANCE (not the master), when that child's parent is an ordinary FRAME with `layoutMode='NONE'` (not auto-layout), does NOT allow overriding `resize` (width/height) or direct `x`/`y` assignment — Figma treats such a child's geometry as "structural", bound to the master, and gives no per-instance override in a NONE-layout context. `resizeWithoutConstraints` doesn't help either — both methods **silently don't apply the change** (the value stays, no error), whereas a direct `node.x = N` **explicitly throws** `Error: in set_x: This property cannot be overridden in an instance` — the same block, just with different behaviour per setter (resize is a silent no-op, x/y throws). Other mutations on the same node (rename, opacity) apply normally — the block is specific to geometry (position/size), not to the node as a whole.
**Symptom:** a script `fill.resize(newWidth, fill.height)` runs without a single error; `fill.width` right after the call (and on a repeat `getNodeByIdAsync` in the same and the next script) shows the OLD value — looks like "the edit didn't save", although technically the script "succeeded". Diagnose: try `node.x = node.x` (an identity assignment) — if it throws `"This property cannot be overridden in an instance"`, the node is geometry-locked for exactly this reason, not because of buggy script logic.
**Pattern:** `const detached = instanceChild.detachInstance();` converts THIS nested node into an independent FRAME (not the whole parent component) — after that `resize` / `x =` work freely. If the nested node lies inside a SHARED master component (used via `Instance` in many places of the file), do the detach + resize **on the master itself** (not in every embedding place separately) — the structural change (child type INSTANCE→FRAME) cascades correctly to all live instances of the master across the file, by the same mechanism as any other structural master edit (see `component-cascade-instance-vs-manual-clone-inheritance-divergence` in instances.md) — verify the cascade by reading the new IDs (`I<embeddingInstanceId>;<newDetachedFrameId>`) in 1–2 downstream places; don't take it on faith.
```js
const row = await figma.getNodeByIdAsync(rowInstanceId);
const detached = row.detachInstance();               // converts THIS node into a FRAME
const fill = detached.findOne(n => n.name === 'Fill');
fill.resize(targetWidth, fill.height);                // now applies for real
```

**Continuation — an unhandled throw somewhere AFTER this rule in the same script rolls back the edits already applied successfully BEFORE it.** Real case: a script looping over 2 items created + positioned a scrollbar instance (`appendChild` + `resize` + `x`/`y` on the TOP-level instance — all passed without errors), then tried resize/x/y on a NESTED instance sublayer (the thumb) WITHOUT detach — a silent no-op on resize, then an explicit throw on `x =` (this very rule) on the first loop iteration, which cut the script before the second iteration. Expectedly the 2nd item is untouched — UNEXPECTEDLY, on the next read the node created BEFORE the throw on the 1st iteration (the top-level scrollbar instance, already appended and positioned without a single error) **was also missing** from the tree. It seems the whole `use_figma` call with an unhandled exception rolls back entirely (as a single undo transaction), rather than committing everything that ran before the offending line.
**Practical consequence:** you cannot rely on "this mutation definitely applied because the script reached it without error" — if the SCRIPT AS A WHOLE later fails on a later line, the earlier executed (non-throwing) mutations of the same call may be undone with it. Wrap the risky operation (a non-standard nested INSTANCE, an untested API) in `try/catch` — or make it the FIRST/only operation in the call — so a failure doesn't erase useful work done alongside.

### clipscontent-off-pushes-corner-radius-down-to-header-and-footer
**Principle:** A modal/card that needs `clipsContent=false` on its root (to let a child absolutely-positioned element — an open dropdown, a popover — escape its own bounds without being cut off) loses its visual corner rounding as a whole: `cornerRadius` on the root keeps existing as a value, but without the clip it "rounds" nothing (the root usually has no fill of its own — the white background is drawn by the children). Working trick: the rounding moves one level down — the TOP element (the header / the modal header) gets `topLeftRadius` / `topRightRadius` = the target radius (24), `bottomLeftRadius` / `bottomRightRadius` = 0; the BOTTOM element (the footer / the button dock) — the reverse, `bottomLeftRadius` / `bottomRightRadius` = the radius, top ones = 0. The middle content (the content layout) stays fully square (0 on all sides) — it needn't be rounded, being sandwiched between already-rounded neighbours. The opening overlay (dropdown menu) is a separate node with its OWN `cornerRadius` (usually smaller, 12) and its own `DROP_SHADOW`, added as a DIRECT child of the root (not nested in the content layout) with `layoutPositioning='ABSOLUTE'`, so it falls under the same (removed) root clip and isn't cut off by its own content layout if that has `clipsContent=true`.
**Symptom:** the naive attempt (remove the clip from the root and stop) gives a modal with square corners — visually a "square box" instead of a card, although `cornerRadius` on the root still holds the right value; the confusion is that the property value exists but has no effect, because the clip is what actually "cuts" the rounded shape out of the rectangular node.
**Pattern:**
```js
root.clipsContent = false; // let the dropdown escape the bounds
header.topLeftRadius = 24; header.topRightRadius = 24; header.bottomLeftRadius = 0; header.bottomRightRadius = 0;
footer.topLeftRadius = 0; footer.topRightRadius = 0; footer.bottomLeftRadius = 24; footer.bottomRightRadius = 24;
// content layout — leave cornerRadius alone, stays 0 on all sides

const dropdown = donorDropdown.clone();
root.appendChild(dropdown); // a DIRECT child of the root, not content layout — otherwise its own clipsContent may cut it
dropdown.layoutPositioning = 'ABSOLUTE';
dropdown.x = selectRelX; dropdown.y = selectRelY + selectHeight + 8; // right under the field; coordinates relative to the root
```

### clone-reparent-into-fresh-hug-frame-inherits-fill-sizing-shrinks-to-first-sibling-width
**Principle:** `sourceInstance.clone()`, if the source node had `layoutSizingHorizontal='FILL'` in ITS original auto-layout parent (e.g. a 400 px column), keeps `FILL` when cloned. If the clone is then added (`appendChild`) to a NEW auto-layout FRAME with `counterAxisSizingMode='AUTO'` (HUG) that already has another child at that point (e.g. a short caption TEXT ~180 px, added first) — FILL makes the clone stretch/shrink to the parent's CURRENT hug width at layout time (~180 px), not to its own "natural" width (400 px), and the parent does NOT recompute its hug width upward to the maximum among children as intuition would expect.
**Symptom:** `clone.width` right after `appendChild` + `layoutSizingHorizontal='FIXED'` returns an already-corrupted smaller value (in the observed case 180 instead of 400) — an attempt to read the clone's "current" width for a subsequent `resize` gives a wrong baseline, because the read happens AFTER the corruption, not before. The final render — a squashed/compressed component (a histogram with compressed bars) — doesn't immediately read as a bug unless you compare the visible width with a screenshot of a neighbouring similar block.
**Pattern:** capture `sourceWidth = source.width` (and `height` if needed too) from the ORIGINAL node BEFORE `.clone()` / `appendChild` into the new context — after the move always explicitly `clone.layoutSizingHorizontal = 'FIXED'; clone.resize(sourceWidth, clone.height);`, not trusting a `clone.width` read after the fact in the new parent.
```js
const sourceWidth = source.width; // BEFORE cloning — the only reliable baseline
const clone = source.clone();
wrapper.appendChild(clone); // wrapper already holds a ~180 px caption; HUG hasn't grown to 400 yet
clone.layoutSizingHorizontal = 'FIXED';
clone.resize(sourceWidth, clone.height); // force the right width explicitly; don't rely on auto
```

### group-children-xy-relative-to-groups-parent-not-group-itself
**Principle:** A `GROUP` node (unlike a `FRAME`) has no coordinate origin of its own — the group's children's `.x`/`.y` are reported by the API in the coordinate system of the GROUP'S PARENT, not of the group itself, although the group also reports its `.x`/`.y` in that same parent system (i.e. the group and its children share one coordinate base — the group's parent). Moving a child from a GROUP into a new FRAME ("group-to-frame" conversion) with a naive `child.x = childXBeforeMove` (no correction) puts the child where it would be if the FRAME itself were transparent at 0×0 — i.e. shifted sideways by the original group.x/group.y.
**Symptom:** after a group→frame conversion the single/several children fly far outside the new (small) frame — the frame's final bounding box inflates many times over (drift of up to 300 px observed on a 30 px frame), and auto-layout HUG parents further up the tree inflate in cascade (the screen's height/width grows noticeably for no visible reason on a screenshot, unless compared with a reference).
**Pattern:** when moving a child from a GROUP into a new FRAME — subtract the coordinates of THE GROUP ITSELF (not the frame's parent) before restoring: `cx = child.x - group.x; cy = child.y - group.y`. For FRAME sources (not GROUP) this subtraction must NOT be done — there `.x`/`.y` are already honestly frame-relative; subtracting would break a correct move.
```js
// ❌ WRONG for a GROUP source — child.x is already in the group's ANCESTOR coordinates, not the group's
const childSnapshots = group.children.map(c => ({ node: c, cx: c.x, cy: c.y }));
// ... after appendChild into the new frame: node.x = cx — shifted sideways by group.x/group.y

// ✅ RIGHT — subtract the group's coordinates to get the offset relative to the NEW frame (which takes the group's place)
const localX = group.x, localY = group.y;
const childSnapshots = group.children.map(c => ({ node: c, cx: c.x - localX, cy: c.y - localY }));
```

### spacing-merge-additive-padding-not-validated-against-childs-own-sizing
**Principle:** Collapsing a single-child "spacing" wrapper — adding the wrapper's padding to the child's own padding and dropping the wrapper — typically reports only "transferred" as its success signal and does NOT check the result against the child's actual geometry/sizing mode. If the child stays `layoutSizingHorizontal/Vertical = 'FIXED'` (not HUG) — the summed padding is applied to a box whose size does NOT change, and may yield structurally contradictory values (the padding along one axis in total LARGER than the box's size along that axis). If the child is `FILL` in the context of the ORIGINAL (narrower) parent — once the wrapper is removed and the child occupies its slot in a WIDER grandparent, `FILL` makes it stretch to the new (wider) width, losing the intended side margins the wrapper used to provide.
**Symptom (FIXED child):** `paddingTop + paddingBottom` (or left+right) after the merge doesn't visibly break the render if alignment = `CENTER`/`CENTER` (padding is ignored for positioning under exact alignment), but the data is internally contradictory — noticeable only by reading properties (`padding.t + padding.b > node.height`), not on a screenshot.
**Symptom (FILL child):** the element stretches to the full width/height of the NEW parent, losing the side margins the removed wrapper used to give — visible on a screenshot as "missing margins" (e.g. a search input flush with the screen edges instead of indented like the neighbouring rows).
**Pattern:** after such a merge — don't trust the "transferred" flag; check explicitly: (1) `paddingTop+paddingBottom <= child.height` AND `paddingLeft+paddingRight <= child.width` — if exceeded, decide deliberately: either `FIXED` + `CENTER` alignment makes the padding decorative (can be zeroed), or a different distribution is really needed (`SPACE_BETWEEN` instead of a large `itemSpacing`, etc.); (2) if the child's `layoutSizingHorizontal/Vertical` is `FILL`, compare with the SIBLINGS in the new parent: if they THEMSELVES use `FILL` + their own padding (the shared convention) — keep `FILL` but roll the padding back to the original (NOT doubled) values, rather than switching to `FIXED` with a smaller width.
```js
// after the merge — contradiction check
const c = await figma.getNodeByIdAsync(replacementId);
if ((c.paddingTop||0) + (c.paddingBottom||0) > c.height || (c.paddingLeft||0) + (c.paddingRight||0) > c.width) {
  // padding exceeds the box itself — decide: zero it (if alignment makes it decorative) or recompute the layout
}
// if the child is FILL — compare with siblings in the NEW parent for the shared convention (all FILL+padding, or all FIXED+width)
```

### section-clone-may-reverse-children-array-order
**Principle:** `SECTION.clone()` copies all child FRAME/INSTANCE nodes with their relative positions (`x`/`y` inside the section) correctly, but does NOT guarantee the same order in the resulting `clone.children` array as in the original — the visual left-to-right / top-to-bottom order (by `x`/`y`) may stay the same while the TRAVERSAL order (`clone.children[0]`, `[1]`, …) turns out reversed relative to the original `appendChild` order.
**Symptom:** a destructuring like `const [f1, f2] = clone.children` and subsequent naming/labelling by that order (`f1.name = 'A'`, `f2.name = 'B'`) yields a node NAMED "A" physically standing where node "B" stood before (and in the original) — a name↔content mismatch not caught by a position/geometry check (that stays correct), only by explicitly reading each node's content (text/structure) after the rename.
**Pattern:** after cloning a SECTION with several children — don't rely on the `children` index to identify "which node this is"; verify by content (e.g. `findAll(n => n.type==='TEXT').map(t=>t.characters)`) BEFORE renaming/annotating, or rename after the fact based on the content read, not on a pre-chosen order.

### page-merge-recipe-reparent-then-set-section-xy-no-child-math-needed
**Principle:** Merging N SECTION nodes from one page onto another (combining two Figma pages into one) requires no coordinate recomputation for any descendant — the combination of two already documented facts (`cross-page-appendchild-moves-node` in SKILL.md: `targetPage.appendChild(section)` moves a section between pages directly by ID; `section-node-children-use-section-relative-coordinates` above: a section's children's coordinates are section-local, not page-absolute) gives a ready "one line per section" recipe: `targetPage.appendChild(section); section.x = newX; section.y = newY;` — setting `section.x`/`section.y` after the move shifts ALL the section's descendants in cascade (their local coordinates are untouched; page-absolute is recomputed automatically by transform composition). Works identically for sections already on the target page (just reposition, no reparent) and for those moved from another page.
**Symptom (when the recipe is NOT used):** trying to shift each descendant of the section by a delta by hand (`child.x += dx`) is redundant and risks accumulating rounding error / missing a nested node — the recipe does it with one assignment per section, not per node.
**Pattern:** for merging pages — one `use_figma` call, ID addressing without `setCurrentPageAsync` (not required for purely ID-based reparent/reposition operations): get both pages and all sections by id → `targetPage.appendChild(section)` for sections from the other page → `section.x = X; section.y = Y;` for ALL sections (both native and moved) per a precomputed non-overlapping layout (see `page-children-bbox-collision-check` in SKILL.md — use the same house gap convention already visible in the file, e.g. 219 px). Finally: verify the source page is empty (`page.children.length === 0`) BEFORE `page.remove()`, so as not to lose unforeseen children.
```js
const targetPage = await figma.getNodeByIdAsync(targetPageId);
const section = await figma.getNodeByIdAsync(sectionIdFromOtherPage);
targetPage.appendChild(section);   // reparent — section.parent is now targetPage
section.x = newX; section.y = newY; // shifts ALL descendants in cascade; don't touch their (section-relative) x/y at all
```

### section-resizewithoutconstraints-growth-can-collide-with-unrelated-page-siblings
**Principle:** `SECTION.resizeWithoutConstraints(w, h)` to fit new/moved children is checked for collisions only against the section's OWN children (an internal pairwise bbox check) — but the very growth of the section's bounding box can geometrically overlap COMPLETELY UNRELATED nodes on the same page (other sections/frames from earlier sessions unrelated to the current task) that are not children of this section and therefore take no part in the internal check at all. This is a separate failure mode from `page-children-bbox-collision-check` (that one is about positioning NEW top-level nodes) and from `new-section-can-get-spatially-absorbed-into-existing-section` (that one is about reparenting a NEW section into an existing one) — here the section remains a normal top-level child of the PAGE, no reparenting happens; the problem is purely visual/geometric.
**Symptom:** the internal collision check (pairwise bbox among `section.children`) shows 0 collisions, `section.screenshot()` in isolation looks fine (a node screenshot captures only its own children) — but viewing the whole page, the new content visually "runs over" someone else's frame elsewhere on the page; the user catches it by eye on an overall screenshot before any automated check does.
**Pattern:** after ANY `resizeWithoutConstraints` of an existing section — always repeat the bbox check in TWO passes: (1) internal pairwise among `section.children` (as usual), (2) the `section` bbox (via `absoluteTransform`) against EVERY other `page.children[i]`. It's cheaper to plan the section's growth ALONG the axis for which a preliminary page-wide scan has already confirmed emptiness at any value of the other axis (e.g. "there is nothing to the right of the section on the page at any Y" → grow only in width, don't touch height) than to grow in both directions blindly and roll back later.
```js
function overlaps(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
const sectionAbsX = section.absoluteTransform[0][2], sectionAbsY = section.absoluteTransform[1][2];
const sectionBox = { left: sectionAbsX, top: sectionAbsY, right: sectionAbsX + section.width, bottom: sectionAbsY + section.height };
const externalCollisions = [];
for (const n of page.children) {
  if (n.id === section.id) continue;
  const ax = n.absoluteTransform[0][2], ay = n.absoluteTransform[1][2];
  const b = { left: ax, top: ay, right: ax + n.width, bottom: ay + n.height };
  if (overlaps(sectionBox, b)) externalCollisions.push({ name: n.name, id: n.id });
}
```

### align-icon-to-multiline-text-sibling-top-via-fill-height-padding-wrapper
**Principle:** In a HORIZONTAL auto-layout, [a multi-line text block with its own `paddingTop`] sits next to [a fixed-size icon] — the icon must sit "on the grid", its top edge level with the FIRST line of text, not centred on the whole block (which "floats" below the title's baseline with two-line text). No need to compute the offset by hand as a number. Solution: wrap the icon in a HORIZONTAL frame with `layoutSizingVertical='FILL'` (stretches to the parent's full height, automatically adapting to the neighbouring text block's HUG height) and **the very same `paddingTop` token** as the text block — the padding shifts the icon down by exactly as much as the first line of text is already shifted by the block's internal paddingTop; both top edges coincide automatically without magic numbers and stay in sync if the padding token ever changes.
**Pattern:**
```js
const wrapper = figma.createAutoLayout('HORIZONTAL', { name: 'Close wrapper — top align' });
wrapper.primaryAxisAlignItems = 'MAX';   // pin the icon to its right edge inside the wrapper (HUG width)
wrapper.counterAxisAlignItems = 'MIN';   // semantically "to the top"; with FILL height on both children it often has no visible effect any more, but doesn't hurt
wrapper.paddingTop = wrapper.paddingBottom = 12;
wrapper.setBoundVariable('paddingTop', mToken);   // THE SAME token as paddingTop on the neighbouring text block
wrapper.setBoundVariable('paddingBottom', mToken);
wrapper.appendChild(closeIconInstance);
headerRow.insertChild(iconIndex, wrapper);        // the wrapper takes the place where the bare icon was
wrapper.layoutSizingHorizontal = 'HUG';           // width — snug to the icon (24 px)
wrapper.layoutSizingVertical = 'FILL';            // height — stretches with the text block
headerRow.counterAxisAlignItems = 'MIN';
```
**Why not just `counterAxisAlignItems='CENTER'` on the parent:** centring places the icon at the centre of the WHOLE text block (title + subtitle); fine for a single-line title without a caption, but doesn't read as "aligned to the grid" with multi-line text.

### empty-group-auto-dissolves-explicit-remove-throws-not-found
_Same mechanism as `group-auto-dissolves-on-last-child-removal-remove-call-throws` above (a GROUP self-deletes on losing its last child; guard before remove) — confirmed independently across 9 GROUP→FRAME conversions in another file._
**Principle:** An explicit GROUP node (not a FRAME) in Figma cannot exist without children — as soon as the LAST child is removed (`.remove()`) or moved to another parent (`otherParent.appendChild(child)`), the group itself vanishes from the document automatically, without a separate call. A subsequent explicit `group.remove()` on the already-vanished node throws `Error: in remove: The node with id "..." does not exist`, although the same `group` was successfully obtained via `getNodeByIdAsync` at the start of THE SAME script.
**Symptom:** a script of the form "move all the group's children into a new FRAME, then delete the emptied group" fails on the last line — `group.remove()` — with "node does not exist", although the group clearly existed a few lines earlier (the `group` variable is assigned; it's not an id typo).
**Pattern:** when migrating a GROUP's content into a new FRAME (a typical "layer-cleaner" conversion step) — simply do NOT call `group.remove()` after all children are moved (`newFrame.appendChild(child)` for each) — the group deletes itself. If an explicit post-check is needed — `await figma.getNodeByIdAsync(group.id)` returns `null`, no try/catch required. A FRAME behaves differently under the same operation — an empty FRAME stays in the document and needs an explicit `.remove()` if unwanted; GROUP and FRAME are asymmetric here.
```js
// ❌ throws "node does not exist" — the group already vanished after the last child was moved
const group = await figma.getNodeByIdAsync(groupId);
newFrame.appendChild(group.children[0]);
newFrame.appendChild(group.children[0]); // after this group.children is empty
group.remove(); // Error: node does not exist

// ✅ nothing extra to call
const group = await figma.getNodeByIdAsync(groupId);
const kids = [...group.children];
kids.forEach(k => newFrame.appendChild(k));
// the group is already gone by itself — (await figma.getNodeByIdAsync(groupId)) === null
```

### enabling-layoutmode-on-populated-frame-hug-shrinks-despite-later-fixed-mode
**Principle:** Enabling auto-layout (`frame.layoutMode = 'HORIZONTAL'|'VERTICAL'`) on an already EXISTING plain FRAME that already has at least one child (added BEFORE enabling layoutMode) immediately recomputes the frame's size to its content (HUG-like behaviour) — this happens AT ONCE at the moment `layoutMode` is assigned, BEFORE the script manages to set `primaryAxisSizingMode = 'FIXED'` on the next line. The subsequent `'FIXED'` merely FREEZES the already-shrunk size — it doesn't restore the frame's original (pre-layoutMode) size.
**Symptom:** a frame pre-created via `figma.createFrame` + `resize(40, 40)`, then a 24×24 child is added, then `layoutMode = 'HORIZONTAL'` → `primaryAxisSizingMode = 'FIXED'` → `counterAxisSizingMode = 'FIXED'` — the frame's final width is **24** (by the child), not 40 (as set by `resize`), while the height (the other axis, `counterAxisSizingMode`) may stay a correct 40 — the asymmetric per-axis result masks the nature of the bug (looks like "half the settings didn't work", while both axes did the same thing — the frame and child just happened to match vertically, so the collapse is invisible there).
**Pattern:** after fully configuring an auto-layout frame (layoutMode + both sizingModes + alignItems) — if a SPECIFIC fixed size different from the current content is needed, an EXPLICIT repeat `frame.resize(w, h)` AT THE END, after all layout settings, is mandatory; don't expect a `resize` called BEFORE enabling `layoutMode` to survive the subsequent enabling of auto-layout.
```js
const badge = figma.createFrame();
badge.resize(40, 40);       // ⚠️ this resize will NOT survive enabling layoutMode below
parent.appendChild(badge);
badge.appendChild(icon24x24);
badge.layoutMode = 'HORIZONTAL';           // instantly hug-shrinks badge to ~24×40 (by the child)
badge.primaryAxisSizingMode = 'FIXED';     // only freezes the ALREADY shrunk width — not 40
badge.counterAxisSizingMode = 'FIXED';
badge.resize(40, 40);       // ✅ mandatory repeat resize AFTER the layout setup — the only way back to 40
```

### fixed-height-autolayout-with-clip-hides-extra-children-silently
**Principle:** An auto-layout frame with `primaryAxisSizingMode='FIXED'` and `clipsContent=true` **doesn't grow** when children are added: the extra children exist in the tree and take part in the layout, but are clipped and not drawn. A tree walk and `children.length` don't show it — the discrepancy is visible only on the render.
**Symptom:** the script added N items, the `return` honestly reported `itemCount: 13` and the full list of labels, and the screenshot shows 11. It feels like "half the operations didn't apply", although all did.
**Pattern:** after any addition of children to an auto-layout container — either immediately `primaryAxisSizingMode = 'AUTO'` / `layoutSizingVertical = 'HUG'`, or an explicit check: the sum of child heights plus gaps plus padding against `node.height`. A screenshot is mandatory: a structural check by definition doesn't catch this class.
```js
const need = wrap.children.length * ITEM_H + (wrap.children.length - 1) * wrap.itemSpacing
           + wrap.paddingTop + wrap.paddingBottom;
if (wrap.height + 0.5 < need) { wrap.primaryAxisSizingMode = 'AUTO'; wrap.layoutSizingVertical = 'HUG'; }
```

### absolute-child-constraint-min-detaches-from-bottom-when-autolayout-parent-grows
**Principle:** A child with `layoutPositioning='ABSOLUTE'` inside an auto-layout parent is positioned by `constraints`, not by the flow. If it has `constraints.vertical='MIN'` (pinned to the top) and a hard-set `y`, then when the parent GROWS in height (e.g. a HUG frame grew because the text inside wrapped to a second line) the overlay stays at the old `y` and "detaches" from the bottom edge — visually driving into the content. While the parent's height doesn't change the defect sleeps: on the donor and on clones with short text everything looks right.
**Symptom:** you cloned a card/toast, changed the text to a longer one — the container grew, and the bottom decorative element (progress bar, underline, accent stripe) ended up in the middle of the text, striking through the last line. The structural check is clean: `children.length`, names, variable bindings, the overlay's own size — all match the donor; the discrepancy is visible ONLY on the render.
**Pattern:** any ABSOLUTE overlay that is semantically pinned to the bottom/right edge (the CSS equivalent of `position:absolute; bottom:0`) gets the matching constraint at once, not just a coordinate. The check is arithmetic, cheap, and catches the defect without eyes: `parent.height - (child.y + child.height)` must equal the expected gap for ALL instances of the same kind.
```js
bar.constraints = { horizontal: 'MIN', vertical: 'MAX' };  // ← pin to the bottom, not just y
bar.y = toast.height - bar.height;

// check across all clones at once — a gapToBottom mismatch exposes the "detached" overlay
for (const t of toasts) {
  const b = t.findOne(n => n.type === 'RECTANGLE' && n.layoutPositioning === 'ABSOLUTE');
  if (t.height - (b.y + b.height) !== 0) throw new Error('overlay detached from the bottom: ' + t.name);
}
```

### vector-resize-after-setvectornetwork-distorts-non-square-geometry
**Principle:** `vector.resize(w, h)` called AFTER `setVectorNetworkAsync` on hand-built geometry with a non-square natural bbox (e.g. a path wider than tall — 12×6) may not just scale the points proportionally but visually rotate the shape by 90° — while the `vectorNetwork.vertices` read back CORRECTLY correspond to a proportional scale arithmetically (in the observed case the local points (4,7)/(10,13)/(16,7) with a 12×6 bbox correctly recomputed to (0,0)/(10,20)/(20,0) with a 20×20 bbox — the numbers are right), yet the render shows not a "V" but a "<" — i.e. the bug is not in the data but in the render pipeline after resizing a non-proportional network.
**Symptom:** a simple hand-made chevron/tick/arrow assembled via `createVector` + `setVectorNetworkAsync` renders rotated 90° after `.resize` — while `node.vectorNetwork.vertices` read by the same script look geometrically right (a down-chevron stays a down-chevron on paper).
**Pattern:** don't build the network at an arbitrary scale counting on `.resize` — set the `vertices` directly in target pixel coordinates inside the desired bbox (`setVectorNetworkAsync` without a subsequent `.resize`). An isolated test on an empty page (a plain node without an auto-layout parent) is a cheap way to tell "a bug in my geometry" from "a bug in the resize pipeline" BEFORE spending time debugging in the context of a complex tree.
```js
// ❌ build at an arbitrary scale, then resize — risk of flipping a non-proportional network
await v.setVectorNetworkAsync({ vertices: [{x:4,y:7},{x:10,y:13},{x:16,y:7}], segments: [...] }); // bbox 12×6
v.resize(20, 20); // may visually rotate the shape 90°, although vertices read "right"

// ✅ straight in target coordinates inside the desired bbox — no resize needed
await v.setVectorNetworkAsync({ vertices: [{x:4,y:7},{x:10,y:13},{x:16,y:7}], segments: [...] }); // already 12×6, final scale
```

### ancestor-rotation-silently-flips-locally-correct-geometry
**Principle:** Checking `node.rotation` on the node alone is not enough — a parent (not necessarily the direct one; could be 2–3 levels up) may carry its own non-zero `rotation` inherited from an earlier design (e.g. an old icon was drawn in a rotated orientation and the wrapper compensated by rotating the container rather than the geometry). Any NEW node inserted into such a container and built geometrically correct in its local coordinate system inherits the parent rotation and renders turned — a standard `get_metadata`/XML dump does NOT show rotation (only x/y/width/height), so the bug can't be caught without an explicit walk up the parent chain.
**Symptom:** locally built geometry (verified by an isolated test on an empty page — renders correctly) suddenly renders rotated by a specific angle after insertion into the existing tree; structural checks of the node itself (`node.rotation===0`, `vectorNetwork` coordinates) show nothing.
**Pattern:** before building/inserting a directional icon (chevron, arrow, any asymmetric shape) into an EXISTING tree node — walk the `node.parent.parent...` chain up to PAGE and read every ancestor's `rotation`. If a non-zero one is found — either (a) compensate with an equivalent rotation on your node (`node.rotation = -parentRotation`, if the ancestor is a plain auto-layout frame without its own children-driven auto-resize — risk of conflict with auto-layout HUG measurement, see `vector-rotation-bbox-swap`), or (b) more robustly — draw the target geometry DIRECTLY in the rotated (pre-compensated) local coordinate system, without assigning `rotation` at all.
```js
// before inserting a directional icon — walk the ancestors and collect all rotations
let n = targetParent, chain = [];
while (n && n.type !== 'PAGE') { chain.push({ id: n.id, rotation: n.rotation ?? 0 }); n = n.parent; }
// a non-zero rotation somewhere in chain → either compensate via node.rotation, or
// pre-rotate the vertices by hand and insert them without .rotation at all (more robust — see the neighbouring rule)
```

### fixed-fill-inner-wrapper-blocks-huged-cell-from-growing-on-text-wrap
**Principle:** A grid cell of the form `Cell(HUG) > InnerWrapper(?) > [Label, Value]` doesn't grow when `Value` wraps to 2 lines, even when the (outer) `Cell` correctly has `primaryAxisSizingMode:'AUTO'` / `layoutSizingVertical:'HUG'` — if the inner wrapper (the intermediate, seemingly unimportant layer) kept `primaryAxisSizingMode:'FIXED'` + `layoutSizingVertical:'FILL'` from the original design (inherited from "one line = fixed height"). `FILL` inside a `HUG` parent creates a circular dependency: `Cell` wants to hug the inner wrapper, and the inner wrapper wants to fill `Cell` — Figma resolves it in favour of the old/small number rather than recomputing from real content.
**Symptom:** the outer cell is visually reported as HUG (checked — `layoutMode`/`sizingMode` on IT are right), but when the text wraps to 2 lines the neighbouring element below (the next grid row, a "more" button, etc.) runs over the second line — the clipping is visible only on a screenshot; a structural check of ONLY the outer cell (without walking 1 level deeper) shows nothing.
**Pattern:** when converting an existing FIXED grid to auto-layout — check `primaryAxisSizingMode` / `layoutSizingVertical` NOT only on the cell itself but on EVERY intermediate auto-layout layer between the cell and the text leaf; convert any `FILL` found in the chain leading to a HUG ancestor into `HUG`. A naive attempt to "force a recalc" via `primaryAxisSizingMode='FIXED'; resize(w,10); primaryAxisSizingMode='AUTO'` on the OUTER cell without fixing the inner FILL layer not only doesn't help — it collapses all cells to the same minimal height (observed: 60.8 px → 16 px on all 6 cells at once).
```js
// walk the whole chain from the cell to the text leaf, not just the cell itself
function auditChain(cell) {
  const chain = [];
  let n = cell;
  while (n && n.type !== 'TEXT') {
    chain.push({ id: n.id, name: n.name, primaryAxisSizingMode: n.primaryAxisSizingMode, layoutSizingVertical: n.layoutSizingVertical });
    n = n.children ? n.children[0] : null;
  }
  return chain;
}
// any { primaryAxisSizingMode: 'FIXED', layoutSizingVertical: 'FILL' } on an intermediate layer — fix:
inner.primaryAxisSizingMode = 'AUTO';
inner.layoutSizingVertical = 'HUG';
```

### primaryaxissizingmode-auto-hugs-width-on-horizontal-and-silently-undoes-resize
**Principle:** `primaryAxisSizingMode` / `counterAxisSizingMode` are tied to `layoutMode`, not to "width/height": on a **HORIZONTAL** frame primary = **width**, counter = height (on VERTICAL — the reverse). So `frame.primaryAxisSizingMode = 'AUTO'`, written meaning "let the height hug the content", on a horizontal frame enables **hug on width** — and silently annuls the just-applied `resize(fixedWidth, h)`. No error; `resize` formally runs, and the frame collapses to its content width.
**Symptom:** table cells explicitly given a column width arrive at text width (`152/250/250` → `91/102/390`), and the returned report shows exactly the width of the string in the cell. Easy to blame "resize didn't work" and start fixing the wrong thing.
**Pattern:** for a cell with fixed width and hugging height use the `layoutSizing*` vocabulary (it's in screen-axis terms, not layoutMode) — it's unambiguous and direction-independent: `cell.layoutSizingHorizontal = 'FIXED'; cell.resize(w, cell.height); cell.layoutSizingVertical = 'HUG';`. Reach for `primaryAxisSizingMode` only when the frame's direction is definitely known and pinned.
```js
// ❌ WRONG on a HORIZONTAL frame — 'AUTO' here = hug WIDTH; the width from resize() is lost
cell.counterAxisSizingMode = 'FIXED';
cell.resize(152, cell.height);
cell.primaryAxisSizingMode = 'AUTO';   // wanted "height by content", got "width by content"

// ✅ RIGHT — screen axes; the frame's direction doesn't matter
cell.layoutSizingHorizontal = 'FIXED';
cell.resize(152, cell.height);
cell.layoutSizingVertical = 'HUG';
```

### fill-child-inside-hugging-parent-collapses-subtree-to-widest-hugging-sibling
**Principle:** `child.layoutSizingHorizontal = 'FILL'` doesn't "stretch to the width you see" — it stretches to the parent's width, and if the parent itself is **HUG** on that axis, the parent's width is defined by the widest NON-fill sibling. One unpinned neighbour (a legend, a caption, a badge) becomes the source of truth for the whole subtree, and the structure collapses to its width.
**Symptom:** a frame that was just 668 px arrives at 262 px after an innocuous `FILL` — exactly the width of the neighbouring legend; all nested rows/cells follow. The report shows that both the "wide" container and the small neighbour have ONE width — that's the tell.
**Pattern:** before giving children `FILL`, pin the parent on that axis (`parent.layoutSizingHorizontal = 'FIXED'` + `resize(W, h)`, or the parent itself `FILL` from ITS parent). The rule propagates up the chain — check up to the nearest ancestor with a fixed width, not only the direct parent.
```js
// pin the column, THEN hand out FILL to the children
right.counterAxisSizingMode = 'FIXED';
right.resize(668, right.height);
for (const c of right.children) c.layoutSizingHorizontal = 'FILL';
```

### comparison-tables-build-row-major-not-column-major
**Principle:** Build a comparison table (label | value | value) in Figma **row by row**, mirroring the DOM row, not column by column. In a column-major structure (`Column > [header, cells]`) the heights of cells in one logical row live in different tree branches and don't synchronise: a text wrap in the third column doesn't raise the height of the first two, rows drift apart, and the "fix" turns into manual height setting. Row-major (`Row > [cell, cell, cell]`) gives synchronisation for free — like `align-items: stretch` in flex.
**Pattern:** row = HORIZONTAL auto-layout; build the cells with HUG height, then `h = Math.max(...cells.map(c => c.height))`, pin the row height and switch the cells to `layoutSizingVertical = 'FILL'`. If the gap is needed not between all columns (the typical case: `me2` only before the last one), group the adjacent columns into a nested HORIZONTAL with `itemSpacing: 0` — nesting a group is more honest than inserting an empty spacer frame.
```js
const h = Math.max(...cells.map(c => c.height));
row.counterAxisSizingMode = 'FIXED';
row.resize(row.width, h);
for (const c of cells) c.layoutSizingVertical = 'FILL';
```

### overlapping-siblings-are-not-expressible-in-auto-layout-move-the-fill-onto-the-frame
**Principle:** A "backing + icon on top" pair as two siblings (ELLIPSE + INSTANCE in one frame) can't be expressed in auto-layout — auto-layout lays children out edge to edge, not layered. The right form: the fill, radius and shadow move onto the FRAME itself, the frame gets padding, and one child remains inside — the icon. This is both closer to the CSS original (`.circle` + `.icon-padding`) and removes a redundant node.
**Symptom:** the button remains the only `layoutMode: 'NONE'` frame in the subtree after everything else is converted; trying to enable auto-layout on it lines up the ellipse and the icon in a row.
**Pattern:** before removing the backing, check where the effect/shadow style really hangs — on the frame or on the ellipse (`effectStyleId` can be on either); if needed move it onto the frame BEFORE `.remove()`, otherwise the shadow disappears silently.
```js
const el = btn.findOne(n => n.type === 'ELLIPSE');
if (el && el.effectStyleId) await btn.setEffectStyleIdAsync(el.effectStyleId);
btn.layoutMode = 'HORIZONTAL';
btn.paddingTop = btn.paddingRight = btn.paddingBottom = btn.paddingLeft = 12;
btn.fills = [circleFill]; btn.cornerRadius = 27;
if (el) el.remove();
btn.layoutSizingHorizontal = 'HUG'; btn.layoutSizingVertical = 'HUG';
```

### effect-style-named-for-a-role-may-not-carry-the-code-value

**Principle:** Binding an effect to a style named for the same role (`setEffectStyleIdAsync`) silently REPLACES the shadow value with the style's value — and a matching role name guarantees nothing. In one design system the style `Button Shadow` = `0 1px 3px rgba(0,0,0,.2)`, while the CSS class `.shadow` that covers BOTH round buttons AND cards in code = `0 3px 6px rgba(0,0,0,.4)`. So the DS style diverges from the code almost twofold in radius and in alpha, yet "bind the card to Button Shadow" looks like an obvious improvement.
**Symptom:** after tokenisation the card/button becomes noticeably lighter or darker than the donor; a structural read shows a correct `effectStyleId`, and the swap can be noticed only by comparing `node.effects` BEFORE and AFTER the call (or by eye on a screenshot, where a 0.2 alpha difference on a 6 px radius is almost invisible).
**Pattern:** before `setEffectStyleIdAsync` read `(await figma.getStyleByIdAsync(id)).effects` and compare with the target value from the CSS. No match — keep the raw effect and record the DS↔code divergence as a finding rather than "fixing" the mockup to the style. The same technique as `token-name-vs-actual-value` for colours, but for effects it's more dangerous: a colour divergence is visible, a shadow's isn't.
```js
const before = JSON.stringify(node.effects);
await node.setEffectStyleIdAsync(styleId);
if (JSON.stringify(node.effects) !== before) {
  // the style brought a DIFFERENT value — decide deliberately, not after the fact
}
```

### html-to-figma-frames-keep-paint-order-sort-by-y-before-autolayout

**Principle:** In a frame that arrived from html-to-figma with `layoutMode: 'NONE'`, the children lie in paint order (z-order), NOT in visual top-to-bottom order: absolute coordinates keep the picture right, so the discrepancy is invisible until the frame becomes auto-layout. At the moment of `node.layoutMode = 'VERTICAL'` the coordinates stop applying, and the block silently reassembles in the order of the `children` array.
**Symptom:** after enabling auto-layout the content swaps places (in the case — the "Seeking: …" line moved into the name's place), with no error, correct sizes, and without looking at a screenshot it passes as a correct conversion.
**Pattern:** capture the `y` (or `absoluteTransform[1][2]`) of all children BEFORE changing `layoutMode`, enable auto-layout, then lay them out with `insertChild(i, child)` in ascending order of the captured `y`. Relying on names (`div.mx1-5:margin` occurs three times per block) is useless — sort by geometry or by recognised text content.
```js
const order = frame.children.map(c => ({ c, y: c.y })).sort((a, b) => a.y - b.y).map(o => o.c);
frame.layoutMode = 'VERTICAL';
order.forEach((c, i) => frame.insertChild(i, c));
```

### strokeweight-setter-overwrites-per-side-weights

**Principle:** `node.strokeWeight = N` is a setter for ALL four sides. On a node whose stroke was set on one side only (`strokeTopWeight/RightWeight/BottomWeight/LeftWeight` — the typical technique for an underline divider under a heading or a section's top border), assigning the general `strokeWeight` silently turns the underline into a full frame. No error, no warning; `strokes` still looks correct because the colour and paint didn't change — only the distribution of weights across sides did.
**Symptom:** after a "cosmetic" colour/token edit of a divider, a rectangular frame appears around the block. Invisible in a structural read: `strokes[0]` is the same, `strokeWeight` returns `1` and looks normal — you have to specifically read the four per-side properties. Caught only by render.
**Pattern:** before any stroke edit read `strokeTopWeight/strokeRightWeight/strokeBottomWeight/strokeLeftWeight`; if they are not all equal — don't touch the general `strokeWeight`; set the needed side specifically. If the general setter has already been applied, recovery is zeroing the extra sides explicitly.
```js
// ❌ WRONG — the underline becomes a frame
head.strokeWeight = 1;

// ✅ RIGHT — read first, then set per side
const sides = { t: head.strokeTopWeight, r: head.strokeRightWeight, b: head.strokeBottomWeight, l: head.strokeLeftWeight };
if (new Set(Object.values(sides)).size > 1) {
  head.strokeTopWeight = 0; head.strokeRightWeight = 0; head.strokeLeftWeight = 0;
  head.strokeBottomWeight = 1;
} else {
  head.strokeWeight = 1;
}
```

### parent-hug-silently-demotes-a-FILL-child-to-FIXED
**Principle:** `parent.primaryAxisSizingMode = 'AUTO'` (hug) on an auto-layout frame whose child is on `layoutSizingVertical = 'FILL'` is a contradiction: the child wants to take the parent's height, the parent wants to take the child's. Figma resolves it silently by switching the CHILD to `FIXED` at the height it had at the moment of assignment, and the parent "hugs" to that same number. No error; the script runs; the returned values look plausible.
**Symptom:** after `AUTO` the frame keeps its previous height (or takes an inexplicable one) although the content inside is definitely taller. Walking the container's children explains nothing — they are all `FIXED` and the right size; the discrepancy is visible only by reading `layoutSizingVertical` of the CONTAINER ITSELF, not its children. Tell-tale number: the new height equals `old_parent_height − sum_of_neighbouring_bands`, i.e. exactly what `FILL` was last computed as.
**Pattern:** convert bottom-up — first remove `FILL` from the child (`child.layoutSizingVertical = 'HUG'` if it's auto-layout itself, otherwise `resize` to real content), and only then set hug on the parent. And read `layoutSizing*` on every node in the chain, not only the leaves.
```js
// ❌ the parent collapses to the child's current FILL number
root.primaryAxisSizingMode = 'AUTO';

// ✅ child first, then parent
payBlock.layoutSizingVertical = 'HUG';
root.primaryAxisSizingMode = 'AUTO';
```

### stretch-constrained-child-drifts-y-when-hugged-inside-a-plain-frame

**Principle:** For a child of a `layoutMode:'NONE'` frame (plain, not auto-layout) with `constraints.vertical: 'STRETCH'`, itself switched to auto-layout `primaryAxisSizingMode = 'AUTO'` (hug), Figma **also shifts its own `y`** when recomputing the height, trying to keep the node's centre in place rather than leaving it top-pinned. This is not the behaviour of auto-layout itself (hug on an auto-layout frame doesn't touch `y` by itself) — it's the STRETCH constraint reacting to the node's size change inside its NONE parent; the same mechanism that normally moves STRETCH children when the parent itself resizes, only here the trigger is the CHILD's resize, not the parent's.
**Symptom:** after `child.primaryAxisSizingMode = 'AUTO'` the node's new height is right but `child.y` isn't: the shift is roughly half the height gain (`Δy ≈ −Δheight/2`), and any subsequent computation of NEIGHBOURING nodes' positions (e.g. "re-pin the bottom fixed chat under the new bottom edge") based on the OLD read `child.y` is wrong by yet another step — the error accumulates across calls if `y` isn't re-read at the very last moment.
**Pattern:** (1) first read `child.constraints.vertical` — if `STRETCH` (not `MIN`), account for the fact that both the node's own resize and a subsequent parent resize will move its `y`; (2) resize the PARENT (if it grows too) BEFORE forcing positions; (3) set all final `x`/`y` (including the STRETCH node and its MAX-pinned neighbours) explicitly as the LAST step of the script, after all resize operations — so that no later resize can move them.
```js
// ❌ WRONG — child.y used right after its own resize, before the parent's final resize
child.primaryAxisSizingMode = 'AUTO';
const belowY = child.y + child.height; // child.y already shifted by the STRETCH constraint, but the parent isn't resized yet
sibling.y = belowY; // on the parent's next resize child.y shifts AGAIN — sibling.y goes stale

// ✅ RIGHT — parent resize first, then forced x/y on all involved nodes as the last step
parent.resize(parent.width, targetHeight);
child.x = 0; child.y = knownGoodY;
sibling.x = 0; sibling.y = knownGoodY + child.height;
```

### primary-vs-counter-axis-swaps-meaning-with-layoutmode-direction

**Principle:** `primaryAxisSizingMode` / `counterAxisSizingMode` are not "first/second in importance" but literally "along layoutMode" / "across layoutMode" — for `layoutMode:'VERTICAL'` primary = HEIGHT, counter = WIDTH; for `'HORIZONTAL'` — the reverse. Mixing them up is natural if you write code by analogy with a ready HORIZONTAL frame (where primary=width) and apply the same assignments to a VERTICAL frame without recomputing which axis is now which.
**Symptom:** after `frame.counterAxisSizingMode = 'AUTO'` on a VERTICAL frame the WIDTH collapses to the widest child (rather than the height hugging, as intended), while the height stays frozen at the previous FIXED value — the content clips vertically, not horizontally; no error.
**Pattern:** before any `primary/counterAxisSizingMode` assignment, state explicitly (in your head or a variable) the node's `layoutMode` and map: `VERTICAL → primary=height, counter=width`; `HORIZONTAL → primary=width, counter=height`. Don't copy a code block between HORIZONTAL and VERTICAL frames without this re-check.
```js
// ❌ WRONG on a VERTICAL frame — "AUTO" went to the wrong axis
footer.counterAxisSizingMode = 'FIXED';
footer.resize(1680, 100);
footer.counterAxisSizingMode = 'AUTO';   // this is the WIDTH — it collapsed to 1572; the height stayed 100

// ✅ RIGHT — primary governs height on a VERTICAL frame
footer.counterAxisSizingMode = 'FIXED';
footer.resize(1680, footer.height);
footer.primaryAxisSizingMode = 'AUTO';   // height hugs, width stays 1680
```

### fixed-height-root-with-vertical-autolayout-silently-clips-appended-children

**Principle:** `layoutMode:'VERTICAL'` by itself doesn't guarantee the frame adapts to new children — if it has `primaryAxisSizingMode:'FIXED'` (not `'AUTO'`), the height stays hard-pinned at its previous value regardless of how much content is added inside; with `clipsContent: true` (the usual setting for a top-level mockup frame) all content beyond the old height becomes invisible without a single error anywhere in the call chain.
**Symptom:** a child container (e.g. the grid wrapper) grew correctly (its own `primaryAxisSizingMode` was `AUTO`), the script returned the CHILD's new height without complaint, but the screenshot of the ROOT frame shows the page without the added content at all — as if the insertion didn't work. A direct read of the root (`root.height`) immediately shows the old number — the discrepancy is visible only if you explicitly compare `root.height` with the sum of its children's heights rather than relying on "no error above the level → everything's fine".
**Pattern:** after adding new content into an AUTO-LAYOUT (`layoutMode !== 'NONE'`) yet `primaryAxisSizingMode:'FIXED'` chain of parents — explicitly check EVERY level of the chain upward, not only the new nodes' direct parent. If the root should simply hug the content (the typical case for a single-screen mockup, not a card with a deliberately hard height) — switch `root.primaryAxisSizingMode = 'AUTO'` as an explicit separate step AFTER all insertions, and re-read `root.height` to confirm real growth rather than trusting the last command.
```js
// added content to GridWrap — it is AUTO itself and grew correctly
gridWrap.appendChild(newRow); // OK, gridWrap.height grows

// but variant_a_desktop (GridWrap's parent) stayed FIXED — the new row is clipped by clipsContent
// controlDesktop.height is still 1233 although GridWrap is already 1258

// ✅ fix — as a separate step, AFTER all insertions
controlDesktop.primaryAxisSizingMode = 'AUTO';
// controlDesktop.height is now recomputed correctly (1258 + prior siblings)
```

### clone-into-differently-oriented-autolayout-parent-can-coerce-fill-to-collapse

**Principle:** `node.clone()` inserted into a parent with a DIFFERENT `layoutMode` from the source parent (e.g. the node lived in a `HORIZONTAL` container, the clone is inserted into a `VERTICAL` one) may inherit/acquire `layoutSizingVertical:'FILL'` on the axis where the original had `'HUG'` — and if the new parent is itself `primaryAxisSizingMode:'AUTO'` (hugs its content), the `FILL` child has nothing to fill (a circular dependency: the parent waits for the child's size, the child waits for the parent's), and Figma collapses it almost to zero (1 px in the case), without error.
**Symptom:** the clone is correctly visible in `screenshot` of neighbouring nodes (the structure is in place) but itself occupies a few pixels of height/width; a direct read of the clone shows `layoutSizingVertical:'FILL'`, although the source node had `'HUG'` before cloning — i.e. the property CHANGED during cloning into a different layout context; it didn't stay as it was.
**Pattern:** after ANY `clone` + insertion into a parent with a DIFFERENT `layoutMode` from the source container — explicitly re-read and, if needed, re-set `layoutSizingHorizontal`/`layoutSizingVertical` on the clone (don't rely on "a clone = an exact copy of properties"); for a node that should simply hug its own content regardless of the parent — set `'HUG'` (and sync `counterAxisSizingMode:'AUTO'` on the clone itself) as an explicit separate step right after insertion.
```js
const clone = adRowSrc.clone();          // the source lived in a HORIZONTAL Grid, layoutSizingVertical was 'HUG'
verticalParent.insertChild(2, clone);    // the new parent is VERTICAL, AUTO-hug
clone.layoutSizingHorizontal = 'FILL';   // width set explicitly...
// ...but vertical became 'FILL' by itself on insertion — the parent has nothing to fill → clone.height collapses to 1 px

// ✅ fix — re-read and re-set the vertical axis explicitly
clone.counterAxisSizingMode = 'AUTO';
clone.layoutSizingVertical = 'HUG';      // restores the real height (352 px)
```

### none-mode-root-frame-never-auto-hugs-after-child-removal-or-insertion

**Principle:** A top-level frame with `layoutMode:'NONE'` (the typical pattern for mobile "device viewport" mockups with fixed children like a bottom nav / URL bar over a scrolling content frame) never recomputes ITS OWN height on any child change — not on addition, not on removal, not on a height change of the auto-layout the scrolling content frame inside. This is NOT the same as `primaryAxisSizingMode:'FIXED'` on an auto-layout frame (there at least `layoutMode` hints at auto-layout semantics) — here `layoutMode:'NONE'` takes no part in any hug computation at all; the height is a purely manual number requiring an explicit `resize` after EVERY structural edit that changes the content's total height.
**Symptom:** you removed/added a child of the scrolling content frame (the scrolling content frame itself is a correct `VERTICAL` auto-layout; its `.height` recomputed correctly); the screenshot of the root NONE frame shows the old height (extra empty space at the bottom OR clipped content, depending on the direction of the change) — at first glance it looks like an auto-layout bug, but auto-layout has nothing to do with it; the problem is one level up.
**Pattern:** after any structural edit inside the scrolling content frame (or another auto-layout direct child of a NONE root) — recompute `newRootHeight = insiderTop + insider.height + <heights of the other fixed-chrome children>`, call `root.resize(root.width, newRootHeight)`, and re-set `x`/`y` of all fixed-chrome neighbours (bottom nav, URL bar) to the new bottom edge — the same technique already applied to other variant frames in earlier passes of the same file. Don't rely on "since the scrolling content frame is auto-layout, the parent adapts too".
```js
const insiderTop = header.height + tabs.height;
insider.x = 0; insider.y = insiderTop;
const insiderBottom = insiderTop + insider.height;   // read AFTER the structural edit, not before
const newRootHeight = insiderBottom + nav.height + urlBar.height;
root.resize(root.width, newRootHeight);              // a NONE root never does this by itself
nav.x = 0; nav.y = insiderBottom;
urlBar.x = 0; urlBar.y = insiderBottom + nav.height;
```

### reassigning-page-absolute-xy-after-appendchild-into-section-double-offsets

**Principle:** `section.appendChild(node); node.x = savedAbsoluteX; node.y = savedAbsoluteY;` — the classic "forgot that x/y are now relative to the new parent" mistake (see `clone-reparents-to-currentpage...` above, but that's about cloning to another PAGE; here it's about a **SECTION**; the exploitation pattern is slightly different and easier to miss, because the operation "wrap an already finished layout in sections" looks purely cosmetic). If `savedX/savedY` were PAGE-ABSOLUTE coordinates (natural when the node used to be a direct child of the PAGE) and the section itself isn't at (0,0), then after the assignment the node's real absolute position = `section.x + savedX`, `section.y + savedY` — i.e. the section's offset is added ON TOP of already-absolute numbers rather than replacing them.
**Symptom:** the section screenshot shows nodes shifted far down/right from the expected place, with large empty margins on top/left — visually like a "broken layout", but the structure (auto-layout, children, sizes) is completely correct; the shift grows cumulatively with each next section if the sections themselves sit at increasing Y (as in a grid of N rows) — the second row is shifted more than the first, the third more than the second, etc., which masquerades as a "progressive bug" while it's the same mechanism on every section.
**Pattern:** after `section.appendChild(node)` assign coordinates recomputed RELATIVE to the section itself: `node.x = targetAbsoluteX - section.x; node.y = targetAbsoluteY - section.y`. If all sections are built with the same padding around the content (the typical case), the coordinates inside each section come out as the same constants (e.g. "the first column is always at paddingX from the section edge") — i.e. after the first section the rest need no recomputation, just the insertion of the same constant.
```js
// ❌ WRONG — savedX/savedY were absolute page coordinates
const savedX = node.x, savedY = node.y;   // captured while node was still a child of the PAGE
section.appendChild(node);
node.x = savedX; node.y = savedY;         // now this is the section offset + savedX — a double shift

// ✅ RIGHT — recompute relative to the section
section.appendChild(node);
node.x = targetAbsoluteX - section.x;
node.y = targetAbsoluteY - section.y;
```

### bottom-pinned-constraint-follows-parent-resize
**Principle:** A child node with `constraints.vertical: 'MAX'` (pinned to the parent's bottom in the Figma UI — "pin to bottom") AUTOMATICALLY recomputes its `y` on a programmatic `parentFrame.resize(width, newHeight)` to stay at the new bottom (`y = newHeight - childHeight`), without an explicit manual move. This is expected, useful behaviour (not a bug) — but if new content is planned to go "into the space that appears" next to that pin, there may be no space left after the resize: the pin simply travelled with the new bottom rather than staying at its old position and freeing a gap.
**Symptom:** after increasing a frame's height (e.g. to remove clipping — see `clipscontent-true-with-stale-height-hides-content-from-canvas-and-export` in `mcp-and-environment.md`) the planned "gap at the bottom for a new row" turns out to be almost zero: the element that was supposed to stay put moved to the new edge together with the rest of the bottom.
**Pattern:** before computing the gap for new content, read `constraints.vertical` on all children that may be pinned to the bottom/top/centre — factor their final position AFTER the resize into the space calculation, not before. The cheap way — do the resize, then re-read the pinned node's position, and compute how much free space really remains from that.
```js
const before = pinnedNode.y; // before resize — useless for the space calculation
parentFrame.resize(parentFrame.width, newHeight);
const after = pinnedNode.y;  // after resize — this is the real boundary
// place new content strictly above `after`, with the needed margin
```

**Compounding variant (double shift), when the pinned node's position is set BY HAND BEFORE the parent's resize, already computed "with" the future growth:** `pinnedChild.y = newBottomEdge; parentFrame.resize(w, newHeight);` yields NOT `newBottomEdge` but `newBottomEdge + (newHeight - oldHeight)` — the resize itself adds another identical shift ON TOP of the manually set one, because the constraint recomputation is applied to the current (already manually shifted) `y` as if it were the old value. The symptom is distinguishable from "just a small gap" by the final position being ENTIRELY outside the parent (e.g. `child.y > parentFrame.height`; the node leaves past the bottom edge). Fix — the order already in the example above: parent resize FIRST, final `x`/`y` of pinned children as the LAST step of the script, never before. Confirmed twice on one mobile chat file — first a message composer (bottom-pinned) in an open chat moved from the expected `y:1256` to an actual `y:1724` (the delta `468` duplicated), then the same mechanism recurred on a disabled composer in a closed chat (`y:872` expected → `y:928` actual, delta `56` duplicated) — both times because the position was set by hand BEFORE, not after, `chatFrame.resize`.

**The same repin fires on a SELF-RESIZE of the pinned node too, without a single `parentFrame.resize` in the script.** If the pinned (`constraints.vertical: 'MAX'`, `layoutPositioning: 'ABSOLUTE'`) child's own `height` shrank (e.g. an inner TEXT was removed and its auto-layout hug parent recomputed the height), Figma moves `y` so that the bottom edge (`y + height`) stays in place — even if nothing was explicitly resized at the OUTER parent's level. The symptom is the reverse of the main section: not "detached from the bottom" but "pulled itself to the bottom without a single line of code for it" — easy to take for a bug / an unapplied edit on a quick before/after check of `y`, if you don't account for the fact that `.remove()` of a child node also triggers the constraint-pin recomputation. Verified on a mobile chat app file — a bottom sheet docked to the bottom of an 800-high viewport frame lost a caption line (`content.primaryAxisSizingMode:'AUTO'` recomputed the sheet height 504→460), and `y` recomputed itself from `296` to `340` (`340+460=800`, the same bottom edge) without an explicit `parentFrame.resize` — a manual pass-through fix (`sheet.y = 800 - sheet.height`) turned out to be a no-op; the value was already right.

### self-fill-child-blocks-own-primaryaxissizingmode-auto
**Principle:** A node with `layoutMode` (itself an auto-layout container) can SIMULTANEOUSLY be a FILL child of ITS parent (`node.layoutSizingVertical = 'FILL'`, inherited from the parent auto-layout) — in this state assigning `node.primaryAxisSizingMode = 'AUTO'` (asking the node to hug its children) silently rolls back to `'FIXED'` in THE SAME script, without error. This is a mirror but separate trap from `parent-hug-silently-demotes-a-FILL-child-to-FIXED` above: there the problem is in the node's CHILDREN, here in the NODE ITSELF as someone else's child. FILL as "take the size the parent gives" is incompatible with AUTO as "compute the size from my children" — Figma gives FILL priority.
**Symptom:** `node.primaryAxisSizingMode = 'AUTO'; return node.primaryAxisSizingMode;` in ONE AND THE SAME script returns `'FIXED'` — not "not applied yet" but literally rejected; a repeat assignment in the NEXT call gives the same result. Diagnosis via `node.layoutSizingVertical` (not the node's own `primaryAxisSizingMode` and not its children's properties) immediately shows `'FILL'`.
**Pattern:** the same collapse trick as for new auto-layout frames (`createautolayout-default-size-hug-collapse` in the core SKILL.md), but here it cures a different cause: `primaryAxisSizingMode = 'FIXED'` → `resize(width, 1)` (while still FIXED) → `primaryAxisSizingMode = 'AUTO'` — after the explicit collapse-resize the AUTO assignment holds, and `layoutSizingVertical` can be switched to `'HUG'` right after. Before touching the sizing of a node that is itself an auto-layout container, read its `layoutSizingVertical` (as a child) first, not only `primaryAxisSizingMode` (as a parent).
**Important:** a FILL height on a node filling a fixed viewport (e.g. a mobile bottom sheet calibrated to the device height) is often NOT a bug but a deliberate "remaining space falls to the bottom, toward the CTA" pattern. If so — don't convert to AUTO at all; just insert the new content as usual (the auto-layout parent recomputes the children's positions within the fixed height; the free space at the bottom just shrinks). Converting to AUTO is appropriate only when the task really is "let the height hug the content", not "add content inside an already calibrated height".
```js
// ❌ silently not applied — content is itself a FILL child of sheet-filter
content.primaryAxisSizingMode = 'AUTO';
// content.primaryAxisSizingMode is still 'FIXED'

// ✅ collapse trick: FIXED → resize(w,1) → AUTO
content.primaryAxisSizingMode = 'FIXED';
content.resize(content.width, 1);
content.primaryAxisSizingMode = 'AUTO'; // now it holds
content.layoutSizingVertical = 'HUG';   // also goes through right after
```

### cloned-fill-child-into-hug-parent-collapses-height
**Principle:** A node cloned from a context where it had `layoutSizingVertical: 'FILL'` (e.g. a child of a HORIZONTAL auto-layout with its height inherited from a neighbour), on `appendChild` into a NEW auto-layout parent with `primaryAxisSizingMode: 'AUTO'` (hug) doesn't inherit the meaning "take the height as before" — `FILL` in a hug parent has no reference height to fill (the parent computes its height FROM the children), and Figma collapses such a child to a minimal value (1 px in practice), NOT to its former "real" height. The difference from `parent-hug-silently-demotes-a-FILL-child-to-FIXED` above: there the parent EXISTED with that FILL child and is switched to hug after the fact — the child freezes at a reasonable current height; here the child is INSERTED as a clone into an already-hug parent that never had a reference height for that particular FILL value — a collapse, not a freeze.
**Symptom:** after cloning and `appendChild` into a VERTICAL hug container the node (usually a row with icon + text) almost disappears visually — on the screenshot the text/icon inside is clipped/invisible. A structural read shows `node.height` around 1 (not 0, not an error) and `node.layoutSizingVertical === 'FILL'` — inherited from the source cloning context, not reset by `clone`. The overall container (hug itself) meanwhile reports a correct cumulative height by the y coordinates of neighbouring children (spacing computed right), but the real row inside is a flat strip.
**Pattern:** after `appendChild` of a clone into a new auto-layout parent — explicitly check `clone.layoutSizingVertical` and, if it's `FILL`, switch it to `HUG` (if the clone is itself an auto-layout container) at once, before reading/screenshotting. Don't rely on the clone "bringing" the right height from the source context — the sizing mode is cloned literally, not recomputed for the new environment.
```js
const rowClone = fileRowTemplate.clone();
card.appendChild(rowClone); // card = VERTICAL, primaryAxisSizingMode='AUTO'
// rowClone.height is already 1 here — the inherited FILL can't lean on a hug parent
rowClone.layoutSizingVertical = 'HUG'; // fix — right after append
```

### counteraxissizingmode-governs-the-perpendicular-not-own-axis
**Principle:** `counterAxisSizingMode` / `primaryAxisSizingMode` are not interchangeable "width/height" but "primary = along layoutMode, counter = across". On a VERTICAL frame `primaryAxisSizingMode` governs HEIGHT and `counterAxisSizingMode` WIDTH; on HORIZONTAL — the reverse. The ready force-recompute recipe in SKILL.md (`counterAxisSizingMode='FIXED'→resize(w,0)→'AUTO'→layoutSizingVertical='HUG'`) is written for a HORIZONTAL frame where the height is to be recomputed (= the counter axis for HORIZONTAL). Copying that recipe one-to-one onto a VERTICAL frame to recompute its height doesn't work: `counterAxisSizingMode` on a VERTICAL frame is the WIDTH, and the `FIXED→resize(w,0)→AUTO` cycle doesn't "reset the height for recomputation" but temporarily zeroes and re-hugs the WIDTH from children that are themselves `layoutSizingHorizontal:'FILL'` (inherited from the parent) — the circular dependency `hug-from-children` vs `children-fill-from-parent` collapses the width to a degenerate minimum (in the specific case — to the sum of the row's fixed elements like icon + gap, unrelated to the real content).
**Symptom:** after calling the "recompute recipe" on a VERTICAL auto-layout frame containing TEXT/FILL children, the text inside collapses into a vertical column of one letter per line (textAutoResize=HEIGHT at a tiny FIXED width wraps every character). Diagnosis: the affected child's `node.width` is a two-digit number (e.g. 7–35 px) where ~300+ is expected; `optionsWrap.counterAxisSizingMode` after the "fix" equals `'AUTO'` although before the intervention it was a working `'FIXED'` — the very fact that the script SWITCHED what already worked, without checking the current value, is the root.
**Pattern:** before touching `primaryAxisSizingMode` / `counterAxisSizingMode` on an existing (not just-created) frame — first ask which axis really needs recomputation (height or width), then match that to the frame's `layoutMode` (primary = along layoutMode, counter = across), and only then apply the collapse trick to the RIGHT property. If the frame was configured correctly BEFORE the edit (the typical case — an existing donor frame, not a fresh `createAutoLayout`), simply removing/adding children often recomputes the height (the primary axis for VERTICAL) by itself, without any manual intervention in sizing modes at all — first try touching nothing and check with a screenshot, rather than applying the recipe pre-emptively.
```js
// ❌ VERTICAL frame, wanted to recompute HEIGHT after remove() of a child — but touched counter (=width for VERTICAL)
optionsWrap.counterAxisSizingMode = 'FIXED';
optionsWrap.resize(optionsWrap.width, 0);
optionsWrap.counterAxisSizingMode = 'AUTO';  // the width collapses in a circular FILL-vs-HUG conflict with the children
optionsWrap.layoutSizingVertical = 'HUG';

// ✅ for a VERTICAL frame recomputing HEIGHT is primaryAxisSizingMode, not counter
// but most often it's simpler and safer not to touch sizing modes at all: remove()/appendChild()
// on an already correctly configured auto-layout frame recomputes the primary axis by itself
```

### height-read-for-downstream-math-precedes-late-recalc-after-child-fill-assignment
**Principle:** Within ONE `use_figma` script, after `appendChild(newChild)` into a HUG auto-layout parent, `newChild.characters = …` and then `newChild.layoutSizingHorizontal = 'FILL'` — an immediate read of `parent.height` (the HUG parent, not newChild itself) for further geometric arithmetic (e.g. computing how far to move the neighbours below) may return a value LARGER than the same `parent.height` read a bit later in the same script without any additional mutations between the two reads. The recompute of the parent's HUG height after assigning `layoutSizingHorizontal` to its child apparently doesn't fully fit into the same synchronous tick as the mutation itself — and a `resize` called on the basis of the FIRST (inflated) read pins exactly the inflated number, which is not recomputed afterwards.
**Symptom:** geometric arithmetic built on `const h = node.height` right after a series of mutations (append + text + `layoutSizingHorizontal`) gives a seemingly random but reproducibly larger number (in the specific case 884 instead of the correct 756 — a discrepancy of exactly twice the new block's height), which then cascades into breaking the dependent manual `resize` calls (a neighbour/composer slides outside a fixed-height parent with `clipsContent=true` — visually disappears from the screen although it exists structurally). A repeat read of THE SAME property at the end of the script (no new mutations in between) returns the correct, settled value — i.e. the bug is not in the order of mutation operations but in the TIMING of the read between the mutation and the settling of the recompute.
**Pattern:** don't use the `.height`/`.width` of a HUG parent for subsequent manual resize arithmetic (shifting neighbours, growing an outer fixed container) in THE SAME script where a child's `layoutSizing*` was changed right before. Split into two `use_figma` calls: the first — all content mutations (append/text/FILL), the second — the (now settled) geometry read and all dependent resize arithmetic. If it must be one call — insert an extra (safe) repeat read of the same property immediately before using it in the arithmetic, rather than relying on a value captured right after the mutations. Always check the final geometry with a screenshot — a discrepancy of this kind throws no error; it just visually breaks the layout.
```js
// ❌ reading .height right after layoutSizingHorizontal='FILL' on the child — a possible unsettled tick
errorText.layoutSizingHorizontal = 'FILL';
const h = clone.height; // may be larger than the correct value
list.resize(list.width, clone.y + h + 16); // pins downstream geometry wrongly

// ✅ a repeat read of the same property immediately before using it in the arithmetic
errorText.layoutSizingHorizontal = 'FILL';
const settledHeight = clone.height; // same call, but: if in doubt — move to a separate use_figma
const cloneBottom = clone.y + clone.height; // read afresh; don't reuse h from an earlier point in the script
list.resize(list.width, cloneBottom + 16);
composer.y = list.y + list.height;
root.resize(root.width, composer.y + composer.height); // derive the WHOLE chain from already-settled numbers, not accumulated deltas
```

### bottom-sheet-fixed-backdrop-children-fixed-height-not-hug-after-list-edit
**Principle:** In files where a bottom sheet is built on the pattern "fixed 844 px root (backdrop) → the sheet wrapper (VERTICAL) → `content` (VERTICAL, single child — a list/form)", and the sheet wrapper/`content` were calibrated to the ORIGINAL content volume via `primaryAxisSizingMode: 'FIXED'` (not `'AUTO'`) — adding or removing items inside the nested AUTO-hugging list (`primaryAxisSizingMode: 'AUTO'`) correctly recomputes the height of the LIST ITSELF but does NOT recompute `content`/the sheet wrapper, whose FIXED height is an independent number unrelated to the content. The difference remains as a visible empty gap between the last list/form item and the bottom button panel (footer), which is physically pressed to the bottom of the sheet wrapper, not to the end of the real content.
**Symptom:** after `item.remove()` / `list.appendChild(newItem)` the screenshot shows a correctly trimmed/extended list, but then — a noticeable (tens to hundreds of px) empty block before the "Cancel"/"Apply"/submit buttons; or, conversely, when adding content (not only removing) the content is clipped by `content`'s bottom edge if the list's new height exceeded the old FIXED height. `get_metadata` / a structural read doesn't hint at the problem — the `content.height` / `sheetFilter.height` numbers are valid, just unrelated to the actual content; caught only by screenshot.
**Pattern:** an own `resize(width, 1)` → 'AUTO' on EVERY fixed-sizing ancestor (usually two levels: `content`, then the sheet wrapper) forces each to recompute its hug height from real content — a direct `primaryAxisSizingMode` change without a preliminary `resize` to a small number sometimes doesn't trigger a recompute in the same tick (see `createautolayout-default-size-hug-collapse` in the core about this same class of problem). After the recompute — explicitly pin `sheetFilter.y = root.height - sheetFilter.height` so the modal stays "glued" to the bottom of the fixed-viewport backdrop (rather than staying at its original `y`, which would leave a grey gap at the TOP instead of the bottom).
```js
// content — the single child of sheet-filter, originally FIXED (inherited from a donor with a different content volume)
content.resize(content.width, 1);
content.primaryAxisSizingMode = 'AUTO';   // recomputes the hug height from the real list inside

sheetFilter.resize(sheetFilter.width, 1);
sheetFilter.primaryAxisSizingMode = 'AUTO'; // recomputes from hat + content + footer

sheetFilter.y = root.height - sheetFilter.height; // glue to the bottom of the fixed 844 px backdrop
```

### resize-with-bottom-pinned-child-constraint-compounds-manual-y-shift
_A third independent confirmation of the same pattern as the "Compounding variant (double shift)" inside `bottom-pinned-constraint-follows-parent-resize` above (the same delta-compounding mistake with a manual `.y` before `resize`), a different session._
**Principle:** On a NONE-layout frame with non-zero per-child `constraints` (e.g. `vertical: 'MAX'` — bottom-pinned), a manual `child.y = newY` BEFORE a subsequent `parent.resize(w, newH)` doesn't stay final: `resize` itself recomputes the constrained children's positions relative to the parent's new bounds (for `MAX` — preserving the distance to the bottom edge), regardless of `.y` having been set by hand to the "right" value a second earlier — the final position is the sum of the constraint-recompute delta ON TOP of the already-applied manual shift, not one or the other.
**Symptom:** after `child.y = X; parent.resize(w, h)` in one script, a repeat read of `child.y` gives a number LARGER than the expected X — by exactly the delta (`newH - oldH`) added to the parent's height, as if the `.y` assignment hadn't worked at all. No exception — both numbers look plausible; the discrepancy is caught only by checking against the expected arithmetic (e.g. `banner.y + banner.height` should equal `composer.y`, and doesn't).
**Pattern:** don't rely on a manual `child.y =` for constrained children if `parent.resize` follows — first read `child.constraints` (don't assume `NONE`/`MIN`); with `MAX`/`CENTER`/`SCALE` let `resize` move the child itself, and make the final correction AFTER the resize, as a separate assignment from an untouched neighbour (`MIN/MIN`), not by delta arithmetic.
```js
// ❌ a manual shift BEFORE resize — compensated by the constraint recompute on top
composer.y = 872 + delta; // "fixed" to 900
root.resize(root.width, 928 + delta);
// composer.y is now 900 + delta = 928 (the MAX constraint added one more delta)

// ✅ resize first, then the final exact placement from a MIN/MIN neighbour, not a delta
root.resize(root.width, 928 + delta);
composer.y = banner.y + banner.height; // absolute anchoring to an untouched neighbour, not delta arithmetic
```

### plain-frame-screen-to-autolayout-conversion-recipe

**Principle:** Old (pre-auto-layout) mobile screens are usually built on the same scheme: the screen's root `NONE` frame holds 3–4 top-level children (header / content list / pinned banner / footer) placed by hand via `x`/`y` + legacy `constraints` (`STRETCH` for stretching ones, `MIN`/`MAX` for pinned). Inside the list content the cards/bubbles are also on absolute `x`/`y` with constraints imitating left/right or other alignment. A full conversion of such a screen to auto layout is not a point edit of each node but a three-part rebuild:
1. **Header/footer** stay essentially as they are (usually a READY auto-layout instance/frame) — they just get `layoutSizingHorizontal='FILL'`, `layoutSizingVertical='HUG'` as children of the future root.
2. **The content list** (cards/messages) — wrapped in a new VERTICAL auto-layout, each item in a HORIZONTAL row wrapper for left/right alignment (see `autolayout-per-item-alignment-needs-row-wrapper-not-layoutalign` below); the list itself `primaryAxisSizingMode: 'AUTO'` (HUG height — the content count/length varies; this is a LEGITIMATE case for hug).
3. **A new "body" wrapper** (VERTICAL, `clipsContent: true`, `layoutSizingVertical: 'FILL'` as a child of the future root) — holds the list inside as an ordinary flow child (top-anchored), and any banner/alert pinned over the content as a `layoutPositioning: 'ABSOLUTE'` child of the same wrapper (see `absolute-positioned-child-cannot-fill-use-constraints-for-pinned-overlay`).
4. **The screen root** — `layoutMode: 'VERTICAL'`, but **`primaryAxisSizingMode: 'FIXED'`, not `'AUTO'`** — a screen viewport (device mockup) must not collapse when there's little content; the body takes via FILL whatever remains after the fixed header + footer, and the arithmetic converges by itself (`root.height = header.height + body.height + footer.height`) if the body is seeded with a start size = the old plain frame's old height BEFORE enabling layoutMode on the root (see `enabling-layoutmode-on-populated-frame-hug-shrinks-despite-later-fixed-mode` in the core — the same principle, here used AS AN ADVANTAGE: a correctly computed body seed size spares a repeat `resize` afterwards).

**Execution order (bottom-up — each step lays the ground for the next):**
```
1. Hug the content leaves (card/bubble) — fix the cascade inside them first
   (see hug-card-with-fill-header-needs-full-chain-flip-to-hug), check a screenshot.
2. Wrap each item in a row wrapper, assemble the VERTICAL auto-layout list,
   HUG height. Check a screenshot — the list should "shrink" to the real
   content (much shorter than the old fake NONE frame — expected, not a bug).
3. Create the "body" wrapper, move the list inside (FILL width, HUG height,
   layoutPositioning=AUTO), move the pinned banner inside (ABSOLUTE +
   constraints). Check a screenshot in isolation.
4. On the root: reorder the children into the right top-to-bottom order (insertChild
   AFTER moving the nested nodes — their removal from the root changes the indices),
   ONLY THEN enable layoutMode. FIXED sizing, an explicit resize() at the end
   as a safety net. Check a screenshot of the whole screen — compare the composition
   with the original "before" screenshot.
```
**Symptom if the order is skipped (enabling root.layoutMode at once without preparing the body):** the root either collapses to the sum of the children's "raw" current sizes (which at that moment are not yet FILL/HUG — just their old fixed values), or (if not all children are in place yet) gives a wrong stack order requiring a second `insertChild` pass.

### autolayout-per-item-alignment-needs-row-wrapper-not-layoutalign

**Principle:** `layoutAlign` (`MIN`/`CENTER`/`MAX`) is a deprecated per-child counter-axis alignment override; the modern API requires **all** children of one auto-layout parent to have THE SAME counter-axis alignment, set on the parent via `counterAxisAlignItems` (see the `plugin-api-standalone.d.ts` comment on `layoutAlign`: "Counter axis alignment is now set on the auto-layout frame itself... this means all layers in an auto-layout frame must now have the same counter axis alignment"). A list of messages/cards where each item aligns ITS OWN way (left for one, right for another — the typical chat-bubble pattern) can't be expressed through one VERTICAL auto-layout with a shared `counterAxisAlignItems` — it's a SHARED property across all children at once.
**Symptom:** an attempt to give different children of one VERTICAL auto-layout list different `layoutAlign` either has no visible effect (deprecated values are silently ignored in favour of the parent's `counterAxisAlignItems`), or (if setting `counterAxisAlignItems` on the parent) all items collapse to ONE alignment, losing the left/right alternation.
**Pattern:** wrap each item in its own HORIZONTAL row wrapper (`itemSpacing: 0`, zero padding, `layoutSizingHorizontal: 'FILL'` relative to the list), and set **`primaryAxisAlignItems`** ON THAT ROW (`'MIN'` for left, `'MAX'` for right, `'CENTER'` if needed) — since each row wrapper is a SEPARATE auto-layout frame with its own independent `primaryAxisAlignItems`, per-item alignment is restored without breaking the "one counterAxisAlignItems per parent" rule (the rule applies to the counter axis of ONE parent, not across independent sibling row wrappers).
```js
const row = figma.createAutoLayout('HORIZONTAL', {
  itemSpacing: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
  primaryAxisAlignItems: isOwnMessage ? 'MAX' : 'MIN', // per row, not per child on the shared parent
});
row.fills = [];
list.appendChild(row);
row.appendChild(bubble);
bubble.layoutSizingHorizontal = 'HUG';
row.layoutSizingHorizontal = 'FILL'; // the row itself stretches to the list's full width
```

### absolute-positioned-child-cannot-fill-use-constraints-for-pinned-overlay

**Principle:** An element that should visually "float" over/inside an auto-layout parent outside the normal flow (an alert banner pressed to the bottom of a scrollable area while the message list above grows independently) is placed via `layoutPositioning: 'ABSOLUTE'`. But `layoutSizingHorizontal: 'FILL'` is **incompatible** with `ABSOLUTE` (see the official API error: `"FILL cannot be set on absolute positioned auto-layout children"`, documented in the `figma-use` skill's error table) — stretching an ABSOLUTE child to the parent's width must be done through **legacy `constraints`** (`{horizontal: 'STRETCH', vertical: 'MAX'}` etc.), which for ABSOLUTE children of an auto-layout parent remain a working, non-deprecated mechanism (unlike ordinary flow children, where constraints are ignored in favour of `layoutSizingHorizontal/Vertical`).
**Symptom:** `element.layoutPositioning = 'ABSOLUTE'; element.layoutSizingHorizontal = 'FILL';` — throws on the second line. Alternative trap: if instead of `constraints` you leave `layoutSizingHorizontal` undefined/`FIXED` — the element won't stretch in width when the parent resizes (the very bug that usually leads to needing this pattern — "the banner doesn't stretch like everything around it").
**Pattern:** `element.layoutPositioning = 'ABSOLUTE'` → `element.constraints = { horizontal: 'STRETCH', vertical: 'MAX' }` (or the needed combination) → set `x`/`y` by hand (constraints don't override the initial position, only the behaviour on parent resize — see `bottom-pinned-constraint-follows-parent-resize` in the core).
```js
alert.layoutPositioning = 'ABSOLUTE';
alert.constraints = { horizontal: 'STRETCH', vertical: 'MAX' }; // NOT layoutSizingHorizontal='FILL' — it throws
alert.x = 16;                              // left inset, mirrors the parent's padding
alert.y = body.height - alert.height;      // press to the bottom
```

### hug-card-with-fill-header-needs-full-chain-flip-to-hug

**Principle:** Extends `fill-child-inside-hugging-parent-collapses-subtree-to-widest-hugging-sibling` (core) for a specific frequent case — a card/bubble where ALL direct and indirect descendants were historically `FILL` (because the card was once `FIXED` width, and `FILL` up to a fixed ancestor worked harmlessly). Converting such a card to `HUG` **is not solved pointwise** ("set HUG only on the card") — if there are several independent FILL chains inside (e.g. "header: avatar + name + timestamp + menu" AND "message text" as two direct children of the card), the card must hug to the **wider** of them, and for that EACH chain must have its own intrinsic (non-FILL) anchor at the deepest meaningful level (usually a TEXT node with real content: name, timestamp, message text), and EVERY intermediate frame on the way up must be flipped from `FILL`+`FIXED` to `HUG`+`AUTO` (the child's `layoutSizingHorizontal` AND its own `primary`/`counterAxisSizingMode` on the same axis — these are two DIFFERENT properties on one node; don't confuse them, see rule 12b in `figma-use`).
**Symptom:** after a pointwise `card.counterAxisSizingMode='AUTO'` — the card's width drops sharply (many times below expected) and the HEIGHT explodes (hundreds of px instead of tens) — because the only surviving "anchor" for the whole card is the smallest FIXED element (a 20–40 px icon), and the text, given that tiny `FILL` width, wraps onto many lines.
**Pattern:** find ALL direct children of the collapsed card (usually 2: "header" + "content"/text) — if both are currently `FILL`, the card has no valid anchor for either. For each such chain, bottom-up: (1) the TEXT leaf → `layoutSizingHorizontal='HUG'` (valid for TEXT children of auto-layout — rule 12 in `figma-use`); (2) each intermediate frame on the way up → `layoutSizingHorizontal='HUG'` (as someone's child) **and** its own `primaryAxisSizingMode`/`counterAxisSizingMode` on ITS width axis → `'AUTO'` (as a container for its children) — both edits on the same node; the order between them doesn't matter, but both are mandatory. Fixed-size elements along the way (an avatar circle, icons) — don't touch; they stay `FIXED` anchors inside their branch. After the flip Figma itself picks the wider of the ready HUG branches as the card's width — no need to compare/compute by hand.
**Limitation of the method:** if in the original CSS/code the "wide" branch uses `justify-content: space-between` (i.e. it REALLY stretches to the card's full width when the card is wider than its natural content, pressing something to the far edge) — the HUG-flipped branch in Figma won't reproduce that: it stays at its intrinsic width even if the card became wider because of ANOTHER (wider) branch. For cards where this situation is realistic (not only theoretical) — either accept this visual approximation (won't stretch), or (harder) build an extra HORIZONTAL wrapper by hand with a `space-between`-like spacer.
```js
async function loadFonts(t) { for (const s of t.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(s.fontName); }
// bottom-up: TEXT leaves → every intermediate frame
await loadFonts(nameText); nameText.layoutSizingHorizontal = 'HUG';
nameColumn.counterAxisSizingMode = 'AUTO';       // its own width axis (VERTICAL layout → counter=horizontal)
nameColumn.layoutSizingHorizontal = 'HUG';       // as someone's child
headerRow.primaryAxisSizingMode = 'AUTO';        // its own width axis (HORIZONTAL layout → primary=horizontal)
headerRow.layoutSizingHorizontal = 'HUG';
```

### bottom-sheet-shell-plain-frame-to-autolayout-recipe

**Principle:** Extends `plain-frame-screen-to-autolayout-conversion-recipe` for the second common type of old plain frames in such files — a bottom sheet over a screen (the sheet box → the sheet header/the title-row wrapper (title + close) → `content` (form fields) → the bottom panel (hint text + 2 buttons)). Unlike a chat screen, here the **inner content (`fields`, `button layout`) is usually already on auto layout** (the donor was built right) — only the "shell" is broken: the sheet box/the sheet header/the title-row wrapper/`content`/the bottom panel are all `NONE`, and `content` holds a hard-coded HEIGHT (e.g. 566 px) that has gone years without being recomputed for the specific field set of the specific sheet — this old bug was already described separately in `bottom-sheet-fixed-backdrop-children-fixed-height-not-hug-after-list-edit` (there an EXISTING auto layout with a stale FIXED mode was fixed); here the same root, but the shell was never auto layout in the first place.
**Symptom:** `content.height` (566 and similar round numbers) is far larger than the sum of the real content inside (`fields.height` + vertical paddings) — on the screenshot tens to hundreds of px of empty white space hang under the last form field before the bottom panel. Additionally: `button layout` often has its own `padding: 16` on ALL sides, and the bottom panel (after conversion to auto layout) must NOT re-apply the same 16 px horizontally — otherwise the buttons get doubly squeezed relative to an already-correct button-row width.
**Pattern (bottom-up, identical for all sheet nodes with this skeleton — the donor is the same):**
```js
// layuot (title-row wrapper) — NONE, the single child Frame*816 at x=16,y=16 → padding 16 on all sides
layuot.layoutMode = 'VERTICAL';
layuot.paddingTop = 16; layuot.paddingRight = 16; layuot.paddingBottom = 16; layuot.paddingLeft = 16;
layuot.primaryAxisSizingMode = 'AUTO';   // hug — recomputes to the original 56 (24 content + 16+16)
layuot.counterAxisSizingMode = 'FIXED';

// content — NONE, oversized FIXED (e.g. 566) → hug to the real fields
content.layoutMode = 'VERTICAL';
content.paddingTop = 16; content.paddingRight = 16; content.paddingBottom = 16; content.paddingLeft = 16;
content.primaryAxisSizingMode = 'AUTO'; // collapses sharply to the real content — EXPECTED, not a bug
content.counterAxisSizingMode = 'FIXED';

// bottom-panel — NONE; move the horizontal inset HERE, remove the duplicate on button-layout
bottomPanel.layoutMode = 'VERTICAL';
bottomPanel.paddingTop = 18; bottomPanel.paddingRight = 16; bottomPanel.paddingBottom = 0; bottomPanel.paddingLeft = 16;
bottomPanel.itemSpacing = 18;
bottomPanel.primaryAxisSizingMode = 'AUTO';
bottomPanel.counterAxisSizingMode = 'FIXED';
buttonLayout.paddingLeft = 0; buttonLayout.paddingRight = 0; // was 16/16 — bottomPanel provides them now

// sheet-box — NONE, FIXED (e.g. 754) → hug to hat + content + bottom-panel
sheetBox.layoutMode = 'VERTICAL';
sheetBox.primaryAxisSizingMode = 'AUTO';
sheetBox.counterAxisSizingMode = 'FIXED';
[hat, content, bottomPanel].forEach(n => { n.layoutSizingHorizontal = 'FILL'; n.layoutSizingVertical = 'HUG'; });

// root/overlay — a FIXED viewport (not hug!), sheet-box pressed to the bottom via primaryAxisAlignItems
root.layoutMode = 'VERTICAL';
root.primaryAxisAlignItems = 'MAX'; // the single (or the only "non-flow") child goes to the bottom
root.primaryAxisSizingMode = 'FIXED';
root.counterAxisSizingMode = 'FIXED';
root.resize(390, 844); // safety net
sheetBox.layoutSizingHorizontal = 'FILL'; sheetBox.layoutSizingVertical = 'HUG';
```
**When the screen under the sheet is NOT an empty backdrop but real content** (e.g. a sheet over an open chat; the sheet overlay full-screen; the root already holds nav/body/footer in normal flow) — the sheet overlay doesn't become the root itself but is added to the already three-part root as `layoutPositioning: 'ABSOLUTE'` + `constraints: {horizontal:'STRETCH', vertical:'STRETCH'}` (stretches over the whole screen, not just one axis — unlike the bottom pinned banner from `absolute-positioned-child-cannot-fill-use-constraints-for-pinned-overlay`, here BOTH axes need STRETCH), `x=0, y=0`. Inside, the sheet overlay itself is the same recursion of the recipe above (`layoutMode: 'VERTICAL', primaryAxisAlignItems: 'MAX'`, `resize` to the root's full height).
**Visible side effect (not a bug; expected and worth telling the user):** since `content`/the sheet box now hug honestly, the sheet becomes visually SHORTER and sits LOWER on the screen than with the hard-coded oversized height — that is the point of the fix (height = real content), but on the screenshot it's a noticeable composition change, not just an "under the hood" refactor.

### hug-card-collapses-when-only-anchor-is-narrower-than-content-keep-fixed

**Principle:** Extends `hug-card-with-fill-header-needs-full-chain-flip-to-hug` — "a frozen FIXED anchor saves the card from collapse" works ONLY when that anchor is wide enough (wider than the real content of the other FILL branches). If the card holds several direct/nested FILL children WITHOUT their own HUG anchor (ordinary TEXT labels/values not converted to HUG) and the ONE and only real FIXED anchor is NARROWER than the content needs (e.g. a narrow 132 px `File row` inside a card that has a comment paragraph designed for 256 px), an attempt to hug the outer container (`counterAxisSizingMode: 'AUTO'`) doesn't keep the old width (unlike the file-block case) but **collapses the whole card to the width of that narrow anchor** — Figma uses the single real FIXED descendant as the base for the hug computation regardless of it being the narrowest, not the widest, element of the tree.
**Symptom:** after `card.counterAxisSizingMode = 'AUTO'` the card narrows sharply (e.g. 280→156 px) and the height explodes (376→484 px) — the classic symptom of text wrapping into a too-narrow column, the same pattern as "a pointwise `card.counterAxisSizingMode='AUTO'` without preparing the anchors" from the parent rule, but here the trap is subtler: locally it SEEMS there is an anchor (a real FIXED descendant exists; the tree resembles an already-working file-block case), but its geometry doesn't match the content.
**Pattern:** if the card has NO reliable wide FIXED/HUG anchor (all text labels/values remain FILL; the only FIXED element is clearly narrower than the expected card width) — don't try to hug this node at all. Roll back / keep it in explicit `FIXED` mode (`counterAxisSizingMode: 'FIXED'`, `resize` to the original width) and place it in the row wrapper with `layoutSizingHorizontal: 'FIXED'`, not `'HUG'` — this is not a compromise but the correct solution: content with a wrapping paragraph (a comment, a rejection reason, etc.) must keep a FIXED width so that line wrapping works predictably (see `plain-frame-screen-to-autolayout-conversion-recipe` below — HUG only where the width is really needed).
```js
// rollback after a failed hug attempt — card reliably returns to its original size
card.resize(256, card.height);            // the inner content frame first
outer.counterAxisSizingMode = 'FIXED';
outer.resize(280, 0);                      // collapse trick to recompute the height
outer.primaryAxisSizingMode = 'AUTO';      // the height keeps hugging (varies; that's fine)
outer.primaryAxisSizingMode = 'AUTO';
// layoutSizingHorizontal on outer returns to 'FIXED' by itself —
// a linked property; no need to set it separately after counterAxisSizingMode='FIXED'
```
**Side observation:** `layoutSizingHorizontal` and `counterAxisSizingMode` / `primaryAxisSizingMode` are linked properties in one direction: explicitly setting `counterAxisSizingMode = 'FIXED'` on a node automatically switches its own `layoutSizingHorizontal` to `'FIXED'` even if it was `'HUG'` before — no separate call is needed to roll back the second property.

### direct-y-assignment-silently-ignored-inside-auto-layout-reorder-via-insertchild
_Same principle as `autolayout-manual-xy-silently-ignored-order-controls-position` above (manual `.x`/`.y` are ignored by the auto-layout engine; fix — `insertChild`) — here a specific scenario of reordering already-existing (not just-added) children, a month later._
**Principle:** Assigning `node.y = N` to a child of an auto-layout frame (`layoutMode !== 'NONE'`) throws no error and isn't logged as a refusal — the assignment is silently ignored, because the layout engine computes the position from the order of `parent.children` and `itemSpacing`, not from absolute coordinates. A subsequent read of `node.y` in the same or the next call shows the **original** value, as if the assignment never happened. To rearrange blocks inside an auto-layout parent (e.g. insert a new block BEFORE existing ones), the only working way is `parent.insertChild(index, node)`, which moves the node to a new position in the children list; after that the layout engine recomputes the `x`/`y` of all siblings by `itemSpacing`.
**Symptom:** the script assigns `titleNode.y = 24`, `bodyNode.y = titleNode.y + titleNode.height + 24`, etc. for a whole chain of blocks; `use_figma` throws no error, but the next `get_metadata` / repeat `getNodeByIdAsync` shows the same `y` as BEFORE the script — the blocks stay in the original order with the original spacing, as if the script hadn't run, although it finished without exceptions.
**Pattern:** before writing to a child's `.y`/`.x`, check `parent.layoutMode` — if not `'NONE'`, rearrange via `insertChild(index, node)` in the needed order, not via direct coordinate assignment. After the reorder the parent itself (if its `primaryAxisSizingMode/counterAxisSizingMode === 'AUTO'`) recomputes ITS size automatically — but check the whole chain of ancestors: if at least one level above holds `primaryAxisSizingMode: 'FIXED'` (or `counterAxisSizingMode: 'FIXED'` for the relevant axis), the descendant's recomputed height doesn't reach the top and gets clipped — the blocking level has to be switched to `'AUTO'` by hand (see also the side effect: `layoutSizingHorizontal/Vertical` on the node itself must be checked too — switching `counterAxisSizingMode` doesn't always sync `layoutSizing*` in both directions; see the rule above).
```js
// ❌ WRONG — silently ignored if mainLayout.layoutMode === 'VERTICAL'
titleNode.y = 24;
fieldsNode.y = titleNode.y + titleNode.height + 24;

// ✅ RIGHT — rearrange by order; let the layout engine compute the positions
const order = [titleNode.id, fieldsNode.id, /* ...the rest in the desired order */];
for (let i = 0; i < order.length; i++) {
  mainLayout.insertChild(i, mainLayout.children.find(c => c.id === order[i]));
}
// then check the ancestor chain for FIXED blockers and switch them to AUTO if needed
if (grandparent.primaryAxisSizingMode === 'FIXED') grandparent.primaryAxisSizingMode = 'AUTO';
```

### fill-sizing-set-before-layoutmode-switch-resolves-against-stale-axis

**Principle:** Extends the general "stale read after mutation" rule with a particular case at the junction of two operations. If `layoutSizingHorizontal = 'FILL'` is set on a child while the parent is still in the OLD `layoutMode` (e.g. `VERTICAL`), and the parent is then switched to `HORIZONTAL` — the child's FILL-width resolution stays frozen in the old axis context and is NOT recomputed automatically on the `layoutMode` change. A subsequent `.width` read returns the stale (VERTICAL-context) value, not the new (HORIZONTAL-context) one — no error, no warning.
**Symptom:** a silent failure without exception — the screenshot shows content sticking out of the clip (`clipsContent: true`) or running into a neighbouring element (in the specific case a 24 px icon almost entirely hidden by the clip; 4 px visible). A structural `.width` read meanwhile gives a plausible-looking number — just not the one the new layout context should produce.
**Pattern:** switch the parent's `layoutMode` BEFORE setting `layoutSizingHorizontal`/`Vertical: 'FILL'` on the children. If FILL was already set earlier by mistake — force a recompute with the `FIXED` → `resize` → `FILL` cycle (but see the neighbouring rule `resize-on-fresh-autolayout-frame-before-hug-settles-corrupts-text-sizing` — this cycle is unsafe on a just-created, not-yet-settled frame).
```js
// ❌ WRONG — FILL set while the parent is still VERTICAL
child.layoutSizingHorizontal = 'FILL';
parent.layoutMode = 'HORIZONTAL';   // child.width stays frozen in the VERTICAL context

// ✅ RIGHT — switch layoutMode first, then set FILL
parent.layoutMode = 'HORIZONTAL';
child.layoutSizingHorizontal = 'FILL';   // resolves in the correct HORIZONTAL context

// If FILL was set too early and the parent is already switched —
// force a recompute (only on a SETTLED, not freshly created frame):
child.layoutSizingHorizontal = 'FIXED';
child.resize(10, child.height);
child.layoutSizingHorizontal = 'FILL';
```

### resize-on-fresh-autolayout-frame-before-hug-settles-corrupts-text-sizing

**Principle:** Calling `frame.resize(w, h)` on a just-created auto-layout frame (`createAutoLayout` in the same script, children just added), BEFORE its own HUG height has naturally settled from real content even once, can corrupt the sizing mode of TEXT children: `textAutoResize` switches from `'HEIGHT'` to `'NONE'`, `layoutSizingVertical` from `'HUG'` to `'FIXED'`, and the height freezes at a value that looks like an echo of the WIDTH argument of that same `resize` call rather than anything related to real content.
**Symptom:** a card/row after assembly visually "inflates" to an unexpected height (in the specific case 54 px → 218 px), while the child TEXT nodes read as `textAutoResize: 'NONE'` / `layoutSizingVertical: 'FIXED'` — a mode the script never set explicitly. The very same resize technique (`FIXED → resize → FILL/HUG`) applied to an ALREADY settled, previously assembled frame (e.g. in a separate follow-up `use_figma` call, after the first assembly had time to settle) goes through cleanly — the trap fires specifically on a freshly created node within ONE script.
**Pattern:** don't force a resize recompute (see the neighbouring rule `fill-sizing-set-before-layoutmode-switch-resolves-against-stale-axis`) on a frame created and populated with children in the same script — either split into two separate `use_figma` calls (assemble → let it settle → fix if needed in a separate call), or don't touch `resize` for the new frame at all and set `layoutSizingHorizontal`/`Vertical` once, in the already-correct layout context, without an intermediate forced-recompute cycle.
```js
// ❌ WRONG — resize() on a freshly created, not-yet-settled frame in the same script
const stack = parent.appendChild(figma.createAutoLayout());
stack.appendChild(textLine1);
stack.appendChild(textLine2);
stack.resize(100, stack.height);   // corrupts the sizing of textLine1/textLine2 in this same call

// ✅ RIGHT — either don't resize the fresh frame at all, or move the fix to a separate use_figma call
const stack = parent.appendChild(figma.createAutoLayout());
stack.appendChild(textLine1);
stack.appendChild(textLine2);
// … the use_figma call ends here; the frame is given time to settle …
// in the NEXT call, if a recompute is still needed — the resize technique is safe now
```

### hug-sizing-readback-on-text-child-may-report-fixed-despite-correct-geometry

**Principle:** After setting `layoutSizingVertical = 'HUG'` following an already-set `layoutSizingHorizontal = 'HUG'` in the same call on a TEXT node inside a `HORIZONTAL` auto-layout parent, a repeat read of the node in the same script may show `layoutSizingHorizontal: 'FIXED'` — although the actual geometry (real width, position) is correct and matches the expected HUG result. This is a readback artefact, not a discrepancy in the geometry itself.
**Symptom:** a property read right after the mutation shows `layoutSizingHorizontal: 'FIXED'` where the script has just explicitly set `'HUG'`, and it looks like a write bug — but measuring the node's real `x`/`width` (not the property flag itself) shows an exact match with the content width, precisely what a real HUG would give. For a static screenshot deliverable (not a live component that must reflow on future text edits) this has no visible/functional effect.
**Pattern:** don't trust a single post-mutation read of a `layoutSizing*` property as the source of truth about whether the mutation worked — check against the node's actual `width`/`x` geometry (what is really visible on screen), not only the echo of the property flag. If the node is part of a live component that must grow for future longer text rather than a static export, this readback anomaly is still worth re-checking in a separate fresh `use_figma` call (not the same session as the mutation) — it's possible the real `layoutSizingHorizontal` in the file did settle as `FIXED` at the current content width and won't grow automatically.
```js
node.layoutSizingHorizontal = 'HUG';
node.layoutSizingVertical = 'HUG';
// the next read in this same script may show layoutSizingHorizontal: 'FIXED' —
// check the fact, not the flag: node.width must equal the content width, node.x must sit at the row's right edge
```

### fill-width-text-created-invisible-freezes-at-zero-instances-inherit-master-fix

**Principle:** A TEXT node created inside a `VERTICAL` auto-layout parent with `layoutSizingHorizontal = 'FILL'` but left `visible = false` from creation (the typical pattern for an optional sub-text driven by a boolean component property — `Has Sub` / `Has Caption` etc.) may never get a real FILL width — `.width` stays `0` even after the node is later switched to `visible = true` on a specific instance via `componentPropertyReferences`. Assigning `layoutSizingHorizontal = 'FILL'` to an invisible node apparently doesn't trigger the same layout recompute as for a visible one — related to the already-described `createautolayout-default-size-hug-collapse` (there HUG doesn't recompute height after `appendChild`), but here the trap is not in HUG but in FILL, and not in height but in width.

**Symptom:** on the finished render the optional sub-text shows only the first and last character on separate lines (e.g. `«clarifying details»` renders as `«` on one line and `»` on the next) — the rest of the characters are clipped/lost by line-wrapping inside zero width. A structural read of the node confirms: `width: 0`, `textAutoResize: 'NONE'`, `layoutSizingHorizontal: 'FILL'` — i.e. the prop is set right but the geometry doesn't resolve. `HUG` sizing of the same kind (e.g. a neighbouring chip with `layoutSizingHorizontal: 'HUG'`), created the same way and also invisible at creation, does NOT suffer this bug — HUG recomputes from the content bottom-up regardless of visibility, unlike FILL, which depends on the parent's live context at assignment time.

**Pattern:** for a TEXT node with optional visibility that needs the parent's full width, don't rely on `layoutSizingHorizontal = 'FILL'` set while the node is still `visible: false`. Instead — temporarily make the node visible, set an explicit `FIXED` width equal to the known container width and `textAutoResize = 'HEIGHT'` (matching the general `figma-use` skill recommendation for wrapping text — don't rely on FILL alone), then return `visible = false` as the component default. A fix on the MASTER component automatically reaches already-existing instances where this property was not overridden at instance level (in that case `setProperties` touched only `characters`/`visible` via `componentPropertyReferences`, not the geometry — the geometry remained a clean, un-overridden mirror of the master).

```js
// ❌ WRONG — FILL set while the node is invisible; the width sticks at 0
const sub = figma.createText();
sub.layoutSizingHorizontal = 'FILL'; // resolves to 0 because sub.visible is still false
body.appendChild(sub);
sub.visible = false; // component default — the sub-text is hidden while Has Sub=false

// ✅ RIGHT — make visible, set an explicit FIXED container width, textAutoResize=HEIGHT, return to invisible
sub.visible = true;
sub.textAutoResize = 'HEIGHT';
sub.resize(body.width, sub.height); // an explicit FIXED width instead of FILL
sub.layoutSizingHorizontal = 'FIXED';
sub.characters = '';
sub.visible = false; // the default is restored, but the geometry is already right

// Check: already-created instances with Has Sub=true pick up the fix automatically —
// no need to walk every instance separately if the geometry wasn't overridden there.
```

### fixed-sidebar-vs-hug-content-row-leaves-asymmetric-fill-gap

**Principle:** A `HORIZONTAL` auto-layout row with two columns — one of `FIXED` height (a sidebar, canonically 960 px), the other of variable content height (`Main Content`, hug) — the row itself (`counterAxisSizingMode: 'AUTO'`) hugs to the TALLER of the two columns, but that does NOT stretch the shorter column to the row's height: `layoutSizingVertical` on a child `INSTANCE`/`FRAME` doesn't give `FILL` without an explicit setting, and attempting `FILL` for a HORIZONTAL parent requires an explicit `counterAxisAlignItems` / per-child stretch that isn't there by default. Result — the short column stays at its own hug/fixed height, and in the gap between its bottom edge and the row's edge a foreign background (page/canvas) shows, not the short column's background.
**Symptom:** the same "shell + variable content" pair gives DIFFERENT symptoms depending on which column is taller in a specific frame — if the content is taller than the sidebar (960), a grey gap remains under the sidebar; if the sidebar is taller than the content (short content), the white `Main Content` background ends before the row's bottom edge and a foreign background shows there. Both are the same uncomputed asymmetry, just from different sides; fixing one direction (e.g. stretching the sidebar under a tall Overview) does NOT fix the other (a short Users tab).
**Pattern:** for each frame/state derived from a common shell (several tabs/cases with the same sidebar + content skeleton) — separately, not once on the first frame: read the final `bodyRow.height` AFTER all the frame's content is assembled, and explicitly `resize` the shorter of the two columns (sidebar OR Main Content, whichever is shorter in this frame) to that height. This is a step AFTER filling the content, not part of the skeleton — the content height is known only at the end of assembling the specific frame.
```js
const bodyRow = await figma.getNodeByIdAsync(bodyRowId);
const sidebar = await figma.getNodeByIdAsync(sidebarId);
const mainContent = await figma.getNodeByIdAsync(mainContentId);
const target = bodyRow.height; // the row has already hugged to the taller column
if (sidebar.height < target) sidebar.resize(sidebar.width, target);
if (mainContent.height < target) mainContent.resize(mainContent.width, target); // symmetric check — not only the sidebar
```

### inserting-siblings-into-fill-anchored-row-breaks-implicit-spacer

**Principle:** A row of two children where the first is `layoutSizingHorizontal: 'FILL'` (e.g. a title) and the second `HUG` (e.g. a button group) is a common way to press the second child to the right edge WITHOUT an explicit `primaryAxisAlignItems: 'SPACE_BETWEEN'`: the first child eats all free space; the second simply ends up after it. This works only while the row holds EXACTLY those two children. Inserting new siblings BETWEEN the FILL element and the one it was pushing (e.g. a badge and a toggle between the title and the button group) doesn't break the script — the FILL element is still the only one eating free space — but visually creates an empty gap BETWEEN the FILL element's real content (e.g. the title text) and the next sibling, because FILL considers itself the owner of all unoccupied width of the row, not just the space up to the nearest neighbour.
**Symptom:** after inserting new siblings between the historical FILL element and what used to be its only neighbour — a visible gap where there was none before (with two children); the FILL element and its immediate neighbour still look "butted" structurally (`appendChild`/`insertChild` ran without errors; `x`/`width` read correctly); the bug is purely visual and not caught by a structural check (`get_metadata` shows a valid row without collisions).
**Pattern:** before inserting a new sibling into an EXISTING auto-layout row — check which of the current children has `layoutSizingHorizontal: 'FILL'`, and ask why: if it's an implicit spacer (FILL is used not because the content needs the full width but to push the next neighbour to the edge) — on insertion between them that role must either move onto a new dedicated spacer node, or the whole row must be rebuilt as a pair of groups (`[title-group]` HUG + `[actions-group]` HUG) with `primaryAxisAlignItems: 'SPACE_BETWEEN'` on the parent — which is usually the more faithful analogue of the real markup anyway (see `screen-from-code.md`). Don't leave the historical FILL as is just because the script throws no error.
```js
// ❌ there were 2 children (title FILL + actions HUG) — worked as an implicit spacer
// now 4 (title FILL + badge + toggle + actions) — title still eats the extra space,
// but now BEFORE badge, not before actions — a visible gap between the title text and badge
row.insertChild(1, badge);   // between the FILL title and the HUG actions
row.insertChild(2, toggle);

// ✅ title switches to HUG (+ max-width/truncation if the code sets it),
// title+badge+toggle are grouped into a separate HUG sub-row, actions stays separate,
// SPACE_BETWEEN — on the parent row, not FILL — on title
title.layoutSizingHorizontal = 'HUG';
const leftGroup = figma.createAutoLayout('HORIZONTAL', { itemSpacing: 12 });
[title, badge, toggle].forEach(n => leftGroup.appendChild(n));
row.appendChild(leftGroup); row.appendChild(actionsGroup);
row.primaryAxisAlignItems = 'SPACE_BETWEEN';
```

### single-fill-child-in-horizontal-row-greedily-takes-full-width
**Principle:** A single `layoutSizingHorizontal: 'FILL'` child in a HORIZONTAL auto-layout takes 100% of the parent's available width (minus padding), not "its share", if the siblings that usually share the space are absent at that moment — relevant for "unpaired"/single slots in constructions that usually have 2+ FILL children, but the specific instance holds only one.
**Symptom:** a node that should take half the row (e.g. one column of two, the second deliberately empty) stretches across the whole row after switching to `FILL`, eating the space of the empty neighbouring slot.
**Pattern:** for a deliberately "incomplete" row (the neighbouring slot stays empty, not stretched) — keep that single child `FIXED` at an explicit width (e.g. half the usual row), not `FILL`, even if by the file's general rule similar elements in OTHER (full) rows should be `FILL`.

### absolute-overlay-zorder-and-stale-geometry-after-resize
**Principle:** An absolutely positioned overlay sibling (`layoutPositioning: 'ABSOLUTE'`) inside an auto-layout container renders in z-order according to its position in `children` — if it comes AFTER label/value in the children list and carries an opaque fill, it is drawn OVER them, fully covering the text, rather than serving as a background under them. Separately, its own `x`/`y`/`width`/`height` are static numbers pinned to the container's specific geometry at creation time; a later change of the container's size (a cell orientation change, a row height reduction) doesn't recompute them.
**Symptom:** an overlay intended as a background backing (hover tint) kills the text's visibility at `visible=true`; the same or a neighbouring overlay instance (a button icon) sticks out of the container or runs onto neighbouring content after the parent's size changes, although nobody touched it directly.
**Pattern:** for a background overlay — keep it FIRST in children (`parent.insertChild(0, overlay)`), don't add via `appendChild` (puts it last). After any size change of a container carrying absolute overlays — explicitly recompute/re-set their `x`/`y`/`width`/`height` relative to the new geometry; don't rely on them "adapting by themselves".
```js
// the background — first, so it doesn't cover the content
container.insertChild(0, hoverTint);
hoverTint.resize(container.width, container.height); // recompute to the current size; don't leave the old value
```

### resize-on-component-set-scales-its-variants
**Principle:** `componentSet.resize(w, h)` is not "fit the set's frame" but **scaling the content**: the variants inside a COMPONENT_SET sit on `SCALE/SCALE` constraints, so resizing the frame itself proportionally recomputes the sizes and positions of ALL variants and their children — independently on X and Y, i.e. with distortion of proportions if the new aspect ratio differs from the old. The set's frame can be grown/shrunk only via `resizeWithoutConstraints(w, h)` — it changes the frame without touching the children.
**Symptom:** after reorganising a grid of variants (rearranging by columns and then "fitting the frame") all variants turn out not the size explicitly given to them a line earlier. The numbers look "almost right", so the error easily slips by: 16 variants, each explicitly `resize(20, 20)`, after `set.resize(128, 128)` on a set frame 181 wide and 260 tall all became `14x10` (181→128 gives ×0.707, 260→128 gives ×0.492 — exactly those factors are visible in 20×0.707≈14 and 20×0.492≈10). The screenshot shows "flat pills" instead of square boxes, but since the glyphs inside scaled by the same factor the picture looks just "small and skewed", not obviously broken.
**Pattern:** first place the variants on the needed grid (`v.x`/`v.y`), then give them their final sizes one by one, and only then — if needed — stretch the set's frame via `resizeWithoutConstraints`. Never call `resize` on a COMPONENT_SET. A reverse check is mandatory: re-read the sizes of all variants AFTER changing the frame, not before.
```js
// ❌ WRONG — scales all variants and their children
set.resize(152, 152);

// ✅ RIGHT — changes only the set's frame
set.resizeWithoutConstraints(152, 152);
// and then make sure the variants didn't move:
// return set.children.map(v => Math.round(v.width) + 'x' + Math.round(v.height));
```
A separate consequence: the set's frame **doesn't hug** its content by itself. If variants are moved beyond its bounds, they are visually clipped (simply absent from the screenshot) while structurally in place — don't diagnose this as "the variants weren't created". Also leave an 8–12 px inset: variants with a focus ring / hover shadow have visual bounds wider than their own bbox, and at a zero frame margin they get cut off.

### binding-itemspacing-on-space-between-frame-kills-the-auto-affordance
**Principle:** On an auto-layout frame with `primaryAxisAlignItems === 'SPACE_BETWEEN'` the gap field in the UI shows `Auto`, while `itemSpacing` stores some number the render ignores. If a variable is bound to `itemSpacing`, `SPACE_BETWEEN` **doesn't break** and the layout doesn't move — but the panel shows a variable chip instead of `Auto`, and the first touch of the field switches the frame to a fixed gap. So a mass "bind all spacings to tokens" pass silently plants a mine under every space-between frame in the file.
**Symptom:** the user reports that "Auto is lost", although before/after screenshots are identical and `primaryAxisAlignItems` is still `SPACE_BETWEEN`. Checking the children's coordinates confirms the layout is intact (the right child sits at the right edge) — the discrepancy is only in what the panel shows. Easy to take for a false alarm and not fix.
**Pattern:** in any walk that binds `itemSpacing`, exclude `primaryAxisAlignItems === 'SPACE_BETWEEN'` (and `SPACE_BETWEEN` on the counter axis too if the frame wraps). Unbind what's already bound via `setBoundVariable('itemSpacing', null)` — the numeric value stays, but it's ignored anyway. Binding padding on such frames is fine; the restriction is only on the gap.
```js
const spaceBetween = n => n.primaryAxisAlignItems === 'SPACE_BETWEEN';
// bind the gap only where it really takes part in the layout
if (f === 'itemSpacing' && spaceBetween(n)) continue;
```

### vectorpaths-node-box-normalizes-to-path-bbox
**Principle:** A node's `vectorPaths` don't position it at `(0, 0)` — Figma normalises the node's box to the path's bounding box, so `x`/`y` come out equal to the bbox minimum, not zero. If the node must be planted at a specific origin, either author the path with that bbox minimum already baked in, or — when overwriting `vectorPaths` on an existing vector — delete the node and create a fresh one rather than reusing it (the stale box otherwise persists).
**Symptom:** a vector authored "from (0,0)" sits offset inside its parent by exactly the path's minimum x/y; re-assigning `vectorPaths` on the same node keeps the old box.

### createframe-default-clipscontent-true-clips-child-shadows
_Core: full text — `../SKILL.md`._

### shadow-extent-vs-clipping-ancestors-scan
**Principle:** A shadow is clipped by the *first* ancestor whose `clipsContent` is `true` and whose box is smaller than the child's box plus the shadow's reach — `|offset| + radius + spread` on each side. Reading the shadowed node, or the screen root, shows nothing wrong; the cut is decided by an intermediate wrapper. So before hand-off compute the reach for every node carrying a `DROP_SHADOW` and compare it with every clipping ancestor up to the top-level frame.
**Symptom:** shadows that end in straight lines at invisible edges; a "phantom" rectangle around a card; identical cards clipped differently depending on which row they sit in.
**Pattern:** walk the subtree, collect shadowed nodes, walk each one's parent chain with `absoluteBoundingBox`, and report every clipping ancestor that cuts the reach, not only the first. A first-only scan hides the next level: lift the clip on the cells and the rows start cutting, lift the rows and the blocks do, so one fix takes as many runs as there are wrapper levels. Exclude the screen root when the clip at the device edge is intended. After lifting clips, rerun the overflow check: a wrapper that clipped may also have hidden a child wider than itself.
```js
const CONT = new Set(['FRAME','COMPONENT','INSTANCE','GROUP','SECTION','BOOLEAN_OPERATION']);
const reach = n => (n.effects || []).filter(e => e.type === 'DROP_SHADOW' && e.visible !== false)
  .reduce((m, e) => Math.max(m, Math.abs(e.offset.x) + e.radius + (e.spread || 0), Math.abs(e.offset.y) + e.radius + (e.spread || 0)), 0);
const findings = [];
const walk = (n, rootId) => {
  const r = 'effects' in n ? reach(n) : 0;
  if (r > 0 && n.absoluteBoundingBox) {
    const b = n.absoluteBoundingBox;
    for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) {
      if (p.id === rootId) break;                       // clip at the device edge is intended — drop this line to include the root
      if (!('clipsContent' in p) || !p.clipsContent || !p.absoluteBoundingBox) continue;
      const pb = p.absoluteBoundingBox;
      const cut = b.x - r < pb.x || b.y - r < pb.y || b.x + b.width + r > pb.x + pb.width || b.y + b.height + r > pb.y + pb.height;
      if (cut) findings.push({ node: n.id, name: n.name, reach: r, clippedBy: p.id, clipper: p.name }); // no break: every level that cuts
    }
  }
  if (CONT.has(n.type)) for (const c of n.children) walk(c, rootId);
};
const root = await figma.getNodeByIdAsync('SCREEN_ROOT_ID'); walk(root, root.id);
return findings; // [] means hand-off; otherwise set clipsContent=false on every `clippedBy` in one pass, or shrink the shadow
```

### ellipse-arcdata-inner-radius-zero-renders-a-pie-sector
**Principle:** `arcData` on an ELLIPSE with `innerRadius: 0` is a pie sector whatever the stroke: the stroke follows the sector's outline, both radii included, so a thick stroke never turns a sector into a progress arc. A ring segment is `innerRadius = 1 - thickness / radius` with a fill and no strokes; the track behind it is the same shape with `startingAngle: 0, endingAngle: 2π`.
**Symptom:** a progress ring renders as a wedge toward the centre while the full-circle track behind it looks right — a closed circle hides the radii.
**Pattern:** build track and progress with the same `innerRadius`, fills bound to variables, `strokes = []`; read `arcData` back in the same call and check `innerRadius > 0`.
```js
const inner = 1 - thickness / (size / 2);
track.arcData = { startingAngle: 0, endingAngle: Math.PI * 2, innerRadius: inner };
arc.arcData = { startingAngle: -Math.PI / 2, endingAngle: -Math.PI / 2 + Math.PI * 2 * pct, innerRadius: inner };
track.strokes = []; arc.strokes = [];
return { arc: arc.arcData }; // innerRadius must be > 0
```
