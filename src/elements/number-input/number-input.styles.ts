import { css } from 'lit';

/* NumberInput — wraps <input type="number"> and adds visible stepper buttons,
   since the native spinners are inconsistent across browsers. The field itself
   still owns ArrowUp/ArrowDown stepping. Visuals mirror Input so the two
   compose well in a form; the label, hint and error around it come from the
   shared form styles. Ported from src/components/styled/numberInput.styled.css. */
export const styles = css`
    .base {
        display: flex;
        align-items: stretch;
        height: calc(var(--_base) * 5);
        padding: 0 0 0 var(--space-6);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        overflow: hidden;
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .base:hover {
        border-color: var(--outline);
    }

    .base:focus-within {
        border-color: var(--primary);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5) var(--ring);
    }

    .invalid {
        border-color: var(--error);
    }

    .invalid:focus-within {
        box-shadow: 0 0 0 calc(var(--_base) * 0.5)
            color-mix(in oklab, var(--error) 35%, transparent);
    }

    .control {
        flex: 1;
        min-width: 0;
        border: 0;
        background: transparent;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        color: var(--on-background);
        height: 100%;
        padding: 0;
        outline: none;
        font-variant-numeric: tabular-nums;
        -moz-appearance: textfield;
        appearance: textfield;
    }

    .control:focus-visible {
        outline: none;
    }

    /* The element draws its own steppers. */
    .control::-webkit-outer-spin-button,
    .control::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .control::placeholder {
        color: var(--ref-neutral-60);
    }

    .control:disabled {
        cursor: not-allowed;
    }

    .steppers {
        display: flex;
        flex-direction: column;
        width: calc(var(--_base) * 3.5);
        border-left: calc(var(--_base) * 0.125) solid var(--outline-variant);
    }

    .step {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: var(--surface-container);
        border: 0;
        cursor: pointer;
        color: var(--on-surface-variant);
        transition: background var(--duration-short-2) var(--easing-standard);
    }

    .step:hover:not(:disabled) {
        background: var(--surface-container-high);
        color: var(--primary);
    }

    .step:active:not(:disabled) {
        background: var(--surface-container-highest);
    }

    .step:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .up {
        border-bottom: calc(var(--_base) * 0.0625) solid var(--outline-variant);
    }

    .step svg {
        width: calc(var(--_base) * 1.5);
        height: calc(var(--_base) * 1.5);
    }

    .disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .disabled:hover {
        border-color: var(--outline-variant);
    }
`;
