# Lit Migration — Strict Rules

Read this file **before** creating or modifying anything under `src/elements/`.
Every rule is mandatory. The reasoning behind them is recorded in
`docs/migration/adr-0001-lit-web-components.md`; pattern-by-pattern examples are
in `docs/migration/translation-guide.md`; the order of work is in
`.claude/execution-order.md` and `docs/migration/tracker.md`.

Vocabulary: `<kebab>` is the element name (`area-chart`), `<Pascal>` its class
stem (`AreaChart`), the tag is `hmi-<kebab>`, the class is `Hmi<Pascal>`,
`<camel>` is the legacy React file stem (`areaChart`).

---

## R1 — Element shape

- One folder per element: `src/elements/<kebab>/` containing exactly
  `<kebab>.ts`, `<kebab>.styles.ts`, `<kebab>.react.ts`, `<kebab>.stories.ts`,
  `<kebab>.test.ts`, `<kebab>.ssr.test.ts`.
- `<kebab>.ts` exports `class Hmi<Pascal> extends LitElement`, decorated
  `@customElement('hmi-<kebab>')`, and augments `HTMLElementTagNameMap`.
- Runtime imports are limited to `lit`, `lit/decorators.js`,
  `lit/directives/*.js`, and `src/elements/shared/*`. **Lit is the only runtime
  dependency of the library.** No positioning libraries, no date libraries, no
  icon packages: hand-roll everything else.
- Decorators are TC39 standard decorators with the `accessor` keyword
  (`@property() accessor variant = 'primary'`). Never enable
  `experimentalDecorators`; `tsconfig.app.json` already has the required
  `target: ES2022` and `useDefineForClassFields: true`.
- Lifecycle methods carry `override` (`noImplicitOverride` is on):
  `static override styles`, `override render()`, `override connectedCallback()`.
- Elements compose other elements **by tag** (`<hmi-button>` inside a
  template), importing the sibling module for its side effect
  (`import '../button/button.js'`). Never import a class to render it.
- No imports between `src/elements/` and `src/components/` in either direction.
  The React tree is frozen until the v6 flip and then deleted.
- `src/components/<camel>.tsx` is **never edited** by a migration PR.

## R2 — Props → properties

| React | Lit |
|-------|-----|
| `variant?: 'a' \| 'b'` | `@property({ reflect: true }) accessor variant: Variant = 'a';` |
| `disabled?: boolean` | `@property({ type: Boolean, reflect: true }) accessor disabled = false;` |
| `size?: number` | `@property({ type: Number }) accessor size = 0;` |
| `items: Item[]`, `range: { … }` | `@property({ type: Array, attribute: false }) accessor items: readonly Item[] = [];` (JS property only; never serialised to an attribute) |
| multi-word prop `asIcon` | `@property({ type: Boolean, reflect: true, attribute: 'as-icon' })` — always set `attribute` explicitly for multi-word names |
| `children` | default `<slot>` |
| `className`, `style`, `...rest`, `ref`, `as` | dropped — the host element carries class, style, `id`, `aria-*`; the host *is* the element |
| function-typed prop | forbidden (R5), except the tier-(c) render property of R6, declared `attribute: false` |

- **Reflect** every attribute that CSS selects on (`:host([variant='primary'])`,
  `:host([open])`, `:host([invalid])`). Never reflect data props.
- **Booleans use HTML presence semantics**: `<hmi-x disabled>` is `true`, absent
  is `false`, and `disabled="false"` is **true**. Never write a converter that
  parses `"false"`. Document the property route for string-attribute hosts
  (Dioxus: set `el.disabled` from `onmounted`).
- **This flips the v5 behaviour, and the bare attribute is the dangerous case.**
  r2wc parses the attribute string, and `src/web-components.ts` maps an
  empty-string value to `false`, so today the bare attribute is **off**:

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
- **Controlled/uncontrolled** collapses into one model: the element owns its
  state. `value` (or `checked`, `open`, `index`) is the current value; setting
  it from outside overrides; user interaction updates it and dispatches the
  matching event. Provide `defaultValue`/`defaultChecked` only where the React
  component had them (form reset uses them). No `isControlled` mirror.
- JSDoc every property with a one-line description and `@default`; the
  custom-elements manifest and Storybook read it.

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
| `document`/`window` listeners | added in `connectedCallback` with `{ signal: this.#abort.signal }` from a fresh `AbortController` per connect; `abort()` in `disconnectedCallback` |
| outside-click test | `event.composedPath().includes(this)` — **never** `event.target` (it is retargeted to the host) |
| `document.activeElement` | `activeElementDeep(this.getRootNode())` from `src/elements/shared/dom.ts` |
| `ResizeObserver` | observe `this` in `connectedCallback`, disconnect in `disconnectedCallback` |
| `document.body.style.overflow` lock | none — `<dialog>.showModal()` provides it |

**SSR safety** (Next.js, Angular SSR, Dioxus fullstack are supported hosts):

- No `window`, `document`, `customElements`, `matchMedia`, `localStorage` at
  module scope or in the constructor. Guard browser-only work with
  `if (isServer) return;` (`isServer` from `lit`) at the top of `connectedCallback`.
- `render()` is deterministic from properties alone (no `Math.random`, no
  `Date.now`, no measured sizes in the first render).
- Never mutate light DOM: no `appendChild` of consumer nodes, no reading
  `textContent` to re-render it. Use `<slot>`.
- Reflect the attributes that CSS depends on so server-rendered markup styles
  correctly before upgrade.

## R4 — Styles

- All CSS lives in `<kebab>.styles.ts` as `export const styles = css\`…\`;`
  composed as `static override styles = [baseStyles, styles];`. No `.css`
  files, no external stylesheets, no `unsafeCSS` from strings.
- `baseStyles` (`src/elements/shared/base.styles.ts`) provides
  `:host { --_base: var(--hmi-base, 8px); box-sizing: border-box; }`,
  `*, *::before, *::after { box-sizing: border-box; }`,
  `:host([hidden]) { display: none !important; }` and the `:focus-visible`
  ring. Elements never repeat these.
- `:host { display: … }` is mandatory (custom elements default to `inline`).
- **So is `display` on any inner node that CSS gives a size.** A bare
  `<span part="base">` computes to `display: inline`, and inline boxes ignore
  `width` and `height`: a `.base { width: 100%; height: 100% }` surface then
  renders 0×0 and the element is invisible everywhere, with no error. Set
  `display` explicitly on every node you give a width, a height, or a
  percentage size. Cost the first time it was missed: `hmi-skeleton` shipped
  invisible through lint, build, tests and the manifest
  ([#124](https://github.com/ninoverse/hmi-components/pull/124)).
- **Units.** `rem` is forbidden in `src/elements/`. Translate `Nrem` to
  `calc(var(--_base) * N)` (`0.125rem` → `calc(var(--_base) * 0.125)`);
  font-relative values use `em`. Theme tokens (`--space-*`, `--corner-*`) are
  used as-is; they are expressed against the same base.
- **Selectors.** BEM block `.button` → `:host`; modifier `.button--primary` →
  `:host([variant='primary'])`; sub-element `.button__dot` → `.dot` carrying
  `part="dot"`. Author-provided children are reached only through
  `::slotted(svg)`, `::slotted(hmi-avatar)`.
- **Never select outside the root**: no `[data-structure=…] .x`, no
  `:host-context()`, no `.parent .child` across element boundaries. Theme
  differences come from tokens only. If a theme needs a per-component hook,
  add a token (`--<element>-<prop>`) to the theme file and consume it as
  `var(--<element>-<prop>, <fallback>)`.
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
- **Per-element theme hooks** already defined (defaults in `constants.css`,
  overridden by `structure/journal.css`): `--list-divider-style`, `--progress-track-border`, `--stat-rule`, `--switch-thumb-shadow`.
- `part=` on every meaningful node: `base` (root interactive node), `label`,
  `icon`, `panel`, `control`, `input`, `list`, `item`, `header`, `body`,
  `footer`. Parts are public API; list them with `@csspart` in the class JSDoc.
- Keyframes and `@media (prefers-reduced-motion: reduce)` blocks move verbatim
  into the `css` tag.
- No `z-index` for overlays: top-layer ordering is native (R8). Keep `0`/`1`
  layering inside a root only.
- Per-instance dynamic values (`--slider-pct`, `--stepper-item-gap`) are set on
  the host via `this.style.setProperty(...)` or on an inner node via `styleMap`.

## R5 — Events

- No function props. Every callback becomes
  `emit(this, 'hmi-<name>', detail, { cancelable })` from
  `src/elements/shared/events.ts`, which dispatches a `CustomEvent` with
  `bubbles: true, composed: true`.
- Names: `hmi-` + kebab-case of the React callback minus `on`:
  `onChange` → `hmi-change`, `onOpenChange` → `hmi-open-change`,
  `onExpandedChange` → `hmi-expanded-change`.
- `detail` is **always an object**. `hmi-change` → `{ value }`. Other events key
  the payload by concept: `hmi-open-change { open }`, `hmi-index-change { index }`,
  `hmi-expanded-change { expanded }`, `hmi-reorder { items }`,
  `hmi-action { value, row? }`, `hmi-select { value }`, `hmi-nav { value, index? }`,
  `hmi-complete { value }`, `hmi-close { reason? }`, `hmi-dismiss {}`,
  `hmi-cancel {}`, `hmi-confirm {}`, `hmi-resize { width, height }`,
  `hmi-sort { key, dir }`, `hmi-load {}`, `hmi-error {}`. The full catalog is in
  `docs/migration/translation-guide.md` §6.
- **Text inputs follow native semantics**: `hmi-input { value }` on every
  keystroke (and while dragging a slider), `hmi-change { value }` on commit
  (blur, Enter, pointer release). Checkables, selects, tabs and the like fire
  `hmi-change` only. This is a documented behaviour change from v5.
- `hmi-close`, `hmi-dismiss`, `hmi-cancel` are `cancelable: true`; the element
  checks the return value of `dispatchEvent` and does not close when
  `preventDefault()` was called.
- Export `interface <Pascal><Event>Detail` (one per event) from `<kebab>.ts` and
  re-export it from `<kebab>.react.ts`. Document each event with `@fires`.
- Native events that already bubble and compose (`click`, `input`, `focusin`)
  are not re-dispatched. Non-composed native events consumers need (`load`,
  `error`, `change` from an inner control) are re-dispatched as `hmi-*`.

## R6 — Rich content and render functions

- **Singular** `ReactNode` props become named slots: `title` → `<slot name="title">`,
  `leftIcon` → `left-icon`, `rightIcon` → `right-icon`, `actions` → `actions`,
  `trigger` → `trigger`, `icon` → `icon`, `description` → `description`. Keep a
  same-named string property as slot fallback only when the React prop was
  commonly a string (`title`, `label`).
- **Array item** fields are strings (`label: string`; icons as a string key
  into the library icon map, or inline SVG markup rendered with `unsafeSVG`
  **only** from the library-owned map, never from consumer strings). Each
  rendered item exposes `<slot name="label-<value>">` (or `item-<index>` when
  the item has no value) with the string as fallback content.
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

- Value-bearing controls are **form-associated**: input, textarea, number-input,
  password-input, search-input, multi-input, checkbox, radio, radio-group,
  switch, slider, select, combobox, date-picker, color-picker, file-upload,
  segmented-control, value-scale-selector (and button, for `type="submit"` /
  `"reset"`).
- Use the helpers in `src/elements/shared/form.ts`: `static formAssociated = true;`,
  `readonly #internals = this.attachInternals();`, `name`, `value` / `checked`,
  `disabled`, `required`; implement `formResetCallback`,
  `formDisabledCallback`, `formStateRestoreCallback`; call `setFormValue` on
  every value change and `setValidity` for `required` and `error`.
- `form.ts` ports the semantics of `FormKind` (`text | numeric | checkable`)
  and `#coerce` from `src/web-components.ts:30,149,184-261`: checkable →
  `value` attribute or `'on'` when checked, else `null`; objects → JSON string;
  `null`/`undefined` → `null`.
- Every form element renders its own `label`, `hint`, `error` (properties)
  inside the shadow root with `<label for="control">`, `aria-describedby`,
  `aria-invalid` and `role="alert"` on the error. `required` renders the marker.
  `hmi-form-control` is a layout-only wrapper marked `@deprecated`.
- `static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };`
  on every form element and on button.

## R8 — Overlays

- **Dialog group** (modal, drawer, confirm-dialog, command-palette): render
  `<dialog part="panel">`, open with `showModal()`, close with `close()`.
  `open` is reflected. Escape → native `cancel` → `hmi-close { reason: 'escape' }`
  (cancelable); backdrop click → `hmi-close { reason: 'backdrop' }`. Style
  `::backdrop` inside the element. Focus trap, inert background and scroll lock
  are native.
- **Popover group** (popover, tooltip, hover-card, context-menu, menu, select
  and combobox listbox, date-picker, color-picker, toast): the floating node
  carries `popover="auto"` (`manual` for toast and hover-triggered tooltip;
  `hint` when `HTMLElement.prototype.popover` accepts it). Open/close with
  `showPopover()` / `hidePopover()`; the native `toggle` event drives
  `hmi-open-change { open }`. Light dismiss is native.
- **Positioning** uses `PositionController` from
  `src/elements/shared/positioning.ts` (phase 9): rect math with `position: fixed`
  insets, `ResizeObserver` plus scroll/resize listeners, and CSS anchor
  positioning when `CSS.supports('anchor-name: --a')`. No `z-index`.
- **Trigger**: `<slot name="trigger">` inside a `display: contents` wrapper; the
  anchor rect comes from `assignedElements()[0]`. There is no `cloneElement`
  equivalent and none is needed.
- **Focus restore**: capture `activeElementDeep(document)` before opening,
  restore on close.
- **Fallback**: when `showPopover` is missing, the same node renders with
  `position: fixed` inside the root. Feature-detect once in `shared/dom.ts`.

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

Copy this list into the PR body and tick every box before leaving draft.

```
- [ ] src/elements/<kebab>/ has <kebab>.ts, .styles.ts, .react.ts, .stories.ts, .test.ts, .ssr.test.ts
- [ ] pnpm lint clean (no new biome-ignore)
- [ ] pnpm build green: tsc -b, dist/wc/<kebab>.js, dist/react/<kebab>.js, dist/elements/<kebab>/<kebab>.d.ts + .react.d.ts, r2wc IIFE, dist/hmi-elements.iife.js
- [ ] pnpm test green (browser): registers, renders, reflection, boolean presence, every hmi-* event with detail, slots, form value + reset (if form-associated), roles, React wrapper mount
- [ ] pnpm test:ssr green: imports in Node, render() emits declarative shadow DOM
- [ ] pnpm cem run; custom-elements.json lists the element with all props, slots, parts, events
- [ ] Story in the right category, one story per prop axis, React usage snippet in docs
- [ ] React wrapper exports every event as onX and re-exports detail/value types
- [ ] examples/elements.html exercises the element
- [ ] src/elements/index.ts, src/react/index.ts, vite.config.ts, package.json exports updated, alphabetical
- [ ] No rem, no cross-root selectors, :host{display} set, part= on base/panel, --panel-* used if panel-like
- [ ] No window/document at import or constructor time; listeners cleaned up in disconnectedCallback
- [ ] Booleans use presence semantics; multi-word attributes named explicitly
- [ ] API mapping sheet in the PR body; behaviour differences from the React version listed (incl. hmi-input/hmi-change)
- [ ] Side-by-side screenshot React vs Lit (default axes; plus journal + glass for panel-like) approved by the user
- [ ] docs/migration/tracker.md row → In review with PR link (→ Done after merge)
- [ ] src/components/<camel>.tsx untouched; branch cut from merged main, not stacked
```
