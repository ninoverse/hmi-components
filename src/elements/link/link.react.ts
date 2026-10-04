import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiLink } from './link.js';

export type { LinkTone, LinkUnderline } from './link.js';

/**
 * React wrapper for `<hmi-link>`.
 *
 * @example
 * <Link href="/docs" underline="hover">Read the docs</Link>
 */
export const Link = createComponent({
    tagName: 'hmi-link',
    elementClass: HmiLink,
    react: React,
    displayName: 'Link',
});
