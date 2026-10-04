import { css } from 'lit';

/* Divider — a thin rule that separates stacked or inline content. Horizontal
   and vertical orientations are supported. With a label the .base becomes a
   flex row with the text in the middle (or aligned start/end) and a rule on
   each side. Both modes share one shadow structure, because the slot has to
   exist for slotchange to tell them apart: the lines and the label only show
   when labelled. Ported from src/components/styled/divider.styled.css. */
export const styles = css`
    :host {
        display: block;
    }

    :host([orientation='vertical']) {
        width: 1px;
        align-self: stretch;
        min-height: calc(var(--_base) * 1.5);
    }

    .base {
        background: var(--outline-variant);
        border: 0;
        margin: 0;
        width: 100%;
        height: 1px;
    }

    :host([orientation='vertical']) .base {
        height: 100%;
        min-height: inherit;
    }

    .line,
    .label {
        display: none;
    }

    .labeled {
        background: transparent;
        height: auto;
        display: flex;
        align-items: center;
        gap: var(--space-6);
        color: var(--on-surface-variant);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.625);
    }

    .labeled .line {
        display: block;
        flex: 1;
        height: 1px;
        background: var(--outline-variant);
    }

    .labeled .label {
        display: block;
        white-space: nowrap;
    }

    :host([align='start']) .labeled .line:first-child {
        flex: 0 0 calc(var(--_base) * 1.5);
    }

    :host([align='end']) .labeled .line:last-child {
        flex: 0 0 calc(var(--_base) * 1.5);
    }
`;
