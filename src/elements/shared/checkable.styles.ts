import { css } from 'lit';

/* The shell of a checkable control: the label row, the clipped native input and
   the disabled state. The indicator (box, track) is the subclass's. The host is
   inline so a row of controls sits like v5's inline-flex label, with the hint or
   error stacked below it. */
export const checkableStyles = css`
    :host {
        display: inline-flex;
        vertical-align: top;
    }

    .base {
        display: inline-flex;
        align-items: center;
        align-self: flex-start;
        gap: var(--space-5);
        cursor: default;
        user-select: none;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        color: var(--on-background);
    }

    .input {
        position: absolute;
        width: calc(var(--_base) * 0.125);
        height: calc(var(--_base) * 0.125);
        margin: calc(var(--_base) * -0.125);
        padding: 0;
        border: 0;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }

    .label {
        line-height: 1.4;
    }

    .disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }
`;
