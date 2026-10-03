import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../button/button.js';
import './alert.js';
import type { HmiAlert } from './alert.js';

type Args = Pick<HmiAlert, 'variant'>;

const variants = ['info', 'success', 'warning', 'danger'] as const;

const meta = {
    title: 'Components/Feedback/Alert',
    component: 'hmi-alert',
    tags: ['autodocs'],
    args: { variant: 'info' },
    argTypes: {
        variant: { control: 'inline-radio', options: variants },
    },
    render: (args) =>
        html`<hmi-alert variant=${args.variant}>
            Your changes were saved.
        </hmi-alert>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Alert } from \'@ninoverse/hmi-components/react/alert\'` — `<Alert variant="warning"><span slot="title">Heads up</span>Disk almost full.</Alert>`. `title` and `action` are slots, not props.',
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
                    html`<hmi-alert variant=${variant}>
                        <span slot="title">${variant}</span>
                        A message in the ${variant} tone.
                    </hmi-alert>`,
            )}
        </div>
    `,
};

export const WithTitle: Story = {
    args: { variant: 'warning' },
    render: (args) =>
        html`<hmi-alert variant=${args.variant}>
            <span slot="title">Heads up</span>
            Disk almost full.
        </hmi-alert>`,
};

export const WithAction: Story = {
    args: { variant: 'danger' },
    render: (args) =>
        html`<hmi-alert variant=${args.variant}>
            <span slot="title">Upload failed</span>
            The file could not be sent.
            <hmi-button slot="action" size="small" variant="danger">Retry</hmi-button>
        </hmi-alert>`,
};

/** A slotted `svg` replaces the built-in status icon. */
export const CustomIcon: Story = {
    render: (args) =>
        html`<hmi-alert variant=${args.variant}>
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
        </hmi-alert>`,
};
