import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../legend/legend.js';
import './area-chart.js';
import type { AreaChartSeries, HmiAreaChart } from './area-chart.js';

type Args = Pick<
    HmiAreaChart,
    | 'series'
    | 'labels'
    | 'width'
    | 'height'
    | 'min'
    | 'max'
    | 'yTicks'
    | 'label'
>;

const SERIES: AreaChartSeries[] = [
    { name: 'Pro', data: [20, 28, 26, 35, 40, 52], color: 'var(--primary)' },
    { name: 'Free', data: [12, 15, 18, 16, 22, 25], color: 'var(--tertiary)' },
];

const meta = {
    title: 'Charts/AreaChart',
    component: 'hmi-area-chart',
    tags: ['autodocs'],
    args: {
        series: SERIES,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        width: 560,
        height: 280,
        min: undefined,
        max: undefined,
        yTicks: 4,
        label: 'Monthly active users by tier',
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
        html`<hmi-area-chart
            .series=${args.series}
            .labels=${args.labels}
            width=${args.width}
            height=${args.height}
            .min=${args.min}
            .max=${args.max}
            y-ticks=${args.yTicks}
            label=${args.label}
        ></hmi-area-chart>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { AreaChart } from \'@ninoverse/hmi-components/react/area-chart\'` — `<AreaChart label="Monthly active users" labels={labels} series={series} />`. `series` and `labels` are properties. The size is `width` and `height` in px: to fit a container, pass the size from `hmi-responsive-container`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const SingleSeries: Story = {
    args: { series: [SERIES[0] as AreaChartSeries] },
};

/** A chart usually comes with a legend. */
export const WithLegend: Story = {
    render: (args) =>
        html`<div>
            <hmi-area-chart
                .series=${args.series}
                .labels=${args.labels}
                width=${args.width}
                height=${args.height}
                label=${args.label}
            ></hmi-area-chart>
            <hmi-legend
                align="start"
                .items=${[
                    { label: 'Pro', color: 'var(--primary)' },
                    { label: 'Free', color: 'var(--tertiary)' },
                ]}
            ></hmi-legend>
        </div>`,
};
