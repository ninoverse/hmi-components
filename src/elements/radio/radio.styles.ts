import { css } from 'lit';

/* Radio — a circular box with a dot that scales in on select. The shell, the
   clipped input and the disabled state come from the shared checkable styles.
   Ported from src/components/styled/radio.styled.css. */
export const styles = css`
    .box {
        position: relative;
        width: calc(var(--_base) * 2.5);
        height: calc(var(--_base) * 2.5);
        flex: none;
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.25) solid var(--outline);
        border-radius: 50%;
        transition:
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .box::after {
        content: '';
        position: absolute;
        inset: calc(var(--_base) * 0.5);
        border-radius: 50%;
        background: var(--primary);
        transform: scale(0);
        transition: transform var(--duration-short-3) var(--easing-spring);
    }

    .base:hover .box {
        border-color: var(--primary);
    }

    .input:checked ~ .box {
        border-color: var(--primary);
    }

    .input:checked ~ .box::after {
        transform: scale(1);
    }

    .input:focus-visible ~ .box {
        box-shadow: 0 0 0 calc(var(--_base) * 0.5) var(--ring);
    }

    .input[aria-invalid='true'] ~ .box {
        border-color: var(--error);
    }

    .disabled:hover .box {
        border-color: var(--outline);
    }
`;
