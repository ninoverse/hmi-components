import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    HmiSegmentedControl,
    type SegmentedControlValueDetail,
} from './segmented-control.js';

export type {
    SegmentedControlOption,
    SegmentedControlSize,
    SegmentedControlValueDetail,
} from './segmented-control.js';

/**
 * React wrapper for `<hmi-segmented-control>`.
 *
 * `onChange` receives the event: read `event.detail.value`. Set `value` from
 * state to control it, and set it back in the handler to veto a choice. A rich
 * label or an icon is a child with `slot="label-<value>"` or `slot="icon-<value>"`.
 *
 * @example
 * <SegmentedControl options={views} value={view} onChange={(e) => setView(e.detail.value)} />
 */
export const SegmentedControl = createComponent({
    tagName: 'hmi-segmented-control',
    elementClass: HmiSegmentedControl,
    react: React,
    displayName: 'SegmentedControl',
    events: {
        onChange: 'hmi-change' as EventName<
            CustomEvent<SegmentedControlValueDetail>
        >,
    },
});
