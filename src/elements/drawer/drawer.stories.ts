import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import type { DialogAction } from '../shared/dialog-actions.js';
import './drawer.js';
import type { DrawerSide, HmiDrawer } from './drawer.js';

type Args = Pick<
    HmiDrawer,
    'side' | 'size' | 'heading' | 'description' | 'actions' | 'label'
>;

const ACTIONS: DialogAction[] = [
    { label: 'Cancel', value: 'cancel', variant: 'secondary' },
    { label: 'Apply', value: 'apply', variant: 'primary' },
];

// The drawer is controlled: a story opens it from a button and closes it from
// `hmi-close` and `hmi-action`. Closed by default, so the autodocs page, which
// mounts every story at once, does not stack scrims.
const open = (event: Event) => {
    const drawer = (event.currentTarget as HTMLElement)
        .nextElementSibling as HmiDrawer;
    drawer.open = true;
};
const close = (event: Event) => {
    (event.currentTarget as HmiDrawer).open = false;
};

const meta = {
    title: 'Components/Overlays/Drawer',
    component: 'hmi-drawer',
    tags: ['autodocs'],
    args: {
        side: 'right' as DrawerSide,
        size: undefined,
        heading: 'Filters',
        description: 'Tune the result set on the fly.',
        actions: ACTIONS,
        label: '',
    },
    argTypes: {
        side: {
            control: 'inline-radio',
            options: ['left', 'right', 'top', 'bottom'],
        },
        size: { control: 'text' },
        heading: { control: 'text' },
        description: { control: 'text' },
        actions: { control: 'object' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-button @click=${open}>Open drawer</hmi-button>
            <hmi-drawer
                side=${args.side}
                .size=${args.size}
                heading=${args.heading}
                description=${args.description}
                label=${args.label}
                .actions=${args.actions}
                @hmi-close=${close}
                @hmi-action=${close}
            >
                <p style="margin: 0; color: var(--on-surface-variant)">
                    Escape or a press on the scrim closes it.
                </p>
            </hmi-drawer>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Drawer } from \'@ninoverse/hmi-components/react/drawer\'` — `<Drawer open={open} side="right" heading="Filters" onClose={() => setOpen(false)}>…</Drawer>`. The drawer is controlled: it never closes itself, so set `open` to `false` from `hmi-close`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Right: Story = {};

export const Left: Story = {
    args: {
        side: 'left',
        heading: 'Workspace',
        description: 'Sample left drawer for navigation context.',
        actions: [],
    },
};

export const Top: Story = {
    args: { side: 'top', heading: 'Announcements', actions: [] },
};

/** Bottom-anchored: common on mobile. */
export const Bottom: Story = {
    args: {
        side: 'bottom',
        heading: 'Quick actions',
        description: '',
        actions: [],
    },
};

/** `size` is the width of a left or right drawer, and the height of a top or bottom one: a number of px, or any CSS length. */
export const CustomSize: Story = {
    args: { size: '60rem' },
};
