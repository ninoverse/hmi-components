import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './meter.js';
import type { HmiMeter } from './meter.js';

type Args = Pick<
    HmiMeter,
    | 'value'
    | 'min'
    | 'max'
    | 'low'
    | 'high'
    | 'optimum'
    | 'showValue'
    | 'valueText'
    | 'label'
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
        valueText: { control: 'text' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-meter
            style="width: calc(var(--hmi-base, 8px) * 56); max-width: 100%"
            .value=${args.value}
            .min=${args.min}
            .max=${args.max}
            .low=${args.low}
            .high=${args.high}
            .optimum=${args.optimum}
            ?show-value=${args.showValue}
            value-text=${args.valueText ?? ''}
        >
            <span slot="label">Disk usage</span>
        </hmi-meter>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Meter } from \'@ninoverse/hmi-components/react/meter\'` — `<Meter value={0.8} low={0.3} high={0.7} optimum={0.2} showValue valueText="80%"><span slot="label">Disk</span></Meter>`. The visible label is a slot; `label` names a meter that shows none. The colour follows hmi\'s own rule, not the native `<meter>`\'s: `low` and `high` split the range into three bands, the one `optimum` (default `max`) falls in is optimal, the next suboptimal, the far one poor.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = { args: { value: 0.8, low: 0.3, high: 0.7 } };

export const ShowValue: Story = { args: { showValue: true, value: 0.42 } };

/** `optimum` at the top: high values are good, low values are poor. */
export const Levels: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: var(--space-6); width: calc(var(--hmi-base, 8px) * 56); max-width: 100%">
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

/** Without `low` and `high` only `max` is optimal: every value below it is
    suboptimal, and `min` poor. Set the thresholds the quality depends on. */
export const NoThresholds: Story = {
    args: { value: 0.6, showValue: true },
};

/** `value-text` replaces the number, shown and read out. The colour alone
    tells the quality, so say it in words when it matters. */
export const ValueText: Story = {
    args: {
        value: 0.92,
        low: 0.3,
        high: 0.7,
        optimum: 0.1,
        showValue: true,
        valueText: '92%, nearly full',
    },
};

/** With no visible label, `label` gives the meter its name for screen readers. */
export const WithoutVisibleLabel: Story = {
    render: (args) =>
        html`<hmi-meter
            style="width: calc(var(--hmi-base, 8px) * 56); max-width: 100%"
            .value=${args.value}
            label=${args.label ?? ''}
        ></hmi-meter>`,
    args: { value: 0.4, label: 'Memory' },
};
