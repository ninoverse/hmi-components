import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../button/button.js';
import './color-picker.js';
import type {
    ColorPickerChangeDetail,
    ColorPickerInputDetail,
    HmiColorPicker,
} from './color-picker.js';

type Args = Pick<
    HmiColorPicker,
    | 'label'
    | 'hint'
    | 'error'
    | 'value'
    | 'swatches'
    | 'hideInput'
    | 'open'
    | 'disabled'
>;

const meta = {
    title: 'Components/Forms/ColorPicker',
    component: 'hmi-color-picker',
    tags: ['autodocs'],
    args: {
        label: 'Brand color',
        value: '#e87a5d',
        hideInput: false,
        open: false,
        disabled: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        value: { control: 'color' },
        swatches: { control: 'object' },
        hideInput: { control: 'boolean' },
        open: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<div style="padding-bottom: 360px">
            <hmi-color-picker
                name="color"
                label=${ifDefined(args.label)}
                hint=${ifDefined(args.hint)}
                error=${ifDefined(args.error)}
                value=${ifDefined(args.value)}
                .swatches=${args.swatches ?? undefined}
                ?hide-input=${args.hideInput}
                ?open=${args.open}
                ?disabled=${args.disabled}
                @hmi-input=${(e: CustomEvent<ColorPickerInputDetail>) =>
                    console.log('hmi-input', e.detail)}
                @hmi-change=${(e: CustomEvent<ColorPickerChangeDetail>) =>
                    console.log('hmi-change', e.detail)}
            ></hmi-color-picker>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { ColorPicker } from \'@ninoverse/hmi-components/react/color-picker\'` — `<ColorPicker label="Brand color" value={color} onChange={(e) => setColor(e.detail.value)} />`. A colour is `#rrggbb` in lower case; `onInput` fires as it changes and `onChange` when it is committed. The picker owns its value: set `value` back from the listener to veto a choice.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** The panel is open from the start, as set from code. */
export const Open: Story = { args: { open: true } };

/** `hide-input` reduces the panel to the preset swatches. */
export const SwatchesOnly: Story = {
    args: { value: '#5c9a6a', hideInput: true, open: true },
};

/** `swatches` is a property of hex colours; anything else in it is skipped. */
export const CustomSwatches: Story = {
    args: {
        value: '#0ea5e9',
        swatches: [
            '#0ea5e9',
            '#22c55e',
            '#eab308',
            '#f97316',
            '#ef4444',
            '#a855f7',
        ],
        open: true,
    },
};

export const WithHint: Story = {
    args: { hint: 'Used for buttons and links.', value: '#6b86b3' },
};

export const WithError: Story = {
    args: { error: 'That colour is too light.', value: '#ffffff' },
};

export const Disabled: Story = { args: { disabled: true, value: '#6b86b3' } };

/** A form field: it submits `name=value`, and `form.reset()` restores `default-value`. */
export const InAForm: Story = {
    render: () =>
        html`<form
            style="padding-bottom: 360px; display: flex; flex-direction: column; gap: 16px; align-items: flex-start"
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
            <hmi-color-picker
                name="brand"
                label="Brand color"
                default-value="#5c9a6a"
            ></hmi-color-picker>
            <div style="display: flex; gap: 8px">
                <hmi-button type="submit">Submit</hmi-button>
                <hmi-button type="reset" variant="secondary">Reset</hmi-button>
            </div>
        </form>`,
};
