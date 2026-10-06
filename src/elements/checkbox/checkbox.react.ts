import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { type CheckboxChangeDetail, HmiCheckbox } from './checkbox.js';

export type { CheckboxChangeDetail } from './checkbox.js';

/**
 * React wrapper for `<hmi-checkbox>`.
 *
 * `onChange` receives the event: read `event.detail.checked`. Set `checked`
 * from state to control it, and set it back in the handler to veto a toggle.
 *
 * @example
 * <Checkbox label="Subscribe" checked={on} onChange={(e) => setOn(e.detail.checked)} />
 */
export const Checkbox = createComponent({
    tagName: 'hmi-checkbox',
    elementClass: HmiCheckbox,
    react: React,
    displayName: 'Checkbox',
    events: {
        onChange: 'hmi-change' as EventName<CustomEvent<CheckboxChangeDetail>>,
    },
});
