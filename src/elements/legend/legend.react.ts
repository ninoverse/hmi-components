import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiLegend } from './legend.js';

export type { LegendAlign, LegendItem } from './legend.js';

/**
 * React wrapper for `<hmi-legend>`.
 *
 * `items` is a property, and each `label` is a string. For richer content,
 * pass a child with `slot="label-<index>"`.
 *
 * @example
 * <Legend align="start" items={[{ label: 'Revenue', color: 'var(--primary)' }]} />
 */
export const Legend = createComponent({
    tagName: 'hmi-legend',
    elementClass: HmiLegend,
    react: React,
    displayName: 'Legend',
});
