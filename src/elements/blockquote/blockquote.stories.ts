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
                    'React: `import { Blockquote } from \'@ninoverse/hmi-components/react/blockquote\'` — `<Blockquote>Quote<span slot="cite">Ada Lovelace</span></Blockquote>`. `cite` is a slot, not a prop.',
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

/** A slotted `footer` keeps the attribution's native semantics. */
export const FooterCitation: Story = {
    render: () =>
        html`<hmi-blockquote>
            It is only with the heart that one can see rightly.
            <footer slot="cite">— Antoine de Saint-Exupéry, The Little Prince</footer>
        </hmi-blockquote>`,
};
