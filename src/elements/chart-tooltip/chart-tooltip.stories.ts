import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './chart-tooltip.js';
import type { ChartTooltipItem, HmiChartTooltip } from './chart-tooltip.js';

type Args = Pick<HmiChartTooltip, 'heading' | 'items'>;

const ITEMS: ChartTooltipItem[] = [
    { label: 'Revenue', value: '$48.2k', color: 'var(--primary)' },
    { label: 'Costs', value: '$31.7k', color: 'var(--tertiary)' },
];

const meta = {
    title: 'Charts/ChartTooltip',
    component: 'hmi-chart-tooltip',
    tags: ['autodocs'],
    args: { heading: 'Jan 2026', items: ITEMS },
    argTypes: { heading: { control: 'text' }, items: { control: 'object' } },
    render: (args) =>
        html`<hmi-chart-tooltip
            heading=${args.heading ?? ''}
            .items=${args.items}
        ></hmi-chart-tooltip>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { ChartTooltip } from '@ninoverse/hmi-components/react/chart-tooltip'` — `<ChartTooltip heading=\"Jan 2026\" items={items} />`. It renders the card only: position it on hover yourself. `heading`, and a row's label and value, take richer content through the `heading`, `label-<index>` and `value-<index>` slots.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const NoHeading: Story = { args: { heading: undefined } };

/** A row without a `color` has no swatch. */
export const WithoutSwatch: Story = {
    args: {
        items: [
            { label: 'Revenue', value: '$48.2k' },
            { label: 'Costs', value: '$31.7k' },
        ],
    },
};

export const RichValue: Story = {
    render: (args) =>
        html`<hmi-chart-tooltip heading=${args.heading ?? ''} .items=${args.items}>
            <b slot="value-0">$48.2k ▲</b>
        </hmi-chart-tooltip>`,
};
