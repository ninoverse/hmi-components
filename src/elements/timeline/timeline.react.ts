import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiTimeline } from './timeline.js';

export type { TimelineColor, TimelineItem } from './timeline.js';

/**
 * React wrapper for `<hmi-timeline>`.
 *
 * Rich titles, descriptions, times and icons are children with
 * `slot="title-<index>"`, `slot="description-<index>"`, `slot="time-<index>"`
 * or `slot="icon-<index>"`. `divider` adds a hairline between events.
 *
 * @example
 * <Timeline divider items={[{ title: 'Deployed', time: '2m ago', color: 'success' }]} />
 */
export const Timeline = createComponent({
    tagName: 'hmi-timeline',
    elementClass: HmiTimeline,
    react: React,
    displayName: 'Timeline',
});
