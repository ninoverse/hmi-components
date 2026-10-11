import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiScatterPlot } from './scatter-plot.js';

export type { ScatterPlotPoint, ScatterPlotSeries } from './scatter-plot.js';

/**
 * React wrapper for `<hmi-scatter-plot>`.
 *
 * `series` is a property. `aria-label` is now `label`. The size is `width` and
 * `height` in px: to fit a container, pass the size from `ResponsiveContainer`'s
 * `onResize`.
 *
 * @example
 * <ScatterPlot label="Height versus weight" series={[{ name: 'Group A', data: [{ x: 12, y: 22 }] }]} />
 */
export const ScatterPlot = createComponent({
    tagName: 'hmi-scatter-plot',
    elementClass: HmiScatterPlot,
    react: React,
    displayName: 'ScatterPlot',
});
