import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../card/card.js';
import '../flex/flex.js';
import '../text/text.js';
import './divider.js';
import type { HmiDivider } from './divider.js';

type Args = Pick<HmiDivider, 'orientation' | 'align'>;

const aligns = ['start', 'center', 'end'] as const;

const meta = {
    title: 'Components/Layout/Divider',
    component: 'hmi-divider',
    tags: ['autodocs'],
    args: { orientation: 'horizontal', align: 'center' },
    argTypes: {
        orientation: {
            control: 'inline-radio',
            options: ['horizontal', 'vertical'],
        },
        align: { control: 'inline-radio', options: aligns },
    },
    render: (args) =>
        html`<div style="display: flex; flex-direction: column; gap: calc(var(--hmi-base, 8px) * 2); width: calc(var(--hmi-base, 8px) * 48)">
            <span>Above</span>
            <hmi-divider orientation=${args.orientation} align=${args.align}></hmi-divider>
            <span>Below</span>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Divider } from \'@ninoverse/hmi-components/react/divider\'` — `<Divider align="start">OR</Divider>`. The label is the default slot. A plain divider is a `separator`; a labelled one is read as text, as in React. A horizontal divider fills its parent, the rules are `--outline`, and in a card the label takes the muted text colour of the card.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Text in the default slot turns a horizontal divider into a labelled row. */
export const Labeled: Story = {
    render: (args) =>
        html`<hmi-divider align=${args.align} style="width: calc(var(--hmi-base, 8px) * 48)">OR</hmi-divider>`,
};

export const LabelAlignment: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: calc(var(--hmi-base, 8px) * 2); width: calc(var(--hmi-base, 8px) * 48)">
            ${aligns.map(
                (align) =>
                    html`<hmi-divider align=${align}>${align}</hmi-divider>`,
            )}
        </div>
    `,
};

/** In a flex row the vertical divider stretches to the row's height. */
export const Vertical: Story = {
    render: () =>
        html`<hmi-flex gap="medium" align="stretch">
            <span>One</span>
            <hmi-divider orientation="vertical"></hmi-divider>
            <span>Two</span>
            <hmi-divider orientation="vertical"></hmi-divider>
            <span>Three</span>
        </hmi-flex>`,
};

/** A long label wraps, and each rule keeps 1.5 base units. */
export const LongLabel: Story = {
    render: (args) =>
        html`<hmi-divider align=${args.align} style="width: calc(var(--hmi-base, 8px) * 28)"
            >Or continue with your email address instead</hmi-divider
        >`,
};

/** In a card the label takes the card's muted text colour. */
export const OnCards: Story = {
    render: () => html`
        <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--hmi-base, 8px) * 30), 1fr)); gap: calc(var(--hmi-base, 8px) * 2)"
        >
            ${(['default', 'ink', 'accent'] as const).map(
                (variant) => html`<hmi-card variant=${variant}>
                    <hmi-text>Sign in with a passkey</hmi-text>
                    <hmi-divider style="margin-block: calc(var(--hmi-base, 8px) * 1)">OR</hmi-divider>
                    <hmi-text>Use your password</hmi-text>
                </hmi-card>`,
            )}
        </div>
    `,
};
