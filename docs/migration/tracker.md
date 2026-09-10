# Lit migration tracker

One row per element. Update the **Status** and **PR** columns in the same PR that
migrates the element (see `.claude/skills/ship-component/SKILL.md`). Phases are
gated: a phase may start only when every PR of the previous phase is merged
(`.claude/execution-order.md`).

## Status vocabulary

| Status | Meaning |
|--------|---------|
| `Todo` | Not started |
| `In progress` | Branch open, no PR yet |
| `In review` | Draft/ready PR open |
| `Done` | Merged; element available under `./wc/<kebab>` and `./react/<kebab>` |
| `Flipped` | Root export points at the Lit element (v6) |

## Flags

| Flag | Meaning |
|------|---------|
| `F` | Form-associated (`ElementInternals`), see `.claude/lit-migration.md` R7 |
| `O` | Overlay — `<dialog>` or `popover` top layer, R8 |
| `S` | Singular rich-content props become named slots, R6 |
| `A` | Array-item content becomes strings + per-item slot overrides, R6 |
| `R` | Render-function props become the three tiers, R6 |
| `P` | Panel-like: exposes `part="panel"`, paints from `--panel-*`, embeds the liquid filter, R4 |
| `D` | Uses document/window listeners or `document.activeElement` today — port with `composedPath()` / `activeElementDeep()`, R3 |
| `X` | Has cross-boundary CSS today (theme attribute or another component's class) — must become tokens or `::slotted()`, R4 |
| `E` | Dispatches one or more `hmi-*` events, R5 |

## Phase 0 — infrastructure (PR 2, no elements)

| Item | Location | Status | PR |
|------|----------|--------|----|
| `baseStyles` (`:host` box-sizing, `--_base`, hidden, focus ring) | `src/elements/shared/base.styles.ts` | Done | [#114](https://github.com/ninoverse/hmi-components/pull/114) |
| `emit()` helper | `src/elements/shared/events.ts` | Done | [#114](https://github.com/ninoverse/hmi-components/pull/114) |
| `activeElementDeep()` and `supportsPopover()` helpers | `src/elements/shared/dom.ts` | Done | [#114](https://github.com/ninoverse/hmi-components/pull/114) |
| `base.css` (`--hmi-base`, body defaults, `:not(:defined)`) | `public/css/base.css` → `dist/base.css` | Done | [#114](https://github.com/ninoverse/hmi-components/pull/114) |
| Structure/constants/material tokens converted from `rem` to `calc(var(--hmi-base, 8px) * N)` | `public/css/themes/**` | Done | [#114](https://github.com/ninoverse/hmi-components/pull/114) |
| `--panel-*` tokens + glass/liquid overrides, journal hooks; class selectors removed from theme files | `public/css/themes/**` | Done | [#114](https://github.com/ninoverse/hmi-components/pull/114) |
| Lit IIFE bundle `dist/hmi-elements.iife.js` | `vite.elements.config.ts` | Done | [#114](https://github.com/ninoverse/hmi-components/pull/114) |
| Vitest browser + SSR projects, CEM analyzer, Storybook `web-components-vite`, `ci-gate` steps | root configs, `.github/workflows/ci-gate.yml` | Done | [#114](https://github.com/ninoverse/hmi-components/pull/114) |

## Elements

| Element tag | React source | Phase | Risk | Flags | Notes | Status | PR |
|-------------|--------------|-------|------|-------|-------|--------|----|
| `hmi-badge` | `badge.tsx` | 1 | low | | Pilot. Freezes the templates and the DoD. `dot` boolean, `variant`. | Done | [#115](https://github.com/ninoverse/hmi-components/pull/115) |
| `hmi-alert` | `alert.tsx` | 2 | low | S | Slots `icon`, `title`, `action`. | Todo | |
| `hmi-avatar` | `avatar.tsx` | 2 | low | | Computed tint stays inline style, on `part="base"`. Host carries the circle's box so `hmi-avatar-stack` can rim it via `::slotted(hmi-avatar)`. | In review | [#118](https://github.com/ninoverse/hmi-components/pull/118) |
| `hmi-avatar-stack` | `avatarStack.tsx` | 2 | low | X | Its rules live in `avatar.styled.css`. Avatars are `<hmi-avatar>` rendered **into this element's own root**, not slotted — `size` must reach each one and `max` must hide the rest, neither possible on consumer nodes without mutating light DOM. So `.avatar-stack .avatar` becomes a plain `hmi-avatar` selector, not `::slotted()` (which cannot express the `+` overlap rule). `names` is a JS property. | In review | [#118](https://github.com/ninoverse/hmi-components/pull/118) |
| `hmi-banner` | `banner.tsx` | 2 | low | S E | Slots `icon`, `title`, `action`; `hmi-dismiss` (cancelable). | Todo | |
| `hmi-blockquote` | `blockquote.tsx` | 2 | low | S | Slot `cite`. | Todo | |
| `hmi-card` | `card.tsx` | 2 | low | P | First `--panel-*` consumer; lands `shared/panel.ts` (`renderLiquidFilter()`). Slots `header`, `footer` are **new API** — the React card took only `children`, so no `S` conversion. Variants `ink`/`accent` map to `--panel-ink-bg`/`--panel-accent-bg`. | Done | [#116](https://github.com/ninoverse/hmi-components/pull/116) |
| `hmi-chip` | `chip.tsx` | 2 | low | S E | Slot `icon`; `hmi-select { selected }`, `hmi-close` (cancelable). | Todo | |
| `hmi-code` | `code.tsx` | 2 | low | | | Todo | |
| `hmi-empty-state` | `emptyState.tsx` | 2 | low | S | Slots `icon`, `title`, `description`, `action`; `.empty-state__icon > svg` → `::slotted(svg)`. | Todo | |
| `hmi-kbd` | `kbd.tsx` | 2 | low | | | Todo | |
| `hmi-meter` | `meter.tsx` | 2 | low | S | Slot `label`. | Todo | |
| `hmi-progress` | `progress.tsx` | 2 | low | X | `[data-structure="journal"] .progress` → `--progress-track-border` token (defined). | Todo | |
| `hmi-skeleton` | `skeleton.tsx` | 2 | low | | Inline size styles stay. | Todo | |
| `hmi-spinner` | `spinner.tsx` | 2 | low | | Keyframes move into `styles`. | Todo | |
| `hmi-stat` | `stat.tsx` | 2 | low | S X | Slots `label`, `value`, `icon`, `delta`, `help-text`; `[data-structure="journal"] .stat__footer` → `--stat-rule` token. | Todo | |
| `hmi-aspect-ratio` | `aspectRatio.tsx` | 3 | low | | `ratio` reflected → `aspect-ratio` on `:host`. | Todo | |
| `hmi-box` | `box.tsx` | 3 | low | | `as` dropped; reflected spacing attrs. | Todo | |
| `hmi-divider` | `divider.tsx` | 3 | low | | Labeled variant a11y note in `TODO.md` still applies. | Todo | |
| `hmi-flex` | `flex.tsx` | 3 | low | | `:host { display: flex }`; `direction`, `align`, `justify`, `gap`, `wrap` reflected. | Todo | |
| `hmi-grid` | `grid.tsx` | 3 | low | | `columns` → `--_columns` on host. | Todo | |
| `hmi-heading` | `heading.tsx` | 3 | low | | `level` picks the inner `h1`–`h6`. | Todo | |
| `hmi-link` | `link.tsx` | 3 | low | | Inner `<a part="base">`; `href`, `target`, `rel` mirrored. | Todo | |
| `hmi-scroll-area` | `scrollArea.tsx` | 3 | low | | Scrollbar styles move into `styles`. | Todo | |
| `hmi-spacer` | `spacer.tsx` | 3 | low | | | Todo | |
| `hmi-text` | `text.tsx` | 3 | low | | `as` dropped; `variant`/`tone` reflected. | Todo | |
| `hmi-visually-hidden` | `visuallyHidden.tsx` | 3 | low | | | Todo | |
| `hmi-button` | `button.tsx` | 4 | med | S F | Worked example in `translation-guide.md`. Slots `left-icon`, `right-icon`; `formAssociated` for `type="submit"/"reset"`; `delegatesFocus`. | Todo | |
| `hmi-form-control` | `formControl.tsx` | 4 | low | S | Deprecated at birth: layout-only wrapper; label/hint/error move onto each input. | Todo | |
| `hmi-input` | `input.tsx` | 4 | med | S F E D | Lands `shared/form.ts`. Slots `left-icon`, `right-icon`; `hmi-input` + `hmi-change`; `controlledTextCaret` obsolete. | Todo | |
| `hmi-textarea` | `textarea.tsx` | 4 | med | F E | `hmi-input` + `hmi-change`. | Todo | |
| `hmi-number-input` | `numberInput.tsx` | 4 | med | F E | Numeric form kind; `hmi-input` + `hmi-change { value: number \| null }`. | Todo | |
| `hmi-password-input` | `passwordInput.tsx` | 4 | med | F E | Composes `<hmi-input>`; toggle button; depended on global `button { font: inherit }`. | Todo | |
| `hmi-search-input` | `searchInput.tsx` | 4 | low | F E | No own CSS today; composes `<hmi-input>`. | Todo | |
| `hmi-multi-input` | `multiInput.tsx` | 4 | med | F E | `hmi-input`, `hmi-change`, `hmi-complete`; `autofocus` prop. | Todo | |
| `hmi-file-upload` | `fileUpload.tsx` | 4 | med | F E | `hmi-change { value: FileDescriptor[] }`; hidden native input inside the root. | Todo | |
| `hmi-checkbox` | `checkbox.tsx` | 5 | med | S F E | Checkable form kind; slot `label`; `hmi-change { value: boolean }`. | Todo | |
| `hmi-radio` | `radio.tsx` | 5 | med | S F E | Checkable; group behaviour via `name` inside `hmi-radio-group`. | Todo | |
| `hmi-radio-group` | `radioGroup.tsx` | 5 | med | A F E | No own CSS today; `name` required; options strings + `label-<value>` slots. | Todo | |
| `hmi-switch` | `switch.tsx` | 5 | med | S F E X | `[data-structure="journal"] .switch__thumb` → `--switch-thumb-shadow` token (defined). | Todo | |
| `hmi-slider` | `slider.tsx` | 5 | med | F E | Numeric; `--slider-pct` set on host; `hmi-input` while dragging, `hmi-change` on release; `formatValue` → template string + `format` JS-only. | Todo | |
| `hmi-segmented-control` | `segmentedControl.tsx` | 5 | med | A F E | Roving tabindex; options strings + `label-<value>` slots. | Todo | |
| `hmi-value-scale-selector` | `valueScaleSelector.tsx` | 5 | med | S F E | Numeric; slot `icon`; `applyTemplate` for labels. | Todo | |
| `hmi-accordion` | `accordion.tsx` | 6 | med | A E | Items `title`/`body` strings + `title-<index>`/`body-<index>` slots; idrefs stay inside the root; `hmi-open-change { open }`. | Todo | |
| `hmi-carousel` | `carousel.tsx` | 6 | med | S E D | Slides = children with `slot="slide"`; `hmi-index-change`; resize listener via AbortController. | Todo | |
| `hmi-image` | `image.tsx` | 6 | med | S R E | `renderImage` → default slot; `fallback` slot; `hmi-load`/`hmi-error`. | Todo | |
| `hmi-list` | `list.tsx` | 6 | med | A R E X | `renderItem` → three tiers; `hmi-reorder { items }`; `[data-structure="journal"] .list__item` → `--list-divider-style` token (defined). | Todo | |
| `hmi-table` | `table.tsx` | 6 | high | A R E | Cell kinds `text`/`format`/`badge`/`link`/`actions`; `cell-<rowKey>-<columnKey>` slots; `render` JS-only; `getRowKey` → `row-key`; `hmi-sort`, `hmi-action { value, row }`. | Todo | |
| `hmi-timeline` | `timeline.tsx` | 6 | low | A | Items strings + `title-<index>`/`description-<index>` slots. | Todo | |
| `hmi-breadcrumbs` | `breadcrumbs.tsx` | 7 | low | A E | `items[].onClick` → `hmi-nav { value, index }`; `separator` slot. | Todo | |
| `hmi-navbar` | `navbar.tsx` | 7 | med | S A E D P | Slots `brand`, `right`; links strings + `label-<value>` slots; `hmi-nav`; panel part. | Todo | |
| `hmi-pagination` | `pagination.tsx` | 7 | low | E | `hmi-change { value: page }`. | Todo | |
| `hmi-sidebar` | `sidebar.tsx` | 7 | med | A E P | Items/groups strings + `label-<value>` slots; badge as string; `hmi-nav`. | Todo | |
| `hmi-stepper` | `stepper.tsx` | 7 | med | A E | `--stepper-item-gap` set on host; `hmi-change { value }`. | Todo | |
| `hmi-tabs` | `tabs.tsx` | 7 | med | A E D | Indicator measured in `updated()`; resize listener; `hmi-change`. | Todo | |
| `hmi-tree` | `tree.tsx` | 7 | high | A E | Roving tabindex; `hmi-select { value }`, `hmi-expanded-change { expanded }`. | Todo | |
| `hmi-cartesian-grid` | `cartesianGrid.tsx` | 8 | low | | Kept as an element AND as `renderCartesianGrid()` in `shared/chart.ts` for the charts that embed it. | Todo | |
| `hmi-chart-tooltip` | `chartTooltip.tsx` | 8 | low | A P | HTML panel; items strings + slots. | Todo | |
| `hmi-legend` | `legend.tsx` | 8 | low | A | | Todo | |
| `hmi-responsive-container` | `responsiveContainer.tsx` | 8 | med | R E | Function child → `hmi-resize { width, height }` + `--_w`/`--_h`; charts read `width`/`height`. | Todo | |
| `hmi-area-chart` | `areaChart.tsx` | 8 | low | | Pure SVG; `series`/`labels` JS properties; colors via `var(--primary)` in style attrs. | Todo | |
| `hmi-bar-chart` | `barChart.tsx` | 8 | low | | | Todo | |
| `hmi-bullet-chart` | `bulletChart.tsx` | 8 | low | | | Todo | |
| `hmi-donut-chart` | `donutChart.tsx` | 8 | low | S | Slot `center-label`. | Todo | |
| `hmi-funnel-chart` | `funnelChart.tsx` | 8 | low | | | Todo | |
| `hmi-gauge` | `gauge.tsx` | 8 | low | S | Slot `label`. | Todo | |
| `hmi-heatmap` | `heatmap.tsx` | 8 | low | | `data` nested arrays as JS property. | Todo | |
| `hmi-line-chart` | `lineChart.tsx` | 8 | low | | | Todo | |
| `hmi-radar-chart` | `radarChart.tsx` | 8 | low | | | Todo | |
| `hmi-scatter-plot` | `scatterPlot.tsx` | 8 | low | | | Todo | |
| `hmi-sparkline` | `sparkline.tsx` | 8 | low | | | Todo | |
| `hmi-modal` | `modal.tsx` | 9 | high | S O E D P | `<dialog>.showModal()`; slots `title`, `description`, `actions`; `DialogAction[]` kept; `hmi-close { reason }` (cancelable), `hmi-action`. Lands `shared/positioning.ts` for the group. | Todo | |
| `hmi-confirm-dialog` | `confirmDialog.tsx` | 9 | med | S O E | Composes `<hmi-modal>`; `hmi-cancel` (cancelable), `hmi-confirm`. | Todo | |
| `hmi-drawer` | `drawer.tsx` | 9 | high | S O E D P | `<dialog>`; `side` reflected; slide keyframes per side. | Todo | |
| `hmi-popover` | `popover.tsx` | 9 | high | S O E D P | `popover="auto"`; `trigger` slot; `PositionController`; `hmi-open-change`. | Todo | |
| `hmi-tooltip` | `tooltip.tsx` | 9 | med | S O | `popover="manual"` (`hint` when supported); `aria-describedby` now resolves inside the root. | Todo | |
| `hmi-hover-card` | `hoverCard.tsx` | 9 | med | S O E D P | Hover/focus timers; `hmi-open-change`. | Todo | |
| `hmi-context-menu` | `contextMenu.tsx` | 9 | high | S O E D P | Pointer-position anchor; `menu` slot. | Todo | |
| `hmi-menu` | `menu.tsx` | 9 | med | P | `hmi-menu`, `hmi-menu-item`, `hmi-menu-separator`, `hmi-menu-label` as sibling elements in one folder. | Todo | |
| `hmi-select` | `select.tsx` | 10 | high | A F O E P | Composes popover + menu; options strings + `label-<value>` slots; no native `<select>`. | Todo | |
| `hmi-combobox` | `combobox.tsx` | 10 | high | A F O E D R | `filterOption` → `filter` JS-only + default includes; query state must re-sync from `value` (existing hazard); `hmi-input` for query text. | Todo | |
| `hmi-date-picker` | `datePicker.tsx` | 10 | high | F O E | Range value object; ARIA grid. | Todo | |
| `hmi-color-picker` | `colorPicker.tsx` | 10 | med | F O E | Swatches array; native color input inside the root. | Todo | |
| `hmi-command-palette` | `commandPalette.tsx` | 10 | high | A O E D | `<dialog>`; commands strings + `label-<value>` slots; `hmi-action`, `hmi-select`, `hmi-open-change`. | Todo | |
| `hmi-toast` | `toast.tsx` | 11 | med | S O E P | `popover="manual"`; store in `shared/toast.ts`; `hmi-dismiss { id }`. | Todo | |
| Theme module + `useTheme` | `theme.tsx` | 11 | med | | `shared/theme.ts` (`setTheme`/`getTheme`/`subscribe`) + `src/react/use-theme.ts`. | Todo | |
| v6 flip | `package.json`, `src/web-components.ts`, `src/components/**`, `src/App.tsx`, `README.md`, `.claude/reproduction-guide.md` | 11 | high | | Root exports → `dist/wc/*`; r2wc removed; Lit IIFE renamed `hmi-components.iife.js`; `style.css`/`web-components.css` aliased to `base.css`; `6.0.0`. | Todo | |
