---
name: verify-component
description: Format, lint, build, and screenshot a newly scaffolded HMI component. Phase 3 of the component workflow; run after wire-component and before ship-component.
---

# Verify Component

Validates a freshly wired component by running the full quality pipeline and
capturing a screenshot. This is **phase 3 of 4** — run `ship-component` next.

## Inputs

- **Component name** (required): used to locate the dist artifacts and target
  the screenshot. Ask if not provided.

## Verification sequence

Fix any failure before moving to the next command — never proceed with a
broken build.

```bash
pnpm format   # Biome auto-format; apply any changes
pnpm lint     # Must exit with zero warnings AND zero errors
pnpm build    # Production build must pass
```

After the build, confirm the dist artifacts exist:

```bash
ls dist/<name>.js dist/components/<name>.d.ts
```

Also confirm that `src/index.ts`, `vite.config.ts`, and `package.json`
`"exports"` are all **alphabetically sorted and mutually consistent** — every
new entry must appear in all three.

## Screenshot

`/tmp` is wiped on container reset — install once per session:

```bash
mkdir -p /tmp/shot && cd /tmp/shot && npm init -y && npm i @sparticuz/chromium puppeteer-core
```

Start the dev server in the background, then run the driver below:

```js
const chromium = require('@sparticuz/chromium').default;
const puppeteer = require('puppeteer-core');
(async () => {
    const browser = await puppeteer.launch({
        args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
        executablePath: await chromium.executablePath(),
        headless: true,
        defaultViewport: { width: 1000, height: 700, deviceScaleFactor: 2 },
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    // scroll the component's section into view and screenshot just that element
    const h = await page.evaluateHandle(() =>
        [...document.querySelectorAll('h2')]
            .find((e) => e.textContent.trim() === '<ComponentName>')?.closest('section'));
    await h.asElement().screenshot({ path: '/tmp/shot/out.png' });
    await browser.close();
})();
```

Check the dev server's actual port from its output — it may not be 5173.
Shut down the server cleanly: `kill "$(pgrep -f vite | head -1)"`.

Present the screenshot to the user and wait for their approval before
proceeding to `ship-component`.

## Done

Once lint/build pass and the user approves the screenshot, tell them
verification is complete and prompt them to run `ship-component`.
