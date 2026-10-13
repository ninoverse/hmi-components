import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiPopover, type PopoverOpenChangeDetail } from './popover.js';

export type { PopoverAlign, PopoverOpenChangeDetail } from './popover.js';

/**
 * React wrapper for `<hmi-popover>`.
 *
 * The `trigger` prop is now a child with `slot="trigger"`. `onOpenChange`
 * receives the event, so read `event.detail.open`; it fires when the user opens
 * or closes the popover, not when you set `open`. The element owns the state, so
 * the browser's outside click and Escape close it even if you keep `open` as
 * `true`: set `open` from the event, as before.
 *
 * @example
 * <Popover open={open} onOpenChange={(e) => setOpen(e.detail.open)}>
 *   <Button slot="trigger">Open</Button>
 *   Content
 * </Popover>
 */
export const Popover = createComponent({
    tagName: 'hmi-popover',
    elementClass: HmiPopover,
    react: React,
    displayName: 'Popover',
    events: {
        onOpenChange: 'hmi-open-change' as EventName<
            CustomEvent<PopoverOpenChangeDetail>
        >,
    },
});
