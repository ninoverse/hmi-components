import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiStepper, type StepperChangeDetail } from './stepper.js';

export type {
    StepperChangeDetail,
    StepperOrientation,
    StepperStep,
} from './stepper.js';

/**
 * React wrapper for `<hmi-stepper>`.
 *
 * `steps` is a property and `current` the active step's `value`. It is
 * controlled: `onChange` receives the event, whose `detail` is `{ value }`, when
 * a completed step is chosen; set `current` from it. There is no
 * `defaultCurrent`: set `current` for the initial step. `readonly` stops
 * completed steps from being buttons, as a controlled v5 stepper without
 * `onChange` did. `spacing` is a CSS length string, and `label` replaces
 * `aria-label`. Rich labels and descriptions are children with
 * `slot="label-<value>"` and `slot="description-<value>"`.
 *
 * @example
 * <Stepper steps={steps} current={step} onChange={(e) => setStep(e.detail.value)} />
 */
export const Stepper = createComponent({
    tagName: 'hmi-stepper',
    elementClass: HmiStepper,
    react: React,
    displayName: 'Stepper',
    events: {
        onChange: 'hmi-change' as EventName<CustomEvent<StepperChangeDetail>>,
    },
});
