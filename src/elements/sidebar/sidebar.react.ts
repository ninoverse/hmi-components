import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiSidebar, type SidebarNavDetail } from './sidebar.js';

export type {
    SidebarGroup,
    SidebarItem,
    SidebarNavDetail,
} from './sidebar.js';

/**
 * React wrapper for `<hmi-sidebar>`.
 *
 * `groups` is a property and `current` the active link's `value`. It is
 * controlled, as the v5 sidebar was: `onNav` receives the event, whose `detail`
 * is `{ value, href }`; set `current` from it, and call `event.preventDefault()`
 * to handle the navigation yourself with a router. Icons, rich labels, group
 * headings, badges and whole links are children with `slot="icon-<value>"`,
 * `slot="label-<value>"`, `slot="group-<index>"`, `slot="badge-<value>"`,
 * `slot="end-<value>"` and `slot="item-<value>"`. In the Next.js App Router,
 * import it from a `'use client'` file.
 *
 * @example
 * <Sidebar groups={groups} current={page} onNav={(e) => setPage(e.detail.value)} />
 */
export const Sidebar = createComponent({
    tagName: 'hmi-sidebar',
    elementClass: HmiSidebar,
    react: React,
    displayName: 'Sidebar',
    events: {
        onNav: 'hmi-nav' as EventName<CustomEvent<SidebarNavDetail>>,
    },
});
