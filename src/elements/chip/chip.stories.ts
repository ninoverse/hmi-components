import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './chip.js';
import type { HmiChip } from './chip.js';

type Args = Pick<
    HmiChip,
    'selected' | 'selectable' | 'closable' | 'closeLabel'
>;

const meta = {
    title: 'Components/Data display/Chip',
    component: 'hmi-chip',
    tags: ['autodocs'],
    args: {
        selected: false,
        selectable: false,
        closable: false,
        closeLabel: 'Remove',
    },
    argTypes: {
        selected: { control: 'boolean' },
        selectable: { control: 'boolean' },
        closable: { control: 'boolean' },
        closeLabel: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-chip
            ?selected=${args.selected}
            ?selectable=${args.selectable}
            ?closable=${args.closable}
            close-label=${args.closeLabel}
            >Filter</hmi-chip
        >`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { Chip } from '@ninoverse/hmi-components/react/chip'` — `<Chip selectable closable selected={on} onSelect={toggle} onClose={remove}>Filter</Chip>`. `selectable` and `closable` replace the presence of `onSelect` and `onClose`; both events are cancelable, and without `preventDefault()` the chip flips `selected` or hides itself.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Selected: Story = { args: { selected: true } };

/** `selectable` turns the label into a toggle button. Click it. */
export const Selectable: Story = { args: { selectable: true } };

export const Closable: Story = { args: { closable: true } };

export const SelectableAndClosable: Story = {
    args: { selectable: true, closable: true, selected: true },
};

/** A slotted `svg` is the leading icon. */
export const WithIcon: Story = {
    render: (args) =>
        html`<hmi-chip ?selected=${args.selected} selectable closable>
            <svg
                slot="icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path d="M2 4h12M4 8h8M6 12h4" />
            </svg>
            Sort
        </hmi-chip>`,
};

/** `preventDefault()` on `hmi-close` keeps the chip on screen. */
export const CancelledClose: Story = {
    render: () =>
        html`<hmi-chip closable @hmi-close=${(e: Event) => e.preventDefault()}
            >Pinned</hmi-chip
        >`,
};
