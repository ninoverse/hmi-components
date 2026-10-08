import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { copyCss } from './scripts/copy-css-plugin';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [
        react(),
        dts({
            tsconfigPath: './tsconfig.app.json',
            include: ['src'],
            exclude: [
                'src/App.tsx',
                'src/main.tsx',
                'src/**/*.stories.tsx',
                'src/**/*.stories.ts',
                'src/**/*.test.ts',
            ],
            entryRoot: 'src',
        }),
        copyCss(),
    ],
    resolve: {
        alias: {
            '@': resolve(dirname, 'src'),
        },
    },
    // Standard decorators with `accessor` (the Lit elements) must be lowered by
    // esbuild before Rollup parses the output: at the default `esnext` target
    // esbuild passes them through and Rollup rejects the syntax.
    esbuild: { target: 'es2022' },
    build: {
        copyPublicDir: false,
        lib: {
            entry: {
                index: resolve(dirname, 'src/index.ts'),
                // Lit elements (dist/wc/*) and their React wrappers (dist/react/*).
                // Element PRs add 'wc/<kebab>' and 'react/<kebab>' here.
                'wc/index': resolve(dirname, 'src/elements/index.ts'),
                'react/index': resolve(dirname, 'src/react/index.ts'),
                'wc/accordion': resolve(
                    dirname,
                    'src/elements/accordion/accordion.ts',
                ),
                'react/accordion': resolve(
                    dirname,
                    'src/elements/accordion/accordion.react.ts',
                ),
                'wc/alert': resolve(dirname, 'src/elements/alert/alert.ts'),
                'react/alert': resolve(
                    dirname,
                    'src/elements/alert/alert.react.ts',
                ),
                'wc/aspect-ratio': resolve(
                    dirname,
                    'src/elements/aspect-ratio/aspect-ratio.ts',
                ),
                'react/aspect-ratio': resolve(
                    dirname,
                    'src/elements/aspect-ratio/aspect-ratio.react.ts',
                ),
                'wc/avatar': resolve(dirname, 'src/elements/avatar/avatar.ts'),
                'react/avatar': resolve(
                    dirname,
                    'src/elements/avatar/avatar.react.ts',
                ),
                'wc/avatar-stack': resolve(
                    dirname,
                    'src/elements/avatar-stack/avatar-stack.ts',
                ),
                'react/avatar-stack': resolve(
                    dirname,
                    'src/elements/avatar-stack/avatar-stack.react.ts',
                ),
                'wc/badge': resolve(dirname, 'src/elements/badge/badge.ts'),
                'react/badge': resolve(
                    dirname,
                    'src/elements/badge/badge.react.ts',
                ),
                'wc/banner': resolve(dirname, 'src/elements/banner/banner.ts'),
                'react/banner': resolve(
                    dirname,
                    'src/elements/banner/banner.react.ts',
                ),
                'wc/blockquote': resolve(
                    dirname,
                    'src/elements/blockquote/blockquote.ts',
                ),
                'react/blockquote': resolve(
                    dirname,
                    'src/elements/blockquote/blockquote.react.ts',
                ),
                'wc/box': resolve(dirname, 'src/elements/box/box.ts'),
                'react/box': resolve(dirname, 'src/elements/box/box.react.ts'),
                'wc/breadcrumbs': resolve(
                    dirname,
                    'src/elements/breadcrumbs/breadcrumbs.ts',
                ),
                'react/breadcrumbs': resolve(
                    dirname,
                    'src/elements/breadcrumbs/breadcrumbs.react.ts',
                ),
                'wc/button': resolve(dirname, 'src/elements/button/button.ts'),
                'react/button': resolve(
                    dirname,
                    'src/elements/button/button.react.ts',
                ),
                'wc/card': resolve(dirname, 'src/elements/card/card.ts'),
                'react/card': resolve(
                    dirname,
                    'src/elements/card/card.react.ts',
                ),
                'wc/carousel': resolve(
                    dirname,
                    'src/elements/carousel/carousel.ts',
                ),
                'react/carousel': resolve(
                    dirname,
                    'src/elements/carousel/carousel.react.ts',
                ),
                'wc/checkbox': resolve(
                    dirname,
                    'src/elements/checkbox/checkbox.ts',
                ),
                'react/checkbox': resolve(
                    dirname,
                    'src/elements/checkbox/checkbox.react.ts',
                ),
                'wc/chip': resolve(dirname, 'src/elements/chip/chip.ts'),
                'react/chip': resolve(
                    dirname,
                    'src/elements/chip/chip.react.ts',
                ),
                'wc/code': resolve(dirname, 'src/elements/code/code.ts'),
                'react/code': resolve(
                    dirname,
                    'src/elements/code/code.react.ts',
                ),
                'wc/divider': resolve(
                    dirname,
                    'src/elements/divider/divider.ts',
                ),
                'react/divider': resolve(
                    dirname,
                    'src/elements/divider/divider.react.ts',
                ),
                'wc/empty-state': resolve(
                    dirname,
                    'src/elements/empty-state/empty-state.ts',
                ),
                'react/empty-state': resolve(
                    dirname,
                    'src/elements/empty-state/empty-state.react.ts',
                ),
                'wc/file-upload': resolve(
                    dirname,
                    'src/elements/file-upload/file-upload.ts',
                ),
                'react/file-upload': resolve(
                    dirname,
                    'src/elements/file-upload/file-upload.react.ts',
                ),
                'wc/flex': resolve(dirname, 'src/elements/flex/flex.ts'),
                'react/flex': resolve(
                    dirname,
                    'src/elements/flex/flex.react.ts',
                ),
                'wc/form-control': resolve(
                    dirname,
                    'src/elements/form-control/form-control.ts',
                ),
                'react/form-control': resolve(
                    dirname,
                    'src/elements/form-control/form-control.react.ts',
                ),
                'wc/grid': resolve(dirname, 'src/elements/grid/grid.ts'),
                'react/grid': resolve(
                    dirname,
                    'src/elements/grid/grid.react.ts',
                ),
                'wc/heading': resolve(
                    dirname,
                    'src/elements/heading/heading.ts',
                ),
                'react/heading': resolve(
                    dirname,
                    'src/elements/heading/heading.react.ts',
                ),
                'wc/image': resolve(dirname, 'src/elements/image/image.ts'),
                'react/image': resolve(
                    dirname,
                    'src/elements/image/image.react.ts',
                ),
                'wc/input': resolve(dirname, 'src/elements/input/input.ts'),
                'react/input': resolve(
                    dirname,
                    'src/elements/input/input.react.ts',
                ),
                'wc/kbd': resolve(dirname, 'src/elements/kbd/kbd.ts'),
                'react/kbd': resolve(dirname, 'src/elements/kbd/kbd.react.ts'),
                'wc/link': resolve(dirname, 'src/elements/link/link.ts'),
                'react/link': resolve(
                    dirname,
                    'src/elements/link/link.react.ts',
                ),
                'wc/list': resolve(dirname, 'src/elements/list/list.ts'),
                'react/list': resolve(
                    dirname,
                    'src/elements/list/list.react.ts',
                ),
                'wc/meter': resolve(dirname, 'src/elements/meter/meter.ts'),
                'react/meter': resolve(
                    dirname,
                    'src/elements/meter/meter.react.ts',
                ),
                'wc/multi-input': resolve(
                    dirname,
                    'src/elements/multi-input/multi-input.ts',
                ),
                'react/multi-input': resolve(
                    dirname,
                    'src/elements/multi-input/multi-input.react.ts',
                ),
                'wc/navbar': resolve(dirname, 'src/elements/navbar/navbar.ts'),
                'react/navbar': resolve(
                    dirname,
                    'src/elements/navbar/navbar.react.ts',
                ),
                'wc/number-input': resolve(
                    dirname,
                    'src/elements/number-input/number-input.ts',
                ),
                'react/number-input': resolve(
                    dirname,
                    'src/elements/number-input/number-input.react.ts',
                ),
                'wc/pagination': resolve(
                    dirname,
                    'src/elements/pagination/pagination.ts',
                ),
                'react/pagination': resolve(
                    dirname,
                    'src/elements/pagination/pagination.react.ts',
                ),
                'wc/password-input': resolve(
                    dirname,
                    'src/elements/password-input/password-input.ts',
                ),
                'react/password-input': resolve(
                    dirname,
                    'src/elements/password-input/password-input.react.ts',
                ),
                'wc/progress': resolve(
                    dirname,
                    'src/elements/progress/progress.ts',
                ),
                'react/progress': resolve(
                    dirname,
                    'src/elements/progress/progress.react.ts',
                ),
                'wc/radio': resolve(dirname, 'src/elements/radio/radio.ts'),
                'react/radio': resolve(
                    dirname,
                    'src/elements/radio/radio.react.ts',
                ),
                'wc/radio-group': resolve(
                    dirname,
                    'src/elements/radio-group/radio-group.ts',
                ),
                'react/radio-group': resolve(
                    dirname,
                    'src/elements/radio-group/radio-group.react.ts',
                ),
                'wc/scroll-area': resolve(
                    dirname,
                    'src/elements/scroll-area/scroll-area.ts',
                ),
                'react/scroll-area': resolve(
                    dirname,
                    'src/elements/scroll-area/scroll-area.react.ts',
                ),
                'wc/search-input': resolve(
                    dirname,
                    'src/elements/search-input/search-input.ts',
                ),
                'react/search-input': resolve(
                    dirname,
                    'src/elements/search-input/search-input.react.ts',
                ),
                'wc/segmented-control': resolve(
                    dirname,
                    'src/elements/segmented-control/segmented-control.ts',
                ),
                'react/segmented-control': resolve(
                    dirname,
                    'src/elements/segmented-control/segmented-control.react.ts',
                ),
                'wc/sidebar': resolve(
                    dirname,
                    'src/elements/sidebar/sidebar.ts',
                ),
                'react/sidebar': resolve(
                    dirname,
                    'src/elements/sidebar/sidebar.react.ts',
                ),
                'wc/skeleton': resolve(
                    dirname,
                    'src/elements/skeleton/skeleton.ts',
                ),
                'react/skeleton': resolve(
                    dirname,
                    'src/elements/skeleton/skeleton.react.ts',
                ),
                'wc/slider': resolve(dirname, 'src/elements/slider/slider.ts'),
                'react/slider': resolve(
                    dirname,
                    'src/elements/slider/slider.react.ts',
                ),
                'wc/spacer': resolve(dirname, 'src/elements/spacer/spacer.ts'),
                'react/spacer': resolve(
                    dirname,
                    'src/elements/spacer/spacer.react.ts',
                ),
                'wc/spinner': resolve(
                    dirname,
                    'src/elements/spinner/spinner.ts',
                ),
                'react/spinner': resolve(
                    dirname,
                    'src/elements/spinner/spinner.react.ts',
                ),
                'wc/stat': resolve(dirname, 'src/elements/stat/stat.ts'),
                'react/stat': resolve(
                    dirname,
                    'src/elements/stat/stat.react.ts',
                ),
                'wc/switch': resolve(dirname, 'src/elements/switch/switch.ts'),
                'react/switch': resolve(
                    dirname,
                    'src/elements/switch/switch.react.ts',
                ),
                'wc/text': resolve(dirname, 'src/elements/text/text.ts'),
                'react/text': resolve(
                    dirname,
                    'src/elements/text/text.react.ts',
                ),
                'wc/textarea': resolve(
                    dirname,
                    'src/elements/textarea/textarea.ts',
                ),
                'react/textarea': resolve(
                    dirname,
                    'src/elements/textarea/textarea.react.ts',
                ),
                'wc/timeline': resolve(
                    dirname,
                    'src/elements/timeline/timeline.ts',
                ),
                'react/timeline': resolve(
                    dirname,
                    'src/elements/timeline/timeline.react.ts',
                ),
                'wc/value-scale-selector': resolve(
                    dirname,
                    'src/elements/value-scale-selector/value-scale-selector.ts',
                ),
                'react/value-scale-selector': resolve(
                    dirname,
                    'src/elements/value-scale-selector/value-scale-selector.react.ts',
                ),
                'wc/visually-hidden': resolve(
                    dirname,
                    'src/elements/visually-hidden/visually-hidden.ts',
                ),
                'react/visually-hidden': resolve(
                    dirname,
                    'src/elements/visually-hidden/visually-hidden.react.ts',
                ),
                accordion: resolve(dirname, 'src/components/accordion.tsx'),
                alert: resolve(dirname, 'src/components/alert.tsx'),
                areaChart: resolve(dirname, 'src/components/areaChart.tsx'),
                aspectRatio: resolve(dirname, 'src/components/aspectRatio.tsx'),
                avatar: resolve(dirname, 'src/components/avatar.tsx'),
                avatarStack: resolve(dirname, 'src/components/avatarStack.tsx'),
                badge: resolve(dirname, 'src/components/badge.tsx'),
                banner: resolve(dirname, 'src/components/banner.tsx'),
                barChart: resolve(dirname, 'src/components/barChart.tsx'),
                blockquote: resolve(dirname, 'src/components/blockquote.tsx'),
                box: resolve(dirname, 'src/components/box.tsx'),
                breadcrumbs: resolve(dirname, 'src/components/breadcrumbs.tsx'),
                bulletChart: resolve(dirname, 'src/components/bulletChart.tsx'),
                button: resolve(dirname, 'src/components/button.tsx'),
                card: resolve(dirname, 'src/components/card.tsx'),
                carousel: resolve(dirname, 'src/components/carousel.tsx'),
                cartesianGrid: resolve(
                    dirname,
                    'src/components/cartesianGrid.tsx',
                ),
                chartTooltip: resolve(
                    dirname,
                    'src/components/chartTooltip.tsx',
                ),
                checkbox: resolve(dirname, 'src/components/checkbox.tsx'),
                chip: resolve(dirname, 'src/components/chip.tsx'),
                code: resolve(dirname, 'src/components/code.tsx'),
                colorPicker: resolve(dirname, 'src/components/colorPicker.tsx'),
                combobox: resolve(dirname, 'src/components/combobox.tsx'),
                commandPalette: resolve(
                    dirname,
                    'src/components/commandPalette.tsx',
                ),
                confirmDialog: resolve(
                    dirname,
                    'src/components/confirmDialog.tsx',
                ),
                contextMenu: resolve(dirname, 'src/components/contextMenu.tsx'),
                datePicker: resolve(dirname, 'src/components/datePicker.tsx'),
                divider: resolve(dirname, 'src/components/divider.tsx'),
                donutChart: resolve(dirname, 'src/components/donutChart.tsx'),
                drawer: resolve(dirname, 'src/components/drawer.tsx'),
                emptyState: resolve(dirname, 'src/components/emptyState.tsx'),
                fileUpload: resolve(dirname, 'src/components/fileUpload.tsx'),
                flex: resolve(dirname, 'src/components/flex.tsx'),
                formControl: resolve(dirname, 'src/components/formControl.tsx'),
                funnelChart: resolve(dirname, 'src/components/funnelChart.tsx'),
                gauge: resolve(dirname, 'src/components/gauge.tsx'),
                grid: resolve(dirname, 'src/components/grid.tsx'),
                heading: resolve(dirname, 'src/components/heading.tsx'),
                heatmap: resolve(dirname, 'src/components/heatmap.tsx'),
                hoverCard: resolve(dirname, 'src/components/hoverCard.tsx'),
                image: resolve(dirname, 'src/components/image.tsx'),
                input: resolve(dirname, 'src/components/input.tsx'),
                kbd: resolve(dirname, 'src/components/kbd.tsx'),
                legend: resolve(dirname, 'src/components/legend.tsx'),
                lineChart: resolve(dirname, 'src/components/lineChart.tsx'),
                link: resolve(dirname, 'src/components/link.tsx'),
                list: resolve(dirname, 'src/components/list.tsx'),
                menu: resolve(dirname, 'src/components/menu.tsx'),
                meter: resolve(dirname, 'src/components/meter.tsx'),
                modal: resolve(dirname, 'src/components/modal.tsx'),
                multiInput: resolve(dirname, 'src/components/multiInput.tsx'),
                navbar: resolve(dirname, 'src/components/navbar.tsx'),
                numberInput: resolve(dirname, 'src/components/numberInput.tsx'),
                pagination: resolve(dirname, 'src/components/pagination.tsx'),
                passwordInput: resolve(
                    dirname,
                    'src/components/passwordInput.tsx',
                ),
                popover: resolve(dirname, 'src/components/popover.tsx'),
                progress: resolve(dirname, 'src/components/progress.tsx'),
                radarChart: resolve(dirname, 'src/components/radarChart.tsx'),
                radio: resolve(dirname, 'src/components/radio.tsx'),
                radioGroup: resolve(dirname, 'src/components/radioGroup.tsx'),
                responsiveContainer: resolve(
                    dirname,
                    'src/components/responsiveContainer.tsx',
                ),
                scatterPlot: resolve(dirname, 'src/components/scatterPlot.tsx'),
                scrollArea: resolve(dirname, 'src/components/scrollArea.tsx'),
                searchInput: resolve(dirname, 'src/components/searchInput.tsx'),
                segmentedControl: resolve(
                    dirname,
                    'src/components/segmentedControl.tsx',
                ),
                select: resolve(dirname, 'src/components/select.tsx'),
                sidebar: resolve(dirname, 'src/components/sidebar.tsx'),
                skeleton: resolve(dirname, 'src/components/skeleton.tsx'),
                slider: resolve(dirname, 'src/components/slider.tsx'),
                spacer: resolve(dirname, 'src/components/spacer.tsx'),
                sparkline: resolve(dirname, 'src/components/sparkline.tsx'),
                spinner: resolve(dirname, 'src/components/spinner.tsx'),
                stat: resolve(dirname, 'src/components/stat.tsx'),
                stepper: resolve(dirname, 'src/components/stepper.tsx'),
                switch: resolve(dirname, 'src/components/switch.tsx'),
                table: resolve(dirname, 'src/components/table.tsx'),
                tabs: resolve(dirname, 'src/components/tabs.tsx'),
                text: resolve(dirname, 'src/components/text.tsx'),
                textarea: resolve(dirname, 'src/components/textarea.tsx'),
                theme: resolve(dirname, 'src/theme.tsx'),
                timeline: resolve(dirname, 'src/components/timeline.tsx'),
                toast: resolve(dirname, 'src/components/toast.tsx'),
                tooltip: resolve(dirname, 'src/components/tooltip.tsx'),
                tree: resolve(dirname, 'src/components/tree.tsx'),
                valueScaleSelector: resolve(
                    dirname,
                    'src/components/valueScaleSelector.tsx',
                ),
                visuallyHidden: resolve(
                    dirname,
                    'src/components/visuallyHidden.tsx',
                ),
            },
            formats: ['es'],
            cssFileName: 'style',
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                /^lit(\/|$)/,
                /^@lit\//,
                /^@lit-labs\//,
            ],
            output: {
                preserveModules: false,
                entryFileNames: '[name].js',
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.names?.[0] ?? '';
                    return name.endsWith('.css')
                        ? '[name][extname]'
                        : 'assets/[name]-[hash][extname]';
                },
            },
        },
        sourcemap: true,
        minify: 'esbuild',
        cssCodeSplit: false,
    },
});
