import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../menu-item/menu-item.js';
import './menu-separator.js';

const meta = {
    title: 'Components/Overlays/MenuSeparator',
    component: 'hmi-menu-separator',
    tags: ['autodocs'],
    render: () =>
        html`<div style="width: 260px; padding: 4px; display: flex; flex-direction: column">
            <hmi-menu-item>New file</hmi-menu-item>
            <hmi-menu-separator></hmi-menu-separator>
            <hmi-menu-item danger>Delete</hmi-menu-item>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { MenuSeparator } from '@ninoverse/hmi-components/react/menu-separator'` — `<MenuSeparator />`.",
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** A divider between two groups of items, reaching past the padding around them. */
export const Default: Story = {};
