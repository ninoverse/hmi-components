import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    HmiModal,
    type ModalActionDetail,
    type ModalCloseDetail,
} from './modal.js';

export type {
    DialogAction,
    ModalActionDetail,
    ModalCloseDetail,
    ModalCloseReason,
    ModalSize,
} from './modal.js';

/**
 * React wrapper for `<hmi-modal>`.
 *
 * It is controlled, as the v5 component was: `onClose` receives the event, so
 * set `open` to `false` from it. `title` is now `heading` (plain text) or a child
 * with `slot="title"`, `description` is `description` or a child with
 * `slot="description"`, and `actions` is an array of `DialogAction`s or children
 * with `slot="actions"`. `className` and `style` reach the host: style the box
 * with `::part(panel)`.
 *
 * @example
 * <Modal open={open} heading="Edit" onClose={() => setOpen(false)} actions={[{ label: 'Save', value: 'save', variant: 'primary' }]} onAction={(e) => save(e.detail.value)}>…</Modal>
 */
export const Modal = createComponent({
    tagName: 'hmi-modal',
    elementClass: HmiModal,
    react: React,
    displayName: 'Modal',
    events: {
        onClose: 'hmi-close' as EventName<CustomEvent<ModalCloseDetail>>,
        onAction: 'hmi-action' as EventName<CustomEvent<ModalActionDetail>>,
    },
});
