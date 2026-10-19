import { html, LitElement, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../badge/badge.js';
import type { BadgeVariant } from '../badge/badge.js';
import '../link/link.js';
import { baseStyles } from '../shared/base.styles.js';
import {
    type DialogAction,
    renderDialogActions,
} from '../shared/dialog-actions.js';
import { emit } from '../shared/events.js';
import { applyTemplate } from '../shared/format.js';
import { styles } from './table.styles.js';

/** One row: the values its columns read by `key`. */
export type TableRow = Record<string, unknown>;

/** The direction a column is sorted in. */
export type TableSortDir = 'asc' | 'desc';

/** How a cell shows its value. */
export type TableCellKind = 'text' | 'format' | 'badge' | 'link' | 'actions';

/** What a column's `render` returns: text, a Lit template or a DOM node. */
export type TableCellContent = string | TemplateResult | Node;

/** A function that names the row, for `rowKey`. */
export type TableRowKeyFn = (row: TableRow, index: number) => string | number;

/** A `kind: 'badge'` cell's variant: one for the column, one per value, or computed. */
export type TableBadgeVariant =
    | BadgeVariant
    | Readonly<Record<string, BadgeVariant>>
    | ((value: unknown, row: TableRow) => BadgeVariant);

/** One column of a table. */
export interface TableColumn {
    /** The row property this column reads: the cell's value, and what the column sorts by. */
    key: string;
    /** The header text, or the fallback of the `header-<key>` slot. */
    label: string;
    /** Whether clicking the header sorts by this column; `false` opts out. Ignored when the table has `no-sort`. @default true */
    sortable?: boolean;
    /** How the cell shows its value. @default 'format' when `format` is set, else 'text' */
    kind?: TableCellKind;
    /** A `{token}` template resolved against the row, with `{value}` for this column's value. The text of `format`, `badge` and `link` cells. */
    format?: string;
    /** For `kind: 'badge'`: the variant, a map from value to variant, or a function of the value and the row. @default 'default' */
    badgeVariant?: TableBadgeVariant;
    /** For `kind: 'badge'`: show the badge's leading dot. @default false */
    badgeDot?: boolean;
    /** For `kind: 'link'`: a `{token}` template for the destination. Only `http:`, `https:`, `mailto:`, `tel:` and relative destinations link; any other leaves the text. */
    href?: string;
    /** For `kind: 'actions'`: a button each; activating one fires `hmi-action`. */
    actions?: readonly DialogAction[];
    /** Tier 3: the cell's content, called on every render. Wins over `kind`. Not for JSX: use a cell slot. */
    render?: (row: TableRow) => TableCellContent;
    /** Styles for the header and every cell of the column, as camelCase or dashed names to strings with units: `{ textAlign: 'right', width: '12rem' }`. */
    style?: Readonly<Record<string, string>>;
}

/** Detail of `hmi-sort`. */
export interface TableSortDetail {
    /** The column key the table is now sorted by. */
    key: string;
    /** The direction. */
    dir: TableSortDir;
}

/** Detail of `hmi-action`. */
export interface TableActionDetail {
    /** The `value` of the activated action. */
    value: string;
    /** The row of the cell the action sits in. */
    row: TableRow;
}

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/** The destination, or `undefined` for one that would run script (`javascript:`, `data:`). */
function safeHref(href: string): string | undefined {
    try {
        const { protocol } = new URL(href, 'http://localhost');
        return SAFE_PROTOCOLS.has(protocol) ? href : undefined;
    } catch {
        return undefined;
    }
}

function compare(a: unknown, b: unknown): number {
    if (a === b) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
}

const display = (value: unknown) => (value == null ? '' : String(value));

const sortIcon = html`<svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
>
    <path d="M8 3v10M5 10l3 3 3-3" />
</svg>`;

/**
 * Data table with click-to-sort headers. `columns` and `rows` are properties.
 * A cell shows `row[column.key]` as text, and can show it as a `format`ted
 * template, a `badge`, a `link` or a row of `actions` buttons with the column's
 * `kind`. For anything else there are two ways, in this order of precedence:
 * a slotted element named `cell-<rowKey>-<columnKey>`, and the column's `render`
 * function, which returns a string, a Lit template or a DOM node. A header's
 * label can likewise be replaced by an element slotted as `header-<columnKey>`.
 *
 * `row-key` names the row property that identifies a row (or, as a property, a
 * function of the row), and is the `<rowKey>` of the slot names, so give it a
 * unique field when you slot cells: the slot then stays with its row when the
 * table is sorted. Without it a row is named by its position in `rows`.
 *
 * Sorting is the table's own: a click sorts by the column, ascending first and
 * then flipping, and fires the cancelable `hmi-sort`; cancel it, or set
 * `sort-key` and `sort-dir` back from the listener, to keep the old sort.
 * `sort-key` and `sort-dir` set it from outside. `rows` is never reordered, only shown sorted. `no-sort` turns
 * sorting off for every column.
 *
 * @tag hmi-table
 * @slot header-<columnKey> - Rich header content for that column, replacing its `label`.
 * @slot cell-<rowKey>-<columnKey> - The cell of that row and column, replacing what its column renders.
 * @csspart base - The scrolling frame around the table.
 * @csspart table - The `<table>`.
 * @csspart header - A column header cell.
 * @csspart sort - The sort button in a sortable header.
 * @csspart sort-icon - The arrow in the sort button.
 * @csspart row - A body row.
 * @csspart cell - A body cell.
 * @csspart action - A button of an `actions` cell.
 * @fires hmi-sort - The user sorted a column, and `sortKey` and `sortDir` already hold it. Cancelable: `preventDefault()` puts the old sort back. `detail` is `{ key, dir }`. Not fired when `sort-key` or `sort-dir` is set from code.
 * @fires hmi-action - The user activated an `actions` button. `detail` is `{ value, row }`.
 *
 * @example
 * const table = document.querySelector('hmi-table');
 * table.columns = [
 *   { key: 'name', label: 'Name' },
 *   { key: 'status', label: 'Status', kind: 'badge', badgeVariant: { active: 'success' } },
 * ];
 * table.rows = [{ id: 1, name: 'Ada', status: 'active' }];
 */
@customElement('hmi-table')
export class HmiTable extends LitElement {
    static override styles = [baseStyles, styles];

    /** The columns, left to right. Set it as a property. @default [] */
    @property({ type: Array, attribute: false })
    accessor columns: readonly TableColumn[] = [];

    /** The rows. Set it as a property. @default [] */
    @property({ type: Array, attribute: false })
    accessor rows: readonly TableRow[] = [];

    /** The row property that names a row in the slot names, or, set as a property, a function of the row and its position. Defaults to the row's position in `rows`. */
    @property({ attribute: 'row-key' })
    accessor rowKey: string | TableRowKeyFn | undefined;

    /** Turn sorting off for every column. @default false */
    @property({ type: Boolean, attribute: 'no-sort' }) accessor noSort = false;

    /** The key of the column the rows are sorted by; `null` for the order of `rows`. Updated when the user sorts. @default null */
    @property({ attribute: 'sort-key' }) accessor sortKey: string | null = null;

    /** The direction of the sort. Updated when the user sorts. @default 'asc' */
    @property({ attribute: 'sort-dir' }) accessor sortDir: TableSortDir = 'asc';

    #rowName(row: TableRow, index: number): string {
        const key = this.rowKey;
        if (typeof key === 'function') return String(key(row, index));
        if (key) return String(row[key] ?? index);
        return String(index);
    }

    /** The rows paired with their position in `rows`, sorted when a sort is set. */
    #sortedRows(): { row: TableRow; index: number }[] {
        const entries = this.rows.map((row, index) => ({ row, index }));
        const key = this.sortKey;
        if (key === null) return entries;
        const sign = this.sortDir === 'desc' ? -1 : 1;
        return entries.sort((a, b) => sign * compare(a.row[key], b.row[key]));
    }

    #sortBy(column: TableColumn) {
        const dir: TableSortDir =
            this.sortKey === column.key && this.sortDir !== 'desc'
                ? 'desc'
                : 'asc';
        const previous = { key: this.sortKey, dir: this.sortDir };
        this.sortKey = column.key;
        this.sortDir = dir;
        const proceed = emit<TableSortDetail>(
            this,
            'hmi-sort',
            { key: column.key, dir },
            { cancelable: true },
        );
        // A listener that cancels puts the old sort back, unless it has set
        // one itself.
        if (!proceed && this.sortKey === column.key && this.sortDir === dir) {
            this.sortKey = previous.key;
            this.sortDir = previous.dir;
        }
    }

    #text(column: TableColumn, row: TableRow): string {
        const value = row[column.key];
        return column.format !== undefined && column.kind !== 'text'
            ? applyTemplate(column.format, { ...row, value })
            : display(value);
    }

    #badgeVariant(column: TableColumn, row: TableRow): BadgeVariant {
        const variant = column.badgeVariant;
        const value = row[column.key];
        if (typeof variant === 'function') return variant(value, row);
        if (typeof variant === 'string') return variant;
        return variant?.[display(value)] ?? 'default';
    }

    #cell(column: TableColumn, row: TableRow) {
        if (column.render) return column.render(row);
        const kind =
            column.kind ?? (column.format !== undefined ? 'format' : 'text');
        if (kind === 'badge') {
            return html`<hmi-badge
                variant=${this.#badgeVariant(column, row)}
                ?dot=${column.badgeDot}
                >${this.#text(column, row)}</hmi-badge
            >`;
        }
        if (kind === 'link') {
            const text = this.#text(column, row);
            const href =
                column.href === undefined
                    ? undefined
                    : safeHref(
                          applyTemplate(column.href, {
                              ...row,
                              value: row[column.key],
                          }),
                      );
            return href === undefined
                ? text
                : html`<hmi-link href=${href}>${text}</hmi-link>`;
        }
        if (kind === 'actions') {
            return html`<span class="actions"
                >${renderDialogActions(
                    column.actions ?? [],
                    (value) => emit(this, 'hmi-action', { value, row }),
                    'small',
                )}</span
            >`;
        }
        return this.#text(column, row);
    }

    #header(column: TableColumn) {
        const sortable = !this.noSort && column.sortable !== false;
        const active = this.sortKey === column.key;
        const dir = this.sortDir === 'desc' ? 'desc' : 'asc';
        const label = html`<span class="label"
            ><slot name=${`header-${column.key}`}>${column.label}</slot></span
        >`;
        return html`<th
            part="header"
            class="header"
            scope="col"
            style=${styleMap(column.style ?? {})}
            data-sort=${ifDefined(active ? dir : sortable ? 'idle' : undefined)}
            aria-sort=${ifDefined(
                active
                    ? dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                    : undefined,
            )}
        >
            ${
                sortable
                    ? html`<button
                          type="button"
                          part="sort"
                          class="sort"
                          @click=${() => this.#sortBy(column)}
                      >
                          ${label}
                          <span part="sort-icon" class="sort-icon">${sortIcon}</span>
                      </button>`
                    : label
            }
        </th>`;
    }

    override render() {
        return html`<div part="base" class="base">
            <table part="table" class="table">
                <thead>
                    <tr>
                        ${this.columns.map((column) => this.#header(column))}
                    </tr>
                </thead>
                <tbody>
                    ${this.#sortedRows().map(({ row, index }) => {
                        const name = this.#rowName(row, index);
                        return html`<tr part="row" class="row">
                            ${this.columns.map(
                                (column) => html`<td
                                    part="cell"
                                    class="cell"
                                    style=${styleMap(column.style ?? {})}
                                >
                                    <slot name=${`cell-${name}-${column.key}`}
                                        >${this.#cell(column, row)}</slot
                                    >
                                </td>`,
                            )}
                        </tr>`;
                    })}
                </tbody>
            </table>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hmi-table': HmiTable;
    }
}
