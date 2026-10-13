import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './modal.js';
import type { DialogAction, HmiModal, ModalSize } from './modal.js';

type Args = Pick<
    HmiModal,
    'size' | 'heading' | 'description' | 'actions' | 'label'
>;

const ACTIONS: DialogAction[] = [
    { label: 'Cancel', value: 'cancel', variant: 'secondary' },
    { label: 'Publish', value: 'publish', variant: 'primary' },
];

// The modal is controlled: a story opens it from a button and closes it from
// `hmi-close` and `hmi-action`. Closed by default, so the autodocs page, which
// mounts every story at once, does not stack scrims.
const open = (event: Event) => {
    const modal = (event.currentTarget as HTMLElement)
        .nextElementSibling as HmiModal;
    modal.open = true;
};
const close = (event: Event) => {
    (event.currentTarget as HmiModal).open = false;
};

const meta = {
    title: 'Components/Overlays/Modal',
    component: 'hmi-modal',
    tags: ['autodocs'],
    args: {
        size: 'medium' as ModalSize,
        heading: 'Confirm publish',
        description: 'This will make the post visible to anyone with the link.',
        actions: ACTIONS,
        label: '',
    },
    argTypes: {
        size: { control: 'inline-radio', options: ['medium', 'large'] },
        heading: { control: 'text' },
        description: { control: 'text' },
        actions: { control: 'object' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-button @click=${open}>Open modal</hmi-button>
            <hmi-modal
                size=${args.size}
                heading=${args.heading}
                description=${args.description}
                label=${args.label}
                .actions=${args.actions}
                @hmi-close=${close}
                @hmi-action=${close}
            >
                <p style="margin: 0; color: var(--on-surface-variant)">
                    You can change visibility back to private at any time from
                    the post's settings menu.
                </p>
            </hmi-modal>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Modal } from \'@ninoverse/hmi-components/react/modal\'` — `<Modal open={open} heading="Confirm" onClose={() => setOpen(false)} actions={actions} onAction={(e) => …}>…</Modal>`. The modal is controlled: it never closes itself, so set `open` to `false` from `hmi-close`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Large: Story = {
    args: { size: 'large', heading: 'Terms of service', description: '' },
};

/** The `title`, `description` and `actions` slots replace the plain-text and array defaults. */
export const WithSlots: Story = {
    render: () =>
        html`<hmi-button @click=${open}>Open modal</hmi-button>
            <hmi-modal @hmi-close=${close}>
                <span slot="title">Edit <em>profile</em></span>
                <span slot="description">Changes apply as soon as you save.</span>
                <label style="display: grid; gap: 8px">
                    Name
                    <input value="Ada Lovelace" />
                </label>
                <hmi-button slot="actions" variant="ghost" @click=${(e: Event) => close({ currentTarget: (e.target as HTMLElement).closest('hmi-modal') } as unknown as Event)}>Cancel</hmi-button>
                <hmi-button slot="actions" variant="primary">Save</hmi-button>
            </hmi-modal>`,
};

/** With no title, `label` names the dialog for assistive technology. */
export const WithoutTitle: Story = {
    args: { heading: '', description: '', label: 'Image preview' },
};
