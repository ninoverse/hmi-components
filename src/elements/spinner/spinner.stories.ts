import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './spinner.js';
import type { HmiSpinner } from './spinner.js';

type Args = Pick<HmiSpinner, 'size' | 'label'>;

const sizes = ['small', 'medium', 'large'] as const;

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
                    'React: `import { Spinner } from \'@ninoverse/hmi-components/react/spinner\'` — `<Spinner size="large" label="Fetching" />`. `label` is announced, not drawn.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Sizes: Story = {
    render: (args) => html`
        <div style="display: flex; gap: 3rem; align-items: center">
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

/** The ring is drawn from `currentColor`, so it takes the colour it sits in. */
export const Inherited: Story = {
    render: (args) => html`
        <div style="display: flex; gap: 3rem; align-items: center">
            <span style="color: var(--primary)">
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
