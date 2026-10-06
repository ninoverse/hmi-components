import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './checkbox.js';
import type { HmiCheckbox } from './checkbox.js';

type Args = Pick<
    HmiCheckbox,
    'label' | 'hint' | 'error' | 'checked' | 'required' | 'disabled'
>;

const meta = {
    title: 'Components/Forms/Checkbox',
    component: 'hmi-checkbox',
    tags: ['autodocs'],
    args: {
        label: 'Accept terms',
        checked: false,
        required: false,
        disabled: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        checked: { control: 'boolean' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-checkbox
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            ?checked=${args.checked}
            ?required=${args.required}
            ?disabled=${args.disabled}
        ></hmi-checkbox>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Checkbox } from \'@ninoverse/hmi-components/react/checkbox\'` — `<Checkbox label="Subscribe" checked={on} onChange={(e) => setOn(e.detail.checked)} />`. `hmi-change` carries `{ checked }`; `value` is the string a checked box submits.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Checked: Story = { args: { checked: true } };

export const WithHint: Story = {
    args: { hint: 'You can change this later.' },
};

export const WithError: Story = {
    args: { required: true, error: 'You must accept the terms.' },
};

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = {
    args: { disabled: true, checked: true },
};

/** The default slot takes richer label content than the `label` text. */
export const RichLabel: Story = {
    args: { label: '' },
    render: () =>
        html`<hmi-checkbox>I agree to the <a href="#terms">terms</a></hmi-checkbox>`,
};
