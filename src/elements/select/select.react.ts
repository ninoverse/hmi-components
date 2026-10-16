import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    HmiSelect,
    type SelectChangeDetail,
    type SelectOpenChangeDetail,
} from './select.js';

export type {
    SelectAlign,
    SelectChangeDetail,
    SelectOpenChangeDetail,
    SelectOption,
} from './select.js';

/**
 * React wrapper for `<hmi-select>`.
 *
 * The select owns its value, so `defaultValue` and `value` both start it and
 * `onChange` receives the event: read `event.detail.value`, and set `value` back to
 * veto a choice. `options` is a property, and an option's rich label or icon is a
 * child with `slot="label-<value>"` or `slot="icon-<value>"`. `label`, `hint` and
 * `error` replace the `FormControl` around the v5 select, and `name` and `required`
 * make it a form field.
 *
 * @example
 * <Select
 *   name="plan"
 *   options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]}
 *   onChange={(e) => setPlan(e.detail.value)}
 * />
 */
export const Select = createComponent({
    tagName: 'hmi-select',
    elementClass: HmiSelect,
    react: React,
    displayName: 'Select',
    events: {
        onChange: 'hmi-change' as EventName<CustomEvent<SelectChangeDetail>>,
        onOpenChange: 'hmi-open-change' as EventName<
            CustomEvent<SelectOpenChangeDetail>
        >,
    },
});
