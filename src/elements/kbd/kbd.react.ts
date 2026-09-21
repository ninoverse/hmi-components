import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiKbd } from './kbd.js';

export type { KbdSize } from './kbd.js';

/**
 * React wrapper for `<hmi-kbd>`.
 *
 * @example
 * <Kbd>⌘</Kbd> <Kbd>K</Kbd>
 */
export const Kbd = createComponent({
    tagName: 'hmi-kbd',
    elementClass: HmiKbd,
    react: React,
    displayName: 'Kbd',
});
