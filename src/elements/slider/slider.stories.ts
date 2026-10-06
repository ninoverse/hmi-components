import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './slider.js';
import type { HmiSlider } from './slider.js';

type Args = Pick<
    HmiSlider,
    | 'label'
    | 'hint'
    | 'error'
    | 'value'
    | 'min'
    | 'max'
    | 'step'
    | 'showValue'
    | 'formatValue'
    | 'disabled'
>;

const meta = {
    title: 'Components/Forms/Slider',
    component: 'hmi-slider',
    tags: ['autodocs'],
    args: {
        label: 'Volume',
        value: 40,
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
        formatValue: '{value}%',
        disabled: false,
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        value: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
        showValue: { control: 'boolean' },
        formatValue: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-slider
            style="max-width: 40rem"
            label=${ifDefined(args.label)}
            hint=${ifDefined(args.hint)}
            error=${ifDefined(args.error)}
            value=${ifDefined(args.value)}
            min=${ifDefined(args.min)}
            max=${ifDefined(args.max)}
            step=${ifDefined(args.step)}
            format-value=${ifDefined(
                typeof args.formatValue === 'string'
                    ? args.formatValue
                    : undefined,
            )}
            ?show-value=${args.showValue}
            ?disabled=${args.disabled}
        ></hmi-slider>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Slider } from \'@ninoverse/hmi-components/react/slider\'` — `<Slider label="Volume" value={vol} onInput={(e) => setVol(e.detail.value)} showValue formatValue="{value}%" />`. `onInput` is v5\'s `onChange` (while moving); `onChange` fires on release. `formatValue` is a `{value}` template string or, as a property, a function.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Stepped: Story = {
    args: { label: 'Contrast', step: 5, value: 50, formatValue: undefined },
};

export const WithHint: Story = {
    args: { hint: 'Drag, or use the arrow keys.' },
};

export const WithError: Story = { args: { error: 'Too loud for night mode.' } };

export const Disabled: Story = { args: { disabled: true, value: 30 } };

export const NoValue: Story = { args: { showValue: false } };
