import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../legend/legend.js';
import './radar-chart.js';
import type { HmiRadarChart, RadarChartSeries } from './radar-chart.js';

type Args = Pick<
    HmiRadarChart,
    'axes' | 'series' | 'size' | 'min' | 'max' | 'rings' | 'label'
>;

const SERIES: RadarChartSeries[] = [
    {
        name: 'Alpha',
        data: [80, 65, 70, 55, 90, 60],
        color: 'var(--primary)',
    },
    {
        name: 'Beta',
        data: [55, 80, 45, 75, 60, 85],
        color: 'var(--tertiary)',
    },
];

const meta = {
    title: 'Charts/RadarChart',
    component: 'hmi-radar-chart',
    tags: ['autodocs'],
    args: {
        axes: ['Speed', 'Power', 'Range', 'Defense', 'Control', 'Stamina'],
        series: SERIES,
        size: 340,
        min: undefined,
        max: undefined,
        rings: 4,
        label: 'Skill assessment by candidate',
    },
    argTypes: {
        axes: { control: 'object' },
        series: { control: 'object' },
        size: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        rings: { control: 'number' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-radar-chart
            .axes=${args.axes}
            .series=${args.series}
            size=${args.size}
            .min=${args.min}
            .max=${args.max}
            rings=${args.rings}
            label=${args.label}
        ></hmi-radar-chart>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { RadarChart } from \'@ninoverse/hmi-components/react/radar-chart\'` — `<RadarChart label="Skill assessment" axes={axes} series={series} />`. `axes` and `series` are properties.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const SingleSeries: Story = {
    args: { series: [SERIES[0] as RadarChartSeries] },
};

/** Fewer rings, and a fixed scale so the polygons keep their size when the data changes. */
export const FixedScale: Story = {
    args: { rings: 2, min: 0, max: 100 },
};

/** A chart usually comes with a legend. */
export const WithLegend: Story = {
    render: (args) =>
        html`<div>
            <hmi-radar-chart
                .axes=${args.axes}
                .series=${args.series}
                size=${args.size}
                label=${args.label}
            ></hmi-radar-chart>
            <hmi-legend
                align="start"
                .items=${[
                    { label: 'Alpha', color: 'var(--primary)' },
                    { label: 'Beta', color: 'var(--tertiary)' },
                ]}
            ></hmi-legend>
        </div>`,
};
