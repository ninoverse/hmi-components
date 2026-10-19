import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiPagination, type PaginationChangeDetail } from './pagination.js';

export type { PaginationChangeDetail } from './pagination.js';

/**
 * React wrapper for `<hmi-pagination>`.
 *
 * The element owns `page`: a click sets it, then `onChange` receives the event,
 * whose `detail.value` is the new page. Keep your state in step from it, as
 * with v5, or leave `page` out to let the element keep it. To refuse a page,
 * call `event.preventDefault()`: setting the prop back changes nothing when
 * your state did not change. `label`, `prevLabel`, `nextLabel` and `pageLabel`
 * name the landmark and the buttons.
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
