import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './stat.js';
import type { HmiStat } from './stat.js';

type Args = Pick<HmiStat, 'trend' | 'divider'>;

const trends = ['up', 'down', 'neutral'] as const;

const meta = {
    title: 'Components/Feedback/Stat',
    component: 'hmi-stat',
    tags: ['autodocs'],
    args: { trend: 'up', divider: false },
    argTypes: {
        trend: { control: 'inline-radio', options: trends },
        divider: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-stat style="width: 24rem; max-width: 100%" trend=${args.trend ?? ''} ?divider=${args.divider}>
            <span slot="label">Revenue</span>
            <span slot="value">$12.4k</span>
            <span slot="delta">8%</span>
            <span slot="help-text">vs last month</span>
        </hmi-stat>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Stat } from \'@ninoverse/hmi-components/react/stat\'` — `<Stat trend="up"><span slot="label">Revenue</span><span slot="value">$12.4k</span><span slot="delta">8%</span></Stat>`. `label`, `value`, `icon`, `delta` and `helpText` are slots, not props. `divider` draws the dashed rule above the footer.',
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
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem">
            ${trends.map(
                (trend) =>
                    html`<hmi-stat trend=${trend} style="width: 20rem">
                        <span slot="label">${trend}</span>
                        <span slot="value">128</span>
                        <span slot="delta">4%</span>
                    </hmi-stat>`,
            )}
        </div>
    `,
};

export const Minimal: Story = {
    render: () => html`
        <hmi-stat style="width: 20rem">
            <span slot="label">Users</span>
            <span slot="value">1,204</span>
        </hmi-stat>
    `,
};

export const HelpTextOnly: Story = {
    render: () => html`
        <hmi-stat style="width: 20rem">
            <span slot="label">Uptime</span>
            <span slot="value">99.9%</span>
            <span slot="help-text">last 30 days</span>
        </hmi-stat>
    `,
};

/** A slotted `svg` sits beside the label. */
export const WithIcon: Story = {
    render: () => html`
        <hmi-stat style="width: 20rem" trend="down">
            <span slot="label">Errors</span>
            <svg slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
                <path d="M10 3l8 14H2z M10 8v4 M10 14.5v.01" />
            </svg>
            <span slot="value">3</span>
            <span slot="delta">2</span>
        </hmi-stat>
    `,
};
