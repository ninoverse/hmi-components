# @ninoverse/hmi-components

A React component library providing Human-Machine Interface (HMI) UI components — built on Material Design 3 color tokens with a warm, asymmetric styling system.

[![npm version](https://img.shields.io/npm/v/@ninoverse/hmi-components.svg)](https://www.npmjs.com/package/@ninoverse/hmi-components)
[![license](https://img.shields.io/npm/l/@ninoverse/hmi-components.svg)](./LICENSE)
[![react](https://img.shields.io/badge/react-%5E19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![node](https://img.shields.io/badge/node-%E2%89%A520-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

> ## Migration to Lit (v6)
>
> The library is moving from React components to native Web Components built on
> [Lit](https://lit.dev), one element per pull request. During 5.x both live side
> by side: the React API at the root is **unchanged**, migrated Lit elements ship
> under `@ninoverse/hmi-components/wc/<name>` and their React wrappers under
> `@ninoverse/hmi-components/react/<name>`. At v6 the root becomes the Lit
> elements and the React tree is removed.
>
> **What changes for React consumers at v6**
>
> - Import from `@ninoverse/hmi-components/react` (or `/react/<name>`).
> - Callbacks receive a `CustomEvent`: `onChange={(e) => e.detail.value}`.
>   Text inputs split into `onInput` (per keystroke) and `onChange` (commit).
> - Rich-content props become slotted children: `<Icon slot="left-icon" />`
>   instead of `leftIcon={<Icon />}`.
> - `className` and `style` still work (they land on the host element).
> - Load `base.css` plus one theme per axis instead of `style.css`.
> - `ThemeProvider` is replaced by `setTheme` / `useTheme`.
>
> **Since 5.7 (tooling):** the Storybook site documents the Lit elements; the full
> React demo stays at `/demo/`. Theme tokens are expressed against `--hmi-base`
> (identical values for the React tree), and the `glass` / `liquid` materials are
> token-only, so they no longer restyle the React components until those are
> migrated. Runnable Lit host page: [`examples/elements.html`](./examples/elements.html).
>
> Progress: [`docs/migration/tracker.md`](./docs/migration/tracker.md) ·
> Playbook: [`docs/migration/README.md`](./docs/migration/README.md) ·
> Decisions: [`docs/migration/adr-0001-lit-web-components.md`](./docs/migration/adr-0001-lit-web-components.md)

## Installation

```bash
pnpm add @ninoverse/hmi-components
# or
npm install @ninoverse/hmi-components
# or
yarn add @ninoverse/hmi-components
```

Requires **React ^19** and **react-dom ^19** as peer dependencies.

> Working **inside this repo**? Use `pnpm` — `npm` and `yarn` are not supported for development.

## Usage

Import any component from the root entry, and import the bundled stylesheet once at your app's entry point:

```tsx
import { Button } from '@ninoverse/hmi-components';
import '@ninoverse/hmi-components/style.css';

export function App() {
    return <Button variant="primary">Launch</Button>;
}
```

Every component is also exposed as its own subpath for finer-grained imports:

```tsx
import { Button } from '@ninoverse/hmi-components/button';
import { LineChart } from '@ninoverse/hmi-components/line-chart';
```

## Use as Web Components

Every component is also published as a native custom element, so the library works in **plain HTML, Vue, Angular, Svelte** — anywhere that renders HTML. Drop in a single self-contained `<script>` (React is bundled in) and the `<hmi-*>` elements register themselves on load. No build step required.

> This is the v5 bundle built with `react-to-web-component`. Elements that have already been migrated to Lit ship separately as `dist/hmi-elements.iife.js` (`@ninoverse/hmi-components/elements`), without React. Never load both bundles on the same page: they define the same tags. See the [migration playbook](./docs/migration/README.md#3-package-layout).

```html
<!doctype html>
<html data-theme="default" data-structure="default">
    <head>
        <!-- Google Fonts the components use -->
        <link
            href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&family=Oxanium:wght@200..800&family=Rubik+Glitch&family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&family=Caveat:wght@400..700&display=swap"
            rel="stylesheet"
        />
        <!-- Theme tokens: constants first, then one color + one structure theme -->
        <link rel="stylesheet" href="hmi-components/dist/themes/constants.css" />
        <link rel="stylesheet" href="hmi-components/dist/themes/color/default.css" />
        <link rel="stylesheet" href="hmi-components/dist/themes/structure/default.css" />
        <!-- Component styles (includes the html { font-size: 8px } base) -->
        <link rel="stylesheet" href="hmi-components/dist/hmi-components.css" />
    </head>
    <body>
        <hmi-button variant="primary">Save</hmi-button>

        <!-- Drop-in bundle: auto-registers every <hmi-*> element -->
        <script src="hmi-components/dist/hmi-components.iife.js"></script>
    </body>
</html>
```

When installed from npm, the bundle and its stylesheet are exposed as subpaths:

```js
import '@ninoverse/hmi-components/web-components'; // registers all <hmi-*> elements
import '@ninoverse/hmi-components/web-components.css';
```

**Theming is pure CSS** — set `data-theme` and `data-structure` on `<html>` (or any ancestor) and the elements restyle live. There is **no** `ThemeProvider` outside React; the tokens come entirely from the theme stylesheets.

### Attributes vs. JS properties

Custom elements reflect kebab-case attributes onto camelCase props, with coercion for booleans/numbers/JSON:

```html
<hmi-button variant="primary" size="large" disabled>Save</hmi-button>
<hmi-badge variant="success" dot></hmi-badge>
```

Props that are **rich content** (anything typed as a React node — e.g. a Modal's `title`/`actions`, a Table's `columns`) or **callbacks** (`onClose`, `onChange`) can't be expressed as HTML attributes. Set them as JS **properties** on the element instead:

```html
<hmi-modal id="m"></hmi-modal>
<script>
    const modal = document.getElementById('m');
    modal.title = 'Hello';
    modal.actions = '<button class="button button--primary">OK</button>';
    modal.onClose = () => { modal.open = false; };
    modal.open = true;
</script>
```

Simple presentational components (Button, Badge, Alert, Card, inputs, etc.) work fully from markup; data-heavy ones need a line of JS. See [`examples/web-components.html`](./examples/web-components.html) for a runnable demo.

### Using with Dioxus (Rust)

The custom elements work in any Dioxus renderer backed by a real browser DOM — **`dioxus-web`** (WASM), **`dioxus-desktop`/mobile** (webview), and **fullstack/liveview/SSR**. They do **not** work in the native/TUI/Blitz renderers, which have no DOM or JS engine.

Load the bundle and theme stylesheets once in your HTML shell (e.g. the `index.html` template or the `Dioxus.toml` resources), and set the theme attributes on `<html>` exactly as above. Dioxus renders any tag containing a dash as an untyped web component, and non-HTML attributes are written quoted — so the simple, attribute-driven components work straight from `rsx!`:

```rust
rsx! {
    hmi-button { "variant": "primary", "Save" }
    hmi-badge  { "variant": "success", "Live" }
    // boolean / number / json props also parse from string attributes:
    hmi-modal  { "open": "true" }
}
```

Callbacks (`onClose`, `onChange`) and rich React-node props (a Modal's `title`/`actions`, a Table's `columns`) can't be HTML attributes — same as the section above. In Dioxus you set them as JS **properties** via `onmounted`, downcasting the mounted handle to a `web_sys::Element`:

```rust
rsx! {
    hmi-modal {
        onmounted: move |evt| {
            let el = evt.downcast::<web_sys::Element>().unwrap();
            // js_sys::Reflect::set(&el, &"onClose".into(), &closure);
            // js_sys::Reflect::set(&el, &"title".into(), &"Hello".into());
            let _ = el.set_attribute("open", "true"); // boolean props can use attributes
        }
    }
}
```

> Text children like `hmi-button { "Save" }` are captured from the rendered markup, but because Dioxus builds the DOM programmatically the timing can vary by renderer — if a label ever renders empty, pass the content via a property instead. Don't confuse this with the [`dioxus-web-component`](https://crates.io/crates/dioxus-web-component) crate, which does the *inverse* (exposes a Dioxus component as a web component).

## Components

| Category | Components |
|----------|------------|
| **Layout & structure** | `Box`, `Flex`, `Grid`, `Spacer`, `AspectRatio`, `ScrollArea`, `Divider`, `VisuallyHidden` |
| **Typography** | `Heading`, `Text`, `Blockquote`, `Code`, `Kbd`, `Link`, `List` |
| **Forms & inputs** | `Input`, `Textarea`, `NumberInput`, `PasswordInput`, `SearchInput`, `MultiInput`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Select`, `Combobox`, `Slider`, `ColorPicker`, `DatePicker`, `FileUpload`, `FormControl`, `SegmentedControl`, `ValueScaleSelector` |
| **Actions** | `Button`, `Chip` |
| **Data display** | `Avatar`, `AvatarStack`, `Badge`, `Card`, `Image`, `Stat`, `Table`, `Tree`, `Timeline` |
| **Feedback & status** | `Alert`, `Banner`, `Toast`, `Progress`, `Spinner`, `Skeleton`, `EmptyState`, `Meter`, `Gauge` |
| **Overlays** | `Modal`, `ConfirmDialog`, `Popover`, `Tooltip`, `HoverCard`, `Drawer`, `ContextMenu`, `Menu`, `CommandPalette` |
| **Navigation** | `Breadcrumbs`, `Pagination`, `Tabs`, `Stepper`, `Navbar`, `Sidebar` |
| **Charts & visualization** | `AreaChart`, `BarChart`, `BulletChart`, `CartesianGrid`, `ChartTooltip`, `DonutChart`, `FunnelChart`, `Heatmap`, `Legend`, `LineChart`, `RadarChart`, `ResponsiveContainer`, `ScatterPlot`, `Sparkline` |
| **Media & disclosure** | `Carousel`, `Accordion` |

## Documentation

- **[Theming guide](./docs/theming.md)** — the three theme axes, `ThemeProvider` / `useTheme`, the full design-token reference, and how to author custom themes.
- **[Component API reference](./docs/api/)** — generated per-component prop tables and examples (run `pnpm docs` to regenerate from source).
- **[Lit migration](./docs/migration/README.md)** — playbook, [translation guide](./docs/migration/translation-guide.md), [decision record](./docs/migration/adr-0001-lit-web-components.md) and [tracker](./docs/migration/tracker.md).

Every component and prop also ships JSDoc, so your editor shows the same descriptions on hover and autocomplete.

## Design system

Color tokens follow Material Design 3 naming (`--primary`, `--surface-variant`, `--on-surface`, etc.) and are defined as CSS custom properties in `public/css/themes/`. Import `src/configs/colors.ts` to reference them from TypeScript. See the **[theming guide](./docs/theming.md)** for the complete token reference and runtime theme switching.

**Typography and scale.** The v5 React components size in `rem` against `html { font-size: 8px }` (set by `globals.css`); the Lit elements size from the `--hmi-base` token (8px by default) instead, so they need no root font-size. Available font families:

- `--font-quicksand`
- `--font-oxanium`
- `--font-rubik-glitch`
- `--font-press-start-2p`
- `--font-pixelify-sans`
- `--font-caveat`

## Development

```bash
pnpm install   # install dependencies
pnpm dev       # start Vite dev server
pnpm build     # production build (outputs to /dist)
pnpm preview   # serve production build locally
pnpm lint      # Biome check (lint + format)
pnpm format    # Biome format with auto-write
pnpm docs      # generate the component API reference (docs/api)
```

## Project structure

```
src/
├── elements/           # Lit elements, one folder per element (migration target)
│   ├── <kebab>/        # <kebab>.ts, .styles.ts, .react.ts, .stories.ts, .test.ts, .ssr.test.ts
│   └── shared/         # base styles, events, form, positioning, theme helpers
├── react/              # React wrappers barrel + useTheme
├── components/         # Legacy React components (.tsx) — frozen, removed at v6
│   └── styled/         # Legacy component CSS (`*.styled.css`)
├── configs/            # Color/font tokens and theme config
├── lib/                # Legacy shared utilities
└── theme.tsx           # Legacy ThemeProvider / useTheme

docs/                   # Theming guide, migration docs, generated API reference
public/
└── css/themes/         # Material Design 3 theme CSS variables (tokens only)
```

## File naming

| Type | Convention | Example |
|------|-----------|---------|
| Lit element folder and files | kebab-case | `src/elements/area-chart/area-chart.ts` |
| Element class / tag | `Hmi<Pascal>` / `hmi-<kebab>` | `HmiAreaChart` / `hmi-area-chart` |
| Legacy React component | `camelCase.tsx` | `areaChart.tsx` |
| Legacy component CSS | `[name].styled.css` | `button.styled.css` |
| Config | `camelCase.ts` | `colors.ts` |
| Utility | `[name].utility.ts` | `formatTemplate.utility.ts` |

Details: [`.agents/typescript-file-naming.md`](./.agents/typescript-file-naming.md)
and [`.agents/lit-file-naming.md`](./.agents/lit-file-naming.md).

## Contributing

- Follow [Conventional Commits](https://www.conventionalcommits.org/): `feat(ui): migrate badge to lit`
- Run `pnpm lint` before opening a PR
- The rules live in [`AGENTS.md`](./AGENTS.md), which links each of them in
  `.agents/`. Most are composed by
  [agentcfg](https://github.com/ninoverse/agent-config-sync) from
  [`.agentprofile.yml`](./.agentprofile.yml); hmi's own are the section at the
  top of `AGENTS.md`, the element rules in
  [`.claude/lit-migration.md`](./.claude/lit-migration.md), and the element
  steps in [`.agents/new-element.local.md`](./.agents/new-element.local.md).

## License

[MIT](./LICENSE)
