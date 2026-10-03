import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiBlockquote } from './blockquote.js';

/**
 * React wrapper for `<hmi-blockquote>`.
 *
 * @example
 * <Blockquote>That brain of mine is something more than mortal.<span slot="cite">Ada Lovelace</span></Blockquote>
 */
export const Blockquote = createComponent({
    tagName: 'hmi-blockquote',
    elementClass: HmiBlockquote,
    react: React,
    displayName: 'Blockquote',
});
