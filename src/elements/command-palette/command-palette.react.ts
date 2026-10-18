import { createComponent, type EventName } from '@lit/react';
import * as React from 'react';
import {
    type CommandPaletteActionDetail,
    type CommandPaletteCloseDetail,
    type CommandPaletteInputDetail,
    HmiCommandPalette,
} from './command-palette.js';

export type {
    CommandPaletteActionDetail,
    CommandPaletteCloseDetail,
    CommandPaletteCloseReason,
    CommandPaletteCommand,
    CommandPaletteFilter,
    CommandPaletteFilterFn,
    CommandPaletteInputDetail,
} from './command-palette.js';

/**
 * React wrapper for `<hmi-command-palette>`.
 *
 * The palette is controlled, as the v5 component was: it never closes itself.
 * `onClose` receives the event for Escape, a press outside it and a chosen command
 * (`event.detail.reason` is `escape`, `backdrop` or `select`): set `open` to
 * `false` from it, as `onOpenChange={setOpen}` did. `onAction` replaces the
 * palette's `onAction` and each command's `onSelect`: read `event.detail.value`,
 * the command's `value` (v5's `id`). `commands` is a property, an icon is a child
 * with `slot="icon-<value>"`, and `emptyMessage` has an `empty` slot.
 *
 * @example
 * <CommandPalette
 *   open={open}
 *   commands={commands}
 *   onAction={(e) => run(e.detail.value)}
 *   onClose={() => setOpen(false)}
 * />
 */
export const CommandPalette = createComponent({
    tagName: 'hmi-command-palette',
    elementClass: HmiCommandPalette,
    react: React,
    displayName: 'CommandPalette',
    events: {
        onClose: 'hmi-close' as EventName<
            CustomEvent<CommandPaletteCloseDetail>
        >,
        onAction: 'hmi-action' as EventName<
            CustomEvent<CommandPaletteActionDetail>
        >,
        onInput: 'hmi-input' as EventName<
            CustomEvent<CommandPaletteInputDetail>
        >,
    },
});
