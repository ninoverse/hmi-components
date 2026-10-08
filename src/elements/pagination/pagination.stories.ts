import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './pagination.js';
import type { HmiPagination, PaginationChangeDetail } from './pagination.js';

type Args = Pick<HmiPagination, 'page' | 'total'>;

const meta = {
    title: 'Components/Navigation/Pagination',
    component: 'hmi-pagination',
    tags: ['autodocs'],
    args: { page: 8, total: 20 },
    argTypes: {
        page: { control: { type: 'number', min: 1 } },
        total: { control: { type: 'number', min: 0 } },
    },
    // Controlled: set `page` back from `hmi-change`.
    render: (args) =>
        html`<hmi-pagination
            .page=${args.page}
            .total=${args.total}
            @hmi-change=${(e: CustomEvent<PaginationChangeDetail>) => {
                (e.currentTarget as HmiPagination).page = e.detail.value;
            }}
        ></hmi-pagination>`,
    parameters: {
        docs: {
            description: {
                component:
                    "React: `import { Pagination } from '@ninoverse/hmi-components/react/pagination'` — `<Pagination page={page} total={20} onChange={(e) => setPage(e.detail.value)} />`.",
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Up to seven pages are all shown. */
export const Short: Story = { args: { page: 3, total: 5 } };

export const FirstPage: Story = { args: { page: 1 } };

export const LastPage: Story = { args: { page: 20 } };

/** The names are properties, so they can be translated. */
export const Translated: Story = {
    render: (args) =>
        html`<hmi-pagination
            .page=${args.page}
            .total=${args.total}
            label="Pagination des résultats"
            prev-label="Page précédente"
            next-label="Page suivante"
            page-label="Page {page}"
        ></hmi-pagination>`,
};
