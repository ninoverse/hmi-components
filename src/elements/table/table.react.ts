import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    HmiTable,
    type TableActionDetail,
    type TableSortDetail,
} from './table.js';

export type {
    TableActionDetail,
    TableBadgeVariant,
    TableCellContent,
    TableCellKind,
    TableColumn,
    TableRow,
    TableRowKeyFn,
    TableSortDetail,
    TableSortDir,
} from './table.js';

/**
 * React wrapper for `<hmi-table>`.
 *
 * `rowKey` is v5's `getRowKey`: a field name, or a function of the row and its
 * position. `noSort` is v5's `sortable={false}`. A column's `render` returns a
 * string, a Lit template or a DOM node, never JSX: for a React element in a
 * cell, pass it as a child with `slot="cell-<rowKey>-<columnKey>"`, and for the
 * header `slot="header-<columnKey>"`. `onSort` and `onAction` receive the event,
 * so read `event.detail`.
 *
 * @example
 * <Table
 *   columns={[{ key: 'name', label: 'Name' }]}
 *   rows={rows}
 *   rowKey="id"
 *   onSort={(e) => console.log(e.detail.key, e.detail.dir)}
 * />
 */
export const Table = createComponent({
    tagName: 'hmi-table',
    elementClass: HmiTable,
    react: React,
    displayName: 'Table',
    events: {
        onSort: 'hmi-sort' as EventName<CustomEvent<TableSortDetail>>,
        onAction: 'hmi-action' as EventName<CustomEvent<TableActionDetail>>,
    },
});
