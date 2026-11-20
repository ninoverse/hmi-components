import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './skeleton.js';
import type { HmiSkeleton } from './skeleton.js';

type Args = Pick<HmiSkeleton, 'variant' | 'width' | 'height' | 'radius'>;

const variants = ['text', 'rect', 'circle'] as const;

const base = (n: number) => `calc(var(--hmi-base, 8px) * ${n})`;

const column = (gap: string, body: unknown) => html`
    <div
        style="display: flex; flex-direction: column; gap: ${gap}; max-width: ${base(40)}"
    >
        ${body}
    </div>
`;

const meta = {
    title: 'Components/Feedback/Skeleton',
    component: 'hmi-skeleton',
    tags: ['autodocs'],
    args: { variant: 'text', width: '80%' },
    argTypes: {
        variant: { control: 'inline-radio', options: variants },
    },
    render: (args) => html`
        <hmi-skeleton
            variant=${args.variant}
            width=${ifDefined(args.width)}
            height=${ifDefined(args.height)}
            radius=${ifDefined(args.radius)}
        ></hmi-skeleton>
    `,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Skeleton } from \'@ninoverse/hmi-components/react/skeleton\'` — `<Skeleton variant="circle" width={40} height={40} />`. Numbers are pixels, and so is a bare number written as an attribute (`width="240"`); other strings pass through as authored. A circle given one size takes it for both. Put `aria-busy="true"` on the region that is loading. On a server-rendered page, size the host with `style`, which arrives with the page, since `width`, `height` and `radius` apply once the element upgrades. `--skeleton-bg` and `--skeleton-highlight` repaint it; inside an ink card it takes the card\'s track colour.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Variants: Story = {
    render: () =>
        column(
            'var(--space-8)',
            html`
                <hmi-skeleton variant="text" width="80%"></hmi-skeleton>
                <hmi-skeleton variant="rect" height=${base(1.5)}></hmi-skeleton>
                <hmi-skeleton variant="circle" width=${base(6)}></hmi-skeleton>
            `,
        ),
};

/** Stack text lines at varying widths to stand in for a paragraph. */
export const TextBlock: Story = {
    render: () =>
        column(
            'var(--space-4)',
            html`
                <hmi-skeleton variant="text" width="80%"></hmi-skeleton>
                <hmi-skeleton variant="text" width="100%"></hmi-skeleton>
                <hmi-skeleton variant="text" width="60%"></hmi-skeleton>
            `,
        ),
};

/** A circle plus lines reads as an avatar row while content loads. */
export const AvatarRow: Story = {
    render: () => html`
        <div
            aria-busy="true"
            aria-label="Profile"
            role="region"
            style="display: flex; align-items: center; gap: var(--space-8); max-width: ${base(40)}"
        >
            <hmi-skeleton variant="circle" width=${base(6)}></hmi-skeleton>
            <div
                style="display: flex; flex-direction: column; gap: var(--space-3); flex: 1"
            >
                <hmi-skeleton variant="text" width="50%"></hmi-skeleton>
                <hmi-skeleton variant="rect" height=${base(1.5)}></hmi-skeleton>
                <hmi-skeleton
                    variant="rect"
                    height=${base(1.5)}
                    width="80%"
                ></hmi-skeleton>
            </div>
        </div>
    `,
};

/** A text skeleton inline in a sentence needs a width, or it takes a line of its own. */
export const Inline: Story = {
    render: () => html`
        <p style="margin: 0">
            Order total:
            <hmi-skeleton width="6em"></hmi-skeleton> due today.
        </p>
    `,
};

/** In right-to-left text the highlight sweeps from the right. */
export const RightToLeft: Story = {
    render: () => html`
        <div dir="rtl">
            ${column(
                'var(--space-4)',
                html`
                    <hmi-skeleton width="80%"></hmi-skeleton>
                    <hmi-skeleton width="60%"></hmi-skeleton>
                `,
            )}
        </div>
    `,
};

/** `--skeleton-bg` and `--skeleton-highlight`, here on a surface-container-high panel, where the default surface matches the panel. */
export const ThemeHooks: Story = {
    render: () => html`
        <div
            style="background: var(--surface-container-high); padding: var(--space-4); max-width: ${base(40)}; --skeleton-bg: var(--surface-container-highest)"
        >
            ${column(
                'var(--space-4)',
                html`
                    <hmi-skeleton width="80%"></hmi-skeleton>
                    <hmi-skeleton variant="rect" height=${base(4)}></hmi-skeleton>
                `,
            )}
        </div>
    `,
};
