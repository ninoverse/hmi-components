import { createComponent } from '@lit/react';
import * as React from 'react';
import { HmiEmptyState } from './empty-state.js';

/**
 * React wrapper for `<hmi-empty-state>`.
 *
 * @example
 * <EmptyState><span slot="title">No results</span><span slot="description">Try another search.</span></EmptyState>
 */
export const EmptyState = createComponent({
    tagName: 'hmi-empty-state',
    elementClass: HmiEmptyState,
    react: React,
    displayName: 'EmptyState',
});
