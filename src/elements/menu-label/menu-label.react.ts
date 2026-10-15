import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiMenuLabel } from './menu-label.js';

/**
 * React wrapper for `<hmi-menu-label>`.
 *
 * @example
 * <MenuLabel>Workspace</MenuLabel>
 */
export const MenuLabel = createComponent({
    tagName: 'hmi-menu-label',
    elementClass: HmiMenuLabel,
    react: React,
    displayName: 'MenuLabel',
});
