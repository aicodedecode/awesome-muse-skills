---
name: figma-plugin-api-rules/instances
description: Read when working with INSTANCE nodes — createInstance, importComponentByKeyAsync, swapComponent, detachInstance, nested overrides, hidden children, repurposing slots
---

# instances — use_figma rules

### importcomponentbykeyasync-swapcomponent-published-library
**Principle:** `figma.teamLibrary` can't search components by name, but `importComponentByKeyAsync(key)` + `instance.swapComponent(comp)` works for published libraries.
**Pattern:** workflow: `search_design_system` MCP → filter by the wanted library's `libraryName` → key → `importComponentByKeyAsync` → `swapComponent`. Results with `libraryName: null` are other people's design systems — don't use them.

### detachinstance-inject-children-into-slots
**Principle:** `detachInstance` is the clean way to inject arbitrary children into an existing component's slots (after detach the instance becomes an editable frame).

### getnodebyidasync-same-file-instantiation
**Principle:** To instantiate atoms within the same file, `getNodeByIdAsync(id)` is more reliable than `importComponentByKeyAsync` — the latter is meant for importing from a team library.

### setproperties-nested-instance-override
**Principle:** For property overrides of existing nested instances `setProperties` works directly without `detachInstance` — detach is needed only for injecting new children into a slot.
**Pattern:** find the nested instance via `findOne`/`children` and call `setProperties` on it.

### textstyleid-mutable-on-instance-sublayer
**Principle:** Text nodes inside nested instances (IDs of the form `I...;...`) allow direct mutation of `textStyleId`, although `componentPropertyReferences` is forbidden on an instance sublayer ("Cannot set component property references on instance sublayer") — so a text style can be changed inside a nested instance without touching the source component.
**Pattern:** always `await figma.loadFontAsync(...)` before any text mutation, including assigning `textStyleId`.
```js
const textNode = await figma.getNodeByIdAsync('I349:19;316:5');
textNode.textStyleId = 'S:style-key-placeholder,'; // ✅ Headline2 18px

// ❌ componentPropertyReferences — still an error on a sublayer
textNode.componentPropertyReferences = { characters: 'PropKey#id' };
// Error: "Cannot set component property references on instance sublayer"
```

### instance-swap-resets-vector-bindings
**Principle:** INSTANCE_SWAP (via `setProperties({'Icon#xx:y': comp.id})`) brings the new sub-icon's vectors with THEIR default stroke/fill and loses the colour-variable bindings — after every swap rebind the stroke/fill of all VECTOR/BOOLEAN_OPERATION nodes via `figma.variables.setBoundVariableForPaint` and check both theme modes with a screenshot.
**Symptom:** an icon after a swap with a default black stroke: looks fine in the light theme, invisible in the dark theme — the bug is caught only by checking both modes.
**Pattern:** the same for a nested State override: the per-state colour of a swapped vector does NOT follow the variant — recolour after every swap / state change.
```js
// ❌ swap without recolouring — the icon is black (invisible in dark)
btn.setProperties({ 'Icon#4138:0': filterComp.id, 'State': 'default' });

// ✅ after the swap — rebind the vectors' stroke/fill
btn.setProperties({ 'Icon#4138:0': filterComp.id, 'State': 'default' });
const vecs = btn.findAll(n => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION');
for (const v of vecs) {
  if (v.strokes?.length) { let s = {...v.strokes[0]}; s = figma.variables.setBoundVariableForPaint(s,'color',iconSecVar); v.strokes=[s]; }
  if (v.fills?.length)   { let f = {...v.fills[0]};   f = figma.variables.setBoundVariableForPaint(f,'color',iconSecVar); v.fills=[f]; }
}
```

### setproperties-variant-swap-positional-overrides
**Principle:** On a variant swap via `setProperties` on a nested instance whose component set's variants have entirely different node IDs (no shared template), the old per-slot overrides are carried over by slot position, not by ID — after the swap every slot must be explicitly rewritten with the target values.
**Symptom:** the render shows a mix of old and new texts/states while the structure (IDs) is fully correct.
**Pattern:** after `setProperties({Variant:...})` walk the slot spec and rewrite each via `getNodeByIdAsync(instance.id + ';' + suffix).setProperties(props)`.
```js
// ❌ just swap the variant — the old overrides surface in the wrong places
navItemsAdmin.setProperties({ Selected: '7' });
// render: some nav items semantically from the old variant, some from the new

// ✅ after the swap — explicitly rewrite EVERY slot with the target values by known IDs
navItemsAdmin.setProperties({ Selected: '7' });
const spec = [
  { suffix: '857:9762', props: { 'Label#47:0': 'Dashboard', State: 'Default' } },
  { suffix: '3517:4711', props: { 'Label#47:0': 'Attachments', State: 'Selected', 'Accent bg': 'On' } },
  // ...the remaining slots
];
for (const s of spec) {
  const node = await figma.getNodeByIdAsync(navItemsAdmin.id + ';' + s.suffix);
  node.setProperties(s.props);
}
```

### resetoverrides-wipes-instance-customizations
**Principle:** `instance.resetOverrides()` rolls back ALL properties (including the variant choice itself) to the master's true default and wipes legitimate per-instance overrides — this is not a "repair" but a full return to the library template; repair pointwise via `setProperties` on specific nodes.
**Symptom:** after `resetOverrides` the chosen variant reverted to the default, and the meaningful overrides (translations, highlight) were replaced by the master's placeholders.
```js
// ❌ resetOverrides() as a "quick fix" — wipes deliberate overrides (translations, highlight)
navItemsAdmin.resetOverrides();
// render: source-language placeholders, the wrong highlighted item

// ✅ Don't use resetOverrides() on instances with meaningful per-instance
// customisations. Repair pointwise via setProperties on specific nodes.
```

### instance-child-remove-not-allowed
**Principle:** `.remove()` on a direct child node of an INSTANCE throws `Error: in remove: Removing this node is not allowed` — an instance's children are protected from removal just as from injection.
**Symptom:** `Error: in remove: Removing this node is not allowed` when trying to drop an "extra" nested block of a copied component.
**Pattern:** for purely visual hiding — `node.visible = false` (auto-layout collapses invisible children as if absent); for structural removal — first `detachInstance` on the nearest instance ancestor, then `.remove()` works as on an ordinary FRAME.
```js
// ❌ throws "Removing this node is not allowed"
const badgeGroup = header.findOne(n => n.name === 'badge group');
badgeGroup.remove();

// ✅ for purely visual hiding — no detach needed
badgeGroup.visible = false;

// ✅ for real structural removal — detach the parent instance first
const detached = header.detachInstance(); // header was an INSTANCE, now an ordinary FRAME
const badge = detached.findOne(n => n.name === 'badge group');
badge.remove(); // works now
```

### insertchild-inside-instance-any-depth
_The same principle (appendChild/insertChild is blocked inside an instance boundary; fix — `detachInstance` on the nearest instance ancestor) recurs with different nuances in `instance-internal-appendchild-blocked-detach-to-edit-structure`, `appendchild-into-instance-blocked-detach-first-for-decorative-overlay` and `appendchild-into-instance-blocked-detach-outer-wrapper-to-compose` below — each describes its own practical case (top-level detach, a decorative overlay, detaching only the outer wrapper while nested instances stay live), not duplication for its own sake._
**Principle:** A structural insertion (`insertChild`/`appendChild`) into any node at ANY depth inside an instance boundary (even if the node itself is an ordinary FRAME) throws `Cannot move node. New parent is an instance or is inside of an instance` — not only the INSTANCE's direct children are protected.
**Symptom:** `Cannot move node. New parent is an instance or is inside of an instance` when inserting into a FRAME that lies inside an instance.
**Pattern:** `detachInstance` on the nearest instance ancestor BEFORE attempting an insertion into its subtree — after the detach ordinary mutations work.

### instance-repurpose-slot-property-overrides
**Principle:** When a structural mutation inside an INSTANCE is impossible (`insertChild`/`remove` fail) and `detachInstance` is undesirable (loss of the DS link for the rest of the correct content) — repurpose an existing irrelevant/duplicate child through property overrides: text via `label.characters`, the icon via an INSTANCE_SWAP prop (`setProperties({'<propName>#<id>': key})` with the key read from a reference instance's `componentProperties`), superfluous visual details — `visible = false`.
**Pattern:** limitation: the order of children inside an instance is immutable — the repurposed item stays at the original slot's position; if the position is critical — only `detachInstance` or a request for a new variant from the design-system owner.
```js
// ❌ fails — insertChild/remove are forbidden on an instance's children
navItems.insertChild(targetIndex, profilesClone); // Error: Cannot move node...

// ✅ repurpose an existing spare slot in place
const extraSlot = navItems.children.find(c => c.id.endsWith(';857:9771')); // a duplicate "Settings"
const label = extraSlot.findOne(n => n.type === 'TEXT');
label.characters = 'Profiles'; // a text override — not a structural mutation, always works

const iconMaster = extraSlot.findOne(n => n.name === 'icon master component');
const refIcon = referenceItem.findOne(n => n.name === 'icon master component');
const targetIconKey = refIcon.componentProperties['Icon library#786:2'].value;
iconMaster.setProperties({ 'Icon library#786:2': targetIconKey }); // instance-swap override

const chevron = extraSlot.findOne(n => n.name === 'Icon placeholder');
if (chevron) chevron.visible = false; // a superfluous visual element — just hide it
// extraSlot stays at its position (last) — the order can't be fixed without detach
```

### resolved-instance-not-guarantee-correct-source-library
**Principle:** `getMainComponentAsync` resolves the master node regardless of which library it came from — "0 missing nested components" does NOT mean the nested instances are from the right (canonical) library. Verify the source by the master's key against the canonical library's whitelist, not by the fact of resolution. Swapping a component on the page doesn't reach instances sitting inside masters on other pages.
**Symptom:** the missing check passes cleanly, but some nested icons/components are actually from a deprecated/foreign library.

### mirror-instance-relativetransform-no-fliphorizontal
**Principle:** The Plugin API has no `node.flipHorizontal` — in the `use_figma` sandbox accessing a non-existent property THROWS rather than returning undefined, so `typeof node.flipHorizontal` doesn't save you. Mirror an instance horizontally (without editing the master, without changing bindings, works in HORIZONTAL auto-layout too) via `relativeTransform` (scaleX = −1). `swapComponent` PRESERVES the source instance's existing scaleX=−1 — if the original was already mirrored, the new component arrives mirrored too; a repeat flip = a double reflection.
```js
const t = inst.relativeTransform; // [[a,c,e],[b,d,f]]
inst.relativeTransform = [[-t[0][0], t[0][1], t[0][0]*inst.width + t[0][2]],
                          [-t[1][0], t[1][1], t[1][0]*inst.width + t[1][2]]];
```

### detachinstance-cascades-to-instance-ancestors
**Principle:** `detachInstance` on a deeply nested instance also detaches ALL instance ancestors up the tree in cascade, not just the target node — if `parent` is also a remote instance wrapped around `child`, detaching `child` forces Figma to detach `parent` too (otherwise the internal state would diverge from `parent`'s master).
**Symptom:** `getNodeByIdAsync(parentIdFromEarlierRead)` in the NEXT `use_figma` call returns `null`, although the node is physically on the canvas — its ID changed on detach (`INSTANCE`→`FRAME` = a new identity).
**Pattern:** "parent not found" after detaching a child in the previous call — don't hunt for a bug in the ID; re-read `child.parent.id` afresh.

### detached-clones-inconsistent-children-order
**Principle:** Clones of one component on DIFFERENT frame instances of one page can have a DIFFERENT order/composition of children even when they look like identical copies — after `detachInstance` on several clones, index addressing (`children[6]`) verified on the FIRST clone isn't guaranteed right for the rest.
**Symptom:** an index-based fix applied the icon swap to the wrong rows; found only by screenshot QA while the script ran "successfully".
**Pattern:** address by a stable feature (the node's name/text or a `setProperties` value), not by position; verify each clone separately; don't carry the index over from the first.

### instance-swap-setproperties-needs-id-not-key
**Principle:** `setProperties({ 'Icon library#786:2': value })` on an INSTANCE_SWAP prop requires the imported component's **`.id`** (a value like `"2794:33754"`), not `.key` (the library hash key, like `"component-key-placeholder"`) — even when that same `.key` is present among the prop's `preferredValues`.
**Symptom:** `Error: in setProperties: Property value is incompatible with component property type` — while the component key itself is valid and visible in the same INSTANCE_SWAP prop's `preferredValues`, which masks the real cause (it seems the icon isn't supported, while the issue is the value format).
**Pattern:** `const comp = await figma.importComponentByKeyAsync(key); iconWrapper.setProperties({ 'Icon library#786:2': comp.id })` — not `comp.key`. The script is atomic: an error at this step rolls back all previous mutations of the same call too (e.g. `State=Disabled` already set on other items) — on retry the whole set of changes must be re-included in one successful call, not only the failed line.

### nested-instance-id-flaky-right-after-page-switch
**Principle:** `getNodeByIdAsync` on a deeply nested instance-override ID (format `I<id>;<suffix>;<suffix>;...`) may unpredictably return `null` on first access at the start of a script — even WITHOUT any preceding mutations in the same call, and even for an ID that resolves normally in a separate read-only call. The unreliability doesn't correlate predictably with nesting depth: in one run only a 3-level ID failed, in another only a 1-level one (both on the same page, with no switches between calls).
**Symptom:** `TypeError: cannot read property 'clone' of null` on a random (not always the same) `getNodeByIdAsync(nestedId)` at the start of a script; a repeat separate read-only call with the same ID right after works without errors.
**Pattern:** don't resolve deeply nested instance-override nodes directly by the composite ID string. Resolve ONLY stable top-level / non-root-but-simple nodes via `getNodeByIdAsync`, then descend to the nested content via `.findOne`/`.children` traversal (JS object references) within the same call — traversal from an already-loaded parent is robust where a repeat ID lookup is not.
```js
// ❌ unreliable — may return null even with no mutations before this line
const resetLinkSrc = await figma.getNodeByIdAsync('I6961:266763;1374:15652;53:13003;53:12849');
const clone = resetLinkSrc.clone(); // TypeError: cannot read property 'clone' of null

// ✅ reliable — resolve a stable top-level node, then traverse
const filtersActive = await figma.getNodeByIdAsync('6961:266763');
const block = filtersActive.findOne(n => n.name === 'filters block-active');
const resultRow = block.findOne(n => n.name === 'result row');
const resetLinkSrc = resultRow.children.find(c => c.name === 'Text button');
const clone = resetLinkSrc.clone(); // works
```

### content-based-child-lookup-breaks-on-localized-source
**Principle:** Looking up a child node by matching its text content (`n.characters === 'Filters'`) breaks if the cloning source is an instance with a different locale/content (e.g. a localised instance instead of the English one) — the predicate silently finds no match (`.find` returns `undefined`), and the next operation on `undefined` throws a seemingly unrelated error on the NEXT line.
**Symptom:** `TypeError: cannot read property 'findOne' of undefined` — at first glance a bug in `findOne`, while the real cause is a line above: `.find(c => c.characters === '<EN text>')` found no match in the localised instance.
**Pattern:** for fields in a known fixed structure (e.g. `[input-search, Filters-select, Sort-select]`) — look up by position (`row.children[1]`) or by layer name (`.name === '...'`), not by expected text. Text matching as a predicate is safe only when the source is guaranteed to already be in the target locale.

### composite-instance-ids-invalid-across-separate-use-figma-calls
**Principle:** Composite instance-override IDs (`I<id>;<suffix>;...`) obtained by a read-only call (`query('TEXT')` etc.) resolve reliably via `getNodeByIdAsync` within THE SAME call, but systematically return `null` / "not found" in the NEXT separate `use_figma` call — not occasionally (see the neighbouring rule `nested-instance-id-flaky-right-after-page-switch` about random flakiness) but **always**, if the node lies inside a remote/shared-library instance (a shared Sidebar, Navigation bar, language selector, pagination and similar components reused across the whole file). Local (non-remote) components aren't affected — in the same session neighbouring IDs from NON-remote instances resolved normally between calls.
**Symptom:** the first read-only call (`query('TEXT')`) returns a full correct list of IDs + texts; the second (write) call with THESE SAME IDs gives `error: 'not found'` on several nodes at once — while the other (non-remote) IDs from the same list write without issues.
**Pattern:** don't carry composite IDs between calls for remote instances. Instead — keep a dictionary `{ current_text: new_text }` and, within ONE write call, re-obtain a stable top-level/non-root parent via `getNodeByIdAsync(stableParentId)`, then `parent.query('TEXT')` and match by CURRENT content (reliable while the source isn't translated yet — cf. `content-based-child-lookup-breaks-on-localized-source` for the reverse case). One pass with the dictionary translates the whole subset of nodes at once regardless of the depth/shape of the composite ID.
```js
// ❌ an ID from the previous read-only call — fails "not found" on remote instances
const node = await figma.getNodeByIdAsync('I7093:270881;205:1188;202:995'); // null

// ✅ a fresh query + match by current text, in the same call that writes
const translations = { "Teams": "Команды", "Disputes": "Споры", /* ... */ };
const sidebar = await figma.getNodeByIdAsync('7093:270879'); // a stable top-level parent
for (const t of sidebar.query('TEXT')) {
  if (translations.hasOwnProperty(t.characters)) {
    for (const f of t.getStyledTextSegments(['fontName']).map(s => s.fontName)) await figma.loadFontAsync(f);
    t.characters = translations[t.characters];
  }
}
```

### mixed-locale-clone-shell-plus-subblock-not-full-instance-patch
**Principle:** If a single-locale assembly is needed but the only instance with the right STRUCTURE of nested sub-components (e.g. real badge-filter / the text-button component instances, not simplified frame clones without TEXT children) exists only in ANOTHER locale — don't clone that instance whole counting on patching every text node inside pointwise: it's easy to miss a node outside the focus area (e.g. the labels of the toolbar row itself, not part of the target sub-block with chips).
**Symptom:** after assembly the screenshot shows partially untranslated labels (e.g. the toolbar fields stayed in the source language although the chips and reset text inside the nested sub-block are already fixed) — found only by visual check, not by structural diff (the text mutations ran without errors).
**Pattern:** clone a structurally equivalent "shell" that is already in the right locale separately (e.g. the toolbar row from an English instance of the same master component), and clone from the other-locale source only THE needed sub-block (e.g. the chips row), positioning it under the shell at the authentic offset (`blockSrc.y` before cloning) — so all text edits are guaranteed to cover all visible content, not only the touched sub-block.

### remote-component-set-appendchild-blocked-fake-local-variant
**Principle:** A `COMPONENT_SET` with `remote: true` (published from a library, `parentId: null` in the current file) doesn't accept new variant children via `componentSet.appendChild(clone)` — the API treats a remote master as a read-only container even if the file itself may edit INSTANCES of that set. A real new variant (e.g. `4-actions` next to the existing `1/2/3-actions`) can be added only in the library's source file followed by a republish.
**Symptom:** `Error: in appendChild: Cannot move node. New parent is a internal, read-only node` — when trying to add a cloned `COMPONENT` into a remote `COMPONENT_SET` (`cs.appendChild(clone)`), while resize/setProperties/detachInstance on INSTANCES of the same set work fine.
**Pattern:** if the new variant is needed ONLY in a couple of specific places of the current file — don't try to extend the remote component itself; make a local "pseudo-variant" pointwise on the needed instances: `instance.detachInstance()` → copy/clone an existing slot of the same type (e.g. a neighbouring icon-box) → `swapComponent` on the leaf swappable instance (the mainComponent can be taken via `existingWorkingInstance.getMainComponentAsync()`, no need to re-import by key) → add at the needed position → `resize` the container for the new slot count. This is NOT a real reusable DS variant — only an assembly for specific cells; record this limitation explicitly in the task.
```js
// ❌ fails — a remote COMPONENT_SET doesn't accept a variant from outside
const cs = await figma.getNodeByIdAsync(componentSetId); // remote: true
const clone = existingVariant.clone();
cs.appendChild(clone); // Error: Cannot move node. New parent is a internal, read-only node

// ✅ a local pseudo-variant on specific instances, without touching the remote set
let cell = await figma.getNodeByIdAsync(cellInstanceId);
cell = cell.detachInstance();                    // FRAME, editable
const templateSlot = cell.children[1];           // an existing slot of the same type
const newMain = await someWorkingIconInstance.getMainComponentAsync();
const newSlot = templateSlot.clone();
newSlot.x = templateSlot.x + 48;
cell.appendChild(newSlot);
// find the leaf swappable instance by STRUCTURE (the next child is a VECTOR), not by name —
// after the first swapComponent() the instance's name changes and string matching stops working
let leaf = newSlot.children[0];
while (leaf.type === 'INSTANCE' && leaf.children.length === 1 && leaf.children[0].type !== 'VECTOR') leaf = leaf.children[0];
leaf.swapComponent(newMain);
cell.resize(cell.width + 48, cell.height);
```

### createinstance-must-be-called-on-master-not-donor-instance
**Principle:** `.createInstance()` is called only on a COMPONENT (the master), not on an INSTANCE — if only a "donor" instance is at hand (e.g. found in a reference section of someone else's case), first `await donorInstance.getMainComponentAsync()`, and `createInstance` on the result.
**Symptom:** `TypeError: node.createInstance(): no such property 'createInstance' on INSTANCE node`.
**Pattern:** `const main = await donorInstance.getMainComponentAsync(); const fresh = main.createInstance();`

### fresh-instance-loses-donor-per-instance-text-overrides
**Principle:** A fresh `mainComponent.createInstance()` shows the master's DEFAULT text (placeholders like "Title"/"Label"), not the text visible in `get_design_context` / the screenshot of the specific donor instance used for structure inspection — that text was a per-instance override of the DONOR, not part of the master component.
**Symptom:** after `createInstance` + an attempt to find text by expected content (`findAll(n => n.characters === 'Selected: 24')`) — `undefined`, although the instance is structurally identical to what was seen earlier; the real text on the new instance is "Title"/"Label" or another master default.
**Pattern:** don't rely on the donor instance's text as the expected content of the new instance — right after `createInstance` read the real `findAll(n => n.type === 'TEXT').map(t => t.characters)` and address the edit by what was actually seen (or by a stable descendant path, not by content).

### connector-magnet-fails-on-nested-instance-sublayer-id
**Principle:** `connectorStart`/`connectorEnd` with a `magnet` on a node with an ID of the form `I<instanceId>;<suffix>;<suffix>...` (a deeply nested instance sublayer, e.g. a button inside an instance inside an instance) fails validation — magnet expects an addressable top-level-like node, not a composite sublayer path.
**Symptom:** `Error: in set_connectorStart: Invalid endpointNodeId` — while the same ID resolves fine via `getNodeByIdAsync` for reading/clicking in other contexts.
**Pattern:** for deeply nested instances — don't try to magnet-anchor the connector directly; instead anchor BOTH ends via `position` on `section.id` (or `page.id` if not in a section), computing coordinates via `node.absoluteTransform` minus the section offset. See `connector-section-pageid-anchoring-rollback` for the same "one base on both ends" discipline.
```js
// ❌ fails — magnet on a deep instance-sublayer ID
conn.connectorStart = { endpointNodeId: 'I7043:7242;497:3845', magnet: 'TOP' };
// Error: in set_connectorStart: Invalid endpointNodeId

// ✅ works — position on section.id, coordinates via absoluteTransform
const btn = await figma.getNodeByIdAsync('I7043:7242;497:3845');
const sectionAbsX = section.absoluteTransform[0][2], sectionAbsY = section.absoluteTransform[1][2];
conn.connectorStart = {
  endpointNodeId: section.id,
  position: { x: btn.absoluteTransform[0][2] - sectionAbsX + btn.width / 2, y: btn.absoluteTransform[1][2] - sectionAbsY },
};
```

### swapcomponent-resets-nested-instance-overrides-to-master-defaults
_Extended: besides visibility, the same reset catches `layoutSizingHorizontal`._
**Principle:** `instance.swapComponent(newMain)` doesn't carry over per-instance overrides of nested sub-instance nodes — they roll back to the default of the new variant's MASTER component, even if the donor instance (from which the `mainComponent` for the swap was taken) explicitly overrode those same slots. Confirmed on two different properties: `visible` (the donor's hidden the icon placeholder becomes visible) and `layoutSizingHorizontal` (the donor's `FILL` text rolls back to `HUG`).
**Symptom (visibility):** after `cell.swapComponent(linkCellMainComp)` extra decorative icons appear in the cell (placeholder asterisks at the edges of the text) that a neighbouring finished cell of the same type/variant didn't have.
**Symptom (sizing):** after swapping a `table cell` to `type=Link` the text clips at the cell boundary without an ellipsis (`clipsContent=true` on the cell) — the nested text-button component/`Label` rolled back to `layoutSizingHorizontal='HUG'` instead of `'FILL'`, so the text strives for its natural (full) width and sticks out of the narrow cell. Doesn't surface on short strings (they fit within the HUG width before the clip boundary) — shows only on sufficiently long text, so it may go unnoticed on the first couple of test cells.
**Pattern:** right after `swapComponent` — don't trust "the swap inherits the neighbours' state" for any property; explicitly compare and copy ALL relevant per-instance overrides (`visible`, `layoutSizingHorizontal`, and probably others) from an already finished reference instance of THE SAME variant.
```js
const donorTextButton = knownGoodInstance.findOne(n => n.name === 'Text button');
const donorIconPlaceholders = donorTextButton.children.filter(c => c.name === 'Icon placeholder');

await targetCell.swapComponent(linkCellMainComp);

const newTextButton = targetCell.findOne(n => n.name === 'Text button');
const newIconPlaceholders = newTextButton.children.filter(c => c.name === 'Icon placeholder');
newIconPlaceholders.forEach((p, i) => { p.visible = donorIconPlaceholders[i].visible; }); // not the master's default

const newLabel = newTextButton.findOne(n => n.name === 'Label');
newTextButton.layoutSizingHorizontal = 'FILL'; // also rolls back — check explicitly, not only visible
newLabel.layoutSizingHorizontal = 'FILL';
```

### nested-instance-boundaries-need-individual-detach
**Principle:** `rootInstance.detachInstance()` detaches only the root node itself (INSTANCE → FRAME) — nested sub-components (e.g. reusable `Breadcrumbs`/`Tabs`/page-header blocks inside a larger composite component) remain full INSTANCE nodes. `appendChild`/`remove` on descendants of such a nested instance still fail with `"Cannot move node. New parent is an instance or is inside of an instance"` / `"Removing this node is not allowed"`, even if the root parent is already detached.
**Symptom:** after `const frame = clonedInstance.detachInstance()` an attempt at `frame.findOne(n => n.name === 'text layout').appendChild(newNode)` still throws the same instance-boundary error — inexplicable at first glance, since the root is already a FRAME.
**Pattern:** before a structure mutation (append/remove) on any sub-node of a composite component — check `node.type === 'INSTANCE'` NOT only on the root but on every intermediate container on the path to the insertion point, and detach each such node INDIVIDUALLY (`if (x.type === 'INSTANCE') x = x.detachInstance();`), keeping the new returned node in place of the old reference. Simply editing `.characters` on existing text nodes inside nested instances does NOT require a detach — the restriction concerns only append/remove/structural edits.
```js
let navBar = clonedRootInstance.detachInstance(); // the root
let textHeader = navBar.findOne(n => n.name === 'text header'); // itself an INSTANCE too
if (textHeader.type === 'INSTANCE') textHeader = textHeader.detachInstance(); // detach #2, required separately
const textLayout = textHeader.findOne(n => n.name === 'text layout');
textLayout.appendChild(newNode); // fine now
```

### instance-subtree-remove-blocked-toggle-visible-instead
**Principle:** `.remove()` on a node lying inside someone else's INSTANCE subtree (an override child inside e.g. a modal-header INSTANCE — not the root of a cloned composition but a nested widget) throws `Error: Removing this node is not allowed`, even if the top-level clone itself (the standard modal etc.) is an ordinary FRAME, not an INSTANCE. The same class of restriction as in `nested-instance-boundaries-need-individual-detach` (append/remove across nested instance boundaries), but here solved MORE SIMPLY — without a detach: if the goal is just to hide an irrelevant/unused sub-element of a composite DS component (not to embed new content in its place), `node.visible = false` is a normal, supported override that breaks nothing.
**Symptom:** the script fails entirely (atomicity — none of the subsequent mutations in the same call apply) on the first `.remove()` of a nested instance child; nodes at the same level but lying in a PLAIN FRAME (not an instance subtree) — `.remove()` passes normally for them, which masks the cause on a quick read of the code (looks like the same operation twice; only the second fails).
**Pattern:** before `.remove()` of any sub-node of a cloned composite component — if the node lies inside a `node.parent` chain where `type==='INSTANCE'` occurs before the nearest "real" FRAME ancestor, prefer `node.visible = false` to a regular removal; keep `.remove()` for nodes whose direct parent is an ordinary FRAME (auto-layout containers assembled by hand, not pieces of a master component).
```js
// ❌ fails — segControl lies inside the INSTANCE "modal header", not in a plain FRAME
const segControl = modal.findOne(n => n.name === 'segmented control');
segControl.remove(); // Error: Removing this node is not allowed — the whole script rolls back atomically

// ✅ toggle visibility — a normal override, always works
segControl.visible = false;

// ✅ neighbouring FRAME children (not inside someone's instance) — .remove() works as usual
const merchantSelect = contentLayout.children[1]; // content layout — a plain FRAME, not an instance
merchantSelect.remove(); // fine
```

### icon-box-style-variant-recolors-container-not-swapped-icon-glyph
**Principle:** An icon-box wrapper component (a COMPONENT_SET with `Style`×`Size` axes and an icon-placeholder slot inside) colours with its `Style` variant (`Accent`/`Positive`/`Neutral`/…) only the BACKGROUND/plate of the box itself — the icon swapped inside (e.g. Lucide `check`/`copy`, imported via `importComponentByKeyAsync` + `swapComponent`) keeps ITS OWN default vector colour (usually black / `currentColor`-like), inheriting nothing from the parent's `Style`. Changing the box's `Style` is purely about the container, not the content.
**Symptom:** an icon box with `Style=Positive` visually gives a green plate with a BLACK tick inside — looks partly right (the plate is green; the "success" semantics read), so it's easy to miss that the icon itself isn't recoloured, especially when a DIFFERENT icon nearby (e.g. copy) was recoloured explicitly — the contrast with it distracts from the fact that the "green" icon is actually black.
**Pattern:** after every `placeholder.swapComponent(iconMaster)` — a mandatory separate step: `inst.findAll(n => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION')`, and for each node explicitly re-set `strokes`/`fills` to the needed variable (`icon/positive`, `icon/secondary`, `icon/accent`, etc., via `setBoundVariableForPaint`). Don't expect the box's `Style` variant to "automatically" paint the content — these are two independent steps (swap the component + recolour the glyph), even when it visually seems a green box can't contain a black icon.
```js
const placeholder = iconBox.findOne(n => n.name === 'Icon placeholder');
placeholder.swapComponent(checkMaster); // changes ONLY the glyph's shape, not the colour
const vectors = placeholder.findAll(n => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION');
for (const v of vectors) { // a mandatory separate step — easy to forget; the mistake throws no exception
  if (v.strokes?.length) v.strokes = [figma.variables.setBoundVariableForPaint({type:'SOLID', color:{r:0,g:0,b:0}}, 'color', iconPositiveVar)];
  if (v.fills?.length) v.fills = [figma.variables.setBoundVariableForPaint({type:'SOLID', color:{r:0,g:0,b:0}}, 'color', iconPositiveVar)];
}
```

### createinstance-from-mainComponent-drops-sibling-overrides
**Principle:** `existingInstance.getMainComponentAsync()` returns the master component WITHOUT the instance-level overrides applied on `existingInstance` (e.g. `swapComponent` on a nested icon placeholder). Creating a new copy via `master.createInstance()` is NOT a clone of the existing instance but a fresh instance of the master with its defaults: the nested icon placeholder returns to its original (usually generic/placeholder) look; the swap to the needed Lucide icon is lost.
**Symptom:** a new icon box created "after the pattern" of an already-working neighbour (`sibling.getMainComponentAsync().createInstance()`) visually shows the wrong glyph (a placeholder/asterisk instead of copy/check), although the structure and colour bindings are set right — easy to take for a recolouring bug, while the cause is the missing swap.
**Pattern:** to copy an already-configured instance — `existingInstance.clone()`, not `(await existingInstance.getMainComponentAsync()).createInstance()`. If cloning isn't available (e.g. it must be inserted into another specific parent via `appendChild` and `clone` isn't available in the context) — after `createInstance` from the master, REPEAT the same overrides by hand (`placeholder.swapComponent(sameComponentKey)` + glyph recolouring); don't rely on the master variant's visual similarity to the configured neighbour.
```js
// ❌ loses the neighbour's swap override
const master = await workingIconBox.getMainComponentAsync();
const newIcon = master.createInstance(); // glyph = the default placeholder, not "copy"

// ✅ repeat the override explicitly after createInstance from the master
const placeholder = newIcon.findOne(n => n.type === 'INSTANCE');
await placeholder.swapComponent(await figma.importComponentByKeyAsync(copyIconComponentKey));
```

### instance-internal-appendchild-blocked-detach-to-edit-structure
_The same class as `insertchild-inside-instance-any-depth` above — a specific case with an intermediate FRAME._
**Principle:** `appendChild` on any node lying INSIDE a component instance (even on an intermediate FRAME, not on the top-level INSTANCE itself) throws `Cannot move node. New parent is an instance or is inside of an instance` — the Plugin API allows no structural additions (new child nodes) to an instance's subtree, only property overrides on ALREADY existing children. This applies also to attempts to add a spacer/decorative node to emulate a space reserve inside a reusable DS component.
**Symptom:** the script fails on the first `frameInsideInstance.appendChild(newNode)`, although reading/resizing/recolouring the existing children of the same instance worked normally before that.
**Pattern:** if a structural edit is needed (not just a property override of an existing node) — `topLevelInstance.detachInstance()` first (returns an ordinary FRAME; loses the link to the master component; agree with the DS file owner, as this breaks future component updates on this specific node). After the detach:
- text nodes change their `id` (new) and often `name` (it stops being the service `#2`/`Title` and becomes equal to the current `characters`) — find the children afresh by name/type; don't reuse old ids/names from pre-detach code.
- `resize` / `layoutSizingHorizontal` on former instance-override children start working predictably (see the neighbouring entry about the ignored resize inside a live instance).
```js
const instance = await figma.getNodeByIdAsync(contentRowTextId);
const detached = instance.detachInstance(); // now an ordinary FRAME — appendChild/structural edits allowed
const spacer = figma.createFrame();
detached.findOne(n => n.name === 'Frame 2147225399').appendChild(spacer); // fine after detach
```

### resize-silently-ignored-on-fill-sized-instance-nested-text
**Principle:** On a TEXT node lying INSIDE a live (not detached) instance and taking part in auto-layout as `layoutSizingHorizontal='FILL'`, calling `node.layoutSizingHorizontal='FIXED'; node.resize(W, H)` throws no error but also doesn't change the actually rendered width — a repeat `.width` read (including in a SEPARATE, definitely non-stale next `use_figma` call) shows the previous FILL-computed value, not the requested `W`. Unlike the ordinary auto-layout rule (`layoutsizing-fill-silent-noop-primary-axis`), the simple `constraints` workaround doesn't help here — the node lies inside an instance subtree where a structural override of text sizing properties apparently isn't applied by this API path at all.
**Symptom:** several different attempts (different orders of `resize` / `layoutSizingHorizontal`, different target widths) consistently return ONE and the same width number regardless of the request — a signal that the mutation doesn't reach this node at all, not that a stale/wrong value is applied.
**Pattern:** don't waste attempts on call order / repeat reads — if the node is inside a live instance and `resize` on it doesn't change `.width` even in a fresh subsequent call, the only working way is `topLevelInstance.detachInstance()`, then resize on the detached copy of the node (see the neighbouring entry about `appendChild`).

### cascade-detach-loses-boolean-component-properties-order-matters
_Extends `detachinstance-cascades-to-instance-ancestors` above — a specific consequence for boolean component properties._
**Principle:** If the work plan on one header/shell instance includes BOTH actions — (a) toggle a boolean component property (e.g. `Show tabs`) and (b) detach a nested child instance (e.g. for reordering children) — the order is strictly important: toggle the boolean prop FIRST, before any detach. Detaching a nested instance cascades the detach to the instance ancestors (see the rule above) — the parent header turns from an INSTANCE into a FRAME, and `setProperties` on it for boolean/variant props becomes entirely unavailable after that (an ordinary FRAME has no `componentProperties`).
**Symptom:** the order "detach first for the button reorder, then try to enable Show tabs" fails — by that moment the parent header is already a FRAME; `setProperties` throws or doesn't exist as a method.
**Pattern:** within one edit plan on an instance with several independent goals — first all `setProperties` / boolean-toggle operations on the INSTANCE ITSELF, only then the detach of its nested children.
```js
// ✅ RIGHT order
const header = await figma.getNodeByIdAsync(headerId);
header.setProperties({ 'Show tabs#244:13': true }); // while header is still an INSTANCE — works
let actionsGroup = header.findOne(n => n.name === 'actions group');
actionsGroup = actionsGroup.detachInstance(); // header becomes a FRAME in cascade — but Show tabs is already applied

// ❌ WRONG order — Show tabs is no longer available
let actionsGroup = header.findOne(n => n.name === 'actions group');
actionsGroup = actionsGroup.detachInstance(); // header became a FRAME
header.setProperties({ 'Show tabs#244:13': true }); // TypeError or no-op — header is no longer an INSTANCE
```

### actions-group-button-reorder-via-wrapper-only-detach
**Principle:** To swap two `button` instances inside a variant wrapper (e.g. the actions group, `Actions=Double`) — where a direct reorder of children is impossible (a structural mutation inside an INSTANCE boundary is blocked) and swapping content/icons between the buttons is risky (see `instance-swap-resets-vector-bindings`) — detach ONLY THE WRAPPER ITSELF (`actionsGroup.detachInstance()`), not the nested button instances. After the detach the wrapper becomes an ordinary FRAME; its direct children (the button instances) remain full DS-linked instances — `insertChild(0, targetButton)` on the wrapper swaps them while fully preserving every button's properties/styles.
**Symptom (the alternative, harder path worth avoiding):** trying to "swap" the text/type/icon between the two buttons instead of reordering — requires finding and recolouring the nested instance-swap icons on both buttons (different inner suffix paths even for visually identical slots); more steps and risk (see `instance-swap-resets-vector-bindings`).
**Pattern:** find the buttons by text content (`c.findOne(n => n.type === 'TEXT' && n.characters === '...')`), detach only the wrapper, `insertChild(0, targetButton)` if it isn't at index zero.
```js
let actionsGroup = header.findOne(n => n.name === 'actions group');
actionsGroup = actionsGroup.detachInstance(); // a FRAME now; the children stay INSTANCEs
const editBtn = actionsGroup.children.find(c => c.findOne(n => n.type === 'TEXT' && n.characters === 'Edit'));
if (actionsGroup.children.findIndex(c => c.id === editBtn.id) !== 0) {
  actionsGroup.insertChild(0, editBtn); // the button with all its properties moves to the first position
}
```

### icon-box-wrapper-shares-mastercomponent-across-different-glyphs
**Principle:** Two working icon-box instances with VISUALLY different glyphs (e.g. a green check-circle vs a red x-circle) may resolve `getMainComponentAsync` to ONE AND THE SAME mainComponent id — a shared generic wrapper component. The glyph itself is switched by an INSTANCE_SWAP property deeper in the nested tree (the icon slot → `Icon/<glyph-name>`), not by choosing a different mainComponent at the icon-box level. It follows that knowing the mainComponent id of one working instance you CANNOT reliably create an instance WITH ANOTHER glyph via `mainComponent.createInstance()` + guessing the nested INSTANCE_SWAP prop — it's more reliable to find an ALREADY WORKING instance with the needed glyph on the page and clone exactly that.
**Symptom:** `checkBox.getMainComponentAsync().id === xBox.getMainComponentAsync().id` — while the instances themselves render unmistakably different icons; trying to derive "which mainComponent gives the red x-circle" from that id alone yields nothing.
**Pattern:** find existing instances of the needed glyphs on the page via `page.findAllWithCriteria({types:['INSTANCE']}).filter(n => n.name === 'icon master component')`, filter by the name of the nested `Icon/<glyph>` child, walk up to the nearest icon-box ancestor, and clone exactly THAT found instance — don't try to assemble the needed glyph from scratch out of the master component.
```js
// Find a working check-circle and x-circle icon-box on the canvas
const iconMasters = page.findAllWithCriteria({ types: ['INSTANCE'] }).filter(n => n.name === 'icon master component');
let checkIconBox = null, xIconBox = null;
for (const im of iconMasters) {
  const glyph = im.children[0]; // 'Icon/check-circle' or 'Icon/x-circle'
  let box = im.parent;
  while (box && box.name !== 'icon-box') box = box.parent;
  if (!checkIconBox && glyph?.name === 'Icon/check-circle' && box) checkIconBox = box;
  if (!xIconBox && glyph?.name === 'Icon/x-circle' && box) xIconBox = box;
}
// Clone the found WORKING instances directly — not the master component
const trueIcon = checkIconBox.clone();
const falseIcon = xIconBox.clone();
```
**Rule within the rule:** the composite IDs of the found instances (`I<pageInstanceId>;256:639`) are valid only WITHIN one `use_figma` call — if the plan is to find the icons in one call and clone in the next, `getNodeByIdAsync` on the saved composite ID often (not always) returns `null` in the second call; it's more reliable to search and use in ONE script, or (if split into 2 calls) re-resolve the composite ID afresh with the same `getNodeByIdAsync` at the start of the second call and only then `.clone()` — don't rely on remembered IDs between calls for composite instance-sublayer paths (see `composite-instance-ids-invalid-across-separate-use-figma-calls`).

### instance-local-override-capability-table
**Principle:** What CAN be overridden locally on an instance: INSTANCE_SWAP properties → `setProperties`; a nested INSTANCE → `swapComponent`; `characters` — yes; textStyle/fill of nested nodes — yes (cross-instance). What CANNOT: a child's VECTOR geometry, layout direction. If what you need isn't on the list → it's a DS update or a new component, not "tweaking the instance".

### verify-mainComponentId-before-setproperties-vs-swap
**Principle:** "A visually similar button treatment" ≠ "the same component". Before changing an instance via `setProperties` (a plan/task often phrases it as "just change the variant"), compare `instanceA.mainComponent.id` and `instanceB.mainComponent.id` — if the IDs match, `setProperties` is indeed enough; if they DIFFER (different component families with non-overlapping property keys, e.g. the text-button component/clear-link vs `button`/filled-primary), `setProperties` won't work at all (the properties simply don't exist on the instance) — you need `instance.swapComponent(newMain)` + a manual transfer of label/icon (the swap does NOT carry overrides across different property-key naming — see `swapcomponent-resets-nested-instance-overrides-to-master-defaults` above in this file).
**Symptom:** the plan/brief describes the target state as "the same button component, just another variant" — to the eye both nodes look like variants of one button (same overall silhouette), but `mainComponent.id` shows two unrelated components; `setProperties` with the donor's property keys ("Style"/"Type"/"Text#22:0") is either a no-op or those keys simply don't exist on the current instance.
**Pattern:** before any "just change the button's variant/colour/size" — one read-only `use_figma` call comparing the `mainComponent.id` of the target node and the donor. Match → `setProperties`. No match → `swapComponent` + transfer by hand: (a) the visible text into the NEW property key, (b) the icon — keep the donor's original INSTANCE_SWAP glyph from BEFORE the swap if the icon's semantics (not just the button colour) must stay, rather than inheriting the new component's default icon.
```js
const target = await figma.getNodeByIdAsync(targetId);
const donor = await figma.getNodeByIdAsync(donorId);
if (target.mainComponent.id === donor.mainComponent.id) {
  target.setProperties({ /* donor's variant props */ });
} else {
  const originalIconSwap = /* capture BEFORE swap, if icon semantics must survive */;
  target.swapComponent(donor.mainComponent);
  target.setProperties({ /* new component's own property keys, not donor's */ });
  // + re-apply originalIconSwap on the new component's icon slot if needed
}
```

### swapcomponent-returns-void-not-new-instance
**Principle:** `instance.swapComponent(newMain)` mutates the node in place and returns `undefined` — like `appendChild` (see `appendchild-returns-void` in the core SKILL.md), the same API class: trying to assign the call's result to a variable and work with it (`const newIcon = oldIcon.swapComponent(newMain); newIcon.findOne(...)`) fails with `TypeError: cannot read property 'findOne' of undefined`. The swap CHANGES the node's id (a new component = a new identity), so the old variable (`oldIcon`) isn't directly usable after the swap either.
**Symptom:** `TypeError: cannot read property 'findOne'/'children'/... of undefined` right on the line after `swapComponent`, while the swap itself has already applied (visible on a repeat read of the parent).
**Pattern:** don't store the return of `swapComponent`. Re-read the new child via `.findOne` from a stable parent right after the call:
```js
// ❌ fails — swapComponent returns undefined, not the new instance
const newIcon = oldIcon.swapComponent(newMain);
newIcon.findOne(n => n.type === 'VECTOR'); // TypeError: cannot read property 'findOne' of undefined

// ✅ swap, then find the child afresh from the parent
oldIcon.swapComponent(newMain);
const swapped = iconSlot.findOne(n => n.type === 'INSTANCE'); // the parent iconSlot is stable; search anew
const vector = swapped.findOne(n => n.type === 'VECTOR');
```

### documented-import-key-not-found-verify-not-remote-before-retrying
_Extends `getnodebyidasync-same-file-instantiation` above — a specific scenario where the task's own documentation causes the confusion._
**Principle:** A component key recorded in a design spec / implementation plan as "confirmed importable" (from an earlier brainstorm session) may turn out wrong/stale — `importComponentByKeyAsync(key)` throws `"Component with key... not found"` not because the component is inaccessible but because it is NOT a library component at all: it's local (same file), and an export/publish key never existed in the described form. The symptom is identical to a "real" library access-rights problem, which provokes the wrong diagnosis (usually "no access to someone else's library") instead of the right one ("it's a local component; a key import isn't needed at all").
**Symptom:** `importComponentByKeyAsync` fails with `not found` for a component that clearly IS on the canvas (visible in existing instances of the same file) — the preceding read-only preflight check (e.g. a task from the plan's preflight section) records this as a clean failure, but the other components of the same plan from ANOTHER (genuinely external) file import fine with the same method — the asymmetry is the first signal that the cause isn't access rights.
**Pattern:** don't retry `importComponentByKeyAsync` with the same/similar key. Find any existing on-canvas instance of that component (by name / visual similarity in a neighbouring already-assembled scenario of the same file) → `instance.getMainComponentAsync()` → `.parent` (if a `COMPONENT_SET`) or the `.id` itself (if a single `COMPONENT`) — the same "resolve the set from a live instance" technique already used for REMOTE components without search access, but the cause here is different: the component isn't remote at all but local — use `getNodeByIdAsync` on the found id directly instead of an import.
```js
// ❌ fails — the key from the plan turned out wrong/stale
const badge = await figma.importComponentByKeyAsync('component-key-placeholder');
// Error: Component with key "component-key-placeholder" not found

// ✅ find the local component through an instance already on the canvas
const sample = await figma.getNodeByIdAsync('I6047:17249;3451:30901'); // a known-good instance from a neighbouring scenario
const main = await sample.getMainComponentAsync();
const set = main.parent; // COMPONENT_SET, local to this file
const target = set.children.find(c => c.name === 'Type=Neutral, Size=S, Paddings=Yes');
// target.id is used directly (getNodeByIdAsync); importComponentByKeyAsync isn't needed
```

### swapcomponent-may-rename-node-search-vectors-from-clone-not-by-name
_Extends `swapcomponent-returns-void-not-new-instance` above — not only a void return but also a renaming risk._
**Principle:** After `iconHost.swapComponent(newMain)` the instance's name MAY change to the new master component's name (if it wasn't explicitly pinned as an instance override) — a repeat lookup of the swapped node via `parent.findOne(n => n.name === '<old-host-name>')` (e.g. `'icon master component'`) risks finding nothing or the wrong node. For subsequent operations on the swapped node (e.g. vector recolouring) — don't rely on the name at all: find the VECTOR/BOOLEAN_OPERATION descendants via `findAll` from a STABLE parent (the clone/instance itself, not the host by name).
**Symptom:** a script that worked in one session (a component where the host name was apparently an instance override and didn't change) fails or silently finds nothing in another component where the host name really changes after the swap — unpredictable from component to component.
**Pattern:**
```js
iconHost.swapComponent(newMain); // void; may have renamed iconHost
// ❌ risky — the name may have changed
const swapped = parent.findOne(n => n.name === 'icon master component');
// ✅ safe — doesn't depend on the name at all
const vecs = clone.findAll(n => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION');
for (const v of vecs) { /* recolor */ }
```

### clone-nested-instance-sublayer-from-live-toplevel-instance-works-reparents-to-page
**Principle:** `.clone()` on a deeply nested instance-sublayer node (e.g. an `icon-button` inside an intermediate variant inside a top-level variant — three levels of INSTANCE nesting) works successfully WITHOUT a structural-mutation error, even when a direct `appendChild`/`insertChild` into the same subtree would be blocked (`Cannot move node. New parent is an instance...`). The clone doesn't land as a sibling next to the original inside the protected subtree — it is reparented onto `figma.currentPage` directly (the same effect as `clone-reparents-to-currentpage-if-source-not-on-currentpage` in the core, but here confirmed specifically for a sublayer at depth 3+ inside a LIVE, not detached, instance).
**Pattern:** this opens the way to "clone the needed visual piece from deep inside an instance without detaching the instance itself" — useful when an exact visual duplicate of an element (an icon, a chip) is needed and detaching the whole tree is excessive/undesirable. Mandatory: `parentForFlow.appendChild(clone)` right after cloning (the clone is physically on the page root, not where it's needed) + `clone.layoutPositioning='AUTO'` if the target parent is auto-layout (the clone may inherit `ABSOLUTE` from a non-auto-layout source context — see `clone-into-autolayout-inherits-stale-layoutpositioning` in `layout-and-geometry.md`).
```js
const originalChevron = master.findOne(n => n.name === 'icon-button'); // 3 levels of INSTANCE nesting
const chevronClone = originalChevron.clone(); // ok, reparented to the page root
originalChevron.visible = false; // hide the original (structurally immovable without a detach)
rowCard.appendChild(chevronClone); // move the clone into the target flow
chevronClone.layoutPositioning = 'AUTO';
```

### check-local-override-before-detaching-protected-instance-for-master-fix
**Principle:** Before editing a shared master component that may have a live instance inside a protected/read-only node (e.g. a reference mockup that must not be mutated), you needn't immediately detach that instance "just in case" — first check whether the specific affected property (`fills`/`characters`/etc.) ALREADY has its own local override on the instance itself, independent of the master's default (the instance's `boundVariables`/`fills` ≠ the same field on `mainComponent` / the default variant). If an override already exists — editing the master's default **provably** won't change that instance's visual result, because the override covers the default regardless of what it now holds; writing to the protected node (even an "innocuous" detach) isn't required at all.
**Symptom:** a live (not detached) INSTANCE of the needed master is found inside a node that by the project's general rule must not be touched (a read-only reference/archive) — intuitively it seems that now either the master can't be fixed at all, or the instance must first be detached (itself a write operation on the protected node, albeit a "freezing" rather than "changing" one).
**Pattern:** read the target property specifically on the instance (`instance.fills[0].boundVariables` etc.) and compare with the same field on the master / default variant BEFORE the edit. Match (the instance simply inherits) → a missing override; a detach/protection isn't needed; fix the master; the instance automatically gets the same (now correct) result — but in general, for a read-only node this is worth confirming with the user. Differ (a local override is already set) → fix the master freely; the instance won't see the change at all, because the override keeps rendering over the new default.
```js
const protectedInstanceText = playgroundNode.findOne(n => n.type === 'TEXT' && n.characters.startsWith('My tokens'));
const masterDefaultText = masterComponent.findOne(n => n.type === 'TEXT' && n.characters.startsWith('My tokens'));
// compare boundVariables.color.id — if DIFFERENT, the instance already has its own override; the master can be fixed without risk to the playground
protectedInstanceText.fills[0].boundVariables.color.id !== masterDefaultText.fills[0].boundVariables.color.id;
```

### appendchild-into-instance-blocked-detach-first-for-decorative-overlay
_The same class as `insertchild-inside-instance-any-depth` above — the case of decorative content absent from the master component._
**Principle:** `parentInstance.appendChild(newChild)` throws `Cannot move node. New parent is an instance or is inside of an instance` if `parentInstance` is a live (not detached) INSTANCE (including a `button` instance inside a cloned COMPONENT donor) — the Plugin API forbids adding NEW child nodes inside an instance subtree (only overrides of the existing structure). For decorative content absent from the master component (e.g. loader dots of a button's busy state over the text), `primaryButtonInstance.detachInstance()` (returns a FRAME) is needed BEFORE `appendChild`.
**Symptom:** a script copied from a working donor (where the analogous `button` was already a FRAME, not an INSTANCE — usually because someone detached it by hand at the pattern's first assembly) fails on a new clone of the same VISUAL component with this error — the structural difference (FRAME vs INSTANCE) isn't visible on the donor's screenshot, only by directly reading `node.type`.
**Pattern:** before `appendChild` of a decorative overlay into a button / any other component instance — check `node.type`; if `INSTANCE`, call `const frame = instance.detachInstance();` and continue with the returned `frame` (not with the original instance variable — it now points at a removed node).
```js
const buttons = clone.findAll(n => n.type === 'INSTANCE' && n.name === 'button');
const primaryButtonInstance = buttons[buttons.length - 1];
const primaryButton = primaryButtonInstance.detachInstance(); // INSTANCE → FRAME, allows appendChild
const dot = dotSource.clone();
primaryButton.appendChild(dot); // works now
```

### resize-fixed-height-instance-child-to-fake-missing-textarea-variant
**Open discrepancy, unresolved:** this recipe resizes a FIXED-height child DIRECTLY on a live (not detached) clone instance and claims success; `minheight-blocked-on-nested-instance-child-detach-first` below, for an outwardly similar scenario (stretching a text input component's nested auto-layout container), requires a mandatory `detachInstance` FIRST, citing the same class of restriction as the general resize/appendChild block on nested instance children. A possible explanation — here ordinary `width`/`height` is resized via `.resize`, there specifically the constraint properties `minHeight`/`maxHeight` (in Figma these are different APIs with different behaviour on instance children), but this hasn't been re-verified live as of this edit. Before relying on this recipe as "resize works without detach" — re-check in a real file whether the structure has changed (perhaps the input box here isn't an INSTANCE child but a FRAME) and don't mix it up with the minHeight/maxHeight case.
**Principle:** When the library has no separate multiline/textarea atom (only a single-line `Input`/the search-input component with `layoutSizingVertical='FIXED'` on the inner "frame" box), you can clone that same instance for a multi-line field and manually `resize` specifically the inner FIXED-height child (not the whole instance) to a larger height — the auto-layout parent (`layoutSizingVertical='HUG'` on the instance itself) recomputes the component's total height correctly, without distorting the inner structure (the label/paddings don't stretch or drift). This isn't a "real" multi-line field (the cursor / text wrapping aren't reproduced — it's a static mockup), but a valid forward-design way to show "this field will be longer" with the same DS atom, without inventing a new raw component.
**Symptom:** the code uses one and the same UI component with a `multiline`/`rows` prop for short and long fields (a single atom at code level), but in the Figma library only the single-line variant corresponds to that atom — intuitively it seems a separate Textarea component is needed, which the file lacks.
**Pattern:** find inside the instance the specific child with `layoutSizingVertical==='FIXED'` (usually the input "box" wrapper, not the top-level instance itself and not the text label above it — the label is usually `HUG`) and resize exactly that; don't touch the instance's own `layoutSizingVertical` (it stays `HUG` to recompute the total height).
```js
const field = sourceInputInstance.clone();
parent.appendChild(field);
field.layoutSizingHorizontal = 'FILL'; // the instance itself — HUG vertically; leave it
const box = field.findOne(n => n.name === 'Search Bar'); // the inner FIXED-height child, not field itself
box.resize(box.width, 96); // was 48 — a visually "multi-line" field with the same atom
```

### component-cascade-instance-vs-manual-clone-inheritance-divergence
**Principle:** When one and the same "result" is reused in several places of a file (e.g. a state frame inserted both into the main section and into a summary cascade/gallery), the reuse method depends on the TYPE of the source node. If the source is a COMPONENT, the cascade usually references it through a live INSTANCE — structural edits on the COMPONENT (reparenting children, changing layoutMode, resize) propagate to the INSTANCE automatically without a separate call. If the source is an ordinary FRAME (not a COMPONENT), it has no master/instance link — reuse in the cascade is necessarily done as a manually cloned copy (a CLONE), which does NOT receive subsequent edits of the source automatically and requires an identical repetition of every mutation.
**Symptom:** a master edit fixes some "copies" of the result for free (because they are live INSTANCEs) while the rest stay in the old form — not because you forgot, but because they are FRAME clones without a link; the difference is visible in the layer name if the file's convention records it, but easy to miss without reading names carefully.
**Pattern:** before a mass edit of "all copies of one result" — check `node.type` of each copy (or the name suffix, if the file's convention records it). INSTANCE copies — edit only the master. CLONE copies — repeat the identical mutation on each explicitly.

### instance-swap-icon-inherits-foreign-library-strokeweight-not-just-color
**Principle:** A Lucide component imported via `importComponentByKeyAsync` / INSTANCE_SWAP carries a FOREIGN (source-library) variable not only on `strokes` (colour — already documented, see `setboundvariableforpaint-instance-child-strokes` in `variables-and-tokens.md`) but SEPARATELY on `strokeWeight` too — these are different bound variables; BOTH must be fixed/rebound, not only the colour. The symptom "the colour is already rebound to the local token and it still looks wrong" almost always means the strokeWeight was left untouched.
**Symptom:** `vector.boundVariables.strokeWeight` resolves to a library variable of the form `VariableID:<hash>/<id>` (NOT `VariableID:<n>:<n>` — the hash prefix = a remote-variable marker); the value is close to the local token in magnitude (e.g. both the foreign and the local give ~1.5), so the discrepancy is invisible to the eye until someone scales the icon (a resize 24→13 px doesn't scale `strokeWeight`, only the vector geometry — the final stroke is visually thicker than in the code, where the whole SVG including the stroke scales with the viewBox).
**Pattern:** after any INSTANCE_SWAP to a Lucide icon — explicitly re-read AND rebind BOTH `vector.boundVariables.strokes` (colour) AND `vector.boundVariables.strokeWeight` to local tokens (an `Icon Stroke` collection, if the file has one); don't assume "since the size is small the whole vector is already scaled correctly". The same foreign strokeWeight var was found on a COMPLETELY unrelated, earlier-built component (a header icon button) — confirming this is a systemic import pattern, not a one-off oversight; in a systematic cleanup (not a point fix) it's worth sweeping all places where Lucide icons are used in the file via an instance-swap slot.
```js
const vec = iconInstance.findOne(n => n.type === 'VECTOR');
vec.setBoundVariable('strokeWeight', localStrokeThinVar); // separately from the colour!
const newStrokes = vec.strokes.map(s => figma.variables.setBoundVariableForPaint(s, 'color', localIconColorVar));
vec.strokes = newStrokes;
```

### master-fills-opacity-fix-does-not-reliably-cascade-strokes-do
**Principle:** A master-level edit `node.strokes = [...]` (e.g. removing a stroke) cascades to nested live INSTANCE copies across the file just like `textStyleId` edits (see text-and-styles.md) — BUT an edit `node.fills = [...]` (in particular adding/changing `opacity` on a paint) **doesn't reliably cascade** even to the very same nodes in the very same copies where strokes just cascaded successfully. This is an asymmetry specifically between `strokes` and `fills`, not a general rule "paint properties don't cascade".
**Symptom:** one and the same script mutates both `strokes` and `fills` on a component's master variant; a repeat read of a downstream copy (the same node, the same nodeId suffix) shows `strokes` updated (an empty array) and `fills[0].opacity` UNCHANGED (the old value), although the master mutation succeeded and is visible on the master itself. Probable cause: if the tiles/nodes were originally created by a script that wrote `fills` DIRECTLY onto every generated instance copy (not only onto the master) at build time — Figma may treat this as "an already explicitly set local override" for `fills` specifically, blocking future cascade for that property, while `strokes` on the same nodes were never touched that way and remain a "silent" (inherited) link.
**Pattern:** after a `fills`/`opacity` edit on the master — ALWAYS re-read at least one downstream copy; don't rely on cached trust in the cascade from earlier sessions (even within one session where the cascade for `strokes`/`textStyleId` was just confirmed). If `fills` didn't cascade — apply the identical mutation explicitly at every place of use (all embedding locations), not only on the master.

### hatch-pattern-must-match-css-gradient-color-stops-exactly-not-approximate-with-stroke-outline
**Principle:** When recreating a CSS `repeating-linear-gradient` (diagonal hatching) through a cloned tile grid (see `mcp-and-environment.md` about the PatternPaint runtime rejection) — the colour pair MUST exactly copy the gradient's colour stops (usually two tones of ONE colour at different opacities, e.g. `var(--accent) 0 4px, color-mix(accent 30%, transparent) 4px 8px`), not be replaced with an approximation like "solid background + a thin outline of the stripe". A thin (1 px) outline on an 8×8 tile visually reads as a noisy crosshatch/moiré on export, not as a clean diagonal stripe — because the contrast between the tile background and the stripe fill is then either absent or rests on the outline-vs-fill difference (usually barely visible if both tones are close), not on the two fills themselves.
**Symptom:** the user looks at the result and says "visually the hatching looks like this" (attaching a screenshot) — a comparison with the production screenshot shows a clearly different pattern character (a noisy crosshatch instead of clean diagonal stripes), although structurally the tiles are in place and the geometry "tiles seamlessly" correctly.
**Pattern:** before colouring the tile geometry — read the exact CSS SOURCE (don't rely on memory / an assumption of "just a hatch pattern"): `grep -rn "repeating-linear-gradient\|hatch\|stripe" src/` → take the EXACT colour stops. The typical implementation: the tile's "background" part (or one of the two pattern regions) = the base accent colour with `opacity` equal to the second CSS stop (0.3 here), the "stripe" region (vector/pentagon) = the same accent colour at 100% opacity, with NO outline at all.
```js
tile.fills = [{ ...tile.fills[0], opacity: 0.3 }];  // tile background = the second CSS stop (accent @ 30%)
vector.fills = [/* stays accent @ 100% — the first CSS stop */];
vector.strokes = [];                                 // no outline needed — the contrast comes from the fill, not the outline
```

### nested-detachinstance-cascades-up-invalidating-all-ancestor-instance-ids
**Principle:** `childNode.detachInstance()` on a node nested 2+ levels inside LIVE instances (e.g. a MetricBarRow instance inside a Histogram instance inside a RangePanel instance) may implicitly detach not only the IMMEDIATE parent but, IN CASCADE, all instance ancestors up to the first non-instance (FRAME/SECTION/PAGE) container — not only the one level already described in the `figma-use` skill ("Parent instance was implicitly detached by a child detachInstance"). Previously saved IDs of ANY of these intermediate ancestors (not only the direct parent) become invalid at the same time.
**Symptom:** a repeat `getNodeByIdAsync(previouslyCapturedRootId)` returns `null` not only for the mutated node's immediate parent but for a node 2 LEVELS HIGHER (in the observed case — a range-panel clone whose ID was captured BEFORE the detach of the nested MetricBarRow), although between that level and the detach point there is an intermediate Histogram instance that also changed its ID.
**Pattern:** before ANY `detachInstance` on a deeply nested node — keep at hand the ID of a stable NON-instance ancestor (an ordinary FRAME wrapper you created yourself, or a SECTION) and after the detach rediscover the whole subtree through it (`wrapper.findOne(...)` / `wrapper.children`), rather than relying on previously saved IDs of any of the intermediate INSTANCE ancestors — even those that "should be" 2–3 levels above the mutation point.
```js
// ❌ the clone's ID captured BEFORE the detach — will become invalid
const clone = source.clone(); wrapper.appendChild(clone);
// ... later: someNestedInstance.detachInstance() somewhere deep inside clone ...
await figma.getNodeByIdAsync(clone.id); // null — even clone.id became invalid

// ✅ rediscovery through a stable non-instance ancestor (wrapper — an ordinary FRAME)
const rediscovered = wrapper.children.find(c => c.name === 'RangePanel');
```

### rescale-throws-explicit-error-where-resize-silently-noops-on-nested-instance
**Principle:** Extends `resize-silently-ignored-on-fill-sized-instance-nested-text` above — the same silent no-op of `resize` reproduces on NON-text nodes too (e.g. an icon INSTANCE), even when `layoutSizingHorizontal`/`layoutSizingVertical` are already `'FIXED'` (not `FILL` — so it's not only about the auto-layout sizing mode). Diagnosis: `node.resize(w, h)` on such a node throws no error and doesn't change `.width`/`.height` (checked even via an immediate re-fetch `getNodeByIdAsync` with the same id in the same call) — while `node.rescale(factor)` on THE SAME node immediately throws an explicit `Error: in rescale: This property cannot be overridden in an instance`, which names the exact cause.
**Symptom:** an icon (2 levels of nesting inside another live INSTANCE) doesn't change size after `resize(12,12)` — neither an explicit exception nor a change of `.width`/`.height`, even on a re-fetch of a fresh handle; looks like a read bug, not a blocked override.
**Pattern:** if `resize` on a node inside an instance "doesn't take" without an error — don't guess or retry with a different call order; call `rescale` on the same node as a DIAGNOSTIC (`rescale` itself may be unacceptable as a solution — it scales proportionally and may not be what's needed, but its error confirms the size property is blocked by the instance override) → `detachInstance` on that node (the detach cascades up the chain of instance ancestors, see `detachinstance-cascades-to-instance-ancestors`) → `resize` on the result works normally, and all "descendant" instances under it must be rediscovered (ids change).
```js
const chevron = await figma.getNodeByIdAsync(id);
chevron.resize(12, 12);
console.log(chevron.width); // still 18 — a silent no-op, not an error

// diagnosis: rescale() names the cause explicitly
chevron.rescale(12 / 18); // Error: in rescale: This property cannot be overridden in an instance

// fix: detach → resize works
let fixed = await figma.getNodeByIdAsync(id);
if (fixed.type === 'INSTANCE') fixed = fixed.detachInstance();
fixed.resize(12, 12); // ✅ 12×12
```

### invisible-instance-visible-false-returns-empty-children-unless-skipinvisibleinstancechildren-disabled
**Principle:** An INSTANCE whose `visible` is driven by `componentPropertyReferences.visible` (a BOOLEAN prop of the parent bound to visibility, e.g. "Show X"), at a currently resolved value of `false`, returns `node.children.length === 0` on a walk — even when the master component of that variant definitely contains children (Label/Value etc.), and `get_metadata` / a structural read of the instance as a whole looks valid (the node is found; `visible: false` reads correctly). The reason — the environment by default treats `figma.skipInvisibleInstanceChildren` as `true` (unlike the standard Plugin API default of `false`), so descendants of currently invisible instances aren't materialised on a walk until the flag is explicitly set to `false`.
**Symptom:** `instance.findOne(n => n.name === 'Label')` throws on the next line `TypeError: cannot read property 'characters' of null` — although the same pattern worked seconds earlier on 3 neighbouring (visible) instances of the same type; a diagnostic `inst.children` shows `[]`, while `inst.visible === false` and `inst.componentPropertyReferences.visible` points at a real boolean prop of the parent (so this visibility mechanism is the cause, not a broken node).
**Pattern:** before walking `.children`/`findOne` on an instance that MAY currently be invisible via a BOOLEAN component property (the typical case — an "optional", hidden-by-default widget row) — put `figma.skipInvisibleInstanceChildren = false;` as the very first line of the script. This is a purely read-only diagnostic setting (doesn't mutate the file) — safe to set whenever potentially hidden instances take part in a walk, even if it wasn't needed for the other (always visible) instances.
```js
// ❌ fails on the 4th (hidden-by-default) row of 4; the first 3 worked fine
for (const id of rowInstanceIds) {
  const inst = await figma.getNodeByIdAsync(id);
  const label = inst.findOne(n => n.name === 'Label'); // null on the invisible instance → TypeError on .characters
}

// ✅ explicitly lift the skip filter BEFORE the walk
figma.skipInvisibleInstanceChildren = false;
for (const id of rowInstanceIds) {
  const inst = await figma.getNodeByIdAsync(id);
  const label = inst.findOne(n => n.name === 'Label' && n.type === 'TEXT'); // now found even on the invisible instance
}
```

### instance-child-remove-throws-use-swapcomponent-which-preserves-geometry
**Principle:** `.remove()` on a node deeply nested in an INSTANCE tree (e.g. a logo/icon inside a nested slot instance of a chip/row) throws `Error: in remove: Removing this node is not allowed` — the Plugin API forbids structural removal of sublayers inside an instance. The working substitute for "change the icon" is `oldNode.swapComponent(newComponent)` on THAT nested node itself (not on the parent/wrapper): it throws no error and, importantly, **itself preserves** the current `x`/`y`/`width`/`height` — the new master component is substituted without a visual jump in size/position, even if it has different default dimensions. An explicit `resize` / `x =` / `y =` RIGHT AFTER the swap isn't needed, and on some nested layers even throws a separate `Error: in set_x: This property cannot be overridden in an instance` (the same protection class as the `rescale` rule above in this file).
**Symptom:** the `remove+createInstance` pattern (the standard "replace the logo with a custom icon") fails on the first call; an attempt to "just in case" re-set position/size after a successful `swapComponent` fails too, although the geometry is already right by then without intervention.
**Pattern:**
```js
// ❌ throws "Removing this node is not allowed" — the node is 2–3 levels inside an INSTANCE
const oldLogo = iconSlot.children[0];
oldLogo.remove();
const newIcon = iconComponent.createInstance();
iconSlot.appendChild(newIcon);

// ✅ swapComponent on the nested node itself — doesn't fail; the geometry is preserved by itself
const oldLogo = iconSlot.children[0];
oldLogo.swapComponent(iconComponent); // done — resize()/x=/y= aren't needed and sometimes throw
```

### findone-crashes-on-deep-instance-subtree-use-non-descending-bfs
**Principle:** Extends `findone-type-guard-first-operand` / `findone-first-match-traversal-order` (SKILL.md) — the built-in `node.findOne(predicate)` can STABLY (not flaky; reproduced 3× in a row on the same node) crash with `"findOne" callback crashed: Error: in get_name: Node with id "..." not found` when the traversal reaches a deeply nested node inside a large INSTANCE subtree (e.g. a logo icon with ~8 nested VECTOR `path` children) — while the same node resolves perfectly directly via `figma.getNodeByIdAsync(thatExactId)` seconds later. Looks like instability of the `findOne` traversal engine itself on large INSTANCE subtrees, not a real absence of the node.
**Symptom:** the error names a specific child id deep inside the logo/icon (pattern `I<instanceId>;<masterId>:<n>`), although the sought name (`'Account info'` / `'Name wrapper'` etc.) physically sits 1–2 levels ABOVE that node in the tree — i.e. findOne shouldn't have descended that deep to find a match, but crashes on the way. Retrying the same script unchanged gives the same error on the same id — not transient network instability.
**Pattern:** to walk a structure where the nodes of interest (wrappers/labels/checkboxes) are always `FRAME`/`GROUP`/`SECTION` etc., and the "rotting" branch is content INSIDE an `INSTANCE` (icons/logos that needn't be inspected themselves, only found and swapped) — write your own BFS/DFS that explicitly doesn't descend into nodes of type `INSTANCE`, stopping at them as leaves:
```js
const CONTAINER_TYPES = new Set(['FRAME','GROUP','SECTION','BOOLEAN_OPERATION','COMPONENT','COMPONENT_SET']); // deliberately WITHOUT 'INSTANCE'
function findByName(root, name) {
  const queue = [...root.children];
  while (queue.length) {
    const n = queue.shift();
    if (n.name === name) return n;
    if (CONTAINER_TYPES.has(n.type)) queue.push(...n.children); // INSTANCE — a leaf; don't go inside
  }
  return null;
}
function findFirstInstance(root) { /* the same walk, stops at the first type === 'INSTANCE' */ }
```
As a side effect it also solves another problem of the same case: semantically identical list rows (rows of one select list) may have unequal nesting depth among themselves (some rows — `Entity info → [logo, Name wrapper]` directly, some — with an intermediate `Icon wrapper`; `CheckBox box` also at varying depth) — a fixed `.children[N]` / a single-level `.children.find` isn't universal for all rows of one list, while a non-descending BFS finds the needed node regardless of which level it landed on in a specific row.

### swap-component-can-change-sublayer-nesting-depth-relative-id-suffix-not-stable
**Principle:** `instance.swapComponent(newMaster)` changes the master component while keeping the instance's position/size (see `instance-child-remove-throws-use-swapcomponent-which-preserves-geometry` above), but does NOT guarantee the same inner structure / nesting depth between the old and new master — even for visually similar icons of one library. After the swap the relative sublayer-ID suffix (`I<instanceId>;<masterPath>`) may become longer/shorter if the new master has a different number of intermediate INSTANCE wrappers.
**Symptom:** before the swap the glyph vector is addressed as `I<id>;251:10322` (1 level of nesting: `check-circle > Icon`). After `swapComponent` to another component of the same library — the same relative path leads nowhere; the real glyph is now at `I<id>;7325:55688;251:10598` (2 levels: the new master is itself wrapped in an intermediate INSTANCE of its own name — `x-circle > x-circle > Icon`). A script that hard-codes the old relative suffix for a follow-up mutation (e.g. recolouring `strokes`) addresses a non-existent/wrong node.
**Pattern:** after any `swapComponent` to a component from a non-identical (even same-library) master — don't trust the old relative sublayer-ID pattern for follow-up edits. Do a separate read-only probe right after the swap (a recursive `describe(instance, depth)` over `CONTAINER_TYPES` returning id/type/fills/strokes of every VECTOR) and address the found IDs directly rather than constructing them by analogy with the old master.
```js
const CONTAINER_TYPES = new Set(['FRAME','COMPONENT','COMPONENT_SET','INSTANCE','GROUP','SECTION','PAGE','BOOLEAN_OPERATION']);
function describe(n, depth) {
  if (depth > 3) return null;
  const entry = { id: n.id, name: n.name, type: n.type };
  if (n.type === 'VECTOR') entry.fills = n.fills, entry.strokes = n.strokes;
  if (CONTAINER_TYPES.has(n.type)) entry.children = n.children.map(c => describe(c, depth + 1));
  return entry;
}
// call right after swapComponent(), BEFORE any recolouring — learn the new master's real depth
```

### top-level-componentproperties-copy-misses-nested-overrides
**Principle:** Copying `componentProperties` between two instances of one master transfers only TOP-level properties. Column captions, badge texts, the content of nested instances live as overrides on nested nodes and aren't transferred by such copying — the new instance silently stays with the master's defaults.
**Symptom:** the structure is assembled right, sizes and variants match, the top-level property `diff` is empty — yet the render shows column headers "Text", badges "Status", links "✳ Label ✳", the pagination shows all pages instead of one.
**Pattern:** transfer overrides by a deterministic subpath mapping: any descendant of an instance has an id of the form `I<instanceId>;<subpath>`, and the subpath is identical for two instances of one master. Walk the source, capture `characters`, `visible` and `componentProperties` of every descendant, apply to `I<dstId>;<the same subpath>`.
```js
const pre = 'I' + src.id + ';';
const items = [];
const walk = n => {
  if (n.id.startsWith(pre)) items.push({ s: n.id.slice(pre.length), type: n.type,
    chars: n.type === 'TEXT' ? n.characters : null, visible: n.visible,
    props: n.type === 'INSTANCE' ? Object.fromEntries(Object.entries(n.componentProperties)
      .filter(([, v]) => typeof v.value !== 'object').map(([k, v]) => [k, v.value])) : null });
  if (CONT.has(n.type)) for (const c of n.children) walk(c);
};
walk(src);
for (const it of items) {
  const t = await figma.getNodeByIdAsync('I' + dst.id + ';' + it.s);
  if (!t) continue;                       // the node is absent — usually because of a swapComponent in the source
  // ...apply props / characters / visible
}
```
**Limits of the technique:** the mapping breaks where a nested instance in the source was **replaced** (`swapComponent`) — the replacement has a different subpath, and the target node isn't found. Such places (a typical example — a select's trailing icon replaced with `chevron-down`) must be transferred by a separate explicit swap.

### minheight-blocked-on-nested-instance-child-detach-first
_See the open caveat in `resize-fixed-height-instance-child-to-fake-missing-textarea-variant` above — this entry is specific to `minHeight`/`maxHeight` (constraint properties), not ordinary `.resize`/`width`/`height`; don't conflate the scopes without re-checking live._
**Principle:** `minHeight`/`maxHeight` on an auto-layout frame lying INSIDE a live (not detached) INSTANCE (e.g. the inner field container inside a DS text-input component) can't be overridden — the same class of restriction as `resize`/`appendChild` on nested instance children (see the neighbouring pitfalls), only for `minHeight`/`maxHeight`.
**Symptom:** `Error: in set_minHeight: This property cannot be overridden in an instance` — fails atomically on an attempt to force a minimum height of a component's nested auto-layout container (the typical case: stretching a single-line text field to a multi-line look without editing the DS component itself).
**Pattern:** set the needed component properties (text/label/visibility) FIRST, while the instance is still live, then `instance.detachInstance()`, and only on the detached copy set `minHeight`/`maxHeight` — the detach as in the other nested-override restrictions of this file.
```js
const inst = master.createInstance();
inst.setProperties({ /* ...component properties first... */ });
const detached = inst.detachInstance();
const frame = Array.isArray(detached) ? detached[0] : detached; // the API may return an array or a node
const innerAutoLayout = frame.findOne(n => n.name === 'Search Bar');
innerAutoLayout.minHeight = 124; // works now — an ordinary FRAME, not an instance boundary
```

### exclude-device-chrome-instances-from-screen-wide-normalisation-sweeps

**Principle:** Mobile and web screen mockups almost always contain instances of **device chrome** — the iOS/Android system status bar, the browser address bar, the gesture bar. Their font (`SF Pro`, `SF Compact`, system `Roboto`) and their colours belong to the OS, not the product. Any blanket pass over the frame — "all text to the product font", "all white fills to the `white` token", "remove foreign paint styles" — by default hits them too, because `findAllWithCriteria` and recursion over `children` go inside instances. The result is syntactically correct and unnoticeable to the eye, but the mockup starts claiming the system status bar is set in the product font and painted with a product token.
**Symptom:** after a "font normalisation" the list holds exactly what was expected (one product font), because the system font migrated too; the mistake is visible only if you specifically compare with the list from BEFORE the pass. The reverse case is symmetric: a blanket binding cleanup inside the chrome also removes the binding you set deliberately on the instance root (the status bar's background is the product header colour showing through under the system glyphs, and it is tokenised correctly).
**Pattern:** before the pass, collect the set of chrome ids (the instance itself + its whole subtree) and exclude it from mutations; decide separately about the instance's **root**, whose background is often the product's even when the content is the system's. Restoring the original system font after a mistake may be impossible: `SF Pro Text` / `SF Compact Display` are often not installed on the system and `loadFontAsync` on them fails — the nearest installed family is put back, i.e. the rollback is inexact. Cheaper not to hit it.
```js
const chrome = new Set();
for (const id of ['<status-bar-instance>', '<url-bar-instance>']) {
  const inst = await figma.getNodeByIdAsync(id);
  if (inst) { chrome.add(inst.id); for (const n of inst.findAll(() => true)) chrome.add(n.id); }
}
// in any blanket pass: if (chrome.has(n.id)) continue;
// the instance root — decide separately; its fill is usually the product's
```

### deep-instance-sublayer-id-not-addressable-walk-from-container
**Principle:** `getNodeByIdAsync` on a deep instance-sublayer id (`I<a>;<b>;<c>;<d>;<e>;<f>` — five or six segments and more) may return `null`, although the same node came up in a traversal's output a minute ago and the id was copied from it verbatim. Short sublayer ids (two or three segments) resolve meanwhile. Such nodes can't be addressed directly — they must be rediscovered by walking from a CONTAINER whose id does resolve (the control's instance itself, the state frame), and identified by a feature, not by id.
**Symptom:** an edit script runs without exception and returns `{mutatedNodeIds: [], results: [{error: 'node not found'}, …]}` for every target node; the preceding read script printed these same ids.
**Pattern:** in the edit go from the container and look for the target node by the property the edit is about (e.g. "a glyph whose `strokes` fill is bound to a variable named X"). This also makes the script idempotent: a repeat run finds nothing and touches nothing.
```js
// ❌ doesn't work on deep sublayer ids
const g = await figma.getNodeByIdAsync('I9457:3984;50:3595;1167:23232;786:50419;847:8436;251:8784');

// ✅ a walk from the control, search by feature
const root = await figma.getNodeByIdAsync('9457:3984');           // the control's instance itself — resolves
const glyphs = walk(root, []).filter(n => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION');
for (const g of glyphs) {
  const p = (g.strokes || []).find(x => x.boundVariables && x.boundVariables.color);
  if (!p) continue;
  const cur = await figma.variables.getVariableByIdAsync(p.boundVariables.color.id);
  if (cur && cur.name === 'text/tertiary') { /* rebind */ }
}
```

### icon-paint-lives-on-strokes-not-fills
**Principle:** In Lucide-family icons (and anything drawn as an outline) the colour lives in `strokes` and `fills` is empty. Reading only `fills` gives `null` and reads as "the glyph isn't painted" — while you were just looking in the wrong place. A capture script must take `paintVar(v.strokes) || paintVar(v.fills)` in exactly this order.
**Symptom:** a read script returns `hex: null, varName: null` on all glyphs in a row, while in the frame they are clearly coloured.
**Pattern:** always `strokes` FIRST, `fills` second — and when rebinding, change the same collection you read from, not both blindly.

### get_metadata-instance-internals-may-show-non-resolvable-placeholder-ids
**Principle:** The XML output of `get_metadata` for nodes nested inside an `<instance>` may show short "ordinary-looking" ids (`0:8`-style) for the instance's inner override children — these are NOT real addressable ids. The real id format for instance-sublayer nodes is `I<instanceId>;<suffix>` (see the composite-id family of pitfalls above in this file). Passing a `0:N`-style id directly into `figma.getNodeByIdAsync` inside a `use_figma` script returns `null`.
**Symptom:** `get_metadata` returns a clean tree with normal-looking ids for TEXT/FRAME children inside an INSTANCE (e.g. the caption text of a reusable drop-zone component). A `use_figma` script built directly on those ids fails with `TypeError: cannot read property '<method>' of null` on the first line touching the node — the id silently resolved to nothing; the lookup itself throws no error.
**Pattern:** don't trust ids read from `get_metadata` for nodes visibly nested inside an `<instance>` tag. Instead resolve the STABLE id of the instance itself (the one `get_metadata` returns correctly — the `<instance id="...">` tag) via `getNodeByIdAsync`, then descend with a live `.findAll`/`.findOne` in THE SAME `use_figma` call (matching by node type + a fragment of text content, not by the id `get_metadata` gave).
```js
// ❌ TypeError: cannot read property 'getRangeFontName' of null — '0:8' doesn't resolve
const captionText = await figma.getNodeByIdAsync('0:8');
captionText.getRangeFontName(0, 1);

// ✅ resolve the instance's stable id, descend with a live walk
const dropzone = await figma.getNodeByIdAsync('4058:3983'); // the <instance> itself — this id is real
const caption = dropzone.findAll(n => n.type === 'TEXT').find(t => t.characters.includes('png'));
caption.getRangeFontName(0, 1); // works
```

### empty-slot-socket-shares-name-with-its-own-default-filler-match-on-double-nesting-not-bare-name
**Principle:** A "socket" component for an instance-swap slot (the wrapper through which an icon/content is substituted into another component) may be named the same as its OWN unfilled default stub (in the observed case the socket and its default stub are both named `design-plug`). A search by the bare instance name (`node.name === 'design-plug'`) matches BOTH states — the empty slot and the correctly filled one (a filled slot is the same socket, just with a real icon INSIDE it rather than that same stub). On a canonical UI-kit file with a hundred+ live, correctly assembled icon slots such a search gives 100% false positives.
**Symptom:** a `findAllWithCriteria` walk by the socket name returns a match on literally every instance using this slot pattern — including definitely working, visually normal ones (confirmed by screenshot: an instance with a working "send"/paperclip icon still appears in the output).
**Pattern:** the real sign of "the slot isn't filled" is nesting: the socket contains a SECOND nested instance of THE SAME socket component (the socket was never replaced with real content). If the socket's direct descendant is an instance of ANOTHER, meaningfully named component (`Icons/Send`, `copy-06`, etc.) — the slot is filled correctly; not a bug. Match "a socket whose immediate child is again a socket", not "any node with this name".
```js
// ❌ false positives on every working slot instance
const broken = page.findAll(n => n.name === 'design-plug');

// ✅ nesting — a socket inside a socket = really unfilled
function findBrokenSlots(host) {
  const broken = [];
  function walk(node, depth, parentWasSocket) {
    if (depth > 10) return;
    const isSocket = node.type === 'INSTANCE' && node.name === 'design-plug';
    if (isSocket && parentWasSocket) broken.push(node.id); // a socket inside a socket — unfilled
    if ('children' in node) for (const c of node.children) walk(c, depth + 1, isSocket);
  }
  walk(host, 0, false);
  return broken;
}
```

### instance-swap-preferredvalues-keys-unresolvable-fallback-to-local-instance
**Principle:** `componentPropertyDefinitions` / `componentProperties` for an INSTANCE_SWAP property may list `preferredValues` (component keys) from an external library not connected in this session — EVERY key fails on `figma.importComponentByKeyAsync(key)` with "Component with key "..." not found", although the file itself clearly uses these icons somewhere (so the library physically existed at publication time; it's just unavailable to the current MCP session). Trying to set the needed icon via `setProperties({...})` on that property in this situation is pointless — the attempt itself won't throw at once, but the result doesn't change (the socket stays at the default).
**Symptom:** a mass resolve of all `preferredValues` (in batches of 10–36 keys) returns `not found` on every single one — not a one-off failure of one key but a systematic failure of the whole library.
**Pattern:** don't bang on a closed library. Find in THE SAME file an already existing, visually correct instance of the needed icon (even if inserted through another, simpler pattern — not through the broken instance-swap slot) and switch the broken node to it directly via `brokenInstance.swapComponent(await figma.getNodeByIdAsync(workingIconMainComponentId))`, bypassing the unavailable property-based selection. Matching sizes (`width`/`height` before and after) is a good signal that the found local component is of the same weight class as the expected one.
```js
// ❌ preferredValues lead into an external library unavailable to the session
host.setProperties({ 'UI Icon#2011:0': preferredValues[0].key }); // silently a no-op; still not found on a separate resolve

// ✅ a direct swapComponent to a local, already-working instance of the same icon
const workingRef = await figma.getNodeByIdAsync('I<known source>;<...>'); // an existing working button with the same icon
const brokenSocket = /* the socket found inside the broken button */;
brokenSocket.swapComponent(await figma.getNodeByIdAsync(workingRef.mainComponent.id));
```

### deeply-nested-instance-property-read-throws-on-phantom-internal-id
**Principle:** On a node living inside a repeatedly cloned / repeatedly rebound tree of instances (INSTANCE inside INSTANCE inside INSTANCE, 4+ levels), reading a simple property (`.visible`, `.name`) on a child node may throw `Error: in get_<prop>: The node with id "X" does not exist` — where `X` matches neither the requested ID nor any known ID in the tree. This isn't a race condition from your own mutation (see `use-figma-stale-reads-after-mutation` above) — the error is caught on the FIRST read, without preceding writes in the same script. `getNodeByIdAsync` on such a path either silently returns `null` (even when the node definitely exists and is visible on the screenshot) or returns an object on which literally any property getter fails.
**Symptom:** the same path to a node (`I<instanceId>;<componentId>`) reads fine in one call (a full recursive dump via a custom function with manual `node.children`), and in the next call the same way — `getNodeByIdAsync` returns `null` or an object with a broken getter on a COMPLETELY DIFFERENT internal id. A manual walk `node.children.find(c => c.name === '...')` may also, at some nesting level, return a node without a single expected child, although an earlier dump of the same tree showed them.
**Pattern:** don't bang on a specific path with repeat attempts (retry/backoff doesn't help — it's not a transient delay). If the task is low-priority (a cosmetic chip/badge, not a structural finding) — compare with a live screenshot: if the element isn't visible on the current render, treat the finding as non-reproducible and don't force a fix of a node that doesn't exist at the moment — a stale write-up / note of an earlier review isn't the file's current state. If the fix is mandatory — don't read/write the deeply nested override directly; instead work at the level of the nearest stable container (the top-level INSTANCE itself, not its Nth nested descendant) via `setProperties` on a component property if one exists, or delete/rebuild the whole top-level instance rather than mutating its internals pointwise.
**Observation:** similar render instability (not only property reads) in the same file and area was recorded independently: `get_screenshot` on individual status-card instances returned degenerate 1×1 px images with perfectly normal node geometry. May be the same class of file instability on repeatedly cloned / heavily overridden instances, not two different bugs.

### appendchild-into-instance-blocked-detach-outer-wrapper-to-compose
_The same class as `insertchild-inside-instance-any-depth` above — the key nuance here: detach ONLY the outer wrapper; the nested component instances stay live._
**Principle:** `parent.appendChild(newNode)` throws `Error: in appendChild: Cannot move node. New parent is an instance or is inside of an instance` if `parent` is any node (even type `FRAME`, not only the `INSTANCE` itself) inside the tree of a live component instance. The block is at the level of "is there an INSTANCE somewhere up the ancestor chain", not at the level of the specific node's type — the master component describing an inner slot as an ordinary `FRAME` (not an `INSTANCE`) doesn't make it available for appendChild while it remains a descendant of an INSTANCE.
**Symptom:** the script fails on the first attempt to add a new node (e.g. a badge or a toggle) as a sibling of existing content inside a cloned / just-created component instance with several nested slot instances (breadcrumb + title + actions group etc.) — while reading (`findOne`, `.children`) of the same subtree works fine; the error is only on structural writes.
**Pattern:** call `outerInstance.detachInstance()` on the TOPMOST instance that must be extended with custom content — NOT on the library's master instance but on the specific instance placed in the mockup. `detachInstance` converts only this top node into an ordinary `FRAME`; ALL nested component instances inside (breadcrumb, tabs, actions group, etc.) remain live instances with their own binding — only the top node's link to its immediate master component is severed. After that `appendChild`/`insertChild` on any descendant (including that very `FRAME` slot) works as on an ordinary tree.
```js
// ❌ fails: Main content is a FRAME but lives inside the INSTANCE navBarInst
mainContentRow.appendChild(newBadgeInstance);
// Error: in appendChild: Cannot move node. New parent is an instance or is inside of an instance

// ✅ detach only the outer wrapper — the nested instances (breadcrumb/tabs/actions) stay live
const navFrame = navBarInst.detachInstance(); // INSTANCE → FRAME, this node only
const mainContentRow = navFrame.findOne(n => n.name === 'Main content'); // the same path, now editable
mainContentRow.appendChild(newBadgeInstance); // works
```
Practical consequence: this explains why existing "detached header" findings in a file (per earlier audits) aren't always the result of careless cloning — sometimes it's the only way to add a non-standard slot (a badge, a toggle, a CTA) to a component with a fixed structure, and the next session shouldn't automatically treat such a detach as a regression without checking whether it carries exactly a custom composition over an otherwise unchanged structure.

### repurposed-slot-empty-wrapper-skews-autolayout-centering
_A continuation of the same recipe as `appendchild-into-instance-blocked-detach-outer-wrapper-to-compose` above — "hid the repurposed cell's old content" ≠ "removed the old content"._ After `detachInstance` on a former `table cell type=Text` (reused for arbitrary new content — e.g. a row of tags instead of Title/Subtitle) it's not enough to hide the original TEXT nodes (`findAll(n => n.type==='TEXT').forEach(t => t.visible=false)`) — if Title/Subtitle are themselves nested in an intermediate wrapper FRAME (the typical DS-component pattern for a "title + subtitle" stack), that wrapper stays `visible: true` and empty but still takes its place in the parent's auto-layout (padding/itemSpacing around it apply as if it had content) — the newly added content ends up shifted from the centre/top to where the empty neighbour left room for it, not where it would sit as the sole real child. A structural check (`primaryAxisAlignItems: 'CENTER'` is indeed set on the parent) doesn't catch it — the problem isn't the set property but an extra participant in the computation.
**Fix:** when repurposing a slot — not `visible=false` on the TEXT leaves but `.remove()` on their OUTERMOST empty wrapper (the level that stops carrying any meaning once its content is hidden). If it's unclear whether an intermediate wrapper exists — walk `rolesCell.children` in full (not only `findAll(TEXT)`) and explicitly check each direct child for "visible but carrying no visible content after my edits" before adding new content next to it.
```js
// ❌ hides the TEXT leaves; leaves the empty wrapper FRAME visible and taking part in the layout
cellShell.findAll(n => n.type === 'TEXT').forEach(t => { t.visible = false; });
cellShell.appendChild(newTagRow); // newTagRow isn't centred — the neighbour above it is empty but not removed

// ✅ remove the whole emptied wrapper
const emptyWrapper = cellShell.children.find(c => c.name === 'text'); // typical wrapper name for a Title+Subtitle stack
if (emptyWrapper) emptyWrapper.remove();
cellShell.appendChild(newTagRow); // now the sole child — centres correctly
```

### resize-on-nested-live-instance-silently-reverts-detach-that-instance-too
**Principle:** `detachInstance` on the OUTER wrapper (see the entry above) doesn't make the entire subtree editable — nested component instances (breadcrumb, the title sub-instance, `tabs`, the actions group, etc.) remain live INSTANCE nodes. If the target edit is not the insertion of a new sibling (for which detaching the outer wrapper suffices) but **a geometry change of a node lying INSIDE one of those nested instances** (e.g. `resize` / `layoutSizingHorizontal` on the title TEXT node nested in the live title sub-instance) — detaching the outer wrapper isn't enough: that specific nested instance must be detached too.
**Symptom:** the script throws no error at all (unlike the `appendChild` block) — `resize` / `layoutSizingHorizontal` run; an immediate readback AFTER the call may even momentarily show the set value, but on the next read (including later in the same script, after a neighbouring mutation) the value rolls back to what the instance-driven internal layout dictates — silently, without warning. Outwardly indistinguishable from "just didn't work": trying alternative API paths (`primaryAxisSizingMode` vs `layoutSizingHorizontal`, a different order of operations, a manual `resize` on the intermediate parent) doesn't help, because the cause isn't the call order but that the mutated node still lives inside an INSTANCE.
**Pattern:** if a geometry/sizing edit didn't take on a node inside an already partly detached tree — check the `node.parent` chain upward to the nearest `type === 'INSTANCE'` (not only to the very top level, which may already have been detached earlier) and detach exactly THAT one too, with the same technique (`nestedInstance.detachInstance()`), before trying to cut/resize anything inside. Diagnosis is cheaper than the cure: before the first geometry edit attempt — `let n = targetNode; while (n) { if (n.type === 'INSTANCE') return 'blocked by: ' + n.name; n = n.parent; }`.
```js
// ❌ the outer wrapper is already detached, but titleNode is still inside the live text-header INSTANCE
textLayout.layoutSizingHorizontal = 'FIXED';
textLayout.resize(300, textLayout.height); // runs without error...
// ...but the readback shows not 300 but some other (usually smaller) number — at once or after the next mutation

// ✅ detach exactly the instance inside which the mutated node lies
const textHeaderInst = leftGroup.findOne(n => n.name === 'text header');
const textHeader = textHeaderInst.type === 'INSTANCE' ? textHeaderInst.detachInstance() : textHeaderInst;
const titleNode = textHeader.findOne(n => n.type === 'TEXT' && n.name === 'Title');
const textLayout = titleNode.parent;
textLayout.layoutSizingHorizontal = 'FIXED';
textLayout.resize(300, textLayout.height); // now holds 300 stably
```

### importcomponentbykeyasync-fails-for-local-unpublished-component
_The same class as `getnodebyidasync-same-file-instantiation` and `documented-import-key-not-found-verify-not-remote-before-retrying` above — three confirmations of one fact (importComponentByKeyAsync doesn't resolve local components) on different projects; here — a short illustration on a cursor component._
**Principle:** `figma.importComponentByKeyAsync(key)` is meant for components published to a team library — for a LOCAL (unpublished) component of the same file it throws `Error: Component with key "..." not found`, even though the component really exists and is instantiated elsewhere in the same file.
**Symptom:** `mainComp.key` resolves fine (`getMainComponentAsync` on an existing instance returns a valid key), but `importComponentByKeyAsync(key)` with that same key fails "not found".
**Pattern:** for a local component — don't import by key; clone the existing node/instance directly: `const src = await figma.getNodeByIdAsync(knownInstanceId); const clone = src.clone(); targetParent.appendChild(clone);` — works cross-page within one file (see `cross-page-appendchild-moves-node` / `clone-reparents-to-currentpage-if-source-not-on-currentpage` in the core SKILL.md).

### instance-children-are-not-a-reliable-inventory-read-the-main-component
**Principle:** Hidden descendants of an INSTANCE don't show up in `children` / `findAll` (the sandbox behaves as if `figma.skipInvisibleInstanceChildren` were `true` — see `invisible-instance-visible-false-returns-empty-children-unless-skipinvisibleinstancechildren-disabled` above for the flag). Read the *main component* to learn what a node contains — the instance only reports what is currently visible. This is one-way: you can set `visible = false` on a nested node, but afterwards you cannot find it again to set it back without the flag.
```js
// The main component has Left(icon, Amount(Caption, Description)), Right(radiobutton), icon_ui.
// The instance reports only Left(Amount(Caption)), Right — every hidden node is missing.
const main = await inst.getMainComponentAsync();   // ask the component, not the instance
```
**Symptom:** a node that visibly exists in the design "isn't there" when walking the instance; a toggle to `visible = false` works, the reverse toggle can't find the node.

### variant-switch-rebuilds-instance-children-lazily-split-the-calls
**Principle:** Switching a variant rebuilds the instance's children lazily — within the same script the new subtree is not there yet, so a `setProperties({State: …})` followed by a search for a node that only the new variant has finds nothing. Split it across two `use_figma` calls, or set the property in the call *before* the one that needs the node. And do not assume variants of one set share a structure: a `State=Active` variant held neither the tick nor the radiobutton that `State=Default` had, so no amount of re-reading would have produced them.
**Symptom:** `inst.setProperties({State: 'Active'}); inst.findOne(n => n.name === 'Tick')` returns `null` in the same call; the same `findOne` in the next call finds it — or never, if the variant genuinely lacks the node.
