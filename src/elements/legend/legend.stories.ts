import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './legend.js';
import type { HmiLegend, LegendItem } from './legend.js';

type Args = Pick<HmiLegend, 'items' | 'align'>;

const ITEMS: LegendItem[] = [
    { label: 'Revenue', color: 'var(--primary)' },
    { label: 'Costs', color: 'var(--tertiary)' },
    { label: 'Forecast', color: 'var(--secondary)', inactive: true },
];

const meta = {
    title: 'Charts/Legend',
    component: 'hmi-legend',
    tags: ['autodocs'],
    args: { items: ITEMS, align: 'center' },
    argTypes: {
        items: { control: 'object' },
        align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    },
    render: (args) =>
        html`<hmi-legend .items=${args.items} align=${args.align}></hmi-legend>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Legend } from \'@ninoverse/hmi-components/react/legend\'` — `<Legend align="start" items={items} />`. Each `label` is a string; a child with `slot="label-<index>"` takes richer content.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const AlignStart: Story = { args: { align: 'start' } };

export const AlignEnd: Story = { args: { align: 'end' } };

/** `inactive` draws a hollow swatch. */
export const WithInactive: Story = {
    args: {
        items: [
            { label: 'Revenue', color: 'var(--primary)' },
            { label: 'Costs', color: 'var(--tertiary)', inactive: true },
        ],
    },
};

/** `label-<index>` replaces a label's text with any element. */
export const RichLabel: Story = {
    render: (args) =>
        html`<hmi-legend .items=${args.items}>
            <span slot="label-0">Revenue <strong>(USD)</strong></span>
        </hmi-legend>`,
};
