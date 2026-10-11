import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiBarChart } from './bar-chart.js';

export type { BarChartSeries } from './bar-chart.js';

/**
 * React wrapper for `<hmi-bar-chart>`.
 *
 * `series` and `labels` are properties. `aria-label` is now `label`. The size is
 * `width` and `height` in px: to fit a container, pass the size from
 * `ResponsiveContainer`'s `onResize`.
 *
 * @example
 * <BarChart label="Quarterly units" labels={['Q1', 'Q2']} series={[{ name: 'Product A', data: [42, 55] }]} />
 */
export const BarChart = createComponent({
    tagName: 'hmi-bar-chart',
    elementClass: HmiBarChart,
    react: React,
    displayName: 'BarChart',
});
