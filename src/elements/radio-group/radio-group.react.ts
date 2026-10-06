import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiRadioGroup, type RadioGroupChangeDetail } from './radio-group.js';

export type { RadioGroupChangeDetail, RadioOption } from './radio-group.js';

/**
 * React wrapper for `<hmi-radio-group>`.
 *
 * `onChange` receives the event: read `event.detail.value`. Set `value` from
 * state to control it, and set it back in the handler to veto a choice. A rich
 * option label is a child with `slot="label-<value>"`.
 *
 * @example
 * <RadioGroup name="plan" options={plans} value={plan} onChange={(e) => setPlan(e.detail.value)} />
 */
export const RadioGroup = createComponent({
    tagName: 'hmi-radio-group',
    elementClass: HmiRadioGroup,
    react: React,
    displayName: 'RadioGroup',
    events: {
        onChange: 'hmi-change' as EventName<
            CustomEvent<RadioGroupChangeDetail>
        >,
    },
});
