import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './radio.js';
import type { HmiRadio } from './radio.js';

type Args = Pick<
    HmiRadio,
    'label' | 'hint' | 'error' | 'checked' | 'required' | 'disabled'
>;

const meta = {
    title: 'Components/Forms/Radio',
    component: 'hmi-radio',
    tags: ['autodocs'],
    args: {
        label: 'Small',
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
        html`<hmi-radio
            name="size"
            value="sm"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            ?checked=${args.checked}
            ?required=${args.required}
            ?disabled=${args.disabled}
        ></hmi-radio>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Radio } from \'@ninoverse/hmi-components/react/radio\'` — `<Radio name="size" value="md" label="Medium" onChange={() => setSize(\'md\')} />`. Radios sharing a `name` (in the same form and root) are one group: the element unchecks the others and moves with the arrow keys. `hmi-change` fires with `{ checked: true }` when a radio becomes checked.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Checked: Story = { args: { checked: true } };

export const WithHint: Story = { args: { hint: 'The default size.' } };

export const WithError: Story = {
    args: { required: true, error: 'Choose a size.' },
};

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = {
    args: { disabled: true, checked: true },
};

/** Radios that share a `name` are mutually exclusive, with one tab stop and arrow-key movement. */
export const Group: Story = {
    render: () =>
        html`<div style="display: flex; flex-direction: column; gap: 1.25rem">
            <hmi-radio name="size" value="sm" label="Small" checked></hmi-radio>
            <hmi-radio name="size" value="md" label="Medium"></hmi-radio>
            <hmi-radio name="size" value="lg" label="Large"></hmi-radio>
            <hmi-radio name="size" value="xl" label="Extra large (disabled)" disabled></hmi-radio>
        </div>`,
};
