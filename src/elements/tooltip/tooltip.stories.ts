import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './tooltip.js';
import type { HmiTooltip, TooltipSide } from './tooltip.js';

type Args = Pick<HmiTooltip, 'label' | 'side' | 'delay' | 'open'>;

// The tooltip owns `open`: the pointer and focus change it, so a story needs no
// wiring.
const meta = {
    title: 'Components/Overlays/Tooltip',
    component: 'hmi-tooltip',
    tags: ['autodocs'],
    args: {
        label: 'On top',
        side: 'top' as TooltipSide,
        delay: 200,
        open: false,
    },
    argTypes: {
        label: { control: 'text' },
        side: {
            control: 'inline-radio',
            options: ['top', 'bottom', 'left', 'right'],
        },
        delay: { control: 'number' },
        open: { control: 'boolean' },
    },
    render: (args) =>
        html`<div style="padding: 64px 32px; display: flex; justify-content: center">
            <hmi-tooltip
                label=${args.label}
                side=${args.side}
                delay=${args.delay}
                ?open=${args.open}
            >
                <hmi-button slot="trigger" variant="secondary">Hover me</hmi-button>
            </hmi-tooltip>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Tooltip } from \'@ninoverse/hmi-components/react/tooltip\'` — `<Tooltip label="Copy"><Button slot="trigger">Copy</Button></Tooltip>`. The trigger is the `trigger` slot, and rich content is the `label` slot. The element owns `open`: it follows the pointer and focus.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** `side` puts the bubble above, below, left or right of the trigger. */
export const Sides: Story = {
    render: () =>
        html`<div style="display: flex; gap: 48px; flex-wrap: wrap; align-items: center; justify-content: center; padding: 64px 32px">
            <hmi-tooltip label="On top" side="top">
                <hmi-button slot="trigger" variant="secondary">Top</hmi-button>
            </hmi-tooltip>
            <hmi-tooltip label="Below" side="bottom">
                <hmi-button slot="trigger" variant="secondary">Bottom</hmi-button>
            </hmi-tooltip>
            <hmi-tooltip label="To the left" side="left">
                <hmi-button slot="trigger" variant="secondary">Left</hmi-button>
            </hmi-tooltip>
            <hmi-tooltip label="To the right" side="right">
                <hmi-button slot="trigger" variant="secondary">Right</hmi-button>
            </hmi-tooltip>
        </div>`,
};

/** `delay` is the dwell before the bubble shows, in ms. */
export const NoDelay: Story = {
    args: { label: 'Snappy (0ms delay)', delay: 0 },
};

/** The `label` slot holds rich content. It gets no `aria-description` of its own. */
export const RichLabel: Story = {
    render: () =>
        html`<div style="padding: 64px 32px; display: flex; justify-content: center">
            <hmi-tooltip>
                <hmi-button slot="trigger" variant="secondary">Shortcut</hmi-button>
                <span slot="label">Save <strong>Ctrl</strong> + <strong>S</strong></span>
            </hmi-tooltip>
        </div>`,
};
