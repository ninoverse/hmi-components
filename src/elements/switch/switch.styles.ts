import { css } from 'lit';

/* Switch — a pill-shaped track with a thumb that slides on toggle. The shell,
   the clipped input and the disabled state come from the shared checkable
   styles. The thumb's shadow is the --switch-thumb-shadow token, so the journal
   structure needs no selector here. Ported from
   src/components/styled/switch.styled.css. */
export const styles = css`
    .track {
        position: relative;
        width: calc(var(--_base) * 4.5);
        height: calc(var(--_base) * 2.75);
        flex: none;
        background: var(--outline);
        border-radius: var(--corner-full);
        transition:
            background var(--duration-short-3) var(--easing-standard),
            box-shadow var(--duration-short-3) var(--easing-standard);
    }

    .thumb {
        position: absolute;
        top: calc(var(--_base) * 0.25);
        left: calc(var(--_base) * 0.25);
        width: calc(var(--_base) * 2.25);
        height: calc(var(--_base) * 2.25);
        background: var(--surface-container-lowest);
        border-radius: var(--corner-full);
        box-shadow: var(--switch-thumb-shadow);
        transition:
            left var(--duration-short-3) var(--easing-spring),
            width var(--duration-short-1) var(--easing-standard);
    }

    .input:checked ~ .track {
        background: var(--primary);
    }

    .input:checked ~ .track .thumb {
        left: calc(var(--_base) * 2);
    }

    .base:active .thumb {
        width: calc(var(--_base) * 2.75);
    }

    .base:active .input:checked ~ .track .thumb {
        left: calc(var(--_base) * 1.5);
    }

    .input:focus-visible ~ .track {
        box-shadow: 0 0 0 calc(var(--_base) * 0.5) var(--ring);
    }

    .input[aria-invalid='true'] ~ .track {
        background: var(--error);
    }
`;
