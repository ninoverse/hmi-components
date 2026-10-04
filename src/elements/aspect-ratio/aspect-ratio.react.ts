import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiAspectRatio } from './aspect-ratio.js';

/**
 * React wrapper for `<hmi-aspect-ratio>`.
 *
 * @example
 * <AspectRatio ratio={16 / 9}><img src="…" alt="…" /></AspectRatio>
 */
export const AspectRatio = createComponent({
    tagName: 'hmi-aspect-ratio',
    elementClass: HmiAspectRatio,
    react: React,
    displayName: 'AspectRatio',
});
