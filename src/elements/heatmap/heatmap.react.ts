import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiHeatmap } from './heatmap.js';

/**
 * React wrapper for `<hmi-heatmap>`.
 *
 * `data`, `xLabels` and `yLabels` are properties. `aria-label` is now `label`.
 *
 * @example
 * <Heatmap label="Weekly activity" showValues xLabels={['Mon', 'Tue']} yLabels={['Morning', 'Evening']} data={[[4, 8], [14, 18]]} />
 */
export const Heatmap = createComponent({
    tagName: 'hmi-heatmap',
    elementClass: HmiHeatmap,
    react: React,
    displayName: 'Heatmap',
});
