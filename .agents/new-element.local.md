# hmi's steps for /new-element

Written by hand: `agentcfg` leaves this file alone. `/new-element` follows it at
its step 5, once the element, its styles and its two tests exist, and before the
gate. Read `.claude/lit-migration.md` before `/new-element`'s first step, as you
read the composed element rules: it holds what hmi adds to them.

The prefix is `hmi`: the tag is `hmi-<name>` and the class `Hmi<Name>`. hmi's
own templates for all six files, with everything below in place, are in
`docs/migration/translation-guide.md` §18.

## 1. hmi's additions to the four files

- `<name>.ts` imports only from `lit`, `lit/decorators.js`,
  `lit/directives/*.js` and `../shared/*` (R1).
- Its styles are `static override styles = [baseStyles, styles];`, with
  `baseStyles` from `../shared/base.styles.js`. Sizes are
  `calc(var(--_base) * N)`, never `rem`, and a panel-like element exposes
  `part="panel"`, paints from the `--panel-*` tokens and embeds
  `renderLiquidFilter()` (R4).
- `<name>.test.ts` ends with one more block, `mounts through the React wrapper`:
  rendered with `createRoot` inside `act`, the element has the props the
  wrapper was given, and each `onX` receives its event (R10).

## 2. The React wrapper

`src/elements/<name>/<name>.react.ts`, from §18: `createComponent` with the tag,
the class, React, a `displayName` and one `onX` per event, typed with the event's
detail, and the detail and value types re-exported. No JSX and no logic (R10).
The wrapper's export keeps the React component's name, such as `AreaChart`.

## 3. The story

`src/elements/<name>/<name>.stories.ts`, from §18:
`title: 'Components/<Category>/<Name>'`, `component: 'hmi-<name>'` and
`tags: ['autodocs']`, one story per property axis, and the React import in
`parameters.docs.description.component`. The class JSDoc sits directly above
`export class`, where the manifest and Storybook read it.

| Category | Covers |
|----------|--------|
| `Layout` | Structure and spacing: Box, Flex, Grid, Card, Divider, Spacer, ScrollArea, AspectRatio, VisuallyHidden |
| `Typography` | Text, Heading, Link, Blockquote, Code |
| `Forms` | Anything the user types into or picks from, plus Button |
| `Feedback` | Status and progress: Alert, Banner, Progress, Skeleton, Spinner, Toast, Stat, Meter, EmptyState |
| `Overlays` | Anything in the top layer: Modal, Drawer, Popover, Tooltip, Menu, HoverCard, ContextMenu, CommandPalette, ConfirmDialog |
| `Navigation` | Breadcrumbs, Navbar, Pagination, Sidebar, Stepper, Tabs, Tree |
| `Data display` | Presenting existing data: Table, List, Avatar, Badge, Chip, Timeline, Accordion, Carousel, Image, Kbd |

Charts sit at the top level, under `Charts/`.

## 4. Wiring

Every list stays in alphabetical order by name.

1. `src/elements/index.ts`: `export * from './<name>/<name>.js';`
2. `src/react/index.ts`: the wrapper, and its detail and value types.
3. `vite.config.ts`: the entries `wc/<name>` and `react/<name>`, after
   `wc/index` and `react/index`.
4. `package.json` `exports`: `./wc/<name>` and `./react/<name>`, each with
   `types` under `dist/elements/<name>/` and `import` under `dist/wc/` or
   `dist/react/`. `sideEffects` already covers `./dist/wc/*.js`.
5. `examples/elements.html`: a section that sets its attributes, fills a slot
   and logs one event's `detail` to the console. Never
   `examples/web-components.html`, which loads the r2wc bundle.

## 5. Generated files

- `pnpm cem` regenerates `custom-elements.json` and `public/css/base.css`. Commit
  both: CI fails when either is stale, and the manifest must list every
  property, attribute, slot, part and event.
- `pnpm build:storybook`, when a story changed: no gate builds Storybook.

Then go back to `/new-element` for the gate.
