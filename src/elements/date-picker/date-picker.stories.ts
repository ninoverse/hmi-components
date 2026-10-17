import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../button/button.js';
import './date-picker.js';
import type {
    DatePickerChangeDetail,
    DatePickerMode,
    HmiDatePicker,
} from './date-picker.js';

type Args = Pick<
    HmiDatePicker,
    | 'label'
    | 'hint'
    | 'error'
    | 'mode'
    | 'value'
    | 'min'
    | 'max'
    | 'placeholder'
    | 'locale'
    | 'weekStart'
    | 'open'
    | 'required'
    | 'requiredMessage'
    | 'disabled'
>;

const meta = {
    title: 'Components/Forms/DatePicker',
    component: 'hmi-date-picker',
    tags: ['autodocs'],
    args: {
        label: 'Date',
        mode: 'single',
        value: '',
        placeholder: 'Pick a date',
        locale: 'en-GB',
        weekStart: 1,
        open: false,
        required: false,
        requiredMessage: 'Please pick a date.',
        disabled: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        mode: { control: 'inline-radio', options: ['single', 'range'] },
        value: { control: 'text' },
        min: { control: 'text' },
        max: { control: 'text' },
        placeholder: { control: 'text' },
        locale: { control: 'text' },
        weekStart: { control: { type: 'number', min: 0, max: 6 } },
        open: { control: 'boolean' },
        required: { control: 'boolean' },
        requiredMessage: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<div style="width: 320px; padding-bottom: 440px">
            <hmi-date-picker
                name="date"
                label=${ifDefined(args.label)}
                hint=${ifDefined(args.hint)}
                error=${ifDefined(args.error)}
                mode=${args.mode as DatePickerMode}
                value=${ifDefined(args.value as string)}
                min=${ifDefined(args.min as string | undefined)}
                max=${ifDefined(args.max as string | undefined)}
                placeholder=${ifDefined(args.placeholder)}
                locale=${ifDefined(args.locale)}
                week-start=${ifDefined(args.weekStart)}
                required-message=${ifDefined(args.requiredMessage)}
                ?open=${args.open}
                ?required=${args.required}
                ?disabled=${args.disabled}
                @hmi-change=${(e: CustomEvent<DatePickerChangeDetail>) =>
                    console.log('hmi-change', e.detail)}
            ></hmi-date-picker>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { DatePicker } from \'@ninoverse/hmi-components/react/date-picker\'` — `<DatePicker label="Date" value={date} onChange={(e) => setDate(e.detail.value)} />`. A date is the plain `YYYY-MM-DD` text of its day, so it does not move with a time zone; `mode="range"` takes and reports a `{ start, end }` property. The picker owns its value: set `value` back from `onChange` to veto a choice.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithValue: Story = { args: { value: '2026-05-15' } };

/** The calendar is open from the start, as set from code. */
export const Open: Story = { args: { open: true, value: '2026-05-15' } };

/** `mode="range"`: `value` is a `{ start, end }` property, set here from code. */
export const Range: Story = {
    args: { mode: 'range', placeholder: 'Pick a range', label: 'Stay' },
    render: (args) =>
        html`<div style="width: 400px; padding-bottom: 440px">
            <hmi-date-picker
                name="stay"
                mode="range"
                label=${ifDefined(args.label)}
                placeholder=${ifDefined(args.placeholder)}
                .value=${{ start: '2026-05-15', end: '2026-05-20' }}
                ?open=${args.open}
            ></hmi-date-picker>
        </div>`,
};

/** A day before `min` or after `max` shows, takes focus, and cannot be chosen. */
export const WithMinMax: Story = {
    args: {
        value: '2026-05-15',
        min: '2026-05-10',
        max: '2026-05-25',
        open: true,
    },
};

/** `locale` sets the month and weekday names; `week-start` the first day of the week (0 is Sunday). */
export const Locale: Story = {
    args: { locale: 'it-IT', value: '2026-05-15', open: true },
};

export const SundayFirst: Story = {
    args: { locale: 'en-US', weekStart: 0, value: '2026-05-15', open: true },
};

export const WithHint: Story = {
    args: { hint: 'We will remind you the day before.', value: '2026-05-15' },
};

export const WithError: Story = {
    args: { required: true, error: 'Choose a date.' },
};

export const Disabled: Story = {
    args: { disabled: true, value: '2026-05-15' },
};

/** A form field: it submits `name=value` (a range as JSON), and `form.reset()` restores `default-value`. */
export const InAForm: Story = {
    render: () =>
        html`<form
            style="width: 320px; padding-bottom: 440px; display: flex; flex-direction: column; gap: 16px"
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
            <hmi-date-picker
                name="start"
                label="Start date"
                required
                default-value="2026-05-15"
            ></hmi-date-picker>
            <div style="display: flex; gap: 8px">
                <hmi-button type="submit">Submit</hmi-button>
                <hmi-button type="reset" variant="secondary">Reset</hmi-button>
            </div>
        </form>`,
};
