import { css } from 'lit';

/* SegmentedControl — a radio group of button-shaped segments laid out inline.
   The chosen segment paints the primary container surface. The label, hint and
   error around it come from the shared form styles. Ported from
   src/components/styled/segmentedControl.styled.css. */
export const styles = css`
    .base {
        display: inline-flex;
        align-self: flex-start;
        padding: calc(var(--_base) * 0.375);
        gap: var(--space-1);
        background: var(--surface-container);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        font-family: var(--font-default);
    }

    .full-width {
        display: flex;
        align-self: stretch;
        width: 100%;
    }

    .invalid {
        border-color: var(--error);
    }

    .segment {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        margin: 0;
        background: transparent;
        border: 0;
        border-radius: var(--corner-extra-small);
        cursor: pointer;
        color: var(--on-surface-variant);
        font-family: inherit;
        transition:
            background var(--duration-short-2) var(--easing-standard),
            color var(--duration-short-2) var(--easing-standard);
    }

    .full-width .segment {
        flex: 1;
    }

    /* The outer corners follow the container's, so a chosen first or last
       segment fits its corner. */
    .segment:first-child {
        border-top-left-radius: var(--corner-tl);
        border-bottom-left-radius: var(--corner-bl);
    }

    .segment:last-child {
        border-top-right-radius: var(--corner-tr);
        border-bottom-right-radius: var(--corner-br);
    }

    .size-small .segment {
        height: calc(var(--_base) * 3.5);
        padding: 0 var(--space-5);
        font-size: calc(var(--_base) * 1.5);
    }

    .size-medium .segment {
        height: calc(var(--_base) * 4.5);
        padding: 0 var(--space-7);
        font-size: calc(var(--_base) * 1.75);
    }

    .size-large .segment {
        height: calc(var(--_base) * 5.5);
        padding: 0 var(--space-9);
        font-size: calc(var(--_base) * 2);
    }

    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .icon[hidden] {
        display: none;
    }

    ::slotted(svg) {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .segment-label {
        font-weight: 600;
        white-space: nowrap;
    }

    .segment:hover:not(:disabled):not([data-checked='true']) {
        background: var(--surface-container-high);
        color: var(--on-surface);
    }

    .segment[data-checked='true'] {
        background: var(--primary-container);
        color: var(--on-primary-container);
    }

    .segment:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.25) var(--ring) inset;
    }

    .segment:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    /* The whole control is already dimmed: do not dim each segment again. */
    .disabled .segment:disabled {
        opacity: 1;
    }
`;
