import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './code.js';
import type { HmiCode } from './code.js';

type Args = Pick<HmiCode, 'block'>;

const snippet = `import { Code } from '@ninoverse/hmi-components/react/code';

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

/** A block keeps the snippet's whitespace as written, and unlike a native
    `<pre>` it cannot drop a newline right after its opening tag. Start the
    snippet on the tag's line, as the first block does; the second, written
    on a new line and indented, shows an empty first line and the indent. */
export const Whitespace: Story = {
    render: () => html`
        <hmi-code block>const x = 1;
const y = 2;</hmi-code>
        <br />
        <hmi-code block>
            const x = 1;
            const y = 2;
        </hmi-code>
    `,
};

/** Code reads left to right in right-to-left text, and a line wider than
    its box scrolls: Tab reaches the block, and the arrow keys scroll it. */
export const RightToLeft: Story = {
    render: () => html`
        <div dir="rtl" lang="ar" style="max-width: 320px">
            <p>
                ثبّت الحزمة بالأمر
                <hmi-code>pnpm add @ninoverse/hmi-components</hmi-code>
                ثم استوردها.
            </p>
            <hmi-code block>const message = 'longer than the box it sits in';</hmi-code>
        </div>
    `,
};
