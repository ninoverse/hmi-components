import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../card/card.js';
import '../link/link.js';
import '../text/text.js';
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
                    'React: `import { Box } from \'@ninoverse/hmi-components/react/box\'` — `<Box background="surface-container" padding="medium" radius="leaf" bordered>…</Box>`. There is no `as` prop: the host is the box, so put `role` on it or wrap the content. The radius does not clip the content: add `style="overflow: hidden"` for that, which also clips a child\'s focus ring.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Backgrounds: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: calc(var(--hmi-base, 8px) * 1)">
            ${backgrounds.map(
                (background) =>
                    html`<hmi-box background=${background} padding="small">${background}</hmi-box>`,
            )}
        </div>
    `,
};

export const Paddings: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: calc(var(--hmi-base, 8px) * 1)">
            ${paddings.map(
                (padding) =>
                    html`<hmi-box background="surface-container" padding=${padding}>${padding}</hmi-box>`,
            )}
        </div>
    `,
};

export const Radii: Story = {
    render: () => html`
        <div style="display: flex; flex-wrap: wrap; gap: calc(var(--hmi-base, 8px) * 1)">
            ${radii.map(
                (radius) =>
                    html`<hmi-box background="surface-container-high" padding="medium" radius=${radius}>${radius}</hmi-box>`,
            )}
        </div>
    `,
};

export const Bordered: Story = { args: { bordered: true } };

/** A box with a background gives its text the surface colours, even in an ink
 * or accent card; one without lets the card's colours through. */
export const OnCards: Story = {
    render: () => html`
        <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--hmi-base, 8px) * 30), 1fr)); gap: calc(var(--hmi-base, 8px) * 2)"
        >
            ${(['ink', 'accent'] as const).map(
                (variant) => html`<hmi-card variant=${variant}>
                    <hmi-box padding="small"><hmi-text>No background: the card's text</hmi-text></hmi-box>
                    <hmi-box background="surface" padding="small" radius="small">
                        <hmi-text>Surface: the surface's text</hmi-text>
                        <hmi-text tone="muted">Muted text</hmi-text>
                        <hmi-link href="#">A link</hmi-link>
                    </hmi-box>
                </hmi-card>`,
            )}
        </div>
    `,
};
