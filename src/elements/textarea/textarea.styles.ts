import { css } from 'lit';

/* Textarea — multi-line text input sharing the leaf corners and focus ring with
   Input. The native textarea is the bordered box; the resize handle is enabled
   vertically only. The label, hint and error around it come from the shared
   form styles. Ported from src/components/styled/textarea.styled.css. */
export const styles = css`
    .control {
        display: block;
        width: 100%;
        min-height: calc(var(--_base) * 12);
        padding: var(--space-5) var(--space-6);
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.125) solid var(--outline-variant);
        border-radius: var(--corner-tl) var(--corner-tr) var(--corner-br)
            var(--corner-bl);
        font-family: var(--font-default);
        font-size: calc(var(--_base) * 1.75);
        color: var(--on-background);
        outline: none;
        resize: vertical;
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard),
            background var(--duration-short-3) var(--easing-standard);
    }

    .control::placeholder {
        color: var(--ref-neutral-60);
    }

    .control:hover {
        border-color: var(--outline);
    }

    .control:focus-visible {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 calc(var(--_base) * 0.5) var(--ring);
    }

    .invalid {
        border-color: var(--error);
    }

    .invalid:focus-visible {
        box-shadow: 0 0 0 calc(var(--_base) * 0.5)
            color-mix(in oklab, var(--error) 35%, transparent);
    }

    .control:disabled {
        opacity: var(--state-disabled-opacity);
        cursor: not-allowed;
    }

    .control:disabled:hover {
        border-color: var(--outline-variant);
    }
`;
