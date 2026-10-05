import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiInput, type InputValueDetail } from './input.js';

export type { InputType, InputValueDetail } from './input.js';

/**
 * React wrapper for `<hmi-input>`.
 *
 * `onInput` is the per-keystroke callback (v5's `onChange`) and receives the
 * event: read `event.detail.value`. `onChange` fires when the value is committed.
 *
 * @example
 * <Input name="email" label="Email" value={email} onInput={(e) => setEmail(e.detail.value)} />
 */
export const Input = createComponent({
    tagName: 'hmi-input',
    elementClass: HmiInput,
    react: React,
    displayName: 'Input',
    events: {
        onInput: 'hmi-input' as EventName<CustomEvent<InputValueDetail>>,
        onChange: 'hmi-change' as EventName<CustomEvent<InputValueDetail>>,
    },
});
