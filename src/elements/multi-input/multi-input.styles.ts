import { css } from 'lit';

/* MultiInput — N single-character cells in a row, with an optional separator
   between groups. The label, hint and error around them come from the shared
   form styles. Ported from src/components/styled/multiInput.styled.css. */
export const styles = css`
    .base {
        display: flex;
        align-items: center;
        align-self: flex-start;
        gap: var(--space-3);
        min-width: 0;
    }

    .separator {
        color: var(--on-surface-variant);
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 2.5);
        font-weight: 600;
        user-select: none;
    }

    .cell {
        width: calc(var(--_base) * 5);
        height: calc(var(--_base) * 6);
        padding: 0;
        text-align: center;
        font-family: var(--font-display);
        font-size: calc(var(--_base) * 2.75);
        font-weight: 600;
        color: var(--on-background);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        outline: none;
        font-variant-numeric: tabular-nums;
        text-transform: uppercase;
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .cell:hover:not(:focus):not(:disabled) {
        border-color: var(--outline);
    }

    .cell:focus,
    .cell:focus-visible {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .invalid {
        border-color: var(--error);
    }

    .invalid:focus {
        box-shadow: 0 0 0 calc(var(--_base) * 0.375)
            color-mix(in oklab, var(--error) 35%, transparent);
    }

    .cell:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }
`;
