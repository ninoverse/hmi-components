import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiAreaChart } from './area-chart.js';

export type { AreaChartSeries } from './area-chart.js';

/**
 * React wrapper for `<hmi-area-chart>`.
 *
 * `series` and `labels` are properties. `aria-label` is now `label`. The size is
 * `width` and `height` in px: to fit a container, pass the size from
 * `ResponsiveContainer`'s `onResize`.
 *
 * @example
 * <AreaChart label="Monthly active users" labels={['Jan', 'Feb']} series={[{ name: 'Pro', data: [20, 28] }]} />
 */
export const AreaChart = createComponent({
    tagName: 'hmi-area-chart',
    elementClass: HmiAreaChart,
    react: React,
    displayName: 'AreaChart',
});
