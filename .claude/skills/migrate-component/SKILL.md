---
name: migrate-component
description: Migrate one legacy React component to a Lit element, around /new-element
argument-hint: "<component name, or next>"
---

# Migrate a component

The migration's own steps for one component of the legacy React tree, around
`/new-element`, which builds the element itself. This skill retires at v6, with
the tracker.

The component: $ARGUMENTS

## Step 0 — Read the rules

`.claude/lit-migration.md`, hmi's element rules R1 to R12, and the composed
element rules beside it. Keep `docs/migration/translation-guide.md` open for
the pattern mappings and the event catalog.

## Inputs

- The component, in any form (`AvatarStack`, `avatarStack`, `avatar-stack`).
  Derive the React file stem (`avatarStack`), the element name
  (`avatar-stack`), the class `HmiAvatarStack` and the wrapper export
  `AvatarStack`.
- With no name, ask. With "next", take the first `Todo` row of the lowest open
  phase in `docs/migration/tracker.md`.

## Step 1 — Gate check

The element's phase may start only when every PR of the previous phase has
merged (`docs/migration/README.md` §6). If the gate is not met, say which PRs
are still open and stop, unless the user explicitly overrides.

## Step 2 — Read the sources

Some may be absent (avatar-stack, radio-group, confirm-dialog and search-input
have no CSS of their own):

- `src/components/<camel>.tsx`
- `src/components/styled/<camel>.styled.css`
- `src/components/<camel>.stories.tsx`
- the `define('<kebab>', …)` block in `src/web-components.ts`: prop types,
  `events`, form kind
- `docs/api/components/<camel>.md`
- the tracker row's flags and notes

## Step 3 — The mapping sheet

Produce, in this order, then **wait for approval**:

1. The element's API table, as *Element API table* lays it out, with a React
   prop column in front:

   | React prop | Property / attribute | Slot | Event (detail) | Part |
   |------------|----------------------|------|----------------|------|

   R2 for props, R6 for `ReactNode` props, and R5 with the event catalog
   (translation guide §6) for callbacks.
2. The hazards in the source, each with its replacement: `createPortal`,
   `document`/`window` listeners, `document.activeElement`, `useId`,
   `className` and `...rest` passthrough, `as`, cross-boundary CSS
   (`[data-structure=…]`, another component's class), the `rem` count
   (`grep -c rem src/components/styled/<camel>.styled.css`), inline `style`
   with custom properties, native form participation.
3. The behaviour differences a React consumer will notice: `hmi-input` with
   `hmi-change` instead of a per-keystroke `onChange`, and, for every boolean
   prop, the bare attribute's flip (R2).
4. Which of hmi's rules apply: form-associated (R7), panel-like (R4), overlay
   (R8).

## Step 4 — Build the element

Run `/new-element <kebab>` with the approved table, minus its React column. Its
local steps, `.agents/new-element.local.md`, add the wrapper, the story and the
wiring. The branch is `feat/<kebab>`, or the one the environment assigned
(*Branch naming*).

In the same change:

- `src/components/<camel>.tsx`'s JSDoc gains one line, and nothing else in the
  React tree changes:
  ``@deprecated Use `<Pascal>` from `@ninoverse/hmi-components/react/<kebab>`. Removed in 6.0.0.``
- The tracker row goes to `Done`, with the PR linked in its **PR** column once
  the PR exists: the row reaches `main` only when the PR merges.

## Step 5 — The visual check

With `/take-screenshot`, capture the React section of `src/App.tsx`, matched by
its `<h2>` text, from `pnpm dev`, and the element's section of
`examples/elements.html`, which loads the built `dist/`, so after `pnpm build`.
Use the default theme axes, and for a panel-like element add a pair with
`data-structure="journal"` and `data-material="glass"`. Show the pair and wait
for approval; *Visual check* says what the PR records.

## Step 6 — The PR

Commit `feat(ui): migrate <Pascal> to lit` and open the PR as *Git flow* and
*PR instructions* say. Its description adds, after the API table with its React
column: the behaviour differences, the visual-check record, the tracker row's
link, and R12's checklist from `.claude/lit-migration.md`, every box ticked.

## Batches

Phases 2, 3 and 8 allow up to five leaf elements per PR, one commit each. Each
element goes through steps 2 to 5 and its commit before the next starts, since
they share the wiring files (*Element sequencing*). Never batch outside those
phases unless the user asks.

## Rules

- Never edit or delete `src/components/<camel>.tsx` or its CSS beyond the
  `@deprecated` line: both implementations coexist until the v6 flip.
- Open the PR once the user has approved the visual check, or as a draft until
  they do (*PR instructions*).
- After the PR is open, stop and wait for the user.
