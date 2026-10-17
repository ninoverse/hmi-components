import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    type DatePickerChangeDetail,
    type DatePickerOpenChangeDetail,
    HmiDatePicker,
} from './date-picker.js';

export type {
    DateInput,
    DatePickerChangeDetail,
    DatePickerMode,
    DatePickerOpenChangeDetail,
    DatePickerRange,
    DatePickerRangeInput,
    DatePickerValue,
    DatePickerValueInput,
} from './date-picker.js';

/**
 * React wrapper for `<hmi-date-picker>`.
 *
 * The picker owns its value, so `defaultValue` and `value` both start it and
 * `onChange` receives the event: read `event.detail.value`, and set `value` back to
 * veto a choice. The value is the plain `YYYY-MM-DD` text of the chosen day, or in
 * `mode="range"` a `{ start, end }` object, where v5 reported an ISO date-time; a
 * `Date` or a v5 ISO date-time is still accepted as `value`, `defaultValue`, `min`
 * and `max`, each read as its local day. `label`, `hint` and `error` replace the
 * `FormControl` around the v5 picker, and `name` and `required` make it a form field.
 *
 * @example
 * <DatePicker
 *   name="start"
 *   label="Start date"
 *   onChange={(e) => setStart(e.detail.value)}
 * />
 */
export const DatePicker = createComponent({
    tagName: 'hmi-date-picker',
    elementClass: HmiDatePicker,
    react: React,
    displayName: 'DatePicker',
    events: {
        onChange: 'hmi-change' as EventName<
            CustomEvent<DatePickerChangeDetail>
        >,
        onOpenChange: 'hmi-open-change' as EventName<
            CustomEvent<DatePickerOpenChangeDetail>
        >,
    },
});
