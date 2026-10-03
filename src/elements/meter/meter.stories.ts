import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './meter.js';
import type { HmiMeter } from './meter.js';

type Args = Pick<
    HmiMeter,
    'value' | 'min' | 'max' | 'low' | 'high' | 'optimum' | 'showValue'
>;

const meta = {
    title: 'Components/Feedback/Meter',
    component: 'hmi-meter',
    tags: ['autodocs'],
    args: { value: 0.6, min: 0, max: 1, showValue: false },
    argTypes: {
        value: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        low: { control: 'number' },
        high: { control: 'number' },
        optimum: { control: 'number' },
        showValue: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-meter
            style="width: 28rem; max-width: 100%"
            .value=${args.value}
            .min=${args.min}
            .max=${args.max}
            .low=${args.low}
            .high=${args.high}
            .optimum=${args.optimum}
            ?show-value=${args.showValue}
        >
            <span slot="label">Disk usage</span>
        </hmi-meter>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Meter } from \'@ninoverse/hmi-components/react/meter\'` — `<Meter value={0.8} low={0.3} high={0.7} optimum={0.2} showValue><span slot="label">Disk</span></Meter>`. The label is a slot, not a prop.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const ShowValue: Story = { args: { showValue: true, value: 0.42 } };

/** `optimum` at the top: high values are good, low values are poor. */
export const Levels: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 28rem; max-width: 100%">
            ${[
                ['Optimal', 0.9],
                ['Suboptimal', 0.5],
                ['Poor', 0.1],
            ].map(
                ([name, value]) =>
                    html`<hmi-meter
                        .value=${value as number}
                        .low=${0.3}
                        .high=${0.7}
                        show-value
                    >
                        <span slot="label">${name}</span>
                    </hmi-meter>`,
            )}
        </div>
    `,
};

/** `optimum` at the bottom flips the meaning: a full disk is poor. */
export const LowIsGood: Story = {
    args: { value: 0.85, low: 0.3, high: 0.7, optimum: 0.1, showValue: true },
};

export const CustomRange: Story = {
    args: { min: 0, max: 200, value: 150, showValue: true },
};
