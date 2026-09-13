import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './code.js';
import type { HmiCode } from './code.js';

type Args = Pick<HmiCode, 'block'>;

const snippet = `import { Code } from '@ninoverse/hmi-components';

export function Example() {
    return <Code block>{'const x = 42;'}</Code>;
}`;

const meta = {
    title: 'Components/Typography/Code',
    component: 'hmi-code',
    tags: ['autodocs'],
    args: { block: false },
    argTypes: {
        block: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-code ?block=${args.block}>pnpm add @ninoverse/hmi-components</hmi-code>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { Code } from '@ninoverse/hmi-components/react/code'` — `<Code>npm i</Code>` inline, `<Code block>` for a snippet.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Inline is the default: a tinted chip that sits within running text. */
export const Inline: Story = {
    render: (args) => html`
        <p>
            Install with
            <hmi-code ?block=${args.block}
                >pnpm add @ninoverse/hmi-components</hmi-code
            >
            then import the <hmi-code>Code</hmi-code> component.
        </p>
    `,
};

/** `block` renders `<pre><code>` for multi-line snippets. */
export const Block: Story = {
    args: { block: true },
    render: () => html`<hmi-code block>${snippet}</hmi-code>`,
};
