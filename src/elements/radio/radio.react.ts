import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiRadio, type RadioChangeDetail } from './radio.js';

export type { RadioChangeDetail } from './radio.js';

/**
 * React wrapper for `<hmi-radio>`.
 *
 * `onChange` receives the event, and fires only when the radio becomes checked:
 * `event.detail.checked` is `true`. Radios sharing a `name` are one group.
 *
 * @example
 * <Radio name="size" value="md" label="Medium" onChange={() => setSize('md')} />
 */
export const Radio = createComponent({
    tagName: 'hmi-radio',
    elementClass: HmiRadio,
    react: React,
    displayName: 'Radio',
    events: {
        onChange: 'hmi-change' as EventName<CustomEvent<RadioChangeDetail>>,
    },
});
