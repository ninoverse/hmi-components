# hmi-components

Native custom elements, `hmi-<name>`, built with Lit 3 for plain HTML, React,
Vue, Angular, Svelte and Dioxus alike. React gets `@lit/react` wrappers under
`./react`. This section is hmi's own and written by hand. Everything between the
`agentcfg` markers below is composed from `.agentprofile.yml` by
`pnpm agentcfg sync`: a correction to it goes into agent-config-sync's
fragments, not here.

## Elements

- Lit is the library's only runtime dependency. Hand-roll everything else:
  positioning, charts, date math, icons.
- The tag prefix is `hmi`: tags are `hmi-<name>`, classes `Hmi<Name>`, events
  `hmi-<event>`.
- Before touching `src/elements/**`, read `.claude/lit-migration.md` beside the
  composed *Elements*, *Element styles* and *Forms and overlays*. It holds hmi's
  own element rules, R1 to R12, the numbers the migration documents cite.
  `/new-element` follows `.agents/new-element.local.md` for hmi's steps.

## Design system

- Colours, radii, shadows and spacing are CSS custom properties named after
  Material Design 3's color roles (`--primary`, `--surface-variant`). The theme
  files in `public/css/themes/` define custom properties and nothing else, and
  `src/configs/colors.ts` holds the token names for code. `docs/theming.md`
  explains the theme axes.
- Sizes derive from `--hmi-base`, 8px by default, as `calc(var(--_base) * N)`,
  with `--_base` from `baseStyles`. Never `rem`.
- Fonts are tokens: `--font-quicksand`, `--font-oxanium`, `--font-rubik-glitch`,
  `--font-press-start-2p`, `--font-pixelify-sans` and `--font-caveat`. Elements
  use `--font-default` and `--font-display`.
- Consumers style an element through the tokens, its documented parts, and the
  host's `class` and `style`.

## The package's public surface

An element's own surface is in *Elements*. Changing any of these is breaking
too:

- the `exports` subpaths: `./wc/<name>` and `./react/<name>` for each element,
  the barrels `./wc` and `./react`, the drop-in bundle `./elements`, and
  `./base.css`. The root export and `./<name>` stay React until 6.0.0;
- the React wrappers' names, which are the v5 components' names, and their
  props;
- the theme token names and `--hmi-base`;
- the script bundles' globals, `HmiElements` and `HmiComponents`.

## Commits

Scopes are layers, as *Commit message guidelines* allows: `ui` for elements and
legacy components, `react` for the wrappers and `useTheme`, `theme` for tokens
and theme files, `build` for Vite, tsconfig, the package exports and the
manifest, `ci` for workflows, and `docs` for documentation and rules. A
migrated element is a `feat`, since it adds public subpaths.

## Releases

Every tag deploys the docs site, Storybook at `/` and the demo page at `/demo`,
through `release-demo-page.yml`. That is an exception to *Releases and API
stability*, which deploys docs with the publish: while 5.x is released, the site
shows the migration as it lands, ahead of npm. Once v6 is live, the deploy
follows the npm publish, and this paragraph goes.

A publish is staged: `publish-npm.yml` uploads the release, and the version
goes live on npm only once a maintainer approves it on npmjs.com, behind their
second factor. A green run of it is not a published version.

## The migration, until v6

The React components in `src/components/` are the legacy implementation, being
replaced by Lit elements one per PR. They are frozen: never add one, and never
edit one, except for the line the PR that ships an element adds to its React
counterpart's JSDoc: `@deprecated`, naming the wrapper that replaces it and
6.0.0, the release that removes it.

- `/migrate-component` runs a migration. `docs/migration/tracker.md` holds each
  element's phase and status, `docs/migration/README.md` the playbook and the
  phase gates, and `docs/migration/translation-guide.md` each React pattern's
  Lit form.
- A migration PR's description adds to the element's API table: a React prop
  column, the behaviour differences from the React version, the visual check
  against the React section of `src/App.tsx`, the tracker row, and R12's
  checklist from `.claude/lit-migration.md`. A migration routinely exceeds 600
  lines: say so, and point reviewers at the API table.
- Phases 2, 3 and 8 may batch up to five leaf elements in one PR, one commit
  per element: the one exception to *Element sequencing*'s one element per PR.
- `.claude/reproduction-guide.md` rebuilds the v5 React library from a design
  file.

## Commands beyond the gates

```bash
pnpm dev              # Vite dev server: the legacy React demo, src/App.tsx
pnpm storybook        # Storybook on :6006
pnpm build:storybook  # Storybook → dist-site
pnpm build:demo       # the demo page → dist-site/demo
pnpm build:site       # both, as the docs deploy builds them
pnpm build:elements   # the Lit drop-in bundle, dist/hmi-elements.iife.js
pnpm build:wc         # the r2wc bundle, dist/hmi-components.iife.js
pnpm preview          # serve the production build
pnpm test:ssr         # the SSR tests alone, in Node
pnpm cem              # regenerate custom-elements.json and public/css/base.css
pnpm run docs         # TypeDoc → docs/api, the legacy React API
pnpm agentcfg <cmd>   # agentcfg at the pinned version: check, sync, why
```

`pnpm test` runs both Vitest projects: the browser one in Chromium through
Playwright, and the SSR one in Node. CI also fails when `custom-elements.json`
or `public/css/base.css` is stale, and `pnpm cem` regenerates both. Its
`agentcfg check` fails on a hand edit between the `agentcfg` markers, or on a
change to `.agentprofile.yml` without `pnpm agentcfg sync`, which rewrites the
composed files.

<!-- agentcfg:start -->
<!-- language/typescript/tooling.md · v1.2.0 -->
# Build and test commands

**Toolchain:** TypeScript on Node, with pnpm only — never `npm` or `yarn`, whose lockfiles and resolution differ. pnpm is pinned by `packageManager` in `package.json`, and Node by `.nvmrc`. Once per machine, install the Node `.nvmrc` names and run `corepack enable`, which then provides the pnpm `packageManager` names.

Commands live in the `package.json` scripts, which are the single source of
truth — do not copy the underlying tool invocations into docs or CI, call the
script.

```bash
pnpm install    # install from the lockfile
pnpm run ci     # every merge gate, in order — run this before every commit
pnpm lint       # gate 1 — format and lint, warnings as errors
pnpm typecheck  # gate 2 — tsc
pnpm test       # gate 3 — the test suite
pnpm build      # gate 4 — the build
pnpm format     # format in place
```

`ci` is called as `pnpm run ci`: `pnpm ci`, like `pnpm audit` and `pnpm docs`,
is pnpm's own command and never reaches the script. Biome and Vitest are the
defaults behind `lint`, `format` and `test`, with `lint` as
`biome check --error-on-warnings .` so a warning fails the gate. A repository
that needs another tool changes the script; the script names stay.

## Architecture & Workspace Rules

**Layout:** One package at the repository root, with its own `package.json`, `tsconfig.json` and `src/`. Once there are several, a pnpm workspace: `pnpm-workspace.yaml` lists `packages/*`, each package lives in `packages/<name>/`, and the root holds the shared tooling.

**Dependencies:** Added with `pnpm add`, recorded in the committed `pnpm-lock.yaml`, and installed in CI with `--frozen-lockfile`. What the shipped code imports goes in `dependencies`; tools only the build and tests use go in `devDependencies`.

**Node floor:** `engines.node` is the oldest Node the package supports, repeated as the `node-floor` input of the workflow that calls `node-ci.yml`, whose floor job fails a partial bump. Raising it means editing both together. Do not raise it incidentally. `.nvmrc` only pins development, and moves freely.

<!-- core/behavior.md · v1.2.0 -->
# Behavioral guidelines

**Maintain the Build:** Never leave the codebase in a state where build, lint,
or tests fail. Run the relevant commands in *Build and test commands* to verify
your work before concluding a task.

**Tradeoff:** Bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State your assumptions explicitly. If uncertain, stop and ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, propose it. Push back when warranted.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked. No abstractions for single-use code.
- No "flexibility" or error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Match existing style exactly.
- Remove imports/variables/functions that YOUR changes made unused. Don't remove pre-existing dead code unless asked.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

- Transform tasks into verifiable goals (e.g., "Add validation" → "Write tests for invalid inputs, then make them pass").
- For multi-step tasks, state a brief plan and verify each step independently.

<!-- agentcfg:index · v1.2.0 -->
# Extended rules

Read these when they apply; they are not loaded by default.

**By activity:**

- **Any change that ends in a PR:** [Git flow](.agents/git-flow.md) and [Releases and API stability](.agents/library-release.md)
- **Creating branches:** [Branch naming](.agents/branch-naming.md)
- **Reviewing PRs:** [Code review](.agents/code-review.md), [TypeScript code review](.agents/typescript-code-review.md) and [Element review](.agents/lit-code-review.md)
- **Committing code:** [Commit message guidelines](.agents/commit-conventions.md)
- **Deciding what to build next / branching strategy:** [Execution order](.agents/execution-order.md) and [Element sequencing](.agents/lit-execution-order.md)
- **Opening PRs:** [PR instructions](.agents/pr-guidelines.md), [Element API table](.agents/lit-pr-guidelines.md) and [Visual check](.agents/browser-ui-visual-check.md)
- **Creating new files:** [Directories and file naming](.agents/typescript-file-naming.md) and [Element files](.agents/lit-file-naming.md)
- **Checking your work:** [Merge gates](.agents/gates.md)
- **Adding or modifying a package:** [Adding a package](.agents/new-package.md)
- **Testing/Verifying:** [Testing instructions](.agents/typescript-testing.md) and [Element tests](.agents/lit-testing.md)
- **Adding or modifying an element:** [Adding an element](.agents/new-element.md)
- **Capturing what a page renders:** [Taking a screenshot](.agents/take-screenshot.md)

**By file:**

- [Element styles](.agents/lit-element-styles.md) — before touching `src/elements/**/*.styles.ts`
- [Elements](.agents/lit-elements.md) — before touching `src/elements/**`
- [Forms and overlays](.agents/lit-forms-and-overlays.md) — before touching `src/elements/**`
<!-- agentcfg:end -->
