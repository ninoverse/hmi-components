import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './avatar-stack.js';
import type { HmiAvatarStack } from './avatar-stack.js';

type Args = Pick<HmiAvatarStack, 'names' | 'max' | 'size'>;

const names = [
    'Ada Lovelace',
    'Alan Turing',
    'Grace Hopper',
    'Linus Torvalds',
    'Barbara Liskov',
    'Ken Thompson',
    'Margaret Hamilton',
];

const meta = {
    title: 'Components/Data display/AvatarStack',
    component: 'hmi-avatar-stack',
    tags: ['autodocs'],
    args: { names: names.slice(0, 4), max: 4, size: 'medium' },
    argTypes: {
        max: { control: 'number' },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large', 'xlarge'],
        },
    },
    render: (args) => html`
        <hmi-avatar-stack
            .names=${args.names}
            max=${args.max}
            size=${args.size}
        ></hmi-avatar-stack>
    `,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { AvatarStack } from '@ninoverse/hmi-components/react/avatar-stack'` — `<AvatarStack names={['Ada Lovelace']} max={4} />`. In plain HTML `names` is a JS property, not an attribute: `el.names = [...]`.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Beyond `max` the remainder collapses into a `+N` chip. */
export const Overflow: Story = { args: { names, max: 4 } };

export const Sizes: Story = {
    render: (args) => html`
        <div style="display: flex; gap: 3rem; align-items: center">
            ${(['small', 'medium', 'large'] as const).map(
                (size) => html`
                    <hmi-avatar-stack
                        .names=${args.names}
                        max=${args.max}
                        size=${size}
                    ></hmi-avatar-stack>
                `,
            )}
        </div>
    `,
};
