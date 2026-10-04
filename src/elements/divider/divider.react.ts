import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiDivider } from './divider.js';

export type { DividerAlign, DividerOrientation } from './divider.js';

/**
 * React wrapper for `<hmi-divider>`.
 *
 * @example
 * <Divider align="start">OR</Divider>
 */
export const Divider = createComponent({
    tagName: 'hmi-divider',
    elementClass: HmiDivider,
    react: React,
    displayName: 'Divider',
});
