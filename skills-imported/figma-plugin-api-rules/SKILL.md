---
name: figma-plugin-api-rules
description: MANDATORY prerequisite before any programmatic Figma write — use_figma, create_new_file, Plugin API scripts. Field-tested pitfalls and patterns for the Figma Plugin API — nodes, auto-layout, components and variants, instances, text and fonts, variables and modes, connectors, annotations, FigJam, and the MCP tool layer — plus verification recipes so silent failures get caught. Load it in addition to your tool's own instructions for calling the Figma API (figma-use or its MCP-resource equivalent); it complements them, never replaces them. Do not load for tasks that don't touch Figma.
---
> Adapted for Muse from [schudarin/chudarin-design-skills](https://github.com/schudarin/chudarin-design-skills) (MIT) — plain-markdown portable unit. Claude Code-isms neutralized; any Figma MCP / write steps are kept as read-only reference knowledge.


# Figma Plugin API Rules

Accumulated, field-tested knowledge of the Figma Plugin API as driven through an agent (`use_figma`-style calls). Every entry is a real case that broke exactly this way, written up as Principle / Symptom / Pattern — not a reading of the docs. Core principle: **the MCP plugin sandbox is not your desktop Figma** — fonts, library resolution, page context and multi-property writes behave differently, and many failures are *silent*.

**Required companion:** your tool's own instructions for calling the Figma API must be loaded before the first call — in Claude Code that is the `figma-use` plugin skill; in other agents load the MCP resource `skill://figma/figma-use/SKILL.md`. This pack adds to that; it does not replace it. For repairing detached or missing variable bindings, also load `figma-fix-variable-bindings`. If a required skill is missing or needs a restart, say so before starting rather than guessing tooling.

## Hard rules

1. **Your tool's Figma API instructions load before the first call — always.** This pack complements them.
2. **Inspect before you mutate.** Read `componentPropertyDefinitions`, `children`, and bounding boxes *before* writing.
3. **Verify every ID that came from a prompt or a past session** with one read-only call before the first write (see `verify-variable-ids-before-write` below). Passed-in IDs are routinely off-by-N or point at a sibling.
4. **Load the topic file before the first write that uses its API — match on the code you are about to send, not on a guess about the "topic".** If the next `use_figma` script contains any of these identifiers, read the file first:
 - `swapComponent` · `setProperties` · `detachInstance` · `createInstance` · `getMainComponentAsync` · `componentProperties` → `references/instances.md`
 - `combineAsVariants` · `addComponentProperty` · `deleteComponentProperty` · `componentPropertyDefinitions` · `componentPropertyReferences` → `references/components-and-variants.md`
 - `setBoundVariable` · `setBoundVariableForPaint` · `addMode` · `setValueForMode` · `resolveForConsumer` → `references/variables-and-tokens.md`
 - `characters =` · `loadFontAsync` · `textStyleId` · `textAutoResize` · `textTruncation` → `references/text-and-styles.md`
 - `layoutMode` · `layoutSizing*` · `primaryAxisSizingMode` · `resize(` · `insertChild` · `clone` · `arcData` → `references/layout-and-geometry.md`
 - `connectorStart` · `connectorEnd` → `references/connectors.md` · `annotations` → `references/annotations.md`
 - `setReactionsAsync` · `reactions` · `overlay*` → `references/prototyping.md`
 - `get_metadata` on a page · `findAll` over a page · `exportAsync` · `get_screenshot` for verification → `references/mcp-and-environment.md`
 One read per file per session is enough. Skipping it is how a session re-discovers a documented rule the hard way: a run that never opened `instances.md` hits `swapComponent` returning `void`, a stale child id after `setProperties`, and a hidden instance child that reads as "unreachable" — all three are in that file.
5. **Prologue for any write batch:** `await figma.setCurrentPageAsync(page)` before the first mutation, and load every font the batch touches. Both are easy to forget and both fail opaquely mid-batch — a wrong-page mutation or an unloaded-font write doesn't say so, it just throws.
6. **Atomic operations — never leave a node half-applied.** For multi-property rebinds, apply so that if part fails the rest is not left changed. Verify the whole set landed before moving on.
7. **Read the result back inside the same call.** Return `{createdNodeIds, mutatedNodeIds, before, after}`, resolving variable ids to **names** in `before`/`after`. A raw variable id tells you nothing when checking; a name lets you spot a wrong binding on sight. Many failures are silent: library-swatch bindings, `cornerRadius` bindings, layout sizing — read back, don't assume.
8. **A thrown error rolls back the whole `use_figma` call.** Mutations that ran before the failing line are undone with it — even the ones that "visibly applied" in the same script. After any error: re-read the state before re-applying; put a risky operation (an untested API, a nested-instance write) in its own call or a `try/catch` so it can't erase the work next to it.
9. **The sandbox hides invisible instance children by default.** `figma.skipInvisibleInstanceChildren` is `true` here (the documented Plugin API default is `false`): hidden descendants of an INSTANCE are missing from `children`/`findAll`, and a hidden INSTANCE reads `children: []`. To reach a hidden node (e.g. a `Reset` button hidden in the master), set `figma.skipInvisibleInstanceChildren = false` as the first line of the script — don't conclude the node is unreachable and redesign the master around it.
10. **Any text that leaves for Figma is a publication.** Before writing a component `description`, a Dev Mode annotation, a node/page/section name or a TEXT layer, check `references/publishing-hygiene.md`: no dates, no people's names, no internal code names, no paths to internal docs, no phase/version/task numbers, no `SANDBOX`/`WIP`/`TODO`. After transferring anything by clone, sweep the subtree.
11. **New insight → into the pack immediately**, per the protocol at the end. Don't defer it.

## Universal principles

### node-query-no-spaces-in-names
**Principle:** `node.query` does not match node names that contain spaces, and its selector language has no escape syntax — `query('FRAME[name=Title\\ Block]')` throws `Invalid selector: unexpected character '\'`. Find such nodes with `findOne(n => n.name === '…')` and exact string comparison.
**Symptom:** a query by a name with a space returns empty although the node exists.

### page-ids-unstable-refind-by-name
**Principle:** Page IDs are unstable even within one call — never cache a page id; re-find the page by name: `figma.root.children.find(p => p.name === '…')`.

### createframe-default-white-fill
**Principle:** `createFrame` and `createAutoLayout` create a frame with a white `#ffffff` fill by default — set `frame.fills = []` on structural containers right after creation.
**Symptom:** invisible white slabs behind every structural container.

### createframe-default-clipscontent-true-clips-child-shadows
**Principle:** `createFrame` and `createAutoLayout` create a frame with `clipsContent: true` by default — so every structural wrapper (a section, a row, a grid cell, a header) silently clips the drop shadows, outside strokes and blur halos of its children at its own edge. The visible cut lands on the *child*, several levels below the frame that causes it, so it reads as a shadow bug rather than a container default. Set `clipsContent = false` on structural containers right after creation, in the same breath as `fills = []`; leave `true` only on the screen root and on deliberate masks.
**Symptom:** card shadows end in a hard rectangle at the edge of an invisible row or section; the effect looks correct on the node itself and on the screen root, and a metadata read shows no node at the cut line.
**Pattern:** a `wrap()` helper that creates, clears the fill and lifts the clip in one place; before hand-off, a scan of every node with a `DROP_SHADOW` against its clipping ancestors — recipe in `references/layout-and-geometry.md`, `shadow-extent-vs-clipping-ancestors-scan`.
```js
const wrap = (dir, props) => { const f = figma.createAutoLayout(dir, props); f.fills = []; f.clipsContent = false; return f; };
```

### appendchild-returns-void
**Principle:** `parent.appendChild(child)` returns `void` (`null` at runtime), not `child` — you cannot chain `appendChild(...).prop = value`; keep the node in a variable first.
**Symptom:** `TypeError: cannot set property of null`.
```js
// ❌ WRONG
frame.appendChild(makeSearchBar()).layoutSizingHorizontal = 'FILL';

// ✅ RIGHT
const bar = makeSearchBar();
frame.appendChild(bar);
bar.layoutSizingHorizontal = 'FILL';
```

### layout-sizing-only-after-appendchild
**Principle:** `layoutSizingHorizontal` / `layoutSizingVertical` can only be set **after** the node is inside its auto-layout parent — set earlier, they are silently ignored because the property resolves against the parent's layout mode. Same order for `resize`: resize first, then sizing modes; wrapping text is `textAutoResize = 'HEIGHT'` + `layoutSizingHorizontal = 'FILL'`.
```js
parentFrame.appendChild(node);
node.layoutSizingHorizontal = 'FILL';
node.layoutSizingVertical = 'HUG';
```

### createautolayout-default-size-hug-collapse
**Principle:** `figma.createAutoLayout` creates a 100×100 px frame, and `layoutSizingVertical = 'HUG'` does not recompute height after `appendChild` — force the collapse explicitly: `counterAxisSizingMode = 'FIXED'` → `resize(width, 0)` → `counterAxisSizingMode = 'AUTO'` → `layoutSizingVertical = 'HUG'`.
**Symptom:** a HUG frame stays 100 px even with empty or hidden content.
**Caution:** on a freshly created auto-layout frame with just-added TEXT children, this same resize trick in the same script can silently break the TEXT nodes' own sizing (`textAutoResize` / `layoutSizingVertical` drop to NONE/FIXED) — see `resize-on-fresh-autolayout-frame-before-hug-settles-corrupts-text-sizing` in `references/layout-and-geometry.md`; either split assembly and collapse into two calls, or don't resize a fresh frame at all.
```js
actionRow.counterAxisSizingMode = 'FIXED';
actionRow.resize(actionRow.width, 0);          // reset to 0
actionRow.counterAxisSizingMode = 'AUTO';      // back to HUG — now it computes correctly
actionRow.layoutSizingVertical = 'HUG';
```

### verify-variable-ids-before-write
**Principle:** Variable IDs received from a prompt or a previous session must be verified with one read-only `figma.variables.getVariableByIdAsync` call BEFORE the first write — passed-in IDs are systematically off-by-N or point at a different variable, and the error is invisible to the eye when the tokens look alike.
**Symptom:** the binding looks right (both tokens give a similar colour in both themes) but semantically the wrong variable is bound.
**Pattern:** walk all IDs, collect `v.name`, compare with expectations; if an ID resolves to `null`, enumerate via `getLocalVariableCollectionsAsync` + walk `variableIds` and find the right ID by name.

### node-children-throws-non-container
**Principle:** `node.children` on non-container types (VECTOR / ELLIPSE / LINE / RECTANGLE / TEXT / STAR / POLYGON / SLICE) throws a `TypeError` instead of returning `undefined` — `if (node.children)` and `node.children?.length` don't protect you; type-guard on `node.type` before touching it. The same holds for every type-specific property: a single collector over a mixed-type list throws on the first node missing the property (`no such property 'strokeTopWeight' on VECTOR node`, `no such property 'characters' on FRAME node`).
**Symptom:** `TypeError "no such property 'children' on VECTOR node"` during a recursive walk — usually on VECTOR icons inside an INSTANCE.
**Pattern:** a `Set` of container types (FRAME, COMPONENT, COMPONENT_SET, INSTANCE, GROUP, SECTION, PAGE, BOOLEAN_OPERATION) checked with `CONTAINER_TYPES.has(node.type)` before reading `children`; for other properties, membership checks — `if ('cornerRadius' in n) …`, `if ('characters' in n) …`.

### use-figma-stale-reads-after-mutation
**Principle:** Reads right after mutations (delete / append / rebuild) may return stale state — `getNodeByIdAsync` returns `null` for a live node, a container looks empty — so the only source of truth is a repeated page-wide check through `figma.currentPage.findAll(...)`.
**Symptom:** a read straight after delete/append shows the section empty although the children exist.
**Pattern:** re-laying an element = delete the old node by id first, then create the new one — never place on top, or you get back-to-back duplicates.

### findone-type-guard-first-operand
**Principle:** In a `findOne` / `findAll` predicate the `n.type` check must be the FIRST operand — reading a type-specific property (e.g. `.characters`) before the guard throws on the first node of another type, and JS `&&` doesn't save you when the order is wrong.
**Symptom:** `TypeError: node.characters: no such property 'characters' on INSTANCE node` — crash on the first non-TEXT node of the walk.

### findone-first-match-traversal-order
**Principle:** `findOne` returns the first match in tree-traversal order, not the "most relevant" one — when searching by characteristic content in a tree with repeated text (especially after cloning a whole frame), search by a stable node ID or narrow the search to the right container first.
**Symptom:** the wrong node got edited — the first text match was in another branch (a sidebar instead of a section heading).
**Pattern:** `getNodeByIdAsync(clone.id + ';<relative suffix>')` from the known source structure, or `containerFrame.findOne(...)` instead of `clone.findOne(...)`.

### currentpage-resets-to-first-page
**Principle:** `figma.currentPage` at the start of EVERY call points at the file's first page — any `figma.currentPage.appendChild(newNode)` without a prior `await figma.setCurrentPageAsync(targetPage)` silently drops the new top-level node on the default first page, even though `getNodeByIdAsync` works cross-page.
**Symptom:** the new frame renders fine by ID (screenshots and metadata work) but is missing from the target page — noticed only when opening the page in Figma.
**Pattern:** `const p = figma.root.children.find(pg => pg.name === '…'); await figma.setCurrentPageAsync(p); p.appendChild(node);`

### clone-reparents-to-currentpage-if-source-not-on-currentpage
**Principle:** `node.clone()` inserts the copy into `figma.currentPage` (not next to the original in its real parent) if the original is not physically on the current page at call time — and `figma.currentPage` resets to the first page at the start of EVERY call (see above). Same symptom, triggered by `.clone()` instead of a manual `appendChild`.
**Symptom:** the clone renders fine by its own nodeId (screenshot / `get_design_context` work) but is entirely absent from the target SECTION/FRAME when walking `parent.children` — visible only by explicitly checking `clone.parent` or walking up to PAGE; a screenshot of the clone itself won't catch it.
**Pattern:** right after `const clone = source.clone();` do `targetParent.appendChild(clone); clone.x = savedX; clone.y = savedY;` (record x/y before the append). `appendChild` doesn't recompute coordinates for the new parent, so re-setting the same local x/y after the move puts the clone where it was meant to go. Alternative: `await figma.setCurrentPageAsync(pageOfSource)` before `.clone()`, but the appendChild pattern is more robust (doesn't require knowing the current page in advance).

### page-children-bbox-collision-check
**Principle:** Position new top-level nodes only after an arithmetic check against the bounding boxes of ALL `page.children` — "not (0,0)" and "looks empty from memory" don't guarantee free space, and a screenshot of a temporary group renders new nodes in isolation and doesn't show collisions with content underneath.
**Symptom:** new content landed on top of existing canonical frames (higher z-order, added later) and hid them entirely; the agent's own screenshot verification didn't catch it.
**Pattern:** build `boxes = page.children.map(n => ({x, y, right, bottom}))` and check the candidate against each. For a combined screenshot with a CONNECTOR, use a temporary SECTION, not a GROUP: ungrouping a GROUP deletes a connector whose endpoint is on it without a trace; a SECTION doesn't auto-delete — remove it explicitly with `section.remove()`.
```js
const boxes = page.children.map(n => ({ x: n.x, y: n.y, right: n.x + n.width, bottom: n.y + n.height }));
// check the candidate against every box before positioning — never rely on memory that "it's empty here"
```

### sibling-sections-may-not-share-a-parent-raw-xy-not-comparable-across-them
**Principle:** Several top-level-looking SECTION nodes (each reads as its own page region) can physically have DIFFERENT parents — Figma allows a SECTION inside another SECTION, and in practice some "regions" are nested inside a neighbour. `node.x` / `node.y` are always relative to the IMMEDIATE parent, not the page — comparing raw `.x`/`.y` of two sections with DIFFERENT parents is meaningless even when both numbers look plausible.
**Symptom:** a manual collision check on raw `.x`/`.y` gives either a false negative (a real collision missed) or a false positive (a collision that doesn't exist) — both reproducible on the same set of sections, because relative coordinates of some sections get mixed with page-absolute coordinates of others. Extra trap: if a reviewer reads some bboxes with one method (script) and others with another (XML metadata), the coordinate-system mismatch can "accidentally" be right for some pairs and wrong for others, masking the problem itself.
**Pattern:** before ANY page-level collision check between sections — (1) read `.parent.type` / `.parent.id` of each section explicitly, never assume they all sit directly on the PAGE; (2) compute bboxes from `node.absoluteTransform[0][2]` / `[1][2]` (true page-absolute X/Y), not raw `.x`/`.y`, at the slightest suspicion of differing parents; (3) obtain all bboxes for ONE comparison with ONE method in ONE script — don't mix sources across nodeIds.
```js
const ids = ['id1', 'id2', 'id3'];
const boxes = [];
for (const id of ids) {
  const n = await figma.getNodeByIdAsync(id);
  const ax = n.absoluteTransform[0][2], ay = n.absoluteTransform[1][2]; // TRUE page-absolute, not n.x/n.y
  boxes.push({ id, x: ax, y: ay, right: ax + n.width, bottom: ay + n.height, parentId: n.parent.id, parentType: n.parent.type });
}
```

### findone-object-identity-indexof
**Principle:** `findOne` / `findAll` return fresh node wrappers on every traversal — `indexOf` and any `===` comparison of node objects against `parent.children` silently yield `-1` / `false` even for a real direct child; compare by `.id` only: `parent.children.findIndex(c => c.id === node.id)`.
**Symptom:** `insertChild(-1,...)` throws `Cannot insert node at a negative index` — masking that the original `indexOf` returned -1.

### delete-children-in-descending-index-order
**Principle:** Removing children by numeric index in ascending order shifts `children` after each removal, so an index computed up front no longer points at the node you meant. A later `findOne` may come back `null` after a clone-and-prune pass for exactly this reason. Delete in **descending** index order, and capture node references *before* any mutation rather than re-deriving them from indices afterwards.
```js
// Removing index 1 first would shift what used to be index 3 or 5 down by one.
const toRemove = [5, 3, 1]; // indices captured before any mutation
for (const i of toRemove.sort((a, b) => b - a)) node.children[i].remove();
```

### cross-page-appendchild-moves-node
**Principle:** `targetPage.appendChild(node)` moves a node BETWEEN pages of the same file directly — no export/import or detach needed, provided both the destination page and the node are addressed through `figma.getNodeByIdAsync`, not `figma.currentPage`.
**Symptom:** the temptation to solve "take a ready component from another page" by cloning in the source context + manually carrying properties over — redundant when a direct `appendChild` works.
**Pattern:** `const node = await figma.getNodeByIdAsync(idFromOtherPage); const targetPage = await figma.getNodeByIdAsync(targetPageId); targetPage.appendChild(node);` — afterwards `node.parent` points at the new page and `absoluteTransform` is recomputed automatically.

### variant-switch-retains-matching-property-overrides
**Principle:** Switching a COMPONENT_SET instance's variant via `setProperties` can carry a boolean/text componentProperty override from the PREVIOUS active child onto the NEW child when both have a property with the same property key (GUID) — even if the new variant's default in the main component is different.
**Symptom:** after a variant switch (e.g. `Actions=Double` → `Single`) the new single child unexpectedly renders with a foreign property value (e.g. `Show icon-right=true` inherited from the old neighbour button), although the main component defaults it to `false`.
**Pattern:** after any variant switch — explicitly re-read and, where needed, re-set ALL relevant componentProperties of the new child; don't rely on the main component's defaults; compare with a known-good reference (the same component elsewhere in the file) if one exists.
**Wider:** this is one direction of a more general problem — after ANY variant/component switch (`setProperties` on a variant axis, `swapComponent`, Expanded/type toggles) every property of the subtree must be treated as suspect: visibility, paint variable bindings, icon glyphs and text may either inherit from the old variant (this direction) or silently reset to the new main's default (the opposite direction) — independently of each other. Confirmed repeatedly across components and files. **Rule:** after any switch, check the WHOLE subtree with a screenshot, not just the key-matching overrides.

### fresh-instance-never-inherits-donor-overrides
**Principle:** A freshly created INSTANCE (via `master.createInstance()`, `donorInstance.getMainComponentAsync().createInstance()` or equivalent) never inherits override values from a neighbouring / reference / donor instance of the same component — only the true main-component defaults, even when a "known good" instance with the wanted values sits right next to it.
**Symptom:** the new instance doesn't match the neighbouring "reference" instance visually or in properties — text overrides, boolean icon visibility, swapped icons all fall back to the main's defaults.
**Pattern:** after `createInstance` copy the needed componentProperties/overrides from the donor instance explicitly — don't expect a "similar neighbour" to pass on its state. Confirmed independently in different files and component types.

### icon-library-swap-requires-explicit-recolor
**Principle:** Instances/components imported or swapped from an icon library arrive with the LIBRARY's own default stroke/fill (often black, or a semantically wrong `*-inverse` token) — they are never recoloured automatically for the consuming context. SVGs imported with `createNodeFromSvg` behave the same way: a stray white frame fill and black strokes (codebase `currentColor` imports as black).
**Symptom:** a freshly imported/swapped icon renders in a colour foreign to the rest of the layout (black on a coloured background, wrong `*-inverse` token).
**Pattern:** after every icon import/swap — an explicit pass rebinding stroke/fill to the right variable/token; for SVG imports also set the icon **frame** `fills = []`. Don't count recolouring as part of the swap itself. Confirmed independently for several icon libraries.

### swapcomponent-keeps-slot-size
**Principle:** `swapComponent` keeps the slot's size, not the new component's — swapping a 24×24 icon into a 32×32 slot yields a 32×32 instance, and `resize` on a node nested inside an instance is silently ignored (the size belongs to the parent instance). Either accept the slot size or swap at a slot that already matches.
**Pattern:** check the result with `Math.round(node.width)` after the swap, not the component's declared size. When a swap target is ambiguous (several plausible components or variants), confirm with the user before applying — don't guess the match.

### component-names-unreliable-match-by-structure-not-string
**Principle:** Component/variant names inside shipped design-system files are unreliable identifiers for matching — literal typos and inconsistent option naming between sibling variants of one axis at one size do occur.
**Symptom:** searching/matching a component by string name doesn't find the expected node, or finds the wrong one, although the component definitely exists.
**Pattern:** match by structure / component key / bound variable, never by string equality of the name. Confirmed independently in several design-system files.

### cross-collection-alias-resolution-is-per-collection-not-cascading
**Principle:** When a variable in collection A (e.g. semantic, N modes) aliases a variable in multi-mode collection B (e.g. the base palette), B's mode is **not derived** from which mode of A is pinned on the consuming node — they are two independent `explicitVariableModes` pins, and resolution is per collection. The officially documented API for correct resolution through the whole alias chain is `Variable.resolveForConsumer(node)`; each collection's pin is set separately with `node.setExplicitVariableModeForCollection(collection, modeId)`. If only collection A is pinned on the consumer (the usual case when B used to be single-mode and migrated to multi-mode), B silently resolves to its DEFAULT mode regardless of A's active mode, with no error.
**Symptom:** after moving the lower layer (primitives) from separate families to one multi-mode collection, every existing consumer (pinned canvas frames, read-only scripts walking the upper collection's `valuesByMode`) keeps resolving to ONE AND THE SAME (default) mode of the lower collection for all branches at once — visually "everything looks like one variant" on the primitive layer while the upper (semantic) collection still shows different values per mode.
**Pattern:** before a single-mode → multi-mode migration of a collection that another multi-mode collection aliases into — (1) for EVERY consuming node (canvas frames, demo sections) add an explicit SECOND pin on the new multi-mode collection, in step with the existing pin on the first one; don't expect one pin to "cascade"; (2) for read-only scripts walking `valuesByMode` without a consumer node — either create a throwaway reference node and pin both collections before `resolveForConsumer`, or resolve both modeIds through an explicit mode→mode map inside the script; never assume that a mode name in one collection determines the mode of another.
```js
// Official example (plugin-api-standalone.d.ts, JSDoc for Variable.resolveForConsumer) —
// 2 collections × 2 modes each, the second aliasing into the first → up to 4 outcomes
// depending on the pins of BOTH collections at once, not one.
frame.setExplicitVariableModeForCollection(primitiveColl, modeId);   // ①
frame.setExplicitVariableModeForCollection(semanticColl, modeId2);   // ② — separate call, separate collection
const resolved = semanticVar.resolveForConsumer(frame);              // honours BOTH pins
```

### addmode-copies-values-from-last-existing-mode-not-default-mode
**Principle:** `variableCollection.addMode(name)` initialises the new mode's values as a copy of the **last mode in the current `.modes` list** (whatever was physically last BEFORE the `addMode` call), not of `collection.defaultModeId` — even when the default mode is not the last one. Calling `addMode` twice in one script (say, add a light mode, then a dark one) copies the FIRST new mode from the collection's previous last mode, not from the default — the intuitive "new mode = copy of default" does not hold.
**Symptom:** if the "light" new mode is deliberately NOT rewritten by hand (trusting that "it inherits the right values from the default light mode anyway"), the variables silently keep the values of the LAST existing mode (often the "dark" one), and `resolveForConsumer` on the affected nodes returns an unexpected (dark/foreign) colour. A screenshot right after the mutation may also look "broken" (or, conversely, deceptively fine because of caching — see `use-figma-stale-reads-after-mutation`; that is an INDEPENDENT cause, easy to confuse during diagnosis) — separate the two: first `resolveForConsumer` (structural truth, not cached), then the screenshot/render.
**Pattern:** after `addMode` NEVER rely on auto-copy as the source of correct values for anything other than literally "the same as the last mode before the call" — for EACH new mode, including the one that "seems obvious" (e.g. matching the default), run the same explicit "copy the needed values from the right donor mode" step (`v.setValueForMode(newModeId, v.valuesByMode[correctSourceModeId])` per variable of the family/collection). Don't do it only for the "non-obvious" one of two new modes — both need the explicit step, symmetrically.
```js
// AFTER addMode — don't assume where the values came from, check explicitly:
const newMode = collection.addMode('New-mode');
// ❌ WRONG — trusting that newMode already holds the right (default) values
// ✅ RIGHT — for every variable family copy explicitly from the RIGHT donor mode
for (const id of collection.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  const donorVal = v.valuesByMode[correctDonorModeId]; // NOT collection.defaultModeId by default
  if (donorVal !== undefined) v.setValueForMode(newMode, donorVal);
}
```

## Routing: what to read when

| File | Trigger |
|---|---|
| `references/components-and-variants.md` | COMPONENT / COMPONENT_SET: creation, `combineAsVariants`, properties, `setProperties`; deleting properties and dissolving sets |
| `references/instances.md` | INSTANCE: import / swap / detach, nested overrides, hidden children, repurposing slots |
| `references/layout-and-geometry.md` | frames, auto-layout, HUG/FILL, resize, coordinates, strokes/shadows, radii, SVG and vector paths, traversal and safe deletion |
| `references/text-and-styles.md` | TEXT nodes, fonts and font loading, `textStyleId`, `figma.mixed`, truncation, stale `width`/`height` on fresh text |
| `references/variables-and-tokens.md` | variables, bindings (incl. per-corner radius and per-paint colour), collections, modes, tinted fills, library vs local files |
| `references/connectors.md` | CONNECTOR in any editor: endpoints, magnets, SECTION anchoring |
| `references/annotations.md` | Dev Mode annotations (`node.annotations`, `figma.annotations`) — not Figma Comments; category/colour enums, HTML escaping in labels, existing-only categories |
| `references/publishing-hygiene.md` | ANY text written outward: component descriptions, annotations, node/page names, TEXT in the layout |
| `references/figjam.md` | FigJam boards (`/board/`): pasted-image styling, stale reads |
| `references/prototyping.md` | prototype links: `setReactionsAsync`, overlays and their read-only position |
| `references/mcp-and-environment.md` | the tool layer (screenshots, asset upload), rate limits, subagents; metadata read reliability (partial page lists, timeouts, hidden children), truncation of large responses (~20 KB), `skipInvisibleInstanceChildren`, `findAll` partial subtrees, screenshot artefacts (1×1, phantom boxes), infinite-loop detection, REST fallback, visual regression and verification recipes (export hash, pixel compare, page dumper) |
| `references/screen-from-code.md` | building / rebuilding a Figma screen from application code: role mapping, DS lookup, build actions, Mode Discovery / Build |

If you accumulate facts about one specific Figma file (Set IDs / Page IDs of particular components, quirks of that file), keep them in a separate `references/files/<file>.md` in the same format and add a row to this table; such files are inherently non-portable between projects, so this shared pack contains none.

## Common mistakes — quick scan

| Mistake | Fix |
|---|---|
| Retrying font loads/bindings for a sandbox-absent licensed font | Ask whether it can be uploaded to the org/team — that's the real fix; only then fall back to Inter to spec — `text-and-styles.md` |
| Writing to a node right after `setTextStyleIdAsync` | It swaps the node's font mid-call — load both current and target fonts first |
| Reading `node.fontName` on multi-font text | It's `figma.mixed` — loop `getStyledTextSegments(['fontName'])` and load each run's font |
| Assuming a binding applied | Read it back — library-swatch and `cornerRadius` bindings fail silently |
| `setBoundVariable('cornerRadius', v)` then checking the aggregate key | It binds the four per-corner fields — bind and verify all four |
| Setting paint opacity before the paint is on the node | Assign the bound paint first, clone + set opacity second — `variables-and-tokens.md` |
| Treating local bindings in a library file as orphaned | They're correct; only hardcoded values are fix candidates |
| Calling `deleteComponentProperty` without snapshotting instances | It resets every instance to the component default — capture content first — `components-and-variants.md` |
| Expecting properties to survive a dissolved variant set | They belong to the SET; re-create them on the standalone component |
| Reading a set's `description`/`x`/`y` after moving its last variant out | The emptied set auto-deletes — read what you need before mutating |
| Trusting an instance's `children` as an inventory | Hidden descendants are missing — read the main component — `instances.md` |
| Escaping spaces in a `query` selector | No escape syntax — write the space as-is or use `findAll` with a predicate |
| One property collector over a mixed-type node list | Guard each property with `'prop' in n` |
| Deleting children by ascending numeric index | Delete in descending order, capture refs before mutating |
| Assuming a `vectorPaths` node sits at `(0, 0)` | Its box is normalised to the path's bbox — `layout-and-geometry.md` |
| Setting `layoutSizingHorizontal`/`Vertical` before `appendChild` | Only resolves after the node is inside its auto-layout parent |
| Calling `get_variable_defs` with a page id | Only accepts a node/frame id — `mcp-and-environment.md` |
| Running `get_metadata` or `findAllWithCriteria` on a whole page | Can blow the token ceiling or hang the plugin — scope to a frame, use a one-line dumper |
| Treating `get_screenshot`'s default response as image bytes | It's a short-lived URL — `enableBase64Response: true` or `curl` it to disk at once |
| Skipping `setCurrentPageAsync` / font preload before a write batch | Both fail opaquely mid-batch |
| Declaring a visual edit safe without a before/after check | Hash the export or diff against a saved screenshot — never assert pixel-identity by eye |
| Creating text styles, then setting `fontName`/`fontSize` on nodes to the same values | Nothing links them — bind with `setTextStyleIdAsync(style.id)` and read back `styled/total` — `text-and-styles.md` |
| Leaving `clipsContent` at its default on structural wrappers | Every wrapper clips its children's shadows — `clipsContent = false` next to `fills = []` |
| Editing the file to match a screenshot that disagrees with the readback | The screenshot is stale, not the file — re-shoot, never save a disagreeing frame as reference — `mcp-and-environment.md` |
| Centering or sizing by `text.width` / `text.height` in the call that created the text | Fresh TEXT metrics are the default font's, not yours — align with auto-layout, verify by render — `text-and-styles.md` |
| Drawing a ring or progress arc as a stroked ELLIPSE with `innerRadius: 0` | That is a pie sector — `innerRadius = 1 - thickness / radius`, fill it, `strokes = []`, read `arcData` back — `layout-and-geometry.md` |

## Protocol for recording a new insight

The pack lives best with a single writer at any moment — if several people or agents append a new rule in parallel copies, versions diverge and duplicates have to be reconciled by hand. If several AI tools read the pack at once, agree that only one of them (or one person) writes to it; the others read and pass findings to that single writer — cheaper than untangling conflicting versions of the same fact later.

1. **Classify:** a universal API principle → the topical `references/*.md`; a fact about one specific Figma file → its own `references/files/<file>.md` (not part of this shared pack); a process pattern not specific to the Figma API → your team's general rules, not here.
2. **Append** the rule as a `### slug` section AT THE END of the topical file (format: Principle / Symptom / Pattern / code). No "verified on <file>" trailer: a reader outside your project can't use it, and it's where client names and node ids leak. If reproducibility matters, say so in one clause — "confirmed in several files" — nothing more.
3. **New topic** → new file + a row in the routing table above, IN THE SAME COMMIT.
4. **A rule that fired a third time in different contexts** → move the entry here, into "Universal principles", leaving a stub in the topic file in exactly this form: _Core: full text — `../SKILL.md`._ Exception: a rule describing a universal Plugin API principle not tied to a specific project (as opposed to a fact about one file) may be promoted on the first clear occurrence; the "three times in different contexts" threshold is mandatory only for patterns whose universality isn't obvious from one case.
5. **Commit at once,** as a separate commit from the task in hand — it is easy to forget the pack change by committing only the task.
