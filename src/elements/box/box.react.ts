import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiBox } from './box.js';

export type { BoxBackground, BoxPadding, BoxRadius } from './box.js';

/**
 * React wrapper for `<hmi-box>`.
 *
 * @example
 * <Box background="surface-container" padding="medium" radius="leaf" bordered>…</Box>
 */
export const Box = createComponent({
    tagName: 'hmi-box',
    elementClass: HmiBox,
    react: React,
    displayName: 'Box',
});
