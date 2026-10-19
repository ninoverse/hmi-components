import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiList, type ListReorderDetail } from './list.js';

export type { ListItem, ListReorderDetail } from './list.js';

/**
 * React wrapper for `<hmi-list>`.
 *
 * `items` is a property. `reorderable` turns on drag and keyboard reordering:
 * the element reorders `items` itself, then `onReorder` receives the event,
 * whose `detail.items` is the new order; keep your state in step from it. To
 * refuse a move, call `event.preventDefault()`: setting the prop back changes
 * nothing when your state did not change. Rich content is a child with `slot="title-<id>"`,
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
