import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiFormControl } from './form-control.js';

/**
 * React wrapper for `<hmi-form-control>`.
 *
 * @deprecated Set `label`, `hint` and `error` on the form element itself.
 *
 * @example
 * <FormControl label="Email" error="Not an email"><MyControl /></FormControl>
 */
export const FormControl = createComponent({
    tagName: 'hmi-form-control',
    elementClass: HmiFormControl,
    react: React,
    displayName: 'FormControl',
});
