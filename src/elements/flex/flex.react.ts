import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiFlex } from './flex.js';

export type {
    FlexAlign,
    FlexDirection,
    FlexGap,
    FlexJustify,
} from './flex.js';

/**
 * React wrapper for `<hmi-flex>`.
 *
 * @example
 * <Flex direction="column" gap="medium" align="start">…</Flex>
 */
export const Flex = createComponent({
    tagName: 'hmi-flex',
    elementClass: HmiFlex,
    react: React,
    displayName: 'Flex',
});
