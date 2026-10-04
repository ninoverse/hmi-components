import { css } from 'lit';

/* Grid — CSS grid layout primitive. The inner .base is the grid container: its
   column template is set from the `columns` property (a number becomes equal
   minmax(0, 1fr) tracks, a string is used as-is), and the slotted children are
   the grid items. The gap scale matches Box padding and Flex gap. Ported from
   src/components/styled/grid.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    .base {
        display: grid;
    }

    :host([gap='small']) .base {
        gap: var(--space-4);
    }
    :host([gap='medium']) .base {
        gap: var(--space-8);
    }
    :host([gap='large']) .base {
        gap: var(--space-11);
    }
`;
