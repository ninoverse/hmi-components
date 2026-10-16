import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiMenuSeparator } from './menu-separator.js';

/**
 * React wrapper for `<hmi-menu-separator>`.
 *
 * @example
 * <MenuSeparator />
 */
export const MenuSeparator = createComponent({
    tagName: 'hmi-menu-separator',
    elementClass: HmiMenuSeparator,
    react: React,
    displayName: 'MenuSeparator',
});
