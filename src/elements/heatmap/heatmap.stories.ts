import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './heatmap.js';
import type { HmiHeatmap } from './heatmap.js';

type Args = Pick<
    HmiHeatmap,
    | 'data'
    | 'xLabels'
    | 'yLabels'
    | 'color'
    | 'min'
    | 'max'
    | 'cellSize'
    | 'gap'
    | 'showValues'
    | 'label'
>;

const meta = {
    title: 'Charts/Heatmap',
    component: 'hmi-heatmap',
    tags: ['autodocs'],
    args: {
        data: [
            [4, 8, 6, 12, 9],
            [14, 18, 22, 20, 16],
            [7, 11, 9, 15, 24],
        ],
        xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        yLabels: ['Morning', 'Midday', 'Evening'],
        color: 'var(--primary)',
        min: undefined,
        max: undefined,
        cellSize: 40,
        gap: 4,
        showValues: true,
        label: 'Weekly activity by hour',
    },
    argTypes: {
        data: { control: 'object' },
        xLabels: { control: 'object' },
        yLabels: { control: 'object' },
        color: { control: 'text' },
        min: { control: 'number' },
        max: { control: 'number' },
        cellSize: { control: 'number' },
        gap: { control: 'number' },
        showValues: { control: 'boolean' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-heatmap
            .data=${args.data}
            .xLabels=${args.xLabels}
            .yLabels=${args.yLabels}
            color=${args.color}
            .min=${args.min}
            .max=${args.max}
            cell-size=${args.cellSize}
            gap=${args.gap}
            ?show-values=${args.showValues}
            label=${args.label}
        ></hmi-heatmap>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Heatmap } from \'@ninoverse/hmi-components/react/heatmap\'` — `<Heatmap label="Weekly activity" showValues data={data} xLabels={xLabels} yLabels={yLabels} />`. `data`, `xLabels` and `yLabels` are properties.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Without labels, the chart is just the cells. */
export const NoLabels: Story = {
    args: { xLabels: [], yLabels: [], showValues: false },
};

/** Another colour, and a fixed scale: the opacity does not depend on the data's extent. */
export const FixedScale: Story = {
    args: { color: 'var(--tertiary)', min: 0, max: 50, cellSize: 48, gap: 6 },
};
