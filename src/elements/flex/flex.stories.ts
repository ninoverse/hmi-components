import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './flex.js';
import type { HmiFlex } from './flex.js';

type Args = Pick<
    HmiFlex,
    'direction' | 'align' | 'justify' | 'gap' | 'wrap' | 'inline'
>;

const directions = ['row', 'column', 'row-reverse', 'column-reverse'] as const;
const aligns = ['start', 'center', 'end', 'stretch', 'baseline'] as const;
const justifies = [
    'start',
    'center',
    'end',
    'between',
    'around',
    'evenly',
] as const;
const gaps = ['none', 'small', 'medium', 'large'] as const;

const unit = (n: number) => `calc(var(--hmi-base, 8px) * ${n})`;

const item = (label: string, height = 4) =>
    html`<span
        style="background: var(--primary-container); color: var(--on-primary-container); padding: ${unit(1)} ${unit(2)}; border-radius: ${unit(1)}; height: ${unit(height)}; display: inline-flex; align-items: center"
        >${label}</span
    >`;

/* An item of two lines: the alignment of its text shows whether `align`
   reaches it. */
const paragraph = (label: string) =>
    html`<span
        style="background: var(--primary-container); color: var(--on-primary-container); padding: ${unit(1)} ${unit(2)}; border-radius: ${unit(1)}; width: ${unit(18)}"
        >${label}: a longer item whose text runs onto two lines</span
    >`;

const meta = {
    title: 'Components/Layout/Flex',
    component: 'hmi-flex',
    tags: ['autodocs'],
    args: {
        direction: 'row',
        align: 'stretch',
        justify: 'start',
        gap: 'medium',
        wrap: false,
        inline: false,
    },
    argTypes: {
        direction: { control: 'inline-radio', options: directions },
        align: { control: 'select', options: aligns },
        justify: { control: 'select', options: justifies },
        gap: { control: 'inline-radio', options: gaps },
        wrap: { control: 'boolean' },
        inline: { control: 'boolean' },
    },
    render: (args) =>
        html`<hmi-flex
            direction=${args.direction}
            align=${args.align}
            justify=${args.justify}
            gap=${args.gap}
            ?wrap=${args.wrap}
            ?inline=${args.inline}
            style="min-height: ${unit(16)}; border: 1px dashed var(--outline-variant)"
        >
            ${item('One')} ${item('Two', 6)} ${item('Three')}
        </hmi-flex>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Flex } from \'@ninoverse/hmi-components/react/flex\'` — `<Flex direction="column" gap="medium">…</Flex>`. There is no `as` prop: the host is the flex container, and `class` and `style` go on it. `align` places the items and never aligns their text, which follows the parent\'s `text-align`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Directions: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: ${unit(2)}">
            ${directions.map(
                (direction) =>
                    html`<hmi-flex direction=${direction} gap="small">
                        ${item(direction)} ${item('b')} ${item('c')}
                    </hmi-flex>`,
            )}
        </div>
    `,
};

export const Alignment: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: ${unit(2)}">
            ${aligns.map(
                (align) =>
                    html`<hmi-flex align=${align} gap="small" style="border: 1px dashed var(--outline-variant)">
                        ${paragraph(align)} ${item('tall', 8)} ${item('c')}
                    </hmi-flex>`,
            )}
        </div>
    `,
};

export const Justification: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: ${unit(2)}">
            ${justifies.map(
                (justify) =>
                    html`<hmi-flex justify=${justify} style="border: 1px dashed var(--outline-variant)">
                        ${item(justify)} ${item('b')} ${item('c')}
                    </hmi-flex>`,
            )}
        </div>
    `,
};

export const Gaps: Story = {
    render: () => html`
        <div style="display: flex; flex-direction: column; gap: ${unit(2)}">
            ${gaps.map(
                (gap) =>
                    html`<hmi-flex gap=${gap}>${item(gap)} ${item('b')} ${item('c')}</hmi-flex>`,
            )}
        </div>
    `,
};

export const Wrapping: Story = {
    args: { wrap: true, gap: 'small' },
    render: (args) =>
        html`<hmi-flex gap=${args.gap} ?wrap=${args.wrap} style="width: ${unit(36)}">
            ${Array.from({ length: 8 }, (_, i) => item(`Item ${i + 1}`))}
        </hmi-flex>`,
};

export const Inline: Story = {
    render: () =>
        html`<p>
            Text before
            <hmi-flex inline gap="small">${item('a')} ${item('b')}</hmi-flex>
            and after.
        </p>`,
};
