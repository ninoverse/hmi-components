import { css } from 'lit';

/* Grid — CSS grid layout primitive. The inner .base is the grid container: its
   column template comes from the `columns` property through --_columns (a
   number becomes equal minmax(0, 1fr) tracks, a string is used as-is), and the
   slotted children are the grid items. The gap scale matches Box padding and
   Flex gap. Ported from src/components/styled/grid.styled.css.

   v5's grid was the element the consumer styled, so its `style` and `class`
   set the gap, the alignment and the implicit tracks. The host keeps that
   role: the gap presets sit on the host, where the consumer's own `gap` beats
   them, and the base inherits every grid container property but the column
   template, which `columns` owns. A block host does nothing with them itself,
   but `justify-items` would size the base as a block-level box, so the base
   stretches across the host, and down it, so a height given to the host, or a
   row that stretches it, stretches the rows as v5's did. */
export const styles = css`
    :host {
        display: block;
    }

    :host([gap='small']) {
        gap: var(--space-4);
    }
    :host([gap='medium']) {
        gap: var(--space-8);
    }
    :host([gap='large']) {
        gap: var(--space-11);
    }

    .base {
        display: grid;
        grid-template-columns: var(--_columns);
        gap: inherit;
        align-items: inherit;
        justify-items: inherit;
        align-content: inherit;
        justify-content: inherit;
        grid-auto-rows: inherit;
        grid-auto-columns: inherit;
        grid-auto-flow: inherit;
        grid-template-rows: inherit;
        grid-template-areas: inherit;
        justify-self: stretch;
        height: 100%;
    }
`;
