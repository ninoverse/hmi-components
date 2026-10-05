import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './password-input.js';
import type { HmiPasswordInput } from './password-input.js';

type Args = Pick<
    HmiPasswordInput,
    | 'label'
    | 'hint'
    | 'error'
    | 'placeholder'
    | 'value'
    | 'required'
    | 'disabled'
    | 'showLabel'
    | 'hideLabel'
>;

const meta = {
    title: 'Components/Forms/PasswordInput',
    component: 'hmi-password-input',
    tags: ['autodocs'],
    args: {
        label: 'Password',
        placeholder: '••••••••',
        value: 'super-secret',
        required: false,
        disabled: false,
        showLabel: 'Show password',
        hideLabel: 'Hide password',
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        value: { control: 'text' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        showLabel: { control: 'text' },
        hideLabel: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-password-input
            style="width: 22rem; max-width: 100%"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            placeholder=${ifDefined(args.placeholder)}
            value=${ifDefined(args.value)}
            show-label=${ifDefined(args.showLabel)}
            hide-label=${ifDefined(args.hideLabel)}
            ?required=${args.required}
            ?disabled=${args.disabled}
        ></hmi-password-input>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { PasswordInput } from \'@ninoverse/hmi-components/react/password-input\'` — `<PasswordInput name="password" label="Password" value={pw} onInput={(e) => setPw(e.detail.value)} />`. Extends `hmi-input`: the `type` property is ignored (the field is `password`, or `text` while revealed) and the eye toggle replaces the right icon. `error` is the message text, not a boolean.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The trailing eye button toggles between `type="password"` and `type="text"`. */
export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'Click the eye to reveal.' } };

export const WithError: Story = {
    args: { value: 'letters-only', error: 'Must include a number.' },
};

export const Required: Story = {
    args: { required: true, value: '', hint: 'Marked with an asterisk' },
};

export const Disabled: Story = { args: { disabled: true } };

export const Labels: Story = {
    args: { showLabel: 'Mostrar contraseña', hideLabel: 'Ocultar contraseña' },
};
