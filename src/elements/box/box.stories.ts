import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './box.js';
import type { HmiBox } from './box.js';

type Args = Pick<HmiBox, 'background' | 'padding' | 'radius' | 'bordered'>;

const backgrounds = [
    'none',
    'surface',
    'surface-variant',
    'surface-container',
    'surface-container-low',
    'surface-container-high',
] as const;
const paddings = ['none', 'small', 'medium', 'large'] as const;
const radii = ['none', 'small', 'medium', 'large', 'full', 'leaf'] as const;

const meta = {
    title: 'Components/Layout/Box',
    component: 'hmi-box',
    tags: ['autodocs'],
    args: {
        background: 'surface-container',
        padding: 'medium',
        radius: 'medium',
        bordered: false,
    },
    argTypes: {
        background: { control: 'select', options: backgrounds },
        padding: { control: 'inline-radio', options: paddings },
        radius: { control: 'select', options: radii },
        bordered: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-box
            background=${args.background}
            padding=${args.padding}
            radius=${args.radius}
            ?bordered=${args.bordered}
            >A box groups content and opts in to a surface.</hmi-box
        >`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Box } from \'@ninoverse/hmi-components/react/box\'` — `<Box background="surface-container" padding="medium" radius="leaf" bordered>…</Box>`. There is no `as` prop: the host is the box, so put `role` on it or wrap the content.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Backgrounds: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
            ${backgrounds.map(
                (background) =>
                    html`<hmi-box background=${background} padding="small">${background}</hmi-box>`,
            )}
        </div>
    `,
};

export const Paddings: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
            ${paddings.map(
                (padding) =>
                    html`<hmi-box background="surface-container" padding=${padding}>${padding}</hmi-box>`,
            )}
        </div>
    `,
};

export const Radii: Story = {
    render: () => html`
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
            ${radii.map(
                (radius) =>
                    html`<hmi-box background="surface-container-high" padding="medium" radius=${radius}>${radius}</hmi-box>`,
            )}
        </div>
    `,
};

export const Bordered: Story = { args: { bordered: true } };
