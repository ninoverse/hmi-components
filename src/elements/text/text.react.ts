import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiText } from './text.js';

export type { TextAlign, TextSize, TextTone, TextWeight } from './text.js';

/**
 * React wrapper for `<hmi-text>`.
 *
 * @example
 * <Text size="small" tone="muted">Secondary copy</Text>
 */
export const Text = createComponent({
    tagName: 'hmi-text',
    elementClass: HmiText,
    react: React,
    displayName: 'Text',
});
