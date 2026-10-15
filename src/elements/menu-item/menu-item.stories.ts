import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './menu-item.js';
import type { HmiMenuItem } from './menu-item.js';

type Args = Pick<HmiMenuItem, 'danger' | 'disabled' | 'shortcut'>;

const meta = {
    title: 'Components/Overlays/MenuItem',
    component: 'hmi-menu-item',
    tags: ['autodocs'],
    args: { danger: false, disabled: false, shortcut: '⌘S' },
    argTypes: {
        danger: { control: 'boolean' },
        disabled: { control: 'boolean' },
        shortcut: { control: 'text' },
    },
    render: (args) =>
        html`<div style="width: 260px; display: flex; flex-direction: column">
                <hmi-menu-item ?danger=${args.danger} ?disabled=${args.disabled} shortcut=${args.shortcut}>Save</hmi-menu-item>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { MenuItem } from \'@ninoverse/hmi-components/react/menu-item\'` — `<MenuItem shortcut="⌘S" onClick={save}>Save</MenuItem>`. Activation is the native `click`. `icon` is a child with `slot="icon"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** `danger` styles a destructive action. */
export const Danger: Story = {
    args: { danger: true, shortcut: '⌫' },
};

/** A disabled item takes no focus and no click. */
export const Disabled: Story = {
    args: { disabled: true },
};

/** An `<svg slot="icon">` is sized to the row's text; the `shortcut` slot takes rich content. */
export const WithIcon: Story = {
    render: () =>
        html`<div style="width: 260px; display: flex; flex-direction: column">
                <hmi-menu-item shortcut="⌘N">
                    <svg slot="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3v10M3 8h10" /></svg>
                    New file
                </hmi-menu-item>
                <hmi-menu-item>
                    <svg slot="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" /></svg>
                    Delete
                    <kbd slot="shortcut">⌫</kbd>
                </hmi-menu-item>
        </div>`,
};
