import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiTabs, type TabsChangeDetail } from './tabs.js';

export type { TabOption, TabsChangeDetail, TabsVariant } from './tabs.js';

/**
 * React wrapper for `<hmi-tabs>`.
 *
 * `options` is a property and `value` the active tab's `value`. It is
 * controlled: `onChange` receives the event, whose `detail` is `{ value }`; set
 * `value` from it. There is no `defaultValue`: set `value` for the initial tab.
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
