import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './confirm-dialog.js';
import type {
    ConfirmDialogVariant,
    HmiConfirmDialog,
} from './confirm-dialog.js';

type Args = Pick<
    HmiConfirmDialog,
    | 'heading'
    | 'description'
    | 'confirmLabel'
    | 'cancelLabel'
    | 'variant'
    | 'loading'
    | 'confirmDisabled'
    | 'confirmOnButton'
>;

// The dialog is controlled: a story opens it from a button and closes it from
// `hmi-cancel` and `hmi-confirm`. Closed by default, so the autodocs page, which
// mounts every story at once, does not stack scrims.
const open = (event: Event) => {
    const dialog = (event.currentTarget as HTMLElement)
        .nextElementSibling as HmiConfirmDialog;
    dialog.open = true;
};
const close = (event: Event) => {
    (event.currentTarget as HmiConfirmDialog).open = false;
};

const meta = {
    title: 'Components/Overlays/ConfirmDialog',
    component: 'hmi-confirm-dialog',
    tags: ['autodocs'],
    args: {
        heading: 'Delete this project?',
        description: 'This action cannot be undone.',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger' as ConfirmDialogVariant,
        loading: false,
        confirmDisabled: false,
        confirmOnButton: false,
    },
    argTypes: {
        heading: { control: 'text' },
        description: { control: 'text' },
        confirmLabel: { control: 'text' },
        cancelLabel: { control: 'text' },
        variant: { control: 'inline-radio', options: ['default', 'danger'] },
        loading: { control: 'boolean' },
        confirmDisabled: { control: 'boolean' },
        confirmOnButton: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-button variant=${args.variant === 'danger' ? 'danger' : 'primary'} @click=${open}>Open dialog</hmi-button>
            <hmi-confirm-dialog
                heading=${args.heading}
                description=${args.description}
                confirm-label=${args.confirmLabel}
                cancel-label=${args.cancelLabel}
                variant=${args.variant}
                ?loading=${args.loading}
                ?confirm-disabled=${args.confirmDisabled}
                ?confirm-on-button=${args.confirmOnButton}
                @hmi-cancel=${close}
                @hmi-confirm=${close}
            ></hmi-confirm-dialog>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { ConfirmDialog } from \'@ninoverse/hmi-components/react/confirm-dialog\'` — `<ConfirmDialog open={open} heading="Delete?" variant="danger" onCancel={close} onConfirm={remove} />`. The dialog is controlled: it never closes itself, so set `open` to `false` from `hmi-cancel` and `hmi-confirm`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Danger: Story = {};

export const Default: Story = {
    args: {
        heading: 'Publish this post?',
        description: 'It will be visible to anyone with the link.',
        confirmLabel: 'Publish',
        variant: 'default',
    },
};

/** While the work runs, `loading` disables both buttons; confirm keeps the dialog open until the consumer closes it. */
export const Loading: Story = {
    args: { loading: true },
};

/** The `title`, `confirm-label` and `cancel-label` slots take rich content. */
export const WithSlots: Story = {
    render: () =>
        html`<hmi-button @click=${open}>Open dialog</hmi-button>
            <hmi-confirm-dialog @hmi-cancel=${close} @hmi-confirm=${close}>
                <span slot="title">Discard <em>unsaved</em> changes?</span>
                <span slot="description">Your edits will be lost.</span>
                <span slot="confirm-label">Discard</span>
                <span slot="cancel-label">Keep editing</span>
            </hmi-confirm-dialog>`,
};
