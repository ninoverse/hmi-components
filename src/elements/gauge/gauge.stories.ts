import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './gauge.js';
import type { HmiGauge } from './gauge.js';

type Args = Pick<
    HmiGauge,
    | 'value'
    | 'min'
    | 'max'
    | 'color'
    | 'trackColor'
    | 'thickness'
    | 'size'
    | 'hideValue'
    | 'label'
>;

const meta = {
    title: 'Charts/Gauge',
    component: 'hmi-gauge',
    tags: ['autodocs'],
    args: {
        value: 72,
        min: 0,
        max: 100,
        color: 'var(--primary)',
        trackColor: 'var(--surface-container-highest)',
        thickness: 0.22,
        size: 200,
        hideValue: false,
        label: '',
    },
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        min: { control: 'number' },
        max: { control: 'number' },
        color: { control: 'text' },
        trackColor: { control: 'text' },
        thickness: {
            control: { type: 'range', min: 0.05, max: 0.6, step: 0.01 },
        },
        size: { control: 'number' },
        hideValue: { control: 'boolean' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-gauge
            value=${args.value}
            min=${args.min}
            max=${args.max}
            color=${args.color}
            track-color=${args.trackColor}
            thickness=${args.thickness}
            size=${args.size}
            ?hide-value=${args.hideValue}
            label=${args.label}
        ></hmi-gauge>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Gauge } from \'@ninoverse/hmi-components/react/gauge\'` — `<Gauge value={72}><span slot="caption">72%</span></Gauge>`. The text under the dial is the `caption` slot, and the value when nothing is slotted; `hideValue` shows just the dial.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** With no caption, the gauge shows its value under the dial. */
export const Default: Story = {};

/** The `caption` slot replaces the value: a unit, a percent sign, a word. */
export const WithCaption: Story = {
    render: (args) =>
        html`<hmi-gauge value=${args.value} size=${args.size}>
            <span slot="caption">${args.value}%</span>
        </hmi-gauge>`,
};

/** `hide-value` removes the default caption: just the dial. */
export const DialOnly: Story = {
    args: { hideValue: true },
};

export const Colours: Story = {
    render: () =>
        html`<div style="display: flex; gap: 32px; align-items: flex-end">
            <hmi-gauge value="72"><span slot="caption">72%</span></hmi-gauge>
            <hmi-gauge value="45" color="var(--success)" size="160"></hmi-gauge>
            <hmi-gauge value="88" color="var(--error)" thickness="0.34" size="160"></hmi-gauge>
        </div>`,
};
