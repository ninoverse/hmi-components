import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiTooltip, type TooltipOpenChangeDetail } from './tooltip.js';

export type { TooltipOpenChangeDetail, TooltipSide } from './tooltip.js';

/**
 * React wrapper for `<hmi-tooltip>`.
 *
 * The trigger is now a child with `slot="trigger"`, and `label` is a string: rich
 * content is a child with `slot="label"`. `onOpenChange` is new, and receives the
 * event, so read `event.detail.open`; it fires when the pointer, focus or Escape
 * opens or closes the bubble, not when you set `open`.
 *
 * @example
 * <Tooltip label="Copy">
 *   <Button slot="trigger">Copy</Button>
 * </Tooltip>
 */
export const Tooltip = createComponent({
    tagName: 'hmi-tooltip',
    elementClass: HmiTooltip,
    react: React,
    displayName: 'Tooltip',
    events: {
        onOpenChange: 'hmi-open-change' as EventName<
            CustomEvent<TooltipOpenChangeDetail>
        >,
    },
});
