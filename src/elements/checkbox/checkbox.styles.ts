import { css } from 'lit';

/* Checkbox — a boxed toggle with a check glyph that scales in on check. The
   shell, the clipped input and the disabled state come from the shared
   checkable styles. Ported from src/components/styled/checkbox.styled.css. */
export const styles = css`
    .box {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--_base) * 2.5);
        height: calc(var(--_base) * 2.5);
        flex: none;
        background: var(--surface-container-lowest);
        border: calc(var(--_base) * 0.25) solid var(--outline);
        border-radius: var(--corner-extra-small);
        transition:
            background var(--duration-short-3) var(--easing-standard),
            border-color var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .box svg {
        width: calc(var(--_base) * 1.5);
        height: calc(var(--_base) * 1.5);
        color: var(--on-primary);
        opacity: 0;
        transform: scale(0.6);
        transition:
            opacity var(--duration-short-3) var(--easing-spring),
            transform var(--duration-short-3) var(--easing-spring);
    }

    .base:hover .box {
        border-color: var(--primary);
    }

    .input:checked ~ .box {
        background: var(--primary);
        border-color: var(--primary);
    }

    .input:checked ~ .box svg {
        opacity: 1;
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
