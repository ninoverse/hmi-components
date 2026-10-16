import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './table.js';
import type {
    HmiTable,
    TableActionDetail,
    TableColumn,
    TableRow,
} from './table.js';

type Args = Pick<
    HmiTable,
    'columns' | 'rows' | 'rowKey' | 'noSort' | 'sortKey' | 'sortDir'
>;

const ROWS: TableRow[] = [
    {
        id: 'ada',
        name: 'Ada Lovelace',
        role: 'Analyst',
        commits: 142,
        status: 'active',
    },
    {
        id: 'alan',
        name: 'Alan Turing',
        role: 'Theoretician',
        commits: 87,
        status: 'pending',
    },
    {
        id: 'grace',
        name: 'Grace Hopper',
        role: 'Compiler',
        commits: 231,
        status: 'active',
    },
    {
        id: 'linus',
        name: 'Linus Torvalds',
        role: 'Maintainer',
        commits: 64,
        status: 'idle',
    },
];

const COLUMNS: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'commits', label: 'Commits', style: { textAlign: 'right' } },
];

const meta = {
    title: 'Components/Data display/Table',
    component: 'hmi-table',
    tags: ['autodocs'],
    args: {
        columns: COLUMNS,
        rows: ROWS,
        rowKey: 'id',
        noSort: false,
        sortKey: null,
        sortDir: 'asc',
    },
    argTypes: {
        columns: { control: 'object' },
        rows: { control: 'object' },
        rowKey: { control: 'text' },
        noSort: { control: 'boolean' },
        sortKey: { control: 'text' },
        sortDir: { control: 'inline-radio', options: ['asc', 'desc'] },
    },
    render: (args) =>
        html`<hmi-table
            .columns=${args.columns}
            .rows=${args.rows}
            .rowKey=${args.rowKey}
            ?no-sort=${args.noSort}
            .sortKey=${args.sortKey}
            .sortDir=${args.sortDir}
        ></hmi-table>`,
    parameters: {
        docs: {
            description: {
                component:
                    'React: `import { Table } from \'@ninoverse/hmi-components/react/table\'` — `<Table columns={columns} rows={rows} rowKey="id" onSort={(e) => …} />`. `rowKey` is v5\'s `getRowKey` and `noSort` is `sortable={false}`. A column\'s `render` returns a string, a Lit template or a DOM node, never JSX: put a React element in a cell as a child with `slot="cell-<rowKey>-<columnKey>"`.',
            },
        },
    },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Headers sort on click, ascending first and then flipping. `row-key` names a row. */
export const Default: Story = {};

/** `sort-key` and `sort-dir` set the sort from outside; a click on a header updates them. */
export const Sorted: Story = { args: { sortKey: 'commits', sortDir: 'desc' } };

/** `no-sort` turns sorting off for every column. */
export const NoSort: Story = { args: { noSort: true } };

/** `sortable: false` opts one column out. */
export const ColumnNotSortable: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role', sortable: false },
            { key: 'commits', label: 'Commits', style: { textAlign: 'right' } },
        ],
    },
};

/** `format` is a `{token}` template over the row, with `{value}` for the column's own value. */
export const FormattedCells: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role', format: '{value} ({name})' },
            { key: 'commits', label: 'Commits', format: '{value} commits' },
        ],
    },
};

/** `kind: 'badge'` shows the value in a badge; `badgeVariant` maps values to variants. */
export const Badges: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name' },
            {
                key: 'status',
                label: 'Status',
                sortable: false,
                kind: 'badge',
                badgeDot: true,
                badgeVariant: { active: 'success', pending: 'warning' },
            },
        ],
    },
};

/** `kind: 'link'` shows a link whose `href` is a `{token}` template over the row. */
export const Links: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name', kind: 'link', href: '/people/{id}' },
            { key: 'role', label: 'Role' },
        ],
    },
};

/** `kind: 'actions'` shows a button per action, and activating one fires `hmi-action` with `{ value, row }`. */
export const Actions: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name' },
            {
                key: 'id',
                label: 'Actions',
                sortable: false,
                kind: 'actions',
                actions: [
                    { label: 'Edit', value: 'edit' },
                    { label: 'Delete', value: 'delete', variant: 'danger' },
                ],
            },
        ],
    },
    render: (args) =>
        html`<hmi-table
            .columns=${args.columns}
            .rows=${args.rows}
            row-key="id"
            @hmi-action=${(e: CustomEvent<TableActionDetail>) =>
                console.log('hmi-action', e.detail)}
        ></hmi-table>`,
};

/** `render` returns a string, a Lit template or a DOM node; it wins over `kind`. */
export const RenderFunction: Story = {
    args: {
        columns: [
            { key: 'name', label: 'Name' },
            {
                key: 'status',
                label: 'Status',
                sortable: false,
                render: (row) =>
                    html`<span
                        style="display: inline-flex; align-items: center; gap: 0.5em"
                        ><svg
                            viewBox="0 0 16 16"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.7"
                            stroke-linecap="round"
                            aria-hidden="true"
                        >
                            ${
                                row.status === 'active'
                                    ? html`<path d="M3 8.5l3 3 7-7" />`
                                    : html`<circle cx="8" cy="8" r="5" />`
                            }</svg
                        >${String(row.status)}</span
                    >`,
            },
        ],
    },
};

/** A slotted element named `cell-<rowKey>-<columnKey>` replaces that cell; `header-<columnKey>` replaces a header's label. */
export const Slots: Story = {
    render: (args) =>
        html`<hmi-table
            .columns=${args.columns}
            .rows=${args.rows}
            row-key="id"
            sort-key="commits"
            ><b slot="header-name">Who</b
            ><em slot="cell-grace-role">Grace's custom role</em></hmi-table
        >`,
};
