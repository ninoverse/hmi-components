import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiMultiInput, type MultiInputValueDetail } from './multi-input.js';

export type {
    MultiInputType,
    MultiInputValueDetail,
} from './multi-input.js';

/**
 * React wrapper for `<hmi-multi-input>`.
 *
 * `onInput` is the per-edit callback (v5's `onChange`) and receives the event:
 * read `event.detail.value`. `onChange` fires when focus leaves the group after
 * a change, and `onComplete` (v5's, now also an event) when every cell is filled.
 *
 * @example
 * <MultiInput length={6} groupSize={3} onComplete={(e) => verify(e.detail.value)} />
 */
export const MultiInput = createComponent({
    tagName: 'hmi-multi-input',
    elementClass: HmiMultiInput,
    react: React,
    displayName: 'MultiInput',
    events: {
        onInput: 'hmi-input' as EventName<CustomEvent<MultiInputValueDetail>>,
        onChange: 'hmi-change' as EventName<CustomEvent<MultiInputValueDetail>>,
        onComplete: 'hmi-complete' as EventName<
            CustomEvent<MultiInputValueDetail>
        >,
    },
});
