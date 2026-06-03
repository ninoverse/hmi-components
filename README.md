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

## Design system

Color tokens follow Material Design 3 naming (`--primary`, `--surface-variant`, `--on-surface`, etc.) and are defined as CSS custom properties in `public/css/themes/`. Import `src/configs/colors.ts` to reference them from TypeScript.

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
```

## Project structure

```
src/
├── components/         # React components (.tsx)
│   └── styled/         # Component-scoped CSS (`*.styled.css`)
├── configs/            # Color tokens and static config
├── models/             # TypeScript interfaces and types
└── lib/                # Shared utilities

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
