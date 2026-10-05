import { css } from 'lit';

/* Input — the bordered field: a flex row with optional left and right icon
   slots around the native input, and an error state. The label, hint and error
   around it come from the shared form styles. An unused icon slot has no box,
   so it adds no gap. Ported from src/components/styled/input.styled.css. */
export const styles = css`
    .base {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        height: calc(var(--_base) * 5);
        padding: 0 var(--space-6);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard),
            background var(--duration-short-3) var(--easing-standard);
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

    ::slotted([slot='left-icon']),
    ::slotted([slot='right-icon']) {
        display: flex;
        color: var(--on-surface-variant);
    }

    ::slotted(svg[slot='left-icon']),
    ::slotted(svg[slot='right-icon']) {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }

    .control {
        flex: 1;
        min-width: 0;
        border: 0;
        background: transparent;
        font: inherit;
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        color: var(--on-background);
        height: 100%;
        padding: 0 var(--space-2);
        outline: none;
    }

    .control:focus-visible {
        outline: none;
    }

    .control::placeholder {
        color: var(--ref-neutral-60);
    }

    .disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .disabled:hover {
        border-color: var(--outline-variant);
    }

    .control:disabled {
        cursor: not-allowed;
    }
`;
