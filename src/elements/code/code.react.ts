import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiCode } from './code.js';

/**
 * React wrapper for `<hmi-code>`.
 *
 * @example
 * <Code>pnpm add @ninoverse/hmi-components</Code>
 * <Code block>{`const x = 42;`}</Code>
 */
export const Code = createComponent({
    tagName: 'hmi-code',
    elementClass: HmiCode,
    react: React,
    displayName: 'Code',
});
