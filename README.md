# @ninoverse/hmi-components

A React component library providing Human-Machine Interface (HMI) UI components — built on Material Design 3 color tokens with a warm, asymmetric styling system.

[![npm version](https://img.shields.io/npm/v/@ninoverse/hmi-components.svg)](https://www.npmjs.com/package/@ninoverse/hmi-components)
[![license](https://img.shields.io/npm/l/@ninoverse/hmi-components.svg)](./LICENSE)
[![react](https://img.shields.io/badge/react-%5E19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![node](https://img.shields.io/badge/node-%E2%89%A520-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

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

```html
<!doctype html>
<html data-theme="default" data-structure="default">
    <head>
        <!-- Google Fonts the components use -->
        <link
            href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&family=Oxanium:wght@200..800&family=Rubik+Glitch&family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&display=swap"
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

- **[Theming guide](./docs/theming.md)** — the two theme axes, `ThemeProvider` / `useTheme`, the full design-token reference, and how to author custom themes.
- **[Component API reference](./docs/api/)** — generated per-component prop tables and examples (run `pnpm docs` to regenerate from source).

Every component and prop also ships JSDoc, so your editor shows the same descriptions on hover and autocomplete.

## Design system

Color tokens follow Material Design 3 naming (`--primary`, `--surface-variant`, `--on-surface`, etc.) and are defined as CSS custom properties in `public/css/themes/`. Import `src/configs/colors.ts` to reference them from TypeScript. See the **[theming guide](./docs/theming.md)** for the complete token reference and runtime theme switching.

**Typography.** Base font size is `8px` (defined in `globals.css`); all `rem` units scale from this base. Available font families:

- `--font-quicksand`
- `--font-oxanium`
- `--rubik-glitch`
- `--font-press-start-2p`
- `--font-pixelify-sans`

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
├── components/         # React components (.tsx)
│   └── styled/         # Component-scoped CSS (`*.styled.css`)
├── configs/            # Color/font tokens and theme config
├── lib/                # Shared utilities
└── theme.tsx           # ThemeProvider / useTheme

docs/                   # Theming guide and generated API reference
public/
└── css/themes/         # Material Design 3 theme CSS variables
```

## File naming

| Type | Convention | Example |
|------|-----------|---------|
| Component | `camelCase.tsx` | `unorderedList.tsx` |
| Component CSS | `[name].styled.css` | `button.styled.css` |
| Config | `camelCase.ts` | `colorsConfig.ts` |
| Model | `[name].model.ts` | `button.model.ts` |
| Utility | `[name].utility.ts` | `button.utility.ts` |

## Contributing

- Follow [Conventional Commits](https://www.conventionalcommits.org/): `feat(ui): add button component`
- Run `pnpm lint` before opening a PR
- Detailed rules live in `.claude/`:
  - [`commit-conventions.md`](./.claude/commit-conventions.md)
  - [`branch-naming.md`](./.claude/branch-naming.md)
  - [`component-workflow.md`](./.claude/component-workflow.md)
  - [`pr-guidelines.md`](./.claude/pr-guidelines.md)
  - [`code-review.md`](./.claude/code-review.md)
  - [`file-naming.md`](./.claude/file-naming.md)
  - [`testing-requirements.md`](./.claude/testing-requirements.md)

## License

[MIT](./LICENSE)
