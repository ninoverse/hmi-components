import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiSparkline } from './sparkline.js';

/**
 * React wrapper for `<hmi-sparkline>`.
 *
 * `data` is a property. `showDot` and `strokeWidth` are the same props, and
 * `aria-label` is now `label`. With no `data`, nothing is rendered.
 *
 * @example
 * <Sparkline data={[4, 8, 5, 10, 7, 12, 9, 14]} label="Upward trend" area showDot />
 */
export const Sparkline = createComponent({
    tagName: 'hmi-sparkline',
    elementClass: HmiSparkline,
    react: React,
    displayName: 'Sparkline',
});
