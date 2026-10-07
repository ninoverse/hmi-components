import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './carousel.js';
import type { HmiCarousel } from './carousel.js';

type Args = Pick<
    HmiCarousel,
    'index' | 'noLoop' | 'autoPlay' | 'hideArrows' | 'hideDots' | 'label'
>;

const slide = (text: string, background: string, color: string) =>
    html`<div style="aspect-ratio: 16 / 9; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 600; background: var(${background}); color: var(${color})">${text}</div>`;

const meta = {
    title: 'Components/DataDisplay/Carousel',
    component: 'hmi-carousel',
    tags: ['autodocs'],
    args: {
        index: 0,
        noLoop: false,
        hideArrows: false,
        hideDots: false,
        label: 'Highlights',
    },
    argTypes: {
        index: { control: 'number' },
        noLoop: { control: 'boolean' },
        autoPlay: { control: 'number' },
        hideArrows: { control: 'boolean' },
        hideDots: { control: 'boolean' },
        label: { control: 'text' },
    },
    render: (args) =>
        html`<hmi-carousel
            style="max-width: 40rem"
            label=${ifDefined(args.label)}
            index=${ifDefined(args.index)}
            auto-play=${ifDefined(args.autoPlay)}
            ?no-loop=${args.noLoop}
            ?hide-arrows=${args.hideArrows}
            ?hide-dots=${args.hideDots}
        >
            ${slide('First', '--primary-container', '--on-primary-container')}
            ${slide('Second', '--secondary-container', '--on-secondary-container')}
            ${slide('Third', '--tertiary-container', '--on-tertiary-container')}
        </hmi-carousel>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Carousel } from \'@ninoverse/hmi-components/react/carousel\'` — `<Carousel label="Highlights" onIndexChange={(e) => setIndex(e.detail.index)}><Slide1 /><Slide2 /></Carousel>`. Every element child is a slide, and the element never changes it: add `role="group"`, `aria-roledescription="slide"` and an `aria-label` to your own slides to announce them. `noLoop`, `hideArrows` and `hideDots` turn the defaults off.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const SecondSlide: Story = { args: { index: 1 } };

export const NoLoop: Story = { args: { noLoop: true } };

export const AutoPlay: Story = { args: { autoPlay: 3000 } };

export const NoArrows: Story = { args: { hideArrows: true } };

export const NoDots: Story = { args: { hideDots: true } };
