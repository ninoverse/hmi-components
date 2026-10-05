import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './number-input.js';
import type { HmiNumberInput } from './number-input.js';

type Args = Pick<
    HmiNumberInput,
    | 'label'
    | 'hint'
    | 'error'
    | 'placeholder'
    | 'value'
    | 'min'
    | 'max'
    | 'step'
    | 'required'
    | 'disabled'
    | 'readonly'
>;

const meta = {
    title: 'Components/Forms/NumberInput',
    component: 'hmi-number-input',
    tags: ['autodocs'],
    args: {
        label: 'Quantity',
        value: 3,
        min: 1,
        max: 99,
        step: 1,
        required: false,
        disabled: false,
        readonly: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        value: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        readonly: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-number-input
            style="width: 16rem"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            placeholder=${ifDefined(args.placeholder)}
            .value=${args.value ?? null}
            .min=${args.min}
            .max=${args.max}
            .step=${args.step}
            ?required=${args.required}
            ?disabled=${args.disabled}
            ?readonly=${args.readonly}
        ></hmi-number-input>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { NumberInput } from '@ninoverse/hmi-components/react/number-input'` — `<NumberInput label=\"Quantity\" min={1} max={99} value={qty} onInput={(e) => setQty(e.detail.value)} />`. The value is a number or `null` when empty. `onInput` is the per-edit callback (v5's `onChange`) and gets the event, so read `e.detail.value`; `onChange` fires on commit, with the value clamped to `min` and `max`. `error` is the message text, not a boolean.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'Between 1 and 99' } };

/** Commit clamps to `min` and `max`; the stepper stops at the bounds. */
export const AtTheMaximum: Story = { args: { value: 99 } };

export const Decimals: Story = {
    args: { label: 'Price', value: 0.1, min: 0, max: 1, step: 0.1 },
};

export const Empty: Story = {
    args: { value: null, placeholder: 'Quantity' },
};

export const WithError: Story = {
    args: { error: 'Quantity unavailable.', value: 120 },
};

export const Required: Story = {
    args: { required: true, value: null, hint: 'Marked with an asterisk' },
};

export const Disabled: Story = { args: { disabled: true, value: 5 } };

export const Readonly: Story = { args: { readonly: true, value: 5 } };
