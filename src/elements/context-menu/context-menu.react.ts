import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    type ContextMenuOpenChangeDetail,
    HmiContextMenu,
} from './context-menu.js';

export type {
    ContextMenuFocusOnOpen,
    ContextMenuOpenChangeDetail,
} from './context-menu.js';

/**
 * React wrapper for `<hmi-context-menu>`.
 *
 * The trigger (`children` in v5) is now a child with `slot="trigger"`, and the
 * `menu` prop is a child with `slot="menu"`, a `Menu`. `onOpenChange` is new, and
 * receives the event, so read `event.detail.open`; it fires when the user opens or
 * closes the menu, not when you set `open`. `focusOnOpen` decides when the first
 * item takes focus.
 *
 * @example
 * <ContextMenu>
 *   <div slot="trigger">Right-click me</div>
 *   <Menu slot="menu" label="Edit"><MenuItem>Copy</MenuItem></Menu>
 * </ContextMenu>
 */
export const ContextMenu = createComponent({
    tagName: 'hmi-context-menu',
    elementClass: HmiContextMenu,
    react: React,
    displayName: 'ContextMenu',
    events: {
        onOpenChange: 'hmi-open-change' as EventName<
            CustomEvent<ContextMenuOpenChangeDetail>
        >,
    },
});
