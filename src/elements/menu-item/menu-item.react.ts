import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiMenuItem } from './menu-item.js';

/* No `events` map: click is a native, composed event. */

/**
 * React wrapper for `<hmi-menu-item>`.
 *
 * `icon` is now a child with `slot="icon"`, and `shortcut` is a string (or a
 * child with `slot="shortcut"`). `checked` is new: it marks the chosen item of a
 * group for assistive technology, and paints nothing. `onClick` and `disabled` work as on a button;
 * `type`, `name`, `value`, `form` and `aria-*` are not forwarded to the inner
 * `<button>`.
 *
 * @example
 * <MenuItem shortcut="⌘S" onClick={save}>Save</MenuItem>
 */
export const MenuItem = createComponent({
    tagName: 'hmi-menu-item',
    elementClass: HmiMenuItem,
    react: React,
    displayName: 'MenuItem',
});
