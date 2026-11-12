import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './avatar-stack.js';
import type { HmiAvatarStack } from './avatar-stack.js';

type Args = Pick<
    HmiAvatarStack,
    'names' | 'max' | 'size' | 'label' | 'overflowLabel'
>;

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
    args: {
        names: names.slice(0, 4),
        max: 4,
        size: 'medium',
        label: '{count} people',
        overflowLabel: '{count} more',
    },
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
            label=${args.label}
            overflow-label=${args.overflowLabel}
        ></hmi-avatar-stack>
    `,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { AvatarStack } from '@ninoverse/hmi-components/react/avatar-stack'` — `<AvatarStack names={['Ada Lovelace']} max={4} />`. In plain HTML `names` is a JS property, not an attribute: `el.names = [...]`. Each entry is a name, or `{ name, src, status }` for an image and a presence. Set `--avatar-stack-rim` to the colour the stack sits on.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Beyond `max` the remainder collapses into a `+N` chip, which names who it hides on hover. */
export const Overflow: Story = { args: { names, max: 4 } };

/** A count of two digits or more widens the chip into a pill. */
export const LargeCount: Story = {
    args: {
        names: Array.from(
            { length: 120 },
            (_, i) => names[i % names.length] ?? '',
        ),
    },
};

/** An entry can carry an image and a presence, as `hmi-avatar` does. */
export const ImagesAndPresence: Story = {
    args: {
        names: [
            {
                name: 'Ada Lovelace',
                src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%231F5B58'/%3E%3Ccircle cx='48' cy='38' r='16' fill='%23DEEFEC'/%3E%3Ccircle cx='48' cy='86' r='28' fill='%23DEEFEC'/%3E%3C/svg%3E",
                status: 'online',
            },
            { name: 'Alan Turing', status: 'away' },
            { name: 'Grace Hopper', status: 'offline' },
            'Linus Torvalds',
            'Barbara Liskov',
        ],
        max: 4,
        size: 'large',
    },
};

/** On a card or a coloured panel, `--avatar-stack-rim` matches the ring to it. */
export const OnASurface: Story = {
    args: { names, max: 4 },
    render: (args) => html`
        <div
            style="display: inline-flex; padding: 16px; border-radius: 12px; background: var(--primary-container); --avatar-stack-rim: var(--primary-container)"
        >
            <hmi-avatar-stack .names=${args.names} max=${args.max}></hmi-avatar-stack>
        </div>
    `,
};

export const Sizes: Story = {
    render: (args) => html`
        <div style="display: flex; gap: 3rem; align-items: center">
            ${(['small', 'medium', 'large', 'xlarge'] as const).map(
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
