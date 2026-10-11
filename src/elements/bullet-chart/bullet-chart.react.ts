import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiBulletChart } from './bullet-chart.js';

/**
 * React wrapper for `<hmi-bullet-chart>`.
 *
 * `ranges` is a property. The v5 `label`, the visible text left of the track,
 * is now `caption`; `aria-label` is now `label`, the accessible name, which
 * falls back to `caption`.
 *
 * @example
 * <BulletChart caption="Revenue" value={78} target={85} max={100} ranges={[50, 75]} />
 */
export const BulletChart = createComponent({
    tagName: 'hmi-bullet-chart',
    elementClass: HmiBulletChart,
    react: React,
    displayName: 'BulletChart',
});
