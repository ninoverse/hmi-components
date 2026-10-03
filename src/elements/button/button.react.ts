import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiButton } from './button.js';

export type { ButtonSize, ButtonType, ButtonVariant } from './button.js';

/* No `events` map: click is a native, composed event. */

/**
 * React wrapper for `<hmi-button>`.
 *
 * @example
 * <Button variant="primary" size="large">Launch</Button>
 */
export const Button = createComponent({
    tagName: 'hmi-button',
    elementClass: HmiButton,
    react: React,
    displayName: 'Button',
});
