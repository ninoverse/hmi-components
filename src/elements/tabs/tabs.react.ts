import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiTabs, type TabsChangeDetail } from './tabs.js';

export type { TabOption, TabsChangeDetail, TabsVariant } from './tabs.js';

/**
 * React wrapper for `<hmi-tabs>`.
 *
 * `options` is a property and `value` the active tab's `value`. The element
 * owns `value`: a click sets it, then `onChange` receives the event, whose
 * `detail` is `{ value }`. Keep your state in step from it, or set `value` once
 * for the initial tab and let the element keep it, as v5's `defaultValue` did.
 * To refuse a tab, call `event.preventDefault()`: setting the prop back changes
 * nothing when your state did not change.
 * Rich labels, icons and badges are children with `slot="label-<value>"`,
 * `slot="icon-<value>"`, `slot="badge-<value>"` and `slot="end-<value>"`. The
 * `count` of a v5 option is now a `badge` string.
 *
 * @example
 * <Tabs options={tabs} value={tab} onChange={(e) => setTab(e.detail.value)} variant="underline" />
 */
export const Tabs = createComponent({
    tagName: 'hmi-tabs',
    elementClass: HmiTabs,
    react: React,
    displayName: 'Tabs',
    events: {
        onChange: 'hmi-change' as EventName<CustomEvent<TabsChangeDetail>>,
    },
});
