import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { type AccordionOpenChangeDetail, HmiAccordion } from './accordion.js';

export type { AccordionItem, AccordionOpenChangeDetail } from './accordion.js';

/**
 * React wrapper for `<hmi-accordion>`.
 *
 * `onOpenChange` receives the event: read `event.detail.open`. Set `open` from
 * state to control it, and set it back in the handler to veto a toggle. Rich
 * titles and bodies are children with `slot="title-<index>"` or
 * `slot="body-<index>"`.
 *
 * @example
 * <Accordion multiple items={items} open={open} onOpenChange={(e) => setOpen(e.detail.open)} />
 */
export const Accordion = createComponent({
    tagName: 'hmi-accordion',
    elementClass: HmiAccordion,
    react: React,
    displayName: 'Accordion',
    events: {
        onOpenChange: 'hmi-open-change' as EventName<
            CustomEvent<AccordionOpenChangeDetail>
        >,
    },
});
