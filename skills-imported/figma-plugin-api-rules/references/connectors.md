---
name: figma-plugin-api-rules/connectors
description: Read for any work with CONNECTOR nodes (Design and FigJam) — creation, endpoints, magnets, anchoring inside a SECTION, bbox corruption
---

# connectors — use_figma rules

### connector-text-characters-resets-fontsize
**Principle:** Assigning `text.characters` on a CONNECTOR resets the label's `fontSize` to the default 16, so the order is strict: `loadFontAsync` → `text.fontName` → `text.characters` → and only then `text.fontSize`.
**Symptom:** the connector's label renders at size 16 instead of the set one.
```js
await figma.loadFontAsync({family:'Inter', style:'Medium'});
c.text.fontName  = {family:'Inter', style:'Medium'};
// ❌ c.text.fontSize = 12; c.text.characters = '...';  // characters overwrites the size to 16
c.text.characters = 'tap «...»';   // sets the default fontSize 16
c.text.fontSize   = 12;            // ✅ AFTER characters
```

### connector-zindex-above-blocks
**Principle:** CONNECTOR nodes created after the blocks (SHAPE_WITH_TEXT/FRAME/RECTANGLE) end up above them in z-order in `page.children` and visually cut the blocks with arrows — after all additions, push all CONNECTORs to the bottom of the z-stack with a loop `figma.currentPage.insertChild(i, connectors[i])` from 0 (the mutual order is preserved).
**Symptom:** arrows are visible over the blocks' fills and text.
```js
// ✅ all CONNECTORs → z-index 0..N-1; the mutual order is preserved
const connectors = [...figma.currentPage.children].filter(n => n.type === 'CONNECTOR');
for (let i = 0; i < connectors.length; i++) {
  figma.currentPage.insertChild(i, connectors[i]);
}
// Result: connectors 0..N-1, everything else (blocks, images, stickies) above
```

### createconnector-blocked-pasted-connector-editable
**Principle:** The Connector ban in Design files concerns only programmatic creation via `figma.createConnector` — a manually pasted (Cmd+V) CONNECTOR node is fully readable/clonable/editable via the API, but doesn't support findOne/findAll, its sub-elements aren't addressable by IDs from the metadata (edit only via `connector.text.characters` / `.strokes` / `.strokeWeight`), and `connectorLineType:'ELBOWED'` routes the first segment along the start point's axis and may land on foreign content.
**Symptom:** an ELBOWED arrow and its text label (drawn at the path's midpoint) land over foreign text at the start point's height, wherever the end points.
**Pattern:** `connector.connectorLineType = 'STRAIGHT'` — a straight line between two points, without autonomous routing; if `endpointNodeId` points at the PAGE, both ends move freely via `position`.
```js
// ❌ ELBOWED — the first segment runs along the start point's Y; may land on foreign text
arrow.connectorLineType = 'ELBOWED'; // the default of a copied arrow
arrow.connectorStart = { endpointNodeId: page.id, position: { x: 3002, y: 778 } };
arrow.connectorEnd   = { endpointNodeId: page.id, position: { x: 3270, y: 920 } };
// the line and the label cross the neighbouring frame's text at y≈778

// ✅ STRAIGHT — a straight diagonal; the behaviour is entirely in the agent's hands
arrow.connectorLineType = 'STRAIGHT';
// the same coordinates now give a predictable straight line past the neighbouring content
```

### connectorend-verify-against-target-bbox
**Principle:** `connectorLineType:'STRAIGHT'` is safe exactly as far as the points themselves are meaningful — `connectorStart/End.position` must be checked arithmetically against the target node's bounding box (a point inside / at the boundary of `target.x/y/width/height`, with a clearance of ≥30–40 px from foreign content), not picked by eye.
**Symptom:** the arrow technically crosses nothing, but its tip pokes into empty space ~200 px from the target frame ("leads nowhere").
**Pattern:** find the real target node by id, compute the point arithmetically from its bbox with clearance; don't pick by eye. (Separately, not about CONNECTORs: the GROUP/remove atomicity in a combined screenshot of several page-level nodes — see `group-for-combined-screenshot-empty-group-self-deletes` in `../mcp-and-environment.md`.)
```js
// ❌ STRAIGHT with an unchecked coordinate — crosses no text but points at nothing
arrow.connectorLineType = 'STRAIGHT';
arrow.connectorEnd = { endpointNodeId: page.id, position: { x: 3150, y: 1000 } };
// bulkFrame: x 3122–3418, y 600–806 → y=1000 is 194 px below the bottom edge, in the void

// ✅ the coordinate is explicitly tied arithmetically to the target node's boundary
const bulk = await figma.getNodeByIdAsync('BULK_FRAME_ID');
const endPoint = { x: bulk.x + bulk.width / 2, y: bulk.y + bulk.height + 40 }; // 40 px clearance under the frame
arrow.connectorEnd = { endpointNodeId: page.id, position: endPoint };
```

### connector-elbowed-magnet-bbox-corruption
**Principle:** An ELBOWED connector with both magnet endpoints on real nodes (and also ANY mix of a magnet end with a page-anchored position end, even on STRAIGHT) on a "busy" page deterministically gives a catastrophically wrong bounding box — the width inflates to thousands of px, and no combination of magnet sides or assignment order helps; only a "fake" elbow of two STRAIGHT segments with pure page-anchored raw positions on all ends is reliable.
**Symptom:** `connector.width` comes out 1000–5500 px instead of the expected ~300–400; `connector.x` drifts thousands of px from both attached nodes.
**Pattern:** two STRAIGHT segments with a shared joint point (vertical + horizontal) give an L-shaped arrow; the trade-off — the coordinates are static; they don't re-attach when the nodes move (not a real magnet attachment).
```js
// ❌ ELBOWED + two magnet ends on a "busy" page — the bbox flies away
arrow.connectorLineType = 'ELBOWED';
arrow.connectorStart = { endpointNodeId: buttonNode.id, magnet: 'RIGHT' };
arrow.connectorEnd   = { endpointNodeId: dropdownNode.id, magnet: 'LEFT' };
// arrow.width may turn out 1000–5500 px instead of the expected ~300 px

// ❌ ALSO breaks — a mixed magnet + page position on one connector
arrow.connectorStart = { endpointNodeId: buttonNode.id, magnet: 'BOTTOM' };
arrow.connectorEnd   = { endpointNodeId: page.id, position: { x: 5503.5, y: 288.5 } };
// arrow.width also inflates by thousands of px

// ✅ THE WORKING WORKAROUND — a "fake" elbow of 2 separate STRAIGHT connectors;
// BOTH ends of EACH segment — pure page-anchored raw positions (no magnet at all)
const jointX = buttonNode.x + buttonNode.width / 2;
const jointY = dropdownNode.y + dropdownNode.height / 2;
const seg1 = template.clone(); page.appendChild(seg1);
seg1.connectorLineType = 'STRAIGHT';
seg1.connectorStart = { endpointNodeId: page.id, position: { x: jointX, y: buttonNode.y + buttonNode.height } };
seg1.connectorEnd   = { endpointNodeId: page.id, position: { x: jointX, y: jointY } };
const seg2 = template.clone(); page.appendChild(seg2);
seg2.connectorLineType = 'STRAIGHT';
seg2.connectorStart = { endpointNodeId: page.id, position: { x: jointX, y: jointY } };
seg2.connectorEnd   = { endpointNodeId: page.id, position: { x: dropdownNode.x, y: jointY } };
// A compact correct bbox on EACH segment; visually gives a right angle (an L-shaped arrow)
```

### section-appendchild-keeps-local-xy
**Principle:** `SECTION.appendChild(existingNode)` doesn't recompute the child's `.x`/`.y` — the old page-absolute number silently becomes local-to-section. The full fact and a code example for ordinary nodes (not CONNECTORs) — canonically in `section-node-children-use-section-relative-coordinates` in `../layout-and-geometry.md`; that's general SECTION geometry, not connector-specific.
**For CONNECTORs — a separate, narrower discipline, not "appendChild first, then page.id points".** Anchoring both ends on `endpointNodeId: page.id` AFTER `appendChild` into a section is NOT a working approach: the connector rolls back onto the PAGE and inflates the section's bbox even with the right order of operations. The verified working pattern is `connector-section-pageid-anchoring-rollback` below in this file (anchor both ends on `section.id` with section-local coordinates, not on `page.id`).

### connector-elbowed-magnet-plus-node-position
**Principle:** An ELBOWED connector with one `magnet` end and one `position` end works correctly if the `position` is given as an offset INSIDE a real node (`endpointNodeId: realNode.id`), and breaks the bbox if the `position` is tied to `page.id` (absolute canvas coordinates).
**Pattern:** for a real ELBOWED bend use the combination "a `position` relative to a real node + a `magnet` on another real node"; a `position` relative to `page.id` paired with a `magnet` — avoid.
```js
// ❌ breaks — the position is tied to the PAGE (absolute coordinates)
arrow.connectorStart = { endpointNodeId: buttonNode.id, magnet: 'BOTTOM' };
arrow.connectorEnd   = { endpointNodeId: page.id, position: { x: 5503.5, y: 288.5 } };

// ✅ works — the position is tied to a REAL NODE (an offset inside it), not to page.id
arrow.connectorLineType = 'ELBOWED';
arrow.connectorStart = { endpointNodeId: realButtonNode.id, position: { x: 48, y: 24 } }; // an offset inside buttonNode
arrow.connectorEnd   = { endpointNodeId: realTargetNode.id, magnet: 'LEFT' };
```

### connector-mixed-base-section-bbox-corruption
**Principle:** Mixed anchoring bases on a CONNECTOR child of a section (one end `endpointNodeId: section.id` with a section-relative position, the other `page.id` with page-absolute) inflate the section's effective bounding box (Figma doesn't translate the page-absolute coordinate into section-local when computing the bbox) and/or push the connector back onto the PAGE despite `appendChild` — both points must be on ONE coordinate base. **The only verified safe base is both points on `section.id` with section-relative coordinates**: anchoring both ends on `page.id` (even uniformly, without mixing) also rolls the connector back onto the PAGE — see `connector-section-pageid-anchoring-rollback` below; "page-absolute for both points" here isn't an alternative but a separate verified bug.
**Symptom:** `get_screenshot(sectionId)` returns `original_width/height` several times the section's real size; the content slides into a small corner of a giant empty canvas.
**Pattern:** both points — `section.id` with section-relative coordinates (recomputed via `section.absoluteTransform`), `section.appendChild(conn)` — as the FIRST step, coordinates — after (the same order as in `section-appendchild-keeps-local-xy` and `connector-section-pageid-anchoring-rollback`); when cloning an existing connector, read the bases of both ends of the original in advance and unify them; don't copy a mixed base. Diagnosis: `conn.parent.id === section.id` and `conn.x/y/width/height` — small numbers comparable to the section's size.
```js
// ❌ WRONG — a mixed base; the connector rolls onto the PAGE and/or inflates the section's bbox
conn.connectorStart = { endpointNodeId: section.id, position: { x: 1440, y: 686 } }; // section-relative
conn.connectorEnd   = { endpointNodeId: page.id,    position: { x: 7890, y: 1346 } }; // page-absolute
section.appendChild(conn);
// conn.parent may suddenly turn out to be page.id, or the section becomes 7895 px "wide"

// ✅ RIGHT — appendChild FIRST, both points section.id/section-relative — AFTER
section.appendChild(conn); // the parent is the section first
const sectionAbsX = section.absoluteTransform[0][2];
const sectionAbsY = section.absoluteTransform[1][2];
conn.connectorStart = { endpointNodeId: section.id, position: { x: 1440, y: 686 } };
conn.connectorEnd   = { endpointNodeId: section.id, position: { x: 7890 - sectionAbsX, y: 1346 - sectionAbsY } };
```

### createconnector-blocked-design-mode-clone-instead
**Principle:** `figma.createConnector` throws `TypeError: no such property 'createConnector'` in design mode regardless of whether connectors already exist on the page — a new CONNECTOR in a design file is created only by cloning an existing one (`existing.clone()`, then override `name`/`connectorStart`/`connectorEnd`/stroke properties; delete the template original AFTER cloning).
**Symptom:** `TypeError: no such property 'createConnector'` in a `/design/` file.
```js
// ❌ WRONG — fails even if connectors already exist on the page
const conn = figma.createConnector();

// ✅ RIGHT — clone an existing one (including one you're about to delete) and override the properties
const template = await figma.getNodeByIdAsync('<id of an existing connector of the needed style>');
const conn = template.clone();
section.appendChild(conn); // see the rule about a single anchoring base
conn.name = 'Arrow — new name';
conn.connectorStart = { endpointNodeId: section.id, position: {...} };
conn.connectorEnd = { endpointNodeId: section.id, position: {...} };
template.remove(); // delete the old original AFTER cloning, not before
```

### connector-reparents-to-nearest-common-ancestor-of-endpoints
**Principle:** After `section.appendChild(connector)`, assigning `connectorStart`/`connectorEnd` with magnet endpoints on two real nodes can silently re-parent the connector into the nearest common ancestor of those two endpoint nodes (e.g. a nested wrapper FRAME inside the section), rather than leaving it a child of the section it was explicitly added to — if both endpoints physically lie inside that deeper container.
**Symptom:** `connector.parent.id` after assigning connectorStart/End doesn't match what the explicit `appendChild` targeted — e.g. `section.id` was expected but the ID of a nested wrapper FRAME came out. The bbox/section dimensions stay correct (0 signs of corruption); only the parent is unexpected.
**Pattern:** don't rely on the parent right after appendChild as final — read `connector.parent.id` AFTER assigning connectorStart/End if further logic (e.g. loops over `section.children`) depends on where the connector really lies.
```js
const conn = template.clone();
section.appendChild(conn);           // parent = section (at this moment)
conn.connectorStart = { endpointNodeId: fieldInsideWrapper.id, magnet: 'RIGHT' };
conn.connectorEnd   = { endpointNodeId: dropdownAlsoInsideWrapper.id, magnet: 'LEFT' };
// conn.parent.id may now be wrapper.id, not section.id — both endpoints lie inside wrapper
```

### connector-magnet-endpoint-autodeleted-on-node-removal
**Principle:** A connector whose `connectorStart`/`connectorEnd` references via `endpointNodeId` (a magnet) a node inside a subtree that is then removed via `node.remove()` (e.g. when replacing a whole toolbar frame with a clone) — the connector itself **also vanishes** from the canvas along with the node, rather than staying with a dangling/broken end. Not found at once: the next `findAll`/`getNodeByIdAsync` by the saved connector id returns `null`, as if the node never existed.
**Symptom:** after replacing a frame (`oldToolbarRow.remove()` → inserting a clone of the new toolbar) a previously working connector leading from an icon/field INSIDE the old frame to a neighbouring explainer state (a Filters modal, an open dropdown) disappears entirely — `page.findAll(n => n.type==='CONNECTOR' && n.name===...)` returns 0 matches, although the connector wasn't removed explicitly.
**Pattern:** before removing/replacing any frame containing an element a magnet connector may be attached to (the Filters/Sort/Actions icons in a toolbar etc.) — first find all connectors referencing descendants of that frame (`page.findAll(n => n.type==='CONNECTOR')` + compare `connectorStart/End.endpointNodeId` with the ids inside the subtree), and either switch them to `position` anchoring on the section itself BEFORE the removal, or simply recreate the connector (`templateConnector.clone()` from any live donor connector of the same section) AFTER inserting the new frame — cheaper than guessing what exactly will be orphaned.

### connector-endpoint-reparent-also-deletes-connector
**Principle:** A sibling rule to `connector-magnet-endpoint-autodeleted-on-node-removal`, but with a DIFFERENT trigger — not `.remove()` of the endpoint node but an ordinary `parent.appendChild(endpointNode)` (moving the endpoint node to another parent; the node keeps existing). A connector whose `connectorStart`/`connectorEnd.endpointNodeId` points at such a node may **vanish entirely** after the reparent — not just visually break/drift, but stop resolving by its own id (`getNodeByIdAsync(connectorId)` → `null`; a `page.findAll(CONNECTOR)` walk doesn't find it at all).
**Symptom:** the endpoint node (e.g. a confirm modal) successfully moved to a new section and looks right; the previously working connector to it vanished without a trace — found neither by the saved id nor by a full walk of all the page's CONNECTORs.
**Pattern:** after ANY `appendChild`/reparent of a node that MAY be an endpoint of an existing connector (not only after a removal!) — explicitly compare `page.findAll(n => n.type === 'CONNECTOR')` for losses before and after the operation; don't rely on the connector surviving the reparent of its target node. It's cheaper to treat a connector as disposable with respect to any reparent of its endpoints and simply recreate it (`template.clone()` + new `connectorStart/End`) RIGHT AFTER the node's final placement, rather than trying to preserve the existing one through the operation.
_A single case — don't promote into the core SKILL.md without 1–2 more independent confirmations in different contexts._

### connector-section-pageid-anchoring-rollback
**Principle:** Even with the right order "`section.appendChild(connector)` first → the ends after", a connector with BOTH ends on `endpointNodeId: page.id` (a single base, not mixed) still rolls back from the section onto the PAGE right after `connectorStart/End` are assigned and inflates the section's effective bbox — anchor both ends on `section.id` with section-local coordinates (absolute minus `section.x/y`) and, if needed, repeat an idempotent `appendChild`.
**Symptom:** on the next call `connector.parent === page`, and `get_screenshot` of the section returns an `original_width` several times the real width with formally correct `section.width/height`.
**Pattern:** diagnosis: don't trust `section.width/height` (they stay formally correct) or the `parentId` from the same script's return — check in the NEXT separate call via `conn.parent` and via `get_screenshot(sectionId)`: `original_width/height` must match `section.width/height`.
```js
// ❌ WRONG — appendChild → connectorStart/End with page.id; the connector rolls onto the PAGE
const conn = template.clone();
section.appendChild(conn);
conn.connectorStart = { endpointNodeId: page.id, position: { x: 6970, y: 416 } };
conn.connectorEnd   = { endpointNodeId: page.id, position: { x: 7130, y: 233.5 } };
// conn.parent.id === page.id on the next read; get_screenshot(section.id) returns an inflated bbox

// ✅ RIGHT — a single anchoring base on the section itself; section-local coordinates
const conn = template.clone();
section.appendChild(conn);
conn.connectorStart = { endpointNodeId: section.id, position: { x: 1448, y: 340 } };  // local, not absolute
conn.connectorEnd   = { endpointNodeId: section.id, position: { x: 1608, y: 157.5 } };
// conn.parent.id === section.id stably; the section's bbox is correct
```

### connector-clone-arrowhead-inherits-donor-start-side-orientation

**Principle:** A cloned CONNECTOR inherits the donor's `connectorStartStrokeCap`/`connectorEndStrokeCap` as is — if the donor has the arrowhead on the START end (`connectorStartStrokeCap: 'ARROW_LINES'`, `connectorEndStrokeCap: 'NONE'`), that's not the typographic convention "end = where it points" but a literal property of that specific donor instance. Assigning `connectorStart = {endpointNodeId: fromNode...}` / `connectorEnd = {endpointNodeId: toNode...}` in the natural "from → to" order gives an arrow visually pointing BACK at `fromNode`, not forward at `toNode`.
**Symptom:** the connector is physically and geometrically correct (a normal bbox, both ends attached to the right nodes), but visually the arrow points in the direction OPPOSITE to the narrative — the reader sees "child ← parent" instead of the intended "child → parent". Easy to miss on a quick screenshot review, since the overall composition (two frames + a line between them) looks right.
**Pattern:** before the first use of a donor template in a session — read `donor.connectorStartStrokeCap`/`connectorEndStrokeCap` in ONE read call. If the start carries the arrow — either invert the logical assignment order (`connectorStart` = `toNode`, `connectorEnd` = `fromNode`), or (more reliably; doesn't confuse the "from/to" semantics in the rest of the code) explicitly re-set both caps on the clone right after cloning:
```js
const conn = donor.clone();
section.appendChild(conn);
conn.connectorStartStrokeCap = 'NONE';
conn.connectorEndStrokeCap = 'ARROW_LINES';   // the arrow is guaranteed on "to", not "from"
conn.connectorStart = { endpointNodeId: section.id, position: fromPoint };
conn.connectorEnd   = { endpointNodeId: section.id, position: toPoint };
```

### connector-position-anchor-rejects-deeply-nested-compound-instance
**Principle:** `connectorStart`/`connectorEnd` in `position` mode (not `magnet`) rejects an `endpointNodeId` pointing at a deeply nested compound-instance sub-node (an id of the form `I<a>;<b>;<c>`) — the error `Error: in set_connectorStart: Invalid endpointNodeId`, even though the same id resolves fine via `getNodeByIdAsync` (the node exists; it's just not allowed as an anchor). Donor connectors themselves anchor on the TOP-level instance/frame (e.g. `search + filters`, not the nested `select` inside it) — not by chance but a working API restriction.
**Symptom:** `set_connectorStart`/`set_connectorEnd` throws `Invalid endpointNodeId` when trying to anchor on a specific icon/sub-component deep inside an instance, although `getNodeByIdAsync(sameId)` in a separate read call returns a valid node without errors.
**Pattern:** anchor the `position` end on the nearest TOP-level (a direct child of the PAGE/SECTION, at most 1 level of instance wrapping) frame/instance, and pass the needed point inside it as `position: {x, y}` — coordinates computed by hand as the sum of the nested children's local offsets relative to that top-level node (not as a separate anchor).
```js
// ❌ ERROR — a deeply nested sub-instance as the endpoint
conn.connectorStart = { endpointNodeId: 'I7899:20954;1374:15656', position: { x: 241, y: 42 } };
// Error: in set_connectorStart: Invalid endpointNodeId

// ✅ RIGHT — an anchor on the top-level toolbar instance; the offset computed by hand (select.x=586 + icon.x=241 inside select = 827)
conn.connectorStart = { endpointNodeId: '7899:20954', position: { x: 827, y: 42 } };
```

### connector-elbowed-magnet-native-ui-clean-bbox
**Principle:** The bounding-box corruption of an ELBOWED connector with magnet endpoints on real nodes (the rule `connector-elbowed-magnet-bbox-corruption` above) is a COMPUTATION defect in the Plugin API on a "busy" page, not a property of ELBOWED+magnet connectors themselves. The same connector made/re-attached MANUALLY in Figma Desktop (drawn with the Connector tool, ends snapped to nodes with the mouse) gets a correct compact bbox — the native editor computes the geometry differently from the plugin.
**Symptom:** an audit scan finds on the page ELBOWED connectors with both magnet ends on real nodes AND a correct bbox (width/height in tens to hundreds of px, parent = the expected section) — although a programmatic recreation of the same ends via the API would give an inflated bbox. That's not a mockup bug but a sign that the connectors were made by hand, not by a script.
**Pattern:** the "fake elbow of 2 STRAIGHT segments" (the workaround in `connector-elbowed-magnet-bbox-corruption`) is needed ONLY when creating a connector via `use_figma`. If the goal is a real ELBOWED+magnet (re-attaches when nodes move) and manual assembly is acceptable — do it in Figma Desktop; the API workaround isn't needed and is worse (static coordinates, not a magnet). In an audit, do NOT "fix" hand-made ELBOWED+magnet connectors with a clean bbox toward the API pattern — they're correct.

### connector-reparent-appendchild-stale-bbox-inflates-screenshot
**Principle:** `parent.appendChild(connector)` is a real and logically valid operation (after it `connectorStart`/`connectorEnd` still resolve to the right nodes; the magnet anchoring doesn't break), but the connector's own cached `.x`/`.width`/`.height` are NOT recomputed automatically — they stay from the MOMENT BEFORE the reparent, even if both ends of the connector physically moved (e.g. both endpoint nodes were moved to a new SECTION together with the connector itself). Confirmed NOT on the first read right after the mutation (there it could be blamed on an ordinary stale read; see `use-figma-stale-reads-after-mutation` in the core), but on a REPEAT read in a SEPARATE next `use_figma` call — the state didn't "settle" by itself.
**Symptom:** `get_screenshot` of a section containing such a connector returns `original_width`/`original_height` several times larger than the declared `section.resizeWithoutConstraints(...)` (e.g. 10502×2047 instead of the explicitly set 4514×1809) — the screenshot itself looks like "an empty field with something small in the corner", because the render honestly includes the connector's huge stale bounding box (in one case: `x=-5987, width=10420` while both real endpoints lay inside the new section ~500 px apart). `get_metadata` / a direct read of the connector's `.x`/`.width` confirms the inflated numbers rather than exposing them as a visual artefact.
**Diagnosis:** if a screenshot of a section with connectors looks disproportionately large/empty — read `.x`/`.width` of each CONNECTOR child separately and compare with the real spread of its `connectorStart`/`connectorEnd` endpoint positions (via `getNodeByIdAsync` on `endpointNodeId` + `absoluteTransform`); an obvious mismatch (a bbox an order of magnitude larger than the distance between the endpoints) is that very stale-bbox-after-appendChild.
**Pattern (a workaround; a working recompute was NOT found):** if the relation the connector represents is still meaningful after the move — it's more reliable to recreate it (`donor.clone()` + `appendChild` + fresh `connectorStart`/`connectorEnd`) instead of moving the existing instance. If both ends of the connector move TO ONE new place together (the typical case — archiving a whole chunk of a flow at once) and the physical proximity of the elements after the move shows the relation by itself — it's simpler and safer to just `.remove()` the connector rather than try to keep it.

### detach-magnet-endpoint-before-deleting-target-anchor-to-section-not-page
**Principle:** Deleting a node that `connectorStart`/`connectorEnd` magnet-anchors to also deletes the connector in cascade (Figma leaves no "dangling" magnet end). To KEEP the connector when deleting its target — first detach exactly the side facing the node to be deleted, switching it from `{endpointNodeId: target.id, magnet: 'X'}` to `{endpointNodeId: <SECTION>.id, position: {x, y}}`, where `SECTION` is the container section the connector itself lies in (NOT `page.id` — anchoring on the PAGE is that very "page-anchored position end" that breaks the bbox per the rule `connector-elbowed-magnet-bbox-corruption` above). Anchoring on a SECTION (a bounded node, not the infinite canvas) recomputes the bbox correctly — checked on ELBOWED connectors with one magnet end (the untouched side) and one detached section-position end: the bbox before/after differed by units of px (a recompute of the arrowhead's drawing tolerance), not corruption by thousands of px.
**How to compute the `position` so the arrow doesn't "jump":** take `target.absoluteBoundingBox` (the target about to be deleted) and the magnet side of the current endpoint, compute the point on the box's boundary (`BOTTOM`→center-x/bottom-y, `TOP`→center-x/top-y, `LEFT`→left-x/center-y, `RIGHT`→right-x/center-y, otherwise the centre), then subtract `section.absoluteBoundingBox.{x,y}` — the result is a section-local `position` placing the detached end EXACTLY where it visually was a second ago.
```js
const sectionBB = section.absoluteBoundingBox;
function toLocal(bb, magnet) {
  let ax, ay;
  switch (magnet) {
    case 'BOTTOM': ax = bb.x + bb.width/2; ay = bb.y + bb.height; break;
    case 'TOP':    ax = bb.x + bb.width/2; ay = bb.y; break;
    case 'LEFT':   ax = bb.x; ay = bb.y + bb.height/2; break;
    case 'RIGHT':  ax = bb.x + bb.width; ay = bb.y + bb.height/2; break;
    default:       ax = bb.x + bb.width/2; ay = bb.y + bb.height/2;
  }
  return { x: ax - sectionBB.x, y: ay - sectionBB.y };
}
connector.connectorStart = { endpointNodeId: section.id, position: toLocal(target.absoluteBoundingBox, 'BOTTOM') };
target.remove(); // safe now — the connector survives the deletion
```
**Verification after:** compare `section.findAllWithCriteria({types:['CONNECTOR']}).length` before and after deleting the targets — the number must not change (not one connector should vanish in cascade).

### connector-bbox-growth-after-reattach-not-corruption
**Principle:** A continuation of the same case as `detach-magnet-endpoint-before-deleting-target-anchor-to-section-not-page` above — re-attaching the detached end to a NEW live node (`{endpointNodeId: newNode.id, magnet: 'X'}`) instead of the old deleted target can give a sharp bbox growth of the connector (e.g. 791×94 → 3500×725; another 4608×302) — at first glance resembling `connector-elbowed-magnet-bbox-corruption` (the same connector type, ELBOWED, both ends again magnet-on-a-real-node). **But this is NOT corruption.**
**Symptom:** a large bbox after a reattach/move by itself looks like a corruption signal, but the screenshot confirms a clean, meaningful ELBOWED routing around intermediate content. The reason for the bbox growth is trivial and geometrically honest: the target nodes physically moved far away (in this case — 6 new bottom sheets were laid out in a separate tidy row, 3500+ px farther from the original triggers than the old deleted screens stood).
**Pattern:** a large bbox after a reattach/move is not a corruption signal by itself; compare with `get_screenshot` (a clean ELBOWED route without chaotic loops = not a bug, just a long arrow) rather than relying on the bare bbox number.

### elbowed-position-anchor-does-not-reroute-use-multi-segment-straight-instead
**Principle:** `connectorLineType = 'ELBOWED'` applied to a connector with both ends on `endpointNodeId: <SECTION/PAGE>.id, position: {...}` (not on real magnet nodes) does NOT route around intermediate content — it renders as an ordinary straight diagonal between the same two points, as if the type never changed. This is consistent with the rule `createconnector-blocked-pasted-connector-editable` above ("ELBOWED routes the first segment along the start point's axis") — the same detour ELBOWED routing works only with the combination ELBOWED + both ends RE-ATTACHED to real nodes via `magnet`, and re-attaching to a magnet on a "busy" page carries its own risk of catastrophic bbox corruption (`connector-elbowed-magnet-bbox-corruption` above). When re-attaching to a magnet is undesirable (the corruption risk) and the connector must still bypass a specific intermediate frame — the reliable way: manually build an N-segment "bracket" detour of separate STRAIGHT connectors with uniform `endpointNodeId: section.id` points at every joint (the same pattern as the two-segment "fake elbow" in `connector-elbowed-magnet-bbox-corruption`, but with 2 joints / 3 segments instead of 1 / 2 — "up into a free lane → across → down into the target"), with an ARROW cap only on the last segment.
**Symptom:** after changing `connectorLineType` to `'ELBOWED'`, `get_screenshot` / `node.screenshot()` of that specific connector (not the whole section) still shows a flat diagonal without a single corner — the property reads as `'ELBOWED'` on a repeat read (so the assignment worked), but visually nothing changed.
**Pattern:**
```js
// ❌ does NOT work for position-anchored ends — the type changes, the route doesn't
conn.connectorLineType = 'ELBOWED';
// connectorStart/End remain { endpointNodeId: section.id, position: {...} } — the render doesn't change

// ✅ a 3-segment STRAIGHT detour through a free lane above/between content rows
const template = await figma.getNodeByIdAsync(WORKING_CONNECTOR_TEMPLATE_ID);
const old = await figma.getNodeByIdAsync(oldConnectorId);
old.remove();
const points = [
  { x: fromX, y: fromY },     // the origin point on the source frame
  { x: fromX, y: clearY },    // up into a lane free of ANY frame of the row across the whole route width
  { x: toX,   y: clearY },    // across at the safe height
  { x: toX,   y: toY },       // down into the target frame
];
for (let i = 0; i < 3; i++) {
  const seg = template.clone();
  section.appendChild(seg);          // BEFORE setting connectorStart/End
  seg.connectorLineType = 'STRAIGHT';
  seg.connectorStartStrokeCap = 'NONE';
  seg.connectorEndStrokeCap = (i === 2) ? 'ARROW_LINES' : 'NONE'; // the arrow only on the last segment
  seg.connectorStart = { endpointNodeId: section.id, position: points[i] };
  seg.connectorEnd   = { endpointNodeId: section.id, position: points[i + 1] };
}
```
Each segment's bbox stays compact (width/height within that segment's coordinate delta, without corruption — no end is a magnet; the risk from `connector-elbowed-magnet-bbox-corruption` doesn't apply here). Check `get_screenshot(sectionId)` as a whole after assembly — the route must visually bypass the intermediate frame, crossing its bbox at no point.
