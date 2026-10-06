import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './radio-group.js';
import type { HmiRadioGroup, RadioOption } from './radio-group.js';

type Args = Pick<
    HmiRadioGroup,
    'label' | 'hint' | 'error' | 'value' | 'options' | 'required' | 'disabled'
>;

const PLANS: RadioOption[] = [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team (disabled)', disabled: true },
];

const meta = {
    title: 'Components/Forms/RadioGroup',
    component: 'hmi-radio-group',
    tags: ['autodocs'],
    args: {
        label: 'Plan',
        value: 'free',
        options: PLANS,
        required: false,
        disabled: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        value: { control: 'text' },
        options: { control: 'object' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-radio-group
            name="plan"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            value=${ifDefined(args.value)}
            .options=${args.options}
            ?required=${args.required}
            ?disabled=${args.disabled}
        ></hmi-radio-group>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { RadioGroup } from \'@ninoverse/hmi-components/react/radio-group\'` — `<RadioGroup name="plan" options={plans} value={plan} onChange={(e) => setPlan(e.detail.value)} />`. A rich option label is a child with `slot="label-<value>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const NothingChosen: Story = { args: { value: '' } };

export const WithHint: Story = { args: { hint: 'You can change plan later.' } };

export const WithError: Story = {
    args: { value: '', required: true, error: 'Choose a plan.' },
};

export const Disabled: Story = { args: { disabled: true } };

/** `slot="label-<value>"` replaces an option's text label. */
export const RichLabel: Story = {
    render: (args) =>
        html`<hmi-radio-group name="plan" label="Plan" value="pro" .options=${args.options}>
            <span slot="label-pro"><strong>Pro</strong> — most popular</span>
        </hmi-radio-group>`,
};
