import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import type { BrowserCommand } from 'vitest/node';

/* `renderOnServer(strings, values, modules)`, for the browser tests: renders
   the template `strings` and `values` would make with @lit-labs/ssr in Node,
   after importing the element modules it names (paths from the repository
   root), and returns the HTML a server would send. The values cross as JSON.
   `shared/hydration.test.ts` hydrates it in the browser. */
const renderOnServer: BrowserCommand<
    [strings: string[], values: unknown[], modules: string[]]
> = async ({ project }, strings, values, modules) => {
    const { render } = await import('@lit-labs/ssr');
    const { collectResult } = await import(
        '@lit-labs/ssr/lib/render-result.js'
    );
    const { html } = await import('lit');
    for (const module of modules) await project.import(`/${module}`);
    const template = Object.assign([...strings], { raw: [...strings] });
    return collectResult(render(html(template, ...values)));
};

/* Two projects:
   - browser: `*.test.ts` under src/elements and src/react run in real Chromium
     (Playwright).
   - ssr: `*.ssr.test.ts` run in Node against @lit-labs/ssr.
   `pnpm test` / `pnpm test:ssr` select one project each. */
export default defineConfig({
    test: {
        passWithNoTests: true,
        projects: [
            {
                // Pre-bundle what every browser test imports so Vite does not
                // discover them mid-run and reload the tests.
                optimizeDeps: {
                    include: [
                        'lit',
                        'lit/decorators.js',
                        'lit/directives/if-defined.js',
                        'lit/directives/live.js',
                        'lit/directives/repeat.js',
                        'lit/directives/style-map.js',
                        '@lit/react',
                        'react',
                        'react-dom',
                        'react-dom/client',
                        'react/jsx-dev-runtime',
                    ],
                },
                test: {
                    name: 'browser',
                    include: [
                        'src/elements/**/*.test.ts',
                        'src/react/**/*.test.ts',
                    ],
                    exclude: ['**/*.ssr.test.ts'],
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright(),
                        instances: [{ browser: 'chromium' }],
                        screenshotFailures: false,
                        commands: { renderOnServer },
                    },
                },
            },
            {
                test: {
                    name: 'ssr',
                    include: [
                        'src/elements/**/*.ssr.test.ts',
                        'src/react/**/*.ssr.test.ts',
                    ],
                    environment: 'node',
                },
            },
        ],
    },
});
