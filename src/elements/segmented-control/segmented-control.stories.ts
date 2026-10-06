import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './segmented-control.js';
import type {
    HmiSegmentedControl,
    SegmentedControlOption,
} from './segmented-control.js';

type Args = Pick<
    HmiSegmentedControl,
    | 'label'
    | 'hint'
    | 'error'
    | 'value'
    | 'options'
    | 'size'
    | 'fullWidth'
    | 'required'
    | 'requiredMessage'
    | 'disabled'
>;

const VIEWS: SegmentedControlOption[] = [
    { value: 'list', label: 'List' },
    { value: 'board', label: 'Board' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'map', label: 'Map', disabled: true },
];

const meta = {
    title: 'Components/Forms/SegmentedControl',
    component: 'hmi-segmented-control',
    tags: ['autodocs'],
    args: {
        label: 'View',
        value: 'list',
        options: VIEWS,
        size: 'medium',
        fullWidth: false,
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
        size: {
            control: 'inline-radio',
            options: ['small', 'medium', 'large'],
        },
        fullWidth: { control: 'boolean' },
        required: { control: 'boolean' },
        requiredMessage: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-segmented-control
            name="view"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            value=${ifDefined(args.value)}
            size=${ifDefined(args.size)}
            required-message=${ifDefined(args.requiredMessage)}
            .options=${args.options}
            ?full-width=${args.fullWidth}
            ?required=${args.required}
            ?disabled=${args.disabled}
        ></hmi-segmented-control>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { SegmentedControl } from \'@ninoverse/hmi-components/react/segmented-control\'` — `<SegmentedControl options={views} value={view} onChange={(e) => setView(e.detail.value)} />`. A rich label or an icon is a child with `slot="label-<value>"` or `slot="icon-<value>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Small: Story = { args: { size: 'small' } };

export const Large: Story = { args: { size: 'large' } };

export const FullWidth: Story = { args: { fullWidth: true } };

export const NothingChosen: Story = { args: { value: '' } };

export const WithHint: Story = { args: { hint: 'Remembered per project.' } };

export const WithError: Story = {
    args: { value: '', required: true, error: 'Choose a view.' },
};

export const Disabled: Story = { args: { disabled: true } };

/** `slot="icon-<value>"` adds a leading icon. */
export const WithIcons: Story = {
    render: (args) =>
        html`<hmi-segmented-control label="View" value="list" .options=${args.options}>
            <svg slot="icon-list" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 4h10M3 8h10M3 12h10" /></svg>
            <svg slot="icon-board" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="4" height="10" /><rect x="9" y="3" width="4" height="6" /></svg>
        </hmi-segmented-control>`,
};
