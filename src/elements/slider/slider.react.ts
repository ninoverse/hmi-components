import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiSlider, type SliderValueDetail } from './slider.js';

export type { SliderValueDetail } from './slider.js';

/**
 * React wrapper for `<hmi-slider>`.
 *
 * `onInput` is the callback while the thumb moves (v5's `onChange`) and
 * receives the event: read `event.detail.value`. `onChange` fires when the
 * thumb is released. `formatValue` is a `{value}` template string or a
 * function.
 *
 * @example
 * <Slider label="Volume" value={vol} onInput={(e) => setVol(e.detail.value)} showValue formatValue={(v) => `${v}%`} />
 */
export const Slider = createComponent({
    tagName: 'hmi-slider',
    elementClass: HmiSlider,
    react: React,
    displayName: 'Slider',
    events: {
        onInput: 'hmi-input' as EventName<CustomEvent<SliderValueDetail>>,
        onChange: 'hmi-change' as EventName<CustomEvent<SliderValueDetail>>,
    },
});
