/* @custom-elements-manifest/analyzer — `pnpm cem`. Reads the element classes
   only; styles, wrappers, stories, tests and the shared helpers carry no
   custom element declarations. Output: ./custom-elements.json (committed). */
export default {
    globs: ['src/elements/**/*.ts'],
    exclude: [
        '**/*.styles.ts',
        '**/*.react.ts',
        '**/*.stories.ts',
        '**/*.test.ts',
        'src/elements/shared/**',
        'src/elements/index.ts',
    ],
    outdir: '.',
    litelement: true,
    packagejson: false,
    plugins: [
        {
            /* The analyzer emits modules in filesystem enumeration order, which
               differs between machines, so the committed manifest reordered
               itself on CI and failed `git diff --exit-code`. Sort by path with
               a plain codepoint comparison — not localeCompare, whose result
               depends on the environment's ICU data. */
            name: 'sort-modules-by-path',
            packageLinkPhase({ customElementsManifest }) {
                customElementsManifest.modules.sort((a, b) =>
                    a.path < b.path ? -1 : a.path > b.path ? 1 : 0,
                );
            },
        },
    ],
};
