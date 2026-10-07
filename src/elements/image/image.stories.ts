import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './image.js';
import type { HmiImage } from './image.js';

type Args = Pick<
    HmiImage,
    | 'src'
    | 'alt'
    | 'ratio'
    | 'fit'
    | 'position'
    | 'radius'
    | 'placeholder'
    | 'width'
    | 'height'
>;

const COVER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='360'%3E%3Crect width='480' height='360' fill='%23e87a5d'/%3E%3Ccircle cx='240' cy='180' r='90' fill='%23fff' fill-opacity='.35'/%3E%3C/svg%3E";
const TALL =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='420'%3E%3Crect width='300' height='420' fill='%231f5b58'/%3E%3Crect x='60' y='90' width='180' height='240' fill='%23fff' fill-opacity='.3'/%3E%3C/svg%3E";

const meta = {
    title: 'Components/DataDisplay/Image',
    component: 'hmi-image',
    tags: ['autodocs'],
    args: {
        src: COVER,
        alt: 'Cover',
        ratio: 4 / 3,
        fit: 'cover',
        radius: 'medium',
        placeholder: 'shimmer',
        width: 280,
    },
    argTypes: {
        src: { control: 'text' },
        alt: { control: 'text' },
        ratio: { control: 'number' },
        fit: {
            control: 'select',
            options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
        },
        position: { control: 'text' },
        radius: {
            control: 'select',
            options: ['none', 'small', 'medium', 'large', 'full'],
        },
        placeholder: { control: 'text' },
        width: { control: 'text' },
        height: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-image
            src=${ifDefined(args.src)}
            alt=${ifDefined(args.alt)}
            ratio=${ifDefined(args.ratio)}
            fit=${ifDefined(args.fit)}
            position=${ifDefined(args.position)}
            radius=${ifDefined(args.radius)}
            placeholder=${ifDefined(args.placeholder)}
            width=${ifDefined(args.width)}
            height=${ifDefined(args.height)}
        ></hmi-image>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Image } from \'@ninoverse/hmi-components/react/image\'` — `<Image src="/cover.jpg" alt="Cover" ratio={16 / 9} radius="large" />`. To render the image yourself, for example with `next/image`, pass it as a child: `<Image ratio={16 / 9}><NextImage src={src} alt="" fill sizes="100vw" /></Image>`; the shell still shows the placeholder and the fallback. Or pass the props of Next\'s `getImageProps()` (`src`, `srcset`, `sizes`) to the built-in image.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Contain: Story = { args: { src: TALL, fit: 'contain' } };

export const Circle: Story = {
    args: { ratio: undefined, width: 180, height: 180, radius: 'full' },
};

export const TopAligned: Story = {
    args: { position: 'top', placeholder: '#1f5b58', radius: 'large' },
};

export const Missing: Story = {
    args: { src: '/this-image-does-not-exist.png', radius: 'large' },
};

/** Your own `<img>` in the default slot; the shell hears its `load` and `error`. */
export const SlottedImage: Story = {
    render: (args) =>
        html`<hmi-image ratio=${ifDefined(args.ratio)} width=${ifDefined(args.width)} radius="large">
            <img src=${TALL} alt="Custom-rendered image" style="object-fit: cover" />
        </hmi-image>`,
};

/** `slot="fallback"` replaces the broken-image icon. */
export const CustomFallback: Story = {
    render: (args) =>
        html`<hmi-image src="/this-image-does-not-exist.png" alt="" ratio=${ifDefined(args.ratio)} width=${ifDefined(args.width)} radius="large">
            <span slot="fallback" style="padding: 1rem; text-align: center">Image unavailable</span>
        </hmi-image>`,
};
