import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import './progress.js';
import type { HmiProgress } from './progress.js';

type Args = Pick<
    HmiProgress,
    'value' | 'max' | 'indeterminate' | 'label' | 'showValue' | 'valueText'
>;

const width = 'width: calc(var(--hmi-base, 8px) * 56); max-width: 100%';

const meta = {
    title: 'Components/Feedback/Progress',
    component: 'hmi-progress',
    tags: ['autodocs'],
    args: {
        value: 64,
        max: 100,
        indeterminate: false,
        label: 'Uploading',
        showValue: false,
    },
    argTypes: {
        value: { control: 'number' },
        max: { control: 'number' },
        indeterminate: { control: 'boolean' },
        label: { control: 'text' },
        showValue: { control: 'boolean' },
        valueText: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-progress
            style=${width}
            .value=${args.value}
            .max=${args.max}
            ?indeterminate=${args.indeterminate}
            ?show-value=${args.showValue}
            label=${args.label || nothing}
            value-text=${args.valueText || nothing}
        ></hmi-progress>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Progress } from \'@ninoverse/hmi-components/react/progress\'` — `<Progress value={3} max={7} showValue valueText="3 of 7 files"><span slot="label">Backup</span></Progress>`. The visible label is a slot; `label`, else the host\'s `aria-label`, names a bar that shows none. Give the bar a width in a flex row, and set its thickness through `::part(base)`. The Field Journal border is the `--progress-track-border` token; `--progress-indicator` deepens the bar.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Values: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: var(--space-6); ${width}">
            ${[0, 25, 50, 75, 100].map(
                (value) =>
                    html`<hmi-progress .value=${value} label="${value}%"></hmi-progress>`,
            )}
        </div>
    `,
};

/** `value` counts to `max`: three of seven files. */
export const Max: Story = { args: { value: 3, max: 7, showValue: true } };

/** The `label` slot is shown above the bar and names it; `show-value` adds the percentage. */
export const VisibleLabel: Story = {
    render: () => html`
        <hmi-progress style=${width} value="64" show-value
            ><span slot="label">Uploading report.pdf</span></hmi-progress
        >
    `,
};

/** `value-text` replaces the percentage, shown and read out. */
export const ValueText: Story = {
    render: () => html`
        <hmi-progress style=${width} value="3" max="7" show-value value-text="3 of 7 files"
            ><span slot="label">Backup</span></hmi-progress
        >
    `,
};

/** The bar loops across the track and `value` is ignored. */
export const Indeterminate: Story = { args: { indeterminate: true } };

/** In right-to-left text the bar fills, and loops, from the right. */
export const RightToLeft: Story = {
    render: () => html`
        <div dir="rtl" lang="ar" style="display: flex; flex-direction: column; gap: var(--space-6); ${width}">
            <hmi-progress value="30" show-value><span slot="label">تحميل</span></hmi-progress>
            <hmi-progress indeterminate label="تحميل"></hmi-progress>
        </div>
    `,
};
