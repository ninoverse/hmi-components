---
name: create-component
description: Scaffold and ship one new component for the ninoverse-hmi-components library end to end — create the .tsx + styled CSS, wire it into index.ts / vite.config.ts / package.json / App.tsx alphabetically, verify with lint + build + screenshot, then commit and open a draft PR. Use when the user asks to "create / add / build a component" (e.g. "add a Rating component", "/create-component badge").
---

# Create Component

End-to-end orchestrator for adding a single new component. Runs the four
focused sub-skills in sequence. Each sub-skill can also be invoked
independently when only one phase needs to run.

## Inputs

- **Component name** (required): PascalCase (e.g. `Rating`) or camelCase stem
  (e.g. `rating`). Ask if not provided.

## Execution order

Run each phase fully before starting the next. Never commit a partial
component. Never batch two components in one run.

| Phase | Skill | What it does |
|-------|-------|--------------|
| 1 | `scaffold-component` | Pre-flight, collision check, branch setup, create `.tsx` + `.styled.css` |
| 2 | `wire-component` | Register in `index.ts`, `vite.config.ts`, `package.json`, `App.tsx` (all alphabetical) |
| 3 | `verify-component` | `pnpm format` → `pnpm lint` → `pnpm build` → screenshot → user approval |
| 4 | `ship-component` | `git commit` + `git push` + open draft PR → stop |

## Rules

- `pnpm` only — never `npm` or `yarn` for project commands.
- Do not proceed past phase 3 until the user has approved the screenshot.
- After the draft PR is open, **stop** and wait for the user.
