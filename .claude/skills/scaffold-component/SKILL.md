---
name: scaffold-component
description: Pre-flight checks and file creation for a new HMI component — collision check, branch setup, create the .tsx + styled CSS. First phase of the component workflow; run before wire-component.
---

# Scaffold Component

Creates the two source files for a new component: the `.tsx` and its
`.styled.css`. Performs pre-flight checks first. This is **phase 1 of 4** in
the component workflow — run `wire-component` next.

## Inputs

- **Component name** (required): PascalCase (e.g. `Rating`) or camelCase stem
  (e.g. `rating`). Derive all three forms:
  - camelCase filename: `rating`
  - PascalCase export: `Rating`
  - kebab-case subpath: `rating` → `./rating`; `radarChart` → `./radar-chart`
- If no name was given, ask before doing anything else.

## Pre-flight

1. **Confirm scope.** State which component you're about to scaffold. If the
   skill was invoked with a name, that is the confirmation — proceed.

2. **Collision check:**
   ```bash
   ls src/components/<name>.tsx 2>/dev/null && echo EXISTS || echo MISSING
   ```
   If EXISTS → stop and ask: skip / overwrite / modify. Never silently overwrite.

3. **Branch setup** (unless the caller specifies a branch):
   ```bash
   git fetch origin main --quiet
   git checkout -b feat/<kebab-name> origin/main
   ```
   One component → one `feat/<kebab-name>` branch → one PR.

## Step 1 — `src/components/<name>.tsx`

- Filename: camelCase `.tsx`.
- Named export, PascalCase function component.
- Props type defined in the same file; move to `src/models/<name>.model.ts`
  only if shared by multiple components.
- **First import** must be the side-effect CSS:
  ```tsx
  import './styled/<name>.styled.css';
  ```
- All values via tokens: `var(--token)` only — no hardcoded colors, radii, or
  shadows.
- Sizing in `rem` (`1rem = 8px`).
- Zero runtime deps beyond `react` / `react-dom`. Hand-roll everything else.
- If this is a chart component, reuse existing primitives (`CartesianGrid`,
  `polar()` pattern, shared `PALETTE`) rather than re-deriving them.

## Step 2 — `src/components/styled/<name>.styled.css`

- Class names: BEM, scoped to the component:
  `.<name>`, `.<name>__part`, `.<name>--modifier`.
- MD3 short-name tokens only:
  - Colors: `var(--primary)`, `var(--surface-variant)`, …
  - Shape: `var(--corner-tl)`, `var(--corner-tr)`, `var(--corner-br)`, `var(--corner-bl)`
  - Elevation: `var(--elevation-N)`
  - Fonts: `var(--font-oxanium)`, `var(--font-quicksand)`, etc.
- SVG presentation attributes cannot resolve CSS custom properties — put
  grid/structural stroke colors in CSS classes; pass consumer colors inline.

## Done

After both files exist and look correct, tell the user scaffold is complete and
prompt them to run `wire-component` to register the component in the project.
