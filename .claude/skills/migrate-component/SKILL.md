---
name: migrate-component
description: Migrate one existing React component of ninoverse-hmi-components to a Lit custom element end to end — read its .tsx / .styled.css / story / r2wc registration, derive the props-slots-events-parts mapping per docs/migration/translation-guide.md, get the mapping approved, then scaffold, wire, verify (lint, build, tests, manifest, storybook, side-by-side screenshot) and ship a draft PR. Use when the user says "migrate <Name>", "/migrate-component badge", or "next component in the tracker".
---

# Migrate Component

End-to-end orchestrator for converting **one existing React component** into a
Lit element. Runs the four focused sub-skills after an analysis phase that the
user must approve. Each sub-skill can also be invoked on its own.

## Step 0 — Read the rules

Read `.claude/lit-migration.md` in full. Every rule (R1–R12) is mandatory.
Keep `docs/migration/translation-guide.md` open for the pattern mappings.

## Inputs

- **Component name** (required): any form (`AvatarStack`, `avatarStack`,
  `avatar-stack`). Derive:
  - React file stem (camelCase): `avatarStack`
  - kebab name: `avatar-stack` (folder, files, tag suffix, subpath)
  - PascalCase: `AvatarStack` → class `HmiAvatarStack`, wrapper export `AvatarStack`
  - tag: `hmi-avatar-stack`
- If no name was given, ask before doing anything else. If the user says
  "next", pick the first `Todo` row of the lowest open phase in
  `docs/migration/tracker.md`.

## Step 1 — Gate check

Open `docs/migration/tracker.md`. The element's phase may start only when
every PR of the previous phase is merged. If the gate is not met, say which
PRs are still open and stop, unless the user explicitly overrides.

## Step 2 — Read the sources

Read all of these; some may be absent (avatar-stack, radio-group,
confirm-dialog and search-input have no CSS of their own):

- `src/components/<camel>.tsx`
- `src/components/styled/<camel>.styled.css`
- `src/components/<camel>.stories.tsx`
- the `define('<kebab>', …)` block in `src/web-components.ts` (prop types,
  `events`, form kind)
- `docs/api/components/<camel>.md`
- the tracker row's flags and notes

## Step 3 — API mapping sheet

Produce, in this order, and then **WAIT for approval**:

1. The mapping table (this exact shape goes into the PR body later):

   | React prop | Element property / attribute | Slot | Event (detail) | Part |
   |------------|------------------------------|------|----------------|------|

   Apply the rules: R2 for props, R6 for `ReactNode` props (singular → slot,
   array fields → string + `label-<value>` slot, render functions → three
   tiers), R5 for callbacks (use the event catalog in the translation guide §6).
2. The hazard list found in the source, each with the replacement:
   `createPortal`, `document`/`window` listeners, `document.activeElement`,
   `useId`, `className` / `...rest` passthrough, `as`, cross-boundary CSS
   (`[data-structure=…]`, another component's class), `rem` count
   (`grep -c rem src/components/styled/<camel>.styled.css`), inline `style`
   with custom properties, native form participation.
3. Behaviour differences the React consumer will notice (for example
   `hmi-input` + `hmi-change` instead of per-keystroke `onChange`).
4. Which templates blocks apply: form-associated block (R7), panel block
   (R4), overlay skeleton (R8).

## Step 4 — Run the phases

| Phase | Skill | What it does |
|-------|-------|--------------|
| 1 | `scaffold-component` (migration mode) | branch `migrate/<kebab>` from `origin/main`, collision check, create the six files from the templates pre-filled with the mapping sheet |
| 2 | `wire-component` | `src/elements/index.ts`, `src/react/index.ts`, `vite.config.ts`, `package.json` exports, `examples/elements.html`, story, tracker row → In progress |
| 3 | `verify-component` | format → lint → build → artifacts → `test` → `test:ssr` → `cem` → storybook → side-by-side screenshot → user approval |
| 4 | `ship-component` | commit `feat(ui): migrate <Name> to lit`, push, draft PR with mapping sheet + R12 checklist, tracker row → In review, stop |

## Rules

- `pnpm` only.
- Never edit or delete `src/components/<camel>.tsx` or its CSS; both
  implementations coexist until the v6 flip.
- Never batch two elements in one run unless the user asked for a phase batch
  (phases 2, 3 and 8 allow up to five leaves per PR, one commit each).
- In a batch, each element is scaffolded, wired, verified **and committed**
  before the next one starts. Do not run a phase across all of them at once —
  they share six wiring files, and interleaved edits cannot be split back into
  one commit per element (`.claude/execution-order.md`).
- Do not proceed past phase 3 until the user has approved the screenshot pair.
- After the draft PR is open, **stop** and wait for the user.
