import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../menu-item/menu-item.js';
import './menu-label.js';

const meta = {
    title: 'Components/Overlays/MenuLabel',
    component: 'hmi-menu-label',
    tags: ['autodocs'],
    render: () =>
        html`<div style="width: 260px; display: flex; flex-direction: column">
            <hmi-menu-label>Workspace</hmi-menu-label>
            <hmi-menu-item>New file</hmi-menu-item>
            <hmi-menu-item>Open…</hmi-menu-item>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { MenuLabel } from '@ninoverse/hmi-components/react/menu-label'` — `<MenuLabel>Workspace</MenuLabel>`.",
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** A group heading above a run of menu items. */
export const Default: Story = {};
