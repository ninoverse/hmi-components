import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../flex/flex.js';
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
        html`<div style="display: flex; flex-direction: column; gap: 1rem; width: 24rem">
            <span>Above</span>
            <hmi-divider orientation=${args.orientation} align=${args.align}></hmi-divider>
            <span>Below</span>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Divider } from \'@ninoverse/hmi-components/react/divider\'` — `<Divider align="start">OR</Divider>`. The label is the default slot. A plain divider is a `separator`; a labelled one is not announced as one, as in React (see `TODO.md`).',
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
        html`<hmi-divider align=${args.align} style="width: 24rem">OR</hmi-divider>`,
};

export const LabelAlignment: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1rem; width: 24rem">
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
