import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiToast, type ToastDismissDetail } from './toast.js';

export type {
    ToastContent,
    ToastDismissDetail,
    ToastOptions,
    ToastVariant,
} from './toast.js';
export { toast } from './toast.js';

/**
 * React wrapper for `<hmi-toast>`: the toast stack. Mount one near your app root
 * and raise toasts from anywhere with the `toast` object, which this module
 * re-exports, as v5 did. `title` and `body` are text, or a DOM node you built,
 * where v5 took any `ReactNode`: render into a detached element and pass it.
 * `onDismiss` receives the event when the user presses a toast's close button, and
 * `event.preventDefault()` keeps the toast; v5 had no such callback.
 *
 * @example
 * <ToastHost />
 * // elsewhere
 * toast.success('Saved', 'Changes synced to the cloud.');
 */
export const ToastHost = createComponent({
    tagName: 'hmi-toast',
    elementClass: HmiToast,
    react: React,
    displayName: 'ToastHost',
    events: {
        onDismiss: 'hmi-dismiss' as EventName<CustomEvent<ToastDismissDetail>>,
    },
});
