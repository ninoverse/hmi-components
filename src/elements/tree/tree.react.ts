import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    HmiTree,
    type TreeExpandedChangeDetail,
    type TreeSelectDetail,
} from './tree.js';

export type {
    TreeExpandedChangeDetail,
    TreeNode,
    TreeSelectDetail,
} from './tree.js';

/**
 * React wrapper for `<hmi-tree>`.
 *
 * `nodes` and `expanded` are properties, and `selected` is the selected node's
 * `value`. The element owns the expansion and the selection: `onSelect` and
 * `onExpandedChange` receive the event, whose `detail` is `{ value }` or
 * `{ expanded }`, after the element has updated them, and a handler can veto by
 * setting the property back. There is no `defaultExpanded` or `defaultSelected`:
 * set `expanded` and `selected` for the initial state. Rich labels, icons and
 * badges are children with `slot="label-<value>"`, `slot="icon-<value>"`,
 * `slot="badge-<value>"` and `slot="end-<value>"`.
 *
 * @example
 * <Tree nodes={nodes} expanded={['root']} onSelect={(e) => setSelected(e.detail.value)} />
 */
export const Tree = createComponent({
    tagName: 'hmi-tree',
    elementClass: HmiTree,
    react: React,
    displayName: 'Tree',
    events: {
        onSelect: 'hmi-select' as EventName<CustomEvent<TreeSelectDetail>>,
        onExpandedChange: 'hmi-expanded-change' as EventName<
            CustomEvent<TreeExpandedChangeDetail>
        >,
    },
});
