import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './textarea.js';
import type { HmiTextarea } from './textarea.js';

type Args = Pick<
    HmiTextarea,
    | 'label'
    | 'hint'
    | 'error'
    | 'placeholder'
    | 'value'
    | 'rows'
    | 'required'
    | 'disabled'
    | 'readonly'
>;

const meta = {
    title: 'Components/Forms/Textarea',
    component: 'hmi-textarea',
    tags: ['autodocs'],
    args: {
        label: 'About you',
        placeholder: 'Tell us a bit about yourself…',
        required: false,
        disabled: false,
        readonly: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        value: { control: 'text' },
        rows: { control: 'number' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        readonly: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-textarea
            style="width: 28rem; max-width: 100%"
            label=${args.label}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            placeholder=${ifDefined(args.placeholder)}
            value=${ifDefined(args.value)}
            .rows=${args.rows}
            ?required=${args.required}
            ?disabled=${args.disabled}
            ?readonly=${args.readonly}
        ></hmi-textarea>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Textarea } from \'@ninoverse/hmi-components/react/textarea\'` — `<Textarea name="bio" label="About you" value={bio} onInput={(e) => setBio(e.detail.value)} rows={4} />`. `onInput` is the per-keystroke callback (v5\'s `onChange`) and gets the event, so read `e.detail.value`; `onChange` fires on commit. `error` is the message text, not a boolean. A native form control: `name` and `value` reach `FormData`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'A short bio, 240 chars max' } };

/** A non-empty `error` shows the message, sets `aria-invalid` and invalidates the form. */
export const WithError: Story = {
    args: { label: 'Feedback', error: 'Please describe the issue.' },
};

export const Required: Story = {
    args: { required: true, hint: 'Marked with an asterisk' },
};

export const Rows: Story = { args: { rows: 8 } };

export const Disabled: Story = {
    args: { disabled: true, value: 'Already filled' },
};

export const Readonly: Story = {
    args: {
        readonly: true,
        value: 'You can select and copy this text, but not edit it.',
    },
};
