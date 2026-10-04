import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../badge/badge.js';
import '../flex/flex.js';
import './spacer.js';
import type { HmiSpacer } from './spacer.js';

type Args = Pick<HmiSpacer, 'size' | 'axis' | 'grow'>;

const sizes = ['small', 'medium', 'large'] as const;
const axes = ['vertical', 'horizontal'] as const;

const meta = {
    title: 'Components/Layout/Spacer',
    component: 'hmi-spacer',
    tags: ['autodocs'],
    args: { size: 'medium', axis: 'vertical', grow: false },
    argTypes: {
        size: { control: 'inline-radio', options: sizes },
        axis: { control: 'inline-radio', options: axes },
        grow: { control: 'boolean' },
    },
    render: (args) =>
        html`<div style="outline: 1px dashed var(--outline-variant)">
            <hmi-badge>Above</hmi-badge>
            <hmi-spacer
                size=${args.size}
                axis=${args.axis}
                ?grow=${args.grow}
                style="background: var(--primary-container)"
            ></hmi-spacer>
            <hmi-badge>Below</hmi-badge>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Spacer } from \'@ninoverse/hmi-components/react/spacer\'` — `<Spacer size="large" />`. The host is `aria-hidden` unless you set the attribute yourself.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Sizes: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem">
            ${sizes.map(
                (size) =>
                    html`<div style="outline: 1px dashed var(--outline-variant)">
                        <hmi-badge>${size}</hmi-badge>
                        <hmi-spacer size=${size} style="background: var(--primary-container)"></hmi-spacer>
                        <hmi-badge>${size}</hmi-badge>
                    </div>`,
            )}
        </div>
    `,
};

export const Horizontal: Story = {
    args: { axis: 'horizontal', size: 'large' },
    render: (args) =>
        html`<div style="display: flex; align-items: center">
            <hmi-badge>Left</hmi-badge>
            <hmi-spacer
                axis=${args.axis}
                size=${args.size}
                style="background: var(--primary-container); align-self: stretch"
            ></hmi-spacer>
            <hmi-badge>Right</hmi-badge>
        </div>`,
};

/** In a flex container, `grow` pushes the neighbours to the two ends. */
export const Grow: Story = {
    render: () =>
        html`<hmi-flex align="center" style="outline: 1px dashed var(--outline-variant)">
            <hmi-badge>Left</hmi-badge>
            <hmi-spacer grow></hmi-spacer>
            <hmi-badge>Right</hmi-badge>
        </hmi-flex>`,
};
