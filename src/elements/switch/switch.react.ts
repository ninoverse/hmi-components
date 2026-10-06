import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiSwitch, type SwitchChangeDetail } from './switch.js';

export type { SwitchChangeDetail } from './switch.js';

/**
 * React wrapper for `<hmi-switch>`.
 *
 * `onChange` receives the event: read `event.detail.checked`. Set `checked`
 * from state to control it, and set it back in the handler to veto a toggle.
 *
 * @example
 * <Switch label="Subscribe" checked={on} onChange={(e) => setOn(e.detail.checked)} />
 */
export const Switch = createComponent({
    tagName: 'hmi-switch',
    elementClass: HmiSwitch,
    react: React,
    displayName: 'Switch',
    events: {
        onChange: 'hmi-change' as EventName<CustomEvent<SwitchChangeDetail>>,
    },
});
