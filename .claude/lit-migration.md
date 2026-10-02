# Lit Migration — hmi's Element Rules

Read this file **before** creating or modifying anything under `src/elements/`,
beside the composed element rules: *Elements*, *Element styles* and *Forms and
overlays*, in `.agents/lit-*.md`. Those hold what every Lit element follows.
This file holds what hmi adds to them, and what the React → Lit migration needs
until v6. It keeps the numbers R1 to R12, which the migration documents cite,
and never repeats a composed rule.

The reasoning behind the rules is in `docs/migration/adr-0001-lit-web-components.md`
and `adr-0002-agentcfg-adoption.md`; pattern-by-pattern examples are in
`docs/migration/translation-guide.md`; the order of work is in
`docs/migration/README.md` §6 and `docs/migration/tracker.md`.

Vocabulary: `<kebab>` is the element name (`area-chart`), `<Pascal>` its class
stem (`AreaChart`), the tag is `hmi-<kebab>`, the class is `Hmi<Pascal>`,
`<camel>` is the legacy React file stem (`areaChart`).

---

## R1 — Element shape

- An element's folder holds six files: the four *Element files* lists, plus
  `<kebab>.react.ts` (R10) and `<kebab>.stories.ts`.
- Runtime imports are limited to `lit`, `lit/decorators.js`,
  `lit/directives/*.js`, and `src/elements/shared/*`. **Lit is the only runtime
  dependency of the library.** No positioning libraries, no date libraries, no
  icon packages: hand-roll everything else.
- `tsconfig.app.json` already has the `target: ES2022` and
  `useDefineForClassFields: true` that standard decorators need, and
  `noImplicitOverride`.
- No imports between `src/elements/` and `src/components/` in either direction.
  The React tree is frozen until the v6 flip and then deleted.
- `src/components/<camel>.tsx` is **never edited** by a migration PR, except for
  one line: its JSDoc gains `@deprecated`, naming the wrapper that replaces it.

## R2 — Props → properties

| React | Lit |
|-------|-----|
| `variant?: 'a' \| 'b'` | `@property({ reflect: true }) accessor variant: Variant = 'a';` |
| `disabled?: boolean` | `@property({ type: Boolean, reflect: true }) accessor disabled = false;` |
| `size?: number` | `@property({ type: Number }) accessor size = 0;` |
| `items: Item[]`, `range: { … }` | `@property({ type: Array, attribute: false }) accessor items: readonly Item[] = [];` |
| multi-word prop `asIcon` | `@property({ type: Boolean, reflect: true, attribute: 'as-icon' })` |
| `children` | default `<slot>` |
| `className`, `style`, `...rest`, `ref`, `as` | dropped — the host element carries class, style, `id`, `aria-*`; the host *is* the element |
| function-typed prop | forbidden (R5), except the tier-(c) render property of R6, declared `attribute: false` |

- Document the property route for hosts that can only set string attributes:
  in Dioxus, set `el.disabled` from `onmounted`.
- **Presence semantics flip the v5 behaviour, and the bare attribute is the
  dangerous case.** r2wc parses the attribute string, and
  `src/web-components.ts` maps an empty-string value to `false`, so today the
  bare attribute is **off**:

  | Markup | r2wc (v5) | Lit (v6) |
  |--------|-----------|----------|
  | `<hmi-x foo>` | **false** | **true** |
  | `<hmi-x foo="true">` | true | true |
  | `<hmi-x foo="false">` | false | **true** |

  Existing HTML that reads `<hmi-button disabled>` silently changes meaning —
  no error, no type change. React consumers are unaffected: the wrapper prop
  stays a real boolean. Every element with a boolean prop **must** list this in
  its PR's behaviour-differences section; see `hmi-code`
  ([#122](https://github.com/ninoverse/hmi-components/pull/122)) for the wording.
- Controlled and uncontrolled collapse into the element owning its state.
  Provide `defaultValue`/`defaultChecked` only where the React component had
  them (form reset uses them). No `isControlled` mirror.

## R3 — State and lifecycle

| React | Lit |
|-------|-----|
| `useState` | `@state() private accessor x` |
| `useRef` to a DOM node | `@query('.sel') private accessor el!: HTMLElement` (or `@queryAll`, `@queryAssignedElements`) |
| `useRef` to a mutable value | private class field `#x` |
| `useMemo` / `useCallback` | plain getters / private methods; cache in `willUpdate()` only when measured |
| `useId` | literal ids inside the shadow root (`id="label"`); they are unique per root |
| `useEffect(() => …, [])` | `firstUpdated()` when it needs the DOM, `connectedCallback()` for listeners |
| `useEffect(…, [dep])` | `updated(changed)` guarded by `changed.has('dep')`; derive values in `willUpdate(changed)` |
| `useLayoutEffect` | `updated()` (runs before paint) |
| effect cleanup | `disconnectedCallback()` |
| `createPortal` | never — `<dialog>` or `popover` inside the element's own shadow root (R8) |
| `ResizeObserver` | observe `this` in `connectedCallback`, disconnect in `disconnectedCallback` |
| `document.body.style.overflow` lock | none — `<dialog>.showModal()` provides it |

- The element with focus is `activeElementDeep(this.getRootNode())` from
  `src/elements/shared/dom.ts`, never `document.activeElement`.
- Server rendering must hold for hmi's supported hosts: Next.js, Angular SSR and
  Dioxus fullstack.

## R4 — Styles

- `static override styles = [baseStyles, styles];`. `baseStyles`
  (`src/elements/shared/base.styles.ts`) provides
  `:host { --_base: var(--hmi-base, 8px); box-sizing: border-box; }`,
  `*, *::before, *::after { box-sizing: border-box; }`,
  `:host([hidden]) { display: none !important; }` and the `:focus-visible`
  ring. Elements never repeat these.
- **Units.** `rem` is forbidden in `src/elements/`. Translate `Nrem` to
  `calc(var(--_base) * N)` (`0.125rem` → `calc(var(--_base) * 0.125)`);
  font-relative values use `em`. Theme tokens (`--space-*`, `--corner-*`) are
  used as-is; they are expressed against the same base.
- **Selectors from the legacy CSS.** BEM block `.button` → `:host`; modifier
  `.button--primary` → `:host([variant='primary'])`; sub-element `.button__dot`
  → `.dot` carrying `part="dot"`. Keyframes and
  `@media (prefers-reduced-motion: reduce)` blocks move verbatim.
- **Themes.** The theme axes, `data-theme`, `data-structure` and
  `data-material` on `<html>`, never appear in an element's selectors. A theme
  that needs a per-element hook adds a token, `--<element>-<prop>`, to the theme
  file. The hooks defined so far, with defaults in `constants.css` and overrides
  in `structure/journal.css`: `--list-divider-style`, `--progress-track-border`,
  `--stat-rule`, `--switch-thumb-shadow`.
- **Panel-like elements** (card, navbar, sidebar, popover, hover-card,
  context-menu, toast, modal, drawer, command-palette, combobox listbox, menu,
  chart-tooltip) expose `part="panel"` and paint from `--panel-bg` (or
  `--panel-bg-strong` for dialogs, drawers and listboxes), `--panel-border`,
  `--panel-filter` (a `backdrop-filter` value), `--panel-ink-bg` and
  `--panel-accent-bg` (defaults in `constants.css`, overridden by the material
  themes). Shadows keep coming from `--elevation-*`. They embed the shared
  liquid filter template (`renderLiquidFilter()` from
  `src/elements/shared/panel.ts`) so the liquid material's
  `--panel-filter: url('#liquid-glass') …` resolves inside the root.
- Part names come from this list: `base`, `label`, `icon`, `panel`, `control`,
  `input`, `list`, `item`, `header`, `body`, `footer`.

## R5 — Events

- The helper is `emit(this, 'hmi-<name>', detail, { cancelable })` from
  `src/elements/shared/events.ts`.
- A React callback's event is `hmi-` plus the kebab-case of its name without
  `on`: `onChange` → `hmi-change`, `onOpenChange` → `hmi-open-change`,
  `onExpandedChange` → `hmi-expanded-change`.
- The catalog of names and `detail` shapes is in
  `docs/migration/translation-guide.md` §6: `hmi-change { value }`,
  `hmi-open-change { open }`, `hmi-close { reason? }` and the rest. A new event
  reuses a catalog name before inventing one.
- `hmi-input` per keystroke and `hmi-change` on commit is a documented change
  from v5, where `onChange` fired on every keystroke.

## R6 — Rich content and render functions

- **Singular** `ReactNode` props become named slots: `title` → `<slot name="title">`,
  `leftIcon` → `left-icon`, `rightIcon` → `right-icon`, `actions` → `actions`,
  `trigger` → `trigger`, `icon` → `icon`, `description` → `description`.
- **Array items** carry icons as a string key into the library's icon map, or as
  inline SVG rendered with `unsafeSVG` **only** from that library-owned map,
  never from consumer strings. An item with no value gets `<slot name="item-<index>">`.
- **Render functions** use three tiers, all optional:
  1. JSON cell kinds — `{ kind: 'text' | 'format' | 'badge' | 'link' | 'actions', … }`
     rendered by the element; `actions` emit `hmi-action { value, row }`.
  2. Per-cell / per-item slot overrides — `slot="cell-<rowKey>-<columnKey>"`,
     `slot="item-<key>"`.
  3. A JS-only property (`attribute: false`) accepting
     `(row) => string | TemplateResult | Node`.
  Document all three in the class JSDoc. `DialogAction[]` (modal, drawer,
  confirm-dialog) is the canonical tier-1 shape and is kept.

## R7 — Forms

- Form-associated: input, textarea, number-input, password-input, search-input,
  multi-input, checkbox, radio, radio-group, switch, slider, select, combobox,
  date-picker, color-picker, file-upload, segmented-control,
  value-scale-selector, and button, for `type="submit"` and `"reset"`.
- They use the helpers in `src/elements/shared/form.ts` (phase 4), which ports the
  semantics of `FormKind` (`text | numeric | checkable`) and `#coerce` from
  `src/web-components.ts:30,149,184-261`: checkable → `value` attribute or
  `'on'` when checked, else `null`; objects → JSON string; `null`/`undefined` →
  `null`.
- `hmi-form-control` is a layout-only wrapper marked `@deprecated`.

## R8 — Overlays

- **The dialog group** is modal, drawer, confirm-dialog and command-palette.
- **The popover group** is popover, tooltip, hover-card, context-menu, menu,
  the select and combobox listbox, date-picker, color-picker and toast. Toast
  and a hover-triggered tooltip use `popover="manual"`, and `hint` where
  `HTMLElement.prototype.popover` accepts it.
- **Positioning** uses `PositionController` from
  `src/elements/shared/positioning.ts` (phase 9): rect math with
  `position: fixed` insets, `ResizeObserver` plus scroll and resize listeners,
  and CSS anchor positioning when `CSS.supports('anchor-name: --a')`.
- The trigger slot sits inside a `display: contents` wrapper. There is no
  `cloneElement` equivalent and none is needed.
- Focus is captured with `activeElementDeep(document)` before opening, and
  `supportsPopover()` in `src/elements/shared/dom.ts` is the one popover check.

## R9 — Layout primitives

box, flex, grid, spacer, aspect-ratio, scroll-area, visually-hidden and divider
are real elements: `:host { display: … }` plus reflected attributes mapped to
CSS (`:host([direction='column'])`), numeric values via host custom properties
(`--_gap`, `--_columns`).

## R10 — React wrapper

- `<kebab>.react.ts` is exactly:
  `createComponent({ tagName, elementClass, react: React, displayName, events })`.
  Event keys are the React callback names (`onChange`, `onInput`, `onClose`)
  typed `'hmi-change' as EventName<CustomEvent<XChangeDetail>>`.
- Re-export the element's detail interfaces and value unions. No JSX, no logic,
  no default export.
- Exported from `src/react/index.ts` (alphabetical) and mapped in
  `package.json` as `./react/<kebab>`.
- The wrapper keeps the React component's PascalCase name (`Button`,
  `AreaChart`).
- The browser tests end with `mounts through the React wrapper`: `createRoot`
  and `act`, the properties set, and each `onX` receiving its event.

## R11 — Package surface during the migration

- Element subpath `./wc/<kebab>` → `dist/wc/<kebab>.js`; wrapper subpath
  `./react/<kebab>` → `dist/react/<kebab>.js`; barrels `./wc`, `./react`;
  drop-in bundle `./elements` → `dist/hmi-elements.iife.js`; global sheet
  `./base.css`. The root export and `./<kebab>` stay React until the v6 flip.
- `sideEffects` lists `./dist/wc/*.js` (elements self-register).
- Never load `hmi-elements.iife.js` and `hmi-components.iife.js` on the same
  page: both define the same tags and the second `customElements.define`
  throws.
- New components are built as Lit elements only. **Never add a React component
  to `src/components/` again.**

## R12 — Definition of done (one element)

Review an element PR with *Element review*, then this list for what is hmi's.
A migration PR copies it into its description and ticks every box.

```
- [ ] src/elements/<kebab>/ has <kebab>.ts, .styles.ts, .react.ts, .stories.ts, .test.ts, .ssr.test.ts
- [ ] pnpm run ci green: lint (no new biome-ignore), typecheck, both test projects, build
- [ ] The build wrote dist/wc/<kebab>.js, dist/react/<kebab>.js, dist/elements/<kebab>/<kebab>.d.ts + .react.d.ts, and dist/hmi-elements.iife.js
- [ ] Browser tests: the Element tests blocks, then mounts through the React wrapper
- [ ] pnpm cem run; custom-elements.json lists the element with all props, slots, parts, events
- [ ] Story in the right category, one story per prop axis, React usage snippet in docs
- [ ] React wrapper exports every event as onX and re-exports detail/value types
- [ ] examples/elements.html exercises the element
- [ ] src/elements/index.ts, src/react/index.ts, vite.config.ts, package.json exports updated, alphabetical
- [ ] No rem, theme axes only through tokens, part= on base/panel, --panel-* used if panel-like
- [ ] API table with a React column in the PR body; behaviour differences from the React version listed (incl. hmi-input/hmi-change and boolean attributes)
- [ ] Visual check against the React section of src/App.tsx (default axes; plus journal + glass for panel-like) approved by the user
- [ ] docs/migration/tracker.md row → Done with the PR link, in the PR itself
- [ ] src/components/<camel>.tsx untouched but for its @deprecated line
```
