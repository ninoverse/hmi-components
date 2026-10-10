import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './cartesian-grid.js';
import type { HmiCartesianGrid } from './cartesian-grid.js';

type Args = Pick<
    HmiCartesianGrid,
    | 'width'
    | 'height'
    | 'rows'
    | 'cols'
    | 'padding'
    | 'hideHorizontal'
    | 'hideVertical'
>;

const meta = {
    title: 'Charts/CartesianGrid',
    component: 'hmi-cartesian-grid',
    tags: ['autodocs'],
    args: {
        width: 400,
        height: 160,
        rows: 4,
        cols: 6,
        padding: 16,
        hideHorizontal: false,
        hideVertical: false,
    },
    argTypes: {
        width: { control: 'number' },
        height: { control: 'number' },
        rows: { control: 'number' },
        cols: { control: 'number' },
        padding: { control: 'number' },
        hideHorizontal: { control: 'boolean' },
        hideVertical: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-cartesian-grid
            width=${args.width}
            height=${args.height}
            rows=${args.rows}
            cols=${args.cols}
            padding=${args.padding}
            ?hide-horizontal=${args.hideHorizontal}
            ?hide-vertical=${args.hideVertical}
        ></hmi-cartesian-grid>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { CartesianGrid } from '@ninoverse/hmi-components/react/cartesian-grid'` — `<CartesianGrid width={400} height={160} rows={4} cols={6} />`. It draws its own `<svg>`; the charts draw the same grid inside theirs.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const HorizontalOnly: Story = { args: { hideVertical: true } };

export const VerticalOnly: Story = { args: { hideHorizontal: true } };

export const Coarse: Story = { args: { rows: 2, cols: 2, padding: 0 } };
