# React → Lit translation guide

Pattern-by-pattern instructions for turning one React component from
`src/components/` into a Lit element under `src/elements/`. The mandatory
rules are in `.claude/lit-migration.md` (referenced below as R1…R12); this
guide shows *how* each pattern found in the codebase maps, with before/after
snippets, and ends with a complete worked example (Button).

Contents

1. [Component shell](#1-component-shell)
2. [Props → properties](#2-props--properties)
3. [Singular rich content → slots](#3-singular-rich-content--slots)
4. [Array items → strings + per-item slots](#4-array-items--strings--per-item-slots)
5. [Render functions → three tiers](#5-render-functions--three-tiers)
6. [Event catalog](#6-event-catalog)
7. [State and lifecycle](#7-state-and-lifecycle)
8. [DOM globals inside a shadow root](#8-dom-globals-inside-a-shadow-root)
9. [Controlled / uncontrolled](#9-controlled--uncontrolled)
10. [className, rest, as, ref](#10-classname-rest-as-ref)
11. [CSS translation](#11-css-translation)
12. [Overlays](#12-overlays)
13. [Forms](#13-forms)
14. [Charts](#14-charts)
15. [Theme module](#15-theme-module)
16. [What the r2wc layer did that Lit makes obsolete](#16-what-the-r2wc-layer-did-that-lit-makes-obsolete)
17. [Worked example: Button](#17-worked-example-button)
18. [File templates](#18-file-templates)

---

## 1. Component shell

```tsx
// React — src/components/badge.tsx
import './styled/badge.styled.css';
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant; dot?: boolean };
export function Badge({ variant = 'neutral', dot = false, className, children, ...rest }: BadgeProps) {
    const tokens = ['badge', `badge--${variant}`];
    if (dot) tokens.push('badge--dot');
    return <span className={tokens.join(' ')} {...rest}>{children}</span>;
}
```

```ts
// Lit — src/elements/badge/badge.ts
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './badge.styles.js';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info';

/**
 * Small status label.
 * @tag hmi-badge
 * @slot - Label text.
 * @csspart base - The badge container.
 */
@customElement('hmi-badge')
export class HmiBadge extends LitElement {
    static override styles = [baseStyles, styles];

    /** Colour role. @default 'neutral' */
    @property({ reflect: true }) accessor variant: BadgeVariant = 'neutral';

    /** Render as a dot without text. @default false */
    @property({ type: Boolean, reflect: true }) accessor dot = false;

    override render() {
        return html`<span part="base" class="base"><slot></slot></span>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-badge': HmiBadge;
    }
}
```

What moved where:

| React piece | Lit piece |
|-------------|-----------|
| side-effect CSS import | `static override styles = [baseStyles, styles]` (R4) |
| props type | `@property` accessors with JSDoc (R2) |
| BEM class string building | reflected attributes selected by `:host([variant='x'])` (R4) |
| `className` / `...rest` | dropped; the host carries them (R2) |
| `children` | `<slot>` |

## 2. Props → properties

```ts
@property({ reflect: true }) accessor variant: Variant = 'primary';          // string union
@property({ type: Boolean, reflect: true }) accessor disabled = false;        // boolean (presence semantics)
@property({ type: Number }) accessor max = 100;                               // number
@property({ type: Boolean, reflect: true, attribute: 'as-icon' }) accessor asIcon = false; // multi-word → explicit attribute
@property({ type: Array, attribute: false }) accessor items: readonly Item[] = [];        // data: JS property only
@property({ type: Object, attribute: false }) accessor range: DateRange | null = null;
@property({ attribute: false }) accessor render: ((row: Row) => string | TemplateResult | Node) | undefined; // tier-(c) only
```

Attribute naming: Lit lowercases property names for attributes by default, so
`asIcon` would become `asicon`. Always set `attribute: 'as-icon'` for multi-word
props; consumers then write `<hmi-button as-icon>` and Angular/Vue bind
`[asIcon]` / `.asIcon` to the property.

Booleans: `<hmi-button disabled>` → `true`; `<hmi-button>` → `false`;
`<hmi-button disabled="false">` → **`true`**. Dioxus and other string-attribute
hosts must omit the attribute or set the property:

```rust
hmi-button { onmounted: move |e| { /* js_sys::Reflect::set(el, "disabled", false) */ }, "Save" }
```

## 3. Singular rich content → slots

A named slot replaces every singular `ReactNode` prop. Inventory of the props
this applies to (from the v5 sources):

| Component | React prop(s) | Slot name(s) |
|-----------|---------------|--------------|
| alert, banner | `icon`, `title`, `action` | `icon`, `title`, `action` |
| blockquote | `cite` | `cite` |
| button | `leftIcon`, `rightIcon` | `left-icon`, `right-icon` |
| card | `header`, `footer` | `header`, `footer` |
| checkbox, radio, switch, meter, gauge, tooltip | `label` | `label` |
| chip, value-scale-selector | `icon` | `icon` |
| combobox, command-palette | `emptyMessage` | `empty` |
| context-menu | `menu` | `menu` |
| donut-chart | `centerLabel` | `center-label` |
| drawer, modal | `title`, `description`, `actions` | `title`, `description`, `actions` |
| confirm-dialog | `title`, `description`, `confirmLabel`, `cancelLabel` | `title`, `description`, `confirm-label`, `cancel-label` |
| empty-state | `icon`, `title`, `description`, `action` | `icon`, `title`, `description`, `action` |
| hover-card, popover | `trigger` | `trigger` |
| image | `fallback` | `fallback` |
| input | `leftIcon`, `rightIcon` | `left-icon`, `right-icon` |
| navbar | `brand`, `right` | `brand`, `right` |
| select | `placeholder` | `placeholder` |
| stat | `label`, `value`, `icon`, `delta`, `helpText` | `label`, `value`, `icon`, `delta`, `help-text` |
| carousel | `slides: ReactNode[]` | children with `slot="slide"` |
| toast | `title`, `body` | `title`, `body` (via the store; see phase 11) |

Pattern:

```ts
// element
override render() {
    return html`
        <div part="header" class="header"><slot name="title">${this.title}</slot></div>
        <slot></slot>
        <div part="footer" class="footer"><slot name="actions"></slot></div>
    `;
}
```

```html
<!-- any host -->
<hmi-modal open>
    <span slot="title">Delete file?</span>
    <p>This cannot be undone.</p>
    <hmi-button slot="actions" variant="primary">Delete</hmi-button>
</hmi-modal>
```

```tsx
// React through the wrapper — children pass through untouched
<Modal open onClose={close}>
    <span slot="title">Delete file?</span>
    <p>This cannot be undone.</p>
    <Button slot="actions" variant="primary">Delete</Button>
</Modal>
```

Keep a string property with the same name only where the React prop was
usually a string (`title`, `label`); use it as the slot's fallback content.

## 4. Array items → strings + per-item slots

Applies to: accordion `items[].title/body`, breadcrumbs `items[].label`,
chart-tooltip `items[].label/value`, legend `items[].label`, list
`items[].title/subtitle/right`, menu items, navbar `links[].label`, radio-group
`options[].label`, segmented-control `options[].label/icon`, select
`options[].label/icon`, sidebar `items[].label/icon/badge`, stepper
`steps[].label/description`, table `columns[].label`, tabs `options[].label/icon`,
timeline `items[].title/description/time/icon`, tree `nodes[].label/icon`,
command-palette `commands[].icon/shortcut`.

Rule (R6): the field becomes `string`; icons become a string key into the
library icon map; each rendered item exposes a slot keyed by the item's
`value` (or `index` when it has none), with the string as fallback.

```ts
// element
${this.options.map(
    (option) => html`
        <button part="item" role="tab" data-value=${option.value}>
            <slot name=${`label-${option.value}`}>${option.label}</slot>
        </button>
    `,
)}
```

```html
<hmi-tabs options='[{"value":"overview","label":"Overview"},{"value":"alerts","label":"Alerts"}]'>
    <span slot="label-alerts"><svg>…</svg> Alerts <hmi-badge>3</hmi-badge></span>
</hmi-tabs>
```

```rust
// Dioxus
hmi-tabs { "options": OPTIONS_JSON,
    span { slot: "label-alerts", hmi-badge { "3" } " Alerts" }
}
```

## 5. Render functions → three tiers

| Component | React prop | Tier 1 (JSON) | Tier 2 (slot) | Tier 3 (JS property) |
|-----------|------------|---------------|---------------|----------------------|
| table | `columns[].render(row)` | `kind: 'text' \| 'format' \| 'badge' \| 'link' \| 'actions'` + `format: '{first} {last}'` | `slot="cell-<rowKey>-<columnKey>"`, `slot="header-<columnKey>"` | `columns[].render` returning `string \| TemplateResult \| Node` |
| table | `getRowKey(row)` | `row-key="id"` attribute naming the key field | — | `rowKey` may also be a function (JS only) |
| list | `renderItem(item, i)` | item fields + `format` | `slot="item-<key>"` | `renderItem` |
| image | `renderImage(props)` | — | default slot receives a custom `<img>`/`<picture>` | `renderImage` |
| responsive-container | `children(size)` | `hmi-resize { width, height }` event + `--_w`/`--_h` on host; charts read `width`/`height` props | default slot | — |
| combobox | `filterOption(option, query)` | `filter="includes" \| "startsWith" \| "none"` | — | `filter` may be a predicate (JS only) |
| slider | `formatValue` | template string `'{value}%'` | — | the same `formatValue`, set as a property |

Table cell kinds:

```ts
export type TableColumn<Row> = {
    key: keyof Row & string;
    label: string;
    kind?: 'text' | 'format' | 'badge' | 'link' | 'actions';
    format?: string;                                   // '{first} {last}' — applyTemplate()
    badgeVariant?: (value: unknown) => BadgeVariant;  // JS only
    href?: string;                                     // '{id}' template for kind: 'link'
    actions?: readonly DialogAction[];                 // kind: 'actions' → <hmi-button>s → hmi-action { value, row }
    render?: (row: Row) => string | TemplateResult | Node; // tier 3
    sortable?: boolean;
    align?: 'start' | 'center' | 'end';
};
```

Rendering order per cell: a slotted override wins (`<slot name="cell-42-actions">`
with the tier-1/tier-3 output as fallback), then `render`, then `kind`,
then plain text.

```rust
// Dioxus: a real button in a cell, no JS interop
hmi-table { "columns": COLUMNS_JSON, "rows": ROWS_JSON, "row-key": "id",
    div { slot: "cell-42-actions",
        hmi-button { variant: "ghost", onclick: move |_| edit(42), "Edit" }
    }
}
```

`src/lib/formatTemplate.utility.ts` (`applyTemplate`) moves to
`src/elements/shared/format.ts` unchanged in phase 4.

## 6. Event catalog

All events: `CustomEvent`, `bubbles: true`, `composed: true`, object `detail`.
Wrapper prop = `on` + PascalCase of the event minus `hmi-`.

| Component(s) | React callback (v5) | Event(s) | `detail` |
|--------------|---------------------|----------|----------|
| input, textarea, multi-input, color-picker | `onChange(string)` | `hmi-input` (per keystroke) + `hmi-change` (commit) | `{ value: string }` |
| number-input | `onChange(number \| null)` | `hmi-input` + `hmi-change` | `{ value: number \| null }` |
| slider | `onChange(number)` | `hmi-input` (drag) + `hmi-change` (release) | `{ value: number }` |
| value-scale-selector | `onChange(number)` | `hmi-change` | `{ value: number }` |
| checkbox, radio, switch | `onChange(boolean)` | `hmi-change` | `{ checked: boolean }` (`value` is the submitted string) |
| radio-group, segmented-control, select, stepper, tabs | `onChange(T)` | `hmi-change` | `{ value: T }` |
| combobox | `onChange(T \| null)` | `hmi-change`; `hmi-input` for the query text | `{ value: T \| null }` / `{ value: string }` |
| date-picker | `onChange(date \| range \| null)` | `hmi-change` | `{ value: string \| DateRangeISO \| null }` |
| file-upload | `onChange(FileDescriptor[])` | `hmi-change` | `{ value: FileDescriptor[] }` |
| pagination | `onChange(page)` | `hmi-change` | `{ value: number }` |
| multi-input | `onComplete(string)` | `hmi-complete` | `{ value: string }` |
| accordion | `onOpenChange(number[])` | `hmi-open-change` | `{ open: number[] }` |
| popover, hover-card, tooltip, command-palette | `onOpenChange(boolean)` | `hmi-open-change` | `{ open: boolean }` |
| modal, drawer | `onClose()` | `hmi-close` (cancelable) | `{ reason: 'escape' \| 'backdrop' \| 'action' \| 'programmatic' }` |
| chip | `onClose()` / `onSelect()` | `hmi-close` (cancelable) / `hmi-select` (cancelable) | `{}` / `{ selected: boolean }` |
| modal, drawer, command-palette, table (`actions` cells) | `onAction(string)` | `hmi-action` | `{ value: string, row?: Row }` |
| confirm-dialog | `onCancel()` / `onConfirm()` | `hmi-cancel` (cancelable) / `hmi-confirm` | `{}` |
| banner | `onDismiss()` | `hmi-dismiss` (cancelable) | `{}` |
| toast | `onDismiss()` | `hmi-dismiss` (cancelable) | `{ id: string }` |
| tree | `onSelect(T)` / `onExpandedChange(T[])` | `hmi-select` / `hmi-expanded-change` | `{ value: T }` / `{ expanded: T[] }` |
| command-palette command | `commands[].onSelect()` | `hmi-select` | `{ value: string }` |
| navbar, sidebar | `onNav(T)` | `hmi-nav` | `{ value: T }` |
| breadcrumbs | `items[].onClick()` | `hmi-nav` | `{ value: string, index: number }` |
| carousel | `onIndexChange(n)` | `hmi-index-change` | `{ index: number }` |
| list | `onReorder(items)` | `hmi-reorder` | `{ items: ListItem[] }` |
| table | (internal sort state) | `hmi-sort` | `{ key: string, dir: 'asc' \| 'desc' \| null }` |
| image | `renderImage` `onLoad` / `onError` | `hmi-load` / `hmi-error` | `{}` |
| responsive-container | `children(size)` | `hmi-resize` | `{ width: number, height: number }` |
| charts (14) | none | none | — |

Emitting:

```ts
// src/elements/shared/events.ts (PR 2)
export function emit<T>(host: HTMLElement, type: `hmi-${string}`, detail: T, init: { cancelable?: boolean } = {}): boolean {
    return host.dispatchEvent(new CustomEvent<T>(type, { detail, bubbles: true, composed: true, ...init }));
}

// in an element
#requestClose(reason: ModalCloseDetail['reason']): void {
    if (emit<ModalCloseDetail>(this, 'hmi-close', { reason }, { cancelable: true })) this.open = false;
}
```

## 7. State and lifecycle

```tsx
// React
const [open, setOpen] = useState(false);
const wrap = useRef<HTMLDivElement>(null);
useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
}, []);
useLayoutEffect(() => { measure(); }, [value]);
```

```ts
// Lit
@state() private accessor open = false;
@query('.wrap') private accessor wrap!: HTMLDivElement;
#abort: AbortController | undefined;

override connectedCallback(): void {
    super.connectedCallback();
    if (isServer) return;
    this.#abort = new AbortController();
    window.addEventListener('resize', () => this.#measure(), { signal: this.#abort.signal });
}
override disconnectedCallback(): void {
    this.#abort?.abort();
    super.disconnectedCallback();
}
override updated(changed: PropertyValues<this>): void {
    if (changed.has('value')) this.#measure();
}
```

`useId` → literal ids. Ids only need to be unique inside one shadow root:

```ts
html`<button id="trigger" aria-controls="panel">…</button><div id="panel" aria-labelledby="trigger">…</div>`
```

## 8. DOM globals inside a shadow root

| v5 code | Why it breaks | Replacement |
|---------|---------------|-------------|
| `document.addEventListener('mousedown', e => { if (!ref.current.contains(e.target)) close(); })` (`popover.tsx:89-94`, `combobox.tsx:126-131`, `contextMenu.tsx:46-50`) | `e.target` is retargeted to the host, so clicks inside the popover look outside | `if (!e.composedPath().includes(this)) close();` — or rely on `popover="auto"` light dismiss (R8) |
| `previouslyFocused.current = document.activeElement` (`modal.tsx:104`, `drawer.tsx:67`, `commandPalette.tsx:117`) | returns the host, not the inner focused node | `activeElementDeep(document)` from `shared/dom.ts` (recurse through `shadowRoot.activeElement`) |
| `document.body.style.overflow = 'hidden'` | body mutation, fights other overlays | `<dialog>.showModal()` |
| `createPortal(node, document.body)` | shadow styles do not reach a body portal | `<dialog>` / `popover` inside the root (R8) |
| `document.documentElement.scrollWidth` (`popover.tsx:72`) | fine, but only inside `PositionController` | keep inside the controller |
| `wrap.querySelector('[data-active="true"]')` (`tabs.tsx:75`) | fine (scoped to own ref) | `this.renderRoot.querySelector(...)` |

## 9. Controlled / uncontrolled

The 14 components using the `isControlled = value !== undefined` mirror
(`tabs.tsx:59-61`, `select.tsx:80-86`, …) collapse to:

```ts
/** Current value. Set it to change the selection programmatically. */
@property() accessor value = '';

#select(next: string): void {
    if (next === this.value) return;
    this.value = next;               // element owns the state
    emit(this, 'hmi-change', { value: next });
}
```

Consumers that want to veto a change listen to `hmi-change` and set `value`
back. `defaultValue` is kept only on form elements (form reset). The combobox's
private `query` state must be re-derived from `value` in `willUpdate` (the v5
version never re-syncs — a known hazard).

## 10. className, rest, as, ref

- `className` → consumers set `class` on the host; internal nodes use fixed
  class names plus `part=`.
- `...rest` (`aria-*`, `data-*`, `id`, `title`) → live on the host natively.
  When an inner control needs them (`aria-label` on an inner `<input>`), expose
  an explicit property (`label`, `ariaLabel`) and forward it.
- `as` (box, flex, grid, text, visually-hidden) → dropped. `heading` keeps
  `level` and renders the matching `<h1>`…`<h6>` inside.
- `ref` → consumers hold the element; expose imperative methods
  (`focus()`, `show()`, `hide()`) as public methods.

## 11. CSS translation

Rules in R4. Mechanical translations:

| v5 CSS | Lit `styles` |
|--------|--------------|
| `.button { … }` | `:host { display: inline-flex; } button { … }` (or `.base`) |
| `.button--primary { … }` | `:host([variant='primary']) button { … }` |
| `.button--icon.button--small` | `:host([as-icon][size='small']) button` |
| `.button svg { … }` | `::slotted(svg) { … }` |
| `.empty-state__icon > svg` | `.icon ::slotted(svg)` |
| `.avatar-stack .avatar` (`avatar.styled.css:76,80`) | in `avatar-stack.styles.ts`: `::slotted(hmi-avatar) { … }` and `::slotted(hmi-avatar:not(:first-child)) { margin-inline-start: … }` |
| `[data-structure="journal"] .list__item` (`list.styled.css:92`) | `.item { border-bottom-style: var(--list-divider-style, solid); }` — `--list-divider-style` is `dashed` in `structure/journal.css` |
| `[data-structure="journal"] .progress` / `.switch__thumb` | `border: var(--progress-track-border, none)`, `box-shadow: var(--switch-thumb-shadow)` — defaults in `constants.css`, journal overrides in `structure/journal.css` |
| `[data-structure="journal"] .stat__footer` (`stat.styled.css`) | a boolean property: `:host([divider]) .footer { border-top: … dashed … }` — presence is the consumer's choice, not the theme's |
| `height: 5rem` | `height: calc(var(--_base) * 5)` |
| `border: 0.125rem solid` | `border: calc(var(--_base) * 0.125) solid` |
| `font-size: 1.75rem` | `font-size: calc(var(--_base) * 1.75)` |
| `padding: 0 var(--space-8)` | unchanged (the tokens are already expressed against `--hmi-base`) |
| `z-index: 1000` on an overlay | removed (top layer) |
| `@keyframes modal-in { … }` | verbatim inside `css\`` |
| `@media (prefers-reduced-motion: reduce)` | verbatim |
| `.button:focus-visible { … }` | `button:focus-visible { … }` (the base ring applies to `:host(:focus-visible)` only for `delegatesFocus` elements) |
| `style={{ '--slider-pct': pct }}` | `this.style.setProperty('--slider-pct', \`${pct}%\`)` in `updated()` |
| `style={{ width: \`${pct}%\` }}` | `style=${styleMap({ width: \`${pct}%\` })}` |

Selectors that must not appear in `src/elements/`: `:root`, `html`, `body`,
`[data-theme]`, `[data-structure]`, `[data-material]`, `:host-context(`, `rem`.

Global rules that no longer exist inside a root and must be handled by
`baseStyles`: `*{box-sizing}`, `:focus{outline:none}`, `:focus-visible` ring,
`button{font:inherit}` (set `font: inherit` on inner `<button>`/`<input>` in the
element styles).

## 12. Overlays

```ts
// modal.ts (sketch)
@property({ type: Boolean, reflect: true }) accessor open = false;
@query('dialog') private accessor dialog!: HTMLDialogElement;

override updated(changed: PropertyValues<this>): void {
    if (changed.has('open') && !isServer) {
        if (this.open && !this.dialog.open) {
            this.#restoreTo = activeElementDeep(document);
            this.dialog.showModal();
        } else if (!this.open && this.dialog.open) {
            this.dialog.close();
            this.#restoreTo?.focus();
        }
    }
}
#onCancel(event: Event): void {          // Escape
    event.preventDefault();
    this.#requestClose('escape');
}
#onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog) this.#requestClose('backdrop');
}
override render() {
    return html`
        <dialog part="panel" class="panel" @cancel=${this.#onCancel} @click=${this.#onBackdrop}>
            ${renderLiquidFilter()}
            <header part="header"><slot name="title" id="title">${this.title}</slot></header>
            <div part="body"><slot name="description" id="description"></slot><slot></slot></div>
            <footer part="footer"><slot name="actions">${renderDialogActions(this.actions, (v) => emit(this, 'hmi-action', { value: v }))}</slot></footer>
        </dialog>
    `;
}
```

```ts
// popover.ts (sketch)
#position = new PositionController(this, {
    anchor: () => this.trigger.assignedElements()[0] ?? this,
    placement: () => this.side,
    offset: 8,
});
override render() {
    return html`
        <span class="trigger" style="display: contents"><slot name="trigger" @click=${this.toggle}></slot></span>
        <div part="panel" class="panel" popover="auto" @toggle=${this.#onToggle}>${renderLiquidFilter()}<slot></slot></div>
    `;
}
```

`PositionController` (phase 9, `src/elements/shared/positioning.ts`): a
`ReactiveController` that on `hostConnected` observes the anchor with
`ResizeObserver`, listens to scroll (capture) and resize with an
`AbortController`, and writes `top/left` (`position: fixed`) to the panel; when
`CSS.supports('anchor-name: --a')` it sets `anchor-name` on the trigger wrapper
and `position-anchor` + `inset-area` on the panel instead.

## 13. Forms

```ts
// src/elements/shared/form.ts (phase 4) — semantics ported from src/web-components.ts:30,149,184-261
export type FormKind = 'text' | 'numeric' | 'checkable';
export function coerceFormValue(kind: FormKind, value: unknown, host: HTMLElement): string | null {
    if (kind === 'checkable') return value ? (host.getAttribute('value') ?? 'on') : null;
    if (value === null || value === undefined) return null;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}
```

Every form element:

```ts
static formAssociated = true;
static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
readonly #internals = this.attachInternals();

@property() accessor name = '';
@property() accessor value = '';
@property({ type: Boolean, reflect: true }) accessor required = false;
@property({ type: Boolean, reflect: true }) accessor disabled = false;
@property() accessor label = '';
@property() accessor hint = '';
@property() accessor error = '';
#defaultValue = '';

override firstUpdated(): void { this.#defaultValue = this.value; this.#syncForm(); }
override updated(changed: PropertyValues<this>): void {
    if (changed.has('value') || changed.has('required') || changed.has('error')) this.#syncForm();
}
formResetCallback(): void { this.value = this.#defaultValue; }
formDisabledCallback(disabled: boolean): void { this.disabled = disabled; }
formStateRestoreCallback(state: string | File | FormData | null): void { if (typeof state === 'string') this.value = state; }

#syncForm(): void {
    this.#internals.setFormValue(coerceFormValue('text', this.value, this));
    const missing = this.required && this.value === '';
    this.#internals.setValidity(
        missing ? { valueMissing: true } : this.error ? { customError: true } : {},
        missing ? 'Please fill out this field.' : this.error,
        this.control,
    );
}

override render() {
    return html`
        ${this.label ? html`<label part="label" for="control">${this.label}${this.required ? html`<span aria-hidden="true">*</span>` : nothing}</label>` : nothing}
        <input id="control" part="control" .value=${live(this.value)} ?required=${this.required} ?disabled=${this.disabled}
            aria-describedby="hint error" aria-invalid=${this.error ? 'true' : nothing}
            @input=${this.#onInput} @change=${this.#onChange} />
        ${this.hint ? html`<div id="hint" part="hint">${this.hint}</div>` : nothing}
        ${this.error ? html`<div id="error" part="error" role="alert">${this.error}</div>` : nothing}
    `;
}
```

`hmi-form-control` stays as a layout wrapper (label above, hint below) for
non-form children and is marked `@deprecated` in favour of the props above.
`src/lib/controlledTextCaret.utility.ts` is not needed: the element owns the
native input, so no async echo occurs.

### Binding model

The form elements are native form controls through `ElementInternals`, so they
work in a plain `<form>` with no framework binding. Binding is **explicit** in
every host: a property in, an event out. There is no `v-model`, `ngModel` or
`bind:value` support (Angular and Svelte adapters are post-v6 TODOs in
`TODO.md`).

| What | How it works |
|------|--------------|
| Submit | `name` plus `value` reach `FormData` and the form's submit. Text is a string, a number its string, an object a JSON string, and files real `File` entries. |
| Validation | `required` gives the native `valueMissing` message. A non-empty `error` string gives a `customError` with that text, sets `aria-invalid` and shows the message. `form.checkValidity()` and `reportValidity()` work. |
| Reset | `form.reset()` restores `value` to what it was at the first render. The `value` attribute is the initial value. |
| Disabled | `<fieldset disabled>` disables the control (`formDisabledCallback`). |
| Events | `hmi-input` on every keystroke and `hmi-change` on commit, both `detail: { value }`, bubbling and composed. |
| Ownership | The element owns the state. To veto a change, listen and set `value` back. |

Per host:

| Host | Value in | Value out |
|------|----------|-----------|
| Plain HTML | `el.value = …` or the `value` attribute | `addEventListener('hmi-input', e => e.detail.value)`, or `new FormData(form)` on submit |
| React | `value`, `defaultValue` props | `onInput` (per keystroke, v5's `onChange`) and `onChange` (commit): both receive the event, so read `e.detail.value` |
| Vue | `:value` | `@hmi-input="e => v = e.detail.value"` |
| Angular | `[value]` | `(hmi-input)="v = $event.detail.value"`, or `FormData` on submit; `ngModel` and reactive forms need an adapter (post-v6) |
| Dioxus | attributes from strings | the form's `values()` for strings; `web_sys` for events, objects and files |

`hmi-file-upload` exposes the selected files as `el.files` (a `File[]`). Its
`hmi-change` detail carries serialisable `FileDescriptor`s, but the submitted
form holds the real `File`s. A host without access to the element's shadow DOM
(Dioxus) reads them from `el.files` or from `FormData`, as in the README's
`web_sys` pattern for events:

```rust
// Unverified: written from the web platform, not run in a Dioxus app (see
// TODO.md, "Dioxus: verify the form recipe").
use wasm_bindgen::JsCast;
use web_sys::{File, FormData, HtmlFormElement};

// From `onmounted` on the form: the submitted form holds the real files.
fn files_of(form: &HtmlFormElement, name: &str) -> Vec<File> {
    let data = FormData::new_with_form(form).unwrap();
    js_sys::Array::from(&data.get_all(name))
        .iter()
        .filter_map(|f| f.dyn_into::<File>().ok())
        .collect()
}

// Or from the element itself, `el` being the `hmi-file-upload` element:
// `js_sys::Reflect::get(&el, &"files".into())` is a JS array of `File`.
```

`hmi-change` carries `FileDescriptor`s only. Dioxus's own `files()` reads a
native input and does not see into the element's shadow DOM.

## 14. Charts

The 14 charts are pure functions of props and port almost verbatim:

- `<svg class="line-chart">` → `<svg part="base">` inside the root; `series`,
  `labels`, `data` are `type: Array, attribute: false` properties.
- Colour props default to `'var(--primary)'` strings written into `style`
  attributes (`style=${styleMap({ stroke: color })}`) so tokens resolve;
  structural strokes (grid lines) live in `styles`.
- `CartesianGrid` is exported both as `hmi-cartesian-grid` (standalone) and as
  `renderCartesianGrid(scale)` in `src/elements/shared/chart.ts`, which area,
  bar, line and scatter call inside their own SVG. The duplicated
  `AXIS`/`xAt`/`yAt` scale math moves into the same module.
- `ResponsiveContainer` becomes `hmi-responsive-container`: a `ResizeObserver`
  on the host sets `--_w`/`--_h` and emits `hmi-resize`; charts in its default
  slot read `width`/`height` properties that the container sets on
  `assignedElements()` (or consumers bind from the event).
- `Legend` and `ChartTooltip` stay standalone; tooltip is a panel-like element.

## 15. Theme module

```ts
// src/elements/shared/theme.ts (phase 11)
export function getTheme(): { theme: string; structure: Structure; material: Material };
export function setTheme(next: Partial<{ theme: string; structure: Structure; material: Material }>): void; // writes html[data-*] + localStorage (same keys: hmi-theme, hmi-structure, hmi-material)
export function subscribe(listener: (state: ThemeState) => void): () => void;
```

`src/react/use-theme.ts` wraps it with `useSyncExternalStore` and is exported
as `useTheme` from `./react`. There is no provider element; the anti-flash
inline script in `index.html` stays as documented in `docs/theming.md`.

## 16. What the r2wc layer did that Lit makes obsolete

| `src/web-components.ts` mechanism | Lit replacement |
|-----------------------------------|-----------------|
| `CAPTURED` symbol + `SlottedChildren` (`:37, :64-77, :169-181`) | native `<slot>` |
| `withChildren()` / `HostElementContext` / `usePortalTarget` | `<dialog>` and `popover` inside the root |
| `toDashedCase` attribute mapping | `@property({ attribute })` |
| `attributeChangedCallback` falsy override (`:213-227`, the bare-boolean bug) | Lit `Boolean` converter (presence semantics) |
| `events: { onChange: { bubbles: true } }` unprefixed `change` | `hmi-*` events (R5) |
| `static formAssociated` + `FormKind` + `#coerce` (`:149, :184-261`) | `shared/form.ts` (same semantics) |
| upgrade-properties loop (`:160-168`) | Lit handles pre-upgrade property values |
| `src/lib/triggerAnchor.tsx` (`cloneElement`) | `<slot name="trigger">` + `assignedElements()` |
| `src/lib/controlledTextCaret.utility.ts` | not needed |
| `src/lib/formatTemplate.utility.ts` | moved to `shared/format.ts` |

## 17. Worked example: Button

Source: `src/components/button.tsx` + `src/components/styled/button.styled.css`.

### API mapping sheet

| React prop | Element property / attribute | Slot | Event | Part |
|------------|------------------------------|------|-------|------|
| `variant` | `variant` (reflected) | | | |
| `size` | `size` (reflected) | | | |
| `leftIcon` | | `left-icon` | | |
| `rightIcon` | | `right-icon` | | |
| `asIcon` | `asIcon` / `as-icon` (reflected) | | | |
| `disabled` (native) | `disabled` (reflected) | | | |
| `type` (native, default `button`) | `type` | | | |
| `children` | | default | | |
| `onClick` (native) | | | native `click` (composed) | |
| `className` / `...rest` | host `class`, `id`, `aria-*` | | | |
| — | | | | `base` (inner `<button>`) |

Behaviour differences to list in the PR: `type="submit"` reaches the host
form through `ElementInternals` instead of DOM ancestry; the focus ring is
drawn on the inner button (delegated focus).

### `src/elements/button/button.ts`

```ts
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { styles } from './button.styles.js';

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'soft'
    | 'danger'
    | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Interactive button styled with MD3 tokens. `type="submit"` and
 * `type="reset"` act on the host form.
 *
 * @tag hmi-button
 * @slot - Label.
 * @slot left-icon - Rendered before the label.
 * @slot right-icon - Rendered after the label.
 * @csspart base - The inner `<button>`.
 */
@customElement('hmi-button')
export class HmiButton extends LitElement {
    static override styles = [baseStyles, styles];
    static formAssociated = true;
    static override shadowRootOptions = {
        ...LitElement.shadowRootOptions,
        delegatesFocus: true,
    };

    /** Visual style. @default 'primary' */
    @property({ reflect: true }) accessor variant: ButtonVariant = 'primary';

    /** Control height. @default 'medium' */
    @property({ reflect: true }) accessor size: ButtonSize = 'medium';

    /** Square, icon-only button. @default false */
    @property({ type: Boolean, reflect: true, attribute: 'as-icon' })
    accessor asIcon = false;

    /** Disables interaction. @default false */
    @property({ type: Boolean, reflect: true }) accessor disabled = false;

    /** Native button type. @default 'button' */
    @property() accessor type: ButtonType = 'button';

    readonly #internals = this.attachInternals();

    #onClick(): void {
        if (this.type === 'submit') this.#internals.form?.requestSubmit();
        else if (this.type === 'reset') this.#internals.form?.reset();
    }

    override render() {
        return html`
            <button
                part="base"
                type=${this.type}
                ?disabled=${this.disabled}
                @click=${this.#onClick}
            >
                <slot name="left-icon"></slot>
                <slot></slot>
                <slot name="right-icon"></slot>
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-button': HmiButton;
    }
}
```

### `src/elements/button/button.styles.ts`

A 1:1 port of `button.styled.css`: `.button` → `button`, `.button--x` →
`:host([variant='x']) button`, `.button svg` → `::slotted(svg)`, every `rem` →
`calc(var(--_base) * N)`.

```ts
import { css } from 'lit';

/* Asymmetric "leaf" corner with elevation-driven press feedback.
   Rest: elevation-1 → hover: elevation-3 → active: elevation-0 + 1px nudge. */
export const styles = css`
    :host {
        display: inline-flex;
        vertical-align: middle;
    }

    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-4);
        height: calc(var(--_base) * 5);
        padding: 0 var(--space-8);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        border: calc(var(--_base) * 0.125) solid transparent;
        background: transparent;
        color: var(--on-background);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        font-weight: 600;
        letter-spacing: -0.005em;
        cursor: default;
        user-select: none;
        white-space: nowrap;
        box-shadow: var(--elevation-1);
        position: relative;
        transition:
            box-shadow var(--duration-short-3) var(--easing-standard),
            background var(--duration-short-3) var(--easing-standard),
            border-color var(--duration-short-3) var(--easing-standard),
            color var(--duration-short-3) var(--easing-standard),
            transform var(--duration-short-1) var(--easing-emphasized-accelerate);
    }

    button:hover {
        box-shadow: var(--elevation-3);
    }

    button:not([disabled]):active {
        box-shadow: var(--elevation-0);
        transform: translateY(calc(var(--_base) * 0.125));
        transition-duration: var(--duration-short-1);
    }

    ::slotted(svg) {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
        flex: none;
    }

    button[disabled] {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    button:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    /* Variants */
    :host([variant='primary']) button {
        background: var(--primary);
        color: var(--on-primary);
    }
    :host([variant='primary']) button:hover {
        background: color-mix(in oklab, var(--primary) 92%, #000 8%);
    }

    :host([variant='secondary']) button {
        background: var(--surface-container-lowest);
        color: var(--on-background);
        border-color: var(--outline-variant);
    }
    :host([variant='secondary']) button:hover {
        background: var(--surface-container);
        border-color: var(--outline);
    }

    :host([variant='ghost']) button {
        color: var(--on-background);
        box-shadow: none;
    }
    :host([variant='ghost']) button:hover {
        background: var(--surface-container-high);
        box-shadow: none;
    }
    :host([variant='ghost']) button:active {
        box-shadow: none;
    }

    :host([variant='soft']) button {
        background: var(--primary-container);
        color: var(--on-primary-container);
    }
    :host([variant='soft']) button:hover {
        background: color-mix(
            in oklab,
            var(--primary-container) 80%,
            var(--primary) 20%
        );
    }

    :host([variant='danger']) button {
        background: var(--error);
        color: var(--on-error);
    }
    :host([variant='danger']) button:hover {
        background: color-mix(in oklab, var(--error) 92%, #000 8%);
    }

    :host([variant='link']) button {
        height: auto;
        padding: 0;
        color: var(--ref-primary-40);
        text-decoration: underline;
        text-decoration-thickness: calc(var(--_base) * 0.125);
        text-underline-offset: calc(var(--_base) * 0.375);
        text-decoration-color: color-mix(
            in oklab,
            var(--ref-primary-40) 40%,
            transparent
        );
        box-shadow: none;
    }
    :host([variant='link']) button:hover {
        text-decoration-color: var(--ref-primary-40);
        box-shadow: none;
    }
    :host([variant='link']) button:active {
        box-shadow: none;
        transform: none;
    }

    /* Sizes */
    :host([size='small']) button {
        height: calc(var(--_base) * 4);
        padding: 0 var(--space-6);
        font-size: calc(var(--_base) * 1.5);
    }
    :host([size='large']) button {
        height: calc(var(--_base) * 6);
        padding: 0 var(--space-10);
        font-size: calc(var(--_base) * 2);
    }

    :host([as-icon]) button {
        width: calc(var(--_base) * 5);
        padding: 0;
    }
    :host([as-icon][size='small']) button {
        width: calc(var(--_base) * 4);
    }
    :host([as-icon][size='large']) button {
        width: calc(var(--_base) * 6);
    }
`;
```

### `src/elements/button/button.react.ts`

```ts
import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiButton } from './button.js';

export type { ButtonSize, ButtonType, ButtonVariant } from './button.js';

/* No `events` map: click is a native, composed event. */
export const Button = createComponent({
    tagName: 'hmi-button',
    elementClass: HmiButton,
    react: React,
    displayName: 'Button',
});
```

### `src/elements/button/button.stories.ts`

`Components/Forms/Button` with stories `Default`, `Variants` (all six),
`Sizes`, `Icons` (`<svg slot="left-icon">`), `Disabled`, `IconOnly`.

### `src/elements/button/button.test.ts`

`registers`, `renders [part="base"]`, `reflects variant`, `reflects size`,
`reflects as-icon`, `boolean attribute presence (disabled)`, `projects the
left-icon slot`, `type="submit" calls form.requestSubmit` (spy on a wrapping
`<form>`), `exposes roles` (inner `button` has no explicit role), `mounts
through the React wrapper` (`onClick` fires).

### Consumer diff

```tsx
// v5
import { Button } from '@ninoverse/hmi-components';
<Button variant="primary" leftIcon={<Icon />} onClick={save}>Save</Button>

// v6
import { Button } from '@ninoverse/hmi-components/react/button';
<Button variant="primary" onClick={save}><Icon slot="left-icon" />Save</Button>
```

```html
<!-- plain HTML / Dioxus / Angular / Vue -->
<hmi-button variant="primary"><svg slot="left-icon">…</svg>Save</hmi-button>
```

## 18. File templates

hmi's templates for the six files. `/new-element` starts from the generic four
in `.agents/new-element/`, and `.agents/new-element.local.md` adds what these
already hold: the prefix, `baseStyles`, the React wrapper, the story and the
wrapper test. Placeholders: `<kebab>`, `<Pascal>`, `<Category>`.

### `<kebab>.ts`

```ts
import { html, isServer, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { baseStyles } from '../shared/base.styles.js';
import { emit } from '../shared/events.js';
import { styles } from './<kebab>.styles.js';

export type <Pascal>Variant = 'primary' | 'secondary';

export interface <Pascal>ChangeDetail {
    value: string;
}

/**
 * <One-line description from the React JSDoc.>
 *
 * @tag hmi-<kebab>
 * @slot - Default content.
 * @slot icon - Leading icon.
 * @csspart base - Root interactive node.
 * @fires {CustomEvent<<Pascal>ChangeDetail>} hmi-change - Value committed.
 */
@customElement('hmi-<kebab>')
export class Hmi<Pascal> extends LitElement {
    static override styles = [baseStyles, styles];

    /** Visual style. @default 'primary' */
    @property({ reflect: true }) accessor variant: <Pascal>Variant = 'primary';

    /** Disables interaction. @default false */
    @property({ type: Boolean, reflect: true }) accessor disabled = false;

    /** Current value. */
    @property() accessor value = '';

    /** Data items (JS property only). */
    @property({ type: Array, attribute: false }) accessor items: readonly string[] = [];

    @state() private accessor open = false;

    @query('[part="base"]') private accessor base!: HTMLElement;

    #abort: AbortController | undefined;

    override connectedCallback(): void {
        super.connectedCallback();
        if (isServer) return;
        this.#abort = new AbortController();
        // document/window listeners go here with { signal: this.#abort.signal }
    }

    override disconnectedCallback(): void {
        this.#abort?.abort();
        super.disconnectedCallback();
    }

    #setValue(next: string): void {
        if (next === this.value) return;
        this.value = next;
        emit<<Pascal>ChangeDetail>(this, 'hmi-change', { value: next });
    }

    override render() {
        return html`
            <div part="base" class="base" ?data-open=${this.open}>
                <slot name="icon"></slot>
                <slot></slot>
                ${this.items.length > 0
                    ? html`<ul part="list">
                          ${this.items.map(
                              (item) => html`<li part="item">
                                  <slot name=${`label-${item}`}>${item}</slot>
                              </li>`,
                          )}
                      </ul>`
                    : nothing}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-<kebab>': Hmi<Pascal>;
    }
}
```

Form-associated elements add the block from [§13](#13-forms).

### `<kebab>.styles.ts`

```ts
import { css } from 'lit';

export const styles = css`
    :host {
        display: inline-flex;
    }

    .base {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        height: calc(var(--_base) * 2.75);
        padding: 0 var(--space-4);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        background: var(--surface-container);
        color: var(--on-surface-variant);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.5);
    }

    :host([variant='primary']) .base {
        background: var(--primary-container);
        color: var(--on-primary-container);
    }

    :host([disabled]) .base {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    ::slotted(svg) {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
        flex: none;
    }

    @media (prefers-reduced-motion: reduce) {
        .base {
            transition: none;
        }
    }
`;
```

### `<kebab>.react.ts`

```ts
import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { Hmi<Pascal>, type <Pascal>ChangeDetail } from './<kebab>.js';

export type { <Pascal>ChangeDetail, <Pascal>Variant } from './<kebab>.js';

export const <Pascal> = createComponent({
    tagName: 'hmi-<kebab>',
    elementClass: Hmi<Pascal>,
    react: React,
    displayName: '<Pascal>',
    events: {
        onChange: 'hmi-change' as EventName<CustomEvent<<Pascal>ChangeDetail>>,
    },
});
```

### `<kebab>.stories.ts`

```ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './<kebab>.js';
import type { Hmi<Pascal> } from './<kebab>.js';

type Args = Pick<Hmi<Pascal>, 'variant' | 'disabled'>;

const meta = {
    title: 'Components/<Category>/<Pascal>',
    component: 'hmi-<kebab>',
    tags: ['autodocs'],
    args: { variant: 'primary', disabled: false },
    render: (args) => html`
        <hmi-<kebab> variant=${ifDefined(args.variant)} ?disabled=${args.disabled}>
            Label
        </hmi-<kebab>>
    `,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { <Pascal> } from '@ninoverse/hmi-components/react/<kebab>'`",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Variants: Story = {
    render: () => html`
        ${(['primary', 'secondary'] as const).map(
            (variant) => html`<hmi-<kebab> variant=${variant}>${variant}</hmi-<kebab>> `,
        )}
    `,
};
```

Controls and the props/events/slots/parts tables come from
`custom-elements.json` (`setCustomElementsManifest` in `.storybook/preview.ts`,
added in PR 2).

### `<kebab>.test.ts` (Vitest, browser mode)

```ts
import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import './<kebab>.js';
import type { Hmi<Pascal> } from './<kebab>.js';
import { <Pascal> } from './<kebab>.react.js';

async function fixture(template: ReturnType<typeof html>): Promise<Hmi<Pascal>> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as Hmi<Pascal>;
    await el.updateComplete;
    return el;
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-<kebab>', () => {
    it('registers', () => {
        expect(customElements.get('hmi-<kebab>')).toBeDefined();
    });

    it('renders', async () => {
        const el = await fixture(html`<hmi-<kebab>>Hi</hmi-<kebab>>`);
        expect(el.shadowRoot?.querySelector('[part="base"]')).not.toBeNull();
    });

    it('reflects variant', async () => {
        const el = await fixture(html`<hmi-<kebab> variant="secondary"></hmi-<kebab>>`);
        expect(el.variant).toBe('secondary');
        el.variant = 'primary';
        await el.updateComplete;
        expect(el.getAttribute('variant')).toBe('primary');
    });

    it('boolean attribute presence', async () => {
        const el = await fixture(html`<hmi-<kebab> disabled></hmi-<kebab>>`);
        expect(el.disabled).toBe(true);
        el.removeAttribute('disabled');
        await el.updateComplete;
        expect(el.disabled).toBe(false);
    });

    it('dispatches hmi-change with { value }', async () => {
        const el = await fixture(html`<hmi-<kebab>></hmi-<kebab>>`);
        const spy = vi.fn();
        document.addEventListener('hmi-change', spy, { once: true }); // proves bubbles + composed
        // trigger the interaction on el.shadowRoot here
        expect(spy).toHaveBeenCalledOnce();
        expect(spy.mock.calls[0]?.[0]).toMatchObject({
            detail: { value: expect.any(String) },
            bubbles: true,
            composed: true,
        });
    });

    it('projects the icon slot', async () => {
        const el = await fixture(html`<hmi-<kebab>><svg slot="icon"></svg></hmi-<kebab>>`);
        const slot = el.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="icon"]');
        expect(slot?.assignedElements()).toHaveLength(1);
    });

    // form-associated elements only
    it('submits its value and resets', async () => {
        const form = document.createElement('form');
        document.body.append(form);
        render(html`<hmi-<kebab> name="f" value="x"></hmi-<kebab>>`, form);
        const el = form.firstElementChild as Hmi<Pascal>;
        await el.updateComplete;
        expect(new FormData(form).get('f')).toBe('x');
        el.value = 'y';
        await el.updateComplete;
        form.reset();
        await el.updateComplete;
        expect(el.value).toBe('x');
    });

    it('exposes roles', async () => {
        const el = await fixture(html`<hmi-<kebab>></hmi-<kebab>>`);
        expect(el.shadowRoot?.querySelector('[part="base"]')?.getAttribute('role')).toBe(null);
    });

    it('mounts through the React wrapper', async () => {
        const mount = document.createElement('div');
        document.body.append(mount);
        const onChange = vi.fn();
        await act(async () => {
            createRoot(mount).render(createElement(<Pascal>, { variant: 'secondary', onChange }, 'Hi'));
        });
        const el = mount.querySelector('hmi-<kebab>') as Hmi<Pascal>;
        expect(el.variant).toBe('secondary');
        el.dispatchEvent(new CustomEvent('hmi-change', { detail: { value: 'y' }, bubbles: true, composed: true }));
        expect(onChange).toHaveBeenCalledOnce();
    });
});
```

### `<kebab>.ssr.test.ts` (Vitest, Node)

```ts
// @vitest-environment node
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import { html } from 'lit';
import { expect, it } from 'vitest';
import './<kebab>.js';

it('renders declarative shadow DOM on the server', async () => {
    const out = await collectResult(
        render(html`<hmi-<kebab> variant="primary">Hi</hmi-<kebab>>`),
    );
    expect(out).toContain('<template shadowroot');
    expect(out).toContain('part="base"');
    expect(out).toContain('Hi');
});
```
