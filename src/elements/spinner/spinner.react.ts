import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiSpinner } from './spinner.js';

export type { SpinnerSize } from './spinner.js';

/**
 * React wrapper for `<hmi-spinner>`.
 *
 * @example
 * <Spinner size="large" label="Fetching" />
 */
export const Spinner = createComponent({
    tagName: 'hmi-spinner',
    elementClass: HmiSpinner,
    react: React,
    displayName: 'Spinner',
});
