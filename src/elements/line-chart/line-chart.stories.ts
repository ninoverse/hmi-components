import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../legend/legend.js';
import './line-chart.js';
import type { HmiLineChart, LineChartSeries } from './line-chart.js';

type Args = Pick<
    HmiLineChart,
    | 'series'
    | 'labels'
    | 'width'
    | 'height'
    | 'min'
    | 'max'
    | 'yTicks'
    | 'showDots'
    | 'label'
>;

const SERIES: LineChartSeries[] = [
    {
        name: 'Revenue',
        data: [32, 40, 38, 50, 47, 60],
        color: 'var(--primary)',
    },
    { name: 'Costs', data: [28, 30, 33, 31, 36, 38], color: 'var(--tertiary)' },
];

const meta = {
    title: 'Charts/LineChart',
    component: 'hmi-line-chart',
    tags: ['autodocs'],
    args: {
        series: SERIES,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        width: 560,
        height: 280,
        min: undefined,
        max: undefined,
        yTicks: 4,
        showDots: false,
        label: 'Monthly revenue and costs',
    },
    argTypes: {
        series: { control: 'object' },
        labels: { control: 'object' },
        width: { control: 'number' },
        height: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        yTicks: { control: 'number' },
        showDots: { control: 'boolean' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-line-chart
            .series=${args.series}
            .labels=${args.labels}
            width=${args.width}
            height=${args.height}
            .min=${args.min}
            .max=${args.max}
            y-ticks=${args.yTicks}
            ?show-dots=${args.showDots}
            label=${args.label}
        ></hmi-line-chart>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { LineChart } from \'@ninoverse/hmi-components/react/line-chart\'` — `<LineChart label="Monthly revenue" labels={labels} series={series} showDots />`. `series` and `labels` are properties. The size is `width` and `height` in px: to fit a container, pass the size from `hmi-responsive-container`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithDots: Story = { args: { showDots: true } };

/** `min` and `max` fix the value range. */
export const FixedRange: Story = { args: { min: 0, max: 100, yTicks: 5 } };

/** A chart usually comes with a legend. */
export const WithLegend: Story = {
    render: (args) =>
        html`<div>
            <hmi-line-chart
                .series=${args.series}
                .labels=${args.labels}
                width=${args.width}
                height=${args.height}
                label=${args.label}
            ></hmi-line-chart>
            <hmi-legend
                align="start"
                .items=${[
                    { label: 'Revenue', color: 'var(--primary)' },
                    { label: 'Costs', color: 'var(--tertiary)' },
                ]}
            ></hmi-legend>
        </div>`,
};
