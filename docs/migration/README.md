# Migrating `@ninoverse/hmi-components` from React to Lit

This is the human playbook for turning the library into native Web Components
built on [Lit](https://lit.dev), one element per pull request, without breaking
React consumers until a single, announced major release (v6).

Companion documents:

- `.claude/lit-migration.md` — the strict rules every element must follow (R1–R12).
- `translation-guide.md` — pattern-by-pattern React → Lit mapping, event catalog, templates, Button worked example.
- `adr-0001-lit-web-components.md` — why each decision was taken and what was rejected.
- `adr-0002-agentcfg-adoption.md` — the decisions for adopting agentcfg's rules and the organization's shared workflows, D1 to D55.
- `tracker.md` — status of every element, grouped by phase.

## 1. Goals

1. **Framework-agnostic.** One implementation that runs in plain HTML, React, Angular, Vue and Dioxus with the same tags, attributes, properties, slots and events.
2. **Encapsulated.** Every element owns its styles in a shadow root. Host-page CSS cannot leak in; theming happens through CSS custom properties and `::part()`.
3. **Native contracts.** Custom events instead of callback props, `<slot>` instead of `ReactNode` props, `ElementInternals` for forms, `<dialog>` and the Popover API for overlays.
4. **React stays first-class** through `@lit/react` wrappers with typed event props.
5. **Server rendering** works for Next.js, Angular SSR and Dioxus fullstack.
6. **One runtime dependency**: Lit. Everything else stays hand-rolled.

## 2. Architecture before and after

| | v5 (today) | v6 (target) |
|---|---|---|
| Implementation | 85 React function components, BEM CSS in `src/components/styled/*.styled.css` | 85 Lit elements in `src/elements/<kebab>/`, CSS in `css\`\`` tagged templates inside the shadow root |
| Non-React hosts | `@r2wc/react-to-web-component` IIFE with React bundled, light DOM, one global stylesheet | Lit elements (ESM per element + one IIFE), Shadow DOM, no React |
| React hosts | direct components | `@lit/react` `createComponent` wrappers under `./react` |
| Rich content | `ReactNode` props | named slots; strings + per-item slots inside data arrays |
| Callbacks | function props with raw values | `hmi-*` `CustomEvent`s with object `detail` |
| Forms | native inputs inside light DOM | form-associated elements (`ElementInternals`) |
| Overlays | `createPortal` to `document.body`, hand-rolled dismiss and z-index | `<dialog>.showModal()` and `popover` (top layer, native dismiss) |
| Theming | 147 tokens on `html[data-theme|structure|material]`; two material themes style component classes globally | same tokens, theme files are token-only; panel look via `--panel-*`; `part="panel"` escape hatch |
| Sizing | `rem` against `html { font-size: 8px }` | `--hmi-base` (8px) on the host chain; no root font-size requirement |
| Global CSS | `dist/style.css` (React), `dist/hmi-components.css` (WC) | `dist/base.css` + `dist/themes/*` |
| Docs | react-docgen prop tables | `custom-elements.json` (attributes, properties, events, slots, parts) |
| Tests | none | Vitest browser mode + Node SSR smoke per element |

## 3. Package layout

### During the migration (5.x, additive)

Existing exports do not change. Each migrated element adds two subpaths.

```jsonc
{
  "sideEffects": ["**/*.css", "./dist/wc/*.js", "./dist/hmi-elements.iife.js", "./dist/hmi-components.iife.js"],
  "customElements": "custom-elements.json",
  "files": ["dist", "custom-elements.json"],
  "exports": {
    ".":                 { "types": "./dist/index.d.ts", "import": "./dist/index.js" },           // React, unchanged
    "./<kebab>":         { "types": "./dist/components/<camel>.d.ts", "import": "./dist/<camel>.js" }, // React, unchanged
    "./theme":           { "types": "./dist/theme.d.ts", "import": "./dist/theme.js" },           // unchanged
    "./wc":              { "types": "./dist/elements/index.d.ts", "import": "./dist/wc/index.js" },   // registers all migrated elements
    "./wc/<kebab>":      { "types": "./dist/elements/<kebab>/<kebab>.d.ts", "import": "./dist/wc/<kebab>.js" },
    "./react":           { "types": "./dist/react/index.d.ts", "import": "./dist/react/index.js" },
    "./react/<kebab>":   { "types": "./dist/elements/<kebab>/<kebab>.react.d.ts", "import": "./dist/react/<kebab>.js" },
    "./elements":        { "default": "./dist/hmi-elements.iife.js" },                             // Lit drop-in bundle
    "./base.css":        "./dist/base.css",
    "./themes/*":        "./dist/themes/*",                                                        // unchanged
    "./style.css":       "./dist/style.css",                                                       // React CSS, until v6
    "./web-components":  { "import": "./dist/hmi-components.iife.js" },                            // r2wc bundle, until v6
    "./web-components.css": "./dist/hmi-components.css"                                            // until v6
  },
  "dependencies": { "lit": "^3.3.3" },
  "peerDependencies": { "react": "^19.0.0", "react-dom": "^19.0.0" },
  "peerDependenciesMeta": { "react": { "optional": true }, "react-dom": { "optional": true } }
}
```

Declaration files keep the source layout (`dist/elements/<kebab>/…d.ts`,
emitted by `vite-plugin-dts` with `entryRoot: src`); only the JavaScript is
renamed by the vite entries, exactly like the React exports pair
`dist/components/badge.d.ts` with `dist/badge.js`.

`sideEffects` must list `./dist/wc/*.js`: element modules register themselves
in `@customElement`, and a bundler would otherwise tree-shake
`import '@ninoverse/hmi-components/wc/badge'`.

Never load `hmi-elements.iife.js` and `hmi-components.iife.js` on the same
page. Both define the same tags; the second `customElements.define` throws.

### After the v6 flip

`dist/wc/` and `dist/react/` do not move; only the `exports` keys change.

```jsonc
{
  "exports": {
    ".":               { "types": "./dist/wc/index.d.ts", "import": "./dist/wc/index.js" },
    "./<kebab>":       { "types": "./dist/elements/<kebab>/<kebab>.d.ts", "import": "./dist/wc/<kebab>.js" },
    "./wc":            "./dist/wc/index.js",          // deprecated alias, one major
    "./wc/<kebab>":    "./dist/wc/<kebab>.js",        // deprecated alias, one major
    "./react":         { "types": "./dist/react/index.d.ts", "import": "./dist/react/index.js" },
    "./react/<kebab>": { "types": "./dist/elements/<kebab>/<kebab>.react.d.ts", "import": "./dist/react/<kebab>.js" },
    "./theme":         { "types": "./dist/wc/theme.d.ts", "import": "./dist/wc/theme.js" },
    "./web-components": { "default": "./dist/hmi-components.iife.js" },   // now the Lit bundle
    "./base.css":      "./dist/base.css",
    "./style.css":     "./dist/base.css",             // transition alias, removed at v7
    "./web-components.css": "./dist/base.css",        // transition alias, removed at v7
    "./themes/*":      "./dist/themes/*"
  }
}
```

## 4. Source layout

```
src/
├── elements/                 # Lit elements (kebab-case everywhere)
│   ├── <kebab>/
│   │   ├── <kebab>.ts            # class Hmi<Pascal>, @customElement('hmi-<kebab>')
│   │   ├── <kebab>.styles.ts     # export const styles = css`…`
│   │   ├── <kebab>.react.ts      # createComponent wrapper
│   │   ├── <kebab>.stories.ts    # Storybook (web-components-vite)
│   │   ├── <kebab>.test.ts       # Vitest browser mode
│   │   └── <kebab>.ssr.test.ts   # Vitest node, @lit-labs/ssr
│   ├── shared/
│   │   ├── base.styles.ts        # :host box-sizing, --_base, hidden, focus ring
│   │   ├── events.ts             # emit()
│   │   ├── dom.ts                # activeElementDeep(), supportsPopover()
│   │   ├── form.ts               # FormKind, coerceFormValue()        (phase 4)
│   │   ├── format.ts             # applyTemplate()                    (phase 4)
│   │   ├── panel.ts              # renderLiquidFilter()               (phase 2)
│   │   ├── chart.ts              # scales, renderCartesianGrid()      (phase 8)
│   │   ├── positioning.ts        # PositionController                 (phase 9)
│   │   ├── toast.ts              # toast store                        (phase 11)
│   │   └── theme.ts              # setTheme/getTheme/subscribe        (phase 11)
│   └── index.ts                  # registers every migrated element
├── react/
│   ├── index.ts                  # re-exports every wrapper + useTheme
│   └── use-theme.ts                                                   (phase 11)
├── components/               # legacy React (frozen; deleted at v6)
├── configs/, lib/            # unchanged
└── web-components.ts         # legacy r2wc bundle entry (deleted at v6)
```

Naming: folder, files, tag suffix, subpath and dist file share one kebab-case
name (`area-chart`); the class is `HmiAreaChart`; the React wrapper keeps the
v5 PascalCase export (`AreaChart`).

## 5. Global CSS

- **`dist/themes/*`** — token-only since 5.7. Every length token is
  `calc(var(--hmi-base, 8px) * N)`; the material files set the `--panel-*`
  tokens and no longer style component classes (the v5 React components render
  solid under `glass`/`liquid` until migrated).
- **`dist/base.css`** (`public/css/base.css`) — the only stylesheet a host page
  must load besides themes:
  - `:root { --hmi-base: 8px; }` (`color-scheme` stays in `constants.css`)
  - `body` defaults (background, colour, `font-family: var(--font-default)`, `font-size: calc(var(--hmi-base) * 2)`, line height) and `::selection`
  - the `[data-material='glass'] body` / `[data-material='liquid'] body` gradients
  - pre-upgrade rules `hmi-badge:not(:defined), … { visibility: hidden }` generated from `custom-elements.json` by `scripts/gen-base-css.mjs` (`pnpm cem`)
- **Fonts** stay `<link>` tags in the document (`@font-face` cannot load from
  inside a shadow root). Include `Caveat` (used by the `journal` structure).
- `dist/style.css` and `dist/hmi-components.css` remain until v6 for the
  React tree, then become aliases of `base.css` for one major.

## 6. Phases

| Phase | Scope | Starts when |
|-------|-------|-------------|
| 0 | PR 1 (docs, #113); PR 2 tooling scaffold (see §10) | — |
| 1 | `badge` — the pilot that freezes the templates and the definition of done | PR 2 merged |
| 2 | presentational leaves: alert, avatar, avatar-stack, banner, blockquote, card, chip, code, empty-state, kbd, meter, progress, skeleton, spinner, stat | phase 1 merged |
| 3 | layout + typography: aspect-ratio, box, divider, flex, grid, heading, link, scroll-area, spacer, text, visually-hidden | phase 2 merged |
| 4 | button + text inputs (introduces `shared/form.ts`): button, form-control, input, textarea, number-input, password-input, search-input, multi-input, file-upload | phase 3 merged |
| 5 | selection controls: checkbox, radio, radio-group, switch, slider, segmented-control, value-scale-selector | phase 4 merged |
| 6 | data display: accordion, carousel, image, list, table, timeline | phase 5 merged |
| 7 | navigation: breadcrumbs, navbar, pagination, sidebar, stepper, tabs, tree | phase 6 merged |
| 8 | charts: cartesian-grid, chart-tooltip, legend, responsive-container first; then the ten chart elements | phase 7 merged |
| 9 | overlay infrastructure (`shared/positioning.ts`) + modal, confirm-dialog, drawer, popover, tooltip, hover-card, context-menu, menu | phase 8 merged |
| 10 | select, combobox, date-picker, color-picker, command-palette | phase 9 merged |
| 11 | toast, theme module + `useTheme`, the v6 flip | phase 10 merged |

Rules: one element per commit; batches of up to five leaves per PR in phases
2, 3 and 8; every branch is cut from `main` after the previous PR merged
(never stacked); no new React components during the migration.

## 7. Running one migration end to end

The `migrate-component` skill (`.claude/skills/migrate-component/SKILL.md`)
automates this. By hand:

1. Read `.claude/lit-migration.md`. Check `tracker.md`: the element's phase gate must be met.
2. `git fetch origin main && git checkout -b migrate/<kebab> origin/main`.
3. Read `src/components/<camel>.tsx`, `src/components/styled/<camel>.styled.css`, `src/components/<camel>.stories.tsx`, the `define('<kebab>', …)` block in `src/web-components.ts`, and `docs/api/components/<camel>.md`.
4. Write the **API mapping sheet** (React prop → property/attribute, slot, event + detail, part) and the hazard list (portals, document listeners, `activeElement`, `useId`, `className` passthrough, `as`, cross-boundary CSS, `rem` count). Get it approved.
5. Scaffold the six files from the templates in `translation-guide.md` §18.
6. Wire: `src/elements/index.ts`, `src/react/index.ts`, `vite.config.ts` entries `wc/<kebab>` and `react/<kebab>`, `package.json` exports, a section in `examples/elements.html`, the story.
7. Verify:
   ```bash
   pnpm format && pnpm lint
   pnpm build
   ls dist/wc/<kebab>.js dist/react/<kebab>.js dist/elements/<kebab>/<kebab>.d.ts dist/elements/<kebab>/<kebab>.react.d.ts
   pnpm test -- src/elements/<kebab>
   pnpm test:ssr -- src/elements/<kebab>
   pnpm cem && git diff --stat custom-elements.json
   pnpm build:storybook
   ```
   Then produce the side-by-side screenshot (React section of `src/App.tsx` vs the Lit story in Storybook) and get it approved.
8. Commit `feat(ui): migrate <Name> to lit`, push, open a draft PR with the mapping sheet, screenshots and the R12 checklist. In the same PR, set the tracker row to *Done* and link the PR in its **PR** column: the row reaches `main` only when the PR merges.

## 8. Host verification matrix

An element is done only when it has been exercised in each host below.

| Host | How to load | What to check |
|------|-------------|---------------|
| Plain HTML | `<script src="…/dist/hmi-elements.iife.js">` + `base.css` + `themes/*` (`examples/elements.html`; `examples/web-components.html` is the r2wc page — never both bundles on one page) | attributes, slots, `addEventListener('hmi-change', e => e.detail)`, theme switching by attribute |
| React 19 | `import { Badge } from '@ninoverse/hmi-components/react/badge'` | props set as properties, `onChange` receives `CustomEvent` (`e.detail.value`), children and `slot="…"` project, SSR via `@lit-labs/ssr-react` / `@lit-labs/nextjs` |
| Dioxus web / desktop | IIFE in the HTML shell; `rsx! { hmi-badge { "variant": "success", "Live" } }` | attributes from strings, boolean presence (omit the attribute or set the property in `onmounted`), slotted children, events via `web_sys::EventTarget::add_event_listener_with_callback` |
| Angular | `CUSTOM_ELEMENTS_SCHEMA`; `<hmi-tabs [options]="tabs" (hmi-change)="onTab($event.detail.value)">` | property binding of arrays, event typing from `custom-elements.json`, Angular SSR renders the tag and the element upgrades on the client |
| Vue | `compilerOptions.isCustomElement = tag => tag.startsWith('hmi-')`; `<hmi-tabs :options="tabs" @hmi-change="onTab">` | Vue sets properties when they exist on the element; kebab event names bind directly |

## 9. Server-side rendering

Supported paths:

| Host | Mechanism | Output |
|------|-----------|--------|
| Next.js | `@lit-labs/ssr-react` (or the `@lit-labs/nextjs` plugin) renders elements to Declarative Shadow DOM inside the React tree | full markup, no flash |
| Angular SSR | Angular emits the `<hmi-*>` tags with attributes; the element upgrades on the client | light-DOM markup + `:not(:defined)` styling until upgrade |
| Dioxus fullstack | same as Angular | same |

Element rules that make this possible (R3): no `window`/`document` at import
or constructor time (`isServer` guard), deterministic `render()` from
properties, no light-DOM mutation, reflected attributes for CSS state, and a
`<kebab>.ssr.test.ts` per element proving `@lit-labs/ssr` can render it.

## 10. Tooling (PR 2, landed in 5.7)

PR 2 was the only infrastructure PR; it added no elements. What it settled:

- `lit`, `@lit/react` (dependencies); `@lit-labs/ssr`, `@custom-elements-manifest/analyzer`, `vitest` 5 + `@vitest/browser-playwright`, `playwright` (pinned; CI installs its Chromium with `playwright install --with-deps chromium`), `@storybook/web-components-vite` (dev). `react`/`react-dom` are optional peers.
- `src/elements/shared/{base.styles,events,dom}.ts` with browser smoke tests, `src/elements/index.ts`, `src/react/index.ts` (empty barrels), `src/elements/shared/ssr.ssr.test.ts` proving a form-associated element with `attachInternals()` in a field initializer renders under the SSR DOM shim (no guard needed).
- `public/css/base.css` and `scripts/gen-base-css.mjs` (run by `pnpm cem`) that rewrites the `:not(:defined)` block from `custom-elements.json`; CI fails when either file is stale.
- Theme token rebase: every `rem` in `constants.css`, `structure/*.css` and `material/*.css` is `calc(var(--hmi-base, 8px) * N)`; `--panel-*` and the journal hooks are defined in `constants.css` and overridden in `material/glass.css`, `material/liquid.css`, `structure/journal.css`; the material files no longer contain class or `body` selectors (backdrops moved to `base.css`).
- `vite.config.ts` entries `wc/index` and `react/index` (element PRs add `wc/<kebab>`, `react/<kebab>`), `lit`/`@lit/*` external in the ESM build; declarations are **not** remapped — `exports.types` points at `dist/elements/…` (§3); `vite.elements.config.ts` builds `dist/hmi-elements.iife.js` with Lit bundled; `scripts/copy-css-plugin.ts` replaces the duplicated theme-copy plugin.
- `custom-elements-manifest.config.mjs` (`litelement: true`, `packagejson: false`); `custom-elements.json` committed and excluded from Biome.
- `vitest.config.ts`: `browser` project (Chromium, headless) for `*.test.ts`, `ssr` project (Node) for `*.ssr.test.ts`, `passWithNoTests`.
- Storybook swapped to `@storybook/web-components-vite` with `setCustomElementsManifest` in `preview.ts`. The React `*.stories.tsx` are no longer built (one framework per config); they stay in the frozen tree, type-checked, and the React demo page remains at `/demo/`. `@storybook/react-vite` is kept only for their types until the flip.
- `.github/workflows/ci-gate.yml`: `lint`, `build`, Playwright Chromium install, `test`, `test:ssr`, manifest/base.css drift check.
- `tsconfig.node.json` covers every config file and `scripts/*.ts`; Biome formats `accessor` decorators without configuration.
- Found by the Badge pilot: Rollup cannot parse the `accessor` keyword, so every vite config that bundles elements sets `esbuild: { target: 'es2022' }` to have esbuild lower the standard decorators first; the Vitest browser project pre-bundles `lit`, `@lit/react`, `react` and `react-dom/client` (`optimizeDeps.include`) so Vite does not reload tests mid-run. The `sideEffects` check passed: an esbuild consumer bundle that only side-effect imports `wc/badge` keeps the `customElements.define` call.
- Still open: top-layer stacking of toasts under modals (phase 11); typedoc still documents the React API only.

## 11. Theme rules during the migration

- Theme files define **only** custom properties. Never a component class, never an element selector.
- Panel look: `--panel-bg`, `--panel-bg-strong`, `--panel-border`, `--panel-filter` (a `backdrop-filter` value), `--panel-ink-bg`, `--panel-accent-bg` (defaults in `constants.css`; `glass` and `liquid` override them; shadows stay on `--elevation-*`). Panel-like elements expose `part="panel"` for anything a theme cannot express as a token.
- Journal-specific looks that v5 keeps in component CSS are tokens: `--list-divider-style`, `--progress-track-border`, `--stat-rule`, `--switch-thumb-shadow` (defaults in `constants.css`, overrides in `structure/journal.css`).
- `--hmi-base` (default `8px`) is the sizing base. Elements never use `rem`. A host may scale the whole library with `hmi-*, :root { --hmi-base: 10px }`.
- The liquid refraction filter is embedded by each panel-like element (`renderLiquidFilter()`), so `url('#liquid-glass')` resolves inside the root.
- Light/dark keeps following `prefers-color-scheme` inside each colour theme file.

## 12. FAQ

- **Why not `:host-context([data-structure='journal'])`?** Not supported in Firefox and Safari. Tokens work everywhere.
- **Why is `hmi-change` detail an object, not the bare value?** Fields can be added later (`{ value, previous }`) without breaking listeners, and `e.detail.value` reads the same in every host.
- **Why do booleans ignore `"false"`?** That is HTML. `<hmi-button disabled="false">` is disabled, exactly like `<button disabled="false">`. String hosts set the property instead.
- **Why one package instead of a separate React package?** The wrappers are a few lines each and share the element types; a second package would double the release pipeline for no consumer benefit. React is an optional peer.
- **Why `hmi-input` and `hmi-change` on text inputs?** Native semantics that Angular, Vue and plain HTML consumers expect; v5's per-keystroke `onChange` was a React-ism.
- **What happens to `ThemeProvider`?** Replaced by `setTheme`/`getTheme`/`subscribe` in `./theme` and a `useTheme` hook in `./react`; same attributes and `localStorage` keys, no provider wrapper.
