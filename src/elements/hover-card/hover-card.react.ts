import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiHoverCard, type HoverCardOpenChangeDetail } from './hover-card.js';

export type {
    HoverCardAlign,
    HoverCardOpenChangeDetail,
    HoverCardSide,
} from './hover-card.js';

/**
 * React wrapper for `<hmi-hover-card>`.
 *
 * The `trigger` prop is now a child with `slot="trigger"`, `openDelay` and
 * `closeDelay` are still the props, and `width` is the card's width. `onOpenChange`
 * is new, and receives the event, so read `event.detail.open`; it fires when the
 * pointer, focus or Escape opens or closes the card, not when you set `open`.
 *
 * @example
 * <HoverCard side="bottom" align="start">
 *   <Link slot="trigger" href="/ada">@ada</Link>
 *   Ada Lovelace, mathematician.
 * </HoverCard>
 */
export const HoverCard = createComponent({
    tagName: 'hmi-hover-card',
    elementClass: HmiHoverCard,
    react: React,
    displayName: 'HoverCard',
    events: {
        onOpenChange: 'hmi-open-change' as EventName<
            CustomEvent<HoverCardOpenChangeDetail>
        >,
    },
});
