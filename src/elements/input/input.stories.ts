import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './input.js';
import type { HmiInput } from './input.js';

type Args = Pick<
    HmiInput,
    | 'label'
    | 'hint'
    | 'error'
    | 'placeholder'
    | 'type'
    | 'value'
    | 'required'
    | 'disabled'
    | 'readonly'
>;

const types = ['text', 'email', 'url', 'tel', 'search', 'password'] as const;

const searchIcon = html`<svg slot="left-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>`;

const meta = {
    title: 'Components/Forms/Input',
    component: 'hmi-input',
    tags: ['autodocs'],
    args: {
        label: 'Full name',
        placeholder: 'Alex Morgan',
        type: 'text',
        required: false,
        disabled: false,
        readonly: false,
    },
    argTypes: {
        type: { control: 'select', options: types },
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        placeholder: { control: 'text' },
        value: { control: 'text' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        readonly: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-input
            style="width: 22rem; max-width: 100%"
            label=${args.label}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            placeholder=${ifDefined(args.placeholder)}
            type=${args.type}
            value=${ifDefined(args.value)}
            ?required=${args.required}
            ?disabled=${args.disabled}
            ?readonly=${args.readonly}
        ></hmi-input>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Input } from \'@ninoverse/hmi-components/react/input\'` — `<Input name="email" label="Email" value={email} onInput={(e) => setEmail(e.detail.value)} />`. `onInput` is the per-keystroke callback (v5\'s `onChange`) and gets the event, so read `e.detail.value`; `onChange` fires on commit. `error` is the message text, not a boolean. A native form control: `name` and `value` reach `FormData`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'As it appears on documents' } };

/** A non-empty `error` shows the message, sets `aria-invalid` and invalidates the form. */
export const WithError: Story = {
    args: {
        label: 'Email',
        type: 'email',
        value: 'not-an-email',
        error: "Hmm, that doesn't look right.",
    },
};

export const Required: Story = {
    args: { required: true, hint: 'Marked with an asterisk' },
};

export const Disabled: Story = {
    args: { disabled: true, value: 'Already filled' },
};

export const Readonly: Story = {
    args: { readonly: true, value: 'Copy me, but you cannot edit me' },
};

/** Icons are slots. An unused one takes no space. */
export const WithIcon: Story = {
    args: { label: 'Search', placeholder: 'Search…' },
    render: (args) =>
        html`<hmi-input style="width: 22rem" label=${args.label} placeholder=${ifDefined(args.placeholder)}>
            ${searchIcon}
        </hmi-input>`,
};

export const Types: Story = {
    render: () =>
        html`<div style="display: flex; flex-direction: column; gap: 1rem; width: 22rem">
            ${types.map((type) => html`<hmi-input type=${type} label=${type} placeholder=${type}></hmi-input>`)}
        </div>`,
};

/** In a form: values reach FormData, `required` blocks the submit, reset restores. */
export const InAForm: Story = {
    render: () =>
        html`<form
            style="display: flex; flex-direction: column; gap: 1rem; width: 22rem"
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                console.log(
                    Object.fromEntries(
                        new FormData(e.target as HTMLFormElement),
                    ),
                );
            }}
        >
            <hmi-input name="name" label="Name" value="Ada" required></hmi-input>
            <hmi-input name="email" type="email" label="Email" required></hmi-input>
            <div style="display: flex; gap: 0.5rem">
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
            </div>
        </form>`,
};
