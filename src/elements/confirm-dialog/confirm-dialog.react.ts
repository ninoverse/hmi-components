import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    type ConfirmDialogCancelDetail,
    type ConfirmDialogConfirmDetail,
    HmiConfirmDialog,
} from './confirm-dialog.js';

export type {
    ConfirmDialogCancelDetail,
    ConfirmDialogConfirmDetail,
    ConfirmDialogVariant,
} from './confirm-dialog.js';

/**
 * React wrapper for `<hmi-confirm-dialog>`.
 *
 * It is controlled, as the v5 component was: set `open` to `false` from
 * `onCancel` and `onConfirm`. `title` is now `heading` (plain text) or a child
 * with `slot="title"`, `description` is `description` or a child with
 * `slot="description"`, and `confirmLabel` and `cancelLabel` are plain text, or
 * children with `slot="confirm-label"` and `slot="cancel-label"`. `loading` and
 * `confirmDisabled` work as before; `confirmOnButton` makes Enter confirm even
 * from a focused button.
 *
 * @example
 * <ConfirmDialog open={open} heading="Delete?" variant="danger" onCancel={close} onConfirm={remove} />
 */
export const ConfirmDialog = createComponent({
    tagName: 'hmi-confirm-dialog',
    elementClass: HmiConfirmDialog,
    react: React,
    displayName: 'ConfirmDialog',
    events: {
        onCancel: 'hmi-cancel' as EventName<
            CustomEvent<ConfirmDialogCancelDetail>
        >,
        onConfirm: 'hmi-confirm' as EventName<
            CustomEvent<ConfirmDialogConfirmDetail>
        >,
    },
});
