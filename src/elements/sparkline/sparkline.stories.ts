import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './sparkline.js';
import type { HmiSparkline } from './sparkline.js';

type Args = Pick<
    HmiSparkline,
    | 'data'
    | 'width'
    | 'height'
    | 'color'
    | 'strokeWidth'
    | 'area'
    | 'showDot'
    | 'min'
    | 'max'
    | 'label'
>;

const meta = {
    title: 'Charts/Sparkline',
    component: 'hmi-sparkline',
    tags: ['autodocs'],
    args: {
        data: [4, 8, 5, 10, 7, 12, 9, 14],
        width: 120,
        height: 32,
        color: 'var(--primary)',
        strokeWidth: 2,
        area: false,
        showDot: false,
        label: 'Upward trend',
    },
    argTypes: {
        data: { control: 'object' },
        width: { control: 'number' },
        height: { control: 'number' },
        color: { control: 'text' },
        strokeWidth: { control: 'number' },
        area: { control: 'boolean' },
        showDot: { control: 'boolean' },
        min: { control: 'number' },
        max: { control: 'number' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-sparkline
            .data=${args.data}
            width=${args.width}
            height=${args.height}
            color=${args.color}
            stroke-width=${args.strokeWidth}
            ?area=${args.area}
            ?show-dot=${args.showDot}
            .min=${args.min}
            .max=${args.max}
            label=${args.label ?? ''}
        ></hmi-sparkline>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Sparkline } from \'@ninoverse/hmi-components/react/sparkline\'` — `<Sparkline data={values} label="Upward trend" area showDot />`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const DownwardWithAreaAndDot: Story = {
    args: {
        data: [14, 9, 11, 6, 8, 4, 5, 2],
        color: 'var(--error)',
        area: true,
        showDot: true,
        label: 'Downward trend with area',
    },
};

export const LargerFlat: Story = {
    args: {
        data: [6, 6, 7, 6, 8, 6, 7, 6],
        width: 200,
        height: 48,
        color: 'var(--tertiary)',
        strokeWidth: 3,
        area: true,
        label: 'Flat trend, larger',
    },
};

/** `min` and `max` fix the range, so several sparklines share a scale. */
export const FixedRange: Story = { args: { min: 0, max: 20 } };
