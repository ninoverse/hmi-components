import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './bullet-chart.js';
import type { HmiBulletChart } from './bullet-chart.js';

type Args = Pick<
    HmiBulletChart,
    | 'value'
    | 'target'
    | 'min'
    | 'max'
    | 'ranges'
    | 'color'
    | 'caption'
    | 'label'
    | 'width'
    | 'height'
>;

const meta = {
    title: 'Charts/BulletChart',
    component: 'hmi-bullet-chart',
    tags: ['autodocs'],
    args: {
        value: 78,
        target: 85,
        min: 0,
        max: 100,
        ranges: [50, 75],
        color: 'var(--primary)',
        caption: 'Revenue',
        label: '',
        width: 360,
        height: 48,
    },
    argTypes: {
        value: { control: 'number' },
        target: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        ranges: { control: 'object' },
        color: { control: 'text' },
        caption: { control: 'text' },
        label: { control: 'text' },
        width: { control: 'number' },
        height: { control: 'number' },
    },
    render: (args) =>
        html`<hmi-bullet-chart
            value=${args.value}
            .target=${args.target}
            min=${args.min}
            .max=${args.max}
            .ranges=${args.ranges}
            color=${args.color}
            caption=${args.caption}
            label=${args.label}
            width=${args.width}
            height=${args.height}
        ></hmi-bullet-chart>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { BulletChart } from \'@ninoverse/hmi-components/react/bullet-chart\'` — `<BulletChart caption="Revenue" value={78} target={85} ranges={[50, 75]} />`. `ranges` is a property. The visible text left of the track is `caption`; `label` is the accessible name.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithoutTarget: Story = {
    args: { target: undefined },
};

export const NoCaption: Story = {
    args: { caption: '', label: 'Revenue against target' },
};

/** Each KPI sets its own colour. */
export const Colours: Story = {
    render: () =>
        html`<div style="display: flex; flex-direction: column; gap: 16px">
            <hmi-bullet-chart caption="Revenue" value="78" target="85" max="100" .ranges=${[50, 75]}></hmi-bullet-chart>
            <hmi-bullet-chart caption="Profit" value="62" target="55" max="100" .ranges=${[40, 70]} color="var(--success)"></hmi-bullet-chart>
            <hmi-bullet-chart caption="Cost" value="92" target="70" max="100" .ranges=${[60, 80]} color="var(--error)"></hmi-bullet-chart>
        </div>`,
};
