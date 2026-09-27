---
name: figma-plugin-api-rules/components-and-variants
description: Read when working with COMPONENT / COMPONENT_SET — creating components, combineAsVariants, the variant grid, componentPropertyDefinitions / addComponentProperty, setProperties, deleting properties, dissolving sets
---

# components-and-variants — use_figma rules

### variant-swap-reveals-extra-slots-avoids-instance-insertion
**Principle:** When one more element (a button/field) must be added inside an INSTANCE boundary and a direct structural insertion (`insertChild`/`appendChild`) fails with `Cannot move node. New parent is an instance or is inside of an instance` — before detaching (see `nested-instance-boundaries-need-individual-detach` in `instances.md`), check the `componentPropertyDefinitions` of the nearest variant component for an axis with MORE slots (e.g. `Actions: Single|Double|Triple` on the wrapper over the buttons). If such a variant exists, `instance.setProperties({Actions:'Double'})` gives 2 ready button slots (initially with the master's placeholder content — `Label`/`Icon/asterisk`) WITHOUT a single structural mutation inside the instance — all that remains is configuring each slot (`setProperties` on Style/Size/Type + retext + INSTANCE_SWAP icons).
**Symptom:** the first instinct — detach the component to insert the button by hand — works, but loses the DS link and requires manual layout/spacing from scratch.
**Pattern:** before a detach — `(await instance.getMainComponentAsync()).parent` (if a `COMPONENT_SET`) → `.componentPropertyDefinitions` → look for a VARIANT axis with numeric/count-like values (`Single/Double/Triple`, `1-action/2-action/3-action`, etc.). If found — swap, don't detach.
```js
const actionsGroup = navBar.findOne(n => n.name === 'actions group');
const mainComp = await actionsGroup.getMainComponentAsync();
const compSet = mainComp.parent; // COMPONENT_SET, componentPropertyDefinitions.Actions.variantOptions = ['Double','Single','Triple']
actionsGroup.setProperties({ Actions: 'Double' }); // now 2 ready button slots, not 1
const buttons = actionsGroup.children.filter(c => c.name === 'button');
buttons[1].setProperties({ Style: 'Fill', Size: 'XS', Type: 'Primary', State: 'Default' }); // configure the new slot
```

### fresh-createinstance-boolean-props-default-to-master-not-to-known-good-usage
**Principle:** `variantComponent.createInstance()` yields an instance with its boolean component properties (`Show X`, `Show Y`) in the master component's DEFAULT state — if somewhere in the file a "canonical" instance of the same variant combination already exists with those properties overridden (e.g. `Show Title=false` to show only the secondary text slot), a fresh `createInstance` doesn't inherit that and renders both text slots visible (or another default combination), even if the component is in practice meant to have one active text slot.
**Symptom:** a new clone of a component with 2+ text children (e.g. `Title`+`Subtitle`) shows an extra text/label that the existing "exemplary" instances of the same component on the page don't have.
**Pattern:** before writing text into such a component — compare the fresh instance's boolean component properties with ANY existing reference instance of the same variant combination (`referenceInstance.componentProperties`), and explicitly duplicate the same `setProperties({...})`, rather than relying on the master's default. Don't guess which text child is "primary" by layer name (`Title` is often not the visible one — see `references/text-and-styles.md` about the hidden `Title` vs the visible `Subtitle` of a `Hint` component).
```js
const reference = await figma.getNodeByIdAsync(knownGoodInstanceId);
const refProps = Object.fromEntries(Object.entries(reference.componentProperties).map(([k,v]) => [k, v.value]));
const fresh = variantComponent.createInstance();
fresh.setProperties({ 'Show Title#1371:9': refProps['Show Title#1371:9'] }); // don't trust the master's default
```

### multi-axis-setproperties-can-silently-hide-instance
**Principle:** `instance.setProperties({...})` with SEVERAL variant axes in one call (e.g. `{State: 'Disabled', 'Show helper in title': 'Yes'}`) can, as a side effect, set `instance.visible = false` and `instance.opacity = <0.6ish>` on the instance itself (not on a child node) — even though neither `visible` nor `opacity` was mentioned in the call. A NEIGHBOURING element may be affected too (e.g. a divider right after the instance in the same auto-layout), also without explicitly taking part in the call.
**Symptom:** a field/row that was supposed to just change its visual variant (e.g. to "Disabled") disappears from the canvas entirely — `get_screenshot` shows content starting from the NEXT field, as if the needed one didn't exist at all. The cause isn't visible in `componentProperties` (they read correctly as set), only in the instance's own `.visible`/`.opacity`.
**Pattern:** after any multi-axis `setProperties` on an existing (not just-created) instance — explicitly re-read and, if needed, forcibly restore `instance.visible = true; instance.opacity = 1;`, and the same for the immediate auto-layout neighbours (divider/spacer); don't assume a variant change doesn't touch the base SceneNode properties.
```js
const field = await figma.getNodeByIdAsync(id);
field.setProperties({ State: 'Disabled', 'Show helper in title': 'Yes' });
// ⚠️ check right after — don't trust the successful return
if (!field.visible || field.opacity < 1) {
  field.visible = true;
  field.opacity = 1;
}
// check the neighbours in the parent auto-layout too (the divider right after the field)
```

### componentpropertyreferences-visible-no-negation
**Principle:** `componentPropertyReferences.visible` doesn't support negation — for inverted visibility create two separate boolean props.

### combineasvariants-reapply-hug
**Principle:** After `combineAsVariants` you must re-set `layoutSizingVertical = 'HUG'` on every variant and on all nested auto-layout containers.
**Symptom:** the variants get a height of ≈ 0.

### component-set-no-autoresize
**Principle:** A COMPONENT_SET doesn't auto-resize to its children after manual positioning of variants — after combine call `set.resize(W, H)` explicitly.

### instance-swap-property-syntax
**Principle:** An INSTANCE_SWAP prop is created as `addComponentProperty(name, 'INSTANCE_SWAP', defaultNodeId, { preferredValues: [{type:'COMPONENT', key:'…'}] })` and bound via `inst.componentPropertyReferences = { mainComponent: 'Prop#xx:y' }`.
```js
set.addComponentProperty('mainComponent', 'INSTANCE_SWAP', defaultNodeId, {
  preferredValues: [{ type: 'COMPONENT', key: '...' }]
});
inst.componentPropertyReferences = { mainComponent: 'Prop#xx:y' };
```

### component-set-appendchild-manual-grid
**Principle:** Adding variants to an existing COMPONENT_SET via `set.appendChild(clone)` triggers no auto-reflow and no auto-resize of the parent — compute the grid by hand, set `child.x/y`, then `set.resize(W, H)`.

### addcomponentproperty-lookup-real-key
**Principle:** `addComponentProperty` doesn't return the final prop ID — after the call read `componentPropertyDefinitions` and find the real key by name prefix: `Object.keys(defs).find(k => k.startsWith('PropName'))`.

### setproperties-key-formats
**Principle:** `setProperties` accepts shorthand keys only for VARIANT properties (`'Status': 'active'`); TEXT and BOOLEAN require the full key with a suffix (`'Title#191:0'`).
**Pattern:** the reliable pattern: first read `componentPropertyDefinitions` and find the current key by prefix (`Object.keys(defs).find(k => k.startsWith('Title'))`).
```js
// Inspection first → get the current keys
const defs = set.componentPropertyDefinitions;
const titleKey = Object.keys(defs).find(k => k.startsWith('Title'));
inst.setProperties({ [titleKey]: 'Heading', 'Status': 'active' });
```

### componentset-no-fills-strokes
**Principle:** A COMPONENT_SET is a structural container for variants and should have no fills/strokes: a hard-coded fill or stroke on it is visually covered by the variants but pollutes the component and can give unexpected rendering in edge cases.
**Pattern:** on inspection check `cs.fills.length` and `cs.strokes.length`; fix — `cs.fills = []; cs.strokes = [];`

### componentpropertydefinitions-existing-errors
**Principle:** `componentPropertyDefinitions` / `componentProperties` fail with "Component set has existing errors" if the variant matrix is inconsistent — all variants of a CS must declare the same set of `Key=Value` properties in their names.
**Symptom:** the error "Component set has existing errors" when reading `componentPropertyDefinitions`; the typical case — a new variant added with a new dimension absent from the old variants' names.
**Pattern:** diagnosis — compare the key sets in all variants' names; fix — rename the "old" variants, adding the missing dimension.
```js
// Diagnosis: find the variants missing the needed dimension
const cs = await figma.getNodeByIdAsync('SET_ID');
const allKeys = new Set();
cs.children.forEach(v => v.name.split(', ').forEach(p => allKeys.add(p.split('=')[0])));
const broken = cs.children.filter(v => {
  const keys = v.name.split(', ').map(p => p.split('=')[0]);
  return [...allKeys].some(k => !keys.includes(k));
});
// broken[] — the variants lacking dimensions

// Fix: add the missing dimension to the name
for (const v of broken) v.name = 'Variant=field, ' + v.name;
// After the rename componentPropertyDefinitions works again
```

### componentpropertyreferences-lost-on-variant-copy
**Principle:** `componentPropertyReferences` aren't copied when duplicating a variant inside an existing COMPONENT_SET — the copy's nodes lose their binding to the properties, and `setProperties` on instances updates `componentProperties` while the render stays at the default.
**Symptom:** the API shows updated `componentProperties` while the rendered text doesn't change — the bug is visible only visually; the copied nodes' `componentPropertyReferences === {}`.
**Pattern:** restore by hand on every copied node: `node.componentPropertyReferences = { characters: 'Prop#id', visible: 'Prop#id' }`.
```js
// For a text node with a characters prop:
msgNode.componentPropertyReferences = { characters: 'Message#796:0' };

// For any node with a visible prop:
actionNode.componentPropertyReferences = { visible: 'Has Action#796:1', characters: 'Action#796:2' };
dismissNode.componentPropertyReferences = { visible: 'Has Dismiss#796:3' };
```

### clone-variant-lands-on-page
**Principle:** `clone` of a variant inside a COMPONENT_SET creates the copy as a sibling at the set's parent level (usually the PAGE), not inside the CS — the clone becomes a variant only after an explicit `cs.appendChild(clone)`, after which the variantOptions update automatically from the clone's name.
**Symptom:** after `clone` `cs.children.length` doesn't change; the clone hangs on the page as a standalone COMPONENT.
**Pattern:** clone → set a name by the `Prop=Value,...` convention → `cs.appendChild(clone)` → set x/y inside the set.
```js
// ❌ WRONG — the clone is on the PAGE, not in the CS
const clone = accentVariant.clone();
clone.name = 'Size=md, Variant=theme, State=Off';
// cs.children.length → unchanged!

// ✅ RIGHT — explicit addition to the CS
const clone = accentVariant.clone();
clone.name = 'Size=md, Variant=theme, State=Off';
cs.appendChild(clone);   // ← mandatory
clone.x = targetX;
clone.y = targetY;
// cs.componentPropertyDefinitions['Variant'].variantOptions → now includes 'theme'
```

### componentpropertyreferences-after-appendchild
**Principle:** `componentPropertyReferences` on the sublayer nodes of a cloned variant become available only after `cs.appendChild(clone)` — before the clone is registered in the COMPONENT_SET the assignment fails, although the refs aren't lost, just not yet registered.
**Symptom:** the error "Could not find a component property with name: '...#N:M'" when setting refs before appendChild.
**Pattern:** the order is strict: clone → `cs.appendChild(clone)` → `componentPropertyReferences = {...}`.
```js
// ❌ WRONG — setting refs before appendChild
const clone = variant.clone();
clone.name = 'Size=sm, Variant=theme, State=Off';
const titleNode = clone.findOne(n => n.name === 'Title' && n.type === 'TEXT');
titleNode.componentPropertyReferences = { visible: 'Has Title#89:0' }; // ERROR!

// ✅ RIGHT — appendChild first, refs after
const clone = variant.clone();
clone.name = 'Size=sm, Variant=theme, State=Off';
cs.appendChild(clone);   // this first
const titleNode = clone.findOne(n => n.name === 'Title' && n.type === 'TEXT');
titleNode.componentPropertyReferences = { visible: 'Has Title#89:0' }; // works
```

### setproperties-variant-value-case-sensitive
**Principle:** VARIANT prop values in `setProperties` are case-sensitive and must literally match the CS variant names — before a write read `componentPropertyDefinitions[*].variantOptions` and use exactly those strings, without assumptions about case.
**Symptom:** the error "Unable to find a variant with those property values" on a wrong-case value (e.g. `'default'` instead of `'Default'`).
**Pattern:** the verify pattern: filter `componentPropertyDefinitions` by `type === 'VARIANT'` and take `variantOptions` as the only source of allowed values.
```js
// ❌ WRONG — fails silently/throws
btnInst.setProperties({
  'Variant': 'clear',
  'Color': 'neutral',
  'Size': 'sm',
  'State': 'default'  // lowercase — will NOT find the variant with State=Default
});
// Error: "Unable to find a variant with those property values"

// ✅ RIGHT — exact case match
btnInst.setProperties({
  'Variant': 'clear',
  'Color': 'neutral',
  'Size': 'sm',
  'State': 'Default'  // capitalised as in the CS variant names
});

// Verify pattern (mandatory before a write):
Object.entries(cs.componentPropertyDefinitions)
  .filter(([k, v]) => v.type === 'VARIANT')
  .map(([k, v]) => ({ prop: k, options: v.variantOptions }));
// → { prop: 'State', options: ['Default', 'Hover', 'Pressed', 'Disabled', 'Loading'] }
// Use EXACTLY these strings in setProperties.
```

### orphaned-component-props-no-render
**Principle:** If `setProperties` on an instance writes a value without error but the render doesn't change — the prop is orphaned: defined in `componentPropertyDefinitions` but bound to no node via `componentPropertyReferences`. The specific case below — the real text is rendered through a NESTED INSTANCE with its own prop key, not through a direct TEXT node with empty `componentPropertyReferences` (that case is `setproperties-orphaned-prop-silent-noop` below — a different mechanism under the same symptom heading).
**Symptom:** `instance.componentProperties[...].value` changes, but the text/visibility on the canvas stays the same.
**Pattern:** diagnosis: compare the target node's `componentPropertyReferences` with the prop key; workaround — call `setProperties` on the nested instance that actually renders the value (for test frames only; the proper fix is to bind or delete the orphaned prop).
```js
// Diagnosis:
const cp = instance.componentProperties;
// If cp['Amount#355:6'].value changes but the text stays — the prop is orphaned
// Find what the text inside is actually bound to:
const textNode = instance.findOne(n => n.name === 'Amount' && n.type === 'TEXT');
return textNode?.componentPropertyReferences; // {} or { characters: 'Amount#316:0' } → a different prop!

// Workaround: call setProperties directly on the nested instance that renders the text:
// Instead of instance.setProperties({ 'Amount#355:6': '500 000' }) — doesn't work
const nestedInst = testInstance.findOne(n => n.name === 'Amount' && n.type === 'INSTANCE');
const amtKey = Object.keys(nestedInst.componentProperties).find(k => k.startsWith('Amount'));
nestedInst.setProperties({ [amtKey]: '500 000' }); // works
```

### createtext-autoname-breaks-name-wiring
**Principle:** A TEXT node without an explicitly set `name` is auto-named from its `characters` content, so subsequent wiring of `componentPropertyReferences` via `findOne(n => n.name === '...')` silently misses — set `name` right at master creation, before `clone`/`combineAsVariants` (only TEXT is affected; ELLIPSE/INSTANCE aren't).
**Symptom:** `setProperties` writes the value into `componentProperties` (visible in the API), but the render stays at the default — the symptom is identical to an orphaned prop; the cause differs.
**Pattern:** fallback when wiring clones — look up the node by `n.type === 'TEXT'`, not by name, then set `name` and `componentPropertyReferences`.
```js
// ❌ WRONG — the node gets the name 'Label text', wiring by name='Label' returns null
const t = figma.createText();
t.characters = 'Label text';
// ... later: variant.findOne(n => n.name === 'Label')  → null, the ref isn't set

// ✅ RIGHT — set name BEFORE cloning/binding, OR look up by type
const t = figma.createText();
t.name = 'Label';
t.characters = 'Label text';
// Fallback when wiring clones: take by type, not by name —
const txt = variant.findAll(n => n.type === 'TEXT')[0];
txt.name = 'Label';
txt.componentPropertyReferences = { characters: 'Label#xx:y' };
```

### setproperties-orphaned-prop-silent-noop
**Adjacent rule (don't confuse):** `orphaned-component-props-no-render` above — that case is solved through a nested INSTANCE with its own key; this one — the target is a direct TEXT node with empty `componentPropertyReferences`; the fix differs (mutate `characters` directly, not search for a nested instance).
**Principle:** If a text component prop is orphaned (the TEXT node's `componentPropertyReferences` is empty), `setProperties` writes the value into `componentProperties` but the render doesn't change — find the real TEXT node by type/name and mutate `characters` directly.
**Symptom:** `componentProperties` shows the prop's new value, but the render shows the old text.
**Pattern:** the canonical text edit: `findOne(TEXT by name)` → `getStyledTextSegments(['fontName'])` → `loadFontAsync` per segment → `characters = value`.
```js
// ❌ setProperties silently doesn't work — the prop is orphaned
item.setProperties({ 'Title#319:0': 'Enabled' });
// item.componentProperties['Title#319:0'].value === 'Enabled', but the render shows the old text

// ✅ Find the real TEXT node and mutate characters directly
const titleNode = item.findOne(n => n.type === 'TEXT' && n.name === 'Title');
const segs = titleNode.getStyledTextSegments(['fontName']);
for (const s of segs) await figma.loadFontAsync(s.fontName);
titleNode.characters = 'Enabled';
```

### variantoptions-ceiling-check-first
**Principle:** Before designing for N slots/states check the real ceiling of the DS component's variants via `componentPropertyDefinitions[prop].variantOptions` — the needed variant may not exist, and the compromise (what to drop) must be chosen BEFORE assembly, not after.
```js
// Before designing N icons in a cell — check the real variant ceiling
const defs = cellComponentSet.componentPropertyDefinitions;
return defs['type'].variantOptions; // ['Text','Status',...,'3-actions','2-actions','1-action',...]
// 4-actions is absent — find the compromise (which icon to drop) BEFORE assembly, not after
```

### numeric-variant-prop-position-mismatch
**Principle:** A numeric VARIANT prop value (e.g. `Selected: '7'`) needn't correspond 1:1 to the element's visual position in a list — after `setProperties` find the real child with the needed value in its own `componentProperties` (e.g. `State.value === 'Selected'`) and check its text label by fact, rather than counting by the order of text nodes.
**Symptom:** setting a number counted by the order of labels in the tree highlights the wrong item (hidden/duplicated labels give a deceptive traversal order).

### setproperties-partial-axis-combination-missing
**Principle:** A multi-axis component set defines only the actually needed axis combinations (not the full Cartesian product) — `setProperties` changing one VARIANT axis fails with `Unable to find a variant with those property values` if the resulting combination with the current values of the other axes doesn't exist.
**Symptom:** `Unable to find a variant with those property values` with a valid value of the axis itself.
**Pattern:** before `setProperties` read `set.children.map(v => v.name)` (the really existing combinations), find a variant with the needed value of the sought axis, and pass ALL its axes in one call rather than changing one at a time.
```js
// ❌ fails — "Expanded=No, Sub-items=1" doesn't exist as a combination in this CS
item.setProperties({ Expanded: 'No' }); // Sub-items stays '1' from the previous state

// ✅ first check the really existing variants
const existing = set.children.filter(v => v.name.includes('Expanded=No')).map(v => v.name);
// → ["Expanded=No, Sub-items=3, State=Default", "Expanded=No, Sub-items=3, State=Selected"]
// Sub-items=3 is the only valid value at Expanded=No for this CS

// ✅ pass all matching axes in one call
item.setProperties({ Expanded: 'No', 'Sub-items': '3', State: 'Default' });
```

### convention-discovery-before-extending-component
**Principle:** Before extending a component or adding a variant — check how it's already done in the DS file (variant properties of neighbouring components, the naming convention of inner nodes, which semantic variables are used, the format of the Tests block). The file's convention outranks general best practices; 30 seconds of read-only inspection save hours of rework.

### promotion-local-master-to-library-manual-step
**Principle:** Copying a component master (with variants/props/nested library instances) into another file is possible ONLY by manual copy-paste in the Figma UI (preserves the structure + relinks the subscribed nested instances) + a manual Publish — the Plugin API neither copies masters between files nor publishes (`clone` — same-file only; `importComponentByKeyAsync` — only a read-only reference to an already published component). Pattern: the user pastes + Publishes → the agent verifies (the source library of nested instances — see `resolved-instance-not-guarantee-correct-source-library` in `instances.md`; 0 local-token duplicates) → the agent rebinds by keys.

### pattern-a-overlay-vs-pattern-b-variant-axis
**Principle:** A state that changes only decoration (a badge, a checkmark, a highlight) — a BOOLEAN property + an ABSOLUTE overlay layer (Pattern A); start a new VARIANT axis only when the state changes the structure/layout of the children (Pattern B). Fewer axes — less COMPONENT_SET combinatorics.
**Pattern:** before adding an axis: "does the children's structure change?" No → BOOLEAN + overlay; yes → VARIANT.

### variant-size-unstable-between-sessions
**Principle:** The sizes of HUG variants are unstable between sessions — Figma recomputes HUG on the next file open; what was "fitted" by eye isn't to be considered pinned.
**Symptom:** the COMPONENT_SET aligned yesterday came apart today without anyone's edits.

### file-wide-component-search-via-root-children
**Principle:** Do the "does the component exist in the file" check via `search_design_system` + a loop over `figma.root.children` (all pages), not `page.findAll` — the component may live on another page; a single-page search gives a false "no".

### combineasvariants-requires-component-not-frame
**Principle:** `figma.combineAsVariants(nodes, parent)` throws `Cannot move node. A COMPONENT_SET node cannot have children of type other than COMPONENT` if the passed nodes are ordinary FRAMEs (e.g. assembled by hand via `figma.createAutoLayout`) rather than COMPONENTs. Before combining, convert each FRAME candidate via `figma.createComponentFromNode(frame)` — it changes the node's type to COMPONENT in place (same id/content), after which combineAsVariants accepts the result.
**Symptom:** `Error: in combineAsVariants: Cannot move node. A COMPONENT_SET node cannot have children of type other than COMPONENT` — fails even when the nodes' structure/content is fully ready.
```js
// ❌ WRONG — c1..c4 are FRAMEs (from figma.createAutoLayout())
const set = figma.combineAsVariants([c1, c2, c3, c4], page); // Error

// ✅ RIGHT — convert to COMPONENT before combining
const comp1 = figma.createComponentFromNode(c1);
const comp2 = figma.createComponentFromNode(c2);
const comp3 = figma.createComponentFromNode(c3);
const comp4 = figma.createComponentFromNode(c4);
const set = figma.combineAsVariants([comp1, comp2, comp3, comp4], page);
```

### decorative-instance-siblings-break-type-only-filter
**Principle:** A list container (e.g. the action menu with the menu-item component items) may contain decorative INSTANCE siblings (a pointer cursor for a screenshot, a hover illustration, etc.) that pass the `n.type === 'INSTANCE'` filter but aren't logical list elements — accessing their nested structure (`item.findOne(n => n.name === 'item-action')`) returns `null` and crashes the script on an attempt to read `componentProperties`. Filter by type **AND** by the specific component name (`n.type === 'INSTANCE' && n.name === 'item-action+divider'`), not by type alone.
**Symptom:** `TypeError: cannot read property 'componentProperties' of null` while walking a supposedly homogeneous list of INSTANCE children; the number of found "elements" is 1 more than expected.
**Pattern:** diagnosis — compare the actual `children.map(c => ({name, type}))` with the expectation BEFORE filtering; decoy nodes are usually named descriptively ("Cursors / Pointer", "Tooltips") and sit in the tree next to the real elements of the same type.
```js
// ❌ WRONG — catches the decoy instance "Cursors / Pointer" along with the 3 real items
const items = menu.children.filter(n => n.type === 'INSTANCE');
// items.length === 4; one of them holds no 'item-action' → null.componentProperties on the walk

// ✅ RIGHT — filter by type AND by name
const items = menu.children.filter(n => n.type === 'INSTANCE' && n.name === 'item-action+divider');
```

### accessing-property-on-removed-node-throws
**Principle:** After `node.remove()` the node ceases to exist in the document — any subsequent access to its properties (`.parent`, `.x`, `.children`, etc.) in the same script throws `get_parent: The node with id "..." does not exist` (or the analogous error for another property), rather than returning `null`/`undefined`. If after a conditional `remove` you need to return a flag/data about what was removed — save the needed value (id, name, a factory flag) into a variable BEFORE calling `remove`; don't read it off the already-removed node in the `return`.
**Symptom:** the script fails not at the `remove` itself but later — on an innocent-looking `return`/logging line where the script tries to read `.parent` or another property of a node removed conditionally a few lines earlier.
```js
// ❌ WRONG — remove() ran, then return reads .parent of the removed node
let wrapperRemoved = false;
if (wrapperParent.children.length === 0) {
  wrapperParent.remove();
  wrapperRemoved = true;
}
return { wrapperRemoved: wrapperParent.parent === null }; // Error: node does not exist

// ✅ RIGHT — the boolean flag computed once, before remove(); the node isn't touched again
let wrapperRemoved = false;
if (wrapperParent.children.length === 0) {
  wrapperParent.remove();
  wrapperRemoved = true;
}
return { wrapperRemoved }; // just a variable, not a repeat access to the node
```

### create-component-from-node-changes-own-id-preserves-children-ids
**Principle:** `figma.createComponentFromNode(frame)` does NOT preserve the node's own id (despite the docs' wording "preserving all of its properties and children") — the top-level id changes to a new one (checked empirically: `idPreserved: false`), but the ids of ALL child nodes stay unchanged.
**Symptom:** existing connectors/references targeting the top-level id of the converted node stop resolving after conversion (a node with that id no longer exists) — while connectors targeting ANY child node of that frame keep working without edits.
**Pattern:** before conversion — collect the list of connectors/references targeting specifically the top-level id (not the children); after conversion — retarget only those to the new `component.id`; the child references needn't be touched.

### connector-endpoint-rejects-virtual-instance-descendant-node
**Principle:** `connectorStart`/`connectorEnd` does NOT accept the id of a node that is a virtual descendant of an INSTANCE (a composite id of the form `I<instanceId>;<masterChildId>`, generated by instantiation) — even though the node really exists and resolves via `getNodeByIdAsync`/`findOne`. The setter throws `Error: in set_connectorEnd: Invalid endpointNodeId`, although exactly the same id reads without errors.
**Symptom:** a connector that used to target a child node of a FRAME (e.g. a "modal header" inside a flat FRAME, where the node was first-class — not virtual) breaks after the FRAME is replaced with an INSTANCE of the same component when trying to retarget to "the same" child node — because inside the INSTANCE it's now a virtual descendant, not a first-class node.
**Pattern:** a connector to an INSTANCE — target the root id of the INSTANCE itself (`instance.id`), not its inner child nodes. Visually the arrow points at the edge of the whole instance rather than a specific inner element (e.g. the header) — an expected limitation, not a script bug.
```js
// ❌ WRONG — a virtual descendant of the instance as the endpoint
const modalHeader = instance.findOne(n => n.name === 'modal header'); // resolves fine
connector.connectorEnd = { endpointNodeId: modalHeader.id, magnet: 'TOP' }; // Error: Invalid endpointNodeId

// ✅ RIGHT — the instance root as the endpoint
connector.connectorEnd = { endpointNodeId: instance.id, magnet: 'TOP' };
```

### setproperties-single-axis-swap-silently-resets-unrelated-state-axis
**Principle:** `instance.setProperties({ Type: 'Negative' })` on a button instance whose `State` was already `'Default'` before the call may, after the swap, silently return `State: 'Disabled'` — even when only ONE variant axis (`Type`) is changed, and `State` wasn't passed and "should" have stayed as is. It looks as though the variant resolver picks the closest match inside the COMPONENT_SET not strictly by the unspecified axes, but sometimes falls back to the set's default for the new Type branch.
**Symptom:** the button looks "faded"/muted after the colour/type swap — to the eye it resembles a different (lighter) shade of the same semantic colour, while it's actually a full `State=Disabled` variant, not another tone of `State=Default`.
**Pattern:** after any `setProperties` changing one axis (`Type`/`Style`/`Size`), explicitly re-read AND re-set `State` if it matters for the scene — don't assume the unspecified axes stay the same:
```js
btn.setProperties({ Type: 'Negative' });
// ⚠️ State may have silently become 'Disabled' — don't trust; re-read
if (btn.componentProperties['State'].value !== 'Default') {
  btn.setProperties({ State: 'Default' });
}
```
**Adjacent rule (don't confuse):** `variant-switch-retains-matching-property-overrides` (the core SKILL.md) — that one is about keeping a FOREIGN override value of a matching property from the previous variant; this one is about a silent RESET to the set's default on an unspecified axis. The symptom is similar (an unexpected state after the swap); the cause is the opposite.

### combineasvariants-auto-positions-siblings-side-by-side
**Principle:** `figma.combineAsVariants([comp1, comp2,...], parent)` automatically lays the passed COMPONENT nodes out side by side along x (in array order, without overlap) inside the resulting COMPONENT_SET — it doesn't leave them at their original/overlapping coordinates. Hence a consequence for `component-set-no-autoresize` (above): the set's `resize` must be computed from the actual bounding box of ALL children (`Math.max(...children.map(v => v.x + v.width))`), not from the width of one (e.g. the first/original) variant — otherwise the set's frame clips all variants but the first on render, although structurally (`get_metadata`) everything is correct.
**Symptom:** `get_screenshot` on a COMPONENT_SET after `resize(singleVariantWidth, maxHeight)` shows only the first (leftmost) variant — the second/third physically exist per `get_metadata` (correct x/y/width, e.g. x=378 for the second with a first-variant width of 338), but are visually clipped by the set's own boundary.
**Pattern:**
```js
const set = figma.combineAsVariants([comp1, comp2], parent);
// ✅ compute the resize from fact, not from one variant's width
const maxRight = Math.max(...set.children.map(v => v.x + v.width));
const maxBottom = Math.max(...set.children.map(v => v.y + v.height));
set.resize(maxRight, maxBottom);
```

### component-set-none-layout-appendchild-stale-bounds-1x1-screenshot
**Principle:** `component-set-no-autoresize` (above) applies not only after `combineAsVariants` but also to a plain `cs.appendChild(newVariant)` on an existing `COMPONENT_SET` with `layoutMode='NONE'` — if the new variant is positioned (x/y) outside the current `cs.width`/`cs.height`, the CS doesn't recompute its bounds by itself. The symptom is far more serious than simple visual clipping: `get_screenshot` on the NEW child node ITSELF (not the CS) returns a **degenerate 1×1 px PNG without a single error**, while `get_metadata` / a direct property read of the node (`visible:true`, correct `x/y/width/height`, a correct children structure) looks perfectly normal — the bug can't be caught by a structural read, only by a screenshot.
**Symptom:** a just-created, correctly filled (checked via `get_metadata`) variant returns `{"width":1,"height":1}` on `get_screenshot`, although its real `width`/`height` (e.g. 60×60) is correct in the structure.
**Pattern:** right after `cs.appendChild(newVariant)` on a CS with `layoutMode==='NONE'` — recompute and apply the actual bbox BEFORE the first screenshot attempt:
```js
const maxRight = Math.max(...cs.children.map(v => v.x + v.width));
const maxBottom = Math.max(...cs.children.map(v => v.y + v.height));
cs.resizeWithoutConstraints(maxRight + pad, maxBottom + pad);
```

### exposedinstance-does-not-surface-nested-props-to-parent-componentproperties
**Principle:** `nestedInstance.isExposedInstance = true` (the documented official API for "Nested instances" — the component properties of a nested instance are "surfaced" to the containing instance's level) **does not make** the prop available via `parentInstance.componentProperties`/`setProperties` on a freshly created instance of the parent — tested empirically: after setting the flag on a nested instance inside a master component, `parentComponent.componentPropertyDefinitions` doesn't change, and `freshInstance.componentProperties` contains the nested instance's prop neither under its original key nor under any new one.
**Symptom:** the official docs and the d.ts state outright "these nested instances' component properties will be visible at the top level" — yet a programmatic check (`createInstance` → `.componentProperties`) shows no new prop; the feature probably concerns only the display in Figma's UI properties panel on MANUAL selection of an instance, not the programmatic API contract.
**Pattern:** don't rely on `isExposedInstance` as a way to surface a nested instance's TEXT/BOOLEAN prop as a top-level prop of the parent programmatically. The working substitute — find the needed nested instance directly (`parentInstance.findOne(n => n.name === 'NestedName' && n.type === 'INSTANCE')`) and call `.setProperties({...})` ON IT, using its OWN property key (the same one visible in `nestedInstance.componentProperties` on inspection) — this works reliably regardless of `isExposedInstance`. Nor can `componentPropertyReferences` be set directly on the nested instance itself (`Unrecognized key(s) in object` when trying to map it straight onto a foreign key), let alone on a TEXT sublayer INSIDE the instance (`Cannot set component property references on instance sublayer`) — the only working way to "parameterise a nested instance from outside" is a pointwise `setProperties` on the instance itself at every place of use, not a single prop binding on the parent.
```js
// ❌ doesn't work as expected — the prop doesn't appear on parentInstance
nestedClearButtonInstance.isExposedInstance = true;
// parentComponent.componentPropertyDefinitions — unchanged
// freshParentInstance.componentProperties — no new key

// ✅ the working pattern — find and configure the nested instance pointwise in every Tests/composition case
const clearInst = filterFooterInstance.findOne(n => n.name === 'Clear' && n.type === 'INSTANCE');
clearInst.setProperties({ 'Label#4074:0': 'Cancel' }); // the nested Button instance's own native key
```

### componenttoframe-manual-conversion-drops-visual-properties-not-just-fills
**Principle:** The Plugin API has no direct way to turn a `COMPONENT` into an ordinary `FRAME` — the working pattern: create a new `figma.createFrame`, copy the needed properties, move the children (`appendChild` in a loop), delete the old `COMPONENT`. Copying "the needed properties" is intuitively limited to the auto-layout config (`layoutMode` / sizing modes / padding / spacing) and `fills` — but `cornerRadius` / `topLeftRadius` & co / `effects` (shadows) / `strokes` / `clipsContent` stay on the OLD node and are **silently lost** unless copied explicitly: the new `FRAME` is created with defaults (`cornerRadius:0`, `effects:[]`); no warning or error occurs.
**Symptom:** the script runs without errors; `get_metadata` / `get_screenshot` right after the conversion look "broadly similar" (auto-layout, sizes, children — all in place), so the bug isn't caught by the usual post-mutation check — it's found only on a FRESH visual comparison with a reference, usually by a person noticing unprompted that the modals lost their radii and shadows. The same failure recurred INDEPENDENTLY on an adjacent technique — creating a new auto-layout `FRAME` wrapper (`figma.createAutoLayout`) around existing content (e.g. a "modal column" when splitting a frame into two columns) also requires manually carrying `cornerRadius` / `effects` / `clipsContent` over from the old container if the new wrapper MUST visually look like the former integral block — here too the default "transparent, no shadows, no radius" is silently substituted for the source's real style.
**Pattern:** on ANY manual rebuild of a container (component→frame conversion, wrapping existing content in a new auto-layout wrapper) — check not only the layout properties but the full visual set: `cornerRadius` (or the 4 corners if mixed), `effects` (shadows/blurs, including `boundVariables` inside — copy the object whole with `JSON.parse(JSON.stringify(...))`; the variable binding survives), `strokes` + `strokeWeight`, `clipsContent`. If a definitely correct NEIGHBOURING example of the same visual pattern (untouched by the conversion) is at hand — treat it as the source of truth and compare line by line, rather than relying on memory of what "should have been copied".
```js
// ❌ incomplete — only auto-layout + fills; the shadow/radius are lost silently
const frame = figma.createFrame();
frame.fills = comp.fills;
frame.layoutMode = comp.layoutMode; /* ...sizing modes... */

// ✅ the full set of visual properties — checked against a reference neighbouring node
frame.cornerRadius = reference.cornerRadius;
frame.effects = JSON.parse(JSON.stringify(reference.effects)); // boundVariables inside survive the cloning
frame.strokes = JSON.parse(JSON.stringify(reference.strokes));
frame.clipsContent = reference.clipsContent;
```

### variant-switch-can-silently-replace-text-content-not-just-styling
**Principle:** Switching a COMPONENT_SET instance's variant via `setProperties` can replace a TEXT layer's content with the NEW variant's default, even if the real application code uses this variant axis exclusively for STYLING (a class/colour), not for content — if the master variant being switched to originally had different demo text hard-coded (e.g. a placeholder word instead of a real value) on the same named TEXT layer.
**Symptom:** after `row.setProperties({Kind: 'best'})` the `Label` text layer, which used to show real data (`"12–34"`), started showing `"Top"` — while the React code (`ChartRow.tsx`) renders `{row.label}` identically for ANY `kind` value, i.e. no such text change happens in the app at all; it's a purely Figma-side artefact: the `Kind=best` master variant was originally assembled/tested with static demo text in place of Label, and the variant switch substituted exactly that default instead of carrying the text over from the source variant.
**Pattern:** after ANY `setProperties` switch of a variant axis that per the code affects ONLY styling — explicitly re-read ALL TEXT nodes inside the instance and compare with the expected content (don't assume "since the axis is stylistic, the text won't be touched"); if they diverged — restore the needed text by hand right after the switch, in the same script, before `detachInstance` / further mutations.
```js
const labelBefore = row.findOne(n => n.name === 'Label').characters; // "12–34"
row.setProperties({ Kind: 'best' });
const labelAfter = row.findOne(n => n.name === 'Label').characters; // "Top" — unexpectedly different!
if (labelAfter !== labelBefore) {
  const label = row.findOne(n => n.name === 'Label');
  await figma.loadFontAsync(label.fontName);
  label.characters = labelBefore; // restore the real data
}
```

### local-unpublished-component-importbykeyasync-not-found-despite-matching-key
**Principle:** `figma.importComponentByKeyAsync(key)` / `importComponentSetByKeyAsync(key)` resolve ONLY components published to a team library — on a component living locally in the current file (never published as a library one) they throw `Error: Component with key "..." not found`, even if the passed `key` literally matches the live node's `node.key` (Figma assigns a `key` to every component regardless of publication, but the import-by-key method ignores that fact). For local components the right access is a direct `figma.getNodeByIdAsync(componentId)` (the id, not the key) or `instance.getMainComponentAsync()` from an existing instance.
**Symptom:** a read-only sanity check ("verify that all needed DS keys still import") fails on specific keys, although the same keys, re-obtained via `chipInstance.getMainComponentAsync()` on a live instance of the same component, match the expected ones 1:1 — creating a false impression of "the key went stale/drifted", while the key is right; it's the import method that's unsuitable for unpublished components.
**Pattern:** before treating a key-based sanity check as a failure (drift / a plan error) — determine whether the component is local or library: if it's used somewhere on the canvas as an INSTANCE, obtain it via `existingInstance.getMainComponentAsync()` and compare `.key`/`.id` directly instead of retrying the import by key.
```js
// ❌ throws "Component with key ... not found" — the component is local, unpublished
const chipComp = await figma.importComponentByKeyAsync('component-key-placeholder');

// ✅ the same component, accessed directly by the live node's id (or via an existing instance)
const chipComp = await figma.getNodeByIdAsync('116:790');
// or: (await existingChipInstance.getMainComponentAsync()).key === 'component-key-placeholder' // confirms the match
```

### variant-switch-carries-over-the-whole-state-of-the-previous-first-child

**Principle:** `setProperties({<axis>: '<another value>'})` on a component-set instance carries onto the new child node **the whole set of the previous one's overrides** matching by property key — not only boolean and text (see `variant-switch-retains-matching-property-overrides` in the core), but also **`visible`, the INSTANCE_SWAP value and the paint binding of a nested VECTOR**. If the former first child had `visible` off, the new single child arrives invisible; its label, glyph and glyph colour will be the former one's.
**Symptom:** after switching `Actions: Double → Single` the actions group is left with one button, but the button is invisible, labelled with the donor text ("Actions"), carries a foreign glyph (a filter icon instead of a plus icon) and its colour (`icon/primary` instead of `icon/inverse`). Each of the four defects shows separately and is cured separately; a property read right after the switch reports them honestly, but only if you know what to look at.
**Pattern:** after a variant switch go through a checklist of the new child's state, comparing with a reference instance of the same component on another screen: `visible` → the icons' boolean props → the text directly by the canonical recipe (not via a text prop) → the INSTANCE_SWAP value via `importComponentByKeyAsync` → recolouring the VECTOR stroke via `setBoundVariableForPaint`. **Verify by render, not by property reads.**
```js
btn.visible = true;
btn.setProperties({ 'Show icon-left#36:0': true, 'Show icon-right#36:25': false });
for (const s of label.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(s.fontName);
label.characters = 'Confirm action';
const plus = await figma.importComponentByKeyAsync('<key of the reference glyph>');
iconMaster.setProperties({ 'Icon library#786:2': plus.id });
const st = vec.strokes.map(p => ({ ...p }));
st[0] = figma.variables.setBoundVariableForPaint(st[0], 'color', iconInverse);
vec.strokes = st;
```

**Adjacent — the reason the switch was made in the first place:** a hidden (`visible:false`) child in a variant that declares N buttons **breaks the neighbour's rendering**. The layout reserves the hidden one's slot (the hidden one's width + `itemSpacing`), and draws the visible button **at the hidden one's dimensions** — on screen the button is cut off at the right edge with a flat cut and the label is truncated. Property reads meanwhile show correct values (`width: 162`, label `106`, `textTruncation: DISABLED`), i.e. the defect exists only in the raster. Diagnostic sign: the width measured on the render equals the width of the **hidden** child, and the visible one's offset equals `hidden width + itemSpacing`. Cured not by an override but by switching the group to the variant with the right number of buttons.

### importcomponentsetbykeyasync-required-for-set-level-key
**Principle:** `search_design_system` for assets with `assetType: "component_set"` returns the `componentKey` of the SET itself — that key doesn't resolve via `figma.importComponentByKeyAsync` (which expects the key of a specific variant component); a separate `figma.importComponentSetByKeyAsync(key)` is needed.
**Symptom:** `Error: Component with key "..." not found` — while the same key is visible in `search_design_system` as a valid existing asset with `assetType: "component_set"`.
**Pattern:**
```js
// ❌ fails — this is a COMPONENT_SET key, not a single variant's
const comp = await figma.importComponentByKeyAsync(setKeyFromSearch);

// ✅ for component_set assets — a separate method; returns a ComponentSetNode with all variant children
const set = await figma.importComponentSetByKeyAsync(setKeyFromSearch);
const target = set.children.find(c => c.variantProperties.State === 'Default'); // pick the needed variant from the set
```

### componentset-key-string-can-resolve-to-wrong-set-verify-via-live-instance
**Principle:** A `componentSetKey` read from ONE live instance (`instance.mainComponent.parent.key`) and then passed into `figma.importComponentSetByKeyAsync(key)` in the NEXT call may resolve to a DIFFERENT component set with a different property schema — not the one the key was read from. The same class of problem as `verify-variable-ids-before-write` in the core SKILL.md (for variables), but here confirmed for component keys too: two different components with similar naming ("Input") in one file can return indistinguishable-looking keys in different read contexts, and `importComponentSetByKeyAsync` on such a key silently gives the "neighbouring" set with a different `componentPropertyDefinitions` (different variant axes, the expected TEXT property missing).
**Symptom:** `instance.setProperties({'Text in field#3533:0': '...'})` on an instance created from `importComponentSetByKeyAsync(key).children.find(...)` fails with `Could not find a component property with name: 'Text in field#3533:0'` — while THE SAME key, read from an instance of that needed component already on the canvas, shows exactly that property in `componentPropertyDefinitions`. Digging shows different `componentSetId`s / different `variantOptions` (e.g. an extra `label` axis or a missing `Error` State variant) with a formally identical key string.
**Pattern:** for a component already used somewhere in the file (almost always the case for form fields/inputs/buttons) — don't trust a key obtained in a previous call; instead of `importComponentSetByKeyAsync(key)` resolve the set directly from a LIVE instance in the CURRENT script: `(await figma.getNodeByIdAsync(knownGoodInstanceId)).mainComponent.parent` (the synchronous `.mainComponent` sometimes returns `null` for not-yet-loaded nodes — then `await instance.getMainComponentAsync()`). Even more reliable, when a neighbouring instance of the same component is cloned/used in the current script anyway — just `.clone()` it instead of `master.createInstance()`: cloning an instance doesn't depend on key resolution at all.
```js
// ❌ a key inherited from a past read call — may point elsewhere
const inputSet = await figma.importComponentSetByKeyAsync('component-set-key-placeholder');
inst.setProperties({ 'Text in field#3533:0': '...' }); // Error: property not found

// ✅ resolve from a live, definitely correct instance right in this script
const knownGoodInst = await figma.getNodeByIdAsync('4059:3810'); // a known correct node on the confirmation form
const inputMaster = await figma.getNodeByIdAsync(knownGoodInst.mainComponent.id); // or .mainComponent directly
const inst2 = inputMaster.createInstance();
inst2.setProperties({ 'Text in field#3533:0': '...' }); // works
```

### componentpropertydefinitions-throws-on-variant-component-use-parent-set
**Principle:** `variantComponent.componentPropertyDefinitions` throws if called on a SPECIFIC variant component (a child inside a COMPONENT_SET) — definitions are read only from the COMPONENT_SET itself (the parent) or from a non-variant COMPONENT.
**Symptom:** `Error: in get_componentPropertyDefinitions: Can only get component property definitions of a component set or non-variant component` — fails atomically, rolling back the whole script (including mutations already made in the same call).
**Pattern:** `const defs = variantComponent.parent.componentPropertyDefinitions;` (when `variantComponent.parent.type === 'COMPONENT_SET'`), not `variantComponent.componentPropertyDefinitions` directly. Practically — keep the imported SET itself at hand (not only the chosen variant), precisely for this field.

### mega-component-non-text-variants-hide-nested-instance-with-own-property-key

**Principle:** In a mega-component with a `type` axis (e.g. a `table cell` with `type=Text/Status/Progress/Link/Icon/...`), top-level componentProperty keys like `Title#256:0` belong ONLY to the text/simple variants. The `Status`/`Progress`/`Link` variants (and probably other non-trivial types) render their content through a NESTED INSTANCE with its OWN set of componentProperties, under a different key: the status badge → `Text#125:3` (+ a `Type` variant for colour), the labelled progress bar → `Amount#281:3`, the text-button component (inside `type=Link`) → `Text#147:1`. Calling `outerInstance.setProperties({ 'Title#256:0': value })` on such a variant throws no error and doesn't roll the script back — the property simply doesn't exist on this instance in this variant, so a `try/catch` around `setProperties` silently swallows the mismatch, and the visible text stays the master component's default placeholder (`x%`, `Status`, `Label`).
**Symptom:** after a script that passed without a single error, the render shows the master's literal placeholders — `x%` on the progress bar, `Status` on the badge, `✳ Label ✳` on the link — instead of the passed values; structurally everything looks right (the `type` variant is correct), but the visible text matches none of the script's arguments.
**Pattern:** for every non-trivial `type` variant first read its inner structure (`variantMaster.children` recursively, with `componentProperties` on every `INSTANCE`) EXACTLY ONCE to learn the real nested component and its property key, and cache that mapping for all further cells of the same table — don't expect the text visible in a screenshot to hint by itself which property didn't work.
```js
// ❌ passes without error, but the text stays at the default "x%"/"Status"/"Label"
progressCell.setProperties({ 'Title#256:0': '68%' });
statusCell.setProperties({ 'Title#256:0': 'Enabled' });
linkCell.setProperties({ 'Title#256:0': 'f2940de4-…' });

// ✅ find the nested instance and its OWN key
const bar = progressCell.findOne(n => n.type === 'INSTANCE' && n.name === 'Progress Bar / Labeled');
bar.setProperties({ 'Amount#281:3': '68%' });

const badge = statusCell.findOne(n => n.type === 'INSTANCE' && n.name === 'Badge / Status');
badge.setProperties({ 'Text#125:3': 'Enabled', Type: 'Positive' });

const textBtn = linkCell.findOne(n => n.type === 'INSTANCE' && n.name === 'Text button');
textBtn.setProperties({ 'Text#147:1': 'f2940de4-…' });
```

### api-created-frames-block-component-property-references
**Principle:** `componentPropertyReferences` can't be set on frames created via the API (`createFrame`/`createAutoLayout`) — the attempt throws "Can only set component property references on symbol sublayer".
**Pattern:** keep the binding on the component's original child node (the symbol sublayer), and control visibility/structure by hand (e.g. collapsing a HUG frame — see `createautolayout-default-size-hug-collapse` in the core SKILL.md), not via `componentPropertyReferences` on an API-created container.
_(moved from the core SKILL.md — it was nested inside an unrelated rule about HUG collapse)_

### componentpropertyreferences-scope-limited-to-visible-characters-instance-swap
**Principle:** `componentPropertyReferences` supports binding only for `visible` / `characters` / instance-swap — effects like a font swap, a transparent background, opacity are NOT bindable through this mechanism, even if a boolean component property was created for them.
**Symptom:** a boolean-toggled effect is needed (e.g. "Mono" / "Grouped" / "Apply Disabled" — a font change, a transparent background), but it can't be bound via `componentPropertyReferences` directly.
**Pattern:** implement such effects as a VARIANT axis (`false`/`true` as variant values), not as a native BOOLEAN component property with a direct `componentPropertyReferences` binding.

### deleted-variant-lives-on-as-parentless-master-while-any-instance-points-at-it
**Principle:** Deleting a variant from a COMPONENT_SET doesn't destroy the master while at least one instance points at it — the node stays alive but **parentless**: `getMainComponentAsync` returns a valid COMPONENT, `m.remote === false`, while walking `m.parent` immediately gives `null`, and it's on no page. Its name meanwhile flattens (`control/Input/Loading` instead of `Loading` inside the set), so in logs and dumps it looks like a separate component, not a deleted variant.
**Symptom:** after a variant cleanup the set shows N states while a showcase/spread keeps rendering N+1 — the extra cell looks perfectly normal. The reverse of the same: a "find the component by name" script finds `control/Input/Loading` through an instance but finds it on no page, and it's easy to conclude "the variant was pulled out of the set by hand", while it was deleted. Another consequence: `set.children.length` and the actual number of live masters diverge, and there is no `getLocalTextStyles`-like summary for components, so the discrepancy isn't highlighted by anything.
**Pattern:** distinguish "pulled out of the set" from "deleted" by the parent, not the name: walk up from the master to the root and check that the top node is a `DOCUMENT`. Check showcases by reading the master's name for every cell, not by screenshot. To kill the phantom — remove the last instance (after that the node is collected by the garbage collector by itself).
```js
// a live master vs the phantom of a deleted variant
const m = await inst.getMainComponentAsync();
let root = m; while (root.parent) root = root.parent;
const phantom = root.type !== 'DOCUMENT';   // the master is deleted; only this instance holds it
```

### deleting-a-component-property-resets-every-instance-override
**Principle:** Deleting a component property resets every instance's override to the component default. Removing 26 TEXT and BOOLEAN properties across three components rewrote 21 instances: a mandatory notice started reading "Unanswered letters", a per-day chart tooltip started showing per-pair figures, hidden rows and switched-off swatches became visible again. The override was *stored as the property value*, so deleting the property deleted the value with it.
**Pattern:** snapshot every instance's content before deleting a property, then re-apply it by editing the nested nodes.
```js
// Snapshot BEFORE any deleteComponentProperty call — after it, the values are gone.
const snap = [];
for (const i of await comp.getInstancesAsync())
  snap.push({ inst: i, texts: i.findAll(n => n.type === 'TEXT').map(t => t.characters),
              hidden: i.findAll(n => n.visible === false).map(n => n.name) });
```

### component-properties-are-owned-by-the-set-dissolving-it-drops-them
**Principle:** Properties are owned by the `COMPONENT_SET`, not by the variant. Dissolving a set — moving the last variant out to the page so the empty set auto-deletes — drops all of its properties; `componentPropertyDefinitions` on the surviving component comes back `{}`. Instance *content* survives this one (overrides degrade into plain node overrides), which makes the two traps easy to confuse with `deleting-a-component-property-resets-every-instance-override`: one keeps the content and loses the API, the other loses the content.
**Pattern:** re-create the properties on the standalone component and re-wire `componentPropertyReferences`.

### emptied-component-set-deletes-itself-mid-script
**Principle:** An emptied `COMPONENT_SET` deletes itself mid-script. Read `description`, `x`, `y` and anything else you need off the set *before* moving variants out; touching it afterwards throws `The node with id "…" does not exist`. The same mechanism as a GROUP losing its last child (see `group-auto-dissolves-on-last-child-removal-remove-call-throws` in `layout-and-geometry.md`).
