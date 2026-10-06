import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    HmiValueScaleSelector,
    type ValueScaleSelectorValueDetail,
} from './value-scale-selector.js';

export type {
    ValueScaleSelectorSize,
    ValueScaleSelectorValueDetail,
} from './value-scale-selector.js';

/**
 * React wrapper for `<hmi-value-scale-selector>`.
 *
 * `onChange` receives the event: read `event.detail.value`. Set `value` from
 * state to control it, and set it back in the handler to veto a change. A custom
 * icon is one child with `slot="icon"`; `valueText` is a template string or a
 * function.
 *
 * @example
 * <ValueScaleSelector max={5} allowHalf value={rating} onChange={(e) => setRating(e.detail.value)} />
 */
export const ValueScaleSelector = createComponent({
    tagName: 'hmi-value-scale-selector',
    elementClass: HmiValueScaleSelector,
    react: React,
    displayName: 'ValueScaleSelector',
    events: {
        onChange: 'hmi-change' as EventName<
            CustomEvent<ValueScaleSelectorValueDetail>
        >,
    },
});
