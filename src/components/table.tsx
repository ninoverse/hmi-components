import {
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
    useMemo,
    useState,
} from 'react';
import { applyTemplate } from '../lib/formatTemplate.utility';
import './styled/table.styled.css';

export type TableColumn<T extends Record<string, unknown>> = {
    key: keyof T & string;
    label: ReactNode;
    sortable?: boolean;
    render?: (row: T) => ReactNode;
    /* Declarative cell formatter for web-component consumers (where `render`
       cannot survive JSON serialization). A `{token}` template resolved against
       the row, with `{value}` aliased to this column's cell value. */
    format?: string;
    style?: CSSProperties;
};

export type TableProps<T extends Record<string, unknown>> = Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
> & {
    columns: ReadonlyArray<TableColumn<T>>;
    rows: ReadonlyArray<T>;
    sortable?: boolean;
    getRowKey?: (row: T, index: number) => string | number;
};

type SortState = { key: string | null; dir: 'asc' | 'desc' };

const SortIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Sort</title>
        <path d="M8 3v10M5 10l3 3 3-3" />
    </svg>
);

function compare(a: unknown, b: unknown): number {
    if (a === b) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
}

export function Table<T extends Record<string, unknown>>({
    columns,
    rows,
    sortable = true,
    getRowKey,
    className,
    ...rest
}: TableProps<T>) {
    const [sort, setSort] = useState<SortState>({ key: null, dir: 'asc' });

    const sorted = useMemo(() => {
        if (!sort.key) return rows;
        const key = sort.key;
        const copy = [...rows];
        copy.sort((a, b) => {
            const cmp = compare(a[key], b[key]);
            return sort.dir === 'asc' ? cmp : -cmp;
        });
        return copy;
    }, [rows, sort]);

    const tokens: string[] = ['table-wrap'];
    if (className) tokens.push(className);

    const onHeaderClick = (column: TableColumn<T>) => {
        if (!sortable || column.sortable === false) return;
        setSort((prev) =>
            prev.key === column.key
                ? { key: column.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
                : { key: column.key, dir: 'asc' },
        );
    };

    return (
        <div className={tokens.join(' ')} {...rest}>
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((column) => {
                            const isSortable =
                                sortable && column.sortable !== false;
                            const isActive = sort.key === column.key;
                            const dataSort = isActive
                                ? sort.dir
                                : isSortable
                                  ? 'idle'
                                  : undefined;
                            return (
                                <th
                                    key={column.key}
                                    style={column.style}
                                    data-sortable={isSortable}
                                    {...(dataSort
                                        ? { 'data-sort': dataSort }
                                        : {})}
                                    {...(isActive
                                        ? {
                                              'aria-sort':
                                                  sort.dir === 'asc'
                                                      ? 'ascending'
                                                      : 'descending',
                                          }
                                        : {})}
                                >
                                    {isSortable ? (
                                        <button
                                            type="button"
                                            className="table__sort"
                                            onClick={() =>
                                                onHeaderClick(column)
                                            }
                                        >
                                            <span className="table__label">
                                                {column.label}
                                            </span>
                                            <span className="table__sort-icon">
                                                <SortIcon />
                                            </span>
                                        </button>
                                    ) : (
                                        <span className="table__label">
                                            {column.label}
                                        </span>
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((row, i) => (
                        <tr key={getRowKey ? getRowKey(row, i) : i}>
                            {columns.map((column) => (
                                <td key={column.key} style={column.style}>
                                    {column.render
                                        ? column.render(row)
                                        : column.format
                                          ? applyTemplate(column.format, {
                                                ...row,
                                                value: row[column.key],
                                            })
                                          : (row[column.key] as ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
