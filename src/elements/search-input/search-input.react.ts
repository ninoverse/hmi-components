import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import { HmiSearchInput, type SearchInputValueDetail } from './search-input.js';

export type { SearchInputValueDetail } from './search-input.js';

/**
 * React wrapper for `<hmi-search-input>`.
 *
 * `onInput` is the per-keystroke callback (v5's `onChange`) and receives the
 * event: read `event.detail.value`. `onChange` fires when the value is committed.
 *
 * @example
 * <SearchInput name="q" label="Search" value={q} onInput={(e) => setQ(e.detail.value)} />
 */
export const SearchInput = createComponent({
    tagName: 'hmi-search-input',
    elementClass: HmiSearchInput,
    react: React,
    displayName: 'SearchInput',
    events: {
        onInput: 'hmi-input' as EventName<CustomEvent<SearchInputValueDetail>>,
        onChange: 'hmi-change' as EventName<
            CustomEvent<SearchInputValueDetail>
        >,
    },
});
