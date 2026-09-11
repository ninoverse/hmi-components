# CLAUDE.md

This file provides strict guidance and architectural rules for Claude Code (claude.ai/code) when working in this repository.

## Commands & Tooling

- **Package Manager:** You MUST strictly use `pnpm`. Never use `npm` or `yarn`.
- **Maintain the Build:** Never leave the codebase in a state where build, lint or tests fail. Run the relevant commands below to verify your work before concluding a task.

```bash
pnpm install          # Install dependencies
pnpm dev              # Start Vite dev server (legacy React demo, src/App.tsx)
pnpm build            # tsc -b + ESM library + r2wc IIFE + Lit IIFE
pnpm build:wc         # r2wc IIFE only
pnpm build:demo       # Demo page → dist-site/demo
pnpm storybook        # Storybook dev server on :6006
pnpm build:storybook  # Storybook → dist-site
pnpm build:site       # Storybook + demo
pnpm preview          # Serve production build locally
pnpm lint             # Biome check (lint + format check)
pnpm format           # Biome format with auto-write
pnpm run docs         # TypeDoc → docs/api (legacy React API); `pnpm docs` is pnpm's own command
```

Lit element tooling (Vitest in Chromium through Playwright, Node SSR, manifest):

```bash
pnpm test             # Vitest browser mode (Chromium via Playwright)
pnpm test:ssr         # Vitest node project for *.ssr.test.ts
pnpm cem              # Regenerate custom-elements.json
pnpm build:elements   # Lit drop-in bundle dist/hmi-elements.iife.js
```

## Architecture & Framework Rules

**Web Components on Lit.** Every component is a native custom element `hmi-<name>` built with Lit 3 (`LitElement`, Shadow DOM, `static styles`). React is supported only through `@lit/react` wrappers exported under `./react`. The React tree in `src/components/` is the **legacy** implementation being migrated one element per PR; it is frozen — never add to it, never edit it in a migration PR.

Read `.claude/lit-migration.md` before touching anything under `src/elements/`. Progress and phase gates: `docs/migration/tracker.md`.

### 1. Dependencies

Lit is the single allowed runtime dependency. Zero framework dependency: hand-roll everything else (positioning, charts, date math, icons).

### 2. Elements

- One folder per element: `src/elements/<kebab>/` with `<kebab>.ts`, `.styles.ts`, `.react.ts`, `.stories.ts`, `.test.ts`, `.ssr.test.ts`.
- Class `Hmi<Pascal>`, tag `hmi-<kebab>`, TC39 standard decorators with `accessor`.
- Props → `@property`; rich content → slots; callbacks → `hmi-*` `CustomEvent`s with object `detail`; forms → `ElementInternals`; overlays → `<dialog>` and the Popover API.
- SSR-safe: no `window`/`document` at import or constructor time; never mutate light DOM.

### 3. Styling

- **Design Tokens:** CSS custom properties follow Material Design 3 color token naming (`--primary`, `--surface-variant`, etc.). The theme CSS is in `public/css/themes/` and may define **only** custom properties. Import `src/configs/colors.ts` to use token names imperatively in JS.
- **Encapsulation:** all element CSS lives in `<kebab>.styles.ts` inside the shadow root. No `.css` files for elements, no selectors that reach outside the root (`[data-structure=…]`, `:host-context()`), no `z-index` for overlays.
- **Sizing:** never `rem`. Elements size from `--hmi-base` (8px by default) through `calc(var(--_base) * N)`; `--_base` is provided by `baseStyles`.
- **Consumer styling surface:** tokens, a documented set of `part` names (`base`, `label`, `icon`, `panel`, …) and class/style on the host.
- **Typography:** Google Fonts exposed as tokens: `--font-quicksand`, `--font-oxanium`, `--font-rubik-glitch`, `--font-press-start-2p`, `--font-pixelify-sans`, `--font-caveat`; elements use `--font-default` / `--font-display`.

## Behavioral Guidelines

**Tradeoff:** Bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State your assumptions explicitly. If uncertain, stop and ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, propose it. Push back when warranted.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked. No abstractions for single-use code.
- No "flexibility" or error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Match existing style exactly.
- Remove imports/variables/functions that YOUR changes made unused. Don't remove pre-existing dead code unless asked.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

- Transform tasks into verifiable goals (e.g., "Add validation" → "Write tests for invalid inputs, then make them pass").
- For multi-step tasks, state a brief plan and verify each step independently.

---

## Extended Rules (Read Before Acting)

Use your file-reading capabilities to read the exact rules in the `.claude/` directory **before** executing any of the following tasks:

- **Migrating or building an element:** Read `.claude/lit-migration.md`, then `.claude/component-workflow.md`
- **Deciding what to migrate next / branching strategy:** Read `.claude/execution-order.md` and `docs/migration/tracker.md`
- **Committing code:** Read `.claude/commit-conventions.md`
- **Creating branches:** Read `.claude/branch-naming.md`
- **Reviewing PRs:** Read `.claude/code-review.md`
- **Testing/Verifying:** Read `.claude/testing-requirements.md`
- **Opening PRs:** Read `.claude/pr-guidelines.md`
- **Creating new files:** Read `.claude/file-naming.md`
- **Reproducing the v5 React library from a design file (legacy):** Read `.claude/reproduction-guide.md`

Skills (`.claude/skills/*/SKILL.md`): `migrate-component` (existing React component → Lit element), `create-component` (new element), and the four phases they orchestrate: `scaffold-component`, `wire-component`, `verify-component`, `ship-component`.

Human documentation: `docs/migration/README.md` (playbook), `docs/migration/translation-guide.md` (React → Lit patterns, templates, worked example), `docs/migration/adr-0001-lit-web-components.md` (decisions), `docs/theming.md`.
