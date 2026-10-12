import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiDonutChart } from './donut-chart.js';

export type { DonutChartSegment } from './donut-chart.js';

/**
 * React wrapper for `<hmi-donut-chart>`.
 *
 * `segments` is a property. `aria-label` is now `label`. The `centerLabel` prop
 * is now a child with `slot="center-label"`.
 *
 * @example
 * <DonutChart label="Traffic by source" segments={[{ label: 'Direct', value: 45 }, { label: 'Search', value: 30 }]}>
 *   <span slot="center-label">1.2k visits</span>
 * </DonutChart>
 */
export const DonutChart = createComponent({
    tagName: 'hmi-donut-chart',
    elementClass: HmiDonutChart,
    react: React,
    displayName: 'DonutChart',
});
