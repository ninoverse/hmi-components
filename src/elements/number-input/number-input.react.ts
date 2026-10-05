import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiNumberInput, type NumberInputValueDetail } from './number-input.js';

export type { NumberInputValueDetail } from './number-input.js';

/**
 * React wrapper for `<hmi-number-input>`.
 *
 * `onInput` is the per-edit callback (v5's `onChange`) and receives the event:
 * read `event.detail.value`, a number or `null`. `onChange` fires on commit.
 *
 * @example
 * <NumberInput label="Quantity" min={1} max={99} value={qty} onInput={(e) => setQty(e.detail.value)} />
 */
export const NumberInput = createComponent({
    tagName: 'hmi-number-input',
    elementClass: HmiNumberInput,
    react: React,
    displayName: 'NumberInput',
    events: {
        onInput: 'hmi-input' as EventName<CustomEvent<NumberInputValueDetail>>,
        onChange: 'hmi-change' as EventName<
            CustomEvent<NumberInputValueDetail>
        >,
    },
});
