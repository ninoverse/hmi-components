import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiSpacer } from './spacer.js';

export type { SpacerAxis, SpacerSize } from './spacer.js';

/**
 * React wrapper for `<hmi-spacer>`.
 *
 * @example
 * <Spacer size="large" />
 */
export const Spacer = createComponent({
    tagName: 'hmi-spacer',
    elementClass: HmiSpacer,
    react: React,
    displayName: 'Spacer',
});
