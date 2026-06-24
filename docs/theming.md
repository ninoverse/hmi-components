# Theming

Every component in `@ninoverse/hmi-components` is styled entirely with CSS custom
properties (design tokens). Theming means swapping the values behind those tokens —
no per-component configuration, and the same mechanism works in React and in plain
HTML / Web Components.

## The two theme axes

Themes are split into two independent axes, each driven by a `data-*` attribute on
an ancestor element (usually `<html>`):

| Axis | Attribute | What it controls | Values |
|------|-----------|------------------|--------|
| **Color** | `html[data-theme]` | Palette / color roles. Light & dark resolve automatically via `prefers-color-scheme`. | `default`, `ocean`, `forest` |
| **Structure** | `html[data-structure]` | Shape (corner radii), density (spacing), motion (easing/duration) and typography. | `default`, `rounded`, `sharp`, `pixel` |

The two combine freely (3 × 4 = 12 looks). The canonical value lists are exported
from the package so you don't have to hardcode them:

```ts
import { colorThemes, structures } from '@ninoverse/hmi-components';
// colorThemes → ['default', 'ocean', 'forest']
// structures  → ['default', 'rounded', 'sharp', 'pixel']
```

## React: `ThemeProvider` + `useTheme`

For React apps, `ThemeProvider` manages both axes at runtime. It persists each
choice to `localStorage` and reflects it onto `html[data-theme]` /
`html[data-structure]`, so a change re-themes the whole tree instantly.

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

> **Avoiding a flash of the default theme.** `ThemeProvider` sets the `data-*`
> attributes after mount. To prevent a flash before hydration, also set
> `data-theme` / `data-structure` on `<html>` in your HTML shell — or run a tiny
> inline script in `<head>` that reads the same `localStorage` keys
> (`hmi-theme`, `hmi-structure`) and applies them before first paint.

## Non-React / Web Components: pure CSS

There is **no** `ThemeProvider` outside React — the tokens come entirely from the
theme stylesheets. Set the attributes on `<html>` (or any ancestor) and load the
token CSS in order: constants first, then **one** color theme and **one** structure
theme.

```html
<html data-theme="forest" data-structure="sharp">
    <head>
        <link rel="stylesheet" href="…/dist/themes/constants.css" />
        <link rel="stylesheet" href="…/dist/themes/color/forest.css" />
        <link rel="stylesheet" href="…/dist/themes/structure/sharp.css" />
        <link rel="stylesheet" href="…/dist/hmi-components.css" />
    </head>
</html>
```

Switching themes is just changing the attribute value (and swapping the color/
structure stylesheet if you only ship a subset). When installed from npm, the theme
files are exposed under the `./themes/*` subpath. See the
[Web Components section of the README](../README.md#use-as-web-components) for the
full setup, including the Google Fonts link.

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

Values vary by structure theme (`default`, `rounded`, `sharp`, `pixel`).

### Spacing & density

A 2dp-based scale: `--space-0` (`0`) through `--space-14` (`7rem`). Components
reference these; their concrete values shift with the structure theme to provide
density theming. Legacy aliases `--spacing-0` … `--spacing-9` map onto the active
`--space-*` scale.

> Base font size is `8px` (set on `html`), so `1rem = 8px` and all `rem` units —
> including the spacing scale — derive from that base.

### Elevation

Shadow per level: `--elevation-0` (none) through `--elevation-5`.

### Motion

- **Easing:** `--easing-standard`, `--easing-emphasized` (+ `-decelerate` / `-accelerate` variants), `--easing-linear`, `--easing-spring`.
- **Duration:** `--duration-short-1…4`, `--duration-medium-1…4`, `--duration-long-1…4`, `--duration-extra-long-1…4` (50ms → 1000ms).

### Typography

Font-family stacks are exposed as tokens and selected per structure theme into the
active UI/display fonts:

- `--font-quicksand`, `--font-oxanium`, `--font-rubik-glitch`, `--font-press-start-2p`, `--font-pixelify-sans`
- `--font-default` (active UI font), `--font-display` (active display font)

The matching Google Fonts URL is exported as `googleFontsHref`.

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

Pure-CSS / Web Component consumers can point at your stylesheet directly. In React,
`ThemeProvider`'s pickers are populated from the const arrays in `colorThemes` /
`structures`; a fully custom value not in those lists can still be applied by
setting the `data-*` attribute yourself.
