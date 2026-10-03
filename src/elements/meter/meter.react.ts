import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiMeter } from './meter.js';

export type { MeterLevel } from './meter.js';

/**
 * React wrapper for `<hmi-meter>`.
 *
 * @example
 * <Meter value={0.8} low={0.3} high={0.7} optimum={0.2} showValue><span slot="label">Disk</span></Meter>
 */
export const Meter = createComponent({
    tagName: 'hmi-meter',
    elementClass: HmiMeter,
    react: React,
    displayName: 'Meter',
});
