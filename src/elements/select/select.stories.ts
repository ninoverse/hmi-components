import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../button/button.js';
import './select.js';
import type {
    HmiSelect,
    SelectOpenChangeDetail,
    SelectOption,
} from './select.js';

type Args = Pick<
    HmiSelect,
    | 'label'
    | 'hint'
    | 'error'
    | 'value'
    | 'options'
    | 'placeholder'
    | 'align'
    | 'open'
    | 'required'
    | 'requiredMessage'
    | 'disabled'
>;

const PLANS: SelectOption[] = [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
];

const meta = {
    title: 'Components/Forms/Select',
    component: 'hmi-select',
    tags: ['autodocs'],
    args: {
        label: 'Plan',
        value: '',
        options: PLANS,
        placeholder: 'Choose a plan…',
        align: 'start',
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
        align: { control: 'inline-radio', options: ['start', 'end'] },
        open: { control: 'boolean' },
        required: { control: 'boolean' },
        requiredMessage: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<div style="width: 320px; padding-bottom: 240px">
            <hmi-select
                name="plan"
                label=${ifDefined(args.label)}
                hint=${ifDefined(args.hint)}
                error=${ifDefined(args.error)}
                value=${ifDefined(args.value)}
                placeholder=${ifDefined(args.placeholder)}
                align=${ifDefined(args.align)}
                required-message=${ifDefined(args.requiredMessage)}
                .options=${args.options}
                ?open=${args.open}
                ?required=${args.required}
                ?disabled=${args.disabled}
                @hmi-open-change=${(e: CustomEvent<SelectOpenChangeDetail>) =>
                    console.log('hmi-open-change', e.detail)}
            ></hmi-select>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Select } from \'@ninoverse/hmi-components/react/select\'` — `<Select options={plans} value={plan} label="Plan" onChange={(e) => setPlan(e.detail.value)} />`. The select owns its value: set `value` back from `onChange` to veto a choice. A rich label or an icon is a child with `slot="label-<value>"` or `slot="icon-<value>"`; both show in the list only.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithValue: Story = { args: { value: 'pro' } };

/** The list is open from the start, as set from code. */
export const Open: Story = { args: { open: true, value: 'pro' } };

/** The list lines up with the trigger's right edge with `align="end"`. */
export const AlignEnd: Story = { args: { align: 'end', open: true } };

export const WithHint: Story = {
    args: { hint: 'You can change it later.', value: 'free' },
};

export const WithError: Story = {
    args: { required: true, error: 'Choose a plan.' },
};

export const Disabled: Story = { args: { disabled: true, value: 'free' } };

/** An option with `disabled: true` shows but cannot be chosen. */
export const DisabledOption: Story = { args: { open: true } };

/** A rich label or an icon is an element slotted as `label-<value>` or `icon-<value>`; the trigger shows the option's label text. */
export const RichOptions: Story = {
    args: { open: true, value: 'pro' },
    render: (args) =>
        html`<div style="width: 320px; padding-bottom: 240px">
            <hmi-select
                label="Plan"
                value=${ifDefined(args.value)}
                .options=${args.options}
                ?open=${args.open}
            >
                <svg slot="icon-free" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="5" /></svg>
                <svg slot="icon-pro" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2l1.8 3.7 4.1.6-3 2.9.7 4.1L8 11.3 4.4 13.3l.7-4.1-3-2.9 4.1-.6z" /></svg>
                <b slot="label-team">Team <small>(5+ seats)</small></b>
            </hmi-select>
        </div>`,
};

/** `placeholder` is text, or the slot of the same name for richer content. */
export const RichPlaceholder: Story = {
    render: (args) =>
        html`<div style="width: 320px; padding-bottom: 240px">
            <hmi-select label="Plan" .options=${args.options}>
                <i slot="placeholder">Nothing chosen yet</i>
            </hmi-select>
        </div>`,
};

/** A form field: it submits `name=value`, and `form.reset()` restores `default-value`. */
export const InAForm: Story = {
    render: (args) =>
        html`<form
            style="width: 320px; padding-bottom: 240px; display: flex; flex-direction: column; gap: 16px"
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
            <hmi-select
                name="plan"
                label="Plan"
                required
                default-value="free"
                .options=${args.options}
            ></hmi-select>
            <div style="display: flex; gap: 8px">
                <hmi-button type="submit">Submit</hmi-button>
                <hmi-button type="reset" variant="secondary">Reset</hmi-button>
            </div>
        </form>`,
};
