import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    type ComboboxChangeDetail,
    type ComboboxInputDetail,
    type ComboboxOpenChangeDetail,
    HmiCombobox,
} from './combobox.js';

export type {
    ComboboxChangeDetail,
    ComboboxFilter,
    ComboboxFilterFn,
    ComboboxInputDetail,
    ComboboxOpenChangeDetail,
    ComboboxOption,
} from './combobox.js';

/**
 * React wrapper for `<hmi-combobox>`.
 *
 * The combobox owns its value, so `defaultValue` and `value` both start it, and
 * `onChange` receives the event: read `event.detail.value` (`''` for none, where v5
 * passed `null`), and set `value` back to veto a change. `onInput` receives the text
 * in the field on every keystroke, for searching a server: set `options` in response
 * and pass `filter="none"`. `filterOption` is `filter`: `includes`, `startsWith`,
 * `none` or a function of the option and the text. `label` names the field (v5's
 * `aria-label`), `emptyMessage` is `empty-message`, and an option's rich label or
 * description is a child with `slot="label-<value>"` or `slot="description-<value>"`.
 *
 * @example
 * <Combobox
 *   name="city"
 *   label="City"
 *   options={[{ value: 'paris', label: 'Paris', description: 'France' }]}
 *   onChange={(e) => setCity(e.detail.value)}
 * />
 */
export const Combobox = createComponent({
    tagName: 'hmi-combobox',
    elementClass: HmiCombobox,
    react: React,
    displayName: 'Combobox',
    events: {
        onChange: 'hmi-change' as EventName<CustomEvent<ComboboxChangeDetail>>,
        onInput: 'hmi-input' as EventName<CustomEvent<ComboboxInputDetail>>,
        onOpenChange: 'hmi-open-change' as EventName<
            CustomEvent<ComboboxOpenChangeDetail>
        >,
    },
});
