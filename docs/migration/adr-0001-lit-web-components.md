# ADR 0001 — Migrate the component library from React to Lit web components

- **Status:** Accepted, 2026-09-09
- **Deciders:** library maintainer
- **Related:** `README.md` (playbook), `translation-guide.md`, `.claude/lit-migration.md`, `tracker.md`

## Context

`@ninoverse/hmi-components` v5 is a React 19 library of 85 components with a
token-based MD3 theme system. Non-React hosts (plain HTML, Vue, Angular,
Dioxus) are served by an IIFE built with `@r2wc/react-to-web-component`, which
bundles React, renders in light DOM and relies on one global stylesheet.

An audit of the codebase before this decision found:

- The React code is unusually portable: no context providers, no `forwardRef`,
  no compound components; every composite is a single element driven by array
  props; callbacks receive raw values; the 14 charts are pure SVG.
- The r2wc layer already implements form association through
  `ElementInternals` and has a bug that turns a bare boolean attribute into
  `false`.
- 90 props across 40 components accept `ReactNode`, many inside arrays; five
  props are render functions.
- All 147 theme tokens live on `:root`/`html[data-*]` and inherit through
  shadow roots. The two material themes and four component sheets style
  component classes globally, which a shadow root blocks. The structure tokens
  and 527 component values are `rem`-based against `html { font-size: 8px }`,
  a global requirement on host apps that `dist/style.css` does not even ship.
- Nine overlays portal to `document.body`; outside-click uses `event.target`;
  focus restore uses `document.activeElement`; Tooltip's `aria-describedby`
  points across a portal.
- There is no test runner. Storybook prop tables come from react-docgen.

## Decision

Rebuild every component as a Lit 3 custom element with Shadow DOM, one element
or small batch per pull request, additive on `main` until a v6 flip. The
detailed choices, each with the alternatives rejected:

### Compatibility and release

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| 1 | Clean break at v6: the React API becomes the `@lit/react` wrappers (events are `CustomEvent`s, rich content is slotted). The README documents the changes. | Hand-written adapters preserving `onChange(value)` and `ReactNode` props (doubles the surface); shipping both trees for a deprecation window. |
| 4 | Additive rollout: elements land under `./wc/<kebab>` and `./react/<kebab>` in 5.x minors; the last PR flips root exports, deletes the React tree and r2wc, and cuts 6.0.0. | `6.0.0-next` prereleases (semver noise, opt-in confusion); a long-lived branch (no early feedback, one giant merge). |
| 22 | The first PR is documentation, rules and skills only; the second is tooling; elements follow. | Docs plus tooling in one PR; docs plus a pilot element. |
| 29 | The docs PR triggers the automatic patch release; accepted. | A `[skip release]` guard in the bump workflow. |
| 32 | Migration branches are `migrate/<kebab>` or `migrate/phase-<n>-<group>`, always cut from a merged `main`, never stacked. Commits are `feat(ui): migrate <Name> to lit`. | Reusing `feat/`; stacking PRs. |

### Packaging

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| 2 | One package. Lit elements at the root and per-element subpaths; React wrappers under `./react`; `lit` is a dependency; `react`/`react-dom` become optional peers. | A pnpm workspace with a separate React package (second release pipeline); bundling Lit into every output (duplicates Lit in Lit-using apps). |
| 3 | "Zero framework dependency": Lit is the one allowed runtime dependency; everything else is hand-rolled. | Literal zero deps (vanilla custom elements, contradicts the goal); an allowlist of micro-dependencies. |
| 28 | A separate Lit drop-in bundle `dist/hmi-elements.iife.js` until v6; the r2wc bundle is untouched; both must never be loaded together. At v6 the Lit bundle takes the `hmi-components.iife.js` name. | Lit elements taking over tags inside the r2wc bundle (hybrid bundle with React inside); ESM-only Lit until v6. |

### Styling and theming

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| 5 | Token-only theming: theme files define only custom properties. Panel looks become `--panel-*` tokens. Panel-like elements expose `part="panel"` as an escape hatch. | Mirroring `data-theme/structure/material` onto every host (observer per element); themes targeting `::part()` directly (couples themes to internals). |
| 6 | Sizing decoupled from the root font size: `--hmi-base` (8px) feeds `calc(var(--_base) * N)`; `rem` is forbidden in elements; structure tokens are rebased in the tooling PR. | Keeping `rem` and shipping a mandatory `base.css` root rule (imposes 8px on host apps); converting to `px` (loses scaling). |
| 7 | Consumer styling surface: tokens, a small documented set of `part` names per element, and class/style on the host. | Tokens only (no escape hatch); a part on every node (unbounded API). |
| 8 | Global CSS is `./themes/*` plus one small `./base.css`; `style.css` and `web-components.css` become aliases at v6 and are removed at v7. | No base sheet; keeping both legacy names forever. |
| 18 | Browser baseline 2024: Popover API, `<dialog>`, `:has()`, nesting, container queries, `ElementInternals` used directly; anchor positioning and `popover=hint` as progressive enhancement. | Evergreen-only (excludes Safari < 26 webviews); feature-detecting everything (twice the code). |
| 34 | The liquid material's SVG filter is embedded by each panel-like element so `url('#liquid-glass')` resolves inside the root. | Degrading liquid to blur only; dropping the material. |

### Component API

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| 9 | Singular `ReactNode` props become named slots. | Serialising markup strings. |
| 10 | Array-item content is strings plus a per-item slot override keyed by the item value, with the string as fallback. | Strings only (no rich tabs/nodes); `TemplateResult` inside data (Lit-only richness); child elements for every composite (full redesign). |
| 11 | Render functions become three tiers: JSON cell kinds rendered by the element, per-cell slot overrides, and a JS-only function property. | Declarative only (no custom cells); functions only (unusable from attributes). |
| 12 | Events are `hmi-` prefixed kebab names, `bubbles` + `composed`, object `detail`; close/dismiss/cancel are cancelable. | Unprefixed native-style names (collide with inner native events); component-scoped names (verbose, break wrapper prop mapping). |
| 13 | Boolean attributes follow HTML presence semantics; the `"false"` gotcha is documented with the property route for Dioxus. | A converter treating `"false"` as false (non-standard). |
| 17 | Layout primitives stay as elements. | Dropping them or turning them into utility classes. |
| 31 | Kebab-case for everything under `src/elements/`; the class is `Hmi<Pascal>`; React wrappers keep v5 PascalCase names. | camelCase files with kebab tags. |
| 33 | Text inputs fire `hmi-input` per keystroke and `hmi-change` on commit (native semantics). | Per-keystroke `hmi-change` for parity with v5. |

### Forms, accessibility, overlays

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| 14 | Every value-bearing control is form-associated through `ElementInternals`, porting the r2wc `FormKind` semantics. | Only native-wrapping inputs; no form association. |
| 15 | Each form element renders its own `label`, `hint`, `error`, `required` inside its shadow root; `hmi-form-control` becomes a layout-only, deprecated wrapper. | ARIA element references across roots (partial browser support); visual-only labelling as today. |
| 16 | Overlays use the native top layer: `<dialog>.showModal()` for modal-type, the `popover` attribute for floating overlays, a shared positioning controller, feature-detected fallback. | In-shadow `position: fixed` (breaks in transformed ancestors, keeps z-index wars); a document-level overlay host element (re-creates portal seams). |

### Source and tooling

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| 19 | TC39 standard decorators with `accessor`; no tsconfig change. | `experimentalDecorators` (requires `useDefineForClassFields: false`); no decorators. |
| 20 | Storybook on `@storybook/web-components-vite` with `custom-elements.json` driving controls and docs. | Keeping react-vite against wrappers; two Storybooks. |
| 21 | Vitest browser mode (Playwright Chromium) plus a Node SSR smoke test, required for every element and run in CI. | `@web/test-runner`; no automated tests. |
| 23 | `src/elements/<kebab>/` folder per element with six files; `src/elements/shared/` for infrastructure; `src/react/index.ts` barrel. | Flat files split across `src/elements` and `src/react`; folders inside `src/components` (import collisions). |
| 30 | A framework-agnostic theme module plus a thin `useTheme` React hook; no provider element. | Pure CSS with no JS API; a `@lit/context` provider element. |

### Process

| # | Decision | Rejected alternatives |
|---|----------|-----------------------|
| 24 | Risk-ascending order with Badge as the pilot: leaves, layout, inputs, selection, data display, navigation, charts, overlays, overlay composites, toast/theme/flip. | Value-first (Button, Input, Select, Modal first); alphabetical. |
| 25 | Each element is verified in plain HTML, React 19, Dioxus, and Angular or Vue. | — |
| 26 | SSR is required for Next.js, Angular SSR and Dioxus fullstack. | No SSR requirement. |
| 27 | Definition of done includes the full automated gate and a side-by-side screenshot approved by the maintainer. | No screenshot step; lint + build + tests only. |

## Consequences

**Breaking for React consumers at v6**

- Imports move to `@ninoverse/hmi-components/react/<kebab>` (or the root, which exports the elements).
- Callback props receive `CustomEvent`s (`e.detail.value`), text inputs split into `onInput` and `onChange`.
- `ReactNode` props become slotted children (`<Icon slot="left-icon" />`).
- `style.css` is replaced by `base.css` plus theme files.
- `ThemeProvider` is replaced by `setTheme`/`useTheme`.

**New duties for every host**

- Load `base.css` and one theme per axis.
- Understand boolean presence semantics.
- Never load the r2wc and Lit bundles together during the migration.

**Costs**

- Every element PR carries tests, a story, a manifest update and a screenshot review.
- CI gains a browser test job.
- Two implementations coexist for the duration of the migration.

## Follow-ups

Owned by PR 2 unless noted; listed in `README.md` §10. Items marked *settled* were closed by PR 2 (5.7):

1. Biome formatting of `accessor` decorators. *Settled: works unconfigured.*
2. `tsconfig.node.json` coverage of every config file. *Settled.*
3. `vite-plugin-dts` output paths for `dist/wc` and `dist/react`. *Settled: declarations stay under `dist/elements/`; `exports.types` points there.*
4. Storybook framework swap and the fate of React stories mid-migration. *Settled: swapped to `web-components-vite`; React stories are not built until the flip, the React demo stays at `/demo/`.*
5. Custom-elements manifest configuration and commit policy. *Settled: committed, drift checked in CI.*
6. Vitest browser provider and CI Chromium install. *Settled: `@vitest/browser-playwright`, `playwright install --with-deps chromium`.*
7. `sideEffects` verification with a consumer smoke bundle. *Settled: `pnpm check:subpaths` bundles each `./wc/<name>` on its own; shared chunks go to `dist/chunks/`, which `sideEffects` lists.*
8. Next.js example with `@lit-labs/ssr-react` (phase 11).
9. Generated `:not(:defined)` rules in `base.css`. *Settled: `scripts/gen-base-css.mjs`.*
10. Rebase of `rem` theme tokens onto `--hmi-base`. *Settled.*
11. `--panel-*` vocabulary and material/journal overrides before phase 2. *Settled: `--panel-bg`, `--panel-bg-strong`, `--panel-border`, `--panel-filter`, `--panel-ink-bg`, `--panel-accent-bg`; journal hooks `--list-divider-style`, `--progress-track-border`, `--stat-rule`, `--switch-thumb-shadow`. The material files lost their class selectors immediately, so v5 React components render solid under glass/liquid until migrated.*
12. Top-layer stacking of toasts under modals (phase 11).
13. `attachInternals()` under the SSR DOM shim. *Settled: works in a field initializer (`ssr.ssr.test.ts`).*
14. Lit IIFE config and de-duplication of the theme-copy plugin. *Settled.*
15. Typedoc entry points or a manifest-driven `pnpm docs`.
16. Button `formAssociated` for submit/reset (phase 4).
17. Exact `hmi-input`/`hmi-change` shapes for combobox query text and slider drag (phases 5 and 10).
