import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../button/button.js';
import './combobox.js';
import type {
    ComboboxInputDetail,
    ComboboxOption,
    HmiCombobox,
} from './combobox.js';

type Args = Pick<
    HmiCombobox,
    | 'label'
    | 'hint'
    | 'error'
    | 'value'
    | 'options'
    | 'placeholder'
    | 'filter'
    | 'emptyMessage'
    | 'open'
    | 'required'
    | 'requiredMessage'
    | 'disabled'
>;

const CITIES: ComboboxOption[] = [
    { value: 'amsterdam', label: 'Amsterdam', description: 'Netherlands' },
    { value: 'berlin', label: 'Berlin', description: 'Germany' },
    { value: 'lisbon', label: 'Lisbon', description: 'Portugal' },
    { value: 'london', label: 'London', description: 'United Kingdom' },
    { value: 'madrid', label: 'Madrid', description: 'Spain' },
    { value: 'milan', label: 'Milan', description: 'Italy' },
    { value: 'paris', label: 'Paris', description: 'France' },
    { value: 'rome', label: 'Rome', description: 'Italy' },
    { value: 'vienna', label: 'Vienna', description: 'Austria' },
    { value: 'warsaw', label: 'Warsaw', description: 'Poland' },
];

const meta = {
    title: 'Components/Forms/Combobox',
    component: 'hmi-combobox',
    tags: ['autodocs'],
    args: {
        label: 'City',
        value: '',
        options: CITIES,
        placeholder: 'Search cities…',
        filter: 'includes',
        emptyMessage: 'No matches',
        open: false,
        required: false,
        requiredMessage: 'Please select an option.',
        disabled: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        value: { control: 'text' },
        options: { control: 'object' },
        placeholder: { control: 'text' },
        filter: {
            control: 'inline-radio',
            options: ['includes', 'startsWith', 'none'],
        },
        emptyMessage: { control: 'text' },
        open: { control: 'boolean' },
        required: { control: 'boolean' },
        requiredMessage: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<div style="width: 360px; padding-bottom: 320px">
            <hmi-combobox
                name="city"
                label=${ifDefined(args.label)}
                hint=${ifDefined(args.hint)}
                error=${ifDefined(args.error)}
                value=${ifDefined(args.value)}
                placeholder=${ifDefined(args.placeholder)}
                filter=${ifDefined(
                    typeof args.filter === 'string' ? args.filter : undefined,
                )}
                empty-message=${ifDefined(args.emptyMessage)}
                required-message=${ifDefined(args.requiredMessage)}
                .options=${args.options}
                ?open=${args.open}
                ?required=${args.required}
                ?disabled=${args.disabled}
            ></hmi-combobox>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Combobox } from \'@ninoverse/hmi-components/react/combobox\'` — `<Combobox options={cities} label="City" onChange={(e) => setCity(e.detail.value)} />`. The combobox owns its value (`\'\'` for none, where v5 passed `null`): set `value` back from `onChange` to veto a choice. `onInput` receives the text on every keystroke, for searching a server. An option\'s rich label or description is a child with `slot="label-<value>"` or `slot="description-<value>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithValue: Story = { args: { value: 'paris' } };

/** The list is open from the start, as set from code. */
export const Open: Story = { args: { open: true } };

export const WithHint: Story = {
    args: { hint: 'Start typing to filter the list.' },
};

export const WithError: Story = {
    args: { required: true, error: 'Choose a city.' },
};

export const Disabled: Story = { args: { disabled: true, value: 'paris' } };

/** `filter="startsWith"` matches the start of a label. A function, set as a property, decides for itself. */
export const StartsWith: Story = { args: { filter: 'startsWith' } };

/** The message shown when nothing matches is `empty-message`, or the `empty` slot for richer content. */
export const EmptyMessage: Story = {
    args: { emptyMessage: 'No city by that name' },
    render: (args) =>
        html`<div style="width: 360px; padding-bottom: 160px">
            <hmi-combobox
                label="City"
                empty-message=${ifDefined(args.emptyMessage)}
                .options=${args.options}
                .query=${'zzz'}
                open
            ></hmi-combobox>
        </div>`,
};

/** A rich label or description is an element slotted as `label-<value>` or `description-<value>`; the field shows the label text. */
export const RichOptions: Story = {
    args: { open: true },
    render: (args) =>
        html`<div style="width: 360px; padding-bottom: 320px">
            <hmi-combobox label="City" .options=${args.options} ?open=${args.open}>
                <b slot="label-paris">Paris <small>(capital)</small></b>
                <em slot="description-paris">City of light</em>
            </hmi-combobox>
        </div>`,
};

/** `hmi-input` reports the text, so a consumer can search a server: it sets `options` in response, and `filter="none"` stops the element filtering them again. */
export const ServerSearch: Story = {
    render: (args) =>
        html`<div style="width: 360px; padding-bottom: 320px">
            <hmi-combobox
                label="City (a server, simulated)"
                filter="none"
                placeholder="Type to search…"
                .options=${[]}
                @hmi-input=${(e: CustomEvent<ComboboxInputDetail>) => {
                    const combobox = e.currentTarget as HmiCombobox;
                    const text = e.detail.value.toLowerCase();
                    window.setTimeout(() => {
                        combobox.options = text
                            ? (args.options ?? []).filter((option) =>
                                  option.label.toLowerCase().includes(text),
                              )
                            : [];
                    }, 150);
                }}
            ></hmi-combobox>
        </div>`,
};

/** A form field: it submits `name=value`, and `form.reset()` restores `default-value`. */
export const InAForm: Story = {
    render: (args) =>
        html`<form
            style="width: 360px; padding-bottom: 320px; display: flex; flex-direction: column; gap: 16px"
            @submit=${(e: SubmitEvent) => {
                e.preventDefault();
                console.log(
                    'submitted',
                    Object.fromEntries(
                        new FormData(e.currentTarget as HTMLFormElement),
                    ),
                );
            }}
        >
            <hmi-combobox
                name="city"
                label="City"
                required
                default-value="paris"
                .options=${args.options}
            ></hmi-combobox>
            <div style="display: flex; gap: 8px">
                <hmi-button type="submit">Submit</hmi-button>
                <hmi-button type="reset" variant="secondary">Reset</hmi-button>
            </div>
        </form>`,
};
