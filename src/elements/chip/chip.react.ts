import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    type ChipCloseDetail,
    type ChipSelectDetail,
    HmiChip,
} from './chip.js';

export type { ChipCloseDetail, ChipSelectDetail } from './chip.js';

/**
 * React wrapper for `<hmi-chip>`.
 *
 * @example
 * <Chip selectable closable selected={on} onSelect={toggle} onClose={remove}>Filter</Chip>
 */
export const Chip = createComponent({
    tagName: 'hmi-chip',
    elementClass: HmiChip,
    react: React,
    displayName: 'Chip',
    events: {
        onSelect: 'hmi-select' as EventName<CustomEvent<ChipSelectDetail>>,
        onClose: 'hmi-close' as EventName<CustomEvent<ChipCloseDetail>>,
    },
});
