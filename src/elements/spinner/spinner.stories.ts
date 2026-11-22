import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './spinner.js';
import type { HmiSpinner } from './spinner.js';

type Args = Pick<HmiSpinner, 'size' | 'label'>;

const sizes = ['small', 'medium', 'large'] as const;
const base = (n: number) => `calc(var(--hmi-base, 8px) * ${n})`;

const meta = {
    title: 'Components/Feedback/Spinner',
    component: 'hmi-spinner',
    tags: ['autodocs'],
    args: { size: 'medium', label: 'Loading' },
    argTypes: {
        size: { control: 'inline-radio', options: sizes },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-spinner
            size=${args.size}
            label=${args.label}
        ></hmi-spinner>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Spinner } from \'@ninoverse/hmi-components/react/spinner\'` — `<Spinner size="large" label="Fetching" />`. `label` is announced, not drawn: name the spinner with it, since an `aria-label` on the host does nothing, and `label=""` makes it decorative. Under reduced motion it spins slower rather than stopping, and it turns clockwise in right-to-left text too.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Sizes: Story = {
    render: (args) => html`
        <div style="display: flex; gap: ${base(3)}; align-items: center">
            ${sizes.map(
                (size) =>
                    html`<hmi-spinner
                        size=${size}
                        label=${args.label}
                    ></hmi-spinner>`,
            )}
        </div>
    `,
};

/**
 * The ring is drawn from `currentColor`, so it takes the colour it sits in.
 * The arc shows the spin, so the colour needs 3:1 against what it sits on:
 * on the default light page `--secondary` is 4.55:1, `--tertiary` 3.43:1 and
 * `--error` 4.29:1, while `--primary` is 2.65:1.
 */
export const Inherited: Story = {
    render: (args) => html`
        <div style="display: flex; gap: ${base(3)}; align-items: center">
            <span style="color: var(--secondary)">
                <hmi-spinner label=${args.label}></hmi-spinner>
            </span>
            <span style="color: var(--error)">
                <hmi-spinner label=${args.label}></hmi-spinner>
            </span>
            <span style="color: var(--tertiary)">
                <hmi-spinner label=${args.label}></hmi-spinner>
            </span>
        </div>
    `,
};

/**
 * A `small` spinner composed into a button's `left-icon` slot. The button's
 * text already says what is busy, so the spinner is decorative, with
 * `label=""`: a label would join the button's name, as "Loading Saving".
 */
export const InButton: Story = {
    render: () => html`
        <hmi-button disabled>
            <hmi-spinner slot="left-icon" size="small" label=""></hmi-spinner>
            Saving
        </hmi-button>
    `,
};

/**
 * `label=""`: no status, hidden from assistive technology. Here the region
 * says it is loading, with `aria-busy`, so the spinner only shows it.
 */
export const Decorative: Story = {
    render: () => html`
        <section
            aria-busy="true"
            aria-label="Orders"
            style="display: flex; gap: ${base(1.5)}; align-items: center"
        >
            <hmi-spinner label=""></hmi-spinner>
            Loading orders…
        </section>
    `,
};

/**
 * A size the presets don't have: set the ring's `width`, `height` and
 * `border-width` on `::part(base)`.
 */
export const CustomSize: Story = {
    render: (args) => html`
        <style>
            .spinner-xl::part(base) {
                width: ${base(8)};
                height: ${base(8)};
                border-width: ${base(0.75)};
            }
        </style>
        <hmi-spinner class="spinner-xl" label=${args.label}></hmi-spinner>
    `,
};
