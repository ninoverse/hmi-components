import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiChartTooltip } from './chart-tooltip.js';

export type { ChartTooltipItem } from './chart-tooltip.js';

/**
 * React wrapper for `<hmi-chart-tooltip>`.
 *
 * `title` is now `heading` (a `title` property would collide with the native
 * `title` attribute), and `items` is a property of strings. For richer content,
 * pass a child with `slot="heading"`, `slot="label-<index>"` or
 * `slot="value-<index>"`. It only renders the card: position it yourself.
 *
 * @example
 * <ChartTooltip heading="Jan 2026" items={[{ label: 'Revenue', value: '$48.2k', color: 'var(--primary)' }]} />
 */
export const ChartTooltip = createComponent({
    tagName: 'hmi-chart-tooltip',
    elementClass: HmiChartTooltip,
    react: React,
    displayName: 'ChartTooltip',
});
