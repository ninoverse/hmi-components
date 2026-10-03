import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiAlert } from './alert.js';

export type { AlertVariant } from './alert.js';

/**
 * React wrapper for `<hmi-alert>`.
 *
 * @example
 * <Alert variant="warning"><span slot="title">Heads up</span>Disk almost full.</Alert>
 */
export const Alert = createComponent({
    tagName: 'hmi-alert',
    elementClass: HmiAlert,
    react: React,
    displayName: 'Alert',
});
