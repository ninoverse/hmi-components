import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/web-components-vite';

const dirname = fileURLToPath(new URL('.', import.meta.url));

/* Documents the Lit elements (src/elements/**). The legacy React stories in
   src/components/ are not built: Storybook runs one framework per config,
   and the React tree is frozen until it is deleted at the v6 flip. The demo
   pages, demo/, deploy at /demo/. */
const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/elements/**/*.stories.ts'],
    addons: ['@storybook/addon-docs'],
    framework: {
        name: '@storybook/web-components-vite',
        options: {},
    },
    staticDirs: [resolve(dirname, '../public')],
    // The root vite.config.ts is the library build (React plugin, dts emit,
    // 88 lib entries). Storybook merges it by default, so drop the parts that
    // don't belong here.
    viteFinal: async (viteConfig) => ({
        ...viteConfig,
        plugins: (viteConfig.plugins ?? []).filter(
            (plugin) =>
                !(
                    plugin &&
                    typeof plugin === 'object' &&
                    'name' in plugin &&
                    (plugin.name === 'vite:dts' ||
                        plugin.name === 'copy-css' ||
                        String(plugin.name).startsWith('vite:react'))
                ),
        ),
    }),
};

export default config;
