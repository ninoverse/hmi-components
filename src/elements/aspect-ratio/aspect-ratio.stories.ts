import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './aspect-ratio.js';
import type { HmiAspectRatio } from './aspect-ratio.js';

type Args = Pick<HmiAspectRatio, 'ratio'>;

/* Widths in multiples of --hmi-base, as the elements size themselves. */
const width = (n: number) =>
    `width: calc(var(--hmi-base, 8px) * ${n}); max-width: 100%`;

/* A 640×360 landscape, so each ratio shows what it crops. */
const photo =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%237fb2e5'/%3E%3Ccircle cx='520' cy='80' r='40' fill='%23ffd34d'/%3E%3Cpath d='M0 300 L160 150 L300 280 L420 170 L640 320 V360 H0Z' fill='%233d7a4f'/%3E%3C/svg%3E";

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
        html`<hmi-aspect-ratio .ratio=${args.ratio} style=${width(48)}
            >${frame}</hmi-aspect-ratio
        >`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { AspectRatio } from \'@ninoverse/hmi-components/react/aspect-ratio\'` — `<AspectRatio ratio={16 / 9}><img src="…" alt="…" /></AspectRatio>`. The frame is as wide as its container unless the host\'s `style` sets a width. Its first child fills it with `object-fit: cover`; put one child in it, since the rest are clipped but still read out. A `border-radius` on the host rounds the content, and a `ratio` that isn\'t a positive number or `width/height` draws as a square.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Ratios: Story = {
    render: () => html`
        <div
            style="display: flex; flex-wrap: wrap; gap: calc(var(--hmi-base, 8px) * 2); align-items: flex-start"
        >
            ${[1, '4/3', '16/9', '21/9'].map(
                (ratio) =>
                    html`<hmi-aspect-ratio .ratio=${ratio} style=${width(28)}
                        >${frame}</hmi-aspect-ratio
                    >`,
            )}
        </div>
    `,
};

/** An image fills the frame and is cropped to it, not stretched. */
export const WithImage: Story = {
    render: () =>
        html`<hmi-aspect-ratio ratio="1" style=${width(24)}>
            <img src=${photo} alt="Hills under a sun" />
        </hmi-aspect-ratio>`,
};

/** A radius on the host rounds the content, as the theme's corners do. */
export const Rounded: Story = {
    render: () =>
        html`<hmi-aspect-ratio
            ratio="16/9"
            style="${width(48)}; border-radius: var(--corner-large)"
        >
            <img src=${photo} alt="Hills under a sun" />
        </hmi-aspect-ratio>`,
};

/** Only the first child is sized: an image inside a link sizes itself. */
export const LinkedImage: Story = {
    render: () =>
        html`<hmi-aspect-ratio ratio="4/3" style=${width(32)}>
            <a href="#">
                <img
                    src=${photo}
                    alt="Hills under a sun"
                    style="display: block; width: 100%; height: 100%; object-fit: cover"
                />
            </a>
        </hmi-aspect-ratio>`,
};
