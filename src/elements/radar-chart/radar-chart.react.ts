import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiRadarChart } from './radar-chart.js';

export type { RadarChartSeries } from './radar-chart.js';

/**
 * React wrapper for `<hmi-radar-chart>`.
 *
 * `axes` and `series` are properties. `aria-label` is now `label`.
 *
 * @example
 * <RadarChart label="Skill assessment" axes={['Speed', 'Power', 'Range']} series={[{ name: 'Alpha', data: [80, 65, 70] }]} />
 */
export const RadarChart = createComponent({
    tagName: 'hmi-radar-chart',
    elementClass: HmiRadarChart,
    react: React,
    displayName: 'RadarChart',
});
