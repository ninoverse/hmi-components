import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    type ChipDismissDetail,
    type ChipSelectDetail,
    HmiChip,
} from './chip.js';

export type { ChipDismissDetail, ChipSelectDetail } from './chip.js';

/**
 * React wrapper for `<hmi-chip>`.
 *
 * @example
 * <Chip selectable closable selected={on} onSelect={toggle} onDismiss={remove}>Filter</Chip>
 */
export const Chip = createComponent({
    tagName: 'hmi-chip',
    elementClass: HmiChip,
    react: React,
    displayName: 'Chip',
    events: {
        onSelect: 'hmi-select' as EventName<CustomEvent<ChipSelectDetail>>,
        onDismiss: 'hmi-dismiss' as EventName<CustomEvent<ChipDismissDetail>>,
    },
});
