import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './text.js';
import type { HmiText } from './text.js';

type Args = Pick<
    HmiText,
    'size' | 'weight' | 'tone' | 'align' | 'truncate' | 'inline'
>;

const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
const weights = ['regular', 'medium', 'semibold', 'bold'] as const;
const tones = ['default', 'muted', 'primary', 'error', 'inherit'] as const;

const meta = {
    title: 'Components/Typography/Text',
    component: 'hmi-text',
    tags: ['autodocs'],
    args: {
        size: 'medium',
        weight: 'regular',
        tone: 'default',
        truncate: false,
        inline: false,
    },
    argTypes: {
        size: { control: 'select', options: sizes },
        weight: { control: 'inline-radio', options: weights },
        tone: { control: 'select', options: tones },
        align: {
            control: 'inline-radio',
            options: [undefined, 'start', 'center', 'end'],
        },
        truncate: { control: 'boolean' },
        inline: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-text
            size=${args.size}
            weight=${args.weight}
            tone=${args.tone}
            .align=${args.align}
            ?truncate=${args.truncate}
            ?inline=${args.inline}
            style="max-width: 28rem"
            >Body copy in the UI font: the quick brown fox jumps over the lazy dog.</hmi-text
        >`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Text } from \'@ninoverse/hmi-components/react/text\'` — `<Text size="small" tone="muted">Copy</Text>`. The host is the text: wrap it in a `<p>` (or give it `role="paragraph"`) where it is a paragraph; there is no `as` prop.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Sizes: Story = {
    render: () =>
        html`${sizes.map((size) => html`<hmi-text size=${size}>${size}</hmi-text>`)}`,
};

export const Weights: Story = {
    render: () =>
        html`${weights.map((weight) => html`<hmi-text weight=${weight}>${weight}</hmi-text>`)}`,
};

export const Tones: Story = {
    render: () =>
        html`<div style="color: tomato">
            ${tones.map((tone) => html`<hmi-text tone=${tone}>${tone}</hmi-text>`)}
        </div>`,
};

export const Alignment: Story = {
    render: () =>
        html`<div style="width: 20rem; outline: 1px dashed var(--outline-variant)">
            <hmi-text align="start">start</hmi-text>
            <hmi-text align="center">center</hmi-text>
            <hmi-text align="end">end</hmi-text>
        </div>`,
};

export const Truncated: Story = {
    args: { truncate: true },
    render: (args) =>
        html`<hmi-text ?truncate=${args.truncate} style="width: 16rem; outline: 1px dashed var(--outline-variant)"
            >A line far too long to fit in the box it sits in.</hmi-text
        >`,
};

/** `inline` lets the text sit inside a sentence, such as a paragraph. */
export const Inline: Story = {
    render: () =>
        html`<p style="margin: 0">
            Plain text, then <hmi-text inline weight="bold" tone="primary">an inline run</hmi-text>,
            then plain text again.
        </p>`,
};
