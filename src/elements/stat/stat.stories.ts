import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import './stat.js';
import type { HmiStat } from './stat.js';

type Args = Pick<HmiStat, 'trend' | 'tone' | 'trendLabel' | 'divider'>;

const trends = ['up', 'down', 'neutral'] as const;
const tones = ['positive', 'negative', 'neutral'] as const;

/* Widths in multiples of --hmi-base, as the elements size themselves. */
const width = (n: number) =>
    `width: calc(var(--hmi-base, 8px) * ${n}); max-width: 100%`;

const meta = {
    title: 'Components/Feedback/Stat',
    component: 'hmi-stat',
    tags: ['autodocs'],
    args: { trend: 'up', divider: false },
    argTypes: {
        trend: { control: 'inline-radio', options: trends },
        tone: { control: 'inline-radio', options: [undefined, ...tones] },
        trendLabel: { control: 'text' },
        divider: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-stat
            style=${width(48)}
            trend=${args.trend ?? nothing}
            tone=${args.tone ?? nothing}
            trend-label=${args.trendLabel ?? nothing}
            ?divider=${args.divider}
        >
            <span slot="label">Revenue</span>
            <span slot="value">$12.4k</span>
            <span slot="delta">8%</span>
            <span slot="help-text">vs last month</span>
        </hmi-stat>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Stat } from \'@ninoverse/hmi-components/react/stat\'` — `<Stat trend="up"><span slot="label">Revenue</span><span slot="value">$12.4k</span><span slot="delta">8%</span></Stat>`. `label`, `value`, `icon`, `delta` and `help-text` are slots, not props. `trend` draws the arrow and `tone` the colour, which follows `trend` when unset. A screen reader hears the stat as a group named by its label, and the delta with "up", "down" or "no change" before it, which `trendLabel` replaces. `divider` draws the dashed rule above the footer; the journal structure draws it anyway. Inside a card, the stat still draws its border: drop it with `::part(base)`. On a server the footer renders hidden, and shows once the element hydrates.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** `divider` draws a dashed rule above the footer. */
export const Divider: Story = { args: { divider: true } };

export const Trends: Story = {
    render: () => html`
        <div
            style="display: flex; flex-wrap: wrap; gap: calc(var(--hmi-base, 8px) * 3)"
        >
            ${trends.map(
                (trend) =>
                    html`<hmi-stat trend=${trend} style=${width(40)}>
                        <span slot="label">${trend}</span>
                        <span slot="value">128</span>
                        <span slot="delta">4%</span>
                    </hmi-stat>`,
            )}
        </div>
    `,
};

/** `tone` colours the delta apart from its arrow: fewer errors is good news. */
export const Tones: Story = {
    render: () => html`
        <div
            style="display: flex; flex-wrap: wrap; gap: calc(var(--hmi-base, 8px) * 3)"
        >
            <hmi-stat trend="down" tone="positive" style=${width(40)}>
                <span slot="label">Errors</span>
                <span slot="value">12</span>
                <span slot="delta">30%</span>
            </hmi-stat>
            <hmi-stat trend="up" tone="negative" style=${width(40)}>
                <span slot="label">Cost</span>
                <span slot="value">$4.1k</span>
                <span slot="delta">12%</span>
            </hmi-stat>
            <hmi-stat trend="up" tone="neutral" style=${width(40)}>
                <span slot="label">Visits</span>
                <span slot="value">3,920</span>
                <span slot="delta">1%</span>
            </hmi-stat>
        </div>
    `,
};

/** In a row, each stat fills the row's height, whatever it holds. */
export const Row: Story = {
    render: () => html`
        <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--hmi-base, 8px) * 28), 1fr)); gap: calc(var(--hmi-base, 8px) * 2)"
        >
            <hmi-stat trend="up">
                <span slot="label">Revenue</span>
                <span slot="value">$12.4k</span>
                <span slot="delta">8%</span>
                <span slot="help-text">vs last month</span>
            </hmi-stat>
            <hmi-stat>
                <span slot="label">Open tickets</span>
                <span slot="value">31</span>
            </hmi-stat>
            <hmi-stat trend="neutral">
                <span slot="label">Sessions</span>
                <span slot="value">$1,234,567</span>
                <span slot="delta">0%</span>
            </hmi-stat>
        </div>
    `,
};

export const Minimal: Story = {
    render: () => html`
        <hmi-stat style=${width(40)}>
            <span slot="label">Users</span>
            <span slot="value">1,204</span>
        </hmi-stat>
    `,
};

export const HelpTextOnly: Story = {
    render: () => html`
        <hmi-stat style=${width(40)}>
            <span slot="label">Uptime</span>
            <span slot="value">99.9%</span>
            <span slot="help-text">last 30 days</span>
        </hmi-stat>
    `,
};

/** A slotted `svg` or `img` sits beside the label, drawn 2 × `--hmi-base` square. */
export const WithIcon: Story = {
    render: () => html`
        <hmi-stat style=${width(40)} trend="down" tone="positive">
            <span slot="label">Errors</span>
            <svg slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
                <path d="M10 3l8 14H2z M10 8v4 M10 14.5v.01" />
            </svg>
            <span slot="value">3</span>
            <span slot="delta">2</span>
        </hmi-stat>
    `,
};
