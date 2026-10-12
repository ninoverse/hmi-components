import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiLineChart } from './line-chart.js';

export type { LineChartSeries } from './line-chart.js';

/**
 * React wrapper for `<hmi-line-chart>`.
 *
 * `series` and `labels` are properties. `aria-label` is now `label`, and
 * `showDots` is `show-dots` as an attribute. The size is `width` and `height`
 * in px: to fit a container, pass the size from `ResponsiveContainer`'s
 * `onResize`.
 *
 * @example
 * <LineChart label="Monthly revenue" labels={['Jan', 'Feb']} series={[{ name: 'Revenue', data: [32, 40] }]} showDots />
 */
export const LineChart = createComponent({
    tagName: 'hmi-line-chart',
    elementClass: HmiLineChart,
    react: React,
    displayName: 'LineChart',
});
