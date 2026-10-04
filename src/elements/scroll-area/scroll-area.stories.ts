import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './scroll-area.js';
import type { HmiScrollArea } from './scroll-area.js';

type Args = Pick<HmiScrollArea, 'orientation' | 'maxHeight'>;

const orientations = ['vertical', 'horizontal', 'both'] as const;

const lines = Array.from(
    { length: 20 },
    (_, i) =>
        html`<p style="margin: 0.5rem 0">Line ${i + 1} of the scrollable content.</p>`,
);

const meta = {
    title: 'Components/Layout/ScrollArea',
    component: 'hmi-scroll-area',
    tags: ['autodocs'],
    args: { orientation: 'vertical', maxHeight: 160 },
    argTypes: {
        orientation: { control: 'inline-radio', options: orientations },
        maxHeight: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-scroll-area
            orientation=${args.orientation}
            .maxHeight=${args.maxHeight}
            style="width: 24rem; outline: 1px dashed var(--outline-variant)"
        >
            ${lines}
        </hmi-scroll-area>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { ScrollArea } from '@ninoverse/hmi-components/react/scroll-area'` — `<ScrollArea maxHeight={160}>…</ScrollArea>`. A number is pixels, a string any CSS length. A CSS `max-height` on the host works too; `height` does not make it scroll.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** A string is any CSS length. */
export const CssLength: Story = { args: { maxHeight: '8rem' } };

export const Horizontal: Story = {
    args: { orientation: 'horizontal' },
    render: (args) =>
        html`<hmi-scroll-area
            orientation=${args.orientation}
            style="width: 20rem; outline: 1px dashed var(--outline-variant)"
        >
            <div style="width: 60rem; padding: 1rem">A very wide row of content that scrolls sideways.</div>
        </hmi-scroll-area>`,
};

export const Both: Story = {
    args: { orientation: 'both', maxHeight: 140 },
    render: (args) =>
        html`<hmi-scroll-area
            orientation=${args.orientation}
            .maxHeight=${args.maxHeight}
            style="width: 20rem; outline: 1px dashed var(--outline-variant)"
        >
            <div style="width: 50rem; height: 20rem; padding: 1rem">Scrolls in both directions.</div>
        </hmi-scroll-area>`,
};
