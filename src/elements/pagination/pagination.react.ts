import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiPagination, type PaginationChangeDetail } from './pagination.js';

export type { PaginationChangeDetail } from './pagination.js';

/**
 * React wrapper for `<hmi-pagination>`.
 *
 * It is controlled, as the v5 component was: `onChange` receives the event, so
 * read `event.detail.value` and set `page` from it. `label`, `prevLabel`,
 * `nextLabel` and `pageLabel` name the landmark and the buttons.
 *
 * @example
 * <Pagination page={page} total={20} onChange={(e) => setPage(e.detail.value)} />
 */
export const Pagination = createComponent({
    tagName: 'hmi-pagination',
    elementClass: HmiPagination,
    react: React,
    displayName: 'Pagination',
    events: {
        onChange: 'hmi-change' as EventName<
            CustomEvent<PaginationChangeDetail>
        >,
    },
});
