/* Bundles each `./wc/<name>` subpath on its own, as a consumer's bundler would,
   and checks in Chromium that `hmi-<name>` is defined once the bundle runs.
   A bare `import '@ninoverse/hmi-components/wc/<name>'` keeps only what
   `sideEffects` in package.json marks, so a module it misses is tree-shaken
   away and the element never registers. Run after `pnpm build`. */
import { mkdir, mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { build } from 'vite';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));

// The theme module defines no element, and the barrel defines them all.
const names = Object.keys(pkg.exports)
    .filter((key) => key.startsWith('./wc/') && key !== './wc/theme')
    .map((key) => key.slice('./wc/'.length));

// A consumer's project, with the package installed in node_modules by symlink,
// so the bundler reads the package's own package.json, sideEffects included.
const app = await mkdtemp(join(tmpdir(), 'hmi-subpaths-'));
await mkdir(join(app, 'node_modules', '@ninoverse'), { recursive: true });
await symlink(root, join(app, 'node_modules', pkg.name), 'dir');

async function bundle(name) {
    const entry = '\0entry';
    const output = await build({
        root: app,
        configFile: false,
        logLevel: 'silent',
        plugins: [
            {
                name: 'entry',
                resolveId: (id) => (id === entry ? id : null),
                load: (id) =>
                    id === entry ? `import '${pkg.name}/wc/${name}';` : null,
            },
        ],
        build: {
            write: false,
            minify: false,
            rollupOptions: {
                input: entry,
                output: { inlineDynamicImports: true },
            },
        },
    });
    const [result] = Array.isArray(output) ? output : [output];
    return result.output.find((file) => file.type === 'chunk').code;
}

const browser = await chromium.launch();
const failures = [];
try {
    for (const name of names) {
        const code = await bundle(name);
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.setContent('<!doctype html><html><body></body></html>');
        await page.addScriptTag({ type: 'module', content: code });
        const defined = await page.evaluate(
            (tag) => customElements.get(tag) !== undefined,
            `hmi-${name}`,
        );
        await page.close();
        if (!defined || errors.length > 0) {
            failures.push(name);
            console.error(
                `✗ ./wc/${name}: hmi-${name} ${defined ? 'defined' : 'not defined'}` +
                    ` (${code.length} bytes)${errors.length ? `, ${errors.join('; ')}` : ''}`,
            );
        }
    }
} finally {
    await browser.close();
    await rm(app, { recursive: true, force: true });
}

if (failures.length > 0) {
    console.error(
        `${failures.length} of ${names.length} subpaths register nothing on their own.`,
    );
    process.exit(1);
}
console.log(
    `All ${names.length} ./wc subpaths register their element on their own.`,
);
