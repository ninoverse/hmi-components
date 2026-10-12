import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../legend/legend.js';
import './bar-chart.js';
import type { BarChartSeries, HmiBarChart } from './bar-chart.js';

type Args = Pick<
    HmiBarChart,
    | 'series'
    | 'labels'
    | 'width'
    | 'height'
    | 'min'
    | 'max'
    | 'yTicks'
    | 'label'
>;

const SERIES: BarChartSeries[] = [
    { name: 'Product A', data: [42, 55, 48, 63], color: 'var(--primary)' },
    { name: 'Product B', data: [30, 38, 44, 40], color: 'var(--tertiary)' },
];

const meta = {
    title: 'Charts/BarChart',
    component: 'hmi-bar-chart',
    tags: ['autodocs'],
    args: {
        series: SERIES,
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        width: 560,
        height: 280,
        min: undefined,
        max: undefined,
        yTicks: 4,
        label: 'Quarterly units by product',
    },
    argTypes: {
        series: { control: 'object' },
        labels: { control: 'object' },
        width: { control: 'number' },
        height: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        yTicks: { control: 'number' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-bar-chart
            .series=${args.series}
            .labels=${args.labels}
            width=${args.width}
            height=${args.height}
            .min=${args.min}
            .max=${args.max}
            y-ticks=${args.yTicks}
            label=${args.label}
        ></hmi-bar-chart>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { BarChart } from \'@ninoverse/hmi-components/react/bar-chart\'` — `<BarChart label="Quarterly units" labels={labels} series={series} />`. `series` and `labels` are properties. The size is `width` and `height` in px: to fit a container, pass the size from `hmi-responsive-container`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const SingleSeries: Story = {
    args: { series: [SERIES[0] as BarChartSeries] },
};

/** A negative value hangs below the zero line. */
export const WithNegatives: Story = {
    args: {
        series: [
            {
                name: 'Change',
                data: [12, -8, 20, -15],
                color: 'var(--primary)',
            },
        ],
        min: -20,
        max: 20,
    },
};

/** A chart usually comes with a legend. */
export const WithLegend: Story = {
    render: (args) =>
        html`<div>
            <hmi-bar-chart
                .series=${args.series}
                .labels=${args.labels}
                width=${args.width}
                height=${args.height}
                label=${args.label}
            ></hmi-bar-chart>
            <hmi-legend
                align="start"
                .items=${[
                    { label: 'Product A', color: 'var(--primary)' },
                    { label: 'Product B', color: 'var(--tertiary)' },
                ]}
            ></hmi-legend>
        </div>`,
};
