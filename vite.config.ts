import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [
        react(),
        dts({
            tsconfigPath: './tsconfig.app.json',
            include: ['src'],
            exclude: ['src/App.tsx', 'src/main.tsx'],
            entryRoot: 'src',
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(dirname, 'src'),
        },
    },
    build: {
        copyPublicDir: false,
        lib: {
            entry: {
                index: resolve(dirname, 'src/index.ts'),
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
            external: ['react', 'react-dom', 'react/jsx-runtime'],
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
