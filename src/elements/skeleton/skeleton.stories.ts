import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './skeleton.js';
import type { HmiSkeleton } from './skeleton.js';

type Args = Pick<HmiSkeleton, 'variant' | 'width' | 'height' | 'radius'>;

const variants = ['text', 'rect', 'circle'] as const;

const column = (gap: string, body: unknown) => html`
    <div
        style="display: flex; flex-direction: column; gap: ${gap}; max-width: 40rem"
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
                    'React: `import { Skeleton } from \'@ninoverse/hmi-components/react/skeleton\'` — `<Skeleton variant="circle" width={40} height={40} />`. Numbers are pixels; strings pass through as authored.',
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
            '2rem',
            html`
                <hmi-skeleton variant="text" width="80%"></hmi-skeleton>
                <hmi-skeleton variant="rect" height="1.5rem"></hmi-skeleton>
                <hmi-skeleton
                    variant="circle"
                    width="6rem"
                    height="6rem"
                ></hmi-skeleton>
            `,
        ),
};

/** Stack text lines at varying widths to stand in for a paragraph. */
export const TextBlock: Story = {
    render: () =>
        column(
            '1rem',
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
            style="display: flex; align-items: center; gap: 2rem; max-width: 40rem"
        >
            <hmi-skeleton
                variant="circle"
                width="6rem"
                height="6rem"
            ></hmi-skeleton>
            <div
                style="display: flex; flex-direction: column; gap: 0.75rem; flex: 1"
            >
                <hmi-skeleton variant="text" width="50%"></hmi-skeleton>
                <hmi-skeleton variant="rect" height="1.5rem"></hmi-skeleton>
                <hmi-skeleton
                    variant="rect"
                    height="1.5rem"
                    width="80%"
                ></hmi-skeleton>
            </div>
        </div>
    `,
};
