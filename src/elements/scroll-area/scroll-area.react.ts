import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiScrollArea } from './scroll-area.js';

export type { ScrollAreaOrientation } from './scroll-area.js';

/**
 * React wrapper for `<hmi-scroll-area>`.
 *
 * @example
 * <ScrollArea maxHeight={160}>…</ScrollArea>
 */
export const ScrollArea = createComponent({
    tagName: 'hmi-scroll-area',
    elementClass: HmiScrollArea,
    react: React,
    displayName: 'ScrollArea',
});
