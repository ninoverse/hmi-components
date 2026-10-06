import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './accordion.js';
import type { AccordionItem, HmiAccordion } from './accordion.js';

type Args = Pick<HmiAccordion, 'items' | 'multiple' | 'open'>;

const ITEMS: AccordionItem[] = [
    {
        title: 'How do I install the library?',
        body: 'Run pnpm add @ninoverse/hmi-components, then import the components and the stylesheet.',
    },
    {
        title: 'What about the theme?',
        body: 'Import the theme CSS (constants + a color + a structure file). Components read the tokens at runtime.',
    },
    {
        title: 'Can I disable a section?',
        body: 'Yes: set disabled: true on the item.',
        disabled: true,
    },
];

const meta = {
    title: 'Components/DataDisplay/Accordion',
    component: 'hmi-accordion',
    tags: ['autodocs'],
    args: { items: ITEMS, multiple: false, open: [0] },
    argTypes: {
        items: { control: 'object' },
        multiple: { control: 'boolean' },
        open: { control: 'object' },
    },
    render: (args) =>
        html`<hmi-accordion
            style="max-width: 40rem"
            .items=${args.items}
            .open=${args.open}
            ?multiple=${args.multiple}
        ></hmi-accordion>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Accordion } from \'@ninoverse/hmi-components/react/accordion\'` — `<Accordion items={items} open={open} onOpenChange={(e) => setOpen(e.detail.open)} />`. `hmi-open-change` carries `{ open }`, the sorted open indices. A rich title or body is a child with `slot="title-<index>"` or `slot="body-<index>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Multiple: Story = { args: { multiple: true, open: [0, 1] } };

export const AllClosed: Story = { args: { open: [] } };

/** `slot="title-<index>"` and `slot="body-<index>"` replace an item's text. */
export const RichContent: Story = {
    args: { open: [0] },
    render: (args) =>
        html`<hmi-accordion style="max-width: 40rem" .items=${args.items} .open=${args.open}>
            <span slot="title-0">Install with <code>pnpm add</code></span>
            <div slot="body-0">See the <a href="#install">install guide</a> for details.</div>
        </hmi-accordion>`,
};
