import { html, render } from 'lit';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import type { HmiBadge } from '../badge/badge.js';
import type { HmiButton } from '../button/button.js';
import type { HmiLink } from '../link/link.js';
import './table.js';
import type {
    HmiTable,
    TableActionDetail,
    TableColumn,
    TableRow,
    TableSortDetail,
} from './table.js';
import { Table } from './table.react.js';

const ROWS: TableRow[] = [
    { id: 'ada', name: 'Ada Lovelace', commits: 142, status: 'active' },
    { id: 'alan', name: 'Alan Turing', commits: 87, status: 'pending' },
    { id: 'grace', name: 'Grace Hopper', commits: 231, status: 'active' },
    { id: 'linus', name: 'Linus Torvalds', commits: 64, status: 'idle' },
];

const COLUMNS: TableColumn[] = [
    { key: 'name', label: 'Name' },
    {
        key: 'commits',
        label: 'Commits',
        style: { textAlign: 'right', width: '120px' },
    },
    { key: 'status', label: 'Status', sortable: false },
];

async function fixture(template: ReturnType<typeof html>): Promise<HmiTable> {
    const host = document.createElement('div');
    document.body.append(host);
    render(template, host);
    const el = host.firstElementChild as HmiTable;
    await el.updateComplete;
    return el;
}

const plain = (columns: TableColumn[] = COLUMNS, rows: TableRow[] = ROWS) =>
    fixture(html`<hmi-table .columns=${columns} .rows=${rows}></hmi-table>`);

const parts = (el: HmiTable, name: string) =>
    Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>(`[part~="${name}"]`) ?? [],
    );

/** The text of one column's cells, top to bottom. */
const columnText = (el: HmiTable, index: number) =>
    parts(el, 'row').map((row) =>
        row.querySelectorAll('[part~="cell"]')[index]?.textContent?.trim(),
    );

const cell = (el: HmiTable, row: number, column: number) =>
    parts(el, 'row')[row]?.querySelectorAll<HTMLElement>('[part~="cell"]')[
        column
    ] as HTMLElement;

const header = (el: HmiTable, label: string) =>
    parts(el, 'header').find(
        (th) => th.textContent?.trim() === label,
    ) as HTMLElement;

const sortButton = (el: HmiTable, label: string) =>
    header(el, label).querySelector<HTMLButtonElement>('[part~="sort"]');

const slot = (el: HmiTable, name: string) =>
    el.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`);

afterEach(() => {
    document.body.replaceChildren();
});

describe('hmi-table', () => {
    it('registers', () => {
        expect(customElements.get('hmi-table')).toBeDefined();
    });

    it('renders', async () => {
        const el = await plain();
        const base = el.shadowRoot?.querySelector('[part~="base"]');
        expect(base).not.toBeNull();
        const box = base?.getBoundingClientRect();
        expect(box?.width).toBeGreaterThan(0);
        expect(box?.height).toBeGreaterThan(0);
    });

    it('renders a header per column and a row per row, in order', async () => {
        const el = await plain();
        expect(parts(el, 'header').map((th) => th.textContent?.trim())).toEqual(
            ['Name', 'Commits', 'Status'],
        );
        expect(parts(el, 'row')).toHaveLength(4);
        expect(columnText(el, 0)).toEqual([
            'Ada Lovelace',
            'Alan Turing',
            'Grace Hopper',
            'Linus Torvalds',
        ]);
        expect(columnText(el, 1)).toEqual(['142', '87', '231', '64']);
    });

    it('shows a missing value as nothing and a boolean as its word', async () => {
        const el = await plain(
            [
                { key: 'a', label: 'A' },
                { key: 'b', label: 'B' },
                { key: 'c', label: 'C' },
            ],
            [{ a: null, b: undefined, c: false }],
        );
        expect(columnText(el, 0)).toEqual(['']);
        expect(columnText(el, 1)).toEqual(['']);
        expect(columnText(el, 2)).toEqual(['false']);
    });

    it('paints the last row without a bottom border', async () => {
        const el = await plain();
        // The test page loads no theme, so the token the border reads is set here.
        el.style.setProperty('--outline-variant', 'rgb(1 2 3)');
        expect(getComputedStyle(cell(el, 0, 0)).borderBottomWidth).not.toBe(
            '0px',
        );
        expect(getComputedStyle(cell(el, 3, 0)).borderBottomWidth).toBe('0px');
    });

    it('applies a column style to its header and cells', async () => {
        const el = await plain();
        for (const target of [header(el, 'Commits'), cell(el, 1, 1)]) {
            const style = getComputedStyle(target);
            expect(style.textAlign).toBe('right');
            expect(target.style.width).toBe('120px');
        }
        expect(getComputedStyle(cell(el, 1, 0)).textAlign).toBe('left');
    });

    describe('cells', () => {
        it('formats a cell with a template over the row and {value}', async () => {
            const el = await plain(
                [
                    {
                        key: 'commits',
                        label: 'Commits',
                        format: '{value} commits ({name})',
                    },
                ],
                ROWS,
            );
            expect(columnText(el, 0)[0]).toBe('142 commits (Ada Lovelace)');
        });

        it('keeps text for kind text even when format is set', async () => {
            const el = await plain(
                [
                    {
                        key: 'commits',
                        label: 'C',
                        kind: 'text',
                        format: '{value}!',
                    },
                ],
                ROWS,
            );
            expect(columnText(el, 0)[0]).toBe('142');
        });

        it('lets render win, and accepts a string, a template and a node', async () => {
            const el = await plain(
                [
                    {
                        key: 'name',
                        label: 'A',
                        kind: 'badge',
                        render: (row) => `<${String(row.id)}>`,
                    },
                    {
                        key: 'name',
                        label: 'B',
                        render: (row) => html`<i>${String(row.id)}</i>`,
                    },
                    {
                        key: 'name',
                        label: 'C',
                        render: (row) => {
                            const node = document.createElement('b');
                            node.textContent = String(row.commits);
                            return node;
                        },
                    },
                ],
                ROWS,
            );
            expect(cell(el, 0, 0).textContent?.trim()).toBe('<ada>');
            expect(cell(el, 0, 0).querySelector('hmi-badge')).toBeNull();
            expect(cell(el, 1, 1).querySelector('i')?.textContent).toBe('alan');
            expect(cell(el, 2, 2).querySelector('b')?.textContent).toBe('231');
        });

        it('shows a badge with a fixed variant, a map or a function', async () => {
            const el = await plain(
                [
                    {
                        key: 'status',
                        label: 'Fixed',
                        kind: 'badge',
                        badgeVariant: 'info',
                        badgeDot: true,
                    },
                    {
                        key: 'status',
                        label: 'Map',
                        kind: 'badge',
                        badgeVariant: { active: 'success', pending: 'warning' },
                    },
                    {
                        key: 'status',
                        label: 'Fn',
                        kind: 'badge',
                        badgeVariant: (value, row) =>
                            value === 'idle' && row.id === 'linus'
                                ? 'danger'
                                : 'primary',
                    },
                ],
                ROWS,
            );
            const badge = (row: number, column: number) =>
                cell(el, row, column).querySelector('hmi-badge') as HmiBadge;
            expect(badge(0, 0).variant).toBe('info');
            expect(badge(0, 0).dot).toBe(true);
            expect(badge(0, 0).textContent?.trim()).toBe('active');
            expect([0, 1, 3].map((r) => badge(r, 1).variant)).toEqual([
                'success',
                'warning',
                'default',
            ]);
            expect(badge(0, 1).dot).toBe(false);
            expect([0, 3].map((r) => badge(r, 2).variant)).toEqual([
                'primary',
                'danger',
            ]);
        });

        it('shows a link whose href is a template over the row', async () => {
            const el = await plain(
                [
                    {
                        key: 'name',
                        label: 'Name',
                        kind: 'link',
                        href: '/people/{id}',
                    },
                ],
                ROWS,
            );
            const link = cell(el, 1, 0).querySelector('hmi-link') as HmiLink;
            await link.updateComplete;
            expect(link.textContent?.trim()).toBe('Alan Turing');
            expect(
                link.shadowRoot?.querySelector('a')?.getAttribute('href'),
            ).toBe('/people/alan');
        });

        it('leaves text where a link would run script', async () => {
            const el = await plain(
                [{ key: 'url', label: 'U', kind: 'link', href: '{url}' }],
                [
                    { url: 'javascript:alert(1)' },
                    { url: ' JavaScript:alert(1)' },
                    { url: 'data:text/html,x' },
                    { url: 'https://example.com/a' },
                    { url: 'mailto:ada@example.com' },
                ],
            );
            expect(
                parts(el, 'row').map(
                    (row) => row.querySelector('hmi-link') !== null,
                ),
            ).toEqual([false, false, false, true, true]);
            expect(columnText(el, 0)[0]).toBe('javascript:alert(1)');
        });

        it('shows the text of a link without an href', async () => {
            const el = await plain([{ key: 'name', label: 'N', kind: 'link' }]);
            expect(cell(el, 0, 0).querySelector('hmi-link')).toBeNull();
            expect(columnText(el, 0)[0]).toBe('Ada Lovelace');
        });

        it('renders a small button per action', async () => {
            const el = await plain(
                [
                    {
                        key: 'id',
                        label: 'Actions',
                        kind: 'actions',
                        actions: [
                            { label: 'Edit', value: 'edit' },
                            {
                                label: 'Delete',
                                value: 'delete',
                                variant: 'danger',
                            },
                        ],
                    },
                ],
                ROWS,
            );
            const buttons = cell(el, 0, 0).querySelectorAll('hmi-button');
            expect(
                Array.from(buttons).map((b) => b.textContent?.trim()),
            ).toEqual(['Edit', 'Delete']);
            expect(buttons[0]?.getAttribute('size')).toBe('small');
            expect(buttons[1]?.getAttribute('variant')).toBe('danger');
            expect(buttons[0]?.getAttribute('part')).toBe('action');
        });
    });

    describe('slots', () => {
        it('projects header-<columnKey> slot', async () => {
            const el = await fixture(
                html`<hmi-table .columns=${COLUMNS} .rows=${ROWS}
                    ><b slot="header-name">Who</b></hmi-table
                >`,
            );
            expect(slot(el, 'header-name')?.assignedElements()).toHaveLength(1);
            expect(slot(el, 'header-commits')?.assignedElements()).toHaveLength(
                0,
            );
            expect(slot(el, 'header-commits')?.textContent?.trim()).toBe(
                'Commits',
            );
        });

        it('projects cell-<rowKey>-<columnKey> slot, named by the row-key field', async () => {
            const el = await fixture(
                html`<hmi-table row-key="id" .columns=${COLUMNS} .rows=${ROWS}
                    ><i slot="cell-grace-status">yes</i></hmi-table
                >`,
            );
            expect(
                slot(el, 'cell-grace-status')?.assignedElements(),
            ).toHaveLength(1);
            expect(
                slot(el, 'cell-ada-status')?.assignedElements(),
            ).toHaveLength(0);
            expect(slot(el, 'cell-ada-status')?.textContent?.trim()).toBe(
                'active',
            );
        });

        it('names a row by its position without a row-key', async () => {
            const el = await fixture(
                html`<hmi-table .columns=${COLUMNS} .rows=${ROWS}
                    ><i slot="cell-2-name">x</i></hmi-table
                >`,
            );
            expect(slot(el, 'cell-2-name')?.assignedElements()).toHaveLength(1);
            expect(el.rowKey).toBeUndefined();
        });

        it('names a row with a function, given the row and its position', async () => {
            const el = await fixture(
                html`<hmi-table
                    .rowKey=${(row: TableRow, index: number) =>
                        `${String(row.id)}-${index}`}
                    .columns=${COLUMNS}
                    .rows=${ROWS}
                ></hmi-table>`,
            );
            expect(slot(el, 'cell-alan-1-name')).not.toBeNull();
            expect(slot(el, 'cell-alan-0-name')).toBeNull();
        });

        it('falls back to the position for a row without the field', async () => {
            const el = await fixture(
                html`<hmi-table
                    row-key="id"
                    .columns=${[{ key: 'name', label: 'N' }]}
                    .rows=${[{ name: 'x' }, { id: 'b', name: 'y' }]}
                ></hmi-table>`,
            );
            expect(slot(el, 'cell-0-name')).not.toBeNull();
            expect(slot(el, 'cell-b-name')).not.toBeNull();
        });

        it('keeps a cell slot with its row when sorted', async () => {
            const el = await fixture(
                html`<hmi-table row-key="id" .columns=${COLUMNS} .rows=${ROWS}
                    ><i slot="cell-linus-status">mine</i></hmi-table
                >`,
            );
            const rowOf = () =>
                parts(el, 'row').findIndex((r) =>
                    r.querySelector('slot[name="cell-linus-status"]'),
                );
            expect(rowOf()).toBe(3);
            sortButton(el, 'Commits')?.click();
            await el.updateComplete;
            expect(rowOf()).toBe(0);
        });
    });

    describe('sorting', () => {
        it('sorts ascending and then flips, and fires hmi-sort', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-sort', listener);
            sortButton(el, 'Commits')?.click();
            await el.updateComplete;
            expect(columnText(el, 1)).toEqual(['64', '87', '142', '231']);
            expect(el.sortKey).toBe('commits');
            expect(el.sortDir).toBe('asc');
            sortButton(el, 'Commits')?.click();
            await el.updateComplete;
            expect(columnText(el, 1)).toEqual(['231', '142', '87', '64']);
            expect(el.sortDir).toBe('desc');
            document.removeEventListener('hmi-sort', listener);
            expect(listener).toHaveBeenCalledTimes(2);
        });

        it('dispatches hmi-sort with detail', async () => {
            const el = await plain();
            const listener = vi.fn();
            document.addEventListener('hmi-sort', listener, { once: true });
            sortButton(el, 'Name')?.click();
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock
                .calls[0]?.[0] as CustomEvent<TableSortDetail>;
            expect(event.detail).toEqual({ key: 'name', dir: 'asc' });
            expect(event.bubbles).toBe(true);
            expect(event.composed).toBe(true);
            expect(event.cancelable).toBe(false);
        });

        it('starts a new column ascending', async () => {
            const el = await plain();
            sortButton(el, 'Commits')?.click();
            sortButton(el, 'Commits')?.click();
            sortButton(el, 'Name')?.click();
            await el.updateComplete;
            expect(el.sortKey).toBe('name');
            expect(el.sortDir).toBe('asc');
            expect(columnText(el, 0)[0]).toBe('Ada Lovelace');
        });

        it('sorts numbers as numbers, text with locale order, and missing values first', async () => {
            const el = await plain(
                [
                    { key: 'n', label: 'N' },
                    { key: 's', label: 'S' },
                ],
                [
                    { n: 10, s: 'b' },
                    { n: 9, s: null },
                    { n: 100, s: 'a' },
                ],
            );
            sortButton(el, 'N')?.click();
            await el.updateComplete;
            expect(columnText(el, 0)).toEqual(['9', '10', '100']);
            sortButton(el, 'S')?.click();
            await el.updateComplete;
            expect(columnText(el, 1)).toEqual(['', 'a', 'b']);
        });

        it('shows the sorted rows without reordering rows', async () => {
            const el = await plain();
            const before = [...el.rows];
            sortButton(el, 'Commits')?.click();
            await el.updateComplete;
            expect(el.rows).toEqual(before);
            expect(el.rows[0]).toBe(before[0]);
        });

        it('hands the original row object to a cell, sorted or not', async () => {
            const seen: TableRow[] = [];
            const el = await plain(
                [
                    {
                        key: 'name',
                        label: 'Name',
                        render: (row) => {
                            seen.push(row);
                            return String(row.name);
                        },
                    },
                    { key: 'commits', label: 'Commits' },
                ],
                ROWS,
            );
            sortButton(el, 'Commits')?.click();
            await el.updateComplete;
            expect(seen.every((row) => ROWS.includes(row))).toBe(true);
        });

        it('marks the sorted header and no other', async () => {
            const el = await plain();
            expect(header(el, 'Commits').getAttribute('data-sort')).toBe(
                'idle',
            );
            expect(header(el, 'Commits').hasAttribute('aria-sort')).toBe(false);
            expect(header(el, 'Status').hasAttribute('data-sort')).toBe(false);
            sortButton(el, 'Commits')?.click();
            await el.updateComplete;
            expect(header(el, 'Commits').getAttribute('data-sort')).toBe('asc');
            expect(header(el, 'Commits').getAttribute('aria-sort')).toBe(
                'ascending',
            );
            expect(header(el, 'Name').getAttribute('data-sort')).toBe('idle');
            expect(header(el, 'Name').hasAttribute('aria-sort')).toBe(false);
            sortButton(el, 'Commits')?.click();
            await el.updateComplete;
            expect(header(el, 'Commits').getAttribute('aria-sort')).toBe(
                'descending',
            );
            expect(header(el, 'Commits').getAttribute('data-sort')).toBe(
                'desc',
            );
        });

        it('gives no sort button to a column with sortable: false', async () => {
            const el = await plain();
            expect(sortButton(el, 'Status')).toBeNull();
            expect(parts(el, 'sort')).toHaveLength(2);
        });

        it('sorts from the keyboard', async () => {
            const el = await plain();
            sortButton(el, 'Commits')?.focus();
            await userEvent.keyboard('{Enter}');
            await el.updateComplete;
            expect(el.sortKey).toBe('commits');
            expect(columnText(el, 1)[0]).toBe('64');
        });

        it('starts sorted from sort-key and sort-dir, without an event', async () => {
            const listener = vi.fn();
            document.addEventListener('hmi-sort', listener);
            const el = await fixture(
                html`<hmi-table
                    sort-key="commits"
                    sort-dir="desc"
                    .columns=${COLUMNS}
                    .rows=${ROWS}
                ></hmi-table>`,
            );
            document.removeEventListener('hmi-sort', listener);
            expect(el.sortKey).toBe('commits');
            expect(el.sortDir).toBe('desc');
            expect(columnText(el, 1)).toEqual(['231', '142', '87', '64']);
            expect(listener).not.toHaveBeenCalled();
        });

        it('follows the sort-key and sort-dir attributes, and clears when sort-key is removed', async () => {
            const el = await plain();
            el.setAttribute('sort-key', 'name');
            el.setAttribute('sort-dir', 'desc');
            await el.updateComplete;
            expect(el.sortKey).toBe('name');
            expect(columnText(el, 0)[0]).toBe('Linus Torvalds');
            sortButton(el, 'Name')?.click();
            await el.updateComplete;
            expect(el.sortDir).toBe('asc');
            el.removeAttribute('sort-key');
            await el.updateComplete;
            expect(el.sortKey).toBeNull();
            expect(columnText(el, 0)[0]).toBe('Ada Lovelace');
            expect(columnText(el, 1)).toEqual(['142', '87', '231', '64']);
        });

        it('boolean attribute presence', async () => {
            const el = await fixture(
                html`<hmi-table no-sort .columns=${COLUMNS} .rows=${ROWS}></hmi-table>`,
            );
            expect(el.noSort).toBe(true);
            expect(parts(el, 'sort')).toHaveLength(0);
            expect(header(el, 'Commits').hasAttribute('data-sort')).toBe(false);
            el.removeAttribute('no-sort');
            await el.updateComplete;
            expect(el.noSort).toBe(false);
            expect(parts(el, 'sort')).toHaveLength(2);
        });

        it('still shows a sort set from code under no-sort', async () => {
            const el = await fixture(
                html`<hmi-table
                    no-sort
                    sort-key="commits"
                    .columns=${COLUMNS}
                    .rows=${ROWS}
                ></hmi-table>`,
            );
            expect(columnText(el, 1)).toEqual(['64', '87', '142', '231']);
            expect(header(el, 'Commits').getAttribute('aria-sort')).toBe(
                'ascending',
            );
        });
    });

    describe('actions', () => {
        it('dispatches hmi-action with detail', async () => {
            const el = await plain(
                [
                    {
                        key: 'id',
                        label: 'Actions',
                        kind: 'actions',
                        actions: [
                            { label: 'Edit', value: 'edit' },
                            { label: 'Delete', value: 'delete' },
                        ],
                    },
                ],
                ROWS,
            );
            const listener = vi.fn();
            document.addEventListener('hmi-action', listener, { once: true });
            (
                cell(el, 2, 0).querySelectorAll('hmi-button')[1] as HmiButton
            ).click();
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock
                .calls[0]?.[0] as CustomEvent<TableActionDetail>;
            expect(event.detail.value).toBe('delete');
            expect(event.detail.row).toBe(ROWS[2]);
            expect(event.bubbles).toBe(true);
            expect(event.composed).toBe(true);
        });

        it('names the row that was sorted into place', async () => {
            const el = await plain(
                [
                    { key: 'commits', label: 'Commits' },
                    {
                        key: 'id',
                        label: 'Actions',
                        kind: 'actions',
                        actions: [{ label: 'Open', value: 'open' }],
                    },
                ],
                ROWS,
            );
            sortButton(el, 'Commits')?.click();
            await el.updateComplete;
            const rows: TableRow[] = [];
            el.addEventListener('hmi-action', (event) =>
                rows.push((event as CustomEvent<TableActionDetail>).detail.row),
            );
            (cell(el, 0, 1).querySelector('hmi-button') as HmiButton).click();
            expect(rows[0]?.id).toBe('linus');
        });
    });

    it('exposes a table with column headers', async () => {
        const el = await plain();
        const table = el.shadowRoot?.querySelector('[part~="table"]');
        expect(table?.tagName).toBe('TABLE');
        expect(
            parts(el, 'header').every(
                (th) => th.getAttribute('scope') === 'col',
            ),
        ).toBe(true);
        expect(sortButton(el, 'Name')?.getAttribute('type')).toBe('button');
    });
});

describe('Table (React wrapper)', () => {
    it('takes the properties and calls onSort and onAction', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        const onSort = vi.fn();
        const onAction = vi.fn();
        await act(async () => {
            root.render(
                createElement(Table, {
                    columns: [
                        { key: 'name', label: 'Name' },
                        {
                            key: 'id',
                            label: 'Actions',
                            kind: 'actions',
                            actions: [{ label: 'Open', value: 'open' }],
                        },
                    ],
                    rows: ROWS,
                    rowKey: (row: TableRow) => String(row.id),
                    noSort: false,
                    onSort,
                    onAction,
                }),
            );
        });
        const el = host.querySelector('hmi-table') as HmiTable;
        await el.updateComplete;
        expect(parts(el, 'row')).toHaveLength(4);
        expect(slot(el, 'cell-ada-name')).not.toBeNull();
        sortButton(el, 'Name')?.click();
        expect(onSort).toHaveBeenCalledOnce();
        expect(onSort.mock.calls[0]?.[0].detail).toEqual({
            key: 'name',
            dir: 'asc',
        });
        await el.updateComplete;
        (cell(el, 0, 1).querySelector('hmi-button') as HmiButton).click();
        expect(onAction).toHaveBeenCalledOnce();
        expect(onAction.mock.calls[0]?.[0].detail.value).toBe('open');
        await act(async () => root.unmount());
    });

    it('turns sorting off with noSort', async () => {
        const host = document.createElement('div');
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => {
            root.render(
                createElement(Table, {
                    columns: COLUMNS,
                    rows: ROWS,
                    noSort: true,
                }),
            );
        });
        const el = host.querySelector('hmi-table') as HmiTable;
        await el.updateComplete;
        expect(el.noSort).toBe(true);
        expect(parts(el, 'sort')).toHaveLength(0);
        await act(async () => root.unmount());
    });
});
