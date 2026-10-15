import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../menu/menu.js';
import '../menu-item/menu-item.js';
import '../menu-label/menu-label.js';
import '../menu-separator/menu-separator.js';
import './context-menu.js';
import type { ContextMenuFocusOnOpen, HmiContextMenu } from './context-menu.js';

type Args = Pick<HmiContextMenu, 'focusOnOpen' | 'open'>;

// The context menu owns `open`: a right-click, an outside click, Escape and an
// activated item change it, so a story needs no wiring.
const meta = {
    title: 'Components/Overlays/ContextMenu',
    component: 'hmi-context-menu',
    tags: ['autodocs'],
    args: { focusOnOpen: 'keyboard' as ContextMenuFocusOnOpen, open: false },
    argTypes: {
        focusOnOpen: {
            control: 'inline-radio',
            options: ['keyboard', 'always', 'never'],
        },
        open: { control: 'boolean' },
    },
    render: (args) =>
        html`<div style="padding: 24px 0 200px">
            <hmi-context-menu focus-on-open=${args.focusOnOpen} ?open=${args.open}>
                <div
                    slot="trigger"
                    style="display: flex; align-items: center; justify-content: center; width: 384px; height: 160px; border: 2px dashed var(--outline-variant); border-radius: var(--corner-large); background: var(--surface-container-low); color: var(--on-surface-variant); user-select: none"
                >
                    Right-click anywhere in this area
                </div>
                <hmi-menu slot="menu" label="Edit">
                    <hmi-menu-label>Edit</hmi-menu-label>
                    <hmi-menu-item shortcut="⌘C">Copy</hmi-menu-item>
                    <hmi-menu-item shortcut="⌘V">Paste</hmi-menu-item>
                    <hmi-menu-item shortcut="⌘D">Duplicate</hmi-menu-item>
                    <hmi-menu-separator></hmi-menu-separator>
                    <hmi-menu-item danger shortcut="⌫">Delete</hmi-menu-item>
                </hmi-menu>
            </hmi-context-menu>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { ContextMenu } from \'@ninoverse/hmi-components/react/context-menu\'` — `<ContextMenu><div slot="trigger">…</div><Menu slot="menu">…</Menu></ContextMenu>`. The trigger is the `trigger` slot and the menu the `menu` slot. The element owns `open`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Any element works as the trigger, not just a drop zone. */
export const OnAListRow: Story = {
    render: (args) =>
        html`<div style="padding: 24px 0 200px">
            <hmi-context-menu focus-on-open=${args.focusOnOpen}>
                <div
                    slot="trigger"
                    style="padding: 12px 16px; max-width: 320px; border-radius: var(--corner-medium); background: var(--surface-container-high); user-select: none"
                >
                    report-q3.pdf — right-click for actions
                </div>
                <hmi-menu slot="menu" label="File actions">
                    <hmi-menu-item>Open</hmi-menu-item>
                    <hmi-menu-item>Rename</hmi-menu-item>
                    <hmi-menu-separator></hmi-menu-separator>
                    <hmi-menu-item danger>Delete</hmi-menu-item>
                </hmi-menu>
            </hmi-context-menu>
        </div>`,
};

/** `focus-on-open="always"` puts focus on the first enabled item whenever the menu opens, so the arrow keys work after a right-click. */
export const FocusOnOpen: Story = {
    args: { focusOnOpen: 'always' },
};
