# Execution Order & Branching Strategy

Defines the order in which the React → Lit migration proceeds and the
branch / PR structure that maps onto it. Status lives in
`docs/migration/tracker.md`; rules in `.claude/lit-migration.md`.

---

## Branching and PR strategy

See `.claude/branch-naming.md` for the branch name format.

| Work type | Branch prefix | One PR per |
|-----------|--------------|-----------|
| Docs / rules | `docs/` | one PR |
| Tooling scaffold (phase 0) | `chore/` | whole scaffold |
| Token update / re-theme | `chore/` | one PR |
| Migrating one element | `migrate/<kebab>` | element |
| Migrating a leaf batch (phases 2, 3, 8) | `migrate/phase-<n>-<group>` | batch of ≤ 5, one commit each |
| New element (no React predecessor) | `feat/<kebab>` | element |
| Rename / refactor | `refactor/` | logical unit |
| v6 flip (phase 11) | `migrate/v6-flip` | one PR |

**Never stack.** Every branch is cut from `main` after the previous PR has
merged. Never branch from another open PR's branch.

**Draft PR rule:** open a draft PR at the first commit. Mark ready for review
only when every item of the R12 checklist is ticked.

---

## Migration phases

Phases run in ascending order. A phase starts only when every PR of the
previous phase is merged to `main`.

| Phase | Scope | Elements |
|-------|-------|----------|
| 0 | Docs (PR 1) and tooling scaffold (PR 2): `src/elements/shared/{base.styles,events,dom}.ts`, `base.css`, `--hmi-base` rebase of theme tokens, `--panel-*` tokens with material/journal overrides, Vitest, manifest, Storybook `web-components-vite`, Lit IIFE, `ci-gate` steps | — |
| 1 | Pilot — freezes the templates and the definition of done | `badge` |
| 2 | Presentational leaves | `alert`, `avatar`, `avatar-stack`, `banner`, `blockquote`, `card`, `chip`, `code`, `empty-state`, `kbd`, `meter`, `progress`, `skeleton`, `spinner`, `stat` |
| 3 | Layout + typography | `aspect-ratio`, `box`, `divider`, `flex`, `grid`, `heading`, `link`, `scroll-area`, `spacer`, `text`, `visually-hidden` |
| 4 | Button + text inputs (introduces `shared/form.ts`, `shared/format.ts`) | `button`, `form-control`, `input`, `textarea`, `number-input`, `password-input`, `search-input`, `multi-input`, `file-upload` |
| 5 | Selection controls | `checkbox`, `radio`, `radio-group`, `switch`, `slider`, `segmented-control`, `value-scale-selector` |
| 6 | Data display | `accordion`, `carousel`, `image`, `list`, `table`, `timeline` |
| 7 | Navigation | `breadcrumbs`, `navbar`, `pagination`, `sidebar`, `stepper`, `tabs`, `tree` |
| 8 | Charts (introduces `shared/chart.ts`) | `cartesian-grid`, `chart-tooltip`, `legend`, `responsive-container` first; then `area-chart`, `bar-chart`, `bullet-chart`, `donut-chart`, `funnel-chart`, `gauge`, `heatmap`, `line-chart`, `radar-chart`, `scatter-plot`, `sparkline` |
| 9 | Overlay infrastructure (`shared/positioning.ts`) + overlays | `modal`, `confirm-dialog`, `drawer`, `popover`, `tooltip`, `hover-card`, `context-menu`, `menu` |
| 10 | Overlay composites | `select`, `combobox`, `date-picker`, `color-picker`, `command-palette` |
| 11 | Toast, theme module, v6 flip | `toast`, `shared/theme.ts` + `useTheme`, exports flip, r2wc and `src/components` removal, `App.tsx` rewrite, README and reproduction-guide rewrite, `6.0.0` |

### Within each phase

- Migrate **one element at a time** (one commit each); batches of up to five
  leaves per PR only in phases 2, 3 and 8.
- **Run each element's full cycle through to its commit before starting the
  next one.** Never wire a second element into the shared files
  (`src/elements/index.ts`, `src/react/index.ts`, `vite.config.ts`,
  `package.json`, `examples/elements.html`, the tracker) while the first is
  still uncommitted. Every element edits those same files, so doing a batch
  breadth-first — scaffold all, then wire all — interleaves their changes and
  leaves no clean way to split them back into one commit per element.
- Follow `.claude/component-workflow.md` for each element.
- Stop and confirm with the user after each element before starting the next.
- The first element of a phase that introduces shared infrastructure
  (`form.ts` in phase 4, `chart.ts` in phase 8, `positioning.ts` in phase 9)
  lands that module in the same PR.

### Adding new components during the migration

New components are Lit elements from day one: `feat/<kebab>` branch off
`main`, `/create-component`, same six files, same gate. Never add a React
component to `src/components/`.
