import { css } from 'lit';

/* PasswordInput — the eye toggle that swaps the field's type, drawn in the
   trailing position of Input's box. The box, label and message around it are
   Input's. Ported from src/components/styled/passwordInput.styled.css. */
export const styles = css`
    .toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 0;
        padding: 0;
        margin: 0;
        color: var(--on-surface-variant);
        cursor: default;
        border-radius: var(--corner-full);
        transition:
            color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .toggle:hover:not(:disabled) {
        color: var(--on-background);
    }

    .toggle:focus-visible {
        outline: none;
        box-shadow: 0 0 0 calc(var(--_base) * 0.375) var(--ring);
    }

    .toggle:disabled {
        cursor: not-allowed;
    }

    .toggle svg {
        width: calc(var(--_base) * 2);
        height: calc(var(--_base) * 2);
    }
`;
