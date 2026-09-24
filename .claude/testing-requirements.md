# Testing Requirements

Legacy React components (`src/components/`) have no test suite and are
frozen. Every Lit element under `src/elements/` ships tests, run by Vitest
(`vitest.config.ts`: a `browser` project in Chromium through Playwright and an
`ssr` project in Node).

## Gate before "ready for review"

- [ ] `pnpm lint` — zero warnings, zero errors, no new `biome-ignore`
- [ ] `pnpm build` — `tsc -b`, ESM library, r2wc IIFE, Lit IIFE
- [ ] `pnpm test` — Vitest browser mode (Chromium through Playwright)
- [ ] `pnpm test:ssr` — Vitest node project running `*.ssr.test.ts`

CI (`ci-gate.yml`) runs the same four commands on every PR.

## What every `src/elements/<kebab>/<kebab>.test.ts` must contain

Named `it` blocks, in this order:

| Block | Asserts |
|-------|---------|
| `registers` | `customElements.get('hmi-<kebab>')` is defined |
| `renders` | `[part~="base"]` exists in the shadow root **and** paints a non-zero `getBoundingClientRect()`. Always the `~=` token selector, never `[part="base"]`: a panel-like element's base carries two tokens (`part="base panel"`) and an exact match misses it. Presence alone passes for a node that renders invisibly (R4, `display` on sized nodes). Deliberately zero-sized elements (`spacer`, `visually-hidden`) assert their intended dimension instead. |
| `reflects <prop>` (one per reflected property) | property → attribute and attribute → property |
| `boolean attribute presence` | bare attribute is `true`, removal is `false` |
| `dispatches hmi-<event> with detail` (one per event) | `detail` shape, `bubbles: true`, `composed: true`, `cancelable` where R5 requires it; listener attached on `document` |
| `projects <slot> slot` (default + each named slot) | `assignedElements()` length |
| `submits its value and resets` (form-associated only) | `new FormData(form).get(name)`; `form.reset()` restores the default |
| `exposes roles` | role / `aria-*` on the base node |
| `mounts through the React wrapper` | `createRoot` + `act`; properties set; `onX` receives the event |

`<kebab>.ssr.test.ts` (node): the module imports without touching
`window`/`document`; `@lit-labs/ssr` `render()` output contains
`<template shadowroot`, `part="base"` and the slotted text.

Rules:

- No snapshot tests of full shadow markup (brittle); assert parts and
  attributes.
- Tests run against the built-in fixtures in the templates
  (`docs/migration/translation-guide.md` §18); do not add test utilities that
  pull in dependencies.
- Visual parity is not automated: it is the side-by-side screenshot pair
  reviewed by the user (`verify-component`).
