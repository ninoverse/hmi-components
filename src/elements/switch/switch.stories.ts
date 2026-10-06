import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './switch.js';
import type { HmiSwitch } from './switch.js';

type Args = Pick<
    HmiSwitch,
    'label' | 'hint' | 'error' | 'checked' | 'required' | 'disabled'
>;

const meta = {
    title: 'Components/Forms/Switch',
    component: 'hmi-switch',
    tags: ['autodocs'],
    args: {
        label: 'Notifications',
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
        html`<hmi-switch
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            ?checked=${args.checked}
            ?required=${args.required}
            ?disabled=${args.disabled}
        ></hmi-switch>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Switch } from \'@ninoverse/hmi-components/react/switch\'` — `<Switch label="Notifications" checked={on} onChange={(e) => setOn(e.detail.checked)} />`. `hmi-change` carries `{ checked }`; `value` is the string a checked box submits.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Checked: Story = { args: { checked: true } };

export const WithHint: Story = {
    args: { hint: 'Takes effect on reload.' },
};

export const WithError: Story = {
    args: { required: true, error: 'This must be on.' },
};

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = {
    args: { disabled: true, checked: true },
};

/** The default slot takes richer label content than the `label` text. */
export const RichLabel: Story = {
    args: { label: '' },
    render: () =>
        html`<hmi-switch>Notify me about <b>everything</b></hmi-switch>`,
};
