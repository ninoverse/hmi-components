import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './blockquote.js';

const meta = {
    title: 'Components/Typography/Blockquote',
    component: 'hmi-blockquote',
    tags: ['autodocs'],
    render: () =>
        html`<hmi-blockquote>
            That brain of mine is something more than mortal.
        </hmi-blockquote>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Blockquote } from \'@ninoverse/hmi-components/react/blockquote\'` — `<Blockquote source="https://…">Quote<span slot="cite">Ada Lovelace</span></Blockquote>`. `cite` is a slot, not a prop: slot a `span`, not a `footer`, which would add a page landmark. `source` is the URL of the quote\'s source.',
            },
        },
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithCitation: Story = {
    render: () =>
        html`<hmi-blockquote>
            That brain of mine is something more than mortal.
            <span slot="cite">— Ada Lovelace</span>
        </hmi-blockquote>`,
};

/** `source` sets the native `cite` URL of the inner `<blockquote>`. */
export const WithSource: Story = {
    render: () =>
        html`<hmi-blockquote
            source="https://en.wikipedia.org/wiki/The_Little_Prince"
        >
            It is only with the heart that one can see rightly.
            <span slot="cite">— Antoine de Saint-Exupéry, The Little Prince</span>
        </hmi-blockquote>`,
};

/** Block content: slotted paragraphs keep a gap between them and no outer margin. */
export const Paragraphs: Story = {
    render: () =>
        html`<hmi-blockquote>
            <p>It is only with the heart that one can see rightly.</p>
            <p>What is essential is invisible to the eye.</p>
            <span slot="cite">— Antoine de Saint-Exupéry, The Little Prince</span>
        </hmi-blockquote>`,
};
