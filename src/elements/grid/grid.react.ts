import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiGrid } from './grid.js';

export type { GridGap } from './grid.js';

/**
 * React wrapper for `<hmi-grid>`.
 *
 * @example
 * <Grid columns={3} gap="medium">…</Grid>
 */
export const Grid = createComponent({
    tagName: 'hmi-grid',
    elementClass: HmiGrid,
    react: React,
    displayName: 'Grid',
});
