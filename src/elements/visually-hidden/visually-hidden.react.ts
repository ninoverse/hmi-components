import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiVisuallyHidden } from './visually-hidden.js';

/**
 * React wrapper for `<hmi-visually-hidden>`.
 *
 * @example
 * <VisuallyHidden>Search</VisuallyHidden>
 */
export const VisuallyHidden = createComponent({
    tagName: 'hmi-visually-hidden',
    elementClass: HmiVisuallyHidden,
    react: React,
    displayName: 'VisuallyHidden',
});
