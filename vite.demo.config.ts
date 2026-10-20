import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const dirname = fileURLToPath(new URL('.', import.meta.url));
const outDir = resolve(dirname, 'dist-site/demo');

/* The all-elements page is examples/elements.html, which loads the drop-in
   bundle from ../dist/. It is copied to /demo/all/ with the bundle and the
   CSS beside it, so `pnpm build:elements` must run first (build:demo does). */
function allElementsPage(): Plugin {
    return {
        name: 'all-elements-page',
        apply: 'build',
        closeBundle() {
            const target = resolve(outDir, 'all');
            mkdirSync(target, { recursive: true });
            const page = readFileSync(
                resolve(dirname, 'examples/elements.html'),
                'utf8',
            );
            writeFileSync(
                resolve(target, 'index.html'),
                page.replaceAll('../dist/', './'),
            );
            cpSync(
                resolve(dirname, 'dist/hmi-elements.iife.js'),
                resolve(target, 'hmi-elements.iife.js'),
            );
            cpSync(
                resolve(dirname, 'public/css/themes'),
                resolve(target, 'themes'),
                { recursive: true },
            );
            cpSync(
                resolve(dirname, 'public/css/base.css'),
                resolve(target, 'base.css'),
            );
        },
    };
}

/* The demo pages under /demo/ on the docs site, Storybook being at /. Each
   page is an entry and imports only the elements it uses, from source. */
export default defineConfig({
    root: resolve(dirname, 'demo'),
    base: '/demo/',
    publicDir: false,
    // Standard decorators with `accessor` (the Lit elements) must be lowered by
    // esbuild before Rollup parses the output.
    esbuild: { target: 'es2022' },
    plugins: [allElementsPage()],
    build: {
        outDir,
        emptyOutDir: true,
        target: 'es2022',
        rollupOptions: {
            input: {
                index: resolve(dirname, 'demo/index.html'),
                dashboard: resolve(dirname, 'demo/dashboard/index.html'),
            },
        },
    },
});
