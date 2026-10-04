import { css } from 'lit';

/* Flex — flexbox layout primitive. The host is the container: a plain row with
   stretch alignment and no gap, and direction, alignment, justification, gap
   and wrapping opt in through reflected attributes. A slot has no box of its
   own, so the slotted children are the flex items. The gap scale matches Box
   padding. Ported from src/components/styled/flex.styled.css. */
export const styles = css`
    :host {
        display: flex;
    }
    :host([inline]) {
        display: inline-flex;
    }

    :host([direction='column']) {
        flex-direction: column;
    }
    :host([direction='row-reverse']) {
        flex-direction: row-reverse;
    }
    :host([direction='column-reverse']) {
        flex-direction: column-reverse;
    }

    :host([align='start']) {
        align-items: flex-start;
    }
    :host([align='center']) {
        align-items: center;
    }
    :host([align='end']) {
        align-items: flex-end;
    }
    :host([align='baseline']) {
        align-items: baseline;
    }

    :host([justify='center']) {
        justify-content: center;
    }
    :host([justify='end']) {
        justify-content: flex-end;
    }
    :host([justify='between']) {
        justify-content: space-between;
    }
    :host([justify='around']) {
        justify-content: space-around;
    }
    :host([justify='evenly']) {
        justify-content: space-evenly;
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

    :host([wrap]) {
        flex-wrap: wrap;
    }
`;
