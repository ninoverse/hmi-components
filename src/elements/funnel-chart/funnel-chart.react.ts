import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiFunnelChart } from './funnel-chart.js';

export type { FunnelChartStage } from './funnel-chart.js';

/**
 * React wrapper for `<hmi-funnel-chart>`.
 *
 * `stages` is a property. `aria-label` is now `label`.
 *
 * @example
 * <FunnelChart label="Signup funnel" showValues stages={[{ label: 'Visited', value: 1200 }, { label: 'Signed up', value: 820 }]} />
 */
export const FunnelChart = createComponent({
    tagName: 'hmi-funnel-chart',
    elementClass: HmiFunnelChart,
    react: React,
    displayName: 'FunnelChart',
});
