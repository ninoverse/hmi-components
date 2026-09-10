import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './avatar.js';
import type { HmiAvatar } from './avatar.js';

type Args = Pick<HmiAvatar, 'name' | 'src' | 'size' | 'status'>;

const sizes = ['small', 'medium', 'large', 'xlarge'] as const;
const statuses = ['online', 'away', 'offline'] as const;

/* Inline so the story needs no network: a flat teal square, cropped to the
   circle by the element's own clip-path. */
const PHOTO =
    'data:image/svg+xml,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
            '<rect width="96" height="96" fill="#1F5B58"/>' +
            '<circle cx="48" cy="38" r="16" fill="#DEEFEC"/>' +
            '<circle cx="48" cy="86" r="28" fill="#DEEFEC"/>' +
            '</svg>',
    );

const row = 'display: flex; gap: 2rem; align-items: center';

const meta = {
    title: 'Components/Data display/Avatar',
    component: 'hmi-avatar',
    tags: ['autodocs'],
    args: { name: 'Ada Lovelace', src: '', size: 'medium', status: undefined },
    argTypes: {
        size: { control: 'select', options: sizes },
        status: { control: 'select', options: [undefined, ...statuses] },
        src: { control: 'text' },
    },
    render: (args) => html`
        <hmi-avatar
            name=${args.name}
            src=${args.src}
            size=${args.size}
            status=${args.status ?? ''}
        ></hmi-avatar>
    `,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Avatar } from \'@ninoverse/hmi-components/react/avatar\'` — `<Avatar name="Ada Lovelace" status="online" />`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Without `src`, initials are shown over a colour hashed from the name. */
export const Default: Story = {};

export const Sizes: Story = {
    render: (args) => html`
        <div style=${row}>
            ${sizes.map(
                (size) =>
                    html`<hmi-avatar
                        name=${args.name}
                        size=${size}
                    ></hmi-avatar>`,
            )}
        </div>
    `,
};

export const Status: Story = {
    render: () => html`
        <div style=${row}>
            <hmi-avatar
                name="Ada Lovelace"
                size="large"
                status="online"
            ></hmi-avatar>
            <hmi-avatar
                name="Alan Turing"
                size="large"
                status="away"
            ></hmi-avatar>
            <hmi-avatar
                name="Grace Hopper"
                size="large"
                status="offline"
            ></hmi-avatar>
        </div>
    `,
};

/** The colour is derived from the name, so each person is consistently tinted. */
export const ColourHashing: Story = {
    render: () => html`
        <div style="display: flex; gap: 1.5rem">
            ${[
                'Ada Lovelace',
                'Alan Turing',
                'Grace Hopper',
                'Linus Torvalds',
            ].map((name) => html`<hmi-avatar name=${name}></hmi-avatar>`)}
        </div>
    `,
};

/** With `src`, the image covers the circle and carries `name` as its alt text. */
export const WithImage: Story = {
    render: () => html`
        <div style=${row}>
            ${sizes.map(
                (size) =>
                    html`<hmi-avatar
                        name="Ada Lovelace"
                        src=${PHOTO}
                        size=${size}
                    ></hmi-avatar>`,
            )}
        </div>
    `,
};
