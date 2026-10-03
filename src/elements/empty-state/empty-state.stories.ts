import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './empty-state.js';

const searchIcon = html`<svg
    slot="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    aria-hidden="true"
>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
</svg>`;

const meta = {
    title: 'Components/Feedback/EmptyState',
    component: 'hmi-empty-state',
    tags: ['autodocs'],
    render: () =>
        html`<hmi-empty-state>
            <span slot="title">No results</span>
            <span slot="description">Try another search.</span>
        </hmi-empty-state>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { EmptyState } from \'@ninoverse/hmi-components/react/empty-state\'` — `<EmptyState><span slot="title">No results</span><span slot="description">Try another search.</span></EmptyState>`. `icon`, `title`, `description` and `action` are slots, not props.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithIcon: Story = {
    render: () =>
        html`<hmi-empty-state>
            ${searchIcon}
            <span slot="title">No results</span>
            <span slot="description">Nothing matches your search.</span>
        </hmi-empty-state>`,
};

export const WithAction: Story = {
    render: () =>
        html`<hmi-empty-state>
            ${searchIcon}
            <span slot="title">No results</span>
            <span slot="description">Try another search.</span>
            <hmi-button slot="action">Reset filters</hmi-button>
        </hmi-empty-state>`,
};

/** Several actions go inside one element. */
export const WithActions: Story = {
    render: () =>
        html`<hmi-empty-state>
            ${searchIcon}
            <span slot="title">No projects yet</span>
            <span slot="description">Create one or import an existing project.</span>
            <div slot="action" style="display: flex; gap: 1rem">
                <hmi-button>Create</hmi-button>
                <hmi-button variant="secondary">Import</hmi-button>
            </div>
        </hmi-empty-state>`,
};
