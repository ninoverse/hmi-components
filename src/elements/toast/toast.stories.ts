import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../button/button.js';
import './toast.js';
import type { HmiToast, ToastDismissDetail } from './toast.js';
import { toast } from './toast.js';

type Args = Pick<HmiToast, 'dismissLabel'>;

/* Toast has no rendered subject: the `toast` object pushes onto a module-level
   queue and <hmi-toast> shows it. Every story mounts the stack and drives it from
   buttons. The queue is module-global, so toasts raised here outlive a move to
   another story: durations are kept short for that reason. */
const meta = {
    title: 'Components/Feedback/Toast',
    component: 'hmi-toast',
    tags: ['autodocs'],
    args: { dismissLabel: 'Dismiss' },
    argTypes: { dismissLabel: { control: 'text' } },
    render: (args) =>
        html`<hmi-toast dismiss-label=${ifDefined(args.dismissLabel)}></hmi-toast>
            <div style="display: flex; gap: 16px; flex-wrap: wrap">
                <hmi-button
                    variant="soft"
                    @click=${() =>
                        toast.info(
                            'New version available',
                            'Reload to pick up the latest build.',
                        )}
                    >Info</hmi-button
                >
                <hmi-button
                    variant="primary"
                    @click=${() =>
                        toast.success('Saved', 'Changes synced to the cloud.')}
                    >Success</hmi-button
                >
                <hmi-button
                    variant="secondary"
                    @click=${() =>
                        toast.warning(
                            'Low storage',
                            '1.2 GB free on this device.',
                        )}
                    >Warning</hmi-button
                >
                <hmi-button
                    variant="danger"
                    @click=${() =>
                        toast.danger(
                            'Upload failed',
                            'Could not reach the server.',
                        )}
                    >Danger</hmi-button
                >
            </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { ToastHost, toast } from '@ninoverse/hmi-components/react/toast'` — mount `<ToastHost />` once, then `toast.success('Saved', 'Changes are live.')` from anywhere. Plain HTML: `import { toast } from '@ninoverse/hmi-components/wc/toast'`, or `HmiElements.toast` in the drop-in bundle. While a modal dialog is open the stack is inert and under its scrim: see the class docs.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Variants: Story = {};

/** `duration: 0` disables auto-dismiss: the toast's own close button clears it. */
export const Sticky: Story = {
    render: () =>
        html`<hmi-toast></hmi-toast>
            <hmi-button
                variant="ghost"
                @click=${() =>
                    toast.info('Sticky toast', 'Stays until dismissed.', {
                        duration: 0,
                    })}
                >Show sticky toast</hmi-button
            >`,
};

/** `duration` is in milliseconds and defaults to 4000. The clock stops while the pointer is over a toast or focus is inside it. */
export const ShortDuration: Story = {
    render: () =>
        html`<hmi-toast></hmi-toast>
            <hmi-button
                variant="primary"
                @click=${() =>
                    toast.success('Gone in a flash', undefined, {
                        duration: 1500,
                    })}
                >Show 1.5s toast</hmi-button
            >`,
};

/** A `title` or a `body` can be a DOM node the caller built, for richer content. */
export const RichContent: Story = {
    render: () =>
        html`<hmi-toast></hmi-toast>
            <hmi-button
                @click=${() => {
                    const link = document.createElement('a');
                    link.href = '#undo';
                    link.textContent = 'Undo';
                    toast.info('Message archived', link, { duration: 8000 });
                }}
                >Show a toast with a link</hmi-button
            >`,
};

/** The close button asks with a cancelable `hmi-dismiss`: this toast cannot be closed by hand. */
export const DismissVeto: Story = {
    render: () =>
        html`<hmi-toast
                @hmi-dismiss=${(event: CustomEvent<ToastDismissDetail>) =>
                    event.preventDefault()}
            ></hmi-toast>
            <hmi-button
                variant="danger"
                @click=${() =>
                    toast.danger('Session expired', 'Sign in again to go on.', {
                        duration: 6000,
                    })}
                >Show a toast that stays</hmi-button
            >`,
};
