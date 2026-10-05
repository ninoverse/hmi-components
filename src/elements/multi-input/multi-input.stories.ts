import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './multi-input.js';
import type { HmiMultiInput } from './multi-input.js';

type Args = Pick<
    HmiMultiInput,
    | 'label'
    | 'hint'
    | 'error'
    | 'length'
    | 'groupSize'
    | 'separator'
    | 'value'
    | 'type'
    | 'mask'
    | 'required'
    | 'readonly'
    | 'disabled'
>;

const meta = {
    title: 'Components/Forms/MultiInput',
    component: 'hmi-multi-input',
    tags: ['autodocs'],
    args: {
        label: 'Verification code',
        length: 6,
        separator: '–',
        value: '',
        type: 'numeric',
        mask: false,
        required: false,
        readonly: false,
        disabled: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        length: { control: 'number' },
        groupSize: { control: 'number' },
        separator: { control: 'text' },
        value: { control: 'text' },
        type: { control: 'inline-radio', options: ['numeric', 'text'] },
        mask: { control: 'boolean' },
        required: { control: 'boolean' },
        readonly: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-multi-input
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            length=${ifDefined(args.length)}
            group-size=${ifDefined(args.groupSize)}
            separator=${ifDefined(args.separator)}
            value=${ifDefined(args.value)}
            type=${ifDefined(args.type)}
            ?mask=${args.mask}
            ?required=${args.required}
            ?readonly=${args.readonly}
            ?disabled=${args.disabled}
        ></hmi-multi-input>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { MultiInput } from '@ninoverse/hmi-components/react/multi-input'` — `<MultiInput length={6} onInput={(e) => setCode(e.detail.value)} onComplete={(e) => verify(e.detail.value)} />`. `onInput` is v5's `onChange`. The `pattern` attribute is the source of a one-character regular expression; the property also takes a `RegExp`.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Typing advances; Backspace on an empty cell goes back; paste fills from the focused cell. */
export const Default: Story = {};

export const Grouped: Story = {
    args: {
        label: 'License key',
        length: 12,
        groupSize: 4,
        type: 'text',
        value: 'ABCD1234WXYZ',
    },
};

export const Masked: Story = {
    args: { label: 'PIN', length: 4, mask: true, value: '1234' },
};

export const WithHint: Story = {
    args: { hint: 'Paste a code to fill the cells.' },
};

export const WithError: Story = {
    args: { value: '123', error: 'That code has expired.' },
};

export const Required: Story = { args: { required: true } };

export const ReadOnly: Story = { args: { value: '123456', readonly: true } };

export const Disabled: Story = { args: { value: '123456', disabled: true } };
