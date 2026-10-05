import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiTextarea, type TextareaValueDetail } from './textarea.js';

export type { TextareaValueDetail } from './textarea.js';

/**
 * React wrapper for `<hmi-textarea>`.
 *
 * `onInput` is the per-keystroke callback (v5's `onChange`) and receives the
 * event: read `event.detail.value`. `onChange` fires when the value is committed.
 *
 * @example
 * <Textarea name="bio" label="About you" value={bio} onInput={(e) => setBio(e.detail.value)} rows={4} />
 */
export const Textarea = createComponent({
    tagName: 'hmi-textarea',
    elementClass: HmiTextarea,
    react: React,
    displayName: 'Textarea',
    events: {
        onInput: 'hmi-input' as EventName<CustomEvent<TextareaValueDetail>>,
        onChange: 'hmi-change' as EventName<CustomEvent<TextareaValueDetail>>,
    },
});
