import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../avatar/avatar.js';
import '../button/button.js';
import '../link/link.js';
import './hover-card.js';
import type {
    HmiHoverCard,
    HoverCardAlign,
    HoverCardSide,
} from './hover-card.js';

type Args = Pick<
    HmiHoverCard,
    'side' | 'align' | 'openDelay' | 'closeDelay' | 'width' | 'open'
>;

// The hover card owns `open`: the pointer and focus change it, so a story needs
// no wiring.
const meta = {
    title: 'Components/Overlays/HoverCard',
    component: 'hmi-hover-card',
    tags: ['autodocs'],
    args: {
        side: 'bottom' as HoverCardSide,
        align: 'center' as HoverCardAlign,
        openDelay: 300,
        closeDelay: 150,
        width: undefined,
        open: false,
    },
    argTypes: {
        side: {
            control: 'inline-radio',
            options: ['top', 'bottom', 'left', 'right'],
        },
        align: {
            control: 'inline-radio',
            options: ['start', 'center', 'end'],
        },
        openDelay: { control: 'number' },
        closeDelay: { control: 'number' },
        width: { control: 'text' },
        open: { control: 'boolean' },
    },
    render: (args) =>
        html`<div style="padding: 64px 32px 160px; display: flex; justify-content: center">
            <hmi-hover-card
                side=${args.side}
                align=${args.align}
                open-delay=${args.openDelay}
                close-delay=${args.closeDelay}
                .width=${args.width}
                ?open=${args.open}
            >
                <hmi-button slot="trigger" variant="ghost">Hover me</hmi-button>
                <span>Anchored below the trigger and centred on it.</span>
            </hmi-hover-card>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { HoverCard } from \'@ninoverse/hmi-components/react/hover-card\'` — `<HoverCard><Link slot="trigger" href="#">@ada</Link>Content</HoverCard>`. The trigger is the `trigger` slot. The element owns `open`: it follows the pointer and focus.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** The card stays open while the pointer moves into it, and Tab reaches the content from the trigger. */
export const RichContent: Story = {
    args: { align: 'start' },
    render: (args) =>
        html`<div style="padding: 64px 32px 160px">
            <hmi-hover-card side=${args.side} align=${args.align}>
                <hmi-link slot="trigger" href="#hovercard">@nino</hmi-link>
                <div style="display: flex; gap: 12px; align-items: center">
                    <hmi-avatar name="Nino Verse" size="large"></hmi-avatar>
                    <div style="display: flex; flex-direction: column; gap: 4px">
                        <strong>Nino Verse</strong>
                        <span style="color: var(--on-surface-variant)">
                            Building the HMI component library. Hover and move in —
                            this card stays open so you can click inside.
                        </span>
                    </div>
                </div>
            </hmi-hover-card>
        </div>`,
};

/** `side` and `align` place the card against the trigger; `width` fixes its width. */
export const Sides: Story = {
    render: () =>
        html`<div style="display: flex; gap: 64px; flex-wrap: wrap; align-items: center; justify-content: center; padding: 96px 32px">
            <hmi-hover-card side="top" align="start">
                <hmi-button slot="trigger" variant="ghost">Top</hmi-button>
                <span>Above the trigger, aligned to its left edge.</span>
            </hmi-hover-card>
            <hmi-hover-card side="right" width="280">
                <hmi-button slot="trigger" variant="ghost">Right</hmi-button>
                <span>To the right, centred, with a fixed 280px width.</span>
            </hmi-hover-card>
            <hmi-hover-card side="left" align="end">
                <hmi-button slot="trigger" variant="ghost">Left</hmi-button>
                <span>To the left, end-aligned.</span>
            </hmi-hover-card>
        </div>`,
};

/** `open-delay` and `close-delay` default to 300 ms and 150 ms. */
export const NoDelay: Story = {
    args: { openDelay: 0, closeDelay: 0 },
    render: (args) =>
        html`<div style="padding: 64px 32px 160px; display: flex; justify-content: center">
            <hmi-hover-card open-delay=${args.openDelay} close-delay=${args.closeDelay}>
                <hmi-button slot="trigger" variant="ghost">Snappy</hmi-button>
                <span>Zero open and close delay.</span>
            </hmi-hover-card>
        </div>`,
};
