import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../legend/legend.js';
import './donut-chart.js';
import type { DonutChartSegment, HmiDonutChart } from './donut-chart.js';

type Args = Pick<
    HmiDonutChart,
    'segments' | 'size' | 'thickness' | 'gap' | 'label'
>;

const SEGMENTS: DonutChartSegment[] = [
    { label: 'Direct', value: 45 },
    { label: 'Search', value: 30 },
    { label: 'Social', value: 15 },
    { label: 'Referral', value: 10 },
];

const meta = {
    title: 'Charts/DonutChart',
    component: 'hmi-donut-chart',
    tags: ['autodocs'],
    args: {
        segments: SEGMENTS,
        size: 220,
        thickness: 0.32,
        gap: 2,
        label: 'Traffic by source',
    },
    argTypes: {
        segments: { control: 'object' },
        size: { control: 'number' },
        thickness: {
            control: { type: 'range', min: 0.05, max: 0.9, step: 0.01 },
        },
        gap: { control: { type: 'range', min: 0, max: 12, step: 1 } },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-donut-chart
            .segments=${args.segments}
            size=${args.size}
            thickness=${args.thickness}
            gap=${args.gap}
            label=${args.label}
        ></hmi-donut-chart>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { DonutChart } from \'@ninoverse/hmi-components/react/donut-chart\'` — `<DonutChart label="Traffic by source" segments={segments}><span slot="center-label">1.2k</span></DonutChart>`. `segments` is a property. The hole is the `center-label` slot.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** The `center-label` slot fills the hole: a total, or a headline figure. */
export const WithCenterLabel: Story = {
    render: (args) =>
        html`<hmi-donut-chart
            .segments=${args.segments}
            size=${args.size}
            label=${args.label}
        >
            <span slot="center-label">1.2k<br />visits</span>
        </hmi-donut-chart>`,
};

/** A thicker ring and no gap between the segments. */
export const ThickAndTight: Story = {
    args: { thickness: 0.55, gap: 0 },
};

/** A chart usually comes with a legend, in the colours of the default palette. */
export const WithLegend: Story = {
    render: (args) =>
        html`<div style="display: flex; gap: 32px; align-items: center">
            <hmi-donut-chart
                .segments=${args.segments}
                size=${args.size}
                label=${args.label}
            >
                <span slot="center-label">1.2k<br />visits</span>
            </hmi-donut-chart>
            <hmi-legend
                align="start"
                .items=${[
                    { label: 'Direct', color: 'var(--primary)' },
                    { label: 'Search', color: 'var(--tertiary)' },
                    { label: 'Social', color: 'var(--secondary)' },
                    { label: 'Referral', color: 'var(--success)' },
                ]}
            ></hmi-legend>
        </div>`,
};
