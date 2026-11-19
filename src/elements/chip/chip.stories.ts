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
                    "React: `import { Chip } from '@ninoverse/hmi-components/react/chip'` — `<Chip selectable closable selected={on} onSelect={toggle} onDismiss={remove}>Filter</Chip>`. `selectable` and `closable` replace the presence of `onSelect` and v5's `onClose`, which is `onDismiss` here, as on `Banner`. Both events are cancelable: a click flips `selected` before `hmi-select`, and `preventDefault()` puts it back; without `preventDefault()`, `hmi-dismiss` hides the chip. The remove button is named `closeLabel` followed by the label, such as `Remove Filter`.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** A selected chip shows a check mark, so the state doesn't rest on colour.
Without `selectable` it is only that look: screen readers get no state. */
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

/** `preventDefault()` on `hmi-dismiss` keeps the chip on screen. */
export const CancelledDismiss: Story = {
    render: () =>
        html`<hmi-chip closable @hmi-dismiss=${(e: Event) => e.preventDefault()}
            >Pinned</hmi-chip
        >`,
};

/** The label keeps to one line, and ends in an ellipsis when the chip is
wider than its box. */
export const LongLabel: Story = {
    args: { selectable: true, closable: true },
    render: (args) =>
        html`<div style="width: 180px">
            <hmi-chip
                ?selected=${args.selected}
                ?selectable=${args.selectable}
                ?closable=${args.closable}
                close-label=${args.closeLabel}
                >A rather long filter label</hmi-chip
            >
        </div>`,
};

/** Focus was on the remove button, which goes with the chip: the listener
moves it to the next chip's, or the previous one's for the last. */
export const FocusAfterDismiss: Story = {
    render: () =>
        html`<div
            style="display: flex; gap: 8px"
            @hmi-dismiss=${(e: Event) => {
                const chip = e.target as HTMLElement;
                const next = (chip.nextElementSibling ??
                    chip.previousElementSibling) as HTMLElement | null;
                next?.shadowRoot
                    ?.querySelector<HTMLElement>('[part="close"]')
                    ?.focus();
            }}
        >
            <hmi-chip closable>Alpha</hmi-chip>
            <hmi-chip closable>Beta</hmi-chip>
            <hmi-chip closable>Gamma</hmi-chip>
        </div>`,
};
