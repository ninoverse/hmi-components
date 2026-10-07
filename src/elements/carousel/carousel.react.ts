import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { type CarouselIndexChangeDetail, HmiCarousel } from './carousel.js';

export type { CarouselIndexChangeDetail } from './carousel.js';

/**
 * React wrapper for `<hmi-carousel>`.
 *
 * The slides are the children: every element child is one. `onIndexChange`
 * receives the event: read `event.detail.index`. Set `index` from state to
 * control it, and set it back in the handler to veto a change. `noLoop`,
 * `hideArrows` and `hideDots` turn the defaults off.
 *
 * @example
 * <Carousel label="Highlights" autoPlay={4000}><Slide1 /><Slide2 /></Carousel>
 */
export const Carousel = createComponent({
    tagName: 'hmi-carousel',
    elementClass: HmiCarousel,
    react: React,
    displayName: 'Carousel',
    events: {
        onIndexChange: 'hmi-index-change' as EventName<
            CustomEvent<CarouselIndexChangeDetail>
        >,
    },
});
