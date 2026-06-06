---
name: wire-component
description: Wire an already-scaffolded HMI component into the project's index.ts, vite.config.ts, package.json exports, and App.tsx — alphabetically. Phase 2 of the component workflow; run after scaffold-component and before verify-component.
---

# Wire Component

Registers a scaffolded component in the four project-level files so it is
exported, bundled, and demonstrated. This is **phase 2 of 4** — run
`verify-component` next.

## Inputs

- **Component name** (required): camelCase stem or PascalCase. Derive:
  - camelCase: `rating`
  - PascalCase: `Rating`
  - kebab-case subpath key: `./rating` or `./radar-chart`
- Assumes `src/components/<name>.tsx` already exists (run `scaffold-component`
  first).

## Step 3 — `src/index.ts`

Add the named re-export. Keep the file **alphabetically sorted** by export
name:

```ts
export { Rating } from './components/rating';
```

## Step 4 — `vite.config.ts`

Add the component to the `build.lib.entry` map. Keep entries **alphabetically
sorted** by key:

```ts
rating: resolve(dirname, 'src/components/rating.tsx'),
```

## Step 5 — `package.json` → `"exports"`

Add a kebab-case subpath entry. Keep entries **alphabetically sorted**:

```json
"./rating": {
    "types": "./dist/components/rating.d.ts",
    "import": "./dist/rating.js"
}
```

## Step 6 — `src/App.tsx`

- Import from `'./components/<name>'` (match the convention already used in
  this file, **not** `'./index'`).
- Add a `<section>` with an `<h2>` matching the component name, following the
  surrounding markup style.
- Render **at least one variant per meaningful prop** so type errors, missing
  CSS, and render failures surface immediately.

## Done

After all four files are updated, tell the user wiring is complete and prompt
them to run `verify-component` to lint, build, and screenshot the result.
