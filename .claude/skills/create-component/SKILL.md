---
name: create-component
description: Scaffold and ship one new component for the ninoverse-hmi-components library end to end — create the .tsx + styled CSS, wire it into index.ts / vite.config.ts / package.json / App.tsx alphabetically, verify with lint + build + screenshot, then commit and open a draft PR. Use when the user asks to "create / add / build a component" (e.g. "add a Rating component", "/create-component badge").
---

# Create Component

Builds a single component following the project's exact conventions. This skill
encodes `.claude/component-workflow.md`, `.claude/file-naming.md`, and the
styling rules in `CLAUDE.md`. Follow every step in order — never commit a
partial component, never batch two components in one commit.

## Inputs

- **Component name** (required): the PascalCase name (e.g. `Rating`) or the
  camelCase file stem (e.g. `rating`). Derive both forms plus the kebab-case
  export key (`rating` → `./rating`; `radarChart` → `./radar-chart`).
- If no name was given, ask for it before doing anything else.

## Pre-flight

1. **Confirm scope.** State which component you're about to build. If the user
   invoked the skill with a name, that is the confirmation — proceed.
2. **Check for collisions:**
   ```bash
   ls src/components/<name>.tsx 2>/dev/null && echo EXISTS || echo MISSING
   ```
   If it EXISTS, stop and ask: skip / overwrite / modify. Never silently overwrite.
3. **Branch off `main`** (unless told to use a specific branch):
   ```bash
   git fetch origin main --quiet
   git checkout -b feat/<kebab-name> origin/main
   ```
   Single isolated component → one `feat/<name>` branch, one PR (see
   `.claude/execution-order.md`).

## 9-step checklist (one component, one commit)

1. **`src/components/<name>.tsx`** — camelCase filename; named PascalCase export;
   props type in the same file (move to `src/models/<name>.model.ts` only if
   shared); **first import is the side-effect CSS** `import './styled/<name>.styled.css';`.
   Tokens only (`var(--token)`) — no hardcoded colors, radii, or shadows. `rem`
   units (`1rem = 8px`). Zero runtime deps — hand-roll, only `react`/`react-dom`.
2. **`src/components/styled/<name>.styled.css`** — BEM classes scoped to the
   component (`.<name>`, `.<name>__part`, `.<name>--modifier`). MD3 short-name
   tokens only: colors `var(--primary)`…, shape `var(--corner-tl|tr|br|bl)`,
   elevation `var(--elevation-N)`, fonts `var(--font-oxanium)` etc.
   Note: SVG presentation attributes can't resolve CSS custom properties — put
   grid/structural stroke colors in CSS classes; pass consumer colors inline.
3. **`src/index.ts`** — add the named re-export. Keep **alphabetical** (sort by
   export name).
4. **`vite.config.ts`** — add `<name>: resolve(dirname, 'src/components/<name>.tsx'),`
   to `build.lib.entry`. Keep **alphabetical**.
5. **`package.json`** `"exports"` — add the kebab subpath. Keep **alphabetical**:
   ```json
   "./<kebab-name>": {
       "types": "./dist/components/<name>.d.ts",
       "import": "./dist/<name>.js"
   }
   ```
6. **`src/App.tsx`** — import from `'./components/<name>'` (match the existing
   convention in this file, not `'./index'`) and add a demo `<section>` matching
   the surrounding markup. Render at least one variant per meaningful prop so
   type errors / missing CSS / render failures surface.
7. **Verify** — run, in order, fixing any failure before moving on:
   ```bash
   pnpm format   # biome auto-format
   pnpm lint     # must be zero warnings AND zero errors
   pnpm build    # must pass; then confirm dist artifacts:
   ls dist/<name>.js dist/components/<name>.d.ts
   ```
   Then screenshot (see below) and present it to the user for review before
   committing. Confirm `index.ts` / `vite.config.ts` / `package.json` /`App.tsx`
   are alphabetically consistent with each other.
8. **Commit** — exactly:
   ```
   feat(ui): add <ComponentName> component
   ```
   One commit per component.
9. **Push + draft PR** —
   ```bash
   git push -u origin feat/<kebab-name>
   ```
   Open a **draft** PR (base `main`) via the GitHub MCP tools. Then **stop** and
   wait for the user.

## Screenshot method

`/tmp` is wiped on container reset — install once per session:
```bash
mkdir -p /tmp/shot && cd /tmp/shot && npm init -y && npm i @sparticuz/chromium puppeteer-core
```
Driver (note `.default` on the chromium import):
```js
const chromium = require('@sparticuz/chromium').default;
const puppeteer = require('puppeteer-core');
(async () => {
    const browser = await puppeteer.launch({
        args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
        executablePath: await chromium.executablePath(), headless: true,
        defaultViewport: { width: 1000, height: 700, deviceScaleFactor: 2 },
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    // scroll the component's section into view, then element-screenshot it
    const h = await page.evaluateHandle(() =>
        [...document.querySelectorAll('h2')]
            .find((e) => e.textContent.trim() === '<ComponentName>')?.closest('section'));
    await h.asElement().screenshot({ path: '/tmp/shot/out.png' });
    await browser.close();
})();
```
Check the dev server's actual port from its output (it may not be 5173). Use
`pkill`-free shutdown: `kill "$(pgrep -f vite | head -1)"` on its own line.

## Guardrails

- pnpm only — never npm/yarn for project commands.
- Don't leave lint/build failing in a commit — verify (step 7) before step 8.
- Surgical changes: touch only the five files above plus the two you create.
- If the component is a chart, reuse existing primitives (`CartesianGrid`,
  `polar()` pattern, shared `PALETTE`) rather than re-deriving them.
