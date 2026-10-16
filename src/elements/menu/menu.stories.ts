import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import '../menu-item/menu-item.js';
import '../menu-label/menu-label.js';
import '../menu-separator/menu-separator.js';
import '../popover/popover.js';
import './menu.js';
import type { HmiMenu } from './menu.js';

type Args = Pick<HmiMenu, 'label'>;

/* Menu is the content an overlay holds, not an overlay itself, and it paints no
   surface: on its own it is a transparent column. Every story composes label,
   item and separator children. */
const meta = {
    title: 'Components/Overlays/Menu',
    component: 'hmi-menu',
    tags: ['autodocs'],
    args: { label: 'Actions' },
    argTypes: { label: { control: 'text' } },
    render: (args) =>
        html`<div style="width: 260px">
            <hmi-menu label=${args.label}>
                <hmi-menu-label>Workspace</hmi-menu-label>
                <hmi-menu-item shortcut="⌘N">New file</hmi-menu-item>
                <hmi-menu-item shortcut="⌘O">Open…</hmi-menu-item>
                <hmi-menu-item shortcut="⌘S">Save</hmi-menu-item>
                <hmi-menu-separator></hmi-menu-separator>
                <hmi-menu-label>Danger zone</hmi-menu-label>
                <hmi-menu-item danger shortcut="⌫">Delete file</hmi-menu-item>
            </hmi-menu>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { Menu } from '@ninoverse/hmi-components/react/menu'`, with `MenuItem`, `MenuLabel` and `MenuSeparator` from their own subpaths. The arrow keys, Home and End move between the items.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The column on its own, so the item, label and separator styling is visible without hovering. */
export const Standalone: Story = {};

/** The usual pairing: a popover supplies the trigger and the surface. An item still closes the popover from its own `click`. */
export const InPopover: Story = {
    render: (args) =>
        html`<div style="padding: 24px 0 220px">
            <hmi-popover id="menu-popover" width="260">
                <hmi-button slot="trigger" variant="secondary">Actions ▾</hmi-button>
                <hmi-menu label=${args.label} @click=${(event: Event) => {
                    if ((event.target as Element).closest('hmi-menu-item')) {
                        (
                            document.getElementById(
                                'menu-popover',
                            ) as HTMLElement & { open: boolean }
                        ).open = false;
                    }
                }}>
                    <hmi-menu-label>Workspace</hmi-menu-label>
                    <hmi-menu-item shortcut="⌘N">New file</hmi-menu-item>
                    <hmi-menu-item shortcut="⌘O">Open…</hmi-menu-item>
                    <hmi-menu-separator></hmi-menu-separator>
                    <hmi-menu-item danger shortcut="⌫">Delete file</hmi-menu-item>
                </hmi-menu>
            </hmi-popover>
        </div>`,
};

/** A disabled item is skipped by the arrow keys. */
export const WithDisabledItem: Story = {
    render: (args) =>
        html`<div style="width: 260px">
            <hmi-menu label=${args.label}>
                <hmi-menu-item>Cut</hmi-menu-item>
                <hmi-menu-item disabled>Copy</hmi-menu-item>
                <hmi-menu-item>Paste</hmi-menu-item>
            </hmi-menu>
        </div>`,
};
