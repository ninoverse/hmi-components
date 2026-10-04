import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiHeading } from './heading.js';

export type { HeadingLevel, HeadingSize, HeadingTone } from './heading.js';

/**
 * React wrapper for `<hmi-heading>`.
 *
 * @example
 * <Heading level={3} tone="muted">Quieter title</Heading>
 */
export const Heading = createComponent({
    tagName: 'hmi-heading',
    elementClass: HmiHeading,
    react: React,
    displayName: 'Heading',
});
