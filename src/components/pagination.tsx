import { type HTMLAttributes, useMemo } from 'react';
import './styled/pagination.styled.css';

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
    /** Current 1-based page. */
    page: number;
    /** Total number of pages. */
    total: number;
    /** Fires with the requested 1-based page number. */
    onChange: (page: number) => void;
};

/**
 * Page navigation with prev/next buttons and truncated page numbers (ellipses
 * for large ranges). Controlled via `page`/`onChange`.
 *
 * @example
 * <Pagination page={page} total={20} onChange={setPage} />
 */

type PageEntry = number | 'ellipsis-start' | 'ellipsis-end';

const ELLIPSIS = '…';

function buildPages(page: number, total: number): PageEntry[] {
    if (total <= 0) return [];
    if (total <= 7) {
        const out: PageEntry[] = [];
        for (let i = 1; i <= total; i++) out.push(i);
        return out;
    }
    const out: PageEntry[] = [1];
    if (page > 3) out.push('ellipsis-start');
    const start = Math.max(2, page - 1);
    const end = Math.min(total - 1, page + 1);
    for (let i = start; i <= end; i++) out.push(i);
    if (page < total - 2) out.push('ellipsis-end');
    out.push(total);
    return out;
}

const ChevLeftIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Previous page</title>
        <path d="M10 4l-4 4 4 4" />
    </svg>
);

const ChevRightIcon = () => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <title>Next page</title>
        <path d="M6 4l4 4-4 4" />
    </svg>
);

export function Pagination({
    page,
    total,
    onChange,
    className,
    'aria-label': ariaLabel = 'Pagination',
    ...rest
}: PaginationProps) {
    const entries = useMemo(() => buildPages(page, total), [page, total]);

    const tokens: string[] = ['pager'];
    if (className) tokens.push(className);

    const canPrev = page > 1;
    const canNext = page < total;

    return (
        <nav className={tokens.join(' ')} aria-label={ariaLabel} {...rest}>
            <button
                type="button"
                className="pager__btn"
                aria-label="Previous page"
                disabled={!canPrev}
                onClick={() => canPrev && onChange(page - 1)}
            >
                <ChevLeftIcon />
            </button>
            {entries.map((entry, i) => {
                if (entry === 'ellipsis-start' || entry === 'ellipsis-end') {
                    return (
                        <span
                            // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis position is stable across renders
                            key={`${entry}-${i}`}
                            className="pager__ellipsis"
                            aria-hidden="true"
                        >
                            {ELLIPSIS}
                        </span>
                    );
                }
                const isActive = entry === page;
                return (
                    <button
                        key={entry}
                        type="button"
                        className="pager__btn"
                        data-active={isActive}
                        aria-label={`Page ${entry}`}
                        {...(isActive ? { 'aria-current': 'page' } : {})}
                        onClick={() => onChange(entry)}
                    >
                        {entry}
                    </button>
                );
            })}
            <button
                type="button"
                className="pager__btn"
                aria-label="Next page"
                disabled={!canNext}
                onClick={() => canNext && onChange(page + 1)}
            >
                <ChevRightIcon />
            </button>
        </nav>
    );
}
