import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    type DrawerActionDetail,
    type DrawerCloseDetail,
    HmiDrawer,
} from './drawer.js';

export type {
    DrawerActionDetail,
    DrawerCloseDetail,
    DrawerCloseReason,
    DrawerSide,
} from './drawer.js';

/**
 * React wrapper for `<hmi-drawer>`.
 *
 * It is controlled, as the v5 component was: `onClose` receives the event, so
 * set `open` to `false` from it. `title` is now `heading` (plain text) or a child
 * with `slot="title"`, `description` is `description` or a child with
 * `slot="description"`, and `actions` is an array of `DialogAction`s or children
 * with `slot="actions"`. `className` and `style` reach the host: style the panel
 * with `::part(panel)`.
 *
 * @example
 * <Drawer open={open} side="right" heading="Filters" onClose={() => setOpen(false)}>…</Drawer>
 */
export const Drawer = createComponent({
    tagName: 'hmi-drawer',
    elementClass: HmiDrawer,
    react: React,
    displayName: 'Drawer',
    events: {
        onClose: 'hmi-close' as EventName<CustomEvent<DrawerCloseDetail>>,
        onAction: 'hmi-action' as EventName<CustomEvent<DrawerActionDetail>>,
    },
});
