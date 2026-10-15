import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiMenu } from './menu.js';

/**
 * React wrapper for `<hmi-menu>`.
 *
 * Its children are `MenuItem`, `MenuLabel` and `MenuSeparator`, from their own
 * `react/menu-item`, `react/menu-label` and `react/menu-separator` subpaths. The
 * menu paints no surface: put it in a `Popover` or a `ContextMenu`. `label` names
 * the menu; arrow keys move between its items.
 *
 * @example
 * <Menu label="Actions"><MenuItem>Edit</MenuItem><MenuSeparator /><MenuItem danger>Delete</MenuItem></Menu>
 */
export const Menu = createComponent({
    tagName: 'hmi-menu',
    elementClass: HmiMenu,
    react: React,
    displayName: 'Menu',
});
