import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../legend/legend.js';
import './scatter-plot.js';
import type { HmiScatterPlot, ScatterPlotSeries } from './scatter-plot.js';

type Args = Pick<
    HmiScatterPlot,
    | 'series'
    | 'width'
    | 'height'
    | 'xMin'
    | 'xMax'
    | 'yMin'
    | 'yMax'
    | 'xTicks'
    | 'yTicks'
    | 'radius'
    | 'label'
>;

const SERIES: ScatterPlotSeries[] = [
    {
        name: 'Group A',
        color: 'var(--primary)',
        data: [
            { x: 12, y: 22 },
            { x: 20, y: 35 },
            { x: 28, y: 30 },
            { x: 35, y: 48 },
            { x: 42, y: 44 },
            { x: 50, y: 60 },
        ],
    },
    {
        name: 'Group B',
        color: 'var(--tertiary)',
        data: [
            { x: 15, y: 12 },
            { x: 24, y: 18 },
            { x: 30, y: 16 },
            { x: 38, y: 26 },
            { x: 46, y: 22 },
            { x: 55, y: 33 },
        ],
    },
];

const meta = {
    title: 'Charts/ScatterPlot',
    component: 'hmi-scatter-plot',
    tags: ['autodocs'],
    args: {
        series: SERIES,
        width: 560,
        height: 280,
        xMin: undefined,
        xMax: undefined,
        yMin: undefined,
        yMax: undefined,
        xTicks: 5,
        yTicks: 4,
        radius: 4,
        label: 'Height versus weight by group',
    },
    argTypes: {
        series: { control: 'object' },
        width: { control: 'number' },
        height: { control: 'number' },
        xMin: { control: 'number' },
        xMax: { control: 'number' },
        yMin: { control: 'number' },
        yMax: { control: 'number' },
        xTicks: { control: 'number' },
        yTicks: { control: 'number' },
        radius: { control: 'number' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-scatter-plot
            .series=${args.series}
            width=${args.width}
            height=${args.height}
            .xMin=${args.xMin}
            .xMax=${args.xMax}
            .yMin=${args.yMin}
            .yMax=${args.yMax}
            x-ticks=${args.xTicks}
            y-ticks=${args.yTicks}
            radius=${args.radius}
            label=${args.label}
        ></hmi-scatter-plot>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { ScatterPlot } from \'@ninoverse/hmi-components/react/scatter-plot\'` — `<ScatterPlot label="Height versus weight" series={series} />`. `series` is a property. The size is `width` and `height` in px: to fit a container, pass the size from `hmi-responsive-container`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const SingleSeries: Story = {
    args: { series: [SERIES[0] as ScatterPlotSeries] },
};

/** The `x-min`, `x-max`, `y-min` and `y-max` ends fix the ranges. */
export const FixedRanges: Story = {
    args: { xMin: 0, xMax: 100, yMin: 0, yMax: 100, radius: 6 },
};

/** A chart usually comes with a legend. */
export const WithLegend: Story = {
    render: (args) =>
        html`<div>
            <hmi-scatter-plot
                .series=${args.series}
                width=${args.width}
                height=${args.height}
                label=${args.label}
            ></hmi-scatter-plot>
            <hmi-legend
                align="start"
                .items=${[
                    { label: 'Group A', color: 'var(--primary)' },
                    { label: 'Group B', color: 'var(--tertiary)' },
                ]}
            ></hmi-legend>
        </div>`,
};
