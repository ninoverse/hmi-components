import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiGauge } from './gauge.js';

/**
 * React wrapper for `<hmi-gauge>`.
 *
 * `aria-label` is now `label`. The `label` prop, the text under the dial, is
 * now a child with `slot="caption"`. With no caption the gauge shows its value:
 * pass `hideValue` for the bare dial v5 drew without a `label`.
 *
 * @example
 * <Gauge value={72}>
 *   <span slot="caption">72%</span>
 * </Gauge>
 */
export const Gauge = createComponent({
    tagName: 'hmi-gauge',
    elementClass: HmiGauge,
    react: React,
    displayName: 'Gauge',
});
