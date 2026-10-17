import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    type ColorPickerChangeDetail,
    type ColorPickerInputDetail,
    type ColorPickerOpenChangeDetail,
    HmiColorPicker,
} from './color-picker.js';

export type {
    ColorPickerChangeDetail,
    ColorPickerInputDetail,
    ColorPickerOpenChangeDetail,
} from './color-picker.js';

/**
 * React wrapper for `<hmi-color-picker>`.
 *
 * The picker owns its value, so `defaultValue` and `value` both start it.
 * `onInput` receives each change as it happens, `onChange` the committed colour, and
 * both the event: read `event.detail.value`, which is always `#rrggbb` in lower case.
 * Set `value` back to veto a choice. `swatches` is a property of hex colours,
 * `hideInput` replaces `showInput={false}`, and `label`, `hint` and `error` replace
 * the `FormControl` around the v5 picker; `name` makes it a form field.
 *
 * @example
 * <ColorPicker
 *   name="brand"
 *   label="Brand colour"
 *   value={color}
 *   onChange={(e) => setColor(e.detail.value)}
 * />
 */
export const ColorPicker = createComponent({
    tagName: 'hmi-color-picker',
    elementClass: HmiColorPicker,
    react: React,
    displayName: 'ColorPicker',
    events: {
        onInput: 'hmi-input' as EventName<CustomEvent<ColorPickerInputDetail>>,
        onChange: 'hmi-change' as EventName<
            CustomEvent<ColorPickerChangeDetail>
        >,
        onOpenChange: 'hmi-open-change' as EventName<
            CustomEvent<ColorPickerOpenChangeDetail>
        >,
    },
});
