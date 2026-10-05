import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    HmiPasswordInput,
    type PasswordInputValueDetail,
} from './password-input.js';

export type { PasswordInputValueDetail } from './password-input.js';

/**
 * React wrapper for `<hmi-password-input>`.
 *
 * `onInput` is the per-keystroke callback (v5's `onChange`) and receives the
 * event: read `event.detail.value`. `onChange` fires when the value is committed.
 *
 * @example
 * <PasswordInput name="password" label="Password" value={pw} onInput={(e) => setPw(e.detail.value)} />
 */
export const PasswordInput = createComponent({
    tagName: 'hmi-password-input',
    elementClass: HmiPasswordInput,
    react: React,
    displayName: 'PasswordInput',
    events: {
        onInput: 'hmi-input' as EventName<
            CustomEvent<PasswordInputValueDetail>
        >,
        onChange: 'hmi-change' as EventName<
            CustomEvent<PasswordInputValueDetail>
        >,
    },
});
