import { css } from 'lit';

/* Spinner — a thin ring with one solid arc, spun by CSS animation. The ring
   is role="status" so assistive tech announces it as loading; the visual
   itself is just a styled border, tinted from currentColor, which inherits
   through the shadow boundary. Ported 1:1 from
   src/components/styled/spinner.styled.css. */
export const styles = css`
    :host {
        display: inline-block;
    }

    .base {
        display: inline-block;
        width: calc(var(--_base) * 2.5);
        height: calc(var(--_base) * 2.5);
        border-radius: 50%;
        border: calc(var(--_base) * 0.375) solid
            color-mix(in oklab, currentColor 18%, transparent);
        border-top-color: currentColor;
        animation: spinner-rotate 800ms linear infinite;
    }

    :host([size='small']) .base {
        width: calc(var(--_base) * 1.75);
        height: calc(var(--_base) * 1.75);
        border-width: calc(var(--_base) * 0.25);
    }

    :host([size='large']) .base {
        width: calc(var(--_base) * 4);
        height: calc(var(--_base) * 4);
        border-width: calc(var(--_base) * 0.5);
    }

    @keyframes spinner-rotate {
        to {
            transform: rotate(360deg);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .base {
            animation-duration: 2400ms;
        }
    }
`;
