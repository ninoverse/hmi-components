import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './banner.js';
import type { HmiBanner } from './banner.js';

type Args = Pick<HmiBanner, 'variant' | 'dismissible' | 'dismissLabel'>;

const variants = ['info', 'success', 'warning', 'danger'] as const;

const meta = {
    title: 'Components/Feedback/Banner',
    component: 'hmi-banner',
    tags: ['autodocs'],
    args: { variant: 'info', dismissible: false, dismissLabel: 'Dismiss' },
    argTypes: {
        variant: { control: 'inline-radio', options: variants },
        dismissible: { control: 'boolean' },
        dismissLabel: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-banner
            variant=${args.variant}
            ?dismissible=${args.dismissible}
            dismiss-label=${args.dismissLabel}
        >
            Your changes were saved.
        </hmi-banner>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Banner } from \'@ninoverse/hmi-components/react/banner\'` — `<Banner variant="success" dismissible onDismiss={hide}><span slot="title">Saved</span>All set.</Banner>`. `title`, `icon` and `action` are slots, not props; `onDismiss` becomes `hmi-dismiss`, and without `preventDefault()` the banner hides itself.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Variants: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem">
            ${variants.map(
                (variant) =>
                    html`<hmi-banner variant=${variant}>
                        <span slot="title">${variant}</span>
                        A message in the ${variant} tone.
                    </hmi-banner>`,
            )}
        </div>
    `,
};

export const WithAction: Story = {
    args: { variant: 'warning' },
    render: (args) =>
        html`<hmi-banner variant=${args.variant}>
            <span slot="title">Update available</span>
            A new version is ready to install.
            <hmi-button slot="action" size="small">Update</hmi-button>
        </hmi-banner>`,
};

/** The X button fires the cancelable `hmi-dismiss`; the banner then hides itself. */
export const Dismissible: Story = {
    args: { variant: 'success', dismissible: true },
    render: (args) =>
        html`<hmi-banner variant=${args.variant} dismissible>
            <span slot="title">Saved</span>
            All changes were stored.
        </hmi-banner>`,
};

/** `preventDefault()` on `hmi-dismiss` keeps the banner on screen. */
export const CancelledDismiss: Story = {
    args: { variant: 'danger', dismissible: true },
    render: (args) =>
        html`<hmi-banner
            variant=${args.variant}
            dismissible
            @hmi-dismiss=${(e: Event) => e.preventDefault()}
        >
            <span slot="title">Cannot be closed</span>
            The listener cancels the dismissal.
        </hmi-banner>`,
};

/** A slotted `svg` replaces the built-in status icon. */
export const CustomIcon: Story = {
    render: (args) =>
        html`<hmi-banner variant=${args.variant}>
            <svg
                slot="icon"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                aria-hidden="true"
            >
                <path d="M10 2l2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8z" />
            </svg>
            Starred.
        </hmi-banner>`,
};
