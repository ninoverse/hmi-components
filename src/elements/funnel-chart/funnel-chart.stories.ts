import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './funnel-chart.js';
import type { FunnelChartStage, HmiFunnelChart } from './funnel-chart.js';

type Args = Pick<
    HmiFunnelChart,
    | 'stages'
    | 'width'
    | 'height'
    | 'gap'
    | 'labelWidth'
    | 'showValues'
    | 'label'
>;

const STAGES: FunnelChartStage[] = [
    { label: 'Visited', value: 1200 },
    { label: 'Signed up', value: 820 },
    { label: 'Activated', value: 540 },
    { label: 'Subscribed', value: 210 },
];

const meta = {
    title: 'Charts/FunnelChart',
    component: 'hmi-funnel-chart',
    tags: ['autodocs'],
    args: {
        stages: STAGES,
        width: 500,
        height: 280,
        gap: 4,
        labelWidth: 180,
        showValues: true,
        label: 'Signup conversion funnel',
    },
    argTypes: {
        stages: { control: 'object' },
        width: { control: 'number' },
        height: { control: 'number' },
        gap: { control: 'number' },
        labelWidth: { control: 'number' },
        showValues: { control: 'boolean' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-funnel-chart
            .stages=${args.stages}
            width=${args.width}
            height=${args.height}
            gap=${args.gap}
            label-width=${args.labelWidth}
            ?show-values=${args.showValues}
            label=${args.label}
        ></hmi-funnel-chart>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { FunnelChart } from \'@ninoverse/hmi-components/react/funnel-chart\'` — `<FunnelChart label="Signup funnel" showValues stages={stages} />`. `stages` is a property.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Without `show-values`, each label is just the stage's name. */
export const NamesOnly: Story = {
    args: { showValues: false },
};

/** Each stage can set its own colour; the rest take the default palette. */
export const CustomColours: Story = {
    args: {
        stages: [
            { label: 'Visited', value: 1200, color: 'var(--primary)' },
            { label: 'Signed up', value: 820, color: 'var(--primary)' },
            { label: 'Activated', value: 540, color: 'var(--tertiary)' },
            { label: 'Subscribed', value: 210, color: 'var(--success)' },
        ],
    },
};
