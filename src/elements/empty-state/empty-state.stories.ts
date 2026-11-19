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
                    'React: `import { EmptyState } from \'@ninoverse/hmi-components/react/empty-state\'` — `<EmptyState><span slot="title">No results</span><span slot="description">Try another search.</span></EmptyState>`. `icon`, `title`, `description` and `action` are slots, not props: v5\'s `title="…"` prop sets the native tooltip and leaves the heading out. `level` sets the heading level, 2 to 6, 3 by default.',
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

/** Several actions each take `slot="action"`, and sit in a centred row that wraps. */
export const WithActions: Story = {
    render: () =>
        html`<hmi-empty-state>
            ${searchIcon}
            <span slot="title">No projects yet</span>
            <span slot="description">Create one or import an existing project.</span>
            <hmi-button slot="action">Create</hmi-button>
            <hmi-button slot="action" variant="secondary">Import</hmi-button>
        </hmi-empty-state>`,
};

/** `level` picks the heading's tag, `<h2>` to `<h6>`, to fit the page's outline; it doesn't change its size. */
export const Level: Story = {
    args: { level: 2 },
    argTypes: {
        level: { control: 'select', options: [2, 3, 4, 5, 6] },
    },
    render: (args) =>
        html`<hmi-empty-state level=${args.level}>
            ${searchIcon}
            <span slot="title">No results</span>
            <span slot="description">The title is an h${args.level}.</span>
        </hmi-empty-state>`,
};

/** A long word or URL wraps inside the box. */
export const LongText: Story = {
    render: () =>
        html`<div style="max-width: calc(var(--hmi-base, 8px) * 32)">
            <hmi-empty-state>
                <span slot="title">No file named quarterly_report_final_v2_reviewed.xlsx</span>
                <span slot="description"
                    >https://example.com/shared/drive/reports/2026/quarterly_report_final_v2_reviewed.xlsx</span
                >
            </hmi-empty-state>
        </div>`,
};
