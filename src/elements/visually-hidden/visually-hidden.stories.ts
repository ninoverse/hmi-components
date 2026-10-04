import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './visually-hidden.js';

const meta = {
    title: 'Components/Layout/VisuallyHidden',
    component: 'hmi-visually-hidden',
    tags: ['autodocs'],
    render: () =>
        html`<p>
            Visible text, then
            <hmi-visually-hidden>text only a screen reader announces</hmi-visually-hidden>
            and more visible text. Nothing is missing on screen.
        </p>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { VisuallyHidden } from '@ninoverse/hmi-components/react/visually-hidden'` — `<VisuallyHidden>Search</VisuallyHidden>`. There is no `as` prop: wrap the host, as in `<h2><VisuallyHidden>Title</VisuallyHidden></h2>`.",
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

/** An icon-only button gets its accessible name from the hidden text. */
export const IconButtonLabel: Story = {
    render: () =>
        html`<hmi-button variant="soft">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" width="20" height="20"><circle cx="9" cy="9" r="5" /><path d="M13 13l4 4" /></svg>
            <hmi-visually-hidden>Search</hmi-visually-hidden>
        </hmi-button>`,
};

/** Wrapping the host keeps the heading's semantics and outline. */
export const InsideHeading: Story = {
    render: () =>
        html`<h2><hmi-visually-hidden>Account settings</hmi-visually-hidden></h2>
            <p>The heading above is in the page outline but draws nothing.</p>`,
};
