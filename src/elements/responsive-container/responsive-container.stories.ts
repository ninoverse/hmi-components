import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../cartesian-grid/cartesian-grid.js';
import './responsive-container.js';
import type {
    HmiResponsiveContainer,
    ResponsiveContainerResizeDetail,
} from './responsive-container.js';

type Args = Pick<HmiResponsiveContainer, 'height' | 'aspect'>;

/** Size a grid from `hmi-resize`: the container only measures. */
const sizeGrid = (e: CustomEvent<ResponsiveContainerResizeDetail>) => {
    const grid = (e.currentTarget as HTMLElement).querySelector(
        'hmi-cartesian-grid',
    );
    if (grid) {
        grid.width = e.detail.width;
        grid.height = e.detail.height;
    }
};

const meta = {
    title: 'Charts/ResponsiveContainer',
    component: 'hmi-responsive-container',
    tags: ['autodocs'],
    args: { height: 160, aspect: undefined },
    argTypes: { height: { control: 'number' }, aspect: { control: 'number' } },
    render: (args) =>
        html`<div style="max-width: 70rem">
            <hmi-responsive-container
                height=${args.height}
                aspect=${args.aspect ?? ''}
                @hmi-resize=${sizeGrid}
            >
                <hmi-cartesian-grid rows="4" cols="6" padding="16" style="background: var(--surface-container-high)"></hmi-cartesian-grid>
            </hmi-responsive-container>
        </div>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { ResponsiveContainer } from '@ninoverse/hmi-components/react/responsive-container'` — `<ResponsiveContainer height={160} onResize={(e) => setSize(e.detail)}>`. It measures and reports; it never touches its children: pass `width` and `height` to a chart from `hmi-resize`, or read `--container-width` and `--container-height`.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const FixedHeight: Story = {};

/** `aspect` derives the height from the measured width. */
export const Aspect: Story = { args: { aspect: 3 } };
