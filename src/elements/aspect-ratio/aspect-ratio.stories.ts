import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './aspect-ratio.js';
import type { HmiAspectRatio } from './aspect-ratio.js';

type Args = Pick<HmiAspectRatio, 'ratio'>;

const frame = html`<div
    style="background: linear-gradient(135deg, var(--primary-container), var(--tertiary-container)); display: flex; align-items: center; justify-content: center; color: var(--on-primary-container)"
>
    Content
</div>`;

const meta = {
    title: 'Components/Layout/AspectRatio',
    component: 'hmi-aspect-ratio',
    tags: ['autodocs'],
    args: { ratio: '16/9' },
    argTypes: { ratio: { control: 'text' } },
    render: (args) =>
        html`<hmi-aspect-ratio .ratio=${args.ratio} style="width: 24rem; max-width: 100%"
            >${frame}</hmi-aspect-ratio
        >`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { AspectRatio } from \'@ninoverse/hmi-components/react/aspect-ratio\'` — `<AspectRatio ratio={16 / 9}><img src="…" alt="…" /></AspectRatio>`. The first child fills the frame with `object-fit: cover`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Ratios: Story = {
    render: () => html`
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start">
            ${[1, '4/3', '16/9', '21/9'].map(
                (ratio) =>
                    html`<hmi-aspect-ratio .ratio=${ratio} style="width: 14rem">${frame}</hmi-aspect-ratio>`,
            )}
        </div>
    `,
};

/** An image fills the frame and is cropped to it, not stretched. */
export const WithImage: Story = {
    render: () =>
        html`<hmi-aspect-ratio ratio="1" style="width: 12rem">
            <svg viewBox="0 0 120 60" preserveAspectRatio="xMidYMid slice">
                <rect width="120" height="60" fill="var(--primary-container)" />
                <circle cx="60" cy="30" r="24" fill="var(--primary)" />
            </svg>
        </hmi-aspect-ratio>`,
};
