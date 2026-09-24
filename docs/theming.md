# Theming

Every component in `@ninoverse/hmi-components` is styled entirely with CSS custom
properties (design tokens). Theming means swapping the values behind those tokens —
no per-component configuration, and the same mechanism works in React, in the Lit
elements and in plain HTML.

## The three theme axes

Themes are split into three independent axes, each driven by a `data-*` attribute on
an ancestor element (usually `<html>`):

| Axis | Attribute | What it controls | Values |
|------|-----------|------------------|--------|
| **Color** | `html[data-theme]` | Palette / color roles. Light & dark resolve automatically via `prefers-color-scheme`. | `default`, `ocean`, `forest` |
| **Structure** | `html[data-structure]` | Shape (corner radii), density (spacing), motion (easing/duration) and typography. | `default`, `rounded`, `sharp`, `pixel`, `journal` |
| **Material** | `html[data-material]` | Surface treatment of panels: flat, frosted glass, or liquid refraction. | `solid`, `glass`, `liquid` |

The axes combine freely (3 × 5 × 3 = 45 looks). The canonical value lists are exported
from the package so you don't have to hardcode them:

```ts
import { colorThemes, materials, structures } from '@ninoverse/hmi-components';
// colorThemes → ['default', 'ocean', 'forest']
// structures  → ['default', 'rounded', 'sharp', 'pixel', 'journal']
// materials   → ['solid', 'glass', 'liquid']
```

Persistence keys in `localStorage`: `hmi-theme`, `hmi-structure`, `hmi-material`.

## React: `ThemeProvider` + `useTheme` (v5)

For React apps, `ThemeProvider` manages the three axes at runtime. It persists each
choice to `localStorage` and reflects it onto `html[data-theme]` /
`html[data-structure]` / `html[data-material]`, so a change re-themes the whole tree
instantly.

```tsx
import { ThemeProvider } from '@ninoverse/hmi-components';
import '@ninoverse/hmi-components/style.css';

export function App() {
    return (
        <ThemeProvider defaultTheme="ocean" defaultStructure="rounded">
            <Dashboard />
        </ThemeProvider>
    );
}
```

`useTheme()` reads the active axes and their setters from anywhere inside the
provider — ideal for a theme switcher:

```tsx
import { useTheme } from '@ninoverse/hmi-components';

function ThemeSwitcher() {
    const { theme, setTheme, structure, setStructure, colorThemes, structures } =
        useTheme();

    return (
        <>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                {colorThemes.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select value={structure} onChange={(e) => setStructure(e.target.value)}>
                {structures.map((s) => <option key={s}>{s}</option>)}
            </select>
        </>
    );
}
```

`useTheme()` throws if used outside a `ThemeProvider`.

> **v6:** `ThemeProvider` is replaced by a framework-agnostic module —
> `setTheme()`, `getTheme()`, `subscribe()` from `@ninoverse/hmi-components/theme` —
> and a thin `useTheme()` hook from `@ninoverse/hmi-components/react` built on it. Same
> attributes, same `localStorage` keys, no provider wrapper. See
> [`docs/migration/README.md`](./migration/README.md).

> **Avoiding a flash of the default theme.** `ThemeProvider` sets the `data-*`
> attributes after mount. To prevent a flash before hydration, also set
> `data-theme` / `data-structure` / `data-material` on `<html>` in your HTML shell —
> or run a tiny inline script in `<head>` that reads the same `localStorage` keys and
> applies them before first paint (see `index.html` in this repository).

## Non-React / Web Components: pure CSS

There is **no** `ThemeProvider` outside React — the tokens come entirely from the
theme stylesheets. Set the attributes on `<html>` (or any ancestor) and load the
token CSS in order: constants first, then **one** color theme, **one** structure
theme and optionally **one** material.

```html
<html data-theme="forest" data-structure="sharp" data-material="glass">
    <head>
        <link rel="stylesheet" href="…/dist/themes/constants.css" />
        <link rel="stylesheet" href="…/dist/themes/color/forest.css" />
        <link rel="stylesheet" href="…/dist/themes/structure/sharp.css" />
        <link rel="stylesheet" href="…/dist/themes/material/glass.css" />
        <link rel="stylesheet" href="…/dist/hmi-components.css" />  <!-- v5 bundle; base.css for the Lit elements -->
    </head>
</html>
```

Switching themes is just changing the attribute value (and swapping the stylesheet
if you only ship a subset). When installed from npm, the theme files are exposed
under the `./themes/*` subpath. See the
[Web Components section of the README](../README.md#use-as-web-components) for the
full setup, including the Google Fonts link.

## Theme rules during the Lit migration

The Lit elements render inside a Shadow DOM. Custom properties inherit through
shadow boundaries, so every token below keeps working unchanged. Global selectors
do **not** cross the boundary, which changes how themes may be written:

- **Theme files define only custom properties.** A theme never selects a
  component class, an element or `body`. The material files (`glass.css`,
  `liquid.css`) are token-only since 5.7: they set the panel tokens below and
  no longer style the v5 React components, which therefore render with the
  solid look under `glass` and `liquid` until they are migrated.
- **Panel tokens.** Panel-like elements (card, navbar, sidebar, popover, hover-card,
  context-menu, toast, modal, drawer, command-palette, combobox listbox, menu,
  chart-tooltip) paint from `--panel-bg` (`--panel-bg-strong` for dialogs,
  drawers and listboxes), `--panel-border`, `--panel-filter` (a `backdrop-filter`
  value), `--panel-ink-bg` and `--panel-accent-bg`; shadows keep coming from
  `--elevation-*`. Defaults live in `constants.css`; `glass` and `liquid`
  override them. Each of those elements also exposes `part="panel"` for anything
  a token cannot express: `hmi-card::part(panel) { … }`.
- **Per-element hooks** replace the journal-specific rules that v5 keeps inside
  component CSS: `--list-divider-style`, `--progress-track-border`, `--stat-rule`,
  `--switch-thumb-shadow` (defaults in `constants.css`, overridden by
  `structure/journal.css`).
- **Sizing base.** The elements never use `rem`. They size from `--hmi-base`
  (`8px` by default, set in `base.css`), so a host app keeps its own root font
  size. Scale the whole library with `:root { --hmi-base: 10px; }`. Every theme
  token that carries a length (`--space-*`, `--corner-*`, `--elevation-*`, the
  material rims) is expressed as `calc(var(--hmi-base, 8px) * N)`. For the v5
  React tree, whose `html { font-size: 8px }` makes `1rem = 8px`, the values are
  identical.
- **Liquid refraction.** The `liquid` material references an SVG filter
  (`url('#liquid-glass')`). Elements embed that filter inside their own shadow root
  so it resolves everywhere; the document-level copy in `index.html` is only needed
  for the v5 React components.
- **`base.css`** (`public/css/base.css` → `dist/base.css`) is the only global
  stylesheet the Lit elements need besides the themes: `--hmi-base`, `body`
  defaults, `::selection`, the `glass`/`liquid` body backdrops and the pre-upgrade
  `:not(:defined)` rules generated from `custom-elements.json` by `pnpm cem`. The
  React demo and Storybook load it too.

## Token reference

All tokens are CSS custom properties. Reference them in your own CSS with
`var(--token)`. Light/dark variants of the color roles are selected automatically
from `prefers-color-scheme`.

### Color roles

Follows Material Design 3 naming. Each role typically has an `--on-*` pair for
content drawn on top of it.

- **Accents:** `--primary` / `--on-primary` (+ `--primary-container` / `--on-primary-container`), and the same shape for `--secondary`, `--tertiary`, `--error`, `--success`, `--warning`.
- **Surfaces:** `--background` / `--on-background`, `--surface` / `--on-surface`, `--surface-variant` / `--on-surface-variant`, and the tonal tiers `--surface-container-lowest` → `--surface-container-low` → `--surface-container` → `--surface-container-high` → `--surface-container-highest`.
- **Lines & effects:** `--outline`, `--outline-variant`, `--shadow`, `--scrim`.
- **Inverse:** `--inverse-surface`, `--inverse-on-surface`, `--inverse-primary`.
- **Focus ring:** `--ring` (derived from the active `--primary`).

The complete role → property map is exported as `colors` for imperative use
(see [Reading tokens from JS](#reading-tokens-from-js)).

### Shape

- Scale: `--corner-none`, `--corner-extra-small`, `--corner-small`, `--corner-medium`, `--corner-large`, `--corner-extra-large`, `--corner-full`.
- Per-corner overrides drive the signature asymmetric "notch": `--corner-tl`, `--corner-tr`, `--corner-br`, `--corner-bl`.

Values vary by structure theme (`default`, `rounded`, `sharp`, `pixel`, `journal`).

### Spacing & density

A 2dp-based scale: `--space-0` (`0`) through `--space-14`. Components reference
these; their concrete values shift with the structure theme to provide density
theming. Legacy aliases `--spacing-0` … `--spacing-9` map onto the active
`--space-*` scale.

> v5 React components: base font size is `8px` (set on `html` by `globals.css`),
> so `1rem = 8px`. Lit elements: the same scale is derived from `--hmi-base`.

### Elevation

Shadow per level: `--elevation-0` (none) through `--elevation-5`. The `journal`
structure overrides them.

### Motion

- **Easing:** `--easing-standard`, `--easing-emphasized` (+ `-decelerate` / `-accelerate` variants), `--easing-linear`, `--easing-spring`.
- **Duration:** `--duration-short-1…4`, `--duration-medium-1…4`, `--duration-long-1…4`, `--duration-extra-long-1…4` (50ms → 1000ms).

### Typography

Font-family stacks are exposed as tokens and selected per structure theme into the
active UI/display fonts:

- `--font-quicksand`, `--font-oxanium`, `--font-rubik-glitch`, `--font-press-start-2p`, `--font-pixelify-sans`, `--font-caveat`
- `--font-default` (active UI font), `--font-display` (active display font)
- `--font-mono` (monospace role, consumed by `hmi-code`). Unlike the families
  above it is a system stack, so it needs no Google Font; a structure theme can
  override it like any other token.

The matching Google Fonts URL is exported as `googleFontsHref`. Fonts must be loaded
by the document (`<link>`); `@font-face` cannot be declared inside a shadow root.

### Material

`--glass-*` and `--liquid-*` tokens describe the frosted and refractive surfaces;
the `--panel-*` tokens above are what the elements actually consume.

### State layers

MD3 state-layer opacities: `--state-hover-opacity`, `--state-focus-opacity`,
`--state-pressed-opacity`, `--state-dragged-opacity`, `--state-disabled-opacity`,
`--state-disabled-container-opacity`.

## Reading tokens from JS

The `colors` and `fonts` maps expose token names so you can read computed values
imperatively (e.g. to color a `<canvas>` or chart):

```ts
import { colors, fonts } from '@ninoverse/hmi-components';

const styles = getComputedStyle(document.documentElement);
const primary = styles.getPropertyValue(colors.primary).trim();   // e.g. "#e87a5d"
const uiFont = styles.getPropertyValue(fonts.quicksand).trim();
```

## Custom themes

Because theming is pure CSS, a custom theme is just a stylesheet that overrides the
relevant token set:

- **Custom color theme:** copy a file from `public/css/themes/color/` and redefine the color roles under `[data-theme='your-name']`, then load it and set `data-theme="your-name"`.
- **Custom structure theme:** copy a file from `public/css/themes/structure/` and redefine the shape/density/motion/type tokens under `[data-structure='your-name']`.
- **Custom material:** copy a file from `public/css/themes/material/` and redefine the `--panel-*` tokens under `[data-material='your-name']`. Do not add component selectors — they will not reach into the elements.

Pure-CSS / Web Component consumers can point at your stylesheet directly. In React,
`ThemeProvider`'s pickers are populated from the const arrays in `colorThemes` /
`structures` / `materials`; a fully custom value not in those lists can still be
applied by setting the `data-*` attribute yourself.
