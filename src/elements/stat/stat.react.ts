import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiStat } from './stat.js';

export type { StatTrend } from './stat.js';

/**
 * React wrapper for `<hmi-stat>`.
 *
 * @example
 * <Stat trend="up"><span slot="label">Revenue</span><span slot="value">$12.4k</span><span slot="delta">8%</span></Stat>
 */
export const Stat = createComponent({
    tagName: 'hmi-stat',
    elementClass: HmiStat,
    react: React,
    displayName: 'Stat',
});
