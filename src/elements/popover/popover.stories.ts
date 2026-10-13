import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './popover.js';
import type { HmiPopover, PopoverAlign } from './popover.js';

type Args = Pick<HmiPopover, 'align' | 'width' | 'open'>;

// The popover owns `open`: a press on the trigger, an outside click and Escape
// change it, so a story needs no wiring.
const meta = {
    title: 'Components/Overlays/Popover',
    component: 'hmi-popover',
    tags: ['autodocs'],
    args: { align: 'start' as PopoverAlign, width: undefined, open: false },
    argTypes: {
        align: { control: 'inline-radio', options: ['start', 'end'] },
        width: { control: 'text' },
        open: { control: 'boolean' },
    },
    render: (args) =>
        html`<div style="padding: 24px 0 160px; display: flex; justify-content: center">
            <hmi-popover align=${args.align} .width=${args.width} ?open=${args.open}>
                <hmi-button slot="trigger" variant="secondary">Open popover</hmi-button>
                <div style="display: flex; flex-direction: column; gap: 6px">
                    <strong>Anchored to the trigger</strong>
                    <span style="color: var(--on-surface-variant)">
                        Click outside or press Escape to dismiss.
                    </span>
                </div>
            </hmi-popover>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { Popover } from '@ninoverse/hmi-components/react/popover'` — `<Popover open={open} onOpenChange={(e) => setOpen(e.detail.open)}><Button slot=\"trigger\">Open</Button>Content</Popover>`. The trigger is the `trigger` slot. The element owns `open`, so the browser's outside click and Escape close it.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** `align="end"` ends the panel at the trigger's right edge. */
export const AlignEnd: Story = {
    args: { align: 'end', width: 320 },
    render: (args) =>
        html`<div style="padding: 24px 0 160px; display: flex; justify-content: flex-end">
            <hmi-popover align=${args.align} .width=${args.width}>
                <hmi-button slot="trigger" variant="secondary">Open (end)</hmi-button>
                <div style="display: flex; flex-direction: column; gap: 6px">
                    <strong>End aligned</strong>
                    <span style="color: var(--on-surface-variant)">
                        Anchored to the trigger's right edge, with a minimum width.
                    </span>
                </div>
            </hmi-popover>
        </div>`,
};

/** `width` is the panel's minimum width: a number of px, or any CSS length. */
export const CustomWidth: Story = {
    args: { width: '30em' },
};
