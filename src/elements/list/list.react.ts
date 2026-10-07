import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiList, type ListReorderDetail } from './list.js';

export type { ListItem, ListReorderDetail } from './list.js';

/**
 * React wrapper for `<hmi-list>`.
 *
 * `items` is a property. `reorderable` turns on drag and keyboard reordering,
 * and `onReorder` receives `event.detail.items`, the new order: set `items`
 * back from it. Rich content is a child with `slot="title-<id>"`,
 * `slot="subtitle-<id>"`, `slot="right-<id>"` or, for the whole row,
 * `slot="item-<id>"`.
 *
 * @example
 * <List reorderable items={items} onReorder={(e) => setItems(e.detail.items)} />
 */
export const List = createComponent({
    tagName: 'hmi-list',
    elementClass: HmiList,
    react: React,
    displayName: 'List',
    events: {
        onReorder: 'hmi-reorder' as EventName<CustomEvent<ListReorderDetail>>,
    },
});
