import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiCartesianGrid } from './cartesian-grid.js';

/**
 * React wrapper for `<hmi-cartesian-grid>`.
 *
 * It draws its own `<svg>`, to layer over or under other content: it cannot go
 * inside your own `<svg>`, as the v5 component did. `horizontal` and `vertical`
 * are now `hideHorizontal` and `hideVertical`.
 *
 * @example
 * <CartesianGrid width={400} height={200} rows={4} cols={6} padding={16} />
 */
export const CartesianGrid = createComponent({
    tagName: 'hmi-cartesian-grid',
    elementClass: HmiCartesianGrid,
    react: React,
    displayName: 'CartesianGrid',
});
