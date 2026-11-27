import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './heading.js';
import type { HmiHeading } from './heading.js';

type Args = Pick<HmiHeading, 'level' | 'size' | 'tone' | 'truncate'>;

const levels = [1, 2, 3, 4, 5, 6] as const;
const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
const tones = ['default', 'muted', 'primary', 'inherit'] as const;

const meta = {
    title: 'Components/Typography/Heading',
    component: 'hmi-heading',
    tags: ['autodocs'],
    args: { level: 2, tone: 'default', truncate: false },
    argTypes: {
        level: { control: 'inline-radio', options: levels },
        size: { control: 'select', options: [undefined, ...sizes] },
        tone: { control: 'inline-radio', options: tones },
        truncate: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-heading
            .level=${args.level}
            .size=${args.size}
            tone=${args.tone}
            ?truncate=${args.truncate}
            style="max-width: calc(var(--hmi-base, 8px) * 56)"
            >A heading for the page</hmi-heading
        >`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { Heading } from '@ninoverse/hmi-components/react/heading'` — `<Heading level={3} tone=\"muted\">Title</Heading>`. `level` is the semantic tag of the inner heading, `size` the visual size; they are independent. The host carries the type, so its `style` and `class` (and React's `style`) restyle the heading like any element.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Each level picks a default size. */
export const Levels: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: calc(var(--hmi-base, 8px) * 1)">
            ${levels.map(
                (level) =>
                    html`<hmi-heading .level=${level}>Heading level ${level}</hmi-heading>`,
            )}
        </div>
    `,
};

/** `size` overrides the default for the level without changing the tag. */
export const Sizes: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: calc(var(--hmi-base, 8px) * 1)">
            ${sizes.map(
                (size) =>
                    html`<hmi-heading level="3" size=${size}>level 3, size ${size}</hmi-heading>`,
            )}
        </div>
    `,
};

export const Tones: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: calc(var(--hmi-base, 8px) * 1); color: tomato">
            ${tones.map(
                (tone) =>
                    html`<hmi-heading level="4" tone=${tone}>${tone}</hmi-heading>`,
            )}
        </div>
    `,
};

export const Truncated: Story = { args: { truncate: true } };

/** A title that truncates beside an action in a flex row. */
export const TruncatedInARow: Story = {
    render: () => html`
        <div
            style="display: flex; align-items: center; gap: calc(var(--hmi-base, 8px) * 1); max-width: calc(var(--hmi-base, 8px) * 40)"
        >
            <hmi-heading level="3" size="small" truncate
                >Pressure readings for line three, last shift</hmi-heading
            >
            <hmi-button size="small" variant="secondary">Edit</hmi-button>
        </div>
    `,
};

/** The host's `style` and `class` restyle the heading like any element;
    `::part(base)` reaches the inner heading itself. A long word breaks, and a
    heading that wraps is balanced. */
export const Styling: Story = {
    render: () => html`
        <style>
            .spaced {
                letter-spacing: 0.08em;
                text-transform: uppercase;
            }
        </style>
        <div
            style="display: flex; flex-direction: column; gap: calc(var(--hmi-base, 8px) * 2); max-width: calc(var(--hmi-base, 8px) * 40)"
        >
            <hmi-heading level="2" style="color: var(--tertiary)"
                >Colour from the host's style</hmi-heading
            >
            <hmi-heading level="3" class="spaced">Spacing from a class</hmi-heading>
            <hmi-heading level="3"
                >Hydraulic-press-line-three-maintenance-schedule</hmi-heading
            >
            <hmi-heading level="2"
                >A heading that wraps keeps its lines even</hmi-heading
            >
        </div>
    `,
};
