import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './value-scale-selector.js';
import type { HmiValueScaleSelector } from './value-scale-selector.js';

type Args = Pick<
    HmiValueScaleSelector,
    | 'label'
    | 'hint'
    | 'error'
    | 'value'
    | 'max'
    | 'allowHalf'
    | 'size'
    | 'readonly'
    | 'required'
    | 'requiredMessage'
    | 'disabled'
>;

const meta = {
    title: 'Components/Forms/ValueScaleSelector',
    component: 'hmi-value-scale-selector',
    tags: ['autodocs'],
    args: {
        label: 'Rating',
        value: 3,
        max: 5,
        allowHalf: false,
        size: 'medium',
        readonly: false,
        required: false,
        requiredMessage: 'Please select an option.',
        disabled: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        value: { control: 'number' },
        max: { control: 'number' },
        allowHalf: { control: 'boolean' },
        size: {
            control: 'inline-radio',
            options: ['small', 'medium', 'large'],
        },
        readonly: { control: 'boolean' },
        required: { control: 'boolean' },
        requiredMessage: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-value-scale-selector
            name="rating"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            value=${ifDefined(args.value)}
            max=${ifDefined(args.max)}
            size=${ifDefined(args.size)}
            required-message=${ifDefined(args.requiredMessage)}
            ?allow-half=${args.allowHalf}
            ?readonly=${args.readonly}
            ?required=${args.required}
            ?disabled=${args.disabled}
        ></hmi-value-scale-selector>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { ValueScaleSelector } from \'@ninoverse/hmi-components/react/value-scale-selector\'` — `<ValueScaleSelector max={5} allowHalf value={rating} onChange={(e) => setRating(e.detail.value)} />`. A custom icon is one child with `slot="icon"` (use `currentColor`); `valueText` is a template string or, as a property, a function.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const HalfSteps: Story = { args: { allowHalf: true, value: 3.5 } };

export const Small: Story = { args: { size: 'small' } };

export const Large: Story = { args: { size: 'large' } };

export const ReadOnly: Story = {
    args: { readonly: true, allowHalf: true, value: 4.5 },
};

export const WithHint: Story = {
    args: { hint: 'Tap a star, or use the arrow keys.' },
};

export const WithError: Story = {
    args: { value: 0, required: true, error: 'Rate it first.' },
};

export const Disabled: Story = { args: { disabled: true } };

/** One element in the `icon` slot is copied into every position. */
export const CustomIcon: Story = {
    args: { allowHalf: true, size: 'large', value: 2.5 },
    render: (args) =>
        html`<hmi-value-scale-selector label="Affinity" ?allow-half=${args.allowHalf} size=${ifDefined(args.size)} value=${ifDefined(args.value)}>
            <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-9.3-9.3C1.1 8 3 4 7 4c2.1 0 3.5 1.1 5 3 1.5-1.9 2.9-3 5-3 4 0 5.9 4 4.3 7.7C19 16.65 12 21 12 21z" /></svg>
        </hmi-value-scale-selector>`,
};
