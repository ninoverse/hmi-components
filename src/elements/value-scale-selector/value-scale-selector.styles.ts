import { css } from 'lit';

/* ValueScaleSelector — two layers of icons stacked, the foreground layer
   clipped to (value / max) of the width. An overlay holds transparent click
   targets, one per position or two halves with allow-half. The label, hint and
   error around it come from the shared form styles. Ported from
   src/components/styled/valueScaleSelector.styled.css. */
export const styles = css`
    .icon-source {
        display: none;
    }

    .base {
        position: relative;
        display: inline-flex;
        align-self: flex-start;
        color: var(--outline-variant);
        line-height: 0;
        outline: none;
        border-radius: var(--corner-extra-small);
    }

    .base:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .row {
        display: flex;
        gap: var(--space-1);
        color: var(--outline-variant);
    }

    .fill {
        position: absolute;
        top: 0;
        left: 0;
        color: var(--primary);
        overflow: hidden;
        pointer-events: none;
    }

    .item {
        display: inline-flex;
        flex-shrink: 0;
    }

    .item svg {
        fill: currentColor;
    }

    .size-small .item > * {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .size-medium .item > * {
        width: calc(var(--_base) * 3);
        height: calc(var(--_base) * 3);
    }

    .size-large .item > * {
        width: calc(var(--_base) * 4);
        height: calc(var(--_base) * 4);
    }

    .overlay {
        position: absolute;
        inset: 0;
        display: flex;
        gap: var(--space-1);
    }

    .cell {
        display: flex;
        flex: 1;
        min-width: 0;
    }

    .target {
        flex: 1 1 0;
        min-width: 0;
        margin: 0;
        background: transparent;
        border: 0;
        cursor: pointer;
        padding: 0;
    }

    .disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }
`;
