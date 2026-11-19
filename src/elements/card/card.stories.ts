import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../heading/heading.js';
import '../link/link.js';
import '../text/text.js';
import './card.js';
import type { HmiCard } from './card.js';

type Args = Pick<HmiCard, 'variant' | 'active'>;

const variants = ['default', 'flat', 'ink', 'accent'] as const;

/* Matches the markup the React demo puts inside <Card> (src/App.tsx), so the
   two render identically in the side-by-side screenshot. The ink and accent
   surfaces invert, so their body copy inherits the card's colour instead of
   taking the muted role. */
const body = (title: string, copy: string, muted = true) => html`
    <h3 style="margin: 0; font-size: 2.25rem; font-weight: 700">${title}</h3>
    <p
        style="margin: 0.75rem 0 0; font-size: 1.75rem${
            muted ? '; color: var(--on-surface-variant)' : ''
        }"
    >
        ${copy}
    </p>
`;

const meta = {
    title: 'Components/Layout/Card',
    component: 'hmi-card',
    tags: ['autodocs'],
    args: { variant: 'default', active: false },
    argTypes: {
        variant: { control: 'select', options: variants },
        active: { control: 'boolean' },
    },
    render: (args) => html`
        <hmi-card
            variant=${args.variant}
            ?active=${args.active}
            style="max-width: 45rem"
        >
            ${body(
                'Default',
                'Elevated warm surface with the asymmetric leaf corner shape.',
            )}
        </hmi-card>
    `,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Card } from \'@ninoverse/hmi-components/react/card\'` — `<Card variant="accent">…</Card>`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

const grid =
    'display: grid; grid-template-columns: repeat(2, minmax(0, 45rem)); gap: 2.5rem';

export const Variants: Story = {
    render: () => html`
        <div style=${grid}>
            <hmi-card>
                ${body(
                    'Default',
                    'Elevated warm surface with the asymmetric leaf corner shape.',
                )}
            </hmi-card>
            <hmi-card variant="flat">
                ${body(
                    'Flat',
                    'Same shape, no shadow — for cards inside a scrolling list or grid.',
                )}
            </hmi-card>
            <hmi-card variant="ink">
                ${body(
                    'Ink',
                    'High-contrast dark surface for callouts and hero sections.',
                    false,
                )}
            </hmi-card>
            <hmi-card variant="accent">
                ${body(
                    'Accent',
                    'Primary tonal fill — pairs with the Badge / Chip primary variants.',
                    false,
                )}
            </hmi-card>
        </div>
    `,
};

/**
 * `active` lifts and outlines the card to mark it selected, and draws a ring in
 * forced colours. It is visual only: the control that selects the card says so
 * to assistive technology, with `aria-current` or `aria-selected`.
 */
export const Active: Story = {
    args: { active: true },
    render: (args) => html`
        <hmi-card ?active=${args.active} style="max-width: 45rem">
            ${body(
                'Active',
                'Lifted off the page to mark the active / selected card.',
            )}
        </hmi-card>
    `,
};

/**
 * `header` and `footer` pin content above and below the body regardless of DOM
 * order. They are structural only — the card adds no rule and no spacing of its
 * own, so the content brings its own margins, or the page sets them on
 * `::part(header)` and `::part(footer)`, as the `PartSpacing` story does.
 */
export const WithHeaderAndFooter: Story = {
    render: () => html`
        <hmi-card style="max-width: 45rem">
            <p
                slot="footer"
                style="margin: 1.5rem 0 0; font-size: 1.5rem; color: var(--on-surface-variant)"
            >
                Updated 3 minutes ago
            </p>
            ${body(
                'Body',
                'Slotted last in the DOM, still rendered in the middle.',
            )}
            <h4
                slot="header"
                style="margin: 0 0 1.5rem; font-size: 1.375rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--on-surface-variant)"
            >
                Telemetry
            </h4>
        </hmi-card>
    `,
};

/**
 * On `ink` and `accent`, `hmi-heading`, `hmi-text` and `hmi-link` take the
 * card's text colours, through `--on-panel`, `--on-panel-variant` and
 * `--on-panel-link`.
 */
export const WithTextElements: Story = {
    render: () => html`
        <div style=${grid}>
            ${(['default', 'ink', 'accent'] as const).map(
                (variant) => html`
                    <hmi-card variant=${variant}>
                        <hmi-heading slot="header" level="3" size="small"
                            >Line 3</hmi-heading
                        >
                        <hmi-text>Running at 92% of its rated output.</hmi-text>
                        <hmi-text tone="muted" size="small"
                            >Updated 3 minutes ago</hmi-text
                        >
                        <hmi-link slot="footer" href="#">Open the line</hmi-link>
                    </hmi-card>
                `,
            )}
        </div>
    `,
};

/** The header and footer slots are boxes, so their parts take spacing and rules. */
export const PartSpacing: Story = {
    render: () => html`
        <style>
            .part-spacing::part(header) {
                padding-bottom: calc(var(--hmi-base) * 1.5);
                margin-bottom: calc(var(--hmi-base) * 1.5);
                border-bottom: 1px solid var(--outline-variant);
            }
            .part-spacing::part(footer) {
                margin-top: calc(var(--hmi-base) * 2);
            }
        </style>
        <hmi-card class="part-spacing" style="max-width: 45rem">
            <hmi-heading slot="header" level="3" size="small">Telemetry</hmi-heading>
            <hmi-text>Spindle load, temperature and vibration, sampled each second.</hmi-text>
            <hmi-link slot="footer" href="#">Open the history</hmi-link>
        </hmi-card>
    `,
};
